const express = require("express");
const app = express();
const port = 3000;

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Update data into the body-parser module
const bodyParser = require("body-parser");
// Configure the body-parser module
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  //Configure for cross-domain, allowing access from any source
  res.header("Access-Control-Allow-Origin", "*");
  // Allows the Content-Type header to be included in the front-end request
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

let { todosModel } = require("./model/todosModel");

app.get("/", (req, res) => {
  res.send("Hello world");
});

// Get the full task list
app.get("/getTodosList", async (req, res) => {
  let data;
  switch (req.query.cate) {
    case "complete":
      data = await todosModel.find().where({
        status: "2",
      });
      break;
    case "active":
      data = await todosModel.find().where({
        status: "1",
      });
      break;
    default:
      data = await todosModel.find();
      break;
  }
  res.send({ data });
});

// 新加任务
app.post("/addTodosItem", async function (req, res) {
  await todosModel.create(req.body);
  res.send({
    code: 200,
    msg: "successfully added",
  });
});

// 删除任务中某一条，通过改变状态的方式删除，方便后续添加恢复功能
// 删除，恢复，修改,完成任务功能全部走的这一个接口
// 任务项的状态所表示的意义:
// 0 + 1或2 字符串 -- 已删除,
// 1 -- 正在进行,
// 2 -- 已完成
// 删除在恢复任务项,删除前是什么状态,恢复后就是什么状态
app.post("/deleteTodosItem", async (req, res) => {
  // res.header('Access-Control-Allow-Headers', 'Content-Type')
  let body = req.body;
  console.log("refresh data", req.body);
  let date = {
    text: body.text,
    status: body.status,
    time: body.time,
  };
  await todosModel.findByIdAndUpdate(body._id, { $set: { ...date } });
  res.send({
    code: 200,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
