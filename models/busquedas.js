const fs = require('fs');
const axios = require('axios');

class Busquedas{

    historial = [];
    dbPath = './db/database.json';
    
    constructor(){
        this.leerDB();

    }

    get historialCapitalizado(){
        return this.historial.map(lugar => {
            let palabras = lugar.split(' ');
            palabras = palabras.map(p => p[0].toUpperCase() + p.substring(1));

            return palabras.join(' ');
        });
    }
    
    get paramsMapbox(){
        return {
            'access_token': process.env.MAPBOX_kEY,
            
            'limit': 5,
            'language': 'es'
        }
    }
    get paramsWeather(){
        return{
            'appid': process.env.OPENWEATHER_KEY,
            'units': 'metric',
            'lang': 'es'
        }
    }
    async ciudad(lugar = ''){
        try{
            // peticion HTTP
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapbox
            });
            const resp = await instance.get();
            
            return resp.data.features.map(lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1],

            }));

        } catch(error){
            return [];
        }

    }
    async climaPorLugar(lat, lon){
        try{
            // intancia
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}`,
                params: this.paramsWeather
            });
            const resp = await instance.get();
            
            const {main, weather} = resp.data;
            return {
                desc: weather[0].description,
                temp: main.temp,
                temp_min: main.temp_min,
                temp_max: main.temp_max
            }
 

        } catch(error){
            console.log(error);
        }
    }

    agregarHistorial(lugar){
        if(this.historial.includes(lugar.toLocaleLowerCase()) ){
            return;
        } 
        this.historial = this.historial.splice(0, 5);       
        this.historial.unshift(lugar.toLocaleLowerCase());
        // Grabar en DB
        this.guardarDB();
    }

    guardarDB(){
        const payload = {
            historial: this.historial
        }
        fs.writeFileSync(this.dbPath, JSON.stringify(payload));
    }

    leerDB(){
        if(!fs.existsSync(this.dbPath)) return;
        const data = JSON.parse(fs.readFileSync(this.dbPath, 'utf-8'));
        this.historial = data.historial;
    }
}



module.exports = Busquedas;