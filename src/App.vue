<script setup>
//從建立的 cart.js 檔案中，引入 useCartStore 這個函式
import { useCartStore } from "./stores/cart.js";
import { useUserStore } from './stores/user.js';

//呼叫函式來取得 store 的遙控器；
const cartStore = useCartStore();
const userStore = useUserStore();




</script>

<template>
  <div id="app-container">
    <header class="header">
      <div class="logo">
        <RouterLink to="/">G Zone</RouterLink>   <!-- 不需要再次import,因為在main.js透過 app.use(router)已經有宣告為全域 -->
      </div>
      
      <div class="user-actions">
        <template v-if="!userStore.isLoggedIn">
        <RouterLink to="/login">會員登入</RouterLink>
        </template>

        <template v-else>
          <span class="welcome-message">歡迎您, {{ userStore.userInformation.email }}</span>
        </template>



        <RouterLink to="/cart">購物車 ({{ cartStore.cartCount }})</RouterLink>
      </div>
    </header>

    <main class="main-content">
      <RouterView />      <!-- 其隨著 <router-link> 的路徑切換，負責顯示出匹配當前路徑的元件內容 -->
    </main>

    <footer class="footer">
      <p>&copy; 2025 高爾夫球具商城. All rights reserved.</p>
      <p>公司地址 : 台北市信義區信義路777號</p>
    </footer>
  </div>
</template>

<style>

.welcome-message {
  color: var(--primary-color);
  font-weight: bold;
}



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


.footer {
  text-align: center;
  padding: 1.5rem;
  background-color: #333;
  color: white;
}


</style>





