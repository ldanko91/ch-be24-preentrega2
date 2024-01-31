//LIBRERIAS
import express from "express";
import mongoose from "mongoose";
import handlebars from "express-handlebars";
import { Server } from "socket.io";


//RUTAS
import dbProdsRouter from "./routes/dbProds.routes.js";
import dbCartsRouter from "./routes/dbCarts.routes.js";
import dbChatRouter from "./routes/dbChat.routes.js";

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

//config Chat Socket
import ChatsDBManager from "./dao/dbManagers/ChatDBManager.js";
const DBChatManager = new ChatsDBManager();
const socketServer = new Server(httpServer)

socketServer.on('connection', socket => {
    console.log("Nuevo cliente conectado");

    const emitOldMessages = () => {
        const messages = DBChatManager.getMessages();
        socket.emit('message-showOldMessages', messages);
    };

    // Emitir mensajes antiguos cuando un nuevo cliente se conecta
    emitOldMessages();

    socket.on('sendMessage', data => {
        console.log(data);
        console.log("Mensaje enviado");

        // Agregar el nuevo mensaje
        DBChatManager.addMessage(data);

        // Emitir mensajes antiguos después de agregar el nuevo mensaje
        emitOldMessages();
    });
});

//vistas HBS!
app.use('/api/products', dbProdsRouter)
app.use('/api/carts', dbCartsRouter)
app.use('/chat', dbChatRouter)
