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
        "parameters_watched":changedParameters  Ej: ['chess_blitz,records,win', 'elo','puzzle_challenge,record']                                     
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
    console.log(req)
    console.log(req.body.id_sensor_endpoint)
    console.log(req.body.parameters_watched)
    console.log(req.params.id_sensor_endpoint)
    console.log(req.params.parameters_watched)
    var id_sensor_endpoint = req.body.id_sensor_endpoint;
    var parameters_watched = req.body.parameters_watched;
    if(req.body.id_sensor_endpoint === undefined || req.body.id_sensor_endpoint === null){
        id_sensor_endpoint = req.params.id_sensor_endpoint;
        parameters_watched = req.params.parameters_watched;
    }

    var stringAux = ""
    var acum = ""
    var formatted = []
    for (const parameter of parameters_watched) {
        //Array: ['finished','win']
        for (let index = 0; index < parameter.length-1; index++) {
            acum += parameter[index]+",";
        }
        acum += parameter[parameter.length-1];
        formatted.push(acum)
        acum = ''        
    }

    for (let index = 0; index < formatted.length-1; index++) {
        stringAux += '\''+formatted[index]+'\''+",";
    }
    stringAux += '\''+formatted[formatted.length-1]+'\'';

    console.log('Este es el resultado')
    console.log(stringAux)

    var select = 'SELECT `subattributes_conversion_sensor_endpoint`.`id_conversion`, `subattributes_conversion_sensor_endpoint`.`id_subattributes`, `conversion`.`operations` '
    var from = 'FROM `conversion` '
    var join = 'JOIN `subattributes_conversion_sensor_endpoint` ON `conversion`.`id_conversion` = `subattributes_conversion_sensor_endpoint`.`id_conversion`'
    var where = 'WHERE `subattributes_conversion_sensor_endpoint`.`id_sensor_endpoint` = ? AND `subattributes_conversion_sensor_endpoint`.`parameters_watched` IN ('+stringAux+')' 
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

router.get('/conversion_spend_attribute',(req,res,next)=>{
    console.log(req)
    console.log(req.body.id_videogame)
    console.log(req.body.id_modifiable_mechanic)
    var id_videogame = req.body.id_videogame;
    var id_modifiable_mechanic = req.body.id_modifiable_mechanic;
    if(id_videogame === undefined || id_modifiable_mechanic === undefined){
        res.status(400).json({"message": "Body lacks information"} )
    }
    var select = 'SELECT `modifiable_conversion_attribute`.`id_conversion`, `modifiable_conversion_attribute`.`id_attributes`, `conversion`.`operations` '
    var from = 'FROM `videogame` '
    var join = 'JOIN `modifiable_mechanic_videogame` ON `videogame`.`id_videogame` = `modifiable_mechanic_videogame`.`id_videogame`  JOIN `modifiable_mechanic` ON `modifiable_mechanic`.`id_modifiable_mechanic` = `modifiable_mechanic_videogame`.`id_modifiable_mechanic` '
    var join2 = 'JOIN `modifiable_conversion_attribute` ON `modifiable_conversion_attribute`.`id_modifiable_mechanic` = `modifiable_mechanic`.`id_modifiable_mechanic` JOIN `attributes` ON `attributes`.`id_attributes` = `modifiable_conversion_attribute`.`id_attributes` '
    var join3 = 'JOIN `conversion` ON `conversion`.`id_conversion` = `modifiable_conversion_attribute`.`id_conversion` '

    var where = 'WHERE `videogame`.`id_videogame` = ? AND `modifiable_mechanic_videogame`.`id_videogame` = ? ' 
    var and = 'AND `modifiable_mechanic`.`id_modifiable_mechanic` = ? AND `modifiable_conversion_attribute`.`id_modifiable_mechanic` = ?' 
    var query = select+from+join+join2+join3+and+where
    mysqlConnection.query(query,[id_videogame,id_videogame,id_modifiable_mechanic,id_modifiable_mechanic], function(err,rows,fields){
        if (!err){
            res.status(200).json({"id_conversion": rows.id_conversion, "id_attributes": rows.id_attributes, "operations": rows.operations} )
        } else {
            console.log(err);
        }
    });
})



module.exports = router;

