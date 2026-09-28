import { supabase } from './supabaseClient.js'

document.addEventListener('DOMContentLoaded', () => {
    // Populate property id from URL
    const urlParams = new URLSearchParams(window.location.search);
    const propId = urlParams.get('propiedad');
    if (propId) {
        document.getElementById('f-propiedad-id').value = propId;
    }

    // Display selected file names
    document.getElementById('f-ine-frente').addEventListener('change', (e) => {
        handleFileSelect(e, 'name-ine-frente');
    });
    
    document.getElementById('f-ine-atras').addEventListener('change', (e) => {
        handleFileSelect(e, 'name-ine-atras');
    });

    // Handle Form Submit
    const form = document.getElementById('solicitud-form');
    form.addEventListener('submit', handleCreditSubmit);
});

function handleFileSelect(e, labelId) {
    const file = e.target.files[0];
    const label = document.getElementById(labelId);
    
    if (file) {
        // Validation for 600MB
        if (file.size > 600 * 1024 * 1024) {
            alert('El archivo es demasiado grande. El máximo permitido es 600MB.');
            e.target.value = ''; // clear
            label.innerText = '';
            document.getElementById('form-error').style.display = 'block';
            document.getElementById('form-error').innerText = 'Archivo excede el límite de 600MB.';
            return;
        }
        document.getElementById('form-error').style.display = 'none';
        label.innerText = 'Archivo seleccionado: ' + file.name;
    } else {
        label.innerText = '';
    }
}

async function uploadImage(file, folderName) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `${folderName}/${fileName}`;

    const { data, error } = await supabase.storage
        .from('general')
        .upload(filePath, file);

    if (error) {
        console.error('Error uploading image: ', error);
        throw error;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
        .from('general')
        .getPublicUrl(filePath);

    return publicUrl;
}

async function handleCreditSubmit(e) {
    e.preventDefault();
    
    const errorDiv = document.getElementById('form-error');
    errorDiv.style.display = 'none';

    try {
        // Show loading overlay
        const overlay = document.getElementById('loading-overlay');
        overlay.classList.add('active');

        // Extract files
        const fileFrente = document.getElementById('f-ine-frente').files[0];
        const fileAtras = document.getElementById('f-ine-atras').files[0];

        if (!fileFrente || !fileAtras) {
            throw new Error('Por favor selecciona ambas imágenes de tu INE.');
        }

        // Upload files securely to bucket 'general'
        const urlFrente = await uploadImage(fileFrente, 'ine_archivos/frente');
        const urlAtras = await uploadImage(fileAtras, 'ine_archivos/reverso');

        // Gather text data
        const payload = {
            nombre_completo: document.getElementById('f-nombre').value,
            correo_electronico: document.getElementById('f-correo').value,
            telefono: document.getElementById('f-telefono').value,
            curp: document.getElementById('f-curp').value.toUpperCase(),
            direccion_completa: document.getElementById('f-direccion').value,
            ine_frente_url: urlFrente,
            ine_reverso_url: urlAtras,
            propiedad_id: document.getElementById('f-propiedad-id').value || null
        };

        // Insert into table solicitudes_credito
        const { data, error } = await supabase
            .from('solicitudes_credito')
            .insert([payload]);

        if (error) throw error;

        // Notify admin via Email (Edge Function)
        try {
            await supabase.functions.invoke('notify-admin', {
                body: { payload }
            });
        } catch (sendError) {
            console.error('Error sending notification email:', sendError);
            // We don't throw here to not block the user if only the notification fails
        }

        // Success
        overlay.classList.remove('active');
        alert('¡Tu solicitud ha sido enviada con éxito! Nos pondremos en contacto contigo a la brevedad para los siguientes pasos.');
        window.location.href = './index.html'; // Redirect to home

    } catch (err) {
        const overlay = document.getElementById('loading-overlay');
        overlay.classList.remove('active');
        
        console.error('Error en solicitud:', err);
        errorDiv.innerText = err.message || 'Error al procesar la solicitud. Intenta de nuevo por favor.';
        errorDiv.style.display = 'block';
    }
}
