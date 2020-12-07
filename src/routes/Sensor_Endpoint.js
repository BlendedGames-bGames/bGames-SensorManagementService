const express = require('express');
const router = express.Router();

var http = require('http');

const fetch = require('node-fetch');
var common = require('./extras');
const mysqlConnection = require('../database');

/* Ejemplo de Json del online sensor
    {
        "id_online_sensor": 2,
        "name": "Chess.com Public api",
        "description": "Public API of the chess website chess.com",
        "base_url": "https://api.chess.com/pub/",
        "intiated_date": "2019-05-16 13:17:17" //Cuando se creo
    }
*/
/* Ejemplo de Json del sensor_endpoint
    {
        "id_online_sensor": 2,
        "name": "Instagram",
        "description": "General instagram api",
        "base_url": "graph.instagram.com",
        "intiated_date": "2019-05-16 13:17:17" //Cuando se creo
    }
*/

/* 
CRUD de sensor_endpoints 
*/

/*
RETRIEVE ONLINE_SENSORS:

1) Obtener UN sensor_endpoint en particular relacionado a un player y online_sensor

2) Obtener TODOS los sensor_endpoint (activated y desactivated) relacionados a un player y online_sensor

3) Obtener TODOS los sensor_endpoint (activated) relacionados a un player y online_sensor

4) Obtener TODOS los sensor_endpoint (desactivated) relacionados a un player y online_sensor

5) Obtener TODOS los sensor_endpoint de un player en particular (activated y deactivated)(tomando en cuenta todos los online_sensor que tiene)

6) Obtener TODOS los sensor_endpoint de un player en particular (activated)(tomando en cuenta todos los online_sensor que tiene)

7) Obtener TODOS los sensor_endpoint de un player en particular (deactivated)(tomando en cuenta todos los online_sensor que tiene)

8) Obtener TODOS los sensor_endpoint relacionados a un online_sensor (activated y deactivated)(sin importar de que players son)

9) Obtener TODOS los sensor_endpoint relacionados a un online_sensor (activated )(sin importar de que players son)

10) Obtener TODOS los sensor_endpoint relacionados a un online_sensor (deactivated)(sin importar de que players son)

11) Obtener TODOS los sensor_endpoints (activated y deactivated) de TODOS los players

12) Obtener TODOS los sensor_endpoints (activated) de TODOS los players

13) Obtener TODOS los sensor_endpoints (deactivated) de TODOS los players

*/

/* WORKS 
SELECT DISTINCT
    `playerss`.`id_players`,
    `online_sensor`.`id_online_sensor`,
    `sensor_endpoint`.`id_sensor_endpoint`,
    `playerss_online_sensor`.`tokens`,
    `online_sensor`.`name`,
    `online_sensor`.`description`, 
    `online_sensor`.`base_url`,
    `online_sensor`.`initiated_date`,
    `online_sensor`.`last_modified`,
    `sensor_endpoint`.`name`,
    `sensor_endpoint`.`description`,
    `sensor_endpoint`.`url_endpoint`,
    `sensor_endpoint`.`token_parameters`,
    `sensor_endpoint`.`specific_parameters`,
    `sensor_endpoint`.`watch_parameters`,
    `sensor_endpoint`.`activated`,
    `sensor_endpoint`.`schedule_time`,
    `sensor_endpoint`.`initiated_date`,
    `sensor_endpoint`.`last_modified`

FROM
    `playerss`
JOIN `playerss_online_sensor` ON `playerss`.`id_players` = `playerss_online_sensor`.`id_players`
JOIN `online_sensor` ON `online_sensor`.`id_online_sensor` = `playerss_online_sensor`.`id_online_sensor`
JOIN `sensor_endpoint` ON `sensor_endpoint`.`sensor_endpoint_id_online_sensor` = `online_sensor`.`id_online_sensor`
WHERE
    `playerss`.`id_players` IN(1, 2, 3, 4, 5, 6)  
ORDER BY `playerss`.`id_players` ASC


*/
//1) Obtener UN sensor_endpoint en particular relacionado a un player y online_sensor

/*
SELECT 
    `playerss`.`id_players`,
    `online_sensor`.`id_online_sensor`,
    `sensor_endpoint`.`id_sensor_endpoint`,
    `playerss_online_sensor`.`tokens`,
    `online_sensor`.`name`,
    `online_sensor`.`description`,
    `online_sensor`.`base_url`,
    `online_sensor`.`initiated_date`,
    `online_sensor`.`last_modified`,
    `sensor_endpoint`.`name`,
    `sensor_endpoint`.`description`,
    `sensor_endpoint`.`url_endpoint`,
    `sensor_endpoint`.`token_parameters`,
    `sensor_endpoint`.`specific_parameters`,
    `sensor_endpoint`.`watch_parameters`,
    `sensor_endpoint`.`activated`,
    `sensor_endpoint`.`schedule_time`,
    `sensor_endpoint`.`initiated_date`,
    `sensor_endpoint`.`last_modified`
FROM
    `playerss`
JOIN `playerss_online_sensor` ON `playerss`.`id_players` = `playerss_online_sensor`.`id_players`
JOIN `online_sensor` ON `online_sensor`.`id_online_sensor` = `playerss_online_sensor`.`id_online_sensor`
JOIN `sensor_endpoint` ON `sensor_endpoint`.`sensor_endpoint_id_online_sensor` = `online_sensor`.`id_online_sensor`
WHERE
     `playerss`.`id_players` = 1 AND `sensor_endpoint`.`sensor_endpoint_id_online_sensor` = 1  AND `sensor_endpoint`.`id_players` = 1 AND `sensor_endpoint`.`url_endpoint` = "player/{username}/stats"

*/
//1) Obtener UN sensor_endpoint en particular relacionado a un player y online_sensor

//WORKS
router.get('/sensor_endpoint/:id_player/:id_online_sensor',(req,res,next)=>{
    var id_player = req.params.id_player;
    var id_online_sensor = req.params.id_online_sensor;
    var url_endpoint = req.body.url_endpoint;

    //id = [1,2,3,4,5,6.... ] Id de cada usuario

    var select = 'SELECT DISTINCT `playerss`.`id_players`, `online_sensor`.`id_online_sensor`, `sensor_endpoint`.`id_sensor_endpoint`, `playerss_online_sensor`.`tokens`, `online_sensor`.`name`, `online_sensor`.`description`, `online_sensor`.`base_url`, `online_sensor`.`initiated_date`, `online_sensor`.`last_modified`, `sensor_endpoint`.`name`, `sensor_endpoint`.`description`, `sensor_endpoint`.`url_endpoint`, `sensor_endpoint`.`token_parameters`, `sensor_endpoint`.`specific_parameters`, `sensor_endpoint`.`watch_parameters`, `sensor_endpoint`.`activated`, `sensor_endpoint`.`schedule_time`, `sensor_endpoint`.`initiated_date`, `sensor_endpoint`.`last_modified`'
    var from = 'FROM `playerss` '
    var join = 'JOIN `playerss_online_sensor` ON `playerss`.`id_players` = `playerss_online_sensor`.`id_players`     JOIN `online_sensor` ON `online_sensor`.`id_online_sensor` = `playerss_online_sensor`.`id_online_sensor` JOIN `sensor_endpoint` ON `sensor_endpoint`.`sensor_endpoint_id_online_sensor` = `online_sensor`.`id_online_sensor` '
    var where = 'WHERE `playerss`.`id_players` = ? ' 
    var and = 'AND `sensor_endpoint`.`sensor_endpoint_id_online_sensor` = ?  AND `sensor_endpoint`.`id_players` = ? AND `sensor_endpoint`.`url_endpoint` = ?'
    var query = select+from+join+where
    mysqlConnection.query(query,[id_player,id_online_sensor,id_player,url_endpoint], function(err,rows,fields){
        if (!err){
            console.log(rows);
            res.status(200).json({sensor_endpoints: rows})
        } else {
            console.log(err);
        }
    });
})

//2) Obtener TODOS los sensor_endpoint (activated y desactivated) relacionados a un player y online_sensor
//WORKS
router.get('/sensor_endpoint/all/:id_player/:id_online_sensor',(req,res,next)=>{
    var id_player = req.params.id_player;
    var id_online_sensor = req.params.id_online_sensor;

    var select = 'SELECT DISTINCT `playerss`.`id_players`, `online_sensor`.`id_online_sensor`,`sensor_endpoint`.`id_sensor_endpoint`, `playerss_online_sensor`.`tokens`, `online_sensor`.`name`,`online_sensor`.`description`,`online_sensor`.`base_url`, `sensor_endpoint`.`url_endpoint`, `sensor_endpoint`.`token_parameters`, `sensor_endpoint`.`specific_parameters`, `sensor_endpoint`.`watch_parameters`,`sensor_endpoint`.`schedule_time`,`sensor_endpoint`.`initiated_date` ,`sensor_endpoint`.`last_modified`  '
    var from = 'FROM `playerss` '
    var join = 'JOIN `playerss_online_sensor` ON `playerss`.`id_players` = `playerss_online_sensor`.`id_players` JOIN `online_sensor` ON `online_sensor`.`id_online_sensor` = `playerss_online_sensor`.`id_online_sensor` JOIN `sensor_endpoint` ON `sensor_endpoint`.`sensor_endpoint_id_online_sensor` = `online_sensor`.`id_online_sensor` '
    var where = 'WHERE `playerss`.`id_players` = ? AND `sensor_endpoint`.`id_players` = ? AND `sensor_endpoint`.`sensor_endpoint_id_online_sensor` = ?  ' 
    var query = select+from+join+where+and
    mysqlConnection.query(query,[id_player,id_online_sensor,id_player], function(err,rows,fields){
        if (!err){
            console.log(rows);
            res.status(200).json({sensor_endpoints: rows})
        } else {
            console.log(err);
        }
    });
})

//3) Obtener TODOS los sensor_endpoint (activated) relacionados a un player y online_sensor
//WORKS

router.get('/sensor_endpoint/activated/:id_player/:id_online_sensor',(req,res,next)=>{
    var id_player = req.params.id_player;
    var id_online_sensor = req.params.id_online_sensor;

    var select = 'SELECT DISTINCT `playerss`.`id_players`, `online_sensor`.`id_online_sensor`,`sensor_endpoint`.`id_sensor_endpoint`, `playerss_online_sensor`.`tokens`, `online_sensor`.`name`,`online_sensor`.`description`,`online_sensor`.`base_url`, `sensor_endpoint`.`url_endpoint`, `sensor_endpoint`.`token_parameters`, `sensor_endpoint`.`specific_parameters`, `sensor_endpoint`.`watch_parameters`,`sensor_endpoint`.`schedule_time`,`sensor_endpoint`.`initiated_date` ,`sensor_endpoint`.`last_modified`  '
    var from = 'FROM `playerss` '
    var join = 'JOIN `playerss_online_sensor` ON `playerss`.`id_players` = `playerss_online_sensor`.`id_players` JOIN `online_sensor` ON `online_sensor`.`id_online_sensor` = `playerss_online_sensor`.`id_online_sensor` JOIN `sensor_endpoint` ON `sensor_endpoint`.`sensor_endpoint_id_online_sensor` = `online_sensor`.`id_online_sensor` '
    var where = 'WHERE `playerss`.`id_players` = ? AND `sensor_endpoint`.`id_players` = ?' 
    var and = 'AND `sensor_endpoint`.`sensor_endpoint_id_online_sensor` = ?  AND sensor_endpoint`.`activated` = 1'
    var query = select+from+join+where+and
    mysqlConnection.query(query,[id_player,id_online_sensor], function(err,rows,fields){
        if (!err){
            console.log(rows);
            res.status(200).json({sensor_endpoints: rows})
        } else {
            console.log(err);
        }
    });
})

//4) Obtener TODOS los sensor_endpoint (desactivated) relacionados a un player y online_sensor
//WORKS

router.get('/sensor_endpoint/deactivated/:id_player/:id_online_sensor',(req,res,next)=>{
    var id_player = req.params.id_player;
    var id_online_sensor = req.params.id_online_sensor;

    var select = 'SELECT DISTINCT `playerss`.`id_players`, `online_sensor`.`id_online_sensor`,`sensor_endpoint`.`id_sensor_endpoint`, `playerss_online_sensor`.`tokens`, `online_sensor`.`name`,`online_sensor`.`description`,`online_sensor`.`base_url`, `sensor_endpoint`.`url_endpoint`, `sensor_endpoint`.`token_parameters`, `sensor_endpoint`.`specific_parameters`, `sensor_endpoint`.`watch_parameters`,`sensor_endpoint`.`schedule_time`,`sensor_endpoint`.`initiated_date` ,`sensor_endpoint`.`last_modified`  '
    var from = 'FROM `playerss` '
    var join = 'JOIN `playerss_online_sensor` ON `playerss`.`id_players` = `playerss_online_sensor`.`id_players` JOIN `online_sensor` ON `online_sensor`.`id_online_sensor` = `playerss_online_sensor`.`id_online_sensor` JOIN `sensor_endpoint` ON `sensor_endpoint`.`sensor_endpoint_id_online_sensor` = `online_sensor`.`id_online_sensor` '
    var where = 'WHERE `playerss`.`id_players` = ? AND `sensor_endpoint`.`id_players` = ?' 
    var and = 'AND `sensor_endpoint`.`sensor_endpoint_id_online_sensor` = ?  AND sensor_endpoint`.`activated` = 0'
    var query = select+from+join+where+and
    mysqlConnection.query(query,[id_player,id_online_sensor], function(err,rows,fields){
        if (!err){
            console.log(rows);
            res.status(200).json({sensor_endpoints: rows})
        } else {
            console.log(err);
        }
    });
})

//5) Obtener TODOS los sensor_endpoint de un player en particular (activated y deactivated)(tomando en cuenta todos los online_sensor que tiene)

//WORKS

router.get('/sensor_endpoint/all/:id_player',(req,res,next)=>{
    var id_player = req.params.id_player;

    var select = 'SELECT DISTINCT `playerss`.`id_players`, `online_sensor`.`id_online_sensor`, `sensor_endpoint`.`id_sensor_endpoint`, `playerss_online_sensor`.`tokens`, `online_sensor`.`name`, `online_sensor`.`description`, `online_sensor`.`base_url`, `online_sensor`.`initiated_date`, `online_sensor`.`last_modified`, `sensor_endpoint`.`name`, `sensor_endpoint`.`description`, `sensor_endpoint`.`url_endpoint`, `sensor_endpoint`.`token_parameters`, `sensor_endpoint`.`specific_parameters`, `sensor_endpoint`.`watch_parameters`, `sensor_endpoint`.`activated`, `sensor_endpoint`.`schedule_time`, `sensor_endpoint`.`initiated_date`, `sensor_endpoint`.`last_modified`'
    var from = 'FROM `playerss` '
    var join = 'JOIN `playerss_online_sensor` ON `playerss`.`id_players` = `playerss_online_sensor`.`id_players` JOIN `online_sensor` ON `online_sensor`.`id_online_sensor` = `playerss_online_sensor`.`id_online_sensor` JOIN `sensor_endpoint` ON `sensor_endpoint`.`sensor_endpoint_id_online_sensor` = `online_sensor`.`id_online_sensor` '
    var where = 'WHERE `playerss`.`id_players` = ?' 
    var and = ' AND `sensor_endpoint`.`id_players` = ?'
    var query = select+from+join+where+and
    mysqlConnection.query(query,[id_player,id_player], function(err,rows,fields){
        if (!err){
            console.log(rows);
            res.status(200).json({sensor_endpoints: rows})
        } else {
            console.log(err);
        }
    });
})
//6) Obtener TODOS los sensor_endpoint de un player en particular (activated)(tomando en cuenta todos los online_sensor que tiene)

//WORKS
router.get('/sensor_endpoint/activated/:id_player',(req,res,next)=>{
    var id_player = req.params.id_player;

    var select = 'SELECT DISTINCT `playerss`.`id_players`, `online_sensor`.`id_online_sensor`, `sensor_endpoint`.`id_sensor_endpoint`, `playerss_online_sensor`.`tokens`, `online_sensor`.`name`, `online_sensor`.`description`, `online_sensor`.`base_url`, `online_sensor`.`initiated_date`, `online_sensor`.`last_modified`, `sensor_endpoint`.`name`, `sensor_endpoint`.`description`, `sensor_endpoint`.`url_endpoint`, `sensor_endpoint`.`token_parameters`, `sensor_endpoint`.`specific_parameters`, `sensor_endpoint`.`watch_parameters`, `sensor_endpoint`.`activated`, `sensor_endpoint`.`schedule_time`, `sensor_endpoint`.`initiated_date`, `sensor_endpoint`.`last_modified`'
    var from = 'FROM `playerss` '
    var join = 'JOIN `playerss_online_sensor` ON `playerss`.`id_players` = `playerss_online_sensor`.`id_players` JOIN `online_sensor` ON `online_sensor`.`id_online_sensor` = `playerss_online_sensor`.`id_online_sensor` JOIN `sensor_endpoint` ON `sensor_endpoint`.`sensor_endpoint_id_online_sensor` = `online_sensor`.`id_online_sensor` '
    var where = 'WHERE `playerss`.`id_players` = ?' 
    var and = ' AND `sensor_endpoint`.`id_players` = ? AND `sensor_endpoint`.`activated` = 1'
    var query = select+from+join+where+and
    mysqlConnection.query(query,[id_player,id_online_sensor], function(err,rows,fields){
        if (!err){
            console.log(rows);
            res.status(200).json({sensor_endpoints: rows})
        } else {
            console.log(err);
        }
    });
})
//7) Obtener TODOS los sensor_endpoint de un player en particular (deactivated)(tomando en cuenta todos los online_sensor que tiene)

//WORKS
router.get('/sensor_endpoint/deactivated/:id_player',(req,res,next)=>{
    var id_player = req.params.id_player;

    var select = 'SELECT DISTINCT `playerss`.`id_players`, `online_sensor`.`id_online_sensor`,`sensor_endpoint`.`id_sensor_endpoint`, `playerss_online_sensor`.`tokens`, `online_sensor`.`name`,`online_sensor`.`description`,`online_sensor`.`base_url`, `sensor_endpoint`.`url_endpoint`, `sensor_endpoint`.`token_parameters`, `sensor_endpoint`.`specific_parameters`, `sensor_endpoint`.`watch_parameters`,`sensor_endpoint`.`schedule_time`,`sensor_endpoint`.`initiated_date` ,`sensor_endpoint`.`last_modified`  '
    var from = 'FROM `playerss` '
    var join = 'JOIN `playerss_online_sensor` ON `playerss`.`id_players` = `playerss_online_sensor`.`id_players` JOIN `online_sensor` ON `online_sensor`.`id_online_sensor` = `playerss_online_sensor`.`id_online_sensor` JOIN `sensor_endpoint` ON `sensor_endpoint`.`sensor_endpoint_id_online_sensor` = `online_sensor`.`id_online_sensor` '
    var where = 'WHERE `playerss`.`id_players` = ?' 
    var and = ' AND `sensor_endpoint`.`id_players` = ? AND `sensor_endpoint`.`activated` = 0'
    var query = select+from+join+where+and
    mysqlConnection.query(query,[id_player,id_online_sensor], function(err,rows,fields){
        if (!err){
            console.log(rows);
            res.status(200).json({sensor_endpoints: rows})
        } else {
            console.log(err);
        }
    });
})

//8) Obtener TODOS los sensor_endpoint relacionados a un online_sensor (activated y deactivated)(sin importar de que players son)
//WORKS
router.get('/online_sensor/:id_online_sensor/sensor_endpoint/all',(req,res,next)=>{
    var id_online_sensor = req.params.id_online_sensor;

    var select = 'SELECT `sensor_endpoint`.`id_players`, `sensor_endpoint`.`sensor_endpoint_id_online_sensor`, `sensor_endpoint`.`id_sensor_endpoint`, `sensor_endpoint`.`name`, `sensor_endpoint`.`description`, `sensor_endpoint`.`url_endpoint`, `sensor_endpoint`.`token_parameters`, `sensor_endpoint`.`specific_parameters`, `sensor_endpoint`.`watch_parameters`, `sensor_endpoint`.`activated`, `sensor_endpoint`.`schedule_time`, `sensor_endpoint`.`initiated_date`, `sensor_endpoint`.`last_modified`'
    var from = 'FROM `sensor_endpoint` '
    var where = 'WHERE `sensor_endpoint`.`sensor_endpoint_id_online_sensor` = ?' 

    var query = select+from+where
    mysqlConnection.query(query,[id_online_sensor], function(err,rows,fields){
        if (!err){
            console.log(rows);
            res.status(200).json({sensor_endpoints: rows})
        } else {
            console.log(err);
        }
    });
})
//9) Obtener TODOS los sensor_endpoint relacionados a un online_sensor (activated)(sin importar de que players son)
//WORKS
router.get('/online_sensor/:id_online_sensor/sensor_endpoint/activated',(req,res,next)=>{
    var id_online_sensor = req.params.id_online_sensor;

    var select = 'SELECT `sensor_endpoint`.`id_players`, `sensor_endpoint`.`sensor_endpoint_id_online_sensor`, `sensor_endpoint`.`id_sensor_endpoint`, `sensor_endpoint`.`name`, `sensor_endpoint`.`description`, `sensor_endpoint`.`url_endpoint`, `sensor_endpoint`.`token_parameters`, `sensor_endpoint`.`specific_parameters`, `sensor_endpoint`.`watch_parameters`, `sensor_endpoint`.`activated`, `sensor_endpoint`.`schedule_time`, `sensor_endpoint`.`initiated_date`, `sensor_endpoint`.`last_modified`'
    var from = 'FROM `sensor_endpoint` '
    var where = 'WHERE `sensor_endpoint`.`sensor_endpoint_id_online_sensor` = ?' 
    var and = 'AND `sensor_endpoint`.`activated` = 1'
    
    var query = select+from+where+and
    mysqlConnection.query(query,[id_online_sensor], function(err,rows,fields){
        if (!err){
            console.log(rows);
            res.status(200).json({sensor_endpoints: rows})
        } else {
            console.log(err);
        }
    });
})
//10) Obtener TODOS los sensor_endpoint relacionados a un online_sensor (deactivated)(sin importar de que players son)
//WORKS
router.get('/online_sensor/:id_online_sensor/sensor_endpoint/deactivated',(req,res,next)=>{
    var id_online_sensor = req.params.id_online_sensor;

    var select = 'SELECT `sensor_endpoint`.`id_players`, `sensor_endpoint`.`sensor_endpoint_id_online_sensor`, `sensor_endpoint`.`id_sensor_endpoint`, `sensor_endpoint`.`name`, `sensor_endpoint`.`description`, `sensor_endpoint`.`url_endpoint`, `sensor_endpoint`.`token_parameters`, `sensor_endpoint`.`specific_parameters`, `sensor_endpoint`.`watch_parameters`, `sensor_endpoint`.`activated`, `sensor_endpoint`.`schedule_time`, `sensor_endpoint`.`initiated_date`, `sensor_endpoint`.`last_modified`'
    var from = 'FROM `sensor_endpoint` '
    var where = 'WHERE `sensor_endpoint`.`sensor_endpoint_id_online_sensor` = ?' 
    var and = 'AND `sensor_endpoint`.`activated` = 0'

    var query = select+from+where+and
    mysqlConnection.query(query,[id_online_sensor], function(err,rows,fields){
        if (!err){
            console.log(rows);
            res.status(200).json({sensor_endpoints: rows})
        } else {
            console.log(err);
        }
    });
})

//11) Obtener TODOS los sensor_endpoints (activated y deactivated) de TODOS los players
/* WORKS */

router.get('/sensor_endpoint/all',(req,res,next)=>{
    var select = 'SELECT DISTINCT `sensor_endpoint`.`id_sensor_endpoint`, `sensor_endpoint`.`id_players`, `sensor_endpoint`.`sensor_endpoint_id_online_sensor`, `playerss_online_sensor`.`tokens`, `online_sensor`.`name`, `online_sensor`.`description`, `online_sensor`.`base_url`, `online_sensor`.`initiated_date`, `online_sensor`.`last_modified`, `sensor_endpoint`.`name`, `sensor_endpoint`.`description`, `sensor_endpoint`.`url_endpoint`, `sensor_endpoint`.`token_parameters`, `sensor_endpoint`.`specific_parameters`, `sensor_endpoint`.`watch_parameters`, `sensor_endpoint`.`activated`, `sensor_endpoint`.`schedule_time`, `sensor_endpoint`.`initiated_date`, `sensor_endpoint`.`last_modified`'
    var from = ' FROM `sensor_endpoint` '
    var join = ' JOIN `online_sensor` ON `online_sensor`.`id_online_sensor` = `sensor_endpoint`.`sensor_endpoint_id_online_sensor` JOIN `playerss_online_sensor` ON `sensor_endpoint`.`id_players` = `playerss_online_sensor`.`id_players` AND `sensor_endpoint`.`sensor_endpoint_id_online_sensor` =  `playerss_online_sensor`.`id_online_sensor`'
    
    var query = select+from+join
    mysqlConnection.query(query, function(err,rows,fields){
        if (!err){
            console.log(rows);
            res.status(200).json({sensor_endpoints: rows})
        } else {
            console.log(err);
        }
    });
})

//12) Obtener TODOS los sensor_endpoints (activated) de TODOS los players
/* WORKS */

router.get('/sensor_endpoint/all/activated',(req,res,next)=>{
    var select = 'SELECT DISTINCT `sensor_endpoint`.`id_sensor_endpoint`, `sensor_endpoint`.`id_players`, `sensor_endpoint`.`sensor_endpoint_id_online_sensor`, `playerss_online_sensor`.`tokens`, `online_sensor`.`name`, `online_sensor`.`description`, `online_sensor`.`base_url`, `online_sensor`.`initiated_date`, `online_sensor`.`last_modified`, `sensor_endpoint`.`name`, `sensor_endpoint`.`description`, `sensor_endpoint`.`url_endpoint`, `sensor_endpoint`.`token_parameters`, `sensor_endpoint`.`specific_parameters`, `sensor_endpoint`.`watch_parameters`, `sensor_endpoint`.`activated`, `sensor_endpoint`.`schedule_time`, `sensor_endpoint`.`initiated_date`, `sensor_endpoint`.`last_modified`'
    var from = 'FROM `sensor_endpoint` '
    var join = 'JOIN `online_sensor` ON `online_sensor`.`id_online_sensor` = `sensor_endpoint`.`sensor_endpoint_id_online_sensor` JOIN `playerss_online_sensor` ON `sensor_endpoint`.`id_players` = `playerss_online_sensor`.`id_players` AND `sensor_endpoint`.`sensor_endpoint_id_online_sensor` =  `playerss_online_sensor`.`id_online_sensor`'
    var where = 'WHERE `sensor_endpoint`.`activated` = 1'
    var query = select+from+join+where
    mysqlConnection.query(query, function(err,rows,fields){
        if (!err){
            console.log(rows);
            res.status(200).json({sensor_endpoints: rows})
        } else {
            console.log(err);
        }
    });
})

//13) Obtener TODOS los sensor_endpoints (deactivated) de TODOS los players
/* WORKS */


router.get('/sensor_endpoint/all/deactivated',(req,res,next)=>{
    var select = 'SELECT DISTINCT `sensor_endpoint`.`id_sensor_endpoint`, `sensor_endpoint`.`id_players`, `sensor_endpoint`.`sensor_endpoint_id_online_sensor`, `playerss_online_sensor`.`tokens`, `online_sensor`.`name`, `online_sensor`.`description`, `online_sensor`.`base_url`, `online_sensor`.`initiated_date`, `online_sensor`.`last_modified`, `sensor_endpoint`.`name`, `sensor_endpoint`.`description`, `sensor_endpoint`.`url_endpoint`, `sensor_endpoint`.`token_parameters`, `sensor_endpoint`.`specific_parameters`, `sensor_endpoint`.`watch_parameters`, `sensor_endpoint`.`activated`, `sensor_endpoint`.`schedule_time`, `sensor_endpoint`.`initiated_date`, `sensor_endpoint`.`last_modified`'
    var from = 'FROM `sensor_endpoint` '
    var join = 'JOIN `online_sensor` ON `online_sensor`.`id_online_sensor` = `sensor_endpoint`.`sensor_endpoint_id_online_sensor` JOIN `playerss_online_sensor` ON `sensor_endpoint`.`id_players` = `playerss_online_sensor`.`id_players` AND `sensor_endpoint`.`sensor_endpoint_id_online_sensor` =  `playerss_online_sensor`.`id_online_sensor`'
    var where = 'WHERE `sensor_endpoint`.`activated` = 0'
    var query = select+from+join+where
    mysqlConnection.query(query, function(err,rows,fields){
        if (!err){
            console.log(rows);
            res.status(200).json({sensor_endpoints: rows})
        } else {
            console.log(err);
        }
    });
})


/*
CREATE ENDPOINTS:


1) Crear un sensor_endpoint asociado a un jugador y online_sensor 
    `sensor_endpoint`.`name`,
    `sensor_endpoint`.`description`,
    `sensor_endpoint`.`url_endpoint`,
    `sensor_endpoint`.`token_parameters`,
    `sensor_endpoint`.`specific_parameters`,
    `sensor_endpoint`.`watch_parameters`,
    `sensor_endpoint`.`activated`,
    `sensor_endpoint`.`schedule_time` 

*/

//1)Crea un sensor_endpoint 

router.post('/sensor_endpoint/:id_player/:id_online_sensor',(req,res,next)=>{
    var id_player = req.params.id_player;
    var id_online_sensor = req.params.id_online_sensor;

    var sensor_endpoint_data = req.body


    var insertInto = 'INSERT INTO `sensor_endpoint`'
    var columnValues = '(`sensor_endpoint_id_online_sensor`,`id_players`,`name`,`description`,`url_endpoint`,`token_parameters`, `specific_parameters`,`watch_parameters`, `schedule_time`,  `initiated_date`, `last_modified`)'
    var date = new Date().toISOString().slice(0, 19).replace('T', ' ')
    var newValues = 'VALUES (?,?,?,?,?,?,?,?,?' + date + ',' + date + ')'
    var query = insertInto+columnValues+newValues
    mysqlConnection.query(query,[id_online_sensor,id_player,sensor_endpoint_data.name,sensor_endpoint_data.description,sensor_endpoint_data.url_endpoint,sensor_endpoint_data.token_parameters,sensor_endpoint_data.specific_parameters,sensor_endpoint_data.watch_parameters,sensor_endpoint_data.schedule_time], function(err,rows,fields){
        if (!err){
            console.log(rows);
            res.status(200).json({sensors: rows})
        } else {
            console.log(err);
        }
    });
})

/*
UPDATE ENDPOINTS:

1) Modificar la info del sensor endpoint asociado a un player y un online_sensor

    `sensor_endpoint`.`name`,
    `sensor_endpoint`.`description`,
    `sensor_endpoint`.`url_endpoint`,
    `sensor_endpoint`.`token_parameters`,
    `sensor_endpoint`.`specific_parameters`,
    `sensor_endpoint`.`watch_parameters`,
    `sensor_endpoint`.`activated`,
    `sensor_endpoint`.`schedule_time` 

*/

router.put('/sensor_endpoint/:id_player/:id_online_sensor',(req,res,next)=>{
    var id_player = req.params.id_online_sensor
    var id_online_sensor = req.params.id_online_sensor
    var sensor_endpoint_data = req.body

    var date = new Date().toISOString().slice(0, 19).replace('T', ' ')

    var update = 'UPDATE `sensor_endpoint`'
    var set = ' SET `name` = ?,`description` = ? ,`base_url` = ?, `url_endpoint` = ?, `token_parameters` = ?, `specific_parameters` = ?, `watch_parameters` = ?, `schedule_time` = ?,`last_modified` = ' + date 
    var where = 'WHERE sensor_endpoint.sensor_endpoint_id_online_sensor = ?'
    var and = 'AND sensor_endpoint.id_players = ?'
    var query = update+set+where+and    

    mysqlConnection.query(query,[sensor_endpoint_data.name,sensor_endpoint_data.description,sensor_endpoint_data.url_endpoint,sensor_endpoint_data.token_parameters,sensor_endpoint_data.specific_parameters,sensor_endpoint_data.watch_parameters,sensor_endpoint_data.schedule_time,id_online_sensor, id_player], function(err,rows,fields){
        if (!err){
            console.log(rows);
            res.status(200).json({sensors: rows})
        } else {
            console.log(err);
        }
    });
})

/*
DELETE ENDPOINTS:

1) Borrar el sensor_endpoint 
Causa: No existen repercusiones a otras tablas actualmente
*/

router.delete('/sensor_endpoint/:id_sensor_endpoint',(req,res,next)=>{

    var id_sensor_endpoint = req.params.id_sensor_endpoint


    var deleteD = 'DELETE FROM `sensor_endpoint`'
    var where = 'WHERE `sensor_endpoint`. id_id_sensor_endpoint = ? '
    var query = deleteD+where    

    mysqlConnection.query(query,[id_sensor_endpoint], function(err,rows,fields){
        if (!err){
            console.log(rows);
            res.status(200).json({sensors: rows})
        } else {
            console.log(err);
        }
    });
})






module.exports = router;

