// Experience Slider Functionality
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.remove('active');
        if (i === index) {
            slide.classList.add('active');
        }
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
}

// Initialize the first slide
showSlide(currentSlide);

// Phone Number Reveal Functionality
function showPhoneNumber() {
    const phoneNumber = "+20 1000746027"; // Replace with your actual phone number
    alert(`Phone Number: ${phoneNumber}`);
}

// Smooth Scrolling for Navigation Links
document.querySelectorAll('#nav-container a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        targetSection.scrollIntoView({ behavior: 'smooth' });
    });
});

// Add Intersection Observer for Section Animations
const sections = document.querySelectorAll('section');

const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.2
};

const sectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

sections.forEach(section => {
    sectionObserver.observe(section);
});

// Add a simple fade-in animation for sections
document.addEventListener('DOMContentLoaded', () => {
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transition = 'opacity 1s ease';
    });

    setTimeout(() => {
        sections.forEach(section => {
            section.style.opacity = '1';
        });
    }, 100);
});