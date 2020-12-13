const express = require('express');
const router = express.Router();

var http = require('http');

const fetch = require('node-fetch');
var common = require('./extras');
const mysqlConnection = require('../database');

//CRUD de sensor_endpoints 


//2) Obtener TODOS las conversiones relacionados a un sensor_endpoint y los parametros que cambiaron
/*

   var dataChanges ={  
        "id_sensor_endpoint": id_sensor_endpoint, Ej: 5
        "watch_parameters":changedParameters  Ej: ['chess_blitz,records,win', 'elo','puzzle_challenge,record']                                     
    }
    SELECT
    `conversion`.`id_conversion`,
    `conversion`.`id_subattributes`,
    `conversion`.`operations`
FROM
    `conversion`
JOIN `conversion_sensor_endpoint` ON `conversion`.`id_conversion` = `conversion_sensor_endpoint`.`id_conversion`
WHERE
    `conversion_sensor_endpoint`.`id_sensor_endpoint` = 2 AND `conversion`.`parameters_watched` IN ('followers')

*/
router.get('/conversions',(req,res,next)=>{
    
    console.log(req.body.id_sensor_endpoint)
    console.log(req.body.watch_parameters)
    console.log(req.params.id_sensor_endpoint)
    console.log(req.params.watch_parameters)
    var id_sensor_endpoint = req.body.id_sensor_endpoint;
    var watch_parameters = req.body.watch_parameters;
    if(req.body.id_sensor_endpoint === undefined || req.body.id_sensor_endpoint === null){
        id_sensor_endpoint = req.params.id_sensor_endpoint;
        watch_parameters = req.params.watch_parameters;
    }

    var stringAux = ""

    for (let index = 0; index < watch_parameters.length-1; index++) {
        stringAux += '\''+watch_parameters[index]+'\''+",";
    }
    stringAux += '\''+watch_parameters[watch_parameters.length-1]+'\'';

    var select = 'SELECT `conversion`.`id_conversion`, `conversion`.`id_subattributes`, `conversion`.`operations` '
    var from = 'FROM `conversion` '
    var join = 'JOIN `conversion_sensor_endpoint` ON `conversion`.`id_conversion` = `conversion_sensor_endpoint`.`id_conversion`'
    var where = 'WHERE `conversion_sensor_endpoint`.`id_sensor_endpoint` = ? AND `conversion`.`parameters_watched` IN ('+stringAux+')' 
    var query = select+from+join+where
    mysqlConnection.query(query,[id_sensor_endpoint], function(err,rows,fields){
        if (!err){
            var id_conversions = []
            var id_subattributes = []
            var operations = []
            rows.forEach(result => {
                id_conversions.push(result.id_conversion)
                id_subattributes.push(result.id_subattributes)
                operations.push(result.operations)                
            });

            console.log(rows);
            res.status(200).json({"id_conversions": id_conversions, "id_subattributes": id_subattributes, "operations": operations} )
        } else {
            console.log(err);
        }
    });
})





module.exports = router;

