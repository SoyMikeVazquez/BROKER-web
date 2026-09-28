import { supabase } from './supabaseClient.js'

let activePropertyId = null;

// Setup Intersection Observer for fade animations on scroll
document.addEventListener('DOMContentLoaded', () => {
  const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      // If element is in view
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Optional: stop observing once it's visible
      }
    });
  }, options);

  // Target all elements with animation classes
  const animatedElements = document.querySelectorAll('.slide-in, .fade-up, .fade-right, .fade-left, .fade-in');
  
  animatedElements.forEach(el => {
    observer.observe(el);
  });

  // Fetch properties from Supabase
  fetchPropiedades();
  setupModalListeners();
});

function setupModalListeners() {
  const modal = document.getElementById('property-modal');
  const closeBtn = document.getElementById('close-modal');

  if (!modal || !closeBtn) return;

  // Cerrar modal al clickear la 'X'
  closeBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
  });

  // Cerrar modal al clickear fuera del contenedor blanco
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
  
  // Pasar información al enlace de la nueva página
  document.getElementById('btn-solicitar-cred').href = `./solicitudcredito.html?propiedad=${encodeURIComponent(p.id)}`;
  
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

  // Mostrar modal
  document.getElementById('property-modal').classList.remove('hidden');
}

async function fetchPropiedades() {
  const container = document.getElementById('supabase-properties');
  if (!container) return;

  try {
    const { data, error } = await supabase.from('propiedades').select('*').limit(5);

    if (error) throw error;

    container.innerHTML = ''; // Limpiar mensaje de carga

    data.forEach(p => {
      const card = document.createElement('div');
      card.className = 'prop-card-large';
      
      const formatter = new Intl.NumberFormat('es-MX', { 
        style: 'currency', 
        currency: p.moneda || 'MXN', 
        maximumFractionDigits: 0 
      });
      
      card.innerHTML = `
        <div class="pcl-image"><img src="${p.imagen_url}" alt="${p.titulo}" loading="lazy"></div>
        <div class="pcl-content">
          <div class="pcl-price">${formatter.format(p.precio)}</div>
          <div class="pcl-title" title="${p.titulo}">${p.titulo}</div>
          <div class="pcl-location">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            ${p.ubicacion}
          </div>
          <div class="pcl-features">
            <span>${p.habitaciones} Habs</span>
            <span>${p.banos} Baños</span>
            <span>${p.metros_cuadrados} m²</span>
          </div>
        </div>
      `;
      
      // Añadir evento click a la tarjeta para abrir el modal
      card.addEventListener('click', () => openPropertyModal(p, formatter));
      
      container.appendChild(card);
    });
  } catch (error) {
    console.error('Error fetching Supabase properties:', error);
    container.innerHTML = `<p style="color:red; padding:24px;">Hubo un error al conectar con Supabase y cargar las propiedades.</p>`;
  }
}
