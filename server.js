// server.js

const express = require("express");
require("dotenv").config(); // 必须放最顶端，确保最早加载 .env
const { MongoClient } = require("mongodb");

const app = express();
const port = 3000;

// 通过环境变量读取 URL（你的环境已验证成功）
const mongoUrl = process.env.MONGO_URL;

// 延迟创建 client，不在文件顶部立即 new（避免 undefined）
let client;

// 初始化数据库并返回集合
async function getCollection() {
    try {
        // 若客户端不存在，则创建
        if (!client) {
            client = new MongoClient(mongoUrl);
            await client.connect();
            console.log("MongoDB 连接成功");
        }

        const db = client.db("my_web_db");
        const collection = db.collection("user_info");

        // 检查数据是否存在
        const count = await collection.countDocuments();
        if (count === 0) {
            await collection.insertMany([
                { name: "张三", age: 25 },
                { name: "李四", age: 28 },
                { name: "王五", age: 22 }
            ]);
            console.log("已插入初始化数据");
        }

        return collection;

    } catch (err) {
        console.error("数据库初始化失败：", err);
        throw err;
    }
}

// 静态文件托管
app.use(express.static("public"));

// API：获取全部用户信息
app.get("/api/users", async (req, res) => {
    try {
        const collection = await getCollection();
        const data = await collection.find().toArray();
        res.json(data);
    } catch (err) {
        res.status(500).json({
            message: "获取数据失败",
            error: err.message
        });
    }
});

// 启动服务器
app.listen(port, () => {
    console.log(`服务器已启动：http://localhost:${port}`);
});
