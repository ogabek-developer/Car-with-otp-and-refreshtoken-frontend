
const cBody = document.querySelector('#cBody');
const REFRESH_URL = "http://127.0.0.1:4000/api/auth/refresh";
const categoryForm = document.querySelector('.categoryForm');
const Href = document.querySelector('.Href' )

let token = window.localStorage.getItem("token") || null;
let isRefreshing = false;
let refreshPromise = null

if(!token){
  window.location.href = '/login.html'
}

// JWT parse qilish
function parseJwt(t) {
  if (!t) return null;
  try {
    return JSON.parse(atob(t.split('.')[1]));
  } catch (e) {
    return null;
  }
}

// JSON parse qilish, xato bo'lsa null qaytaradi
async function parseJsonSafely(response) {
  try {
    return await response.clone().json();
  } catch (err) {
    return null;
  }
}

// Token refresh qilish
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

// Custom fetch funksiyasi token bilan
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

// Kategoriyalarni olish
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

// Category form submit
categoryForm.addEventListener("submit", async (evt) => {
  evt.preventDefault();

  const categoryNames = document.querySelector('.categoryNames');
  const categoryImages = document.querySelector('.categoryImages');

  if (!categoryNames.value) {
    alert("Category name bo'sh bo'lmasligi kerak");
    return;
  }

  const formData = new FormData();
  formData.append("name", categoryNames.value);
  if (categoryImages.files[0]) {
    formData.append("logo", categoryImages.files[0]);
  }

  try {
    const response = await customFetch("http://127.0.0.1:4000/api/category/create", {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      const errBody = await parseJsonSafely(response);
      console.warn("Kategoriya yaratishda xato:", response.status, errBody);
      return;
    }

    const res = await response.json();
    console.log("Kategoriya yaratildi:", res);

    getCategory();
    categoryForm.reset();

  } catch (error) {
    console.error("Server bilan ulanishda muammo:", error);
  }
});

// Modal yaratish (body ichida)
const editModal = document.createElement("div");
editModal.id = "editModal";
editModal.style.display = "none";
editModal.innerHTML = `
  <div style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); display:flex; align-items:center; justify-content:center;">
    <div style="background:white; padding:20px; border-radius:8px; width:300px;">
      <h2>Edit Category</h2>
      <form id="editForm">
        <input type="text" name="editName" class="editName" placeholder="Name" required style="width:100%; margin-bottom:10px;" />
        <input type="file" name="editLogo" class="editLogo" style="width:100%; margin-bottom:10px;" />
        <button type="submit" style="margin-right:10px;">Save</button>
        <button type="button" id="closeModal">Cancel</button>
      </form>
    </div>
  </div>
`;
document.body.appendChild(editModal);

const editForm = editModal.querySelector("#editForm");
const editNameInput = editModal.querySelector(".editName");
const editLogoInput = editModal.querySelector(".editLogo");
const closeModalBtn = editModal.querySelector("#closeModal");

let currentEditId = null;

// Modalni yopish
closeModalBtn.addEventListener("click", () => {
  editModal.style.display = "none";
  editForm.reset();
  currentEditId = null;
});

// Kategoriyalarni render qilish, edit & delete tugmalar bilan
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
      <div class="flex gap-2 mt-2">
        <button 
          class="edit-btn eds px-4 py-1 bg-blue-500 text-white rounded" 
          data-id="${cat._id}"
          data-name="${cat.name}"
        >Edit</button>
        <button 
          class="delete-btn dels px-4 py-1 bg-red-500 text-white rounded" 
          data-id="${cat._id}"
        >Delete</button>
      </div>
    `;

    cBody.appendChild(div);

    // Delete tugmasi
    const deleteBtn = div.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", async (e) => {
      const id = e.currentTarget.dataset.id;
      console.log("hello");

      if (!confirm("Rostdan o'chirmoqchimisiz?")) return;

      try {
        const res = await customFetch(`http://127.0.0.1:4000/api/category/delete/${id}`, {
          method: "DELETE"
        });

        if (!res.ok) {
          const errBody = await parseJsonSafely(res);
          console.warn("O'chirishda xato:", res.status, errBody);
          return;
        }

        console.log("Kategoriya o'chirildi:", id);
        getCategory();
      } catch (err) {
        console.error("Server bilan ulanishda muammo:", err);
      }
    });

    // Edit tugmasi
    const editBtn = div.querySelector(".edit-btn");
    editBtn.addEventListener("click", () => {
      currentEditId = editBtn.dataset.id;
      editNameInput.value = editBtn.dataset.name;
      editLogoInput.value = "";
      editModal.style.display = "flex";
    });
  });
}

// Edit form submit
editForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!currentEditId) return;

  const formData = new FormData();
  formData.append("name", editNameInput.value);
  if (editLogoInput.files[0]) {
    formData.append("logo", editLogoInput.files[0]);
  }

  try {
    const res = await customFetch(`http://127.0.0.1:4000/api/category/update/${currentEditId}`, {
      method: "PUT",
      body: formData
    });

    if (!res.ok) {
      const errBody = await parseJsonSafely(res);
      console.warn("Kategoriya update xato:", res.status, errBody);
      return;
    }

    console.log("Kategoriya yangilandi:", currentEditId);
    getCategory();
    editModal.style.display = "none";
    editForm.reset();
    currentEditId = null;

  } catch (err) {
    console.error("Server bilan ulanishda muammo:", err);
  }
});

// Sahifa yuklanganda kategoriya olish
getCategory();
