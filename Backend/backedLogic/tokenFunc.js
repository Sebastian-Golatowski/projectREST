import jwt from "jsonwebtoken";

export const tokenGetter = (req, res) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader || typeof authHeader !== "string" || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Invalid or missing Authorization header" });
    }

    const token = authHeader.slice(7).trim();
    if (!token) {
        return res.status(401).json({ message: "Bearer token is empty" });
    }

    let payload;
    try {
        payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }

    if (!payload?.id || !payload?.username) {
        return res.status(401).json({ message: "Token missing required user info (id, username)" });
    }

    return payload;
};

export const tokenMiddleware = (req, res, next) => {
    try {
        const payload = tokenGetter(req, res);
        if(payload.id == undefined) return;
        req.userId = payload.id;
        req.username = payload.username;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Unauthorized" });
    }
};

export const userInfo = (req, res) => {
    try {
        const payload = tokenGetter(req, res);
        return res.status(200).json({
            id: payload.id,
            username: payload.username,
        });
    } catch (err) {
        return res.status(401).json({ message: "Unauthorized" });
    }
};

export const tokenMaker = (id, username)=>{
    return jwt.sign({ id: id, username: username }, process.env.JWT_SECRET, { expiresIn: "5h" });
}
