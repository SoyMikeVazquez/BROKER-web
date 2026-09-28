import { supabase } from './supabaseClient.js'

let activePropertyId = null;

let allProperties = [];

document.addEventListener('DOMContentLoaded', async () => {
    // Inicialización del Modal
    setupModalListeners();

    // Obtener todas las propiedades
    await fetchAllProperties();

    // Bind de Botones de Filtros
    document.getElementById('btn-apply-filters').addEventListener('click', applyFilters);
    document.getElementById('btn-reset-filters').addEventListener('click', resetFilters);
});

async function fetchAllProperties() {
    const container = document.getElementById('portfolio-grid');
    
    try {
        const { data, error } = await supabase.from('propiedades').select('*');
        if (error) throw error;

        allProperties = data;
        renderProperties(allProperties);
    } catch (error) {
        console.error('Error fetching from Supabase', error);
        container.innerHTML = '<div class="no-results" style="color:red;">Hubo un error al conectar con la base de datos de propiedades. Verifica tu conexión a internet o los permisos de Supabase.</div>';
    }
}

function renderProperties(list) {
    const container = document.getElementById('portfolio-grid');
    container.innerHTML = '';

    if (list.length === 0) {
        container.innerHTML = '<div class="no-results">No se encontraron propiedades que coincidan con los filtros aplicados. Intenta ampliar tus criterios de búsqueda.</div>';
        return;
    }

    list.forEach(p => {
        const formatter = new Intl.NumberFormat('es-MX', { style: 'currency', currency: p.moneda || 'MXN', maximumFractionDigits: 0 });
        
        const card = document.createElement('div');
        card.className = 'prop-card fade-up visible'; // visible directo para que aparezca
        card.innerHTML = `
            <div class="prop-img-wrapper"><img src="${p.imagen_url}" alt="${p.titulo}" loading="lazy"></div>
            <div class="prop-card-content">
                <div class="prop-price">${formatter.format(p.precio)}</div>
                <div class="prop-title" title="${p.titulo}">${p.titulo}</div>
                <div class="prop-location">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    ${p.ubicacion}
                </div>
                <div class="prop-features">
                    <span>${p.habitaciones} Habs</span>
                    <span>${p.banos} Baños</span>
                    <span>${p.metros_cuadrados} m²</span>
                </div>
            </div>
        `;
        
        // Modal Event
        card.addEventListener('click', () => openPropertyModal(p, formatter));
        container.appendChild(card);
    });
}

function applyFilters() {
    const search = document.getElementById('filter-search').value.toLowerCase();
    const minPrice = parseInt(document.getElementById('filter-min-price').value) || 0;
    const maxPrice = parseInt(document.getElementById('filter-max-price').value) || Infinity;
    const habsList = parseInt(document.getElementById('filter-habs').value) || 0;
    const banosList = parseInt(document.getElementById('filter-banos').value) || 0;

    const filtered = allProperties.filter(p => {
        const pTitle = (p.titulo || '').toLowerCase();
        const pUbi = (p.ubicacion || '').toLowerCase();
        
        const matchSearch = pTitle.includes(search) || pUbi.includes(search);
        const matchPrice = p.precio >= minPrice && p.precio <= maxPrice;
        const matchHabs = (p.habitaciones || 0) >= habsList;
        const matchBanos = (p.banos || 0) >= banosList;

        return matchSearch && matchPrice && matchHabs && matchBanos;
    });

    renderProperties(filtered);
}

function resetFilters() {
    document.getElementById('filter-search').value = '';
    document.getElementById('filter-min-price').value = '';
    document.getElementById('filter-max-price').value = '';
    document.getElementById('filter-habs').value = '0';
    document.getElementById('filter-banos').value = '0';
    renderProperties(allProperties);
}

// =======================
// Modal Helper Functions
// =======================
function setupModalListeners() {
  const modal = document.getElementById('property-modal');
  const closeBtn = document.getElementById('close-modal');

  if (!modal || !closeBtn) return;

  closeBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.add('hidden');
    }
  });

  // Manejo de Pestañas (Tabs)
  const tabContactBtn = document.getElementById('tab-contact-btn');
  const tabCreditBtn = document.getElementById('tab-credit-btn');
  const tabContactContent = document.getElementById('tab-contact-content');
  const tabCreditContent = document.getElementById('tab-credit-content');

  if (tabContactBtn && tabCreditBtn && tabContactContent && tabCreditContent) {
    tabContactBtn.addEventListener('click', () => {
      tabContactBtn.classList.add('active');
      tabCreditBtn.classList.remove('active');
      tabContactContent.classList.add('active');
      tabCreditContent.classList.remove('active');
    });

    tabCreditBtn.addEventListener('click', () => {
      tabCreditBtn.classList.add('active');
      tabContactBtn.classList.remove('active');
      tabCreditContent.classList.add('active');
      tabContactContent.classList.remove('active');
    });
  }

  // Envío del formulario de contacto
  const contactForm = document.getElementById('modal-contact-form');
  const submitBtn = document.getElementById('btn-submit-contact');
  const successMsg = document.getElementById('contact-success-msg');

  if (contactForm && submitBtn && successMsg) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const phone = document.getElementById('contact-phone').value.trim();
      const message = document.getElementById('contact-message').value.trim();

      if (!name || !email || !phone || !message) {
        alert('Por favor, completa todos los campos.');
        return;
      }

      // Activar estado de carga
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;

      try {
        const { data, error } = await supabase.from('contacts').insert([
          {
            name,
            email,
            phone,
            message,
            id_propiety: activePropertyId,
            project_id: activePropertyId,
            status: 'new'
          }
        ]);

        if (error) throw error;

        // Éxito: Ocultar formulario y mostrar mensaje de éxito
        contactForm.style.display = 'none';
        successMsg.style.display = 'flex';
      } catch (error) {
        console.error('Error enviando contacto:', error);
        alert('Hubo un error al enviar tu mensaje. Por favor, intenta de nuevo.');
      } finally {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
      }
    });
  }
}

function openPropertyModal(p, formatter) {
  activePropertyId = p.id;

  document.getElementById('modal-img').src = p.imagen_url;
  document.getElementById('modal-precio').innerText = formatter.format(p.precio);
  document.getElementById('modal-titulo').innerText = p.titulo;
  document.getElementById('modal-ubicacion').innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
    ${p.ubicacion}
  `;
  document.getElementById('modal-habs').innerText = `${p.habitaciones} Habs`;
  document.getElementById('modal-banos').innerText = `${p.banos} Baños`;
  document.getElementById('modal-m2').innerText = `${p.metros_cuadrados} m²`;
  
  // Update link to pass property ID
  document.getElementById('btn-solicitar-cred').href = './solicitudcredito.html?propiedad=' + encodeURIComponent(p.id);

  // Reset del formulario de contacto y pestañas
  const tabContactBtn = document.getElementById('tab-contact-btn');
  const tabCreditBtn = document.getElementById('tab-credit-btn');
  const tabContactContent = document.getElementById('tab-contact-content');
  const tabCreditContent = document.getElementById('tab-credit-content');

  if (tabContactBtn && tabCreditBtn && tabContactContent && tabCreditContent) {
    tabContactBtn.classList.add('active');
    tabCreditBtn.classList.remove('active');
    tabContactContent.classList.add('active');
    tabCreditContent.classList.remove('active');
  }

  const contactForm = document.getElementById('modal-contact-form');
  const successMsg = document.getElementById('contact-success-msg');
  if (contactForm && successMsg) {
    contactForm.reset();
    contactForm.style.display = 'block';
    successMsg.style.display = 'none';
  }

  const submitBtn = document.getElementById('btn-submit-contact');
  if (submitBtn) {
    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;
  }
  
  document.getElementById('property-modal').classList.remove('hidden');
}
