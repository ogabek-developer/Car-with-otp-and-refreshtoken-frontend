
const jsRegisterForm = document.querySelector('.jsRegisterForm');
const first_name = document.querySelector('.first_name');
const last_name = document.querySelector('.last_name');
const email = document.querySelector('.email');
const phone = document.querySelector('.phone');
const password = document.querySelector('.password');

// const Token = window.localStorage.getItem('token') ;


// if(Token){
//   window.location.href = '/'
// };

jsRegisterForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  handleRegister(
    first_name.value, 
    last_name.value, 
    email.value, 
    phone.value, 
    password.value
  );
});



async function handleRegister(first_name, last_name, email, phone, password) {
  try {
    window.localStorage.setItem('email', email) ;
    const req = await fetch('http://127.0.0.1:4000/api/auth/register', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        first_name,
        last_name,
        email,
        phone,
        password
      })

    });

    const res = await req.json();
    console.log(res)
    if (req.ok) {
      alert('Tizimga kirishdan oldin emailga kelgan sms codeni tasdiqlang !!');
      window.location.href = '/verify.html'
    } else {
      throw("error_message :  ERROR PROTOCOL LOSE INVALID AREA BASE DNS DANGER !")
    }
  } catch (error) {
    throw("error_message :  ERROR PROTOCOL LOSE INVALID AREA BASE DNS DANGER !")
  }
}

// Toggle password visibility
function togglePasswordVisibility(id) {
  const input = document.getElementById(id);
  const icon = input.nextElementSibling; // Eye icon
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
