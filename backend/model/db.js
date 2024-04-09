// 导入mongoose模块
const mongoose = require("mongoose");
// 连接服务
mongoose.connect("mongodb://127.0.0.1:27017/Todos");

let conn = mongoose.connection;

// 成功回调
conn.once("open", () => {
  console.log("Database connection successful");
});

// 失败回调
conn.on("error", () => {
  console.log("Database connection failure");
});

// 连接关闭回调
conn.on("close", () => {
  console.log("Connection close");
});

module.exports = mongoose;
