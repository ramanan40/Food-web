// ==========================================
// 1. DATA & GLOBAL STATE
// ==========================================

const defaultDishes = [
  { id: 1, name: "Truffle Pasta", price: 18.00, category: "pasta", calories: "450 kcal", time: "25 mins", rating: 4.8, image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=800&q=80", desc: "Creamy truffle sauce with handmade fettuccine." },
  // FIXED IMAGE: Spaghetti Bolognese
  { id: 9, name: "Spaghetti Bolognese", price: 16.00, category: "pasta", calories: "500 kcal", time: "30 mins", rating: 4.5, image: "https://images.unsplash.com/photo-1598866594230-a7c12756260f?auto=format&fit=crop&w=800&q=80", desc: "Classic meat sauce with parmesan." },
  { id: 2, name: "Golden Burger", price: 14.50, category: "burger", calories: "800 kcal", time: "20 mins", rating: 4.9, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80", desc: "Juicy wagyu beef with cheddar." },
  // FIXED IMAGE: Chicken Crispy
  { id: 10, name: "Chicken Crispy", price: 12.00, category: "burger", calories: "700 kcal", time: "15 mins", rating: 4.6, image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80", desc: "Fried chicken breast with spicy mayo." },
  { id: 3, name: "Woodfire Pizza", price: 16.99, category: "pizza", calories: "900 kcal", time: "40 mins", rating: 4.7, image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80", desc: "Napoli style with fresh basil." },
  { id: 11, name: "Pepperoni Feast", price: 18.50, "category": "pizza", calories: "1000 kcal", time: "45 mins", rating: 4.8, image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80", desc: "Double pepperoni and extra cheese." },
  { id: 4, name: "Spicy Ramen", price: 15.00, category: "asian", calories: "400 kcal", time: "35 mins", rating: 4.9, image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80", desc: "Rich miso broth with soft-boiled egg." },
  { id: 5, name: "Sushi Platter", price: 22.00, "category": "asian", calories: "350 kcal", time: "50 mins", rating: 4.9, image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80", desc: "Assorted premium sashimi and rolls." },
  { id: 6, name: "Caesar Salad", price: 10.99, category: "veg", calories: "250 kcal", time: "10 mins", rating: 4.4, image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&w=800&q=80", desc: "Fresh romaine lettuce with croutons." },
  { id: 7, name: "Chocolate Cake", price: 9.00, category: "dessert", calories: "450 kcal", time: "20 mins", rating: 4.8, image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80", desc: "Molten lava cake served warm." },
  { id: 12, name: "Strawberry Tart", price: 8.50, category: "dessert", calories: "300 kcal", time: "20 mins", rating: 4.5, image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=800&q=80", desc: "Fresh strawberries with custard." },
  { id: 8, name: "Fresh Mojito", price: 6.50, category: "drinks", calories: "150 kcal", time: "5 mins", rating: 4.9, image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80", desc: "Refreshing mint and lime cocktail." }
];

// Initialize Data
if (!localStorage.getItem("allDishes")) {
    localStorage.setItem("allDishes", JSON.stringify(defaultDishes));
}
window.dishes = JSON.parse(localStorage.getItem("allDishes"));

// Global State
window.cart = JSON.parse(localStorage.getItem("cart")) || [];
window.favorites = JSON.parse(localStorage.getItem("favorites")) || [];
window.currentDishId = null;
window.currentQty = 1;
window.pendingAction = null; 

const dishesContainer = document.getElementById("dishesContainer");

// ==========================================
// 2. INITIALIZATION
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  const preloader = document.getElementById("preloader");
  if(preloader) setTimeout(() => preloader.classList.add("hide-loader"), 800);

  if (typeof AOS !== 'undefined') AOS.init({ duration: 800, offset: 100, once: true });
  if (typeof Typed !== 'undefined') {
    new Typed('.typewriter-text', {
      strings: ['Madara Foods', 'Luxury Taste', 'The Best Feast'],
      typeSpeed: 100, backSpeed: 50, loop: true, cursorChar: '|'
    });
  }

  // Load Grid (Limit to 6)
  if (dishesContainer) {
      renderSkeletons();
      setTimeout(() => { renderDishes(window.dishes.slice(0, 6)); }, 800);
  }

  if (document.getElementById("checkout-items")) loadCheckoutItems();
  if (document.getElementById("admin-dish-list")) renderAdminList();
  if (document.getElementById("pay-amount-display")) loadPaymentPage();
  if (document.getElementById("dash-name")) loadDashboard();
  if (document.getElementById("delivery-timer")) initTrackingPage();

  checkLoginState();
  updateCartCount();
  initTheme();
  
  if(document.getElementById("dishSearch")) setupSearchListener();
});

function showToast(message, type="success") {
  if (typeof Toastify !== 'undefined') {
    Toastify({
      text: message, duration: 3000, gravity: "bottom", position: "right",
      style: { background: type === "error" ? "#ef4444" : "#1e293b", border: "1px solid #fbbf24" },
    }).showToast();
  } else { alert(message); }
}

// ==========================================
// 3. HOME PAGE LOGIC
// ==========================================

function renderSkeletons() {
    if(!dishesContainer) return;
    dishesContainer.innerHTML = "";
    for(let i=0; i<4; i++) {
        dishesContainer.innerHTML += `<div class="dish-card-modern" style="height:420px; pointer-events:none;"><div class="skeleton" style="width:100%;height:100%;"></div></div>`;
    }
}

function renderDishes(data) {
    if (!dishesContainer) return;
    dishesContainer.innerHTML = "";

    if (data.length > 0 && data.length < 3) {
        dishesContainer.classList.add('centered');
    } else {
        dishesContainer.classList.remove('centered');
    }

    if (data.length === 0) {
        dishesContainer.innerHTML = `<p style='text-align:center;color:white;width:100%;margin-top:20px;grid-column:1/-1;'>No dishes found.</p>`;
        return;
    }

    data.forEach((dish, index) => {
        const card = document.createElement("div");
        card.classList.add("dish-card-modern");
        if(typeof AOS !== 'undefined') {
            card.setAttribute("data-aos", "fade-up");
            card.setAttribute("data-aos-delay", index * 50);
        }
        
        const isFav = window.favorites.includes(dish.id);
        const heartClass = isFav ? "fas" : "far";
        const activeClass = isFav ? "active" : "";
        const imgSrc = dish.image || 'https://placehold.co/600x400/1e293b/fbbf24?text=Food';

        card.innerHTML = `
          <div class="image-box" onclick="openModal(${dish.id})">
             <img src="${imgSrc}" alt="${dish.name}" loading="lazy">
             <button class="fav-btn ${activeClass}" onclick="toggleFavorite(event, ${dish.id})">
                <i class="${heartClass} fa-heart"></i>
             </button>
          </div>
          <div class="dish-info">
            <div class="card-header">
               <h3>${dish.name}</h3>
               <span class="rating"><i class="fas fa-star"></i> ${dish.rating}</span>
            </div>
            <span class="category-tag">${dish.category}</span>
            <div class="dish-footer">
              <span class="price-tag">$${dish.price.toFixed(2)}</span>
              <button class="add-btn" onclick="openModal(${dish.id})">Add</button>
            </div>
          </div>
        `;
        dishesContainer.appendChild(card);
    });
    
    if(typeof AOS !== 'undefined') AOS.refresh();
}

function setupSearchListener() {
    const searchInput = document.getElementById("dishSearch");
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            const text = e.target.value.toLowerCase().trim();
            if (text.length > 0) {
                const filtered = window.dishes.filter(dish => 
                    dish.name.toLowerCase().includes(text) || 
                    dish.category.toLowerCase().includes(text)
                );
                renderDishes(filtered);
            } else {
                renderDishes(window.dishes.slice(0, 6));
            }
        });
    }
}

window.filterDishes = function(category) {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if(btn.innerText.toLowerCase().includes(category) || (category === 'all' && btn.innerText.includes('All'))) {
            btn.classList.add('active');
        }
    });

    if (category === "all") {
        renderDishes(window.dishes.slice(0, 6));
    } else {
        const filtered = window.dishes.filter(dish => dish.category === category);
        renderDishes(filtered);
    }
}

// ==========================================
// 4. AUTHENTICATION & DASHBOARD
// ==========================================

function checkLoginState() {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    const loginBtn = document.getElementById("login-btn");
    const userProfile = document.getElementById("user-profile");
    
    const navName = document.getElementById("user-name-display");
    const menuName = document.getElementById("menu-user-name");
    const menuEmail = document.getElementById("menu-user-email");

    if (!loginBtn || !userProfile) return;

    if (user) {
        loginBtn.style.display = "none";
        userProfile.classList.remove("hidden");
        userProfile.style.display = "flex";
        
        if(navName) navName.innerText = user.name;
        if(menuName) menuName.innerText = user.name;
        if(menuEmail) menuEmail.innerText = user.email;
    } else {
        loginBtn.style.display = "flex";
        userProfile.classList.add("hidden");
        userProfile.style.display = "none";
    }
}

function loadDashboard() {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if(user && document.getElementById("dash-name")) {
        document.getElementById("dash-name").innerText = user.name;
    }
    loadOverview();
}

window.switchDash = function(tab) {
    document.querySelectorAll('.dash-section').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.dash-link').forEach(el => el.classList.remove('active'));
    
    if(tab === 'overview') {
        document.getElementById('overview-section').classList.remove('hidden');
        loadOverview();
    } else if(tab === 'favorites') {
        document.getElementById('favorites-section').classList.remove('hidden');
        loadFavorites();
    } else if(tab === 'orders') {
        document.getElementById('orders-section').classList.remove('hidden');
        loadOrderHistory();
    }
};

function loadOverview() {
    const orders = JSON.parse(localStorage.getItem("orderHistory")) || [];
    const totalOrders = orders.length;
    const points = totalOrders * 50; 
    const spent = orders.reduce((sum, order) => {
        let val = typeof order.total === 'string' ? parseFloat(order.total.replace('$','')) : order.total;
        return sum + (isNaN(val) ? 0 : val);
    }, 0);

    const elOrders = document.getElementById("stat-orders");
    const elPoints = document.getElementById("stat-points");
    const elWallet = document.getElementById("stat-wallet");

    if(elOrders) elOrders.innerText = totalOrders;
    if(elPoints) elPoints.innerText = points;
    if(elWallet) elWallet.innerText = "$" + spent.toFixed(0);
}

function loadFavorites() {
    const container = document.getElementById("fav-container");
    if(!container) return;
    container.innerHTML = "";
    
    const favItems = window.dishes.filter(d => window.favorites.includes(d.id));
    if(favItems.length === 0) {
        container.innerHTML = "<p style='color:gray'>No favorites yet.</p>"; return;
    }

    favItems.forEach(dish => {
        container.innerHTML += `
            <div class="fav-card-mini">
                <img src="${dish.image}" style="width:60px;height:60px;border-radius:10px;object-fit:cover;">
                <div><h4>${dish.name}</h4><span>$${dish.price.toFixed(2)}</span></div>
                <button onclick="removeFavFromDash(${dish.id})" class="trash-btn"><i class="fas fa-heart-broken"></i></button>
            </div>`;
    });
}

function loadOrderHistory() {
    const orders = JSON.parse(localStorage.getItem("orderHistory")) || [];
    const container = document.getElementById("orders-list");
    if(!container) return;
    container.innerHTML = "";
    
    if(orders.length === 0) { container.innerHTML = "<p style='color:gray'>No past orders.</p>"; return; }

    orders.reverse().forEach(order => {
        const itemNames = order.items.map(i => i.name).join(", ");
        const totalDisplay = typeof order.total === 'number' ? '$'+order.total.toFixed(2) : order.total;
        
        container.innerHTML += `
            <div class="order-history-card">
                <div class="order-info-left">
                    <div class="order-id-badge">${order.id}</div>
                    <p class="order-date">${order.date}</p>
                </div>
                <div class="order-info-mid">
                    <h4>${itemNames}</h4>
                    <span class="status-delivered"><i class="fas fa-check"></i> ${order.status}</span>
                </div>
                <div class="order-info-right">
                    <strong>${totalDisplay}</strong>
                </div>
            </div>`;
    });
}

window.removeFavFromDash = function(id) {
    window.favorites = window.favorites.filter(fId => fId !== id);
    localStorage.setItem("favorites", JSON.stringify(window.favorites));
    loadFavorites(); 
    showToast("Removed from favorites");
};

// ==========================================
// FIX: LOGIN NAME LOGIC
// ==========================================
const pgLoginForm = document.getElementById("page-login-form");
if (pgLoginForm) {
    pgLoginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("pg-login-email").value;
        
        // CAPITALIZE NAME
        const rawName = email.split('@')[0];
        const formattedName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
        
        const user = { name: formattedName, email: email };
        localStorage.setItem("currentUser", JSON.stringify(user));
        
        showToast(`Welcome back, ${user.name}`);
        setTimeout(() => { window.location.href = "index.html"; }, 1500);
    });
}

const pgSignupForm = document.getElementById("page-signup-form");
if (pgSignupForm) {
    pgSignupForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("pg-signup-name").value;
        const email = document.getElementById("pg-signup-email").value;
        if (name && email) {
            const user = { name: name, email: email };
            localStorage.setItem("currentUser", JSON.stringify(user));
            showToast(`Account Created!`);
            setTimeout(() => { window.location.href = "index.html"; }, 1500);
        }
    });
}

// ==========================================
// 5. CART & CHECKOUT
// ==========================================

window.confirmAddToCart = function() {
  const dish = window.dishes.find(d => d.id === currentDishId);
  if(dish) {
    for(let i=0; i < currentQty; i++) {
      window.cart.push({ 
          name: dish.name, 
          price: dish.price, 
          image: dish.image 
      });
    }
    localStorage.setItem("cart", JSON.stringify(window.cart));
    showToast(`${currentQty}x ${dish.name} added!`);
    updateCartCount();
    closeModal();
  }
};

function updateCartCount() {
    const badge = document.getElementById("cart-badge");
    if(badge) {
        badge.innerText = window.cart.length;
        badge.style.display = window.cart.length === 0 ? 'none' : 'flex';
    }
}

function loadCheckoutItems() {
    const tableBody = document.getElementById("checkout-items");
    const subtotalEl = document.getElementById("summary-subtotal");
    const totalEl = document.getElementById("summary-total");

    if(!tableBody) return;

    if (window.cart.length === 0) {
        tableBody.innerHTML = "<tr><td colspan='4' style='text-align:center; padding:30px; color:white;'>Cart empty.</td></tr>";
        subtotalEl.innerText = "$0.00";
        totalEl.innerText = "$0.00";
        return;
    }

    let subtotal = 0;
    tableBody.innerHTML = "";
    
    const counts = {};
    window.cart.forEach(x => { counts[x.name] = (counts[x.name] || 0) + 1; });
    const uniqueItems = [...new Set(window.cart.map(item => item.name))];

    uniqueItems.forEach(name => {
      const item = window.cart.find(i => i.name === name);
      const qty = counts[name];
      const itemTotal = item.price * qty;
      subtotal += itemTotal;
      const displayImage = item.image || 'https://placehold.co/100?text=Food';

      tableBody.innerHTML += `
          <tr>
              <td>
                <div class="item-flex">
                    <img src="${displayImage}" alt="${name}" style="width:60px;height:60px;border-radius:10px;object-fit:cover;">
                    <div class="item-details"><h4>${name}</h4><small>x${qty}</small></div>
                </div>
              </td>
              <td>$${item.price.toFixed(2)}</td>
              <td>$${itemTotal.toFixed(2)}</td>
              <td><button onclick="askRemove('${name}')" class="trash-btn"><i class="fas fa-trash"></i></button></td>
          </tr>`;
    });

    const tax = subtotal * 0.05;
    const grandTotal = subtotal + 5 + tax;
    
    subtotalEl.innerText = "$" + subtotal.toFixed(2);
    if(document.getElementById("summary-tax")) document.getElementById("summary-tax").innerText = "$" + tax.toFixed(2);
    totalEl.innerText = "$" + grandTotal.toFixed(2);
}

window.goToPaymentPage = function() {
    if(window.cart.length === 0) { showToast("Cart empty!", "error"); return; }
    const total = document.getElementById("summary-total").innerText;
    localStorage.setItem("checkoutTotal", total);
    window.location.href = "payment.html";
};

// ==========================================
// 6. PAYMENT PAGE LOGIC
// ==========================================

function loadPaymentPage() {
    const total = localStorage.getItem("checkoutTotal") || "$0.00";
    const display = document.getElementById("pay-amount-display");
    if(display) display.innerText = total;

    setupCardInputListeners();
    
    const payForm = document.getElementById("payment-form");
    if (payForm) {
        payForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const btn = payForm.querySelector("button");
            
            btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Processing...';
            btn.style.opacity = "0.7";
            btn.disabled = true;
            
            setTimeout(() => {
                const modal = document.getElementById("success-modal");
                if(modal) {
                    modal.classList.remove("hidden");
                    setTimeout(() => modal.classList.add("show"), 10);
                }
                btn.innerHTML = "Paid";
            }, 2000);
        });
    }
}

window.finalizeOrder = function() {
    const orderHistory = JSON.parse(localStorage.getItem("orderHistory")) || [];
    const totalAmount = document.getElementById("pay-amount-display").innerText;
    
    if (window.cart.length > 0) {
        const newOrder = {
            id: "#MAD-" + Math.floor(1000 + Math.random() * 9000),
            date: new Date().toLocaleDateString(),
            items: window.cart,
            total: totalAmount,
            status: "Delivered"
        };
        orderHistory.push(newOrder);
        localStorage.setItem("orderHistory", JSON.stringify(orderHistory));
    }

    window.cart = [];
    localStorage.removeItem("cart");
    window.location.href = "tracking.html";
};

function setupCardInputListeners() {
    const numInput = document.getElementById('cc-number');
    const nameInput = document.getElementById('cc-name');
    const expInput = document.getElementById('cc-exp');
    const cvvInput = document.getElementById('cc-cvv');
    const cardWrapper = document.getElementById('card-3d');

    if(numInput) {
        numInput.addEventListener("input", (e) => {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(.{4})/g, '$1 ').trim();
            e.target.value = value;
            document.getElementById('disp-num').innerText = value || '#### #### #### ####';
        });
    }
    
    if(nameInput) {
        nameInput.addEventListener("input", (e) => {
            document.getElementById('disp-name').innerText = e.target.value.toUpperCase() || 'FULL NAME';
        });
    }
    
    if(expInput) {
        expInput.addEventListener("input", (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if(value.length >= 2) value = value.slice(0,2) + '/' + value.slice(2,4);
            e.target.value = value;
            document.getElementById('disp-exp').innerText = value || 'MM/YY';
        });
    }

    if(cvvInput && cardWrapper) {
        cvvInput.addEventListener('focus', () => { cardWrapper.classList.add('flip'); });
        cvvInput.addEventListener('blur', () => { cardWrapper.classList.remove('flip'); });
        cvvInput.addEventListener('input', (e) => {
            document.getElementById('disp-cvv').innerText = e.target.value || '***';
        });
    }
}

// ==========================================
// 7. ADMIN PANEL
// ==========================================

function renderAdminList() {
    const list = document.getElementById("admin-dish-list");
    if(!list) return;
    list.innerHTML = "";
    [...window.dishes].reverse().forEach(dish => {
        list.innerHTML += `
            <tr style="border-bottom:1px solid rgba(255,255,255,0.1);">
                <td style="padding:15px;"><img src="${dish.image}" class="dish-thumb" onerror="this.src='https://placehold.co/100'"></td>
                <td style="padding:15px;">${dish.name}</td>
                <td style="padding:15px;">${dish.category}</td>
                <td style="padding:15px;">$${dish.price.toFixed(2)}</td>
                <td style="padding:15px;">
                    <button onclick="deleteDish(${dish.id})" class="action-btn"><i class="fas fa-trash"></i></button>
                </td>
            </tr>`;
    });
}

function renderAdminChart() {
    const ctx = document.getElementById("revenueChart");
    if (!ctx) return;
    const orders = JSON.parse(localStorage.getItem("orderHistory")) || [];
    const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const totalRev = orders.reduce((sum, order) => {
        let val = typeof order.total === "string" ? parseFloat(order.total.replace("$", "")) : order.total;
        return sum + (isNaN(val) ? 0 : val);
    }, 0);
    const dataPoints = [totalRev * 0.1, totalRev * 0.15, totalRev * 0.05, totalRev * 0.2, totalRev * 0.1, totalRev * 0.3, totalRev * 0.1];

    if (window.myAdminChart) window.myAdminChart.destroy();
    window.myAdminChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                label: "Revenue ($)",
                data: dataPoints,
                borderColor: "#fbbf24",
                backgroundColor: "rgba(251, 191, 36, 0.2)",
                borderWidth: 3,
                tension: 0.4,
                fill: true,
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { labels: { color: "white" } } },
            scales: {
                y: { beginAtZero: true, grid: { color: "rgba(255,255,255,0.1)" }, ticks: { color: "#94a3b8" } },
                x: { grid: { display: false }, ticks: { color: "#94a3b8" } },
            },
        },
    });
}

window.showAnalytics = function () {
  const totalItems = window.dishes.length;
  const orders = JSON.parse(localStorage.getItem("orderHistory")) || [];
  const revenue = orders.reduce((sum, order) => {
    let val = typeof order.total === "string" ? parseFloat(order.total.replace("$", "")) : order.total;
    return sum + (isNaN(val) ? 0 : val);
  }, 0);

  const reportRevenue = document.getElementById("report-revenue");
  if (reportRevenue) {
    reportRevenue.innerText = "$" + revenue.toFixed(2);
    document.getElementById("report-orders").innerText = orders.length;
    document.getElementById("report-items").innerText = totalItems;

    openPopup("analytics-modal");
    setTimeout(renderAdminChart, 300);
  } else {
    alert(`Revenue: $${revenue}\nOrders: ${orders.length}`);
  }
};

window.downloadReport = function () {
  const date = new Date().toLocaleDateString();
  const content = `MADARA FOODS REPORT - ${date}`;
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Madara_Report_${Date.now()}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  showToast("Report Downloaded!");
};

// ==========================================
// 8. UTILS & MODALS
// ==========================================

function initTheme() {
    const themeBtn = document.getElementById("theme-toggle");
    if(themeBtn) {
        themeBtn.addEventListener("click", () => {
            document.body.classList.toggle("light-mode");
            localStorage.setItem("theme", document.body.classList.contains("light-mode") ? "light" : "dark");
        });
    }
}

// Common Modals
window.openModal = function(id) {
  const dish = window.dishes.find(d => d.id === id);
  if(!dish) return;
  currentDishId = id; currentQty = 1;
  document.getElementById("modal-img").src = dish.image;
  document.getElementById("modal-title").innerText = dish.name;
  document.getElementById("modal-desc").innerText = dish.desc;
  document.getElementById("modal-price").innerText = "$" + dish.price.toFixed(2);
  document.getElementById("modal-qty").innerText = currentQty;
  openPopup("food-modal");
};

window.closeModal = function() { closePopup("food-modal"); };
window.updateQty = function(n) { 
    if(currentQty + n >= 1) { currentQty += n; document.getElementById("modal-qty").innerText = currentQty; }
};

// FIX: TOGGLE FAVORITE WITHOUT RELOADING
window.toggleFavorite = function(event, id) {
    event.stopPropagation(); 
    const index = favorites.indexOf(id);
    const btn = event.currentTarget;
    const icon = btn.querySelector("i");

    if (index === -1) { 
        favorites.push(id); 
        icon.classList.remove("far");
        icon.classList.add("fas");
        btn.classList.add("active");
        showToast("Saved!"); 
    } else { 
        favorites.splice(index, 1); 
        icon.classList.remove("fas");
        icon.classList.add("far");
        btn.classList.remove("active");
        showToast("Removed."); 
    }
    localStorage.setItem("favorites", JSON.stringify(favorites));
    // Do NOT call renderDishes here to avoid resetting the grid
};

window.openPopup = function(id) {
    const el = document.getElementById(id);
    if(el) { el.classList.remove("hidden"); setTimeout(() => el.classList.add("show"), 10); }
}
window.closePopup = function(id) {
    const el = document.getElementById(id);
    if(el) { el.classList.remove("show"); setTimeout(() => el.classList.add("hidden"), 300); }
}

window.toggleMenu = function(event) {
    if(event) event.stopPropagation(); 
    const menu = document.getElementById("nav-menu");
    const icon = document.querySelector(".hamburger i");
    menu.classList.toggle("active");
    if (menu.classList.contains("active")) {
        icon.classList.remove("fa-bars"); icon.classList.add("fa-times");
    } else {
        icon.classList.remove("fa-times"); icon.classList.add("fa-bars");
    }
}

window.toggleProfileMenu = function(event) {
    if(event) event.stopPropagation();
    const menu = document.getElementById("profile-menu");
    if(menu) menu.classList.toggle("active");
};

window.toggleAdminSidebar = function () {
  const sidebar = document.querySelector(".sidebar");
  if (sidebar) sidebar.classList.toggle("active");
};

document.addEventListener("click", (e) => {
    // Menu
    const nav = document.getElementById("nav-menu");
    const burger = document.querySelector(".hamburger");
    if (nav && nav.classList.contains("active") && !nav.contains(e.target) && !burger.contains(e.target)) {
        window.toggleMenu(e);
    }
    // Profile
    const profileMenu = document.getElementById("profile-menu");
    const profileBtn = document.getElementById("user-profile");
    if (profileMenu && profileMenu.classList.contains("active") && !profileBtn.contains(e.target)) {
        profileMenu.classList.remove("active");
    }
    // Admin Sidebar (Mobile)
    if (e.target.closest('.admin-hamburger')) return;
    if (window.innerWidth <= 968) {
      const sidebar = document.querySelector(".sidebar");
      if (sidebar && sidebar.classList.contains("active") && !e.target.closest('.sidebar')) {
          sidebar.classList.remove("active");
      }
    }
});

// Popups (Delete/Logout)
window.askRemove = function(name) {
    window.pendingAction = { type: 'item', name: name };
    document.getElementById("confirm-msg").innerText = `Remove ${name}?`;
    openPopup("confirm-modal");
};
window.triggerCancel = function() {
    window.pendingAction = { type: 'all' };
    document.getElementById("confirm-msg").innerText = "Cancel order?";
    openPopup("confirm-modal");
};
window.deleteDish = function (id) {
  window.pendingAction = { type: "delete-dish", id: id };
  const modal = document.getElementById("confirm-modal");
  if(modal) {
      modal.querySelector("h3").innerText = "Delete Dish?";
      document.getElementById("confirm-msg").innerText = "This cannot be undone.";
      openPopup("confirm-modal");
  }
};
window.logoutUser = function () {
  window.pendingAction = { type: "logout" };
  const modal = document.getElementById("confirm-modal");
  if (modal) {
    modal.querySelector("h3").innerText = "Logout?";
    document.getElementById("confirm-msg").innerText = "Sign out now?";
    openPopup("confirm-modal");
  } else if (confirm("Logout?")) {
      localStorage.removeItem("currentUser");
      window.location.href = "index.html";
  }
};

window.confirmAction = function () {
  if (!window.pendingAction) return;
  if (window.pendingAction.type === 'item') {
      window.cart = window.cart.filter(item => item.name !== window.pendingAction.name);
      saveAndRefreshCart();
  } else if (window.pendingAction.type === 'all') {
      window.cart = [];
      saveAndRefreshCart();
  } else if (window.pendingAction.type === "logout") {
      localStorage.removeItem("currentUser");
      window.location.href = "index.html";
  } else if (window.pendingAction.type === "delete-dish") {
      const index = window.dishes.findIndex(d => d.id === window.pendingAction.id);
      if (index > -1) {
          window.dishes.splice(index, 1);
          localStorage.setItem("allDishes", JSON.stringify(window.dishes));
          if(typeof renderAdminList === 'function') renderAdminList();
          showToast("Deleted");
      }
  }
  closePopup('confirm-modal');
  window.pendingAction = null;
};

function saveAndRefreshCart() {
    localStorage.setItem("cart", JSON.stringify(window.cart));
    if(typeof loadCheckoutItems === 'function') loadCheckoutItems();
    if(typeof updateCartCount === 'function') updateCartCount();
}

// Extra Missing
window.submitReservation = function () {
  const btn = document.querySelector("#booking-form .form-submit-btn");
  if(btn) {
      btn.innerHTML = 'Booking...';
      setTimeout(() => {
          showToast("Table Booked!");
          btn.innerHTML = 'Confirmed';
          document.getElementById("booking-form").reset();
      }, 1500);
  }
};
window.subscribeNewsletter = function () {
    const email = document.getElementById("news-email").value;
    if(email) showToast("Subscribed!");
};

// Tracking
function initTrackingPage() {
  startTimer(15 * 60);
  setTimeout(() => updateTrackStatus(2), 3000);
  setTimeout(() => { updateTrackStatus(3); startBikeAnimation(); }, 8000);
}
function updateTrackStatus(step) {
    for(let i=1; i < step; i++) document.getElementById(`step-${i}`)?.classList.add('active');
    document.getElementById(`step-${step}`)?.classList.add('active', 'current');
}
function startBikeAnimation() {
    const bike = document.getElementById("delivery-bike");
    if(bike) { bike.style.opacity = "1"; bike.style.animation = "driveMap 10s linear infinite alternate"; }
}
function startTimer(duration) {
    let timer = duration, minutes, seconds;
    const display = document.getElementById('delivery-timer');
    if(window.trackInterval) clearInterval(window.trackInterval);
    window.trackInterval = setInterval(function () {
        minutes = parseInt(timer / 60, 10); seconds = parseInt(timer % 60, 10);
        minutes = minutes < 10 ? "0" + minutes : minutes; seconds = seconds < 10 ? "0" + seconds : seconds;
        if(display) display.textContent = minutes + ":" + seconds;
        if (--timer < 0) {
            clearInterval(window.trackInterval);
            if(display) display.textContent = "Arrived";
            updateTrackStatus(4);
            const modal = document.getElementById("delivery-modal");
            if(modal) { modal.classList.remove("hidden"); setTimeout(()=>modal.classList.add("show"),10); }
        }
    }, 1000);
}
window.closeDeliveryModal = function() { closePopup("delivery-modal"); };