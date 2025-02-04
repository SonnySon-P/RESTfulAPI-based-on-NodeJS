// 載入套件
const router = require("express").Router();
const {db, Sequelize} = require("./db");
const jwt = require("jsonwebtoken");

// 定義Post的資料結構
const Post = db.define("Post", {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    content: {
        type: Sequelize.STRING,
        allowNull: false
    },
    author: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

// 儲存貼文
router.post("/", async (req, res) => {
    try {
        const token = req.header("authorization");
        if (!token) {
            res.status(400).json({result: "400", message: "Not token"});
        } else {
            jwt.verify(token, process.env.JWT_SECREC_KEY, (err2, payload) => {
                if (err2) {
                    res.status(401).json({result: "401", message: "Not authorized"});
                } else {
                    if (new Date().getTime() <= payload.exp) {
                        let {title, content} = req.body;
                        if (title === "" || content === "") {
                            res.status(400).json({result: "400", message: "Data is empty"});
                        } else {
                            const insertValues = {
                                title: title,
                                content: content,
                                author: payload.username
                            };
                            db.sync().then(() => {
                                Post.create(insertValues).then(post => {
                                    res.status(200).json({result: "200", message: "Successfully created record"});
                                }).catch((err4) => {
                                    res.status(403).json({result: "403", message: "Failed to create record"});
                                });
                            }).catch((err3) => {
                                res.status(500).json({result: "500", message: "Database connection failed"});
                            });
                        }
                    } else {
                        res.status(401).json({result: "401", message: "Not authorized"});
                    }
                }
            });
        }
    } catch(err1) {
        res.status(404).json({result: "404", message: "Not found"});
    }
});

// 查詢貼文
router.get("/", async (req, res) => {
    try {
        const token = req.header("authorization");
        if (!token) {
            res.status(400).json({result: "400", message: "Not token"});
        } else {
            jwt.verify(token, process.env.JWT_SECREC_KEY, (err2, payload) => {
                if (err2) {
                    res.status(401).json({result: "401", message: "Not authorized"});
                } else {
                    if (new Date().getTime() <= payload.exp) {
                        let limit = req.query.limit;
                        let offset = req.query.offset;
                        db.sync().then(() => {
                            Post.findAll({}).then(post => {
                                let returnValue = "{result: 200, message: [";
                                if (limit == undefined && offset == undefined) {
                                    for (var i = 0; i < post.length; i++) {
                                        returnValue = returnValue + "{id: " + post[i].id + ", ";
                                        returnValue = returnValue + "title: " + post[i].title + ", ";
                                        returnValue = returnValue + "content: " + post[i].content + ", ";
                                        returnValue = returnValue + "author: " + post[i].author + ",";
                                        returnValue = returnValue + "createdAt: " + post[i].createdAt+ "},";
                                    }
                                    returnValue = returnValue + "]}";
                                    res.status(200).json(returnValue);
                                } else {
                                    if (offset + limit <= post.length) {
                                        for (var i = offset; i < offset + limit; i++) {
                                            returnValue = returnValue + "{id: " + post[i].id + ", ";
                                            returnValue = returnValue + "content: " + post[i].content + ", ";
                                            returnValue = returnValue + "author: " + post[i].author + ",";
                                            returnValue = returnValue + "createdAt: " + post[i].createdAt+ "},";
                                        }
                                        returnValue = returnValue + "]}"
                                        res.status(200).json(returnValue);
                                    } else {
                                        res.status(403).json({result: "403", message: "Search condition out of range"});
                                    }
                                }
                            }).catch((err3) => {
                                res.status(500).json({result: "500", message: "Database connection failed"});
                            });
                        });
                    } else {
                        res.status(401).json({result: "401", message: "Not authorized"});
                    }
                }
            });
        }
    } catch(err1) {
        res.status(404).json({result: "404", message: "Not found"});
    }
});

// 修改貼文
router.put("/", async (req, res) => {
    try {
        const token = req.header("authorization");
        if (!token) {
            res.status(400).json({result: "400", message: "Not token"});
        } else {
            jwt.verify(token, process.env.JWT_SECREC_KEY, (err2, payload) => {
                if (err2) {
                    res.status(401).json({result: "401", message: "Not authorized"});
                } else {
                    if (new Date().getTime() <= payload.exp) {
                        let id = req.query.id;
                        let {title, content} = req.body;
                        if (id == undefined || title === "" || content === "") {
                            res.status(400).json({result: "400", message: "Data is empty"});
                        } else {
                            db.sync().then(() => {
                                Post.update({
                                        title: req.body.title,
                                        content: req.body.content
                                    }, 
                                    {
                                        where: {
                                            id: id,
                                            author: payload.username
                                        }
                                }).then(() => {
                                    res.status(200).json({result: "200", message: "Successfully update record"});
                                }).catch((err4) => {
                                    return res.status(403).json({result: "403", message: "Failed to update record"});
                                });
                            }).catch((err3) => {
                                res.status(500).json({result: "500", message: "Database connection failed"});
                            });
                        }
                    } else {
                        res.status(401).json({result: "401", message: "Not authorized"});
                    }
                }
            });
        }
    } catch(err1) {
        res.status(404).json({result: "404", message: "Not found"});
    }
});

// 刪除貼文
router.delete("/", async (req, res) => {
    try {
        const token = req.header("authorization");
        if (!token) {
            res.status(400).json({result: "400", message: "Not token"});
        } else {
            jwt.verify(token, process.env.JWT_SECREC_KEY, (err2, payload) => {
                if (err2) {
                    res.status(401).json({result: "401", message: "Not authorized"});
                } else {
                    if (new Date().getTime() <= payload.exp) {
                        let id = req.query.id;
                        if (id == undefined) {
                            res.status(400).json({result: "400", message: "Id is empty"});
                        } else {
                            db.sync().then(() => {
                                Post.destroy({
                                    where: {
                                        id: id,
                                        author: payload.username
                                    }
                                }).then(() => {
                                    res.status(200).json({result: "200", message: "Successfully delete record"});
                                }).catch((err4) => {
                                    res.status(403).json({result: "403", message: "Failed to delete record"});
                                });
                            }).catch((err3) => {
                                res.status(403).json({result: "500", message: "Database connection failed"});
                            });
                        }
                    } else {
                        res.status(401).json({result: "401", message: "Not authorized"});
                    }
                }
            });
        }
    } catch(err1) {
        res.status(404).json({result: "404", message: "Not found"});
    }
});

module.exports = router;