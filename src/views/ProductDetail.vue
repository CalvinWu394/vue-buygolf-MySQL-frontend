<script setup>
import { ref, onMounted } from "vue";
// 引入抓取單一文件的方法
//import { doc, getDoc, getDocs } from "firebase/firestore"; 
//import { db } from "../firebase/config.js";

import { useRoute } from "vue-router";
//從建立的 cart.js 檔案中，引入 useCartStore 這個函式
import{ useCartStore } from "../stores/cart.js";

import axios from "axios";

const route = useRoute();  // 取得 route 物件
const oneProduct = ref(null); // 用來存放單一商品資料
const loading = ref(true); // 載入狀態
const errorMsg = ref("");
const quantity = ref(1);

//呼叫 useCartStore() 來取得購物車 store 的實例
//你可以把 cartStore 想像成是通往「購物車倉庫」的遙控器
const cartStore = useCartStore();


//從網址參數中取得商品 ID
//瀏覽 /product/abc，那麼 route.params.id 的值就是 "abc"
const productId = route.params.id;
console.log(route.params.id);

const axiosData = async () =>{
  try{
    const response = await axios.get(`http://localhost:3000/api/product/${productId}`);
    oneProduct.value  = response.data;
  }catch(error){
    console.error(error);
    console.error(error.response);
    console.error(error.response.status);
  }finally{
    loading.value = false;
  }
};

onMounted(() => {
  axiosData();
})


//等待onMounted()來呼叫連接資料庫
/*const fetchData = async () => {
try{
  const docSnap = await getDoc(doc(db, "allProducts", productId));
  if (docSnap.exists()) {
    const openData = docSnap.data();   //先呼叫 .data() 這個函式，把包裹打開，才能拿到裡面的東西
    product.value = { 
      firestoreId: docSnap.id,
      name: openData.name,
      category: openData.category,
      price: openData.price,
      image: openData.image,
      rating: openData.rating,
      description: openData.description,
    }
  }
  else {
        // 這是「預期中」的查無資料，不算是一個系統錯誤
        console.log("找不到此商品!");
        errorMsg.value = '很抱歉，我們找不到您要的商品。';
    }
  }catch (error) {
    // 【Catch 區塊】：如果 try 區塊中發生任何非預期的錯誤（網路、權限等），就會跳到這裡
    console.error("讀取商品詳細資料時發生錯誤:", error);
    // 我們可以設定一個對使用者友善的錯誤訊息
    errorMsg.value = '載入資料時發生問題，請稍後再試或聯繫客服。';
  } finally {
    // 【Finally 區塊】：不論 try 成功或 catch 捕捉到錯誤，這裡的程式碼「永遠」會被執行
    // 這是用來確保 loading 狀態一定會被解除的最佳位置
    loading.value = false;
}
};


onMounted(() => {
  fetchData();
})*/

// 加入購物車的處理函式
function checkCart(){
 /*檢查庫存
 if (quantity.value > product.value.stock){
  alert("庫存不足");
  return;
 }*/
 cartStore.addToCart(oneProduct.value, quantity.value);
};


</script>



  <template>
  <!-- 這邊的v-if是用來等待時間差，讓MySQL把資料塞進product  -->
  <div class="product-page-container">
    <div v-if="loading" class="status-message">載入中...</div>   
    
    <div v-else-if="errorMsg" class="status-message error">{{ errorMsg }}</div>
    
    <div v-else-if="oneProduct">
      <nav class="breadcrumb">
        <!-- <RouterLink to="/">首頁</RouterLink>  -->
        <span>{{ oneProduct.category }} >></span> 
        <span>{{ oneProduct.name }}</span>
      </nav>

      <div class="product-detail-card">
        <div class="image-gallery">
          <img :src="oneProduct.image" :alt="oneProduct.name" class="product-image">
        </div>

        <div class="product-info">
          <div>
            <span class="category-tag">{{ oneProduct.category }}</span>
            <h1>{{ oneProduct.name }}</h1>
            <p class="description">{{ oneProduct.description }}</p>
          </div>
          
          <div class="purchase-section">
            <p class="price">NT$ {{ oneProduct.price }}</p>
            <div class="actions">
              <div class="quantity-selector">
                <label for="quantity">數量:</label>
                <input type="number" id="quantity" v-model="quantity" min="1">
              </div>
              <button @click.prevent="checkCart" class="add-to-cart-btn">加入購物車</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  


<style scoped>

.stock-info {
  font-size: 0.9rem;
  color: #757575;
  margin-top: 1rem;
}


.product-page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.status-message {
  text-align: center;
  padding: 4rem 0;
  color: #777;
}
.status-message.error {
  color: #c62828;
}

.breadcrumb {
  margin-bottom: 1.5rem;
  color: #555;
  font-size: 0.9rem;
}
.breadcrumb a {
  color: var(--primary-color, #004d40);
  text-decoration: none;
}
.breadcrumb a:hover {
  text-decoration: underline;
}
.breadcrumb span {
  margin: 0 0.5rem;
}

.product-detail-card {
  display: flex;
  gap: 2rem;
  background-color: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.image-gallery {
  flex: 1 1 50%; /* 佔 50% 寬度 */
  display: flex;
  justify-content: center;
  align-items: center;
}
.product-image {
  max-width: 100%;
  max-height: 500px;
  border-radius: 8px;
  object-fit: cover;
}

.product-info {
  flex: 1 1 50%; /* 佔 50% 寬度 */
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* 讓價格和按鈕區塊能往下推 */
}

.category-tag {
  display: inline-block;
  background-color: var(--secondary-color, #e0f2f1);
  color: var(--primary-color, #004d40);
  padding: 0.25rem 0.75rem;
  border-radius: 99px; /* 藥丸形狀 */
  font-size: 0.8rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

h1 {
  font-size: 2.2rem;
  margin: 0.5rem 0 1rem;
  line-height: 1.2;
}

.description {
  
  color: #555;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.purchase-section {
  border-top: 1px solid #eee;
  padding-top: 1.5rem;
  margin-top: 1rem;
}

.price {
  font-size: 2rem;
  font-weight: bold;
  color: var(--primary-color, #004d40);
  margin: 0 0 1.5rem;
}

.actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.quantity-selector {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.quantity-selector input {
  width: 50px;
  padding: 0.5rem;
  text-align: center;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.add-to-cart-btn {
  background-color: var(--primary-color, #004d40);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: background-color 0.2s, transform 0.1s;
}
.add-to-cart-btn:hover {
  background-color: #00695c;
  transform: scale(1.02);
}

/* --- RWD --- */
@media (max-width: 768px) {
  .product-detail-card {
    flex-direction: column;
    padding: 1.5rem;
  }
  h1 {
    font-size: 1.8rem;
  }
  .price {
    font-size: 1.75rem;
  }
}
</style>