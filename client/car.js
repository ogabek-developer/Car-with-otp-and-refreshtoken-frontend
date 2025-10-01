const carBody  = document.querySelector('#car_body') ;
const token =  window.localStorage.getItem("token") ;

if(!token){
  window.location.href = '/login.html';
};

// Fetch qilish va render
async function getAllcars(){
  try {
    const req = await fetch('http://127.0.0.1:4000/api/cars/get/all', {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const res = await req.json();

    if(req.ok){
      handleRenderCar(res);
    } else {
      console.error("Xato ma’lumot kelmoqda:", res);
    }
  } catch (error) {
    console.error(error);
  }
};

function handleRenderCar(cars){
  carBody.innerHTML = ''; // oldingi elementlarni tozalash

  cars.forEach((car, index) => {
    const carHTML = `
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
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
            <h3 class="text-xl font-bold text-gray-900"> < ${car.brandName} >  ${car.modelName}</h3>
            <span class="text-lg font-semibold text-blue-500">${car.year}</span>
          </div>

          <div class="grid grid-cols-2 gap-4 mb-6">
            <div class="bg-gray-50 rounded-lg p-3">
              <p class="text-xs text-gray-500 mb-1">Quvvat</p>
              <p class="text-sm font-medium">${car.car_hp}</p>
            </div>
            <div class="bg-gray-50 rounded-lg p-3">
              <p class="text-xs text-gray-500 mb-1">Motor</p>
              <p class="text-sm font-medium">${car.motor_liter}</p>
            </div>
            <div class="bg-gray-50 rounded-lg p-3">
              <p class="text-xs text-gray-500 mb-1">Tezlanish</p>
              <p class="text-sm font-medium">${car.acceleration}</p>
            </div>
            <div class="bg-gray-50 rounded-lg p-3">
              <p class="text-xs text-gray-500 mb-1">Maksimal tezlik</p>
              <p class="text-sm font-medium">${car.max_speed}</p>
            </div>
            <div class="bg-gray-50 rounded-lg p-3">
              <p class="text-xs text-gray-500 mb-1">Narxi</p>
              <p class="text-sm font-medium">${car.price} $</p>
            </div>
            <div class="bg-gray-50 rounded-lg p-3">
              <p class="text-xs text-gray-500 mb-1">Masofa</p>
              <p class="text-sm font-medium">${car.distance}</p>
            </div>
            <div class="bg-gray-50 rounded-lg p-3">
              <p class="text-xs text-gray-500 mb-1">Soni</p>
              <p class="text-sm font-medium">${car.count}</p>
            </div>
          </div>

          <div class="flex gap-3">
            <button class="w-10 h-10 border border-gray-200 rounded-button flex items-center justify-center hover:bg-gray-50 transition-colors">
              <i class="ri-heart-line text-gray-600"></i>
            </button>
          </div>
        </div>
      </div>
    `;

    carBody.insertAdjacentHTML('beforeend', carHTML);
  });
}


getAllcars();
