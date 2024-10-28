import { Prisma, PrismaClient, User } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const JWT_SECRET = "SUPER SECRET"; //taken from environment later

const prisma = new PrismaClient();

type AuthRequest = Request & { user?: User};

export async function authenticateToken(req: AuthRequest, res: Response, next: NextFunction){
    //Check for authentication
    const authHeader = req.headers["authorization"];
    const jwtToken = String(authHeader?.split(" ")[1]);

    if(!jwtToken){
        res.sendStatus(401);
    }

    //Check & decode if token is valid
    try{
        const payload = await jwt.verify(jwtToken, JWT_SECRET) as { tokenId: number };

        const dbToken = await prisma.token.findUnique({
            where: { id: payload.tokenId },
            include: { user: true },
        });

        if(!dbToken?.valid || dbToken.expiration < new Date()){
            res.sendStatus(401).json({ error: "API token not valid."});
        }
        
        req.user = dbToken?.user;
    }catch(e){
        res.sendStatus(401);
    }

    next();
}