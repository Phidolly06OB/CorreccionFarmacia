const express = require("express");
const router = express.Router()
const app = express();

require("dotenv").config();
const port = process.env.PORT;


const ruterBase = require("./routes/rutas.js")

app.use("/test", ruterBase)
app.use(express.json())

app.listen(port, () =>{
    console.log('Server Iniciado');
})


