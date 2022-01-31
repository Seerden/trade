import express from "express";
import { createUser, getUser } from "../helpers/auth-helpers/user";

const authRouter = express.Router({ mergeParams: true });

authRouter.post("/register", async (req, res) => {
    const { newUser } = req.body;
    const { username, password } = newUser;

    if (getUser(username)) {
        res.status(403).json({
            message: "Username already exists",
        });
    } else {
        // @todo
        createUser(newUser);
    }
});

export default authRouter;
