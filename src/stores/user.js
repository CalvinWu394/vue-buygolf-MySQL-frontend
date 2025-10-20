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
    const login = async(getUsername, getEmail, getPassword) =>{
        try{
            //將傳進來的值，改為JSON格式
            const all = {
                username: getUsername,
                email: getEmail,
                password: getPassword
            };

            //向後端伺服器發送一個POST請求，response 接收回來的格式是由 axios 打包好的JavaScript 物件 (Object)
            const response = await axios.post('http://localhost:3000/api/login', all);
            //如果登入成功把回傳的資料存到 userInformation 這個 ref 裡，其他頁面可以抓取裡面資料
            userInformation.value = response.data;
            
            //可以看到後端使用res.json回傳的資訊
            //console.log(userInformation.value);
            
            //同時，把 isLoggedIn 的旗標設為 true；
            isLoggedIn.value = true;
            console.log('登入成功');

            //會回傳給 Login.vue 的 success
            return true;  
        
        }catch(error){
            console.error('登入失敗:',error.response.data);
            userInformation.value = null;
            isLoggedIn.value = false;
            
            //會回傳給 Login.vue 的 success
            return false;  
        } 
    }

    const logout = () =>{
        userInformation.value = null;  //會使用null是因為userInformation一開始就定義裡面會放物件
        isLoggedIn.value = false;
    }

    const updatePassword = async (getNewPassword) =>{
        // 為第三道防線檢查使用者是否登入，以及 userInformation 物件、 userInformation.id 是否存在
        /*if(!isLoggedIn.value || !userInformation.value || userInformation.value.id){
            console.log(isLoggedIn.value,userInformation.value,userInformation.value.id);
            alert("請登入");
            return false;
        }*/
       if(!isLoggedIn.value){
            alert("請登入");
            return false;
        }

        try{
            //取得目前登入使用者的 ID
            const userId = userInformation.value.id;

            const all = {
                password: getNewPassword
            };

            //使用 axios.put 向後端發送請求，第二個參數要為JSON格式
            //使用樣板字串 `` 來動態嵌入 userId

            await axios.put(`http://localhost:3000/api/user/${userId}`, all);
            return true;
        
        }catch(error){
            console.error('更新錯誤')
            return false;

        }
    };

    const deleteAccount = async () =>{
        // 為第三道防線檢查使用者是否登入，以及 userInformation 物件、 userInformation.id 是否存在
        if(isLoggedIn.value || !userInformation.value || userInformation.value.id){
            alert("請登入");
            return false;
        }
        try{
            //取得目前登入使用者的 ID
            const userId = userInformation.value.id;
            
            //使用 axios.delete 向後端發送刪除請求
            await axios.delete(`http://localhost:3000/api/user/${userId}`);
            // 帳號刪除成功後，前端也應該執行登出邏輯，清空使用者狀態
            logout();
            return true;

        }catch(error){
            console.error('刪除失敗');
            return false;

        }
    };


        // 最後要 export，這樣其他的元件才能使用它們；
        return{
        userInformation,
        isLoggedIn,
        login,
        logout,
        updatePassword,
        deleteAccount
    };
});