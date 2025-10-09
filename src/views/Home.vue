<script setup>
import { ref, onMounted, computed } from "vue";
import { collection, doc, getDocs } from "firebase/firestore";
import { db } from "../firebase/config.js";
import { RouterLink } from "vue-router";
//從我們剛剛建立的 cart.js 檔案中，引入 useCartStore 這個函式
import{ useCartStore } from "../stores/cart.js";

//呼叫 useCartStore() 來取得購物車 store 的實例；
//你可以把 cartStore 想像成是通往「購物車倉庫」的遙控器；
const cartStore = useCartStore();

const all = ref([]);
const categories = ref([]);
const selectedCategory = ref('全部');
const search = ref('');

categories.value = ["全部","高爾夫球","球具","配件"];

//等待onMounted()來呼叫連接資料庫
const fetchData = async () => {
 try{ 
  const querySnapshot = await getDocs(collection(db, "allProducts"));

  //querySnapshot.docs 就是你截圖中看到的那個陣列 (Array[5])
  const newArray = []; // 建立一個新的空陣列，用來存放「拆完包裹」的乾淨資料

  //「doc」就是陣列中，我們拿到的每一個「快遞包裹 (QueryDocumentSnapshot)」
  //console.log(doc); // 這會印出你截圖中看到的那個複雜物件
  querySnapshot.docs.forEach((doc) => {
    
    // 現在，我們要從 "包裹 (doc)" 中取出 "商品 (data)" 和 "貨運單號 (id)"
    // 步驟 1: 呼叫 .data() 函式來拆開包裹，取得商品資料
    const productData = doc.data(); 

    // 步驟 2: 存取 .id 屬性來讀取貨運單號
    const productId = doc.id;

    //把處理好的資料，組合成一個乾淨物件
    newArray.push({
      firestoreId: productId, // 把 Firestore 自動產生的 ID 也存起來，未來會很有用！
          name: productData.name,
          category: productData.category,
          price: productData.price,
          image: productData.image,
          rating: productData.rating,
          description: productData.description
  });
  })   
   // 現在，products 陣列裡面的資料就是乾淨漂亮的了！
  console.log("處理完成的產品資料:", newArray);

  // 最後，你可以把這個乾淨的 products 陣列，賦值給你的 ref 變數，讓畫面去渲染
  all.value = newArray;

  }catch(error){
    console.error("讀取 Firebase 資料時發生錯誤:", error);
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



const filteredProducts = computed(() => {
let tempProducts = all.value;  //先拿出原始商品列表
  
// 1. 根據分類過濾
if (selectedCategory.value !== '全部') {
  tempProducts = tempProducts.filter(pp => pp.category === selectedCategory.value);
}

// 2. 根據搜尋關鍵字過濾
if (search.value) {
  tempProducts = tempProducts.filter(ppp => 
  ppp.name.toLowerCase().includes(search.value.toLowerCase())
  );
}

 //回傳最後過濾完的結果
 return tempProducts;
});
  
  


const selectCategory = (category) =>{
  selectedCategory.value = category;  // 更新 selectedCategory 的值
};

 

</script>

  
<template>
  <div v-if="loading" class="status-message">
    <p>載入中，請稍候...</p>
  </div>

  <div v-else-if="errorMsg" class="status-message.error">
    <p>{{ errorMsg }}</p>
  </div>

  <div v-else class="home-layout">
    <aside class="sidebar">
      <h3>商品分類</h3>
      <ul>
        <li
          v-for="category in categories"
          :key="category"
          @click="selectCategory(category)"
          :class="{ active: selectedCategory === category }"
        >
          {{ category }}
        </li>
      </ul>
    </aside>

    <section class="products-section">
      <div class="promo-slider">
        <img src="https://shop.r10s.jp/taylormadegolf/cabinet/bunner/imgrc0150982674.jpg?v=1759985487799" alt="促銷廣告">
      </div>

      <h2>主打商品</h2>

      <div class="product-grid">
        <RouterLink
          v-for="product in filteredProducts"
          :key="product.id"
          :to="`/product/${product.id}`"
          class="product-card-link"
        >
          <div class="product-card">
            <img :src="product.image" :alt="product.name">
            <h3>{{ product.name }}</h3>
            <p class="product-price">NT$ {{ product.price }}</p>
            <p class="product-rating">評價: {{ product.rating }} ★</p>
            <button @click.prevent="cartStore.addToCart(product)">加入購物車</button>
            </div>
        </RouterLink>
        
      </div>

      <div v-if="filteredProducts.length === 0" class="no-products">
        <p>抱歉，找不到符合條件的商品。</p>
      </div>

      <div class="reviews-section">
        <h2>顧客評價</h2>
        <div class="review-grid">
          <div class="review-card">"出貨速度超快，球桿品質沒話說！" - 陳先生</div>
          <div class="review-card">"客服很有耐心，推薦的球很適合我！" - 林小姐</div>
          <div class="review-card">"網站好用，會再回購。" - 王先生</div>
        </div>
      </div>
    </section>
  </div>
</template>


<style scoped>
/* --- HomeView 專屬樣式 --- */

/* 我們需要一個容器來包裹側邊欄和商品區塊，以便使用 Flexbox */
.home-layout {
  display: flex;
}

.sidebar {
  flex: 0 0 200px;
  background-color: white;
  padding: 1rem;
  border-radius: 8px;
  margin-right: 2rem;
  align-self: flex-start;
}

.sidebar h3 { margin-top: 0; }
.sidebar ul { list-style: none; padding: 0; }
.sidebar li {
  padding: 0.75rem;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.2s;
}
.sidebar li:hover { background-color: var(--secondary-color); }
.sidebar li.active {
  background-color: var(--primary-color);
  color: white;
  font-weight: bold;
}

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
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.product-card:hover { transform: translateY(-5px); }

/* 因為 RouterLink 會被渲染成 <a> 標籤，我們需要重置它的樣式 */
.product-card-link {
  text-decoration: none;
  color: inherit;
}

.product-card img {
  max-width: 100%;
  margin-bottom: 1rem;
  height: 200px;
  object-fit: cover;
}
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

.no-products, .status-message {
  margin-top: 2rem;
  text-align: center;
  color: #777;
  width: 100%;
}
.status-message.error { color: #c62828; }

.reviews-section { margin-top: 3rem; }
.review-grid { display: flex; gap: 1.5rem; }
.review-card {
  flex: 1;
  background-color: white;
  padding: 1rem;
  border-radius: 8px;
}
</style>