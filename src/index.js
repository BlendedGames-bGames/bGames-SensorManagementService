const express = require("express");
const app = express();
var bodyParse =require('body-parser');
app.use(bodyParse.json());
app.use(bodyParse.urlencoded({extended:true}));


//Settings
const port = process.env.PORT || 3020;

//Middlewares
app.use(express.json());

//Routes
app.use(require('./routes/Online_Sensor'))
app.use(require('./routes/Sensor_Endpoint'))
app.use(require('./routes/Conversion'))

app.get('/', (req, res) => {
    res.send('Hello World!')
  })

//Starting the server
app.listen(port,"127.0.0.1", () => {
 console.log(`listening on port ${port} ...... `);
});