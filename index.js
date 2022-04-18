require('dotenv').config();
require('colors');

const {leerInput, inquirerMenu, pausa, listarLugares} = require('./helpers/inquirer');
const Busquedas = require('./models/busquedas');

const main = async() => {

    const busquedas = new Busquedas();

    
    let opt;
    do{
        // moatrar menu
        opt = await inquirerMenu();
        // procesar opcion
        switch(opt){
            case 1:
                // mostrar mensaje
                const termino = await leerInput('Ingrese una ciudad: ');

                // Buscar lugares
                const lugares = await busquedas.ciudad(termino);
                
                // Seleccionar el lugar
                const id = await listarLugares(lugares);
                const lugarSel = lugares.find(lugar => lugar.id === id);
                
                // clima
                const temperatura = await busquedas.climaPorLugar(lugarSel.lat, lugarSel.lng);

                // Mostrar resultados
                const {nombre, lat, lng} = lugarSel;
                const {desc, temp, temp_min, temp_max} = temperatura;
                // convertir temperatura a enteros  
                const temp_min_int = Math.ceil(parseInt(temp_min));
                const temp_max_int = Math.ceil(parseInt(temp_max));
                const temp_int = Math.ceil(parseInt(temp));

                console.log('\ninformacion del lugar\n'.green);
                console.log('Ciudad:', nombre.green);
                console.log('Lat:', String(lat).green);
                console.log('Lng:', String(lng).green);
                console.log(`El clima estara: ${desc.green}`);
                console.log(`Temperatura: ${String(temp_int).green}${'°C'.green}`);
                console.log(`Maxima: ${String(temp_max_int).green}${'°C'.green}`);
                console.log(`Minima: ${String(temp_min_int).green}${'°C'.green}`);

                
                break;
            case 2:
                console.log('historial');
                break;
            case 0:
                console.log('salir');
                break;
        }
        await pausa();
  

    }while(opt !== 0);
}

main();
