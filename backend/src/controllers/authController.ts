import bcrypt from "bcryptjs";
import { sql } from "../config/db.ts";
import express, {Request, Response} from "express";
import jwt from "jsonwebtoken";

export const register = async (req: Request, res: Response) => {
    const {username, password} = req.body;

    try {
        const existingUser = await sql`
            SELECT username FROM users WHERE username=${username}
        `;

        console.log(existingUser);

        if (existingUser.length > 0) {
            res.status(400).json({successStatus: false, message: "User already exists"});
            return;
        }

        if (username.toLowerCase() == 'guest') {
            res.status(400).json({successStatus: false, message: "Cannot use name"});
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await sql`
            INSERT INTO users (username, password)
            VALUES (${username}, ${hashedPassword})
            RETURNING *
        `;

        const token = jwt.sign({username: username}, process.env.JWT_SECRET!, {expiresIn: "1h"});

        res.status(201).json({successStatus: true, message: "User registered successfully", token});
    } catch (error) {
        res.status(500).json({successStatus: false, message: "Error registering user"});
    }
};

export const login = async (req: Request, res: Response) => {
    const {username, password} = req.body;

    try {
        const user = await sql`
            SELECT * FROM users WHERE username=${username}
        `;

        if (!user || user.length == 0 || !(await bcrypt.compare(password, user[0].password))) {
            res.status(401).json({successStatus: false, message: "Invalid credentials"});
            return;
        }

        const token = jwt.sign({username: user[0].username}, process.env.JWT_SECRET!, {expiresIn: "1h"});
        res.status(201).json({token});
    } catch (error) {
        res.status(500).json({successStatus: false, message: "Login failed"});
    }
};