const express = require("express");
const app = express();
var bodyParse =require('body-parser');
app.use(bodyParse.json());
app.use(bodyParse.urlencoded({extended:true}));


//Settings
const port = process.env.PORT || 3033;

//Middlewares
app.use(express.json());

//Routes
app.use(require('./routes/SensorConfig'))

//Starting the server
app.listen(port, () => {
 console.log(`listening on port ${port} ...... `);
});