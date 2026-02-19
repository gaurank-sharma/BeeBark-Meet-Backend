// import dotenv from "dotenv";
// dotenv.config();
// import express from "express";
// import { createServer } from "node:http";

// import { Server } from "socket.io";

// import mongoose from "mongoose";
// import { connectToSocket } from "./controllers/socketManager.js";

// import cors from "cors";
// import userRoutes from "./routes/users.routes.js";

// const app = express();
// const server = createServer(app);
// const io = connectToSocket(server);

// app.set("port", process.env.PORT || 8000);
// app.use(cors());
// app.use(express.json({ limit: "40kb" }));
// app.use(express.urlencoded({ limit: "40kb", extended: true }));

// app.get("/", (req, res) => {
//     return res.json({ message: "Hello from Backend Server" });
// });

// app.use("/api/v1/users", userRoutes);

// const start = async () => {
//   app.set("mongo_user");
//   const connectionDb = await mongoose.connect(
//     "mongodb+srv://sharmagaurank63_db_user:kuno9OzDaHcrcZMa@cluster0.tnvncg3.mongodb.net/beebark"
//   );

//   console.log(`MONGO Connected DB HOst: ${connectionDb.connection.host}`);
//   server.listen(app.get("port"), () => {
//     console.log("LISTENIN ON PORT 8000");
//   });
// };

// start();



import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { createServer } from "node:http";
import mongoose from "mongoose";
import cors from "cors";

import { connectToSocket } from "./controllers/socketManager.js"; // IMPORT THE FIX
import userRoutes from "./routes/users.routes.js";

const app = express();
const server = createServer(app);
const io = connectToSocket(server); // INITIALIZE SOCKET

app.set("port", process.env.PORT || 8000);

// Middleware
app.use(cors());
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));


app.get("/", (req, res) => {
    return res.json({ message: "Hello from Backend Server" });
});

// Routes
app.use("/api/v1/users", userRoutes);

// DB & Server Start
const start = async () => {
  try {
    const connectionDb = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MONGO Connected DB Host: ${connectionDb.connection.host}`);
    
    server.listen(app.get("port"), () => {
      console.log(`LISTENING ON PORT ${app.get("port")}`);
    });
  } catch (error) {
    console.log("ERROR connecting to DB:", error);
  }
};

start();