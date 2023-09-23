// auth.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const token = req.header('Authorization');

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: Token not provided' });
    }

    // Here, you can add additional logic to verify the token, e.g., JWT validation.
    const decodedData = jwt.decode(token, process.env.SECRET_KEY);
    req['userData'] = decodedData;
    next();
  }
}
