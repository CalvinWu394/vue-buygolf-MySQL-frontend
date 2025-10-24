// 從 'vue' 這個套件中，引入 createApp 這個函式；
// createApp 是 Vue 3 組合式 API 的起手式，用來建立我們的 Vue 應用程式實例；
import { createApp } from 'vue';

// 從 'pinia' 這個套件中，引入 createPinia 這個函式；
// Pinia 是 Vue 官方推薦的狀態管理工具，可以把它想像成是整個應用程式的「中央大腦」或「總倉庫」，
// 負責管理所有元件共享的資料（例如購物車）；
import { createPinia } from 'pinia';

// 引入我們應用程式的「根元件」App.vue；
// 根元件就像是俄羅斯娃娃的最大那一層，所有其他的元件都會被包在它裡面；
import App from './App.vue';

// 引入我們設定好的路由設定檔；
import router from './router';



// 建立 Vue App 實例，並告訴它我們的根元件是 App.vue；
// 這就像是告訴總指揮：「我們的戲劇主角是 App！」；
const app = createApp(App);

// 建立 Pinia 實例，就像建立一個總倉庫管理員；
const pinia = createPinia();

// 透過 .use() 方法告訴 Vue App 我們要使用 Pinia；
app.use(pinia);

// 告訴 Vue App 我們將 router設為全域變數
app.use(router);

// 最後才掛載到index.html
app.mount('#app');
