// 從 'vue-router' 引入建立路由需要的工具；
// createRouter: 用來建立 router 實例的工廠函式；
// createWebHistory: 用來建立一種路由模式。這種模式會使用瀏覽器原生的 History API 來改變網址，
// 看起來就像傳統的網站一樣 (例如 `http://example.com/about`)，
// 而不是使用 hash 模式 (`http://example.com/#/about`)；
import { createRouter, createWebHistory } from 'vue-router';

// 引入我們要當作「頁面」的元件
import Home from "../views/Home.vue";
import ProductDetail from "../views/ProductDetail.vue";
import Login from "../views/Login.vue";
import Cart from '../views/Cart.vue';
import Register from '../views/Register.vue';

// 定義我們的路由規則
const rt = [
    {
        path: "/",   //當使用者訪問網站根目錄時，路由的實際 URL 路徑
        name:"Home", //路由的代號名稱
        component: Home  //顯示HomeView元件
    },
    {   // :id 是一個「動態參數」，代表這裡可以接受任何商品 ID
        // 例如 /product/xxx
        path: "/product/:id",
        name: "ProductDetail",
        component: ProductDetail
    },
    {
        path: "/login",
        name: "Login",
        component: Login
    },
    
    {
        path: "/register",
        name: "Register",
        component: Register
    },

    {
        path: "/cart",
        name: "Cart",
        component: Cart
    }

];

// 建立 router 實體
const r = createRouter({
    history: createWebHistory(),
    routes: rt
});

//匯出這個 router 給 main.js 使用
export default r;
