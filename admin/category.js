const token =  window.localStorage.getItem("token") ;
const categoryB = document.querySelector('.categoryB')

if(!token){
  window.location.href = '/login.html'
};



async function getAllcategory() {
  try {
    const req = await fetch('http://127.0.0.1:4000/api/category/get/all') ;

    if(req.ok){
      const res = await req.json() ;
      handleRenderCategory(res)
    }
  } catch (error) {
    console.log(error)
  }
};



function handleRenderCategory(data){
  categoryB.innerHTML = ''; 

  const gridWrapper = document.createElement('div');
  gridWrapper.className = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6";

  data.forEach((cat, index) => {
    const catDiv = document.createElement('div');
    catDiv.className = "w-65 m-4 flex flex-col items-center bg-gray-100 rounded-xl overflow-hidden shadow-sm cursor-pointer min-h-80 ";

    catDiv.innerHTML = `
      <div class=" h-56 w-56 overflow-hidden rounded-t-xl relative group">
        <img
          src="${cat.logo || `https://picsum.photos/400/300?random=${index+1}`}"
          alt="${cat.name}"
          class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div class="absolute inset-0 bg-gray-700 bg-opacity-20"></div>
      </div>
      <p class="font-bold text-lg mb-1">${cat.name}</p>
      
    `;

    gridWrapper.appendChild(catDiv);
  });

  categoryB.appendChild(gridWrapper);
}

getAllcategory()