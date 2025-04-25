/**
 * @name App
 * @file app.js
 * @throwsF
 * @description This is the root server file of the project
 * @author Jaydev Dwivedi (Zignuts)
 */
require('dotenv/config.js');
const express = require('express');
const { sequelize } = require('./api/config/database.js');
const router = require('./API/Routes/index.js');
const bodyParser = require('body-parser');
const cors = require('cors');
const { bootstrap } = require('./api/config/bootstrap.js');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const socket = require('./api/config/socket.js');
const { startCronJobs } = require('./api/cron');

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST']
    }
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

sequelize.sync().then(() => {
    console.log("Database synced successfully.");
}).catch((err) => {
    console.error("Error syncing database:", err);
});

app.use(cors({
    origin: "http://localhost:5173",
    methods: "GET,POST,PUT,DELETE",
    credentials: true
}));

app.use('/', router);

const Bootstrap = async () => {
    try {
        await bootstrap();
    } catch (error) {
        throw new Error(error);
    }
}

Bootstrap();
socket(io);
startCronJobs();

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log("Server running on http://localhost:5000");
});