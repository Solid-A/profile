let slideIndex = 0;
showSlides(slideIndex);

// الدالة لعرض السلايد الحالي
function showSlides(n) {
    let slides = document.getElementsByClassName("slide");
    if (n >= slides.length) {
        slideIndex = 0;
    } else if (n < 0) {
        slideIndex = slides.length - 1;
    }
    // إخفاء جميع السلايدات
    for (let i = 0; i < slides.length; i++) {
        slides[i].classList.remove("active");
    }
    // عرض السلايد الحالي
    slides[slideIndex].classList.add("active");
}

// الانتقال للسلايد التالي
function nextSlide() {
    showSlides(++slideIndex);
}

// الانتقال للسلايد السابق
function prevSlide() {
    showSlides(--slideIndex);
}

// الانتقال التلقائي بعد 30 ثانية
// setInterval(() => {
//     nextSlide();
// }, 30000);

// Smooth scroll to sections when clicked
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

function showPhoneNumber() {
    alert("Phone Number: 01000746027");
}


let menu = document.getElementById('nav');
    let offset = menu.offsetHeight;
    window.onscroll = function() {
        if (window.scrollY > 380) {
            menu.style.position = "fixed";   
            menu.style.top = "0";
        } else {
            menu.style.position = "relative";
        }
    }