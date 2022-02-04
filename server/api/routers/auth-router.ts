import express from "express";
import passport from "passport";
import { createUser, getUser } from "../helpers/auth/user";

const authRouter = express.Router({ mergeParams: true });

authRouter.post("/register", async (req, res) => {
    const { username, password } = req.body;

    const [existingUser] = await getUser(username);

    if (existingUser) {
        res.status(403).json({
            message: "Username already exists",
        });
    } else {
        // @todo
        const [createdUser] = await createUser({ username, password });
        res.json({ createdUser });
    }
});

authRouter.post("/login", passport.authenticate("local"), (req, res) => {
    res.json({ user: req.user });
});

authRouter.get("/me", (req, res) => {
    if (req.isAuthenticated() && req.user) {
        res.send(req.user);
    } else {
        res.status(401).send("Not authenticated");
    }
});

authRouter.post("/logout", (req, res) => {
    req.session.destroy(() => {
        req.logOut();
        res.send({
            success: true,
            message: "Logged out successfully.",
        });
    });
});

export default authRouter;
