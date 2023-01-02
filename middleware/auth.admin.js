const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
        const userId = decodedToken.userId;
        User.findById({ _id: userID }).then((user) => {
            if (user.type !== "user") {
                console.log("Admin verified, next()");
                req.auth ={
                    userId: userId
                 };
                next();
                return;
            } else {
                res.status(401).json({
                    error: "Authentification failed : User is not admin",
                });
            }
        });
    }
    catch(error){
        res.status(401).json({error: error | "Requête non authentifiée !"});
    }
};