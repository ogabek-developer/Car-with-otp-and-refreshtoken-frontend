
const cBody = document.querySelector('#cBody');
const REFRESH_URL = "http://127.0.0.1:4000/api/auth/refresh";

let token = window.localStorage.getItem("token") || null;
let isRefreshing = false;
let refreshPromise = null;

function parseJwt(t) {
  if (!t) return null;
  try {
    return JSON.parse(atob(t.split('.')[1]));
  } catch (e) {
    return null;
  }
}

async function parseJsonSafely(response) {
  try {
    return await response.clone().json();
  } catch (err) {
    return null;
  }
}

async function refreshTokens() {
  if (isRefreshing && refreshPromise) return refreshPromise;

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const res = await fetch(REFRESH_URL, {
        method: "POST",
        credentials: "include"
      });

      if (!res.ok) {
        throw new Error("Refresh failed: " + res.status);
      }

      const data = await res.json();
      if (!data.accessToken) {
        throw new Error("Refresh response da accessToken yo‘q");
      }

    
      token = data.accessToken;
      window.localStorage.setItem("token", token);

      return token;
    } catch (err) {
    
      window.localStorage.removeItem("token");
      window.location.href = "/login.html";
      throw err;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

async function customFetch(url, options = {}) {
  options = { ...options };
  options.headers = { ...(options.headers || {}) };
  options.credentials = "include";

  const attachToken = () => {
    const t = window.localStorage.getItem("token");
    if (t) options.headers.token = t;
    else delete options.headers.token;

    if (!options.headers["Content-Type"] && !(options.body instanceof FormData)) {
      options.headers["Content-Type"] = "application/json";
    }
  };

  attachToken();

  let response = await fetch(url, options);


  if (response.status === 401 || response.status === 403) {
    const body = await parseJsonSafely(response);

    const expired =
      body?.code === "TOKEN_EXPIRED" ||
      body?.name === "TokenExpiredError" ||
      (typeof body?.message === "string" && body.message.includes("TokenExpired"));

    if (expired) {
      try {
        
        await refreshTokens();
        attachToken();
      
        response = await fetch(url, options);
      } catch (err) {
        throw err;
      }
    } else {
    
      window.localStorage.removeItem("token");
      window.location.href = "/login.html";
      throw new Error("Unauthorized");
    }
  }

  return response;
}

async function getCategory() {
  try {
    const req = await customFetch("http://127.0.0.1:4000/api/category/get/all");
    if (!req.ok) {
      const errBody = await parseJsonSafely(req);
      console.warn("getCategory xato:", req.status, errBody);
      return;
    }

    const res = await req.json();
    if (Array.isArray(res) && res.length) {
      renderCategories(res);
    } else {
      console.log("Kategoriya topilmadi yoki bo'sh:", res);
    }
  } catch (error) {
    console.error("Server bilan ulanishda muammo:", error);
  }
}

function renderCategories(categories) {
  cBody.innerHTML = "";

  categories.forEach((cat) => {
    const div = document.createElement("div");
    div.className =
      "flex flex-col items-center bg-gray-100 rounded-xl overflow-hidden shadow-sm cursor-pointer min-h-80";

    div.innerHTML = `
      <div class="w-full h-56 mb-4 overflow-hidden rounded-t-xl relative group">
        <img
          src="${cat.logo}"
          alt="${cat.name}"
          class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div class="absolute inset-0 bg-gray-700 bg-opacity-20"></div>
      </div>
      <p class="font-bold text-lg mb-1">${cat.name}</p>
    `;

    cBody.appendChild(div);
  });
}

getCategory();
