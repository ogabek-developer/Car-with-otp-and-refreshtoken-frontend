
const verifyForm = document.querySelector('.verifyForm');
const digit_1 = document.querySelector('#digit_1');
const digit_2 = document.querySelector('#digit_2');
const digit_3 = document.querySelector('#digit_3');
const digit_4 = document.querySelector('#digit_4');
const digit_5 = document.querySelector('#digit_5');
const digit_6 = document.querySelector('#digit_6');
const resendP = document.querySelector('.resendP');

const Token = window.localStorage.getItem('token') ;


// if(Token){
//   window.location.href = '/'
// }

// Kirganda avtomatik keyingi inputga o'tkazish
function moveToNext(current, index) {
  const inputs = document.querySelectorAll('.digit-input');
  if (current.value && index < inputs.length) {
    inputs[index].focus(); // keyingi inputga o'tkazish
  }
}

verifyForm.addEventListener('submit', (evt) => {
  evt.preventDefault();

  const digits = [digit_1, digit_2, digit_3, digit_4, digit_5, digit_6];
  const emptyInput = digits.find(input => input.value.trim() === "");
  if (emptyInput) {
    alert("❌ Iltimos, barcha raqamlarni kiriting!");
    emptyInput.focus();
    return;
  }

  for (let d of digits) {
    if (!/^\d$/.test(d.value)) {
      alert("❌ Har bir input faqat bitta raqam bo‘lishi kerak!");
      d.focus();
      return;
    }
  }

  const code = digits.map(d => d.value).join("");
  handleVerify(code);
});

async function handleVerify(code) {
  try {
    const req = await fetch('http://127.0.0.1:4000/api/auth/verify', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: window.localStorage.getItem('email'),
        otp: code
      })
    });

    const res = await req.json();

    if (req.ok) {
      console.log("✅ Tasdiqlandi:", res);
      alert("✅ Kod tasdiqlandi!");
      window.location.href = '/login.html'
    } else {
      console.error("❌ Xatolik:", res);
      alert("❌ " + (res.message || "Kod noto‘g‘ri"));
    }
  } catch (error) {
    console.error("❌ Server bilan ulanishda muammo:", error);
    alert("❌ Server bilan ulanishda muammo!");
  }
}

resendP.addEventListener('click', (evt) => {
  evt.preventDefault();
  handleResend();
});

async function handleResend() {
  try {
    const req = await fetch('http://127.0.0.1:4000/api/auth/resend/otp', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: window.localStorage.getItem('email')
      })
    });

    const res = await req.json();

    if (req.ok) {
      console.log("✅ Yangi OTP yuborildi:", res);
      alert("✅ Yangi kod emailingizga yuborildi!");
      startResendTimer();
    } else {
      console.error("❌ Resend xato:", res);
      alert("❌ " + (res.message || "OTP yuborilmadi"));
    }
  } catch (error) {
    console.error("❌ Server bilan ulanishda muammo:", error);
    alert("❌ Server bilan ulanishda muammo!");
  }
}

function startResendTimer() {
  let timeLeft = 60;
  resendP.style.pointerEvents = "none"; 
  resendP.style.color = "gray";

  const timer = setInterval(() => {
    resendP.textContent = `Resend (${timeLeft}s)`;
    timeLeft--;

    if (timeLeft < 0) {
      clearInterval(timer);
      resendP.textContent = "Resend";
      resendP.style.pointerEvents = "auto"; 
      resendP.style.color = "blue";
    }
  }, 1000);
}
