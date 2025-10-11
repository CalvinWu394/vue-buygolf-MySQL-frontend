import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

// 建立 Vue App 實例；
const app = createApp(App);
// 建立 Pinia 實例，就像建立一個總倉庫管理員；
const pinia = createPinia();

// 透過 .use() 方法告訴 Vue App 我們要使用 Pinia；
app.use(pinia);

// 也要告訴 Vue App 我們要使用 router；
app.use(router);

// 最後才掛載到index.html
app.mount('#app');
