//LIBRERIAS
import express from "express";
import mongoose from "mongoose";
import handlebars from "express-handlebars";

//RUTAS
import dbProdsRouter from "./routes/dbProds.routes.js";
import dbCartsRouter from "./routes/dbCarts.routes.js";

//UTILS
import __dirname from "./dirname.js";

//CONFIG SERVERS
const app = express()
const PORT = 8080
const user = 'ldanko'
const password = 'Iz8ddD4Iu1kR7vEf'
const URL = `mongodb+srv://${user}:${password}@productmanager.0scft9y.mongodb.net/?retryWrites=true&w=majority`

const httpServer = app.listen(PORT, () => console.log(`Servidor conectado al puerto: ${PORT}`))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//CONFIG MONGOOSE
const connection = mongoose.connect(URL)

//config HBS!
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'))

//vistas HBS!
app.use('/api/products', dbProdsRouter)
app.use('/api/carts', dbCartsRouter)
