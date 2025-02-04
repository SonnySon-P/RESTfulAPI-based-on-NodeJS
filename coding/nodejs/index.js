// 載入套件
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

// 宣告變數
const app = express();
const whiteList = ["127.0.0.1", "localhost"];

// 中介軟體
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use((req, res, next) => {
    const clientIP = req.ip;
    const clientHost = req.hostname;
    if (whiteList.includes(clientIP) || whiteList.includes(clientHost)) {
        next();
    } else {
        res.status(451).json({result: "451", message: "Not on whitelist"});
    }
});

// API文件
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// 首頁
app.get("/", (req, res) => {
    try {
        res.status(200).json({result: "200", message: "Welcome! This is the API server, Please enter the appropriate path"});
    } catch(err) {
        res.status(404).json({result: "404", message: "Not found"});
    }
});

// 路由
const register = require("./register");
const login = require("./login");
const posts = require("./posts");
app.use("/api/register", register);
app.use("/api/login", login);
app.use("/api/posts", posts);

module.exports = app;