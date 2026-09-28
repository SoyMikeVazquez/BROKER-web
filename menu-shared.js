// Common Mobile Menu functionality
function initializeMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mainNav = document.getElementById('main-nav');

    if (mobileMenuBtn && mainNav) {
        // Toggle mobile menu
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileMenuBtn.classList.toggle('active');
            mainNav.classList.toggle('active');
        });

        // Close menu when clicking a link
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                mainNav.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            const isClickInsideMenu = mainNav.contains(e.target);
            const isClickOnToggle = mobileMenuBtn.contains(e.target);
            
            if (!isClickInsideMenu && !isClickOnToggle && mainNav.classList.contains('active')) {
                mobileMenuBtn.classList.remove('active');
                mainNav.classList.remove('active');
            }
        });
        
        // Ensure menu is closed on resize (if moving back to desktop)
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && mainNav.classList.contains('active')) {
                mobileMenuBtn.classList.remove('active');
                mainNav.classList.remove('active');
            }
        });
    }
}

// Floating WhatsApp Button Functionality
function initializeWhatsAppButton() {
    if (document.getElementById('whatsapp-btn-float')) return;

    const whatsappBtn = document.createElement('a');
    whatsappBtn.id = 'whatsapp-btn-float';
    whatsappBtn.className = 'whatsapp-btn-float';
    whatsappBtn.href = 'https://wa.me/528118171792?text=Hola,%20me%20interesa%20recibir%20m%C3%A1s%20informaci%C3%B3n.';
    whatsappBtn.target = '_blank';
    whatsappBtn.rel = 'noopener noreferrer';
    whatsappBtn.setAttribute('aria-label', 'Contactar por WhatsApp');
    whatsappBtn.innerHTML = `
      <span class="whatsapp-btn-text" data-i18n="whatsapp_help">¿Necesitas ayuda?</span>
      <div class="whatsapp-icon-wrapper">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.197 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347z" fill="currentColor"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 2.159.684 4.159 1.854 5.795L2.5 21.5l3.829-1.326A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zM4 12a8 8 0 1113.856 5.485l.288.461-1.929.668.647-1.968-.302-.455A7.962 7.962 0 014 12z" fill="currentColor"/>
        </svg>
      </div>
    `;
    document.body.appendChild(whatsappBtn);
}

function initializeShared() {
    initializeMenu();
    initializeWhatsAppButton();
}

// Auto-initialize if DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeShared);
} else {
    initializeShared();
}

