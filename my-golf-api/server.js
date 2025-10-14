// 1. 引入需要的套件
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

// 2. 建立 Express 應用程式
const app = express();
const port = 3000; // API 伺服器要跑在 3000 port

// 3. 使用 cors，允許你的 Vue 前端 (通常跑在 5173 port) 來存取 API
app.use(cors());

// 4. 【請填寫你的資料】設定 MySQL 資料庫連線資訊
const dbConfig = {
  host: 'localhost',         // 資料庫主機位置 (通常是 localhost)
  user: 'root',              // 你的 MySQL 使用者名稱 (預設是 root)
  password: 'apple123', // 換成你自己的 root 密碼
  database: 'golf_product'      // 你在 Workbench 建立的資料庫名稱
};


// 5. 建立 API 端點：獲取所有商品列表
//    前端只要呼叫 http://localhost:3000/api/product 就可以拿到所有商品
app.get('/api/product', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    // 從 `allProducts` 資料表中選取所有 (`*`) 資料
    const [rows] = await connection.execute('SELECT * FROM `allProducts`');
    await connection.end();
    res.json(rows); // 將結果以 JSON 格式回傳
  } catch (error) {
    console.error("查詢 allProducts 時發生錯誤:", error);
    res.status(500).json({ message: '伺服器發生錯誤' });
  }
});

// 6. 建立 API 端點：根據 ID 獲取單一商品
//    例如: http://localhost:3000/api/product/prod001
app.get('/api/product/:id', async (req, res) => {
  try {
    const { id } = req.params; // 從網址中取得 id
    const connection = await mysql.createConnection(dbConfig);
    // 使用 ? 作為佔位符，可以防止 SQL 注入攻擊，更安全
    const [rows] = await connection.execute('SELECT * FROM `allProducts` WHERE `firestoreId` = ?', [id]);
    await connection.end();

    if (rows.length > 0) {
      res.json(rows[0]); // MySQL 回傳的是陣列，我們只取第一筆
    } else {
      res.status(404).json({ message: '找不到該商品' });
    }
  } catch (error) {
    console.error(`查詢 ID: ${req.params.id} 時發生錯誤:`, error);
    res.status(500).json({ message: '伺服器發生錯誤' });
  }
});

// 7. 啟動後端伺服器
app.listen(port, () => {
  console.log(`✅ 後端 API 伺服器已成功啟動！`);
  console.log(`現在正在 http://localhost:${port} 上監聽請求...`);
});