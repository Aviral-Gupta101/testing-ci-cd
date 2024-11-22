import express from "express";
import {Request, Response} from "express";
import jwt from "jsonwebtoken";
import {z} from "zod";
import { PrismaClient } from "@prisma/client";

const primsa = new PrismaClient();

const authRouter = express.Router();

const signupSigninSchema = z.object({
    email: z.string().email(),
    password: z.string()
});


// SIGNUP
authRouter.post("/signup", async (req: Request, res: Response) => {
    
    const {success, data, error} = signupSigninSchema.safeParse(req.body);

    if(!success){
        res.status(400).json({error: error});
        return;
    }

    const email = data.email;
    const password = data.password;

    try {
        
        const foundUser = await primsa.user.findUnique({
            where: {
                email: email
            }
        });

        if(foundUser){
            res.status(409).json({message: "User already exits"});
            return;
        }

        const newUser = await primsa.user.create({
            data: {
                email: email,
                password: password,
            }
        });

        res.json({message: "Account has been created", userid: newUser.userId});

    } catch (error) {
        
        console.log("Error in /signup", error);
        res.status(500).json({message: "Something went wrong"});
        throw(error);
    }
});


// SIGNIN
authRouter.post("/signin", async(req: Request, res: Response) => {

    const {success, data, error} = signupSigninSchema.safeParse(req.body);

    if(!success){
        res.status(400).json({error: error});
        return;
    }

    const email = data.email;
    const password = data.password;

    try {
        
        const foundUser = await primsa.user.findUnique({
            where: {
                email: email,
                password: password
            }
        });

        if(!foundUser){
            res.status(401).json({message: "Invalid email or password"});
            return;
        }

        const JWT_SECRET = process.env.JWT_SECRET as string;
        
        const token = jwt.sign({userId: foundUser.userId}, JWT_SECRET);

        res.json({jwt: token});

    } catch (error) {
        
        console.log("Error in /signin", error);
        res.status(500).json({message: "Something went wrong"});
        throw(error);
    }

});




export default authRouter;