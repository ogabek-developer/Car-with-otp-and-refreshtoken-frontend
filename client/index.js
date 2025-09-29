
const categoryBody = document.querySelector('.modelBody'); 
const token = window.localStorage.getItem("token");

if(!token){
  window.location.href = '/login.html';
}

async function getCategory(){
  try {
    const req = await fetch('http://127.0.0.1:4000/api/category/get/all', {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const res = await req.json();
    if(req.ok){
      handleRenderCategory(res);
    } else {
      console.error("Xato ma’lumot kelmoqda:", res);
    }

    console.log(res);
  } catch (error) {
    console.error(error);
  }
};

function handleRenderCategory(data){
  categoryBody.innerHTML = ''; 

  const gridWrapper = document.createElement('div');
  gridWrapper.className = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6";

  data.forEach((cat, index) => {
    const catDiv = document.createElement('div');
    catDiv.className = "flex flex-col items-center bg-gray-100 rounded-xl overflow-hidden shadow-sm cursor-pointer min-h-80";

    catDiv.innerHTML = `
      <div class="w-full h-56 mb-4 overflow-hidden rounded-t-xl relative group">
        <img
          src="${cat.logo || `https://picsum.photos/400/300?random=${index+1}`}"
          alt="${cat.name}"
          class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div class="absolute inset-0 bg-gray-700 bg-opacity-20"></div>
      </div>
      <p class="font-bold text-lg mb-1">${cat.name}</p>
      <p class="text-gray-500 text-sm text-center">${cat.count || 0}+ model mavjud</p>
    `;

    gridWrapper.appendChild(catDiv);
  });

  categoryBody.appendChild(gridWrapper);
}

getCategory();
