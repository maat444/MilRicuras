/**
 * FUNCIONALIDAD PRINCIPAL DEL SITIO WEB
 * Script para el carrusel de imágenes y otras interacciones
 */

document.addEventListener('DOMContentLoaded', function () {
    // ===== MENÚ HAMBURGUESA =====
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function () {
            mainNav.classList.toggle('show');
            const icon = menuToggle.querySelector('i');
            if (icon) {
                if (mainNav.classList.contains('show')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });

        const navLinks = mainNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.getComputedStyle(menuToggle).display !== 'none') {
                    mainNav.classList.remove('show');
                    const icon = menuToggle.querySelector('i');
                    if (icon) {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                }
            });
        });
    }
    // ===== CARRUSEL DE IMÁGENES =====
    const carousel = document.getElementById('imageCarousel');
    const slides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const indicators = document.querySelectorAll('.indicator');

    let currentSlide = 0;
    const totalSlides = slides.length;

    // Función para actualizar el carrusel
    function updateCarousel() {
        // Mover el carrusel
        carousel.style.transform = `translateX(-${currentSlide * 100}%)`;

        // Actualizar indicadores
        indicators.forEach((indicator, index) => {
            if (index === currentSlide) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }

    // Función para ir al slide anterior
    function prevSlide() {
        currentSlide = (currentSlide === 0) ? totalSlides - 1 : currentSlide - 1;
        updateCarousel();
    }

    // Función para ir al siguiente slide
    function nextSlide() {
        currentSlide = (currentSlide === totalSlides - 1) ? 0 : currentSlide + 1;
        updateCarousel();
    }

    // Event listeners para los botones de navegación
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);

    // Event listeners para los indicadores
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentSlide = index;
            updateCarousel();
        });
    });

    // Cambio automático de slides (cada 5 segundos)
    let slideInterval = setInterval(nextSlide, 5000);

    // Pausar el carrusel al pasar el mouse
    carousel.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });

    // Reanudar el carrusel al quitar el mouse
    carousel.addEventListener('mouseleave', () => {
        slideInterval = setInterval(nextSlide, 5000);
    });

    // ===== MENÚ DE NAVEGACIÓN SUAVE =====
    const navLinks = document.querySelectorAll('.main-nav a');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            // Solo aplicar para enlaces que apuntan a secciones de la página
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();

                // Actualizar clase activa
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');

                // Desplazamiento suave
                const targetId = this.getAttribute('href');
                if (targetId !== '#') {
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        window.scrollTo({
                            top: targetElement.offsetTop - 80,
                            behavior: 'smooth'
                        });
                    }
                }
            }
        });
    });

    // ===== DETECCIÓN DE SCROLL PARA MENÚ FIJO =====
    window.addEventListener('scroll', function () {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        } else {
            header.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        }
    });

    // ===== SISTEMA DE DETECCIÓN DE REGRESO DE WHATSAPP =====
    // Cuando el usuario regresa del WhatsApp, limpiar el estado
    window.addEventListener('focus', function () {
        // Limpiar acción anterior cuando la ventana recupera el foco
        lastWhatsAppAction = null;
    });

    // ===== ANIMACIONES AL HACER SCROLL =====
    // Simple detección de elementos en pantalla
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observar elementos para animaciones
    document.querySelectorAll('.feature, .contact-item').forEach(element => {
        observer.observe(element);
    });

    // ===== SISTEMA DE AUDIO SIMPLIFICADO =====

    const welcomeAudio = document.getElementById('welcomeAudio');
    const playAudioBtn = document.getElementById('playAudioBtn');
    const skipAudioBtn = document.getElementById('skipAudioBtn');
    const welcomeModal = document.getElementById('welcomeModal');

    // Mostrar modal de bienvenida
    function showWelcomeModal() {
        setTimeout(() => {
            welcomeModal.style.display = 'flex';
            welcomeModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            console.log('🎵 Modal de bienvenida mostrado');
        }, 500);
    }

    // Ocultar modal
    function hideWelcomeModal() {
        welcomeModal.style.display = 'none';
        welcomeModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    // Botón reproducir
    if (playAudioBtn) {
        playAudioBtn.addEventListener('click', function () {
            welcomeAudio.play().then(() => {
                hideWelcomeModal();
                console.log('▶️ Audio reproducido');
            }).catch(e => {
                console.error('❌ Error:', e);
            });
        });
    }

    // Botón cerrar
    if (skipAudioBtn) {
        skipAudioBtn.addEventListener('click', function () {
            hideWelcomeModal();
            console.log('✕ Modal cerrado');
        });
    }

    // Mostrar modal al cargar
    showWelcomeModal();

    // ===== SISTEMA DE REINICIO DE FLUJO WHATSAPP =====
    // Limpiar estado cuando el usuario hace click en botones/tarjetas
    document.addEventListener('click', function (e) {
        // Si es un botón de WhatsApp o tarjeta de producto
        if (e.target.closest('[onclick*="WhatsApp"]') ||
            e.target.closest('[onclick*="shareProduct"]') ||
            e.target.closest('.product-card') ||
            e.target.closest('.btn-whatsapp') ||
            e.target.closest('.btn-whatsapp-large')) {

            // Limpiar estado anterior
            lastWhatsAppAction = null;

            // Log para debugging
            console.log('🔄 Flujo WhatsApp reiniciado - Mensaje limpio listo');
            console.log('💬 Función shareProduct disponible:', typeof shareProduct);
            console.log('📱 Función openWhatsApp disponible:', typeof openWhatsApp);
        }
    });

    // Limpiar estado cuando se regresa del WhatsApp
    window.addEventListener('focus', function () {
        lastWhatsAppAction = null;
        console.log('🌐 Regresó del WhatsApp - Estado limpio');
    });
});

// ===== SISTEMA DE UBICACIÓN (MODO TEXTO) =====

// Abrir modal de ubicación
function openLocationModal() {
    const locationModal = document.getElementById('locationModal');
    locationModal.style.display = 'flex';
    locationModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Cerrar modal de ubicación
function closeLocationModal() {
    const locationModal = document.getElementById('locationModal');
    locationModal.style.display = 'none';
    locationModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Cerrar modal al hacer clic fuera de él
document.addEventListener('click', function (event) {
    const locationModal = document.getElementById('locationModal');
    if (event.target === locationModal) {
        closeLocationModal();
    }
});

console.log('✅ Sistema de ubicación cargado (Modo Texto)');

// ============================================================================
// SISTEMA DE PRODUCTOS
// ============================================================================

/**
 * Abre el modal de productos para una categoría específica
 * @param {string} category - La categoría de productos a mostrar (tortas, postres, bebidas)
 */
function openProductsModal(category) {
    const productsModal = document.getElementById('productsModal');
    const productsContainer = document.getElementById('productsContainer');
    const categoryTitle = document.getElementById('productsCategoryTitle');

    if (!productsModal) {
        console.error('Modal de productos no encontrado');
        return;
    }

    // Mostrar modal
    productsModal.style.display = 'block';

    // Mostrar estado de carga
    categoryTitle.textContent = 'Cargando...';
    productsContainer.innerHTML = '<div class="products-loading"><i class="fas fa-spinner"></i> Cargando productos...</div>';

    // Cargar productos del servidor
    fetchProducts(category)
        .then(data => {
            if (data.success) {
                categoryTitle.textContent = data.title;
                displayProducts(data.products);
            } else {
                categoryTitle.textContent = 'Error al cargar';
                productsContainer.innerHTML = '<div class="products-error"><i class="fas fa-exclamation-circle"></i> ' + data.message + '</div>';
            }
        })
        .catch(error => {
            console.error('Error al cargar productos:', error);
            categoryTitle.textContent = 'Error';
            productsContainer.innerHTML = '<div class="products-error"><i class="fas fa-exclamation-circle"></i> Error al cargar los productos. Intenta de nuevo.</div>';
        });
}

/**
 * Cierra el modal de productos
 */
function closeProductsModal() {
    const productsModal = document.getElementById('productsModal');
    if (productsModal) {
        productsModal.style.display = 'none';
    }
}

/**
 * Obtiene los productos de una categoría desde el servidor
 * @param {string} category - La categoría de productos
 * @returns {Promise} - Promise con los datos de los productos
 */
function fetchProducts(category) {
    return fetch(`/api/products/${category}.json`)
        .then(response => response.json())
        .then(data => {
            if (!data.success) {
                throw new Error(data.message || 'Error desconocido');
            }
            return data;
        });
}

/**
 * Muestra los productos en el modal
 * @param {Array} products - Array de objetos de productos
 */
function displayProducts(products) {
    const productsContainer = document.getElementById('productsContainer');

    if (!products || products.length === 0) {
        productsContainer.innerHTML = '<div class="products-error">No hay productos disponibles en esta categoría.</div>';
        return;
    }

    // Crear tarjetas de productos
    productsContainer.innerHTML = products.map(product => createProductCard(product)).join('');
}

/**
 * Crea el HTML de una tarjeta de producto
 * @param {Object} product - Objeto con datos del producto
 * @returns {string} - HTML de la tarjeta del producto
 */
function createProductCard(product) {
    const imageHtml = product.image
        ? `<img src="${product.image}" alt="${product.name}" loading="lazy">`
        : `<div class="product-card-image-placeholder"><i class="fas fa-image"></i></div>`;

    // Crear sección de precios (múltiples o uno solo)
    let priceHtml = '';

    if (product.prices && Array.isArray(product.prices) && product.prices.length > 0) {
        // Si hay múltiples precios
        priceHtml = `
            <div class="product-card-prices">
                ${product.prices.map(p => {
            const formattedPrice = new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP',
                maximumFractionDigits: 0
            }).format(p.price);
            return `
                        <div class="product-price-item">
                            <span class="price-quantity">${p.quantity}</span>
                            <span class="price-amount">${formattedPrice}</span>
                        </div>
                    `;
        }).join('')}
            </div>
        `;
    } else if (product.price) {
        // Si hay un precio único (compatibilidad con formato anterior)
        const formattedPrice = new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            maximumFractionDigits: 0
        }).format(product.price);
        priceHtml = `<div class="product-card-price">${formattedPrice}</div>`;
    }

    // Precio base para WhatsApp (el primero o el único)
    const basePrice = product.prices && product.prices[0]
        ? product.prices[0].price
        : (product.price || 0);

    return `
        <div class="product-card" onclick="shareProduct('${product.name}', ${basePrice})">
            <div class="product-card-image">
                ${imageHtml}
            </div>
            <div class="product-card-content">
                <h3 class="product-card-name">${product.name}</h3>
                <p class="product-card-description">${product.description}</p>
                ${priceHtml}
            </div>
        </div>
    `;
}

/**
 * SISTEMA DE WHATSAPP - Gestión centralizada
 * Garantiza que cada click genere una nueva URL limpia sin historial
 */

// Variable global para almacenar la última acción WhatsApp
let lastWhatsAppAction = null;

/**
 * Comparte un producto por WhatsApp con mensaje personalizado
 * Cada click genera una URL nueva y limpia
 * @param {string} productName - Nombre del producto
 * @param {number} price - Precio del producto
 */
function shareProduct(productName, price) {
    // Limpia el estado anterior
    lastWhatsAppAction = null;

    // Formatear precio
    const formattedPrice = new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0
    }).format(price);

    // Mensaje personalizado para el producto
    const message = `Hola 👋, me gustaría obtener más información sobre:\n\n📌 *${productName}*\n💰 Precio: ${formattedPrice}\n\n¿Cuál es la disponibilidad? ¿Qué opciones de pago tienen?`;

    // Obtener número de WhatsApp del botón flotante
    const whatsappLink = document.querySelector('.whatsapp-float');
    let phoneNumber = '573133490296'; // Default

    if (whatsappLink && whatsappLink.href) {
        const match = whatsappLink.href.match(/wa\.me\/(\d+)/);
        if (match && match[1]) {
            phoneNumber = match[1];
        }
    }

    // Construir URL y abrir
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    try {
        window.open(url, '_blank', 'noopener,noreferrer');
        console.log('✅ WhatsApp abierto con producto:', productName);
    } catch (error) {
        console.error('Error al abrir WhatsApp:', error);
        window.open(url, '_blank');
    }
}

/**
 * Cierra el modal de productos al hacer clic fuera de él
 */
document.addEventListener('click', function (event) {
    const productsModal = document.getElementById('productsModal');
    if (event.target === productsModal) {
        closeProductsModal();
    }
});

console.log('✅ Sistema de productos cargado');