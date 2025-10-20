//Pinia的主要功能，就是為你的 Vue 應用程式提供一個中央數據倉庫，這樣不管在哪個頁面
//都可以抓到相同最新資料

// 從 vue 引入 ref 和 computed，我們在 stores 裡一樣可以用這些組合式 API；
import { ref, computed } from 'vue';

// 從 pinia 引入 defineStore 這個函式；
// defineStore 的意思是「定義一個新的 store」；
import { defineStore } from 'pinia';

//這裡我們開始定義一個 store；
// 'cart' 是這個 store 的唯一 ID，Pinia 會用它來識別這個 store；
// 第二個參數是一個函式，格式類似元件的 <script setup>；
export const useCartStore = defineStore("cart", () => {

//這在 Pinia 中被稱為【狀態 (State)】
// 存放的「共享資料」，包含商品資訊；
const cart = ref([]);


//這在 Pinia 中被稱為【動作 (Actions)】
// 任何元件都可以呼叫這個 action 來把商品加入購物車；
// 接收商品物件與加入的數量
const addToCart = (product, quantity) => {
    const existProduct = cart.value.find(item => item.firestoreId === product.firestoreId)
    if(existProduct){
      existProduct.quantity = existProduct.quantity + quantity;
    }else{ 
       //展開語法 (...) ,把 product 這個物件裡所有的屬性（name, price, image 等）全部複製一份出來，建立一個全新的物件
       //, quantity: quantity：接著，在這個全新的複製物件上，新增一個叫做 quantity 的屬性，它的值就是這次傳進來的 quantity
      cart.value.push({ ...product, quantity: quantity }); 
      console.log(cart.value);
        
    }
    alert(`將 ${quantity} 個添加至購物車`);
    
  };

//這在 Pinia 中被稱為【取值器（Getter）】
//計算購物車的商品數量加總
//.reduce(myFunction, initialValue)，myFunction分別代表四個值，常用為前兩個累加器、當前值
//.reduce() 回傳的值，便是累加器迭代完整個陣列的結果
//i是一個暫存
//從總和(sum)為 0 開始累加，依序把每個項目 i（是當前值的代號）的 quantity 加到總和sum裡面
const cartCount = computed(function(){
  return cart.value.reduce(function(sum, i){
    return sum + i.quantity
  }, 0); 
});

//計算購物車總金額
//.reduce的初始值為 0
const totalPrice = computed(function() {
    return cart.value.reduce(function(sum, i) {
      return sum + (i.price * i.quantity);
    }, 0);
});


const removeFromCart = (removeId) => {
  //.filter()只有符合條件的項目才會被保留下來
  const remainItem = cart.value.filter(item => item.firestoreId!==removeId)
  //把回傳的陣列塞回去cart
  cart.value = remainItem;

  
}


// 最後要 export，這樣其他的元件才能使用它們；
return{
    cart,
    addToCart,
    cartCount,
    totalPrice,
    removeFromCart
};
});