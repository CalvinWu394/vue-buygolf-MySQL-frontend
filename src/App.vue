<script setup>
import { RouterLink, RouterView } from "vue-router";
//從我們剛剛建立的 cart.js 檔案中，引入 useCartStore 這個函式
import{ useCartStore } from "./stores/cart.js";

//呼叫函式來取得購物車 store 的遙控器；
const cartStore = useCartStore();


// 或是如果你打算在 App.vue 實作全站搜尋，可以保留它；
import { ref } from 'vue';
const searchTerm = ref('');

</script>

<template>
  <div id="app-container">
    <header class="header">
      <div class="logo">
        <RouterLink to="/">高爾夫球具商城</RouterLink>
      </div>
      <div class="search-bar">
        <input type="text" v-model="searchTerm" placeholder="搜尋商品名稱...">
      </div>
      <div class="user-actions">
        <RouterLink to="/Login">會員登入</RouterLink>
        <span>購物車 ({{ cartStore.cartCount }})</span>
      </div>
    </header>

    <main class="main-content">
      <RouterView />
    </main>

    <footer class="footer">
      <p>&copy; 2025 高爾夫球具商城. All rights reserved.</p>
      <p>公司地址 : 台北市信義區信義路777號</p>
    </footer>
  </div>
</template>

<style>
/* src/App.vue */

/* --- 全域樣式 --- */
:root {
  --primary-color: #004d40;
  --secondary-color: #e0f2f1;
  --text-color: #333;
  --light-gray: #f5f5f5;
}

body {
  font-family: 'Helvetica Neue', Arial, sans-serif;
  margin: 0;
  color: var(--text-color);
  background-color: var(--light-gray);
}

#app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 10;
}

.logo { 
  font-size: 1.5rem; 
  font-weight: bold; 
  color: var(--primary-color);
  /* 建議把 RouterLink 的樣式也放在這裡 */
  text-decoration: none; 
}

.user-actions span, .user-actions a {
  margin-left: 1.5rem;
  cursor: pointer;
  text-decoration: none;
  color: var(--text-color);
}

.main-content {
  flex-grow: 1;
  padding: 2rem;
}


.search-bar input {
  width: 300px;
  padding: 0.5rem;
  border-radius: 5px;
  border: 1px solid #ccc;
}



.footer {
  text-align: center;
  padding: 1.5rem;
  background-color: #333;
  color: white;
}


</style>





