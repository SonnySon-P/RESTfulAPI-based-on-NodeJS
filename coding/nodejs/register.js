// 載入套件
const router = require("express").Router();
const {db, Sequelize} = require("./db");
const bcrypt = require("bcrypt");

// 宣告變數
let regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

// 定義User的資料結構
const User = db.define("User", {
    username: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

// 註冊帳號
router.post("/", async (req, res) => {
    try {
        let {username, email, password} = req.body;
        if (username === "" || email === "" || password === "") {
            res.json({result: "400", message: "Data is empty"});
        } else {
            if (!regex.test(email) || password.length < 6) {
                res.status(422).json({result: "422", message: "The email format is incorrect or the password length is less than 6"});
            } else {
                const insertValues = {
                    username: username,
                    password: bcrypt.hashSync(password, parseInt(process.env.BCRYPT_SALT_ROUNDS)),
                    email: email
                };
                db.sync().then(() => {
                    User.findOne({
                        where: {
                            email : email
                        }
                    }).then(user => {
                        if (user) {
                            res.status(403).json({result: "403", message: "Email is exist"});
                        } else {
                            User.create(insertValues).then(user => {
                                res.status(200).json({result: "200", message: "Successfully created record"});
                            })
                            .catch((err4) => {
                                res.status(403).json({result: "403", message: "Failed to created record"});
                            });
                        }
                    }).catch((err3) => {
                        res.status(403).json({result: "403", message: "Failed to read record"});
                    });
                }).catch((err2) => {
                    res.status(500).json({result: "500", message: "Database connection failed"});
                });
            }
        }
    } catch(err1) {
        res.status(404).json({result: "404", message: "Not found"});
    }
});

module.exports = router;