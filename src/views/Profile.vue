<script setup>
import { useUserStore } from '../stores/user.js';
//建立響應式變數
import { ref } from 'vue';
//從 'vue-router' 引入 useRouter，我們需要它來跳轉頁面；
import { useRouter } from 'vue-router';

// 取得 store 和 router 的遙控器
const userStore = useUserStore();
const router = useRouter();

const newPassword = ref('');
const confirmPassword = ref('');


const userUpdatePassword = async () =>{
    //為第二道防線，再次判斷密碼是否兩者相同，密碼是否有輸入
    if(!newPassword){
        alert('密碼不得為空');
        return;
    }
    if(newPassword.value !== confirmPassword.value){
        alert('密碼兩次輸入不相同');
        return;
    }
    // 為第三道防線，呼叫 store 裡的 updatePassword 動作
    const success = await userStore.updatePassword(newPassword.value);
        if(success){
            alert('密碼更新成功！');
            //把輸入格清空
            newPassword.value = ' ';
            confirmPassword.value = ' ';
        }else{
            alert('密碼更新失敗！');
        }
};

const usertDeleteAccount = async () =>{
    //提醒使用者再次確認是否刪除帳號
    alert('提醒您，刪除後即無法復原');
    // 呼叫 store 裡的 deleteAccount 動作
    const success = await userStore.deleteAccount();
        if(success){
            alert('帳戶已成功刪除');
            //跳轉到首頁
            router.push('/');
        }else{
            alert('帳戶刪除失敗');
        }
};

</script>


<template>
  <div class="profile-container">
    <div class="profile-box">
      <h2>會員中心</h2>
      
      <div class="info-section">
        <h3>您的資訊</h3>
        <p><strong>Email:</strong> {{ userStore.userInformation.email }}</p>
      </div>

      <div class="action-section">
        <h3>更新密碼</h3>
        <form @submit.prevent="userUpdatePassword">  <!-- 為第二道防線，函式判斷密碼是否輸入相同，密碼是否有輸入 --> 
          <div class="form-group">
            <label for="new-password">新密碼</label>
            <input type="password" id="new-password" v-model="newPassword" required>   <!--為第一道防線，required屬性，若表格內未輸入會跳出提示-->
          </div>
          <div class="form-group">
            <label for="confirm-password">確認新密碼</label>
            <input type="password" id="confirm-password" v-model="confirmPassword" required>  <!--required屬性，若表格內未輸入會跳出提示-->
          </div>
          <button type="submit" class="btn-update">更新密碼</button>
        </form>
      </div>

      <div class="action-section danger-zone">
        <h3>刪除帳號</h3>
        <p>刪除帳號後，所有資料將無法復原。</p>
        <button @click="usertDeleteAccount" class="btn-delete">刪除我的帳號</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-container {
  max-width: 600px;
  margin: 2rem auto;
}
.profile-box {
  background-color: white;
  padding: 2.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
h2 {
  text-align: center;
  margin-top: 0;
  margin-bottom: 2rem;
  color: var(--primary-color);
}
.info-section, .action-section {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #eee;
}
.action-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}
h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: #333;
}
.form-group {
  margin-bottom: 1rem;
}
label {
  display: block;
  margin-bottom: 0.5rem;
}
input[type="password"] {
  width: 100%;
  padding: 0.7rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
}
button {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  font-weight: bold;
}
.btn-update {
  background-color: var(--primary-color);
}
.btn-update:hover {
  background-color: #00382e;
}
.danger-zone {
  border-color: #fdd;
}
.danger-zone p {
  font-size: 0.9rem;
  color: #777;
}
.btn-delete {
  background-color: #c62828;
}
.btn-delete:hover {
  background-color: #a02020;
}
</style>