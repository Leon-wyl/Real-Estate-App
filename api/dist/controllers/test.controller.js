import jwt from "jsonwebtoken";
export const shouldBeLoggedIn = (req, res) => {
    console.log(req.userId);
    res.status(200).json({ message: "You are authenticated" });
};
export const shouldBeAdmin = (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "Not Authenticated!" });
    }
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, payload) => {
        if (err) {
            return res.status(403).json({ message: "Token not valid!" });
        }
        if (payload && typeof payload !== "string" && !payload.isAdmin) {
            return res.status(403).json({ message: "Not authorized!" });
        }
        res.status(200).json({ message: "You are authenticated" });
    });
};
//# sourceMappingURL=test.controller.js.map