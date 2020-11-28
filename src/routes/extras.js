

var http = require('http');
var dat = {};

module.exports = {
    
    getJson: function(options,cb){

        http.request(options, res => {
            console.log(`statusCode: ${res.statusCode}`)
            var body = '';
            res.on('data',function(chunk){
                body += chunk;
            });
            res.on('end',function(){
                //console.log("El Body: "+body);
                //console.log("Fin del Body ------------------------------------------------------------------------------------------");
                // preserve newlines, etc - use valid JSON
                sbody = body.replace(/\\n/g, "\\n")  
                .replace(/\\'/g, "\\'")
                .replace(/\\"/g, '\\"')
                .replace(/\\&/g, "\\&")
                .replace(/\\r/g, "\\r")
                .replace(/\\t/g, "\\t")
                .replace(/\\b/g, "\\b")
                .replace(/\\f/g, "\\f");
                // remove non-printable and other non-valid JSON chars
                sbody = sbody.replace(/[\u0000-\u0019]+/g,"");
                var result;
                try{
                result = JSON.parse(sbody);
                cb(null,result);
                }catch(e){
                    cb('error',null);
                }
            });
            res.on('error',cb);
            
        })
        .on('error',cb)
        .end()


    },
    getJsonSend: function(options,data,cb){
        const req = http.request(options, res => {
            console.log(`statusCode: ${res.statusCode}`)
            var body = '';
            res.on('data',function(chunk){
                body += chunk;
            });
            res.on('end',function(){
                //console.log("El Body: "+body);
                //console.log("Fin del Body ------------------------------------------------------------------------------------------");
                // preserve newlines, etc - use valid JSON
                sbody = body.replace(/\\n/g, "\\n")  
                .replace(/\\'/g, "\\'")
                .replace(/\\"/g, '\\"')
                .replace(/\\&/g, "\\&")
                .replace(/\\r/g, "\\r")
                .replace(/\\t/g, "\\t")
                .replace(/\\b/g, "\\b")
                .replace(/\\f/g, "\\f");
                // remove non-printable and other non-valid JSON chars
                sbody = sbody.replace(/[\u0000-\u0019]+/g,"");
                var result;
                try{
                    result = JSON.parse(sbody);
                    cb(null,result);
                }catch(e){
                    cb('error',null);
                }
            });
            res.on('error',cb);
        })
        
        req.on('error',cb);
        
        req.write(data)
        req.end()
        /*http.request(options,function(res){
            var body = '';
            res.on('data',function(chunk){
                body += chunk;
            });
            res.on('end',function(){
                //console.log("El Body: "+body);
                //console.log("Fin del Body ------------------------------------------------------------------------------------------");
                // preserve newlines, etc - use valid JSON
                sbody = body.replace(/\\n/g, "\\n")  
                .replace(/\\'/g, "\\'")
                .replace(/\\"/g, '\\"')
                .replace(/\\&/g, "\\&")
                .replace(/\\r/g, "\\r")
                .replace(/\\t/g, "\\t")
                .replace(/\\b/g, "\\b")
                .replace(/\\f/g, "\\f");
                // remove non-printable and other non-valid JSON chars
                sbody = sbody.replace(/[\u0000-\u0019]+/g,"");
                var result = JSON.parse(sbody);
                cb(null,result);
            });

            //res.write(dat);
            res.on('error',cb);
            
        })
        .on('error',cb)
        .on('data',dat)
        .end()*/


    },

    isBoolean: function(arg) {
        return typeof arg === 'boolean';
      },
      
    isNumber: function(arg) {
    return typeof arg === 'number';
    },
    
    isString: function(arg) {
    return typeof arg === 'string';
    },
    
    isFunction: function(arg) {
    return typeof arg === 'function';
    }
    
  };