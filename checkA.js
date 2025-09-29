
(function () {
  const token = localStorage.getItem("token");

  // if (!token) {
  //   console.warn("❌ Token topilmadi. Login pagega yo‘naltiryapman...");
  //   window.location.href = "/login.html";
  //   return;
  // }

  try {
    const payload = jwt_decode(token);
    console.log("✅ Token payload:", payload);
    
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      console.warn("⚠️ Token muddati tugagan!");
      // localStorage.removeItem("token");
      // window.location.href = "/login.html";
      return;
    }

    const role = payload.role;

    const currentPath = window.location.pathname;

    if (role === "user") {
      
      if (currentPath.startsWith("/admin")) {
        console.warn("❌ User admin sahifasiga kira olmaydi!");
        window.location.href = "/client/index.html";
      }
    } else if (role === "admin") {
      
      console.log("👑 Admin har ikkala page’ga kira oladi");
    } else {
      console.warn("❓ Noma’lum role:", role);
      // localStorage.removeItem("token");
      // window.location.href = "/login.html";
    }
  } catch (err) {
    console.error("❌ Token decode qilishda xato:", err);
    // localStorage.removeItem("token");
    // window.location.href = "/login.html";
  }
})();
