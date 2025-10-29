import express from 'express';
import authRouter from './routes/auth/authRoutes.js';
import cors from 'cors';
import dotenv from 'dotenv';
import RolesRoutes from './routes/rolesRoutes.js';
import citiesRepository from './repository/citiesRepository.js';
import PruebasRoutes from './routes/pruebasRoutes.js';
import GradosRoutes from './routes/gradosRoutes.js';
import CitiesRoutes from './routes/citiesRoutes.js';

interface City {
  id: number,
  name: string,
  description: string,
  departmentId: number,
}

dotenv.config();

const rootUrl = '/api';
const app = express();

const PORT: number = parseInt(process.env.PORT ?? "3000") ;

app.use(express.json());

app.use(cors());

//routes
app.get(rootUrl+"/", (req, res)=>{
    res.send('API is running');
});

app.use(rootUrl, authRouter);
app.use(rootUrl, RolesRoutes)
app.use(rootUrl, PruebasRoutes)
app.use(rootUrl, GradosRoutes)
app.use(rootUrl, CitiesRoutes)

app.listen(PORT, ()=>{
  console.info(`Success server in port : ${PORT}`)
})




