import express from "express";
import {Request, Response} from "express";
import { PrismaClient } from "@prisma/client";
import { authVerify } from "../middleware/authVerify";
import {z} from "zod";

const primsa = new PrismaClient();
const todoRouter = express.Router();

const todoSchema = z.object({

    title: z.string(), 
    description: z.string(),
    isDone: z.boolean().optional().default(false),

});

// GET ALL USER TODO
todoRouter.get("/", authVerify, async(req: Request, res: Response) => {

    const userId = req.userId;

    try {
        
        const userTodos = await primsa.todo.findMany({
            where: {
                userId: userId
            }
        });

        res.json({todos: userTodos});

    } catch (error) {
        
        console.log("Error in todoRouter / ", error);
        res.status(500).json({message: "Something went wrong"});
        throw(error);
    }
    
});

// CREATE NEW TODO
todoRouter.put("/", authVerify, async (req: Request, res: Response) => {

    const userId = req.userId as string;
    
    const {success, data, error} = todoSchema.safeParse(req.body);

    if(!success){

        res.status(400).json({error});
        return;
    }

    try {
        
        const newTodo = await primsa.todo.create({
            data: {
                title: data.title,
                description: data.description,
                isDone: data.isDone,
                user: {
                    connect: {
                        userId: req.userId
                    }
                } 
            } 
        });

        res.json({message: "Todo created", todoId: newTodo.todoId});

    } catch (error) {
        
        console.log("Error in todoRouter put/ ", error);
        res.status(500).json({message: "Something went wrong"});
        throw(error);
    }

});

todoRouter.get("/search", authVerify, async(req: Request, res: Response) => {

    const todoId = req.query.todo;

    if(!todoId){

        res.status(400).json({message: "Todo ID is required"});
        return ;
    }

    const userId = req.userId;

    try {
        
        const userTodos = await primsa.todo.findMany({
            where: {
                userId: userId, 
                todoId: todoId as string
            }
        });

        res.json({todos: userTodos});

    } catch (error) {
        
        console.log("Error in todoRouter / ", error);
        res.status(500).json({message: "Something went wrong"});
        throw(error);
    }
    
});

export default todoRouter;