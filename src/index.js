const express = require("express");
const app = express();
var bodyParse =require('body-parser');
app.use(bodyParse.json());
app.use(bodyParse.urlencoded({extended:true}));


//Settings
const port = process.env.PORT || 3007;

//Middlewares
app.use(express.json());

//Routes
app.use(require('./routes/Online_Sensor'))
app.use(require('./routes/Sensor_Endpoint'))
app.use(require('./routes/Conversion'))
app.use(require('./routes/Videogame_Mechanic'))

//Starting the server
app.listen(port, () => {
 console.log(`listening on port ${port} ...... `);
});