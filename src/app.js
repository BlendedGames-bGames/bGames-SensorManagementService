import logger from 'morgan';
import express from 'express';
import cookieParser from 'cookie-parser';

//Routes
import online_sensor from './routes/online_sensor';
import sensor_endpoint from './routes/sensor_endpoint';
import conversion from './routes/conversion';
import videogame_mechanic from './routes/videogame_mechanic';

const app = express();

//Middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//Routes
app.use(online_sensor);
app.use(sensor_endpoint);
app.use(conversion);
app.use(videogame_mechanic);

export default app;