// 1. 引入需要的套件
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');


const app = express();   // Express 這個後端框架建立的應用程式實例
const port = 3000;       // API 伺服器要跑在 3000 port

//使用 cors，允許你的 Vue 前端 (通常跑在 5173 port) 來存取後端API
app.use(cors());     
// 【新增】使用 express.json() 這個中介軟體 (middleware)
// 就像在 API 伺服器門口裝一個包裹安檢機，
// 它會自動幫我們解析前端用 POST 請求送來的 JSON 格式資料，
// 這樣我們才能在後續的 req.body 中輕鬆取得資料。
app.use(express.json());



//設定 MySQL 資料庫連線資訊
const dbConfig = {
  host: 'localhost',         // 資料庫主機位置 (通常是 localhost)
  user: 'root',              // 你的 MySQL 使用者名稱 (預設是 root)
  password: 'apple123',      // 換成你自己的 root 密碼
  database: 'golf_product'   // 你在 Workbench 建立的資料庫名稱
};

//--------------------------------------------商品API--------------------------------------------
//建立 API 端點：獲取所有商品列表
//前端只要呼叫 http://localhost:3000/api/product 就可以拿到所有商品
//req請求，裝了前端傳來的資料，會放在req.body內
//res回應，當註冊成功或失敗時，後端會使用 res 來發送一個訊息或狀態碼回去給前端的 axios
app.get('/api/product', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    // 從 `allProducts` 資料表中選取所有 (`*`) 資料
    const [rows] = await connection.execute(' SELECT * FROM `allProducts` ');
    await connection.end();  //手動關閉連線
    res.json(rows); // 將結果以 JSON 格式回傳

  } catch (error) {
    console.error("查詢 allProducts 時發生錯誤:", error);
    res.status(500).json({ message: '伺服器發生錯誤' });
  }
});

//建立 API 端點：根據 ID 獲取單一商品
//例如: http://localhost:3000/api/product/prod001
app.get('/api/product/:id', async (req, res) => {
  try {
    const { id } = req.params; // 從網址中取得 id
    const connection = await mysql.createConnection(dbConfig);
    // 使用 ? 作為佔位符，可以防止 SQL 注入攻擊，更安全
    const [rows] = await connection.execute(' SELECT * FROM `allProducts` WHERE `firestoreId` = ?', [id]);
    await connection.end();  //手動關閉連線

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

//--------------------------------------------會員註冊API--------------------------------------------
//建立 API 端點：處理會員註冊
//前端 Vue 元件會對 http://localhost:3000/api/register 發送 POST 請求
app.post('/api/register', async (req, res) => {  
  try {
    const {username, email, password} = req.body   //解構賦值，把前端傳來的值從.body拿出來
    
    if(!username || !email || !password){
      return res.status(400).json({ message: '所有欄位都必須填寫' });
    }

    // 建立資料庫連線
    const connection = await mysql.createConnection(dbConfig);
    //【重要】在寫入資料庫前，先檢查 email 是否已經被註冊
    // 您的會員資料表叫做 `users`
    const [existingUsers] = await connection.execute('SELECT * FROM `user` WHERE `email` = ?', [email]);
    if(existingUsers.length>0){
      await connection.end();  
      return res.status(409).json({ message: '這個 Email 已經被註冊過了' });
    }
    // 將新使用者資料插入到 `user` 資料表中
    const [result] = await connection.execute('INSERT INTO `user` (`username`, `email`, `password`) VALUES (?, ?, ?)',[username, email, password]);
    await connection.end();  //手動關閉連線

    // 回傳 201 狀態碼 (表示成功建立資源)，並附上成功訊息
    res.status(201).json({ message: '會員註冊成功！' });
    
    }catch (error) { // 如果 try 區塊中的任何 `await` 操作失敗 (例如資料庫連線失敗)
    // 在後端伺服器的 console 中印出詳細錯誤，方便除錯
    console.error("註冊 API 發生錯誤:", error);
    // 回傳 500 狀態碼 (表示伺服器內部錯誤)，並附上通用錯誤訊息
    res.status(500).json({ message: '伺服器發生錯誤，註冊失敗' });
  }
});

//--------------------------------------------會員登入API--------------------------------------------
app.post('/api/login', async (req, res) => {
  try{
  const {username, email, password} = req.body   //解構賦值，把前端傳來的值從.body拿出來
  //建立資料庫連線
  const connection = await mysql.createConnection(dbConfig);
  const[result] = await connection.execute('SELECT * FROM `user` WHERE `username`=? AND `email`=? AND `password`=?' ,[username, email, password]);
  await connection.end();  //手動關閉連線

  if(result.length>0){
    const user = result[0];
    console.log("登入成功");
    console.log(result);
  }else{
    //找不到對應的會員，回傳 401 (Unauthorized)
    res.status(403).json({ message: 'Email 或密碼錯誤' });
    console.error('輸入錯誤',error);
  }
 }catch(error){
  console.error("登入時發生錯誤:", error);
    res.status(500).json({ message: '伺服器發生錯誤' });
 }
});


// 7. 啟動後端伺服器
app.listen(port, () => {
  console.log(`✅ 後端 API 伺服器已成功啟動！`);
  console.log(`現在正在 http://localhost:${port} 上監聽請求...`);
});