const express = require('express');
const sensor_endpoint = express.Router();

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
    `sensor_endpoint`.`parameters_watched`,
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
    `sensor_endpoint`.`parameters_watched`,
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
sensor_endpoint.get('/sensor_endpoint/:id_player/:id_online_sensor/:id_sensor_endpoint',(req,res,next)=>{
    var id_player = req.params.id_player;
    var id_online_sensor = req.params.id_online_sensor;
    var id_sensor_endpoint = req.params.id_sensor_endpoint;

    var select = 'SELECT DISTINCT `sensor_endpoint`.`id_sensor_endpoint`, `players_sensor_endpoint`.`id_players`, `online_sensor`.`id_online_sensor`, `online_sensor`.`base_url`, `playerss_online_sensor`.`tokens`, `sensor_endpoint`.`url_endpoint`, `sensor_endpoint`.`token_parameters`, `sensor_endpoint`.`specific_parameters` AS `specific_parameters_template`, `sensor_endpoint`.`watch_parameters`, `players_sensor_endpoint`.`specific_parameters`, `players_sensor_endpoint`.`activated`, `players_sensor_endpoint`.`schedule_time`, `sensor_endpoint`.`initiated_date`, `sensor_endpoint`.`last_modified` '
    var from = ' FROM `online_sensor` '
    var join = 'JOIN `sensor_endpoint` ON `online_sensor`.`id_online_sensor` = `sensor_endpoint`.`sensor_endpoint_id_online_sensor` '
    var join2 = 'JOIN `playerss_online_sensor` ON `online_sensor`.`id_online_sensor` = `playerss_online_sensor`.`id_online_sensor` '
    var join3 = 'JOIN `players_sensor_endpoint` ON `sensor_endpoint`.`id_sensor_endpoint` = `players_sensor_endpoint`.`id_sensor_endpoint` AND `players_sensor_endpoint`.`id_players` =  `playerss_online_sensor`.`id_players` '
    var where = ' WHERE `players_sensor_endpoint`.`id_players` = ? AND `playerss_online_sensor`.`id_players` = ? '
    var and = ' AND `online_sensor`.`id_online_sensor` = ? AND `sensor_endpoint`.`sensor_endpoint_id_online_sensor` = ? AND `playerss_online_sensor`.`id_online_sensor` = ? '
    var and2 = 'AND `sensor_endpoint`.`id_sensor_endpoint` = ? AND `players_sensor_endpoint`.`id_sensor_endpoint` = ? '
    var query = select+from+join+join2+join3+where+and+and2

    mysqlConnection.query(query,[id_player,id_player,id_online_sensor,id_online_sensor,id_online_sensor,id_sensor_endpoint,id_sensor_endpoint], function(err,rows,fields){
        if (!err){
            console.log(rows);
            res.status(200).json(rows[0])
        } else {
            console.log(err);
        }
    });
})

//2) Obtener TODOS los sensor_endpoint (activated y desactivated) relacionados a un player y online_sensor
//WORKS
sensor_endpoint.get('/sensor_endpoints/:id_player/:id_online_sensor',(req,res,next)=>{
    var id_player = req.params.id_player;
    var id_online_sensor = req.params.id_online_sensor;

    var select = 'SELECT DISTINCT `sensor_endpoint`.`id_sensor_endpoint`, `players_sensor_endpoint`.`id_players`, `online_sensor`.`id_online_sensor`, `online_sensor`.`base_url`, `playerss_online_sensor`.`tokens`, `sensor_endpoint`.`url_endpoint`, `sensor_endpoint`.`token_parameters`, `sensor_endpoint`.`specific_parameters` AS `specific_parameters_template`, `sensor_endpoint`.`watch_parameters`, `players_sensor_endpoint`.`specific_parameters`, `players_sensor_endpoint`.`activated`, `players_sensor_endpoint`.`schedule_time`, `sensor_endpoint`.`initiated_date`, `sensor_endpoint`.`last_modified` '
    var from = ' FROM `online_sensor` '
    var join = 'JOIN `sensor_endpoint` ON `online_sensor`.`id_online_sensor` = `sensor_endpoint`.`sensor_endpoint_id_online_sensor` '
    var join2 = 'JOIN `playerss_online_sensor` ON `online_sensor`.`id_online_sensor` = `playerss_online_sensor`.`id_online_sensor` '
    var join3 = 'JOIN `players_sensor_endpoint` ON `sensor_endpoint`.`id_sensor_endpoint` = `players_sensor_endpoint`.`id_sensor_endpoint` AND `players_sensor_endpoint`.`id_players` =  `playerss_online_sensor`.`id_players` '
    var where = ' WHERE `players_sensor_endpoint`.`id_players` = ? AND `playerss_online_sensor`.`id_players` = ? '
    var and = ' AND `online_sensor`.`id_online_sensor` = ? AND `sensor_endpoint`.`sensor_endpoint_id_online_sensor` = ? AND `playerss_online_sensor`.`id_online_sensor` = ? '

    var query = select+from+join+join2+join3+where+and
    mysqlConnection.query(query,[id_player,id_player,id_online_sensor,id_online_sensor,id_online_sensor], function(err,rows,fields){
        if (!err){
            console.log(rows);
            res.status(200).json( rows)
        } else {
            console.log(err);
        }
    });
})

//3) Obtener TODOS los sensor_endpoint (activated) relacionados a un player y online_sensor
//WORKS

sensor_endpoint.get('/sensor_endpoints_activated/:id_player/:id_online_sensor',(req,res,next)=>{
    var id_player = req.params.id_player;
    var id_online_sensor = req.params.id_online_sensor;

    var select = 'SELECT DISTINCT `sensor_endpoint`.`id_sensor_endpoint`, `players_sensor_endpoint`.`id_players`, `online_sensor`.`id_online_sensor`, `online_sensor`.`base_url`, `playerss_online_sensor`.`tokens`, `sensor_endpoint`.`url_endpoint`, `sensor_endpoint`.`token_parameters`, `sensor_endpoint`.`specific_parameters` AS `specific_parameters_template`, `sensor_endpoint`.`watch_parameters`, `players_sensor_endpoint`.`specific_parameters`, `players_sensor_endpoint`.`activated`, `players_sensor_endpoint`.`schedule_time`, `sensor_endpoint`.`initiated_date`, `sensor_endpoint`.`last_modified` '
    var from = ' FROM `online_sensor` '
    var join = 'JOIN `sensor_endpoint` ON `online_sensor`.`id_online_sensor` = `sensor_endpoint`.`sensor_endpoint_id_online_sensor` '
    var join2 = 'JOIN `playerss_online_sensor` ON `online_sensor`.`id_online_sensor` = `playerss_online_sensor`.`id_online_sensor` '
    var join3 = 'JOIN `players_sensor_endpoint` ON `sensor_endpoint`.`id_sensor_endpoint` = `players_sensor_endpoint`.`id_sensor_endpoint` AND `players_sensor_endpoint`.`id_players` =  `playerss_online_sensor`.`id_players` '
    var where = ' WHERE `players_sensor_endpoint`.`activated` = 1 '
    var and = ' AND `players_sensor_endpoint`.`id_players` = ? AND `playerss_online_sensor`.`id_players` = ? '
    var and2 = ' AND `online_sensor`.`id_online_sensor` = ? AND `sensor_endpoint`.`sensor_endpoint_id_online_sensor` = ? AND `playerss_online_sensor`.`id_online_sensor` = ? '

    var query = select+from+join+join2+join3+where+and+and2
    mysqlConnection.query(query,[id_player,id_player,id_online_sensor,id_online_sensor,id_online_sensor], function(err,rows,fields){
        if (!err){
            console.log(rows);
            res.status(200).json(rows)
        } else {
            console.log(err);
        }
    });
})

//4) Obtener TODOS los sensor_endpoint (desactivated) relacionados a un player y online_sensor
//WORKS

sensor_endpoint.get('/sensor_endpoints_deactivated/:id_player/:id_online_sensor',(req,res,next)=>{
    var id_player = req.params.id_player;
    var id_online_sensor = req.params.id_online_sensor;

    var select = 'SELECT DISTINCT `sensor_endpoint`.`id_sensor_endpoint`, `players_sensor_endpoint`.`id_players`, `online_sensor`.`id_online_sensor`, `online_sensor`.`base_url`, `playerss_online_sensor`.`tokens`, `sensor_endpoint`.`url_endpoint`, `sensor_endpoint`.`token_parameters`, `sensor_endpoint`.`specific_parameters` AS `specific_parameters_template`, `sensor_endpoint`.`watch_parameters`, `players_sensor_endpoint`.`specific_parameters`, `players_sensor_endpoint`.`activated`, `players_sensor_endpoint`.`schedule_time`, `sensor_endpoint`.`initiated_date`, `sensor_endpoint`.`last_modified` '
    var from = ' FROM `online_sensor` '
    var join = 'JOIN `sensor_endpoint` ON `online_sensor`.`id_online_sensor` = `sensor_endpoint`.`sensor_endpoint_id_online_sensor` '
    var join2 = 'JOIN `playerss_online_sensor` ON `online_sensor`.`id_online_sensor` = `playerss_online_sensor`.`id_online_sensor` '
    var join3 = 'JOIN `players_sensor_endpoint` ON `sensor_endpoint`.`id_sensor_endpoint` = `players_sensor_endpoint`.`id_sensor_endpoint` AND `players_sensor_endpoint`.`id_players` =  `playerss_online_sensor`.`id_players` '
    var where = ' WHERE `players_sensor_endpoint`.`activated` = 0 '
    var and = ' AND `players_sensor_endpoint`.`id_players` = ? AND `playerss_online_sensor`.`id_players` = ? '
    var and2 = ' AND `online_sensor`.`id_online_sensor` = ? AND `sensor_endpoint`.`sensor_endpoint_id_online_sensor` = ? AND `playerss_online_sensor`.`id_online_sensor` = ? '

    var query = select+from+join+join2+join3+where+and+and2

    mysqlConnection.query(query,[id_player,id_player,id_online_sensor,id_online_sensor,id_online_sensor], function(err,rows,fields){
        if (!err){
            console.log(rows);
            res.status(200).json( rows)
        } else {
            console.log(err);
        }
    });
})

//5) Obtener TODOS los sensor_endpoint de un player en particular (activated y deactivated)(tomando en cuenta todos los online_sensor que tiene)

//WORKS

sensor_endpoint.get('/sensor_endpoints/:id_player',(req,res,next)=>{
    var id_player = req.params.id_player;

    var select = 'SELECT DISTINCT `sensor_endpoint`.`id_sensor_endpoint`, `players_sensor_endpoint`.`id_players`, `online_sensor`.`id_online_sensor`, `online_sensor`.`base_url`, `playerss_online_sensor`.`tokens`, `sensor_endpoint`.`url_endpoint`, `sensor_endpoint`.`token_parameters`, `sensor_endpoint`.`specific_parameters` AS `specific_parameters_template`, `sensor_endpoint`.`watch_parameters`, `players_sensor_endpoint`.`specific_parameters`, `players_sensor_endpoint`.`activated`, `players_sensor_endpoint`.`schedule_time`, `sensor_endpoint`.`initiated_date`, `sensor_endpoint`.`last_modified` '
    var from = ' FROM `online_sensor` '
    var join = 'JOIN `sensor_endpoint` ON `online_sensor`.`id_online_sensor` = `sensor_endpoint`.`sensor_endpoint_id_online_sensor` '
    var join2 = 'JOIN `playerss_online_sensor` ON `online_sensor`.`id_online_sensor` = `playerss_online_sensor`.`id_online_sensor` '
    var join3 = 'JOIN `players_sensor_endpoint` ON `sensor_endpoint`.`id_sensor_endpoint` = `players_sensor_endpoint`.`id_sensor_endpoint` AND `players_sensor_endpoint`.`id_players` =  `playerss_online_sensor`.`id_players` '
    var where = ' WHERE `players_sensor_endpoint`.`id_players` = ? AND `playerss_online_sensor`.`id_players` = ? '
    var query = select+from+join+join2+join3+where

    mysqlConnection.query(query,[id_player,id_player], function(err,rows,fields){
        if (!err){
            console.log(rows);
            res.status(200).json(rows)
        } else {
            console.log(err);
        }
    });
})
//6) Obtener TODOS los sensor_endpoint de un player en particular (activated)(tomando en cuenta todos los online_sensor que tiene)

//WORKS
sensor_endpoint.get('/sensor_endpoints_activated/:id_player',(req,res,next)=>{
    var id_player = req.params.id_player;

    var select = 'SELECT DISTINCT `sensor_endpoint`.`id_sensor_endpoint`, `players_sensor_endpoint`.`id_players`, `online_sensor`.`id_online_sensor`, `online_sensor`.`base_url`, `playerss_online_sensor`.`tokens`, `sensor_endpoint`.`url_endpoint`, `sensor_endpoint`.`token_parameters`, `sensor_endpoint`.`specific_parameters` AS `specific_parameters_template`, `sensor_endpoint`.`watch_parameters`, `players_sensor_endpoint`.`specific_parameters`, `players_sensor_endpoint`.`activated`, `players_sensor_endpoint`.`schedule_time`, `sensor_endpoint`.`initiated_date`, `sensor_endpoint`.`last_modified` '
    var from = ' FROM `online_sensor` '
    var join = 'JOIN `sensor_endpoint` ON `online_sensor`.`id_online_sensor` = `sensor_endpoint`.`sensor_endpoint_id_online_sensor` '
    var join2 = 'JOIN `playerss_online_sensor` ON `online_sensor`.`id_online_sensor` = `playerss_online_sensor`.`id_online_sensor` '
    var join3 = 'JOIN `players_sensor_endpoint` ON `sensor_endpoint`.`id_sensor_endpoint` = `players_sensor_endpoint`.`id_sensor_endpoint` AND `players_sensor_endpoint`.`id_players` =  `playerss_online_sensor`.`id_players` '
    var where = ' WHERE `players_sensor_endpoint`.`activated` = 1 '
    var and = ' AND `players_sensor_endpoint`.`id_players` = ? AND `playerss_online_sensor`.`id_players` = ? '
    var query = select+from+join+join2+join3+where+and

    mysqlConnection.query(query,[id_player,id_player], function(err,rows,fields){
        if (!err){
            console.log(rows);
            res.status(200).json( rows)
        } else {
            console.log(err);
        }
    });
})
//7) Obtener TODOS los sensor_endpoint de un player en particular (deactivated)(tomando en cuenta todos los online_sensor que tiene)

//WORKS
sensor_endpoint.get('/sensor_endpoints_deactivated/:id_player',(req,res,next)=>{
    var id_player = req.params.id_player;
    var select = 'SELECT DISTINCT `sensor_endpoint`.`id_sensor_endpoint`, `players_sensor_endpoint`.`id_players`, `online_sensor`.`id_online_sensor`, `online_sensor`.`base_url`, `playerss_online_sensor`.`tokens`, `sensor_endpoint`.`url_endpoint`, `sensor_endpoint`.`token_parameters`, `sensor_endpoint`.`specific_parameters` AS `specific_parameters_template`, `sensor_endpoint`.`watch_parameters`, `players_sensor_endpoint`.`specific_parameters`, `players_sensor_endpoint`.`activated`, `players_sensor_endpoint`.`schedule_time`, `sensor_endpoint`.`initiated_date`, `sensor_endpoint`.`last_modified` '
    var from = ' FROM `online_sensor` '
    var join = 'JOIN `sensor_endpoint` ON `online_sensor`.`id_online_sensor` = `sensor_endpoint`.`sensor_endpoint_id_online_sensor` '
    var join2 = 'JOIN `playerss_online_sensor` ON `online_sensor`.`id_online_sensor` = `playerss_online_sensor`.`id_online_sensor` '
    var join3 = 'JOIN `players_sensor_endpoint` ON `sensor_endpoint`.`id_sensor_endpoint` = `players_sensor_endpoint`.`id_sensor_endpoint` AND `players_sensor_endpoint`.`id_players` =  `playerss_online_sensor`.`id_players` '
    var where = ' WHERE `players_sensor_endpoint`.`activated` = 0 '
    var and = ' AND `players_sensor_endpoint`.`id_players` = ? AND `playerss_online_sensor`.`id_players` = ? '
    var query = select+from+join+join2+join3+where+and
    
    mysqlConnection.query(query,[id_player,id_player], function(err,rows,fields){
        if (!err){
            console.log(rows);
            res.status(200).json( rows)
        } else {
            console.log(err);
        }
    });
})

//8) Obtener TODOS los sensor_endpoint relacionados a un online_sensor (activated y deactivated)(sin importar de que players son)
//WORKS
sensor_endpoint.get('/online_sensor/:id_online_sensor/sensor_endpoints',(req,res,next)=>{
    var id_online_sensor = req.params.id_online_sensor;

    var select = 'SELECT DISTINCT `sensor_endpoint`.`id_sensor_endpoint`, `players_sensor_endpoint`.`id_players`, `online_sensor`.`id_online_sensor`, `online_sensor`.`base_url`, `playerss_online_sensor`.`tokens`, `sensor_endpoint`.`url_endpoint`, `sensor_endpoint`.`token_parameters`, `sensor_endpoint`.`specific_parameters` AS `specific_parameters_template`, `sensor_endpoint`.`watch_parameters`, `players_sensor_endpoint`.`specific_parameters`, `players_sensor_endpoint`.`activated`, `players_sensor_endpoint`.`schedule_time`, `sensor_endpoint`.`initiated_date`, `sensor_endpoint`.`last_modified` '
    var from = ' FROM `online_sensor` '
    var join = 'JOIN `sensor_endpoint` ON `online_sensor`.`id_online_sensor` = `sensor_endpoint`.`sensor_endpoint_id_online_sensor` '
    var join2 = 'JOIN `playerss_online_sensor` ON `online_sensor`.`id_online_sensor` = `playerss_online_sensor`.`id_online_sensor` '
    var join3 = 'JOIN `players_sensor_endpoint` ON `sensor_endpoint`.`id_sensor_endpoint` = `players_sensor_endpoint`.`id_sensor_endpoint` AND `players_sensor_endpoint`.`id_players` =  `playerss_online_sensor`.`id_players` '
    var where = ' WHERE `online_sensor`.`id_online_sensor` = ? AND `sensor_endpoint`.`sensor_endpoint_id_online_sensor` = ? AND `playerss_online_sensor`.`id_online_sensor` = ? '
    var query = select+from+join+join2+join3+where
    
    mysqlConnection.query(query,[id_online_sensor,id_online_sensor,id_online_sensor], function(err,rows,fields){
        if (!err){
            console.log(rows);
            res.status(200).json( rows)
        } else {
            console.log(err);
        }
    });
})
//9) Obtener TODOS los sensor_endpoint relacionados a un online_sensor (activated)(sin importar de que players son)
//WORKS
sensor_endpoint.get('/online_sensor/:id_online_sensor/sensor_endpoints_activated',(req,res,next)=>{
    var id_online_sensor = req.params.id_online_sensor;

    var select = 'SELECT DISTINCT `sensor_endpoint`.`id_sensor_endpoint`, `players_sensor_endpoint`.`id_players`, `online_sensor`.`id_online_sensor`, `online_sensor`.`base_url`, `playerss_online_sensor`.`tokens`, `sensor_endpoint`.`url_endpoint`, `sensor_endpoint`.`token_parameters`, `sensor_endpoint`.`specific_parameters` AS `specific_parameters_template`, `sensor_endpoint`.`watch_parameters`, `players_sensor_endpoint`.`specific_parameters`, `players_sensor_endpoint`.`activated`, `players_sensor_endpoint`.`schedule_time`, `sensor_endpoint`.`initiated_date`, `sensor_endpoint`.`last_modified` '
    var from = ' FROM `online_sensor` '
    var join = 'JOIN `sensor_endpoint` ON `online_sensor`.`id_online_sensor` = `sensor_endpoint`.`sensor_endpoint_id_online_sensor` '
    var join2 = 'JOIN `playerss_online_sensor` ON `online_sensor`.`id_online_sensor` = `playerss_online_sensor`.`id_online_sensor` '
    var join3 = 'JOIN `players_sensor_endpoint` ON `sensor_endpoint`.`id_sensor_endpoint` = `players_sensor_endpoint`.`id_sensor_endpoint` AND `players_sensor_endpoint`.`id_players` =  `playerss_online_sensor`.`id_players` '
    var where = ' WHERE `players_sensor_endpoint`.`activated` = 1 '
    var and = ' AND `online_sensor`.`id_online_sensor` = ? AND `sensor_endpoint`.`sensor_endpoint_id_online_sensor` = ? AND `playerss_online_sensor`.`id_online_sensor` = ? '
    var query = select+from+join+join2+join3+where+and

    mysqlConnection.query(query,[id_online_sensor,id_online_sensor,id_online_sensor], function(err,rows,fields){
        if (!err){
            console.log(rows);
            res.status(200).json( rows)
        } else {
            console.log(err);
        }
    });
})
//10) Obtener TODOS los sensor_endpoint relacionados a un online_sensor (deactivated)(sin importar de que players son)
//WORKS
sensor_endpoint.get('/online_sensor/:id_online_sensor/sensor_endpoints_deactivated',(req,res,next)=>{
    var id_online_sensor = req.params.id_online_sensor;

    var select = 'SELECT DISTINCT `sensor_endpoint`.`id_sensor_endpoint`, `players_sensor_endpoint`.`id_players`, `online_sensor`.`id_online_sensor`, `online_sensor`.`base_url`, `playerss_online_sensor`.`tokens`, `sensor_endpoint`.`url_endpoint`, `sensor_endpoint`.`token_parameters`, `sensor_endpoint`.`specific_parameters` AS `specific_parameters_template`, `sensor_endpoint`.`watch_parameters`, `players_sensor_endpoint`.`specific_parameters`, `players_sensor_endpoint`.`activated`, `players_sensor_endpoint`.`schedule_time`, `sensor_endpoint`.`initiated_date`, `sensor_endpoint`.`last_modified` '
    var from = ' FROM `online_sensor` '
    var join = 'JOIN `sensor_endpoint` ON `online_sensor`.`id_online_sensor` = `sensor_endpoint`.`sensor_endpoint_id_online_sensor` '
    var join2 = 'JOIN `playerss_online_sensor` ON `online_sensor`.`id_online_sensor` = `playerss_online_sensor`.`id_online_sensor` '
    var join3 = 'JOIN `players_sensor_endpoint` ON `sensor_endpoint`.`id_sensor_endpoint` = `players_sensor_endpoint`.`id_sensor_endpoint` AND `players_sensor_endpoint`.`id_players` =  `playerss_online_sensor`.`id_players` '
    var where = ' WHERE `players_sensor_endpoint`.`activated` = 0 '
    var and = ' AND `online_sensor`.`id_online_sensor` = ? AND `sensor_endpoint`.`sensor_endpoint_id_online_sensor` = ? AND `playerss_online_sensor`.`id_online_sensor` = ? '
    var query = select+from+join+join2+join3+where+and
    mysqlConnection.query(query,[id_online_sensor,id_online_sensor,id_online_sensor], function(err,rows,fields){
        if (!err){
            console.log(rows);
            res.status(200).json( rows)
        } else {
            console.log(err);
        }
    });
})

//11) Obtener TODOS los sensor_endpoints (activated y deactivated) de TODOS los players
/* WORKS */

sensor_endpoint.get('/sensor_endpoints',(req,res,next)=>{
    var select = 'SELECT DISTINCT `sensor_endpoint`.`id_sensor_endpoint`, `players_sensor_endpoint`.`id_players`, `online_sensor`.`id_online_sensor`, `online_sensor`.`base_url`, `playerss_online_sensor`.`tokens`, `sensor_endpoint`.`url_endpoint`, `sensor_endpoint`.`token_parameters`, `sensor_endpoint`.`specific_parameters` AS `specific_parameters_template`, `sensor_endpoint`.`watch_parameters`, `players_sensor_endpoint`.`specific_parameters`, `players_sensor_endpoint`.`activated`, `players_sensor_endpoint`.`schedule_time`, `sensor_endpoint`.`initiated_date`, `sensor_endpoint`.`last_modified` '
    var from = ' FROM `online_sensor` '
    var join = 'JOIN `sensor_endpoint` ON `online_sensor`.`id_online_sensor` = `sensor_endpoint`.`sensor_endpoint_id_online_sensor` '
    var join2 = 'JOIN `playerss_online_sensor` ON `online_sensor`.`id_online_sensor` = `playerss_online_sensor`.`id_online_sensor` '
    var join3 = 'JOIN `players_sensor_endpoint` ON `sensor_endpoint`.`id_sensor_endpoint` = `players_sensor_endpoint`.`id_sensor_endpoint` AND `players_sensor_endpoint`.`id_players` =  `playerss_online_sensor`.`id_players` '
    var orderBy = 'ORDER BY `sensor_endpoint`.`id_sensor_endpoint` ASC'
    var query = select+from+join+join2+join3+where+orderBy
    mysqlConnection.query(query, function(err,rows,fields){
        if (!err){
            console.log(rows);
            res.status(200).json(rows)
        } else {
            console.log(err);
        }
    });
})

//12) Obtener TODOS los sensor_endpoints (activated) de TODOS los players
/* WORKS */

sensor_endpoint.get('/sensor_endpoints_activated',(req,res,next)=>{
    var select = 'SELECT DISTINCT `sensor_endpoint`.`id_sensor_endpoint`, `players_sensor_endpoint`.`id_players`, `online_sensor`.`id_online_sensor`, `online_sensor`.`base_url`, `playerss_online_sensor`.`tokens`, `sensor_endpoint`.`url_endpoint`, `sensor_endpoint`.`token_parameters`, `sensor_endpoint`.`specific_parameters` AS `specific_parameters_template`, `sensor_endpoint`.`watch_parameters`, `players_sensor_endpoint`.`specific_parameters`, `players_sensor_endpoint`.`activated`, `players_sensor_endpoint`.`schedule_time`, `sensor_endpoint`.`initiated_date`, `sensor_endpoint`.`last_modified` '
    var from = ' FROM `online_sensor` '
    var join = 'JOIN `sensor_endpoint` ON `online_sensor`.`id_online_sensor` = `sensor_endpoint`.`sensor_endpoint_id_online_sensor` '
    var join2 = 'JOIN `playerss_online_sensor` ON `online_sensor`.`id_online_sensor` = `playerss_online_sensor`.`id_online_sensor` '
    var join3 = 'JOIN `players_sensor_endpoint` ON `sensor_endpoint`.`id_sensor_endpoint` = `players_sensor_endpoint`.`id_sensor_endpoint` AND `players_sensor_endpoint`.`id_players` =  `playerss_online_sensor`.`id_players` '
    var where = ' WHERE `players_sensor_endpoint`.`activated` = 1 '
    var orderBy = 'ORDER BY `sensor_endpoint`.`id_sensor_endpoint` ASC'
    var query = select+from+join+join2+join3+where+orderBy
    mysqlConnection.query(query, function(err,rows,fields){
        if (!err){
            console.log(rows);
            res.status(200).json(rows)
        } else {
            console.log(err);
        }
    });
})


//13) Obtener TODOS los sensor_endpoints (deactivated) de TODOS los players
/* WORKS */


sensor_endpoint.get('/sensor_endpoints_deactivated',(req,res,next)=>{
    var select = 'SELECT DISTINCT `sensor_endpoint`.`id_sensor_endpoint`, `players_sensor_endpoint`.`id_players`, `online_sensor`.`id_online_sensor`, `online_sensor`.`base_url`, `playerss_online_sensor`.`tokens`, `sensor_endpoint`.`url_endpoint`, `sensor_endpoint`.`token_parameters`, `sensor_endpoint`.`specific_parameters` AS `specific_parameters_template`, `sensor_endpoint`.`watch_parameters`, `players_sensor_endpoint`.`specific_parameters`, `players_sensor_endpoint`.`activated`, `players_sensor_endpoint`.`schedule_time`, `sensor_endpoint`.`initiated_date`, `sensor_endpoint`.`last_modified` '
    var from = ' FROM `online_sensor` '
    var join = 'JOIN `sensor_endpoint` ON `online_sensor`.`id_online_sensor` = `sensor_endpoint`.`sensor_endpoint_id_online_sensor` '
    var join2 = 'JOIN `playerss_online_sensor` ON `online_sensor`.`id_online_sensor` = `playerss_online_sensor`.`id_online_sensor` '
    var join3 = 'JOIN `players_sensor_endpoint` ON `sensor_endpoint`.`id_sensor_endpoint` = `players_sensor_endpoint`.`id_sensor_endpoint` AND `players_sensor_endpoint`.`id_players` =  `playerss_online_sensor`.`id_players` '
    var where = ' WHERE `players_sensor_endpoint`.`activated` = 0 '
    var orderBy = 'ORDER BY `sensor_endpoint`.`id_sensor_endpoint` ASC'
    var query = select+from+join+join2+join3+where+orderBy
    mysqlConnection.query(query, function(err,rows,fields){
        if (!err){
            console.log(rows);
            res.status(200).json(rows)
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
    `sensor_endpoint`.`parameters_watched`,
    `sensor_endpoint`.`activated`,
    `sensor_endpoint`.`schedule_time` 

*/

//1)Crea asociacion de un jugador a un sensor_endpoint en especifico

sensor_endpoint.post('/sensor_endpoint/:id_player/:id_sensor_endpoint',(req,res,next)=>{
    var id_player = req.params.id_player;
    var id_sensor_endpoint = req.params.id_sensor_endpoint;

    var sensor_endpoint_data = req.body
    console.log(sensor_endpoint_data)

    //var date = new Date().toISOString().slice(0, 19).replace('T', ' ')

    var insertInto = 'INSERT INTO `players_sensor_endpoint`'
    var columnValues = '(`id_players`,`id_sensor_endpoint`,`specific_parameters`,`activated`, `schedule_time`)'
    var newValues = 'VALUES (?,?,?,?,?)'
    var query = insertInto+columnValues+newValues
    mysqlConnection.query(query,[id_player,id_sensor_endpoint,sensor_endpoint_data.specific_parameters,sensor_endpoint_data.activated,sensor_endpoint_data.schedule_time], function(err,rows,fields){
        if (!err){
            console.log(rows);
            res.status(200).json(rows)
        } else {
            console.log(err);
        }
    });
})

//2)Crea un sensor_endpoint template 

sensor_endpoint.post('/sensor_endpoint/:id_online_sensor',(req,res,next)=>{
    var id_online_sensor = req.params.id_online_sensor;

    var sensor_endpoint_data = req.body
    console.log(sensor_endpoint_data)

    var date = new Date().toISOString().slice(0, 19).replace('T', ' ')

    var insertInto = 'INSERT INTO `sensor_endpoint`'
    var columnValues = '(`sensor_endpoint_id_online_sensor`,`name`,`description`,`url_endpoint`,`token_parameters`, `specific_parameters`,`watch_parameters`,`initiated_date`, `last_modified`)'
    var newValues = 'VALUES (?,?,?,?,?,?,?,' + '\''+date +'\''+ ',' + '\''+date +'\''+ ')'
    var query = insertInto+columnValues+newValues
    mysqlConnection.query(query,[id_online_sensor,sensor_endpoint_data.name,sensor_endpoint_data.description,sensor_endpoint_data.url_endpoint,sensor_endpoint_data.token_parameters,sensor_endpoint_data.specific_parameters,sensor_endpoint_data.watch_parameters], function(err,rows,fields){
        if (!err){
            console.log(rows);
            res.status(200).json(rows)
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
    `sensor_endpoint`.`parameters_watched`,
    `sensor_endpoint`.`activated`,
    `sensor_endpoint`.`schedule_time` 

*/
//1) Modificar la info del sensor endpoint asociado a un player

sensor_endpoint.put('/sensor_endpoint/:id_players/:id_sensor_endpoint',(req,res,next)=>{
    var id_players = req.params.id_players
    var id_sensor_endpoint = req.params.id_sensor_endpoint

    var sensor_endpoint_data = req.body

    var date = new Date().toISOString().slice(0, 19).replace('T', ' ')

   
    var update = 'UPDATE `players_sensor_endpoint`'
    var set = ' SET `specific_parameters` = ?,`activated` = ? , `schedule_time` = ? ' 
    var where = 'WHERE players_sensor_endpoint.id_players = ? '
    var and = ' AND players_sensor_endpoint.id_sensor_endpoint = ? '
    var query = update+set+where+and    

    mysqlConnection.query(query,[sensor_endpoint_data.specific_parameters,sensor_endpoint_data.activated,sensor_endpoint_data.schedule_time,id_players,id_sensor_endpoint], function(err,rows,fields){
        if (!err){
            console.log(rows);
            res.status(200).json(rows)
        } else {
            console.log(err);
        }
    });
})
//2) Modificar la info del sensor endpoint template 

sensor_endpoint.put('/sensor_endpoint/:id_sensor_endpoint',(req,res,next)=>{
    var id_sensor_endpoint = req.params.id_sensor_endpoint

    var sensor_endpoint_data = req.body

    var date = new Date().toISOString().slice(0, 19).replace('T', ' ')

    var update = 'UPDATE `sensor_endpoint`'
    var set = ' SET `name` = ?,`description` = ? , `url_endpoint` = ?, `token_parameters` = ?, `specific_parameters` = ?, `watch_parameters` = ?, `last_modified` = ' + '\''+date+'\'' 
    var where = 'WHERE `sensor_endpoint`.`id_sensor_endpoint` = ?'
    var query = update+set+where

    mysqlConnection.query(query,[sensor_endpoint_data.name,sensor_endpoint_data.description,sensor_endpoint_data.url_endpoint,sensor_endpoint_data.token_parameters,sensor_endpoint_data.specific_parameters,sensor_endpoint_data.watch_parameters,id_sensor_endpoint], function(err,rows,fields){
        if (!err){
            console.log(rows);
            res.status(200).json(rows)
        } else {
            console.log(err);
        }
    });
})
/*
DELETE ENDPOINTS:

1) Borrar el sensor_endpoint template
Causa: No existen repercusiones a otras tablas actualmente
*/

sensor_endpoint.delete('/sensor_endpoint/:id_sensor_endpoint',(req,res,next)=>{

    var id_sensor_endpoint = req.params.id_sensor_endpoint


    var deleteD = 'DELETE FROM `sensor_endpoint`'
    var where = 'WHERE `sensor_endpoint`. id_sensor_endpoint = ? '
    var query = deleteD+where    

    mysqlConnection.query(query,[id_sensor_endpoint], function(err,rows,fields){
        if (!err){
            console.log(rows);
            res.status(200).json(rows)
        } else {
            console.log(err);
        }
    });
})
/*
2) Borrar la relacion entre jugador y sensor_endpoint (players_sensor_endpoint)
Causa: No existen repercusiones a otras tablas actualmente
*/

sensor_endpoint.delete('/sensor_endpoint/:id_players/:id_sensor_endpoint',(req,res,next)=>{
    var id_players = req.params.id_players

    var id_sensor_endpoint = req.params.id_sensor_endpoint


    var deleteD = 'DELETE FROM `players_sensor_endpoint`'
    var where = 'WHERE `sensor_endpoint`. `id_sensor_endpoint` = ? '
    var and = 'AND `sensor_endpoint`. `id_players` = ?'
    var query = deleteD+where+and    

    mysqlConnection.query(query,[id_sensor_endpoint,id_players], function(err,rows,fields){
        if (!err){
            console.log(rows);
            res.status(200).json(rows)
        } else {
            console.log(err);
        }
    });
})





export default sensor_endpoint;

