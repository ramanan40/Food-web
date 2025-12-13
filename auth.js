// // ==========================================
// // AUTHENTICATION LOGIC (Fixed)
// // ==========================================

// document.addEventListener("DOMContentLoaded", () => {
//     checkLoginState();
// });

// // 1. Check Login State (Runs on every page)
// function checkLoginState() {
//     const user = JSON.parse(localStorage.getItem("currentUser"));
    
//     // Elements
//     const loginBtn = document.getElementById("login-btn");
//     const userProfile = document.getElementById("user-profile");
//     const userNameDisplay = document.getElementById("user-name-display");
    
//     // Profile Dropdown Elements
//     const menuName = document.getElementById("menu-user-name");
//     const menuEmail = document.getElementById("menu-user-email");

//     // If elements don't exist (e.g. on login page), stop
//     if (!loginBtn && !userProfile) return;

//     if (user) {
//         // --- USER IS LOGGED IN ---
//         if(loginBtn) loginBtn.style.display = "none";
//         if(userProfile) {
//             userProfile.classList.remove("hidden");
//             userProfile.style.display = "flex";
//         }
        
//         // Update Name/Email in Navbar & Dropdown
//         if(userNameDisplay) userNameDisplay.innerText = user.name;
//         if(menuName) menuName.innerText = user.name;
//         if(menuEmail) menuEmail.innerText = user.email;
        
//     } else {
//         // --- USER IS LOGGED OUT ---
//         if(loginBtn) loginBtn.style.display = "flex";
//         if(userProfile) {
//             userProfile.classList.add("hidden");
//             userProfile.style.display = "none";
//         }
//     }
// }

// // 2. Handle Login Form Submit (On login.html)
// const pgLoginForm = document.getElementById("page-login-form");
// if (pgLoginForm) {
//     pgLoginForm.addEventListener("submit", (e) => {
//         e.preventDefault(); // Stop page reload
        
//         const email = document.getElementById("pg-login-email").value;
//         const pass = document.getElementById("pg-login-pass").value;

//         if (email && pass) {
//             console.log("Processing Login for:", email);
            
//             // Create Fake User Object
//             const fakeName = email.split('@')[0];
//             const capitalizedName = fakeName.charAt(0).toUpperCase() + fakeName.slice(1);
            
//             const user = { 
//                 name: capitalizedName, 
//                 email: email 
//             };
            
//             // Save to Storage
//             localStorage.setItem("currentUser", JSON.stringify(user));
            
//             // Show Success
//             if (typeof Toastify !== 'undefined') {
//                 Toastify({ text: `Welcome back, ${user.name}!`, style: { background: "#1e293b", border: "1px solid #fbbf24" } }).showToast();
//             } else {
//                 alert(`Welcome back, ${user.name}!`);
//             }
            
//             // Redirect to Home
//             setTimeout(() => {
//                 window.location.href = "index.html";
//             }, 1000);
//         } else {
//             alert("Please fill in all fields");
//         }
//     });
// }

// // 3. Handle Signup Form (On login.html)
// const pgSignupForm = document.getElementById("page-signup-form");
// if (pgSignupForm) {
//     pgSignupForm.addEventListener("submit", (e) => {
//         e.preventDefault();
        
//         const name = document.getElementById("pg-signup-name").value;
//         const email = document.getElementById("pg-signup-email").value;
//         const pass = document.getElementById("pg-signup-pass").value;

//         if (name && email && pass) {
//             console.log("Creating Account for:", name);
            
//             const user = { name: name, email: email };
//             localStorage.setItem("currentUser", JSON.stringify(user));
            
//             if (typeof Toastify !== 'undefined') {
//                 Toastify({ text: "Account Created! Redirecting...", style: { background: "#1e293b", border: "1px solid #fbbf24" } }).showToast();
//             } else {
//                 alert("Account Created!");
//             }
            
//             setTimeout(() => {
//                 window.location.href = "index.html";
//             }, 1000);
//         }
//     });
// }

// // 4. Logout Logic
// window.logoutUser = function() {
//     if(confirm("Are you sure you want to logout?")) {
//         localStorage.removeItem("currentUser");
//         window.location.href = "index.html"; // Refresh page to reset state
//     }
// };

// // 5. Toggle Profile Menu (For the Dropdown)
// window.toggleProfileMenu = function(event) {
//     if(event) event.stopPropagation();
//     const menu = document.getElementById("profile-menu");
//     if(menu) menu.classList.toggle("active");
// };

// // Close menu when clicking outside
// document.addEventListener("click", (e) => {
//     const menu = document.getElementById("profile-menu");
//     const profileBtn = document.getElementById("user-profile");
    
//     // If menu is open AND click is NOT on the profile button
//     if (menu && menu.classList.contains("active") && profileBtn && !profileBtn.contains(e.target)) {
//         menu.classList.remove("active");
//     }
// });