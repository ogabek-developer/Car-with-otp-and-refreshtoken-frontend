
const carBody = document.getElementById('csBody'); // container div
const token = window.localStorage.getItem("token");
const addCarBtn = document.getElementById('addCarBtn') ;

if (!token) {
  window.location.href = '/login.html';
}

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

// Carlarni render qilish
function renderCars(data) {
  carBody.innerHTML = ''; // eski elementlarni tozalash

  data.forEach((car, index) => {
    const carDiv = document.createElement('div');
    carDiv.className = "bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow";

    carDiv.innerHTML = `
      <div class="h-80 bg-gray-100 relative overflow-hidden">
        <img
          src="${car.photo || `https://picsum.photos/400/300?random=${index+1}`}"
          alt="${car.modelName}"
          class="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-110"
        />
        <div class="absolute top-4 right-4">
          <span class="bg-blue-100 text-blue-700 text-sm font-medium px-3 py-1.5 rounded-full">
            ${car.fuelType || 'N/A'}
          </span>
        </div>
      </div>

      <div class="p-6">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-xl font-bold text-gray-900">${car.brandName}</h3>
          <span class="text-lg font-semibold text-blue-500">${car.year}</span>
        </div>

        <div class="grid grid-cols-2 gap-4 mb-6">
          <div class="bg-gray-50 rounded-lg p-3">
            <p class="text-xs text-gray-500 mb-1">Price</p>
            <p class="text-sm font-medium">${car.price || 'N/A'} $</p>
          </div>
          <div class="bg-gray-50 rounded-lg p-3">
            <p class="text-xs text-gray-500 mb-1">Horsepower</p>
            <p class="text-sm font-medium">${car.car_hp || 'N/A'} HP</p>
          </div>
          <div class="bg-gray-50 rounded-lg p-3">
            <p class="text-xs text-gray-500 mb-1">Top Speed</p>
            <p class="text-sm font-medium">${car.acceleration || 'N/A'} km/h</p>
          </div>
        </div>

        <div class="flex gap-3">
          <button class="w-10 h-10 border border-gray-200 rounded-button flex items-center justify-center hover:bg-gray-50 transition-colors">
            <i class="ri-heart-line text-gray-600"></i>
          </button>
          <button class="bdelete w-14 h-10 border border-red-400 rounded-button flex items-center justify-center hover:bg-gray-50 transition-colors" data-id="${car._id}">
            delete
          </button>
        </div>
      </div>
    `;

    carBody.appendChild(carDiv);
  });
}


document.addEventListener("click", async function (e) {
  if (e.target.closest(".bdelete")) {
    const btn = e.target.closest(".bdelete");
    const carId = btn.dataset.id;
    console.log("Delete car id:", carId);

    try {
      const req = await fetch(`http://127.0.0.1:4000/api/cars/delete/${carId}`, {
        method : "DELETE",
        headers : {
          "Content-type" : "application/json",
          token : token
        }
      });
      if(req.ok){
        const res = await req.json();
        alert('deleted');
        getAllCars() ;
      }


      console.log(res)
    } catch (error) {
      console.log(error)
    }
  }
});

// Carlarni sahifa yuklanganda olish
getAllCars();
