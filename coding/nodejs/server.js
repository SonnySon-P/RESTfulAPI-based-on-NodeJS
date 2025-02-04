// 載入環境變數
require("dotenv").config();

// 載入index
const app = require("./index");

// 設定port
const port = 6001;

// 監聽
app.listen(port, () => {
    console.log(`Server running on port ${port}.`);
});