const translations = {
    es: {
        nav_inicio: "Inicio",
        nav_proyectos: "Últimos proyectos",
        nav_franquicia: "Consigue una franquicia",
        nav_portafolio: "Portafolio",
        nav_credito: "Obtén un crédito",
        nav_entrar: "Ingresar",
        hero_badge: "Oportunidades exclusivas de inversión",
        hero_title: "Encuentra tu próximo<br><strong>proyecto inmobiliario</strong><br><span class='hero-highlight'>ideal aquí</span>",
        hero_subtitle: "Invierte en los mejores desarrollos, casas, departamentos, franquicias y edificios corporativos con la mayor plusvalía comprobada.",
        btn_explore: "Explorar portafolio &rarr;",
        btn_request_credit: "Solicitar crédito",
        stats_developments: "DESARROLLOS",
        stats_projects: "PROYECTOS",
        stats_satisfaction: "SATISFACCIÓN",
        section_exclusive: "EXCLUSIVO",
        section_properties_title: "Propiedades Destacadas",
        section_properties_subtitle: "Encuentra la casa o el departamento de tus sueños dentro de nuestro portafolio premium verificado.",
        section_view_all: "Ver portafolio completo &rarr;",
        footer_copyright: "© 2026 broker.com.mx",
        footer_privacy: "Privacidad",
        footer_terms: "Términos",
        footer_terms_conditions: "Términos y condiciones",
        choose_file: "Elegir archivo",
        any_option: "Cualquiera",
        // Solicitud Credit page
        credit_badge: "SOLICITUD",
        credit_title: "Crédito Hipotecario",
        credit_subtitle: "Por favor completa la información para pre-calificarte al instante. Tus datos están cifrados y seguros con nosotros.",
        label_name: "Nombre Completo",
        label_email: "Correo Electrónico",
        label_phone: "Teléfono",
        label_curp: "CURP",
        label_address: "Dirección completa",
        label_docs: "Documentación Oficial",
        label_docs_desc: "Sube una foto clara de tu identificación oficial (INE). Formatos aceptados: JPG, PNG. El tamaño máximo por foto es de 600MB.",
        label_ine_front: "Fotografía INE (Frente)",
        label_ine_back: "Fotografía INE (Reverso)",
        btn_send_request: "Enviar Solicitud de Evaluación",
        // Portfolio page
        portfolio_title: "Portafolio Inmobiliario",
        portfolio_subtitle: "Explora nuestra selección curada de propiedades exclusivas, desarrollos y franquicias de alto rendimiento.",
        filter_title: "Filtros de Búsqueda",
        filter_keyword: "Palabra clave",
        filter_budget: "Presupuesto (MXN)",
        filter_rooms: "Habitaciones (Mínimo)",
        filter_bathrooms: "Baños (Mínimo)",
        btn_apply_filters: "Aplicar Filtros",
        btn_reset_filters: "Limpiar Filtros",
        loading_portfolio: "Cargando portafolio desde la base de datos segura...",
        no_results: "No se encontraron propiedades que coincidan con los filtros aplicados. Intenta ampliar tus criterios de búsqueda.",
        whatsapp_help: "¿Necesitas ayuda?"
    },
    en: {
        nav_inicio: "Home",
        nav_proyectos: "Latest projects",
        nav_franquicia: "Get a franchise",
        nav_portafolio: "Portfolio",
        nav_credito: "Get credit",
        nav_entrar: "Log In",
        hero_badge: "Exclusive investment opportunities",
        hero_title: "Find your next<br><strong>real estate project</strong><br><span class='hero-highlight'>right here</span>",
        hero_subtitle: "Invest in the best developments, houses, apartments, franchises and corporate buildings with the highest proven surplus value.",
        btn_explore: "Explore portfolio &rarr;",
        btn_request_credit: "Apply for credit",
        stats_developments: "DEVELOPMENTS",
        stats_projects: "PROJECTS",
        stats_satisfaction: "SATISFACTION",
        section_exclusive: "EXCLUSIVE",
        section_properties_title: "Featured Properties",
        section_properties_subtitle: "Find the house or apartment of your dreams within our verified premium portfolio.",
        section_view_all: "View full portfolio &rarr;",
        footer_copyright: "© 2026 broker.com.mx",
        footer_privacy: "Privacy",
        footer_terms: "Terms",
        footer_terms_conditions: "Terms & Conditions",
        choose_file: "Choose file",
        any_option: "Any",
        // Solicitud Credit page
        credit_badge: "APPLICATION",
        credit_title: "Mortgage Credit",
        credit_subtitle: "Please complete the information to pre-qualify instantly. Your data is encrypted and secure with us.",
        label_name: "Full Name",
        label_email: "Email Address",
        label_phone: "Phone",
        label_curp: "CURP",
        label_address: "Full Address",
        label_docs: "Official Documentation",
        label_docs_desc: "Upload a clear photo of your official ID. Accepted formats: JPG, PNG. Maximum size per photo is 600MB.",
        label_ine_front: "ID Photo (Front)",
        label_ine_back: "ID Photo (Back)",
        btn_send_request: "Send Evaluation Request",
        // Portfolio page
        portfolio_title: "Real Estate Portfolio",
        portfolio_subtitle: "Explore our curated selection of exclusive properties, developments and high-performance franchises.",
        filter_title: "Search Filters",
        filter_keyword: "Keyword",
        filter_budget: "Budget (MXN)",
        filter_rooms: "Bedrooms (Minimum)",
        filter_bathrooms: "Bathrooms (Minimum)",
        btn_apply_filters: "Apply Filters",
        btn_reset_filters: "Clear Filters",
        loading_portfolio: "Loading portfolio from safe database...",
        no_results: "No properties found matching the applied filters. Try broadening your search criteria.",
        whatsapp_help: "Need help?"
    }
};

function setLanguage(lang) {
    localStorage.setItem('preferred_lang', lang);
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            if (el.tagName === 'INPUT' && el.getAttribute('placeholder')) {
                el.setAttribute('placeholder', translations[lang][key]);
            } else {
                el.innerHTML = translations[lang][key];
            }
        }
    });
    
    // Update active lang in UI
    document.querySelectorAll('.lang-option').forEach(opt => {
        opt.classList.toggle('active', opt.getAttribute('data-lang') === lang);
    });

    // Update lang selector display
    const currentLangDisplay = document.getElementById('current-lang-name');
    if (currentLangDisplay) {
        const names = { es: 'México', en: 'English' };
        currentLangDisplay.innerText = names[lang];
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('preferred_lang') || 'es';
    setLanguage(savedLang);

    // Lang selector listeners
    document.querySelectorAll('.lang-option').forEach(opt => {
        opt.addEventListener('click', (e) => {
            e.preventDefault();
            const lang = opt.getAttribute('data-lang');
            setLanguage(lang);
            // Close dropdown if it's open (e.g. on mobile)
            const dropdown = document.getElementById('lang-dropdown');
            if (dropdown) dropdown.classList.remove('active');
        });
    });

    // Toggle dropdown
    const langBtn = document.getElementById('lang-selector-btn');
    const dropdown = document.getElementById('lang-dropdown');
    if (langBtn && dropdown) {
        langBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropdown.classList.toggle('active');
        });
        
        document.addEventListener('click', () => {
            dropdown.classList.remove('active');
        });
    }
});

export { setLanguage, translations };
