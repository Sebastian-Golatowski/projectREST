import jwt from "jsonwebtoken";

export const tokenGetter = async (req, res) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader) {
        return res
            .status(401)
            .json({ message: "Authorization header missing" });
    }

    if (typeof authHeader !== "string" || !authHeader.startsWith("Bearer ")) {
        return res
            .status(401)
            .json({ message: "Invalid Authorization format" });
    }

    const token = authHeader.slice(7).trim();
    if (!token) {
        return res.status(401).json({ message: "Bearer token is empty" });
    }

    let payload;
    try {
        payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
        return res
            .status(401)
            .json({ message: `Token verification failed -> ${e}` });
    }

    if (!payload?.id || !payload?.username) {
        res.status(401).json({
            message: "Token missing required user info (id, username)",
        });
        return;
    }

    return{
        id: payload.id,
        username: payload.username,
    };
};

export const tokenMaker = (id, username)=>{
    return jwt.sign({ id: id, username: username }, process.env.JWT_SECRET, { expiresIn: "5h" });
}
