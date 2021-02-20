const express = require('express');
const videogame_mechanic = express.Router();


const mysqlConnection = require('../database');

/* 
CRUD de videogames, mechanics y su relacion
*/

/*
RETRIEVE MODIFIABLE_MECHANIC:

1) Obtener UN modifiable_mechanic en particular 

2) Obtener UN videojuego en especial 

3) Obtener UNA la relacion videojuegos y mecanicas en particular dado id

4) Obtener UNA la relacion videojuegos y mecanicas en particular dado videogame y modifiable mechanic ids

5) Obtener TODOS los modifiable_mechanic 

6) Obtener TODOS los videojuegos 

7) Obtener TODAS las relaciones videojuegos y mecanicas

*/


//1) Obtener UN modifiable_mechanic en particular 
//WORKS
videogame_mechanic.get('/modifiable_mechanic/:id_modifiable_mechanic',(req,res,next)=>{
    var id_modifiable_mechanic = req.params.id_modifiable_mechanic;

    var select = 'SELECT `modifiable_mechanic`.`name`, `modifiable_mechanic`.`description`,`modifiable_mechanic`.`type`, `modifiable_mechanic`.`initiated_date`, `modifiable_mechanic`.`last_modified` '
    var from = 'FROM `modifiable_mechanic` '
    var where = 'WHERE `modifiable_mechanic`.`id_modifiable_mechanic` = ?' 

    var query = select+from+where
    mysqlConnection.getConnection(function(err, connection) {
        if (err){
            res.status(400).json({message:'No se pudo obtener una conexion para realizar la consulta en la base de datos, consulte nuevamente', error: err})
            throw err
        } 
        connection.query(query,[id_modifiable_mechanic], function(err,rows,fields){
            if (!err){
                let result = rows[0]
                console.log(rows);
                res.status(200).json(result)
            } else {
                console.log(err);
                res.status(400).json({message:'No se pudo consultar a la base de datos', error: err})
            }
            connection.release();

        });
    })

})
//2) Obtener UN videojuego en especial 
//WORKS
videogame_mechanic.get('/videogame/:id_videogame',(req,res,next)=>{
    var id_videogame = req.params.id_videogame;

    var select = 'SELECT `videogame`.`name`, `videogame`.`description`,`videogame`.`genre`,`videogame`.`engine`, `videogame`.`developer`, `videogame`.`publisher`, `videogame`.`version` '
    var from = 'FROM `videogame` '
    var where = 'WHERE `videogame`.`id_videogame` = ?' 

    var query = select+from+where
    mysqlConnection.getConnection(function(err, connection) {
        if (err){
            res.status(400).json({message:'No se pudo obtener una conexion para realizar la consulta en la base de datos, consulte nuevamente', error: err})
            throw err
        } 
        connection.query(query,[id_videogame], function(err,rows,fields){
            if (!err){
                let result = rows[0]
                console.log(rows);
                res.status(200).json(result)
            } else {
                console.log(err);
                res.status(400).json({message:'No se pudo consultar a la base de datos', error: err})
            }
            connection.release();

        });
    })
})

//3) Obtener UNA la relacion videojuegos y mecanicas en particular dado id
//WORKS
videogame_mechanic.get('/modifiable_mechanic_videogame/:id_modifiable_mechanic_videogame',(req,res,next)=>{
    var id_modifiable_mechanic_videogame = req.params.id_modifiable_mechanic_videogame;

    var select = 'SELECT `modifiable_mechanic_videogame`.`id_modifiable_mechanic`, `modifiable_mechanic_videogame`.`id_videogame`, `modifiable_mechanic_videogame`.`options` '
    var from = 'FROM `modifiable_mechanic_videogame` '
    var where = 'WHERE `modifiable_mechanic_videogame`.`id_modifiable_mechanic_videogame` = ? ' 

    var query = select+from+where
    mysqlConnection.getConnection(function(err, connection) {
        if (err){
            res.status(400).json({message:'No se pudo obtener una conexion para realizar la consulta en la base de datos, consulte nuevamente', error: err})
            throw err
        } 
        connection.query(query,[id_modifiable_mechanic_videogame], function(err,rows,fields){
            if (!err){
                let result = rows[0]
                console.log(rows);
                res.status(200).json(result)
            } else {
                console.log(err);
                res.status(400).json({message:'No se pudo consultar a la base de datos', error: err})
            }
            connection.release();

        });
    })
})

//4) Obtener UNA la relacion videojuegos y mecanicas en particular dado videogame y modifiable mechanic
//WORKS
videogame_mechanic.get('/modifiable_mechanic_videogame/:id_videogame/:id_modifiable_mechanic',(req,res,next)=>{
    var id_videogame = req.params.id_videogame;
    var id_modifiable_mechanic = req.params.id_modifiable_mechanic;

    var select = 'SELECT `modifiable_mechanic_videogame`.`id_modifiable_mechanic_videogame`, `modifiable_mechanic_videogame`.`options` '
    var from = 'FROM `modifiable_mechanic_videogame` '
    var where = 'WHERE `modifiable_mechanic_videogame`.`id_videogame` = ? ' 
    var and = 'AND `modifiable_mechanic_videogame`.`id_modifiable_mechanic` = ?' 

    var query = select+from+where+and
    mysqlConnection.getConnection(function(err, connection) {
        if (err){
            res.status(400).json({message:'No se pudo obtener una conexion para realizar la consulta en la base de datos, consulte nuevamente', error: err})
            throw err
        } 
        connection.query(query,[id_videogame,id_modifiable_mechanic], function(err,rows,fields){
            if (!err){
                let result = rows[0]
                console.log(rows);
                res.status(200).json(result)
            } else {
                console.log(err);
                res.status(400).json({message:'No se pudo consultar a la base de datos', error: err})
            }
            connection.release();

        });
    })
})

//5) Obtener TODOS los modifiable_mechanic 
//WORKS
videogame_mechanic.get('/modifiable_mechanic_all',(req,res,next)=>{

    var select = 'SELECT  `modifiable_mechanic`.`id_modifiable_mechanic`, `modifiable_mechanic`.`name`, `modifiable_mechanic`.`description`, `modifiable_mechanic`.`type`,`modifiable_mechanic`.`initiated_date`,`modifiable_mechanic`.`last_modified` '
    var from = 'FROM `modifiable_mechanic` '

    var query = select+from
    mysqlConnection.getConnection(function(err, connection) {
        if (err){
            res.status(400).json({message:'No se pudo obtener una conexion para realizar la consulta en la base de datos, consulte nuevamente', error: err})
            throw err
        } 
        connection.query(query, function(err,rows,fields){
            if (!err){
                console.log(rows);
                res.status(200).json(rows)
            } else {
                console.log(err);
                res.status(400).json({message:'No se pudo consultar a la base de datos', error: err})
            }
            connection.release();

        });
    })
})
//6) Obtener TODOS los videojuegos 
//WORKS
videogame_mechanic.get('/videogames',(req,res,next)=>{

    var select = 'SELECT `videogame`.`id_videogame`,`videogame`.`name`, `videogame`.`description`,`videogame`.`genre`,`videogame`.`engine`, `videogame`.`developer`, `videogame`.`publisher`, `videogame`.`version` '
    var from = 'FROM `videogame` '

    var query = select+from
    mysqlConnection.getConnection(function(err, connection) {
        if (err){
            res.status(400).json({message:'No se pudo obtener una conexion para realizar la consulta en la base de datos, consulte nuevamente', error: err})
            throw err
        } 
        connection.query(query, function(err,rows,fields){
            if (!err){
                console.log(rows);
                res.status(200).json(rows)
            } else {
                console.log(err);
                res.status(400).json({message:'No se pudo consultar a la base de datos', error: err})
            }
            connection.release();

        });
    })
})
videogame_mechanic.get('/mechanics_of_videogame/:id_videogame',(req,res)=>{
    let id_videogame = req.params.id_videogame;
   
    let select = 'SELECT `modifiable_mechanic`.`id_modifiable_mechanic`, `modifiable_mechanic`.`name`, `modifiable_mechanic`.`description`  '
    let from = 'FROM `modifiable_mechanic` '
    let join = 'JOIN `modifiable_mechanic_videogame` ON `modifiable_mechanic_videogame`.`id_modifiable_mechanic` = `modifiable_mechanic`.`id_modifiable_mechanic` '
    let join2 = 'JOIN `videogame` ON `videogame`.`id_videogame` = `modifiable_mechanic_videogame`.`id_videogame` '
    let where = 'WHERE `videogame`.`id_videogame` = ? AND `modifiable_mechanic_videogame`.`id_videogame` = ? '
    let orderBy = 'ORDER BY `modifiable_mechanic`.`id_modifiable_mechanic`  ASC'

    let query = select+from+join+join2+where+orderBy
    mysqlConnection.getConnection(function(err, connection) {
        if (err){
            res.status(400).json({message:'No se pudo obtener una conexion para realizar la consulta en la base de datos, consulte nuevamente', error: err})
            throw err
        } 
        connection.query(query,[id_videogame,id_videogame], function(err,rows,fields){
            if (!err){
              
                res.status(200).json(rows);
            } else {
                console.log(err);
                res.status(400).json({message:'No se pudo consultar a la base de datos', error: err})
            }
            connection.release();

        });
    })
})
//7) Obtener TODAS las relaciones videojuegos y mecanicas
//WORKS
videogame_mechanic.get('/modifiable_mechanic_videogame_all',(req,res,next)=>{

    var select = 'SELECT `modifiable_mechanic_videogame`.`id_videogame`,`modifiable_mechanic_videogame`.`id_modifiable_mechanic`, `modifiable_mechanic_videogame`.`options` '
    var from = ' FROM `modifiable_mechanic_videogame` '

    var query = select+from
    mysqlConnection.getConnection(function(err, connection) {
        if (err){
            res.status(400).json({message:'No se pudo obtener una conexion para realizar la consulta en la base de datos, consulte nuevamente', error: err})
            throw err
        } 
        connection.query(query, function(err,rows,fields){
            if (!err){
                console.log(rows);
                res.status(200).json(rows)
            } else {
                console.log(err);
                res.status(400).json({message:'No se pudo consultar a la base de datos', error: err})
            }
            connection.release();

        });
    })
})
/*
CREATE ENDPOINTS:

1) Crear un videogame template 

2) Crear una modifiable_mechanic template 

3) Crear una relacion relaciones videojuegos y mecanicas

*/

//1)Crea un online_sensor 
//WORKS
videogame_mechanic.post('/videogame',(req,res,next)=>{
    var videogame_data = req.body
    var insertInto = 'INSERT INTO `videogame` '
    var columnValues = '(`name`,`description`,`genre`, `engine`, `developer`, `publisher`, `version`) '
    var newValues = 'VALUES (?,?,?,?,?,?,?)'
    var query = insertInto+columnValues+newValues
    mysqlConnection.getConnection(function(err, connection) {
        if (err){
            res.status(400).json({message:'No se pudo obtener una conexion para realizar la consulta en la base de datos, consulte nuevamente', error: err})
            throw err
        } 
        connection.query(query,[videogame_data.name,videogame_data.description,videogame_data.genre,videogame_data.engine,videogame_data.developer,videogame_data.publisher,videogame_data.version], function(err,rows,fields){
            if (!err){
                console.log(rows);
                res.status(200).json(rows)
            } else {
                console.log(err);
                res.status(400).json({message:'No se pudo consultar a la base de datos', error: err})
            }
            connection.release();

        });
    })
})

//2) Crear una modifiable_mechanic template 
//WORKS
videogame_mechanic.post('/modifiable_mechanic',(req,res,next)=>{
    var modifiable_mechanic_data = req.body
    var date = new Date().toISOString().slice(0, 19).replace('T', ' ')

    var insertInto = 'INSERT INTO `modifiable_mechanic` '
    var columnValues = '(`name`,`description`,`type`, `initated_date`, `last_modified`) '
    var newValues = 'VALUES (?,?,?,' + '\''+date +'\''+ ',' + '\''+date +'\''+ ')'

    var query = insertInto+columnValues+newValues
    mysqlConnection.getConnection(function(err, connection) {
        if (err){
            res.status(400).json({message:'No se pudo obtener una conexion para realizar la consulta en la base de datos, consulte nuevamente', error: err})
            throw err
        } 
        connection.query(query,[modifiable_mechanic_data.name,modifiable_mechanic_data.description,modifiable_mechanic_data.type], function(err,rows,fields){
            if (!err){
                console.log(rows);
                res.status(200).json(rows)
            } else {
                console.log(err);
                res.status(400).json({message:'No se pudo consultar a la base de datos', error: err})
            }
            connection.release();

        });
    })
})

//3) Crear una relacion relaciones videojuegos y mecanicas
//WORKS
videogame_mechanic.post('/modifiable_mechanic_videogame',(req,res,next)=>{
    var modifiable_mechanic_videogame_data = req.body

    var insertInto = 'INSERT INTO `modifiable_mechanic_videogame` '
    var columnValues = '(`id_modifiable_mechanic`,`id_videogame`,`options`) '
    var newValues = ' VALUES (?,?,?)'

    var query = insertInto+columnValues+newValues
    mysqlConnection.getConnection(function(err, connection) {
        if (err){
            res.status(400).json({message:'No se pudo obtener una conexion para realizar la consulta en la base de datos, consulte nuevamente', error: err})
            throw err
        } 
        connection.query(query,[modifiable_mechanic_videogame_data.id_modifiable_mechanic,modifiable_mechanic_videogame_data.id_videogame,modifiable_mechanic_videogame_data.options], function(err,rows,fields){
            if (!err){
                console.log(rows);
                res.status(200).json(rows)
            } else {
                console.log(err);
                res.status(400).json({message:'No se pudo consultar a la base de datos', error: err})
            }
            connection.release();

        });
    })
})

/*
UPDATE ENDPOINTS:

1) Modificar la info de un videogame 
CASCADE Y CASCADE

2) Modificar la info de un modifiable_mechanic 
CASCADE Y CASCADE

3) Modificar una relacion videogame mechanic dado su id
CASCADE Y CASCADE

4) Modificar una relacion videogame mechanic dado id_modifiable_mechanic y id_videogame

*/

//1) Modificar la info de un videogame 
//WORKS
videogame_mechanic.put('/videogame/:id_videogame',(req,res,next)=>{

    var id_videogame = req.params.id_videogame
    var videogame_data = req.body


    var update = 'UPDATE `videogame`'
    var set = ' SET `name` = ?,`description` = ? ,`genre` = ?, `engine` = ?, `developer` = ?, `publisher` = ?, `version` = ? ' 
    var where = ' WHERE `videogame`.`id_videogame` = ?'
    var query = update+set+where    
    mysqlConnection.getConnection(function(err, connection) {
        if (err){
            res.status(400).json({message:'No se pudo obtener una conexion para realizar la consulta en la base de datos, consulte nuevamente', error: err})
            throw err
        } 
        connection.query(query,[videogame_data.name,videogame_data.description,videogame_data.genre,videogame_data.engine,videogame_data.developer,videogame_data.publisher,videogame_data.version, id_videogame], function(err,rows,fields){
            if (!err){
                console.log(rows);
                res.status(200).json(rows)
            } else {
                console.log(err);
                res.status(400).json({message:'No se pudo consultar a la base de datos', error: err})
            }
            connection.release();

        });
    })
})

//2) Modificar la info de un modifiable_mechanic 
//WORKS
videogame_mechanic.put('/modifiable_mechanic/:id_modifiable_mechanic',(req,res,next)=>{
    var id_modifiable_mechanic= req.params.id_modifiable_mechanic

    var modifiable_mechanic_data = req.body

    var date = new Date().toISOString().slice(0, 19).replace('T', ' ')

    var update = 'UPDATE `modifiable_mechanic` '
    var set = ' SET `name` = ?, `description` = ?, `type` = ?, `last_modified` = ' + '\''+date+'\' ' 
    var where = ' WHERE `modifiable_mechanic`.`id_modifiable_mechanic` = ? '
    var query = update+set+where    
    mysqlConnection.getConnection(function(err, connection) {
        if (err){
            res.status(400).json({message:'No se pudo obtener una conexion para realizar la consulta en la base de datos, consulte nuevamente', error: err})
            throw err
        } 
        connection.query(query,[modifiable_mechanic_data.name, modifiable_mechanic_data.description, modifiable_mechanic_data.type,id_modifiable_mechanic], function(err,rows,fields){
            if (!err){
                console.log(rows);
                res.status(200).json(rows)
            } else {
                console.log(err);
                res.status(400).json({message:'No se pudo consultar a la base de datos', error: err})
            }
            connection.release();

        });
    })
})

//3) Modificar una relacion videogame mechanic dado su id
//WORKS
videogame_mechanic.put('/modifiable_mechanic_videogame/:id_modifiable_mechanic_videogame',(req,res,next)=>{
    var id_modifiable_mechanic_videogame = req.params.id_modifiable_mechanic_videogame

    var relation_data = req.body

    var update = 'UPDATE `modifiable_mechanic_videogame` '
    var set = ' SET  `id_modifiable_mechanic` = ?, `id_videogame` = ?, `options` = ? ' 
    var where = ' WHERE `modifiable_mechanic_videogame`.`id_modifiable_mechanic_videogame` = ? '
    var query = update+set+where    
    mysqlConnection.getConnection(function(err, connection) {
        if (err){
            res.status(400).json({message:'No se pudo obtener una conexion para realizar la consulta en la base de datos, consulte nuevamente', error: err})
            throw err
        } 
        connection.query(query,[relation_data.id_modifiable_mechanic,relation_data.id_videogame,relation_data.options,id_modifiable_mechanic_videogame ], function(err,rows,fields){
            if (!err){
                console.log(rows);
                res.status(200).json(rows)
            } else {
                console.log(err);
                res.status(400).json({message:'No se pudo consultar a la base de datos', error: err})
            }
            connection.release();

        });
    })
})

//4) Modificar una relacion videogame mechanic dado id_modifiable_mechanic y id_videogame
//WORKS
videogame_mechanic.put('/modifiable_mechanic_videogame/:id_videogame/:id_modifiable_mechanic',(req,res,next)=>{
    var id_videogame = req.params.id_videogame
    var id_modifiable_mechanic = req.params.id_modifiable_mechanic

    var relation_data = req.body

    var update = 'UPDATE `modifiable_mechanic_videogame` '
    var set = ' SET  `options` = ? ' 
    var where = ' WHERE `modifiable_mechanic_videogame`.`id_videogame` = ? AND  `modifiable_mechanic_videogame`.`id_modifiable_mechanic` = ? '
    var query = update+set+where    
    mysqlConnection.getConnection(function(err, connection) {
        if (err){
            res.status(400).json({message:'No se pudo obtener una conexion para realizar la consulta en la base de datos, consulte nuevamente', error: err})
            throw err
        } 
        connection.query(query,[relation_data.options,id_videogame,id_modifiable_mechanic ], function(err,rows,fields){
            if (!err){
                console.log(rows);
                res.status(200).json(rows)
            } else {
                console.log(err);
                res.status(400).json({message:'No se pudo consultar a la base de datos', error: err})
            }
            connection.release();

        });
    })
})
/*
DELETE ENDPOINTS:

1) Borrar el videogame  

2) Borrar la mecanica

3) Borrar la relacion videogame y mecanica dado su id

4) Borrar la relacion videogame y mecanica dados sus llaves foraneas id videogame y modifiable_mechanic

*/
//1) Borrar el videogame 
//WORKS
videogame_mechanic.delete('/videogame/:id_videogame',(req,res,next)=>{

    var id_videogame = req.params.id_videogame


    var deleteD = 'DELETE FROM `videogame` '
    var where = ' WHERE `videogame`.`id_videogame` = ? '
    var query = deleteD+where    
    mysqlConnection.getConnection(function(err, connection) {
        if (err){
            res.status(400).json({message:'No se pudo obtener una conexion para realizar la consulta en la base de datos, consulte nuevamente', error: err})
            throw err
        } 
        connection.query(query,[id_videogame], function(err,rows,fields){
            if (!err){
                console.log(rows);
                res.status(200).json(rows)
            } else {
                console.log(err);
                res.status(400).json({message:'No se pudo consultar a la base de datos', error: err})
            }
            connection.release();

        });
    })
})
//2) Borrar la mecanica 
//WORKS
videogame_mechanic.delete('/modifiable_mechanic/:id_modifiable_mechanic',(req,res,next)=>{
    var id_modifiable_mechanic = req.params.id_modifiable_mechanic


    var deleteD = 'DELETE FROM `modifiable_mechanic` '
    var where = ' WHERE `modifiable_mechanic`. id_modifiable_mechanic = ? '
    var query = deleteD+where    
    mysqlConnection.getConnection(function(err, connection) {
        if (err){
            res.status(400).json({message:'No se pudo obtener una conexion para realizar la consulta en la base de datos, consulte nuevamente', error: err})
            throw err
        } 
        connection.query(query,[id_modifiable_mechanic], function(err,rows,fields){
            if (!err){
                console.log(rows);
                res.status(200).json(rows)
            } else {
                console.log(err);
                res.status(400).json({message:'No se pudo consultar a la base de datos', error: err})
            }
            connection.release();

        });
    })
})

//3) Borrar la relacion videogame y mecanica dado su id
//WORKS
videogame_mechanic.delete('/modifiable_mechanic_videogame/:id_modifiable_mechanic_videogame',(req,res,next)=>{
    var id_modifiable_mechanic_videogame = req.params.id_modifiable_mechanic_videogame


    var deleteD = 'DELETE FROM `modifiable_mechanic_videogame` '
    var where = ' WHERE `modifiable_mechanic_videogame`. id_modifiable_mechanic_videogame = ? '
    var query = deleteD+where    
    mysqlConnection.getConnection(function(err, connection) {
        if (err){
            res.status(400).json({message:'No se pudo obtener una conexion para realizar la consulta en la base de datos, consulte nuevamente', error: err})
            throw err
        } 
        connection.query(query,[id_modifiable_mechanic_videogame], function(err,rows,fields){
            if (!err){
                console.log(rows);
                res.status(200).json(rows)
            } else {
                console.log(err);
                res.status(400).json({message:'No se pudo consultar a la base de datos', error: err})
            }
            connection.release();

        });
    })
})

// 4) Borrar la relacion videogame y mecanica dados sus llaves foraneas id videogame y modifiable_mechanic
//WORKS
videogame_mechanic.delete('/modifiable_mechanic_videogame/:id_videogame/:id_modifiable_mechanic',(req,res,next)=>{
    var id_videogame = req.params.id_videogame
    var id_modifiable_mechanic = req.params.id_modifiable_mechanic


    var deleteD = 'DELETE FROM `modifiable_mechanic_videogame` '
    var where = ' WHERE `modifiable_mechanic_videogame`. `id_videogame` = ? AND  `modifiable_mechanic_videogame`. `id_modifiable_mechanic` = ? '
    var query = deleteD+where    
    mysqlConnection.getConnection(function(err, connection) {
        if (err){
            res.status(400).json({message:'No se pudo obtener una conexion para realizar la consulta en la base de datos, consulte nuevamente', error: err})
            throw err
        } 
        connection.query(query,[id_videogame,id_modifiable_mechanic], function(err,rows,fields){
            if (!err){
                console.log(rows);
                res.status(200).json(rows)
            } else {
                console.log(err);
                res.status(400).json({message:'No se pudo consultar a la base de datos', error: err})
            }
            connection.release();

        });
    })
})


export default videogame_mechanic;

