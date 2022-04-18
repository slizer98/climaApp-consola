const axios = require('axios');

class Busquedas{
    constructor(){
        // TODO: leer DB si existe

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
            const {main, weather, name} = resp.data;
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
}



module.exports = Busquedas;