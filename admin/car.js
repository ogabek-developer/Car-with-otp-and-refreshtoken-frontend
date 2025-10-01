
// --- Elements & token ---
const carBody = document.getElementById('csBody'); // container div
const token = window.localStorage.getItem("token");
const addCarBtn = document.querySelector('.addCarBtn');

if (!token) {
  window.location.href = '/login.html';
}

// --- Custom fetch token bilan ---
async function customFetch(url, options = {}) {
  options = { ...options };
  options.headers = { ...(options.headers || {}) };
  options.credentials = "include";

  const t = window.localStorage.getItem("token");
  if (t) options.headers.token = t;

  let response = await fetch(url, options);

  if (response.status === 401 || response.status === 403) {
    window.localStorage.removeItem("token");
    window.location.href = "/login.html";
    throw new Error("Unauthorized");
  }

  return response;
}

// --- Get categories for brandName select ---
let categories = [];
async function getCategories() {
  try {
    const res = await customFetch("http://127.0.0.1:4000/api/category/get/all");
    if (res.ok) {
      const data = await res.json();
      categories = data.map(c => c.name);
    }
  } catch (err) {
    console.error("Category olishda xato:", err);
  }
}

// --- Get all cars ---
async function getAllCars() {
  try {
    const req = await fetch('http://127.0.0.1:4000/api/cars/get/all', {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    const res = await req.json();
    if (req.ok) {
      renderCars(res);
    } else {
      console.error("Xato ma’lumot kelmoqda:", res);
    }
  } catch (error) {
    console.error(error);
  }
}

// --- Render cars with edit & delete ---
function renderCars(data) {
  carBody.innerHTML = '';

  data.forEach((car, index) => {
    const carDiv = document.createElement('div');
    carDiv.className = "bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow p-4 mb-4";

    carDiv.innerHTML = `
      <div class="h-80 bg-gray-100 relative overflow-hidden mb-2">
        <img src="${car.photo || `https://picsum.photos/400/300?random=${index+1}`}" alt="${car.modelName}" class="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-110"/>
      </div>
      <div class="flex justify-between mb-2">
        <h3 class="text-xl font-bold"> < ${car.brandName} > ${car.modelName}</h3>
        <span class="text-lg font-semibold text-blue-500">${car.year}</span>
      </div>
      <div class="flex justify-between mb-2">
        <span class="text-xl font-bold"> car_hp :  ${car.car_hp}</span>
        <span class="text-xl font-bold ">car_price : ${car.price}$</span>
      </div>
      <div class="flex justify-between mb-2">
        <span class="text-xl font-bold"> max_speed :  ${car.max_speed}</span>
        <span class="text-xl font-bold ">motor_liter : ${car.motor_liter}</span>
      </div>
      <div class="flex justify-between mb-2">
        <span class="text-xl font-bold"> count :  ${car.count}</span>
        <span class="text-xl font-bold ">distance : ${car.distance}</span>
      </div>
      <div class="flex justify-between m-5">
        <span class="text-xl font-bold "> < moshin haqida > ${car.description}</span>
      </div>
      <div class="flex gap-2 mb-2">
        <button class="bedit px-3 py-1 bg-yellow-400 text-white rounded" data-id="${car._id}">Edit</button>
        <button class="bdelete px-3 py-1 bg-red-500 text-white rounded" data-id="${car._id}">Delete</button>
      </div>
    `;

    carBody.appendChild(carDiv);
  });
}

// --- Delete & Edit car ---
document.addEventListener("click", async function(e){
  if(e.target.closest(".bdelete")){
    const btn = e.target.closest(".bdelete");
    const carId = btn.dataset.id;

    if(!confirm("Rostdan o'chirmoqchimisiz?")) return;

    try{
      const req = await fetch(`http://127.0.0.1:4000/api/cars/delete/${carId}`,{
        method:"DELETE",
        headers:{
          "Content-Type":"application/json",
          token
        }
      });
      if(req.ok){
        alert('Car deleted');
        getAllCars();
      }
    }catch(err){
      console.error(err);
    }
  }

  if(e.target.closest(".bedit")){
    const btn = e.target.closest(".bedit");
    const carId = btn.dataset.id;
    openCarModal(carId);
  }
});

// --- Car modal ---
const carModal = document.createElement("div");
carModal.id = "carModal";
carModal.style.display = "none";
carModal.innerHTML = `
<div style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:1000;">
  <div style="background:white;padding:20px;border-radius:8px;width:700px;max-height:90vh;overflow-y:auto;">
    <h2 id="carModalTitle" class="text-xl font-bold mb-4">Add New Car</h2>
    <form id="carForm" class="grid grid-cols-2 gap-4">
      <label>Brand Name:
        <select name="brandName" class="brandName" required style="width:100%;border:1px solid #ccc;padding:5px;border-radius:4px;"></select>
      </label>
      <label>Country:
        <input type="text" name="country" class="country" required style="width:100%;border:1px solid #ccc;padding:5px;border-radius:4px;" />
      </label>
      <label>Photo:
        <input type="file" name="photo" class="photo" style="width:100%;border:1px solid #ccc;padding:5px;border-radius:4px;" />
      </label>
      <label>Model Name:
        <input type="text" name="modelName" class="modelName" required style="width:100%;border:1px solid #ccc;padding:5px;border-radius:4px;" />
      </label>
      <label>Color:
        <input type="text" name="color" class="color" required style="width:100%;border:1px solid #ccc;padding:5px;border-radius:4px;" />
      </label>
      <label>Acceleration:
        <input type="text" name="acceleration" class="acceleration" required style="width:100%;border:1px solid #ccc;padding:5px;border-radius:4px;" />
      </label>
      <label>Max Speed:
        <input type="number" name="max_speed" class="max_speed" required style="width:100%;border:1px solid #ccc;padding:5px;border-radius:4px;" />
      </label>
      <label>Fuel Type:
        <input type="text" name="fuelType" class="fuelType" required style="width:100%;border:1px solid #ccc;padding:5px;border-radius:4px;" />
      </label>
      <label>Transmission:
        <input type="text" name="transmission" class="transmission" required style="width:100%;border:1px solid #ccc;padding:5px;border-radius:4px;" />
      </label>
      <label>Car HP:
        <input type="number" name="car_hp" class="car_hp" required style="width:100%;border:1px solid #ccc;padding:5px;border-radius:4px;" />
      </label>
      <label>Motor Liter:
        <input type="number" name="motor_liter" class="motor_liter" required style="width:100%;border:1px solid #ccc;padding:5px;border-radius:4px;" />
      </label>
      <label>Year:
        <input type="number" name="year" class="year" required style="width:100%;border:1px solid #ccc;padding:5px;border-radius:4px;" />
      </label>
      <label>Distance:
        <input type="number" name="distance" class="distance" required style="width:100%;border:1px solid #ccc;padding:5px;border-radius:4px;" />
      </label>
      <label>Count:
        <input type="number" name="count" class="count" required style="width:100%;border:1px solid #ccc;padding:5px;border-radius:4px;" />
      </label>
      <label>Description:
        <input type="text" name="description" class="description" style="width:100%;border:1px solid #ccc;padding:5px;border-radius:4px;" />
      </label>
      <label>Price:
        <input type="text" name="price" class="price" required style="width:100%;border:1px solid #ccc;padding:5px;border-radius:4px;" />
      </label>
      <div class="col-span-2 flex justify-end gap-2 mt-4">
        <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded">Save</button>
        <button type="button" id="closeCarModal" class="px-4 py-2 bg-gray-400 text-white rounded">Cancel</button>
      </div>
    </form>
  </div>
</div>
`;
document.body.appendChild(carModal);

const carForm = carModal.querySelector("#carForm");
const closeCarModalBtn = carModal.querySelector("#closeCarModal");
const carModalTitle = carModal.querySelector("#carModalTitle");
const brandSelect = carForm.querySelector(".brandName");

// --- Close modal ---
closeCarModalBtn.addEventListener("click", ()=>{
  carModal.style.display="none";
  carForm.reset();
  editingCarId = null;
});

// --- Add car button ---
addCarBtn.addEventListener("click", async ()=>{
  carModalTitle.textContent="Add New Car";
  editingCarId=null;
  await populateBrandSelect();
  carForm.reset();
  carModal.style.display="flex";
});

// --- Populate brand select ---
async function populateBrandSelect(){
  await getCategories();
  brandSelect.innerHTML='';
  categories.forEach(cat=>{
    const opt=document.createElement("option");
    opt.value=cat;
    opt.textContent=cat;
    brandSelect.appendChild(opt);
  });
}

let editingCarId=null;

// --- Open car modal for edit ---
async function openCarModal(carId){
  editingCarId=carId;
  carModalTitle.textContent="Edit Car";

  await populateBrandSelect();
  carModal.style.display="flex";

  try{
    const res = await fetch(`http://127.0.0.1:4000/api/cars/get/${carId}`,{
      headers: { Authorization:`Bearer ${token}` }
    });
    if(!res.ok) return;
    const car = await res.json();

    carForm.brandName.value=car.brandName;
    carForm.country.value=car.country;
    carForm.modelName.value=car.modelName;
    carForm.color.value=car.color;
    carForm.acceleration.value=car.acceleration;
    carForm.max_speed.value=car.max_speed;
    carForm.fuelType.value=car.fuelType;
    carForm.transmission.value=car.transmission;
    carForm.car_hp.value=car.car_hp;
    carForm.motor_liter.value=car.motor_liter;
    carForm.year.value=car.year;
    carForm.distance.value=car.distance;
    carForm.count.value=car.count;
    carForm.description.value=car.description;
    carForm.price.value=car.price;
  }catch(err){
    console.error(err);
  }
}

// --- Submit car form ---
carForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData();

  formData.append("brandName", carForm.brandName.value);
  formData.append("country", carForm.country.value);
  formData.append("modelName", carForm.modelName.value);
  formData.append("color", carForm.color.value);
  formData.append("acceleration", carForm.acceleration.value);
  formData.append("max_speed", carForm.max_speed.value);
  formData.append("fuelType", carForm.fuelType.value);
  formData.append("transmission", carForm.transmission.value);
  formData.append("car_hp", carForm.car_hp.value);
  formData.append("motor_liter", carForm.motor_liter.value);
  formData.append("year", carForm.year.value);
  formData.append("distance", carForm.distance.value);
  formData.append("count", carForm.count.value);
  formData.append("description", carForm.description.value);
  formData.append("price", carForm.price.value);

  const photoInput = carForm.querySelector(".photo");
  if(photoInput.files[0]) {
    formData.append("photo", photoInput.files[0]);
  }

  try {
    let url = "http://127.0.0.1:4000/api/cars/create";
    let method = "POST";

    if(editingCarId) {
      url = `http://127.0.0.1:4000/api/cars/update/${editingCarId}`;
      method = "PUT";
    }

    const res = await fetch(url, {
      method,
      body: formData,
      headers: { token }
    });

    if(res.ok){
      alert(editingCarId ? "Car updated successfully" : "Car added successfully");
      carModal.style.display="none";
      carForm.reset();
      editingCarId=null;
      getAllCars();
    } else {
      const errBody = await res.json();
      console.warn("Xato:", errBody);
    }

  } catch(err){
    console.error(err);
  }
});

// --- Initial fetch ---
getAllCars();
