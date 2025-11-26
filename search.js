// 🔍 Search & Voice Search Setup
const searchInput = document.getElementById("dishSearch");
const dishCard = document.getElementById("dishCard");
const dishName = document.getElementById("dishName");
const dishPrice = document.getElementById("dishPrice");
const dishImage = document.getElementById("dishImage");
const voiceBtn = document.getElementById("voiceSearchBtn");

const dishes = [
  { name: "Pizza Margherita", price: "$12", image: "assets/pizza.jpg" },
  { name: "Pasta Alfredo", price: "$10", image: "assets/pasta.jpg" },
  { name: "Burger Supreme", price: "$8", image: "assets/burger.jpg" },
  { name: "Chocolate Cake", price: "$6", image: "assets/cake.jpg" },
  { name: "Caesar Salad", price: "$7", image: "assets/salad.jpg" },
  { name: "Sushi Roll", price: "$15", image: "assets/sushi.jpg" },
  { name: "Grilled Chicken", price: "$15", image: "assets/grill.jpg" },
  { name: "Sandwich", price: "$15", image: "assets/sandwich.jpg" },
  { name: "Cake", price: "$15", image: "assets/cake.jpg" },
  { name: "Biryani", price: "$15", image: "assets/biryani.jpg" },
  { name: "Ramen", price: "$15", image: "assets/ramen.jpg" },
  { name: "Coffee", price: "$15", image: "assets/coffee.jpg" },
];

// 🔁 Search Trigger Function
function triggerSearch(query) {
  const filter = query.toLowerCase();
  const foundDish = dishes.find(d => d.name.toLowerCase().includes(filter));

  if (filter && foundDish) {
    dishName.textContent = foundDish.name;
    dishPrice.textContent = foundDish.price;
    dishImage.src = foundDish.image;

    dishCard.classList.remove("hidden");
    dishCard.classList.add("show");
  } else {
    dishCard.classList.remove("show");
    dishCard.classList.add("hidden");
  }
}

// 🔤 Text Input Listener
searchInput.addEventListener("input", () => {
  triggerSearch(searchInput.value.trim());
});

// 🎙️ Voice Search Listener
voiceBtn.addEventListener("click", () => {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = "en-IN"; // Use "ta-IN" for Tamil

  recognition.start();

  recognition.onresult = function (event) {
    const transcript = event.results[0][0].transcript;
    searchInput.value = transcript;
    triggerSearch(transcript);
  };

  recognition.onerror = function (event) {
    alert("Voice recognition failed: " + event.error);
  };
});

// 🛒 Cart Setup
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartCount = document.getElementById("cart-count");
const cartPopup = document.getElementById("cart-popup");
const cartItemsList = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");

// 🧮 Update Cart Count
function updateCartCount() {
  cartCount.textContent = cart.length;
}

// 🧾 Render Cart Items
function renderCart() {
  cartItemsList.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price;
    const li = document.createElement("li");
    li.innerHTML = `
      ${item.name} - ₹${item.price.toFixed(2)}
      <button onclick="removeItem(${index})" style="color:red; border:none; background:none; cursor:pointer;">&times;</button>
    `;
    cartItemsList.appendChild(li);
  });

  cartTotal.textContent = total.toFixed(2);
}

// ➕ Add to Cart
function addToCart(name, price) {
  cart.push({ name, price: parseFloat(price) });
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  renderCart();
}

// ❌ Remove from Cart
function removeItem(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  renderCart();
}

// 🧺 Toggle Cart Popup
document.querySelector(".cart-icon").addEventListener("click", () => {
  cartPopup.classList.toggle("hidden");
  renderCart();
});

// ✅ Checkout
checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }
  alert("Thank you for your order!");
  cart = [];
  localStorage.removeItem("cart");
  updateCartCount();
  renderCart();
  cartPopup.classList.add("hidden");
});

// 🛒 Add-to-Cart Button Setup
document.querySelectorAll(".order-btn").forEach(button => {
  button.classList.add("add-to-cart");
  button.addEventListener("click", function (e) {
    e.preventDefault();
    const name = this.parentElement.querySelector("h3").textContent;
    const price = this.parentElement.querySelector(".price").textContent.replace("₹", "").replace("$", "");
    addToCart(name, price);
  });
});

// 🔄 Initialize Cart
updateCartCount();
renderCart();
