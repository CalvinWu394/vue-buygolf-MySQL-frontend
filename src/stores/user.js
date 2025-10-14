//建立響應式的狀態
import { ref } from 'vue';
// 從 'pinia' 引入 defineStore 這個函式，這是定義 store 的起手式；
import { defineStore } from 'pinia';

//我們將用它來跟後端 API 溝通；
import axios from 'axios';

// 這裡我們開始定義一個新的 store；
// 'user' 是這個 store 的唯一 ID，就像是這個倉庫的名字；
// 第二個參數是一個函式，格式類似元件的 <script setup>，我們可以在裡面定義狀態、動作等；
export const useUserStore = defineStore("user", () => {
    // 【狀態 (State)】
    // 建立一個名為 user 的 ref，初始值為 null；
    // 這就像在倉庫裡準備一個叫 "user" 的空箱子，之後用來存放登入成功的會員資料；
    const userInformation = ref(null);
    
    // 建立一個名為 isLoggedIn 的 ref，初始值為 false；
    // 這是一個旗標，用來判斷使用者是否已經登入；
    const isLoggedIn = ref(false);
    
    // 【動作 (Actions)】
    // 這裡我們定義一個名為 login 的函式，它是一個非同步 (async) 函式；
    // 這個函式負責處理登入的邏輯，它接收name、email、password 作為參數；
    const login = async(username, email, password) =>{
        try{
            const response = await axios.post('http://localhost:3000/api/login', {username, email, password});
            // 如果登入成功 (後端回傳資料)，我們就把回傳的會員資料存到 userInformation 這個 ref 裡；
            userInformation.value = response.data;
            console.log(userInformation.value );
            // 同時，把 isLoggedIn 的旗標設為 true；
            isLoggedIn.value = true;
            console.log(`登入成功: ${response.data}`);

            return true;  //會回傳給 Login.vue 的 success
        
        }catch(error){
            console.error('登入失敗:',error.response.data);
            userInformation.value = null;
            isLoggedIn.value = false;
            
            return false;  //會回傳給 Login.vue 的 success
        } 
    }

       // 最後要 export，這樣其他的元件才能使用它們；
        return{
        userInformation,
        isLoggedIn,
        login
    };


});