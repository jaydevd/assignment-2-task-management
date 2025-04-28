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
const { startCronJobs } = require('./api/config/cron');

try {
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
    // await bootstrap();

    socket(io);
    startCronJobs();

    const PORT = process.env.PORT || 5000;

    server.listen(PORT, () => {
        console.log("Server running on http://localhost:5000");
    });

} catch (error) {
    console.log(error);
    throw new Error(error);
}