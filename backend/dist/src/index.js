import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import mapRoutes from "./routes/mapRoutes.ts";
import { sql } from "./config/db.ts";
import authRoutes from "./routes/authRoutes.ts";
import path from "path";
// import { aj } from "./lib/arcjet.ts";
dotenv.config();
const __dirname = path.resolve();
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(cors());
app.use(helmet()); // helmet is a security middleware that helps you protect your app by setting various HTTP headers
app.use(morgan("dev")); // log the requests
// apply arcjet rate-limit to all routes
// app.use(async (req, res, next) => {
//     try {
//         const decision = await aj.protect(req, {
//             requested:1 // specifies that each request consumes 1 token
//         });
//         if (decision.isDenied()) {
//             if (decision.reason.isRateLimit()) {
//                 res.status(429).json({error: "Too Many Requests"});
//             } else if (decision.reason.isBot()) {
//                 res.status(403).json({error: "Bot access denied"});
//             } else {
//                 res.status(403).json({error: "Forbidden"});
//             }
//             return;
//         }
//         // check for spoofed bots
//         if (decision.results.some((result) => result.reason.isBot() && result.reason.isSpoofed())) {
//             res.status(403).json({error: "Spoofed bot detected"});
//             return;
//         }
//         next();
//     } catch (error) {
//         console.log("Arcjet error", error);
//         next(error);
//     }
// });
app.use("/api", mapRoutes);
app.use("/auth", authRoutes);
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html"));
    });
}
async function initDB() {
    try {
        await sql `
            CREATE TABLE IF NOT EXISTS users (
                username VARCHAR(255) PRIMARY KEY NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL
            );
        `;
        await sql `
            CREATE TABLE IF NOT EXISTS maps (
                id SERIAL PRIMARY KEY,
                map_name VARCHAR(255) NOT NULL,
                map_creator VARCHAR(255) DEFAULT NULL,
                description VARCHAR(255),
                total_plays INT DEFAULT 0 NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (map_creator) REFERENCES users(username) 
            );
        `;
        await sql `
            CREATE TABLE IF NOT EXISTS locations (
                image_id VARCHAR(255) PRIMARY KEY
            );
        `;
        // junction table for many-to-many relationship
        await sql `
            CREATE TABLE IF NOT EXISTS map_locations (
                map_id INT,
                location_id VARCHAR(255),
                PRIMARY KEY (map_id, location_id),
                FOREIGN KEY (map_id) REFERENCES maps(id) ON DELETE CASCADE,
                FOREIGN KEY (location_id) REFERENCES locations(image_id) ON DELETE CASCADE
            );
        `;
        console.log("Database initialized successfully");
    }
    catch (error) {
        console.log("Error initDB", error);
    }
}
initDB().then(() => {
    app.listen(PORT, () => {
        console.log("Server is running on port " + PORT);
    });
});
// app.listen(PORT, () => {
//     console.log("Server is running on port " + PORT);
// });
