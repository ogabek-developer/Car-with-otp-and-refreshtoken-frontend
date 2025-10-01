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
    catDiv.className = "";

    catDiv.innerHTML = `
      <div style="width : 200px ; border-radius : 7px;">
        <img
          src="${cat.logo || `https://picsum.photos/400/300?random=${index+1}`}"
          alt="${cat.name}"
          class=""
        />
        <div class=""></div>
      </div>
      <p class="font-bold text-lg mb-1">${cat.name}</p>
      
    `;

    gridWrapper.appendChild(catDiv);
  });

  categoryB.appendChild(gridWrapper);
}

getAllcategory()