import express, { Request, Response } from "express";
import 'dotenv/config'
import authRouter from "./routes/auth";
import todoRouter from "./routes/todo";


const app = express();
app.use(express.json());

// ROUTES

app.use("/auth", authRouter);
app.use("/todos", todoRouter);

app.get("/", (req: Request, res: Response) => {
    res.json({message: "This is homepage of todo application"});
});


app.listen(3000, () => {
    console.log("Server started at http://localhost:3000");
});