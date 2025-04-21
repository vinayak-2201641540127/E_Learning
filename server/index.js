import express from 'express';
import dotenv from 'dotenv';
import { connect } from 'http2';
import { connectDb } from './database/db.js';

dotenv.config();

const app = express();
//usig middlewares
app.use(express.json());

const PORT = process.env.PORT;

app.get("/",(req, res) => {
    res.send("Server is Working");
})


//importing routes
import userRoutes from './routes/user.js';

app.use('/api', userRoutes);


app.listen(PORT, ()=>{
    console.log(`Server is running on ${PORT}`);
    connectDb();
})