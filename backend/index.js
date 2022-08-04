const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const routes = require("./routes/routes");
const config = require("./config/config");

const app = express();

const allowedOrigins = config.frontendHost;
const port = config.port;

const app2 = express();
const http = require("http");
const chatServer = http.createServer(app2);
const { Server } = require("socket.io");
const io = new Server(chatServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});
const jwt = require("jsonwebtoken");

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin) return callback(null, true);
            if (allowedOrigins.indexOf(origin) === -1) {
                var msg =
                    "The CORS policy for this site does not allow access from the specified Origin.";
                return callback(new Error(msg), false);
            }
            return callback(null, true);
        },
        optionsSuccessStatus: 200,
        credentials: true,
    })
);

app.use(cookieParser());
app.use(express.json());
app.use("/public", express.static("./public"));

routes(app);

app.listen(port, () => console.log("Backend API running on :", port));

let socketIds = {};
let mapSocketIds = {};

// Socket.io chat realtime
io.on("connection", (socket) => {
    if (socket.handshake.headers.token) {
        try {
            decoded = jwt.verify(
                socket.handshake.headers.token,
                process.env.ACCESS_TOKEN_SECRET
            );
            if (
                socketIds[decoded.accountId] &&
                socketIds[decoded.accountId].length > 0
            ) {
                socketIds[decoded.accountId].push(socket.id);
            } else {
                socketIds[decoded.accountId] = [];
                socketIds[decoded.accountId].push(socket.id);
            }
            mapSocketIds[socket.id] = decoded.accountId;
            console.log(
                "a user connected, account devices: " +
                    socketIds[decoded.accountId]
            );
        } catch (e) {
            console.log("Invalid token");
        }
    }

    socket.on("disconnect", () => {
        let userId = mapSocketIds[socket.id];
        if (socketIds[userId]) {
            for (let i = 0; i < socketIds[userId].length; i++) {
                if (socketIds[userId][i] == socket.id) {
                    socketIds[userId].splice(i, 1);
                }
            }
        }

        // console.log(socketIds[userId])
    });
    socket.on("chatmessage", async (msg) => {
        if (msg.conversationId && msg.receiver) {
            try {
                if (socketIds[msg.receiver]) {
                    for (let i = 0; i < socketIds[msg.receiver].length; i++) {
                        io.to(socketIds[msg.receiver][i]).emit("message", msg);
                    }
                }
            } catch (e) {
                console.log(e);
            }
        }
    });

    socket.on("recallmessage", async (msg) => {
        if (msg.conversationId && msg.receiver) {
            try {
                if (socketIds[msg.receiver]) {
                    for (let i = 0; i < socketIds[msg.receiver].length; i++) {
                        io.to(socketIds[msg.receiver][i]).emit(
                            "recallmessage",
                            msg
                        );
                    }
                }
            } catch (e) {
                console.log(e);
            }
        }
    });

    socket.on("callTo", async (msg) => {
        try {
            if (socketIds[msg.accountId]) {
                for (let i = 0; i < socketIds[msg.accountId].length; i++) {
                    io.to(socketIds[msg.accountId][i]).emit(
                        "callReceive",
                        msg,
                    );
                }
            }
        } catch (e) {
            console.log(e);
        }
    });
});

chatServer.listen(3002, () => {
    console.log("server chat start on: " + 3002);
});
