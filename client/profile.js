
// const logOutBtn = document.querySelector('.outBtn');
const token = window.localStorage.getItem("token");

if (!token) {
  window.location.href = '/login.html';
}

// logOutBtn.addEventListener("click", async (evt) => {
//   evt.preventDefault();

//   try {
//     const req = await fetch('http://127.0.0.1:4000/api/auth/logout', {
//       method: "POST",
//       credentials: "include", 
//     });

//     const res = await req.json();

//     console.log(res);

//     if (res.status === 200) {
//       localStorage.removeItem("token");

//       window.location.href = '/login.html';
//     }

//   } catch (error) {
//     console.error("Logout xatolik:", error);
//   }
// });
