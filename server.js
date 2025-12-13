// server.js

const express = require("express");
require("dotenv").config(); // 必须放在顶部，最早加载 .env
const { MongoClient } = require("mongodb");

const app = express();
const port = 3000;

// 从 .env 读取 MongoDB URL 和数据库名
const mongoUrl = process.env.MONGO_URL;
const dbName = process.env.DB_NAME;

// 延迟创建客户端，避免 undefined
let client;

// 初始化数据库并返回集合
async function getCollection() {
    try {
        if (!client) {
            client = new MongoClient(mongoUrl);
            await client.connect();
            console.log("MongoDB 连接成功");
        }

        const db = client.db(dbName);
        const collection = db.collection("user_info");

        // 如果集合为空，插入初始数据
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

// API：获取用户列表
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
