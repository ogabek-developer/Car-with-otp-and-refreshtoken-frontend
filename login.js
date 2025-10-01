


const loginForm = document.querySelector('.loginForm');
const l_email = document.querySelector('.l_email');
const l_password = document.querySelector('.l_password');
const Token = window.localStorage.getItem('token');

if (Token) {
  verifyToken(Token); 
}

loginForm.addEventListener('submit', (evt) => {
  evt.preventDefault();

  if (!l_email.value.trim() || !l_password.value.trim()) {
    alert("❌ Email va parolni kiriting!");
    return;
  }

  handleLogin(l_email.value, l_password.value);
});

async function handleLogin(email, password) {
  try {
    const req = await fetch('http://127.0.0.1:4000/api/auth/login', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        password
      })
    });

    const res = await req.json();

    if (req.ok) {
      alert("✅ Login muvaffaqiyatli:");
      const token = res.accessToken;
      if (!token) throw new Error("Token kelmadi!");
      window.localStorage.setItem("token", token);
      window.localStorage.setItem("email", email)
      verifyToken(token);
    } else {
      console.error("❌ Login xato:", res);
      alert("❌" + (res.message || "Email yoki parol noto‘g‘ri"));
    }
  } catch (error) {
    console.error("Server bilan ulanishda muammo:", error);
  }
}

function togglePasswordVisibility(id) {
  const input = document.getElementById(id);
  const icon = input.nextElementSibling.nextElementSibling;
  if (input.type === "password") {
    input.type = "text";
    icon.classList.remove("fa-eye-slash");
    icon.classList.add("fa-eye");
  } else {
    input.type = "password";
    icon.classList.remove("fa-eye");
    icon.classList.add("fa-eye-slash");
  }
}

function verifyToken(token) {
  try {
    const payload = jwt_decode(token);

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) {

      return;
    };
    if (payload.role === "admin") {
      window.location.href = "/admin/index.html";
    } else {
      window.location.href = "/client/index.html";
    }
  } catch (err) {
    console.error("Tokenni tekshirishda xato:", err);
  }
}
