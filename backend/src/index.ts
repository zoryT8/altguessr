import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import mapRoutes from "./routes/mapRoutes.ts";

// import productRoutes from "./routes/productRoutes.ts";
// import { sql } from "./config/db.ts";
// import { aj } from "./lib/arcjet.ts";

dotenv.config();

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

app.use("/api/maps", mapRoutes);

// async function initDB() {
//     try {
//         await sql`
//             CREATE TABLE IF NOT EXISTS products (
//                 id SERIAL PRIMARY KEY,
//                 name VARCHAR(255) NOT NULL,
//                 image VARCHAR(255) NOT NULL,
//                 price DECIMAL(10, 2) NOT NULL,
//                 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//             )
//         `;

//         console.log("Database initialized successfully");
//     } catch (error) {
//         console.log("Error initDB", error);
//     }
// }

// initDB().then(() => {
//     app.listen(PORT, () => {
//         console.log("Server is running on port " + PORT);
//     });
// });

app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
});