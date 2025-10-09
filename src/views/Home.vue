<script setup>
import { ref, onMounted, computed } from "vue";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config.js";
import { RouterLink } from "vue-router";

// 【新增】從剛剛安裝的套件中，引入輪播圖需要的元件；
import 'vue3-carousel/dist/carousel.css'; // 引入輪播圖的基本 CSS 樣式
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel';

//從建立的 cart.js 檔案中，引入 useCartStore 這個函式
import{ useCartStore } from "../stores/cart.js";

//呼叫 useCartStore() 來取得購物車 store 的實例；
//你可以把 cartStore 想像成是通往「購物車倉庫」的遙控器；
const cartStore = useCartStore();

const all = ref([]);  //用來存放從 Firebase 拿到的「所有」商品資料

//存放不重複商品分類
const categories = ref([
  "全部",
  "木桿",
  "球道木桿",
  "鐵桿",
  "推桿",
  "高爾夫球",
  "球袋",
  "配件"
]);  

const selectedCategory = ref('全部');  //目前選擇的商品分類

const userSearch = ref('');   //存放使用者輸入文字

const loading = ref(true); // 頁面是否在載入中；
const errorMsg = ref(''); // 如果發生錯誤，顯示的錯誤訊息；

// 【新增】準備要放在輪播圖上的圖片陣列
const carouselImages = ref([
  { id: 1, url: 'https://shop.r10s.jp/taylormadegolf/cabinet/bunner/imgrc0150982674.jpg' },
  { id: 2, url: 'https://shop.r10s.jp/callawaygolf/cabinet/imgrc0142847302.jpg?v=1760022301557' },
  { id: 3, url: 'https://tshop.r10s.jp/r-golf/cabinet/11947947/imgrc0130022650.jpg?fitin=768%3A432' }
]);




//等待onMounted()來呼叫連接資料庫
const fetchData = async () => {
try{ 
  const querySnapshot = await getDocs(collection(db, "allProducts"));

  //querySnapshot.docs 獲取陣列
  const newArray = []; // 建立一個新的空陣列，用來存放「拆完包裹」的乾淨資料

  //「doc」就是陣列中，我們拿到的每一個「快遞包裹 (QueryDocumentSnapshot)」
  //console.log(doc); // 這會印出陣列物件
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
  //console.log("處理完成的產品資料:", newArray);

  // 最後，你可以把這個乾淨的 products 陣列，賦值給你的 ref 變數，讓畫面去渲染
  all.value = newArray;

  }catch(error){
    console.error("讀取 Firebase 資料時發生錯誤:", error);
  }
   finally {
      //【修正】不論成功或失敗，最後都要把 loading 狀態關閉
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

const specialProducts = computed(() => {
  return all.value.slice(1, 4); // .slice(1, 4) 從索引 1 取到 4 之前，共 3 個
});


const filteredProducts = computed(() => {
let tempProducts = all.value;  //先拿出原始商品列表
  console.log(all.value);
// 1. 根據分類過濾
if (selectedCategory.value !== '全部') {
  tempProducts = tempProducts.filter(pp => pp.category === selectedCategory.value);
}

// 2. 根據搜尋關鍵字過濾
if (userSearch.value) {
  tempProducts = tempProducts.filter(ppp => 
  ppp.name.toLowerCase().includes(userSearch.value.toLowerCase())
  );
}

 //回傳最後過濾完的結果
 return tempProducts;
});
  
  

//點擊分類時執行的函式
const selectCategory = (category) =>{
  selectedCategory.value = category;  // 更新 selectedCategory 的值
};



</script>

  
<template>
  <div v-if="loading" class="status-message">
    <p>載入中，請稍候...</p>
  </div>

  <div v-else-if="errorMsg" class="status-message error"> <p>{{ errorMsg }}</p>
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

      <div class="special-offer-section">
        <h4>🔥 熱門特價</h4>
        <div 
            v-for="product in specialProducts" 
            :key="product.firestoreId" 
            class="offer-card"
        >
            <RouterLink :to="`/product/${product.firestoreId}`" class="offer-card-link">
                <img :src="product.image" :alt="product.name" class="offer-image">
                <div class="offer-details">
                    <p class="offer-name">{{ product.name }}</p>
                    <p class="offer-price">NT$ {{ product.price }}</p>
                </div>
            </RouterLink>
        </div>
      </div>
    </aside>

    <section class="products-section">
      <Carousel :autoplay="3000" :wrap-around="true">
        <Slide v-for="image in carouselImages" :key="image.id">
          <div class="carousel__item">
            <img :src="image.url" alt="促銷廣告">
          </div>
        </Slide>

        <template #addons>
          <Navigation />
          <Pagination />
        </template>
      </Carousel>

      <div class="search-bar-local">
        <input type="text" v-model="searchTerm" placeholder="搜尋商品名稱...">
      </div>

      <h2 class="all-products-title">商品列表</h2>
      <div class="product-grid">
        <RouterLink
          v-for="product in filteredProducts"
          :key="product.firestoreId"
          :to="`/product/${product.firestoreId}`"
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
    </section> </div>
</template>


<style scoped>
/* --- 【新增】輪播圖樣式調整 --- */
.carousel__item {
  width: 100%;
  height: 350px; /* 給輪播圖一個固定的高度 */
  background-color: var(--light-gray);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  overflow: hidden; /* 確保圖片不會超出圓角範圍 */
}
.carousel__item img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 讓圖片填滿容器，但保持比例，多餘部分會被裁切 */
}

.home-layout { display: flex; gap: 2rem; }
.sidebar {
  flex: 0 0 220px; /* 稍微加寬側邊欄 */
  background-color: white;
  padding: 1rem;
  border-radius: 8px;
  align-self: flex-start;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}
.sidebar h3 { margin-top: 0; }
.sidebar-title-margin { margin-top: 1.5rem; }
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

/* --- 【新增】特價商品區樣式 --- */
.special-offer-section {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 2px solid var(--secondary-color);
}
.special-offer-section h4 {
  margin-top: 0;
  margin-bottom: 1rem;
  text-align: center;
}
.offer-card {
  margin-bottom: 1rem;
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  transition: transform 0.2s;
}
.offer-card:hover {
    transform: scale(1.03);
}
.offer-card-link {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: inherit;
    background-color: #fff;
}
.offer-image {
  width: 70px;
  height: 70px;
  object-fit: cover;
  flex-shrink: 0; /* 防止圖片被擠壓 */
}
.offer-details {
  padding: 0.5rem 0.8rem;
}
.offer-name {
  font-size: 0.9rem;
  font-weight: bold;
  margin: 0 0 0.2rem 0;
  /* 文字過長時顯示 ... */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 120px;
}
.offer-price {
  font-size: 0.85rem;
  color: var(--primary-color);
  margin: 0;
}
/* --- 特價區樣式結束 --- */

.products-section { flex-grow: 1; }

.search-bar-local {
  margin: 2rem 0; /* 讓搜尋框和輪播圖、商品列表有上下間距 */
}
.search-bar-local input {
  width: 100%;
  padding: 0.8rem;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 1rem;
}

.all-products-title {
    margin-top: 0; /* 因為搜尋框已經有間距了，這裡就不需要了 */
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.5rem;
}
.product-card-link { text-decoration: none; color: inherit; }
.product-card {
  background-color: white;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  transition: transform 0.2s, box-shadow 0.2s;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.product-card:hover { 
  transform: translateY(-5px); 
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
.product-card img {
  max-width: 100%;
  margin-bottom: 1rem;
  height: 180px;
  object-fit: cover;
}
.product-card h3 { font-size: 1.1rem; margin: 0.5rem 0; flex-grow: 1; }
.product-price { font-weight: bold; color: var(--primary-color); }
.product-card button {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 1rem;
  width: 100%;
}

.no-products, .status-message {
  margin-top: 2rem;
  text-align: center;
  color: #777;
  width: 100%;
}
.status-message.error { color: #c62828; }
.reviews-section { margin-top: 3rem; }
.reviews-section { margin-top: 3rem; }
.review-grid { display: flex; gap: 1.5rem; }
.review-card {
  flex: 1;
  background-color: white;
  padding: 1rem;
  border-radius: 8px;
}
</style>