import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from 'express';
import { sql } from "../config/db.ts";

export interface CustomRequest extends Request {
 user: string | jwt.JwtPayload | undefined;
}

interface DecodedToken {
    username: string
}

export const authenticateJWT = async (req: Request, res: Response, next: NextFunction) => {
    const {mapId} = req.params;
    const token = req.headers['authorization']?.split(' ')[0];

    console.log(token);

    if (!token) {
        res.status(401).send('Access Denied');
        return;
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;

      const map = await sql`
        SELECT * FROM maps WHERE id=${mapId}
      `;

      const mapCreator: string = map[0].map_creator;

      if (decoded.username === mapCreator) {
        next();
      } else {
        res.status(401).send('Not authorized');
      }

    } catch (error) {
      console.log(error);
      res.status(401).send('Something went wrong');
    }
}