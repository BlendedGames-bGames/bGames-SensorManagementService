const express = require('express');
const router = express.Router();

var http = require('http');

const fetch = require('node-fetch');
var common = require('./extras');


// PARA ESTE MICROSERVICIO SE NECESITA INGRESAR LOS DATOS DE LA SIGUIENTE MANERA:
/* Ejemplo de Json del Body para el POST
    {
    "id_player": 2,
    "nameat": "Resistencia",
    "namecategory": "Físico",
    "data": 1,
    "data_type": "in.off",
    "input_source": "xlr8_podometer",
    "date_time": "2019-05-16 13:17:17"
    }
*/

/*
Input: Id of a player (range 0 to positive int)
Output: Subattributes of that player
Description: Calls the b-Games-APIrestGETService service to get the attributes
*/
router.get('/getAttributes/:id', (req,res,next)=>{
    var post_data = req.body;
    const{id}= req.params;
    var options = {
        host : 'apirestgetservice.herokuapp.com',
        path: ('/attributes/'+id),
        method: 'GET'
    };

    common.getJson(options,function(error,result){
        if(error){
            console.log("No hay resultado");//ACA ESTA EL RESULTADO
            res.json("Error");
        }
        else{
            console.log(result);//ACA ESTA EL RESULTADO
            res.json(result);
        }
    });

})

/*
Input: Id of a player (range 0 to positive int)
Output: Subattributes of that player in a specific attribute using its type as identifier
Description: Calls the b-Games-APIrestGETService service to get the subattributes
*/
router.get('/getAttributes/bycategory/:id/:type', (req,res,next)=>{
    var post_data = req.body;
    const{id,type}= req.params;
    var options = {
        host : 'apirestgetservice.herokuapp.com',
        path: ('/attributes/bycategory/'+id+'/'+type),
        method: 'GET'
    };

    common.getJson(options,function(error,result){
        if(error){
            console.log("No hay resultado");//ACA ESTA EL RESULTADO
            res.json("Error");
        }
        else{
            console.log(result);//ACA ESTA EL RESULTADO
            res.json(result);
        }
    });

})

/*
Input: Id of a player (range 0 to positive int)
Output: Subattributes of that player in a specific attribute using its name as identifier
Description: Calls the b-Games-APIrestGETService service to get the subattributes
*/
router.get('/getAttributes/byname/:id/:type', (req,res,next)=>{
    var post_data = req.body;
    const{id,type}= req.params;
    var options = {
        host : 'apirestgetservice.herokuapp.com',
        path: ('/attributes/byname/'+id+'/'+type),
        method: 'GET'
    };

    common.getJson(options,function(error,result){
        if(error){
            console.log("No hay resultado");//ACA ESTA EL RESULTADO
            res.json("Error");
        }
        else{
            console.log(result);//ACA ESTA EL RESULTADO
            res.json(result);
        }
    });

})

/*
Input: Id of a player (range 0 to positive int)
Output: Resume of attributes of that player
Description: Calls the b-Games-APIrestGETService service to get the resume of the attributes
*/
router.get('/getAttributesSummary/:id', (req,res,next)=>{
    var post_data = req.body;
    console.log('paso por aqui')
    const id= req.params.id;  
    console.log(id)
    var options = {
        host : 'apirestgetservice.herokuapp.com',
        path: ('/attributes/resume/'+id),
        method: 'GET'
    };
    common.getJson(options,function(error,result){
        if(error){
            console.log("Error in conection or invalid request");//ACA ESTA EL RESULTADO
            res.json("Error");
        }
        else{
            console.log(result);//ACA ESTA EL RESULTADO
            res.json(result);
        }
    });
    
})

/*
Input: Id of a player (range 0 to positive int)
Output: Specific resume of a single attribute of that player
Description: Calls the b-Games-APIrestGETService service to get the resume of the attributes
*/
router.get('/getAttributesSummary/:id/:type', (req,res,next)=>{
    var post_data = req.body;
    const{id,type}= req.params;
    var options = {
        host : 'apirestgetservice.herokuapp.com',
        path: ('/attributes/resume/'+id+'/'+type),
        method: 'GET'
    };
    common.getJson(options,function(error,result){
        if(error){
            console.log("No hay resultado");//ACA ESTA EL RESULTADO
            res.json("Error");
        }
        else{
            console.log(result);//ACA ESTA EL RESULTADO
            res.json(result);
        }
    });
    
})

/*
Input: Id of a player (range 0 to positive int) and type of attribute
Output: Modifies that Attribute of that player
Description: Doble MYSQL query
*/
router.put('/putAttributes/bycategory/:id/:type', (req,res,next)=>{
    var {id_player,namecategory,data} = req.body;
    const{id,type}= req.params;
    var options = {
        /*host : 'localhost',
        port: '3002',*/
        host : 'bgames-apirestpostatt.herokuapp.com',
        path: ('/attributes/bycategory/'+id+'/'+type)
    }; 
    var url = "http://"+options.host + options.path;
    console.log("URL "+url);
    console.log(req.body)
    console.log(id_player,namecategory,data)
    var keys = Object.keys(req.body)
    console.log(keys[0])
    var sbody = keys[0].replace('\u00006','')
    console.log(sbody)
    var sbody2 = JSON.parse(sbody)
    console.log(sbody2)

    const MEDIUM_POST_URL = url;
    const response = fetch(MEDIUM_POST_URL, {
        method: "put",
        headers: {
            "Content-type": "application/json",
            "Accept": "application/json",
            "Accept-Charset": "utf-8"
            },
            body: JSON.stringify({
                id_player: sbody2.id_player,
                namecategory:sbody2.namecategory,
                data:sbody2.data
            })
    })
    .then(res => res.text())
    .then(data => console.log("Response of API: "+data));
    const messageData = response;

    // the API frequently returns 201
    if ((response.status !== 200) && (response.status !== 201)) {
        console.error(`Invalid response status ${ response.status }.`);
        throw messageData;
    }

})


/*
Input: Id of a player (range 0 to positive int)
Output: Name, password and age of that player
Description: Calls the b-Games-Configurationservice service to get the player's information
*/
router.get('/getPlayerConfig/:id', (req,res,next)=>{
    var post_data = req.body;
    const{id}= req.params;
    var options = {
        host : 'bgames-configurationservice.herokuapp.com',
        path: ('/players/'+id),
        method: 'GET'
      };
    common.getJson(options,function(err,result){
        if(err){
            console.log("No hay resultado");//ACA ESTA EL RESULTADO
            res.json("Error in user config: get");
        }
        else{
            console.log(result);//ACA ESTA EL RESULTADO
            res.json(result);
        }
    });

})

/*
Input: Id of a player (range 0 to positive int)
Output: Void (Modifies the name, pass and age of a player)
Description: Calls the b-Games-Configurationservice service to edit the player's information
*/
//Faltan todos los verificadores de si cumple con los requerimientos o faltan datos!
router.put('/getPlayerConfig/edit/:id', (req,res,next)=>{
    //var headersIN = req.body;
    const headersIN = JSON.stringify(req.body);

    

    const {name,pass,age} = req.body;
    const{id}= req.params;
    console.log("cuanto es: "+headersIN);
    if ( !common.isNumber(Number(id)) || !common.isString(name) || !common.isString(pass) || !(common.isNumber(age))){
        console.log('This is not a player'+  typeof(Number(id)) + common.isString(name) + common.isString(pass) + common.isNumber(age));
        res.json("Error in user config: not user");
    }
    else{
        const data = JSON.stringify({
            name: name,
            pass:pass,
            age:age
          });
        console.log("cuanto es2: "+data);
        
        var options = {
            host : 'bgames-configurationservice.herokuapp.com',
            path: ('/players/'+id),
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
              }
        };
        common.getJsonSend(options,data,function(err,result){
            if(err){
                console.log("No hay resultado");//ACA ESTA EL RESULTADO
                res.json("Error in user config: get");
            }
            else{
                console.log(result);//ACA ESTA EL RESULTADO
                res.json(result);
            }
        });
    }

})


module.exports = router;

