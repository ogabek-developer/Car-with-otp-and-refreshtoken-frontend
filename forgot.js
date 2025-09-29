
const forgotForm = document.querySelector('.forgotForm');
const forgotEmail = document.querySelector('.forgotEmail');
const forgotPassword = document.querySelector('.forgotPassword');

forgotForm.addEventListener("submit", (evt) => {
    evt.preventDefault();

    handleForgot(forgotEmail.value, forgotPassword.value);
});

async function handleForgot(email, password) {
    try {
        const req = await fetch('http://127.0.0.1:4000/api/auth/change/password', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, new_password : password })
        });
        if (req.ok) {

            const data = await req.json();
            console.log("Parol yangilandi ✅:", data);
            alert("Parol muvaffaqiyatli o‘zgartirildi!");
            window.location.href = '/login.html'
        }else{
            alert("parol yaratishda hatolik boshqa parol yoki email kiriting")
        };
    } catch (error) {
        console.error("Xatolik:", error);
        alert("Xatolik yuz berdi, qayta urinib ko‘ring.");
    };
}
