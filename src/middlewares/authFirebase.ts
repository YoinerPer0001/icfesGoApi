import type { Request, Response, NextFunction } from "express";
import admin from "../core/firebase.js";
import { ApiResponse } from "../core/responseSchedule.js";

export async function authenticateFirebase(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const authHeader = req.headers.authorization;
    console.log(authHeader)
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json(new ApiResponse(401, "Unauthorized", {}));
    }

    const idToken = authHeader.split(" ")[1];

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken ?? "");
        (req as any).uid = decodedToken.uid; // lo guardamos en la request
        console.log(decodedToken)
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json(new ApiResponse(401, "Invalid Token", {}));
    }

}


export async function FirebaseTokenVerification(
    token:string
) : Promise<ApiResponse<{uid:string, name:string} | null>> {
    

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        return new ApiResponse(200, "Token valid", {uid: decodedToken.uid, name: decodedToken.name});
    
    } catch (error) {
        console.error(error);
        return new ApiResponse(401, "Invalid Token", null);
    }

}


