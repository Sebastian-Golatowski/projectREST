import jwt from "jsonwebtoken";

export const tokenGetter = (req) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader || typeof authHeader !== "string" || !authHeader.startsWith("Bearer ")) {
        throw new Error("Invalid or missing Authorization header");
    }

    const token = authHeader.slice(7).trim();
    if (!token) {
        throw new Error("Bearer token is empty");
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (!payload?.id || !payload?.username) {
        throw new Error("Token missing required user info (id, username)");
    }

    return payload;
};

export const tokenMiddleware = (req, res, next) => {
    try {
        const payload = tokenGetter(req);
        req.userId = payload.id;
        req.username = payload.username;
        next();
    } catch (err) {
        return res.status(401).json({ message: err.message });
    }
};

export const userInfo = (req, res) => {
    try {
        const payload = tokenGetter(req);
        return res.status(200).json({
            id: payload.id,
            username: payload.username,
        });
    } catch (err) {
        return res.status(401).json({ message: err.message });
    }
};

export const tokenMaker = (id, username)=>{
    return jwt.sign({ id: id, username: username }, process.env.JWT_SECRET, { expiresIn: "5h" });
}
