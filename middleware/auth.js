const jwt = require('jsonwebtoken');
const sql = require("../models/db");
const auth = async (req, res, next) => {
    const token = req.header('Authorization').replace("Bearer ", "");
    try {
        if (token != null) {
            const decoded = jwt.verify(token, 'minor');
            if (decoded.exp > Date.now()) {
                req.auth = false;
                return res.status(400).send('Access token has expired Please Login Again');
            }
            sql.query(`select * from customer where id='${decoded._id}';`, (err, user) => {
                if (err) { req.auth = false; console.log(err); } else {
                    sql.query(`select * from tokens where token='${token}' and customer_id = '${decoded._id}';`,
                        (err, resii) => {
                            if (err) res.send(err);
                            else {
                                if (!resii || resii.length == 0) { req.auth = false; res.status(401).send("Please Login"); }
                                else {
                                    req.user = user[0];
                                    req.token = token;
                                    req.auth = true;
                                    next();
                                }
                            }
                        })
                }
            });
        }
    } catch (e) {
        req.auth=false;
        if (e.name === "TokenExpiredError")
            return res.status(400).send('Access token has expired Please Login Again');
        res.status(401).send({ error: "Please Login" });
    }
}

module.exports = auth;