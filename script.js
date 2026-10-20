if (typeof emailjs !== 'undefined') {
    emailjs.init("HZPg5Ol4H8SNNN5SG");
}

const burger = document.getElementById('burger');
const nav = document.getElementById('navLinks');
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll("section");
const contactForm = document.getElementById('contact-form');

// Menu mobile
if (burger && nav) {
    burger.addEventListener('click', (e) => {
        e.stopPropagation();
        nav.classList.toggle('nav-active');
        burger.classList.toggle('toggle');
        document.body.style.overflow = nav.classList.contains('nav-active') ? 'hidden' : 'auto';
    });

    document.addEventListener('click', (e) => {
        if (nav.classList.contains('nav-active') && !nav.contains(e.target) && !burger.contains(e.target)) {
            nav.classList.remove('nav-active');
            burger.classList.remove('toggle');
            document.body.style.overflow = 'auto';
        }
    });
}

// Navigation fluide
navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
        const href = link.getAttribute("href");
        if (href && href.startsWith("#")) {
            e.preventDefault();

            if (nav && burger) {
                nav.classList.remove('nav-active');
                burger.classList.remove('toggle');
                document.body.style.overflow = 'auto';
            }

            const targetSection = document.getElementById(href.substring(1));
            if (targetSection) {
                const offset = 80;
                const bodyRect = document.body.getBoundingClientRect().top;
                const elementRect = targetSection.getBoundingClientRect().top;
                const elementPosition = elementRect - bodyRect;
                const offsetPosition = elementPosition - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        }
    });
});

// Gestion du scroll et liens actifs
window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - 120) {
            current = section.getAttribute("id");
        }
    });

    navLinks.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href") === "#" + current) {
            link.classList.add("active");
        }
    });
});

// Animation des projets
const projectElements = document.querySelectorAll(".project-section, .project-card");
if (projectElements.length > 0) {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
            }
        });
    }, { threshold: 0.15 });

    projectElements.forEach(item => observer.observe(item));
}

// Envoi du formulaire de contact
if (contactForm) {
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const btn = contactForm.querySelector('.btn-submit, .form-btn');
        const originalText = btn ? btn.innerHTML : "Envoyer le Message";

        if (btn) {
            btn.innerHTML = "<span>Envoi en cours... ⏳</span>";
            btn.disabled = true;
        }

        const serviceID = 'service_1rys38c';
        const templateID = 'template_osrgezd';

        if (typeof emailjs !== 'undefined') {
            emailjs.sendForm(serviceID, templateID, this)
                .then(() => {
                    if (btn) btn.innerHTML = "<span>Message Envoyé ! ✅</span>";
                    contactForm.reset();

                    setTimeout(() => {
                        if (btn) {
                            btn.innerHTML = originalText;
                            btn.disabled = false;
                        }
                    }, 3500);
                })
                .catch((err) => {
                    console.error("Erreur EmailJS:", err);
                    if (btn) {
                        btn.innerHTML = "<span>Erreur d'envoi ❌</span>";
                        btn.disabled = false;
                    }
                    setTimeout(() => {
                        if (btn) btn.innerHTML = originalText;
                    }, 3500);
                });
        } else {
            if (btn) {
                btn.innerHTML = "<span>Erreur de configuration ❌</span>";
                btn.disabled = false;
            }
        }
    });
}

// Widget WhatsApp
document.addEventListener('DOMContentLoaded', () => {
    const waToggleBtn = document.getElementById('waToggleBtn');
    const waChatBox = document.getElementById('waChatBox');
    const waCloseBtn = document.getElementById('waCloseBtn');
    const waOptBtns = document.querySelectorAll('.wa-opt-btn');

    const phone = "212649702607";

    if (waToggleBtn && waChatBox) {
        waToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            waChatBox.classList.toggle('active');
        });
    }

    if (waCloseBtn && waChatBox) {
        waCloseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            waChatBox.classList.remove('active');
        });
    }

    document.addEventListener('click', (e) => {
        if (waChatBox && waChatBox.classList.contains('active')) {
            if (!waChatBox.contains(e.target) && !waToggleBtn.contains(e.target)) {
                waChatBox.classList.remove('active');
            }
        }
    });

    waOptBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            const message = this.getAttribute('data-msg') || "Bonjour Fatima, je vous contacte depuis votre portfolio.";
            const encodedText = encodeURIComponent(message);
            const whatsappURL = `https://api.whatsapp.com/send?phone=${phone}&text=${encodedText}`;

            waChatBox.classList.remove('active');
            window.location.href = whatsappURL;
        });
    });
});