<script setup>
import { ref, onMounted } from "vue";
import { doc, getDocs } from "firebase/firestore"; // 引入抓取單一文件的方法
import { db } from "../firebase/config.js";
import { useRoute } from "vue-router";

const route = useRoute(); // 取得 route 物件
const product = ref(null); // 用來存放單一商品資料
const loading = ref(true); // 載入狀態

// 從網址參數中取得商品 ID
const productId = route.params.id;

/*const all = ref([]);
const categories = ref([]);
const selectedCategory = ref('全部');
const search = ref('');
const cart = ref([]);
categories.value = ["全部","高爾夫球","球具","配件"];*/

//等待onMounted()來呼叫連接資料庫
const fetchData = async () => {
try{
  const docSnap = await getDocs(doc(db, "allProducts", productId));
  if (docSnap.exists()) {
    product.value = { 
      id: docSnap.id,
      name: docSnap.name,
      category: docSnap.category,
      price: docSnap.price,
      image: docSnap.image,
      rating: docSnap.rating,
      description: docSnap.description
    }}else {
        // 這是「預期中」的查無資料，不算是一個系統錯誤
        console.log("找不到此商品!");
        errorMsg.value = '很抱歉，我們找不到您要的商品。';
    }
  }catch (error) {
    // 【Catch 區塊】：如果 try 區塊中發生任何非預期的錯誤（網路、權限等），就會跳到這裡
    console.error("讀取商品詳細資料時發生錯誤:", error);
    // 我們可以設定一個對使用者友善的錯誤訊息
    errorMsg.value = '載入資料時發生問題，請稍後再試或聯繫客服。';
}finally {
    // 【Finally 區塊】：不論 try 成功或 catch 捕捉到錯誤，這裡的程式碼「永遠」會被執行
    // 這是用來確保 loading 狀態一定會被解除的最佳位置
    loading.value = false;
}
};

onMounted(() => {
  fetchData();
})


/*const get = async function(){
    try{
      // 告訴 Firebase 我們要去讀取 'products' 這個集合的所有文件
      const getData = await getDocs(collection(db, "allProducts"));
      console.log(getData.docs);
      // 直接使用 map() 處理 querySnapshot.docs 陣列
      // map() 會自動產生一個新陣列，我們直接把它存入 ref
      all.value = getData.docs.map(dd =>{
        return{
          id: dd.id,
          name: dd.name,
          category: dd.category,
          price: dd.price,
          image: dd.image,
          rating: dd.rating,
          description: dd.description
        }
      });
      
      const uniqueCategories = ["全部"]
      //使用 for...of 迴圈可以印出陣列的值
      for(const pp of all.value){
        //檢查 uniqueCategories 陣列是否「不包含」目前這個商品的分類
        //如果不包含，就把這個新的分類加進去
        if (!uniqueCategories.includes(pp.category)){
          uniqueCategories.push(pp.category);
        }
      }
        categories.value = uniqueCategories;
    }catch(error){
      console.error("讀取 Firebase 資料時發生錯誤:", error);
    }
  }*/

// 元件掛載在網頁上後，執行 get 函式去載入資料
/*onMounted(()=>{
  get();
})*/


</script>



  <template>

  <div v-if="loading">載入中...</div>
  <div v-else="product" class="product-detail-container">
    <img :src="product.image" :alt="product.name" class="product-image">
    <div class="product-info">
    <h1>{{ product.name }}</h1>
    <p class="product-price">NT$ {{ product.price }}</p>
    <p class="product-rating">評價: {{ product.rating }} ★</p>
    <p class="description">{{ product.description }}</p>
    <button>加入購物車</button>
    </div>
  </div>
  <div else>
    <h2>找不到商品</h2>
  </div>
  
</template>

<style scoped>
.product-detail-container {
  display: flex;
  gap: 2rem;
}
.product-image {
  max-width: 50%;
}

/* 這裡加上一些基本的 CSS 讓網站看起來有模有樣 */
/* 為了聚焦在 Vue，CSS 我就先簡單寫，你可以之後自己美化 */
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
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.logo { font-size: 1.5rem; font-weight: bold; color: var(--primary-color); }
.search-bar input { width: 300px; padding: 0.5rem; border-radius: 5px; border: 1px solid #ccc; }
.user-actions span { margin-left: 1.5rem; cursor: pointer; }

.main-content {
  display: flex;
  flex-grow: 1;
  padding: 2rem;
}

.sidebar {
  flex: 0 0 200px; /* 不會長大、不會縮小、基礎寬度200px */
  background-color: white;
  padding: 1rem;
  border-radius: 8px;
  margin-right: 2rem;
}
.sidebar h3 { margin-top: 0; }
.sidebar ul { list-style: none; padding: 0; }
.sidebar li { padding: 0.75rem; cursor: pointer; border-radius: 5px; }
.sidebar li:hover { background-color: var(--secondary-color); }
.sidebar li.active { background-color: var(--primary-color); color: white; font-weight: bold; }

.products-section {
  flex-grow: 1;
}
.promo-slider img { width: 100%; border-radius: 8px; }
.products-section h2 { margin-top: 2rem; }

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

.product-card {
  background-color: white;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  transition: transform 0.2s;
}
.product-card:hover { transform: translateY(-5px); }
.product-card img { max-width: 100%; height: auto; margin-bottom: 1rem; }
.product-card h3 { font-size: 1.1rem; margin: 0.5rem 0; }
.product-price { font-weight: bold; color: var(--primary-color); }
.product-card button {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 1rem;
}

.no-products { margin-top: 2rem; text-align: center; color: #777; }

.reviews-section { margin-top: 3rem; }
.review-grid { display: flex; gap: 1.5rem; }
.review-card { flex: 1; background-color: white; padding: 1rem; border-radius: 8px; }

.footer {
  text-align: center;
  padding: 1.5rem;
  background-color: #333;
  color: white;
}



</style>