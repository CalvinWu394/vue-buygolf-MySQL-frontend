<script setup>
import { ref } from 'vue';
import axios from 'axios';

const username = ref('');
const email = ref('');
const password = ref('');

const axiosRegister = async () => {
    if( !username.value.trim()|| !email.value.trim() || !password.value.trim() ){
        alert('尚未輸入內容');
        return;
    }
    const all = {
      username: username.value, 
      email: email.value, 
      password: password.value
    }

    try{
    const response = await axios.post('http://localhost:3000/api/register', all);
    console.log(response.data);
    alert('註冊成功！');   
    
    }catch(error){
    //如果請求失敗，把錯誤訊息印在 console，方便除錯
    //後端API若跳出錯誤 res.status(401).json({ message: 'Email 或密碼錯誤' });
    //error.response.data 拿到了 { "message": "Email 或密碼錯誤" } 這個物件。
    //error.response.data.message 成功取得後端的字串 'Email 或密碼錯誤'。
    console.error('註冊失敗:', error.response.data.message);   
    //同時也用 alert 提醒使用者
    alert('註冊失敗');
  }
}

</script>

<template>
<div class="register-container">
    <div class="register-box">
      <h2>會員註冊</h2>
      <form @submit.prevent="axiosRegister">
        <div class="form-group">
          <label for="username">使用者名稱</label>
          <input type="text" id="username" v-model="username" required placeholder="請輸入您的名稱">
        </div>
        <div class="form-group">
          <label for="email">電子郵件</label>
          <input type="email" id="email" v-model="email" required placeholder="請輸入您的 Email">
        </div>
        <div class="form-group">
          <label for="password">密碼</label>
          <input type="password" id="password" v-model="password" required placeholder="請輸入您的密碼">
        </div>
        <button type="submit">註冊</button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.register-container {
  display: flex; /* 使用 Flexbox 彈性盒子佈局 */
  justify-content: center; /* 讓子項目在主軸 (水平) 上置中 */
  align-items: center; /* 讓子項目在交錯軸 (垂直) 上置中 */
  width: 100%; /* 寬度佔滿父容器 */
  flex-grow: 1; /* 讓這個容器填滿 <main> 剩餘的所有空間 */
  background-color: var(--light-gray, #f5f5f5); /* 使用 App.vue 定義好的全域 CSS 變數 */
}

.register-box {
  width: 100%; /* 寬度預設為 100% */
  max-width: 400px; /* 但最大寬度不超過 400px，避免在電腦大螢幕上看起來太寬 */
  padding: 2.5rem; /* 內部留白空間 */
  background-color: white; /* 背景色為白色 */
  border-radius: 8px; /* 圓角 */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* 加上一些陰影讓它有立體感 */
  text-align: center; /* 讓標題和按鈕文字置中 */
}

h2 {
  margin-top: 0; /* 移除標題上方的預設邊距 */
  margin-bottom: 1.5rem; /* 標題和表單之間的距離 */
  color: var(--primary-color, #004d40); /* 使用全域變數的主題色 */
  font-size: 1.8rem; /* 字體大小 */
}

.form-group {
  margin-bottom: 1.5rem; /* 每個輸入項之間的距離 */
  text-align: left; /* 讓 label 和 input 靠左對齊 */
}

label {
  display: block; /* 讓 label 變成區塊元素，單獨佔一行 */
  margin-bottom: 0.5rem; /* label 和 input 之間的距離 */
  font-weight: 600; /* 字體加粗 */
  color: #555; /* 字體顏色 */
}

input[type="text"],
input[type="email"],
input[type="password"] {
  width: 100%; /* 寬度填滿容器 */
  padding: 0.8rem 1rem; /* 輸入框的內部空間 */
  border: 1px solid #ccc; /* 邊框樣式 */
  border-radius: 5px; /* 輸入框圓角 */
  font-size: 1rem; /* 字體大小 */
  box-sizing: border-box; /* 這是重要的 CSS 屬性，確保 padding 和 border 不會增加元素的總寬度 */
  transition: border-color 0.2s, box-shadow 0.2s; /* 當樣式改變時，加上 0.2 秒的過渡動畫，看起來更滑順 */
}

/* 當使用者點擊 (focus) 輸入框時的樣式 */
input[type="text"]:focus,
input[type="email"]:focus,
input[type="password"]:focus {
  outline: none; /* 移除瀏覽器預設的藍色外框 */
  border-color: var(--primary-color, #004d40); /* 邊框顏色變成主題色 */
  box-shadow: 0 0 0 3px rgba(0, 77, 64, 0.1); /* 加上一個柔和的光暈效果，提升使用者體驗 */
}

button {
  width: 100%; /* 寬度填滿 */
  padding: 0.8rem 1rem; /* 內部空間 */
  border: none; /* 移除邊框 */
  border-radius: 5px; /* 圓角 */
  background-color: var(--primary-color, #004d40); /* 背景使用主題色 */
  color: white; /* 文字為白色 */
  font-size: 1.1rem; /* 字體大小 */
  font-weight: bold; /* 字體加粗 */
  cursor: pointer; /* 滑鼠移上去時，游標變成手指形狀 */
  transition: background-color 0.2s, transform 0.1s; /* 過渡動畫 */
  margin-top: 1rem; /* 和上方元素的距離 */
}

/* 滑鼠移到按鈕上時的樣式 */
button:hover {
  background-color: #00382e; /* 讓背景色變深一點，提供回饋感 */
}

/* 點擊按鈕時的樣式 */
button:active {
  transform: scale(0.98); /* 讓按鈕稍微縮小，模擬被按下去的感覺 */
}

</style>