// ==========================================
// SELECTORS
// ==========================================
const burger = document.getElementById('burger');
const nav = document.getElementById('navLinks');
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll("section");
const navbar = document.querySelector(".navbar");

// ==========================================
// 🍔 BURGER MENU (ANTI-BUG MOBILE)
// ==========================================
if (burger && nav) {
    burger.addEventListener('click', (e) => {
        e.stopPropagation();
        nav.classList.toggle('nav-active');
        burger.classList.toggle('toggle');
        // Bloquer le scroll du body quand le menu est ouvert
        document.body.style.overflow = nav.classList.contains('nav-active') ? 'hidden' : 'auto';
    });

    // Fermer le menu si on clique en dehors
    document.addEventListener('click', (e) => {
        if (nav.classList.contains('nav-active') && !nav.contains(e.target) && !burger.contains(e.target)) {
            nav.classList.remove('nav-active');
            burger.classList.remove('toggle');
            document.body.style.overflow = 'auto';
        }
    });
}

// ==========================================
// SMOOTH SCROLL & CLOSE MOBILE MENU
// ==========================================
navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
        const href = link.getAttribute("href");
        if (href.startsWith("#")) {
            e.preventDefault();

            // Fermer le menu burger
            if (nav && burger) {
                nav.classList.remove('nav-active');
                burger.classList.remove('toggle');
                document.body.style.overflow = 'auto';
            }

            const targetSection = document.getElementById(href.substring(1));
            if (targetSection) {
                const offset = 80; // Espace pour la navbar
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

// ==========================================
// ACTIVE LINK SUR LE SCROLL
// ==========================================
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

// ==========================================
// 💾 SQL EXPORT FUNCTION
// ==========================================
function downloadSqlFile(name, email, message) {
    const safeName = (name || '').replace(/'/g, "''");
    const safeEmail = (email || '').replace(/'/g, "''");
    const safeMessage = (message || '').replace(/'/g, "''");
    const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const sqlContent = `-- Message reçu via Portfolio de Fatima Ezzahrae\n` +
                       `INSERT INTO contact_messages (nom, email, message, date_envoi)\n` +
                       `VALUES ('${safeName}', '${safeEmail}', '${safeMessage}', '${currentDate}');\n`;

    const blob = new Blob([sqlContent], { type: 'application/sql;charset=utf-8;' });
    const downloadUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `contact_${Date.now()}.sql`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(downloadUrl);
}

// ==========================================
// EMAILJS + GESTION FORMULAIRE
// ==========================================
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const btn = contactForm.querySelector('.btn-submit');
        const originalText = btn ? btn.innerHTML : "Envoyer le Message";

        const name = document.getElementById('user_name').value.trim();
        const email = document.getElementById('user_mail').value.trim();
        const message = document.getElementById('user_message').value.trim();

        // 1. Télécharger le fichier SQL direct
        downloadSqlFile(name, email, message);

        if (btn) {
            btn.innerHTML = "<span>Téléchargé ! Envoi en cours... ⏳</span>";
            btn.disabled = true;
        }

        // 2. Envoi par EmailJS
        if (typeof emailjs !== 'undefined') {
            const serviceID = 'service_1rys38c';
            const templateID = 'template_osrgezd';

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
                        btn.innerHTML = "<span>Fichier SQL Téléchargé ! ✅</span>";
                        contactForm.reset();
                        setTimeout(() => {
                            btn.innerHTML = originalText;
                            btn.disabled = false;
                        }, 3500);
                    }
                });
        } else {
            if (btn) {
                btn.innerHTML = "<span>Fichier SQL Sauvegardé ! ✅</span>";
                contactForm.reset();
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                }, 3500);
            }
        }
    });
}