const GOOGLE_FORM_CONFIG = {
  ORDER_FIELD_ID: 'entry.1585674810',
  FORM_URL: 'https://docs.google.com/forms/d/e/1FAIpQLSf8dv2uFUTKeD8xghrfsaU9riqLod4DCUwSez0q4o2W0sf8kg/viewform?embedded=true'
};

function testGoogleFormPrefill() {
  const testOrder = encodeURIComponent('Test Order: Lechon Kawali x1 - ₱280\nTotal: ₱280');
  const testUrl = `${GOOGLE_FORM_CONFIG.FORM_URL}&${GOOGLE_FORM_CONFIG.ORDER_FIELD_ID}=${testOrder}`;
  console.log('Test this URL in a new tab to verify pre-fill works:');
  console.log(testUrl);
  window.open(testUrl, '_blank');
}

const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');

toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('nav--open');
  toggle.setAttribute('aria-expanded', open);

  document.body.style.overflow = open ? 'hidden' : '';
});

const allNavLinks = nav.querySelectorAll('a');
const menuLinks = nav.querySelectorAll('.nav__list a');

allNavLinks.forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('nav--open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

menuLinks.forEach(link => {
  link.addEventListener('click', (e) => {

    menuLinks.forEach(l => l.classList.remove('active-nav'));

    e.currentTarget.classList.add('active-nav');
  });
});

const menuCards = document.querySelectorAll('.featured-card');
const dishes = document.querySelectorAll('.dish-item');
const grid = document.querySelector('.featured__grid');

if (document.querySelector('.featured-card.active')) {
  grid.classList.add('has-selection');
}

menuCards.forEach(card => {
  card.addEventListener('click', () => {

    menuCards.forEach(c => c.classList.remove('active'));
    card.classList.add('active');
    grid.classList.add('has-selection');


    const targetCategory = card.getAttribute('data-target');

    dishes.forEach(dish => {
      if (!dish.classList.contains('hidden')) {
         dish.classList.add('fade-out');
      }

      setTimeout(() => {
        if (dish.getAttribute('data-category') === targetCategory || targetCategory === 'all') {
          dish.classList.remove('hidden');
          setTimeout(() => {
            dish.classList.remove('fade-out');
          }, 50);
        } else {
          dish.classList.add('hidden');
        }
      }, 400);
    });
  });
});

const orderModal = document.getElementById('orderModal');
const openTriggers = document.querySelectorAll('[data-open-order]');
const closeTriggers = document.querySelectorAll('[data-close-modal]');
let lastFocusedElement = null;

function openModal() {
  if (!orderModal) return;

  lastFocusedElement = document.activeElement;
  orderModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  updateOrderSummary();

  loadPrefilledForm();

  setTimeout(() => {
    const closeBtn = orderModal.querySelector('.order-modal__close');
    if (closeBtn) closeBtn.focus();
  }, 100);
}

function loadPrefilledForm() {
  if (!orderFormIframe) return;

  if (cart.length === 0) {
    orderFormIframe.src = GOOGLE_FORM_CONFIG.FORM_URL;
    return;
  }

  const orderDetails = cart.map(item =>
    `${item.name} - ${item.quantity}`
  ).join(', ');

  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const orderText = `${orderDetails} (Total: ₱${totalPrice.toLocaleString()})`;

  const encodedOrder = encodeURIComponent(orderText);

  const preFilledUrl = `${GOOGLE_FORM_CONFIG.FORM_URL}&${GOOGLE_FORM_CONFIG.ORDER_FIELD_ID}=${encodedOrder}`;

  orderFormIframe.src = preFilledUrl;
}

function updateOrderSummary() {
  if (!orderCartSummary || !orderSummaryItems || !orderSummaryTotal) return;

  if (cart.length === 0) {
    orderCartSummary.style.display = 'none';
  } else {
    orderCartSummary.style.display = 'block';
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    orderSummaryItems.innerHTML = cart.map(item => `
      <div class="order-modal__summary-item">
        <span class="order-modal__summary-item-name">${item.name}</span>
        <span class="order-modal__summary-item-qty">x${item.quantity}</span>
        <span class="order-modal__summary-item-price">₱${(item.price * item.quantity).toLocaleString()}</span>
      </div>
    `).join('');

    orderSummaryTotal.textContent = `₱${totalPrice.toLocaleString()}`;
  }
}

function closeModal() {
  orderModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';

  if (lastFocusedElement) {
    lastFocusedElement.focus();
  }
}

openTriggers.forEach(trigger => {
  trigger.addEventListener('click', (e) => {
    e.preventDefault();
    openModal();
  });
});

closeTriggers.forEach(trigger => {
  trigger.addEventListener('click', closeModal);
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && orderModal.getAttribute('aria-hidden') === 'false') {
    closeModal();
  }
});

if (orderModal) {
  const orderContainer = orderModal.querySelector('.order-modal__container');
  
  if (orderContainer) {
    orderContainer.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }
}



document.addEventListener('click', function(e) {
  const link = e.target.closest('a');
  if (!link) return;

  const href = link.getAttribute('href') || '';
  if (href.startsWith('#') || href.startsWith(window.location.origin)) {
    link.removeAttribute('target');
  }
});

document.addEventListener('auxclick', function(e) {
  if (e.button === 1) {
    const link = e.target.closest('a');
    if (link) {
      const href = link.getAttribute('href') || '';
      if (href.startsWith('#')) {
        e.preventDefault();
        window.location.hash = href;
      }
    }
  }
});


let cart = JSON.parse(localStorage.getItem('putaheCart')) || [];

const cartIcon = document.getElementById('cartIcon');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const cartModal = document.getElementById('cartModal');
const cartItems = document.getElementById('cartItems');
const cartModalTotal = document.getElementById('cartModalTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const closeCartTriggers = document.querySelectorAll('[data-close-cart]');
const orderCartSummary = document.getElementById('orderCartSummary');
const orderSummaryItems = document.getElementById('orderSummaryItems');
const orderSummaryTotal = document.getElementById('orderSummaryTotal');
const clearCartBtn = document.getElementById('clearCartBtn');
const orderFormIframe = document.getElementById('orderFormIframe');

function saveCart() {
  localStorage.setItem('putaheCart', JSON.stringify(cart));
}

function updateCartUI() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  cartCount.textContent = totalItems;
  cartTotal.textContent = `₱${totalPrice.toLocaleString()}`;
  cartModalTotal.textContent = `₱${totalPrice.toLocaleString()}`;

  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="cart-modal__empty">Your cart is empty</p>';
    checkoutBtn.disabled = true;
    if (clearCartBtn) clearCartBtn.style.display = 'none';
  } else {
    cartItems.innerHTML = cart.map((item, index) => `
      <div class="cart-item">
        <div class="cart-item__info">
          <div class="cart-item__name">${item.name}</div>
          <div class="cart-item__price">₱${item.price.toLocaleString()}</div>
        </div>
        <div class="cart-item__quantity">
          <button class="cart-item__qty-btn" data-action="decrease" data-index="${index}" aria-label="Decrease quantity">−</button>
          <span class="cart-item__qty">${item.quantity}</span>
          <button class="cart-item__qty-btn" data-action="increase" data-index="${index}" aria-label="Increase quantity">+</button>
        </div>
        <button class="cart-item__remove" data-action="remove" data-index="${index}" aria-label="Remove item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>
    `).join('');
    checkoutBtn.disabled = false;
    if (clearCartBtn) clearCartBtn.style.display = 'block';
  }

  saveCart();
}

function addToCart(name, price) {
  const existingItem = cart.find(item => item.name === name);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ name, price, quantity: 1 });
  }

  updateCartUI();

  loadPrefilledForm();

  if (cartIcon) {
    cartIcon.style.transform = 'scale(1.2)';
    setTimeout(() => {
      cartIcon.style.transform = '';
    }, 200);
  }
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartUI();
  loadPrefilledForm();
}

function updateQuantity(index, action) {
  const item = cart[index];

  if (action === 'increase') {
    item.quantity += 1;
  } else if (action === 'decrease' && item.quantity > 1) {
    item.quantity -= 1;
  }

  updateCartUI();
  loadPrefilledForm();
}

function openCartModal() {
  lastFocusedElement = document.activeElement;
  cartModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeCartModal() {
  cartModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';

  if (lastFocusedElement) {
    lastFocusedElement.focus();
  }
}

document.querySelectorAll('.add-to-cart').forEach(button => {
  button.addEventListener('click', () => {
    const name = button.getAttribute('data-dish');
    const price = parseInt(button.getAttribute('data-price'));
    addToCart(name, price);
  });
});

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', updateCartUI);
} else {
  updateCartUI();
}

document.querySelectorAll('[data-open-cart]').forEach(button => {
  button.addEventListener('click', (e) => {
    e.preventDefault();
    openCartModal();
  });
});

if (clearCartBtn) {
  clearCartBtn.addEventListener('click', () => {
    if (cart.length > 0 && confirm('Are you sure you want to clear your cart?')) {
      cart = [];
      updateCartUI();
      loadPrefilledForm();
    }
  });
}

// Auto-clear cart when Google Form is submitted
if (orderFormIframe) {
  orderFormIframe.addEventListener('load', function() {
    // Accessing iframe.location for cross-origin content (Google Forms) can throw a security error.
    // Wrap in try/catch to avoid breaking the rest of the script if the browser blocks access.
    try {
      // Check if the iframe has been redirected to a success response
      const currentSrc = orderFormIframe.contentWindow.location.href;
      
      // Google Forms success response typically contains "formResponse" in the URL
      if (currentSrc.includes('formResponse') && cart.length > 0) {
        // Clear the cart after successful submission
        cart = [];
        updateCartUI();
        loadPrefilledForm();
        
        // Show a brief success message
        const modal = document.getElementById('orderModal');
        if (modal) {
          const container = modal.querySelector('.order-modal__container');
          if (container) {
            // Create success message
            const successMsg = document.createElement('div');
            successMsg.className = 'order-modal__success-message';
            successMsg.textContent = 'Order submitted successfully! Cart has been cleared.';
            successMsg.style.cssText = 'background: #4CAF50; color: white; padding: 1rem; text-align: center; border-radius: 8px; margin-bottom: 1rem;';
            
            // Replace iframe with success message temporarily
            const frameWrap = modal.querySelector('.order-modal__frame-wrap');
            if (frameWrap) {
              frameWrap.style.display = 'none';
              const body = modal.querySelector('.order-modal__body');
              if (body) {
                body.insertBefore(successMsg, frameWrap);
                
                // Close modal after 3 seconds
                setTimeout(() => {
                  closeModal();
                  successMsg.remove();
                  frameWrap.style.display = 'block';
                }, 3000);
              }
            }
          }
        }
      }
    } catch (err) {
      // Cross-origin access prevented — cannot auto-detect submission from Google Forms.
      // No-op to avoid uncaught exceptions. Consider adding a manual "Confirm submission" button
      // inside the order modal if automatic detection is required.
      return;
    }
  });
}

if (cartIcon) {
  cartIcon.addEventListener('click', () => {
    openCartModal();
  });
}

closeCartTriggers.forEach(trigger => {
  trigger.addEventListener('click', closeCartModal);
});

if (cartItems) {
  cartItems.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;

    const action = btn.getAttribute('data-action');
    const index = parseInt(btn.getAttribute('data-index'));

    if (action === 'remove') {
      removeFromCart(index);
    } else if (action === 'increase' || action === 'decrease') {
      updateQuantity(index, action);
    }
  });
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && cartModal && cartModal.getAttribute('aria-hidden') === 'false') {
    closeCartModal();
  }
});

if (cartModal) {
  const cartContainer = cartModal.querySelector('.cart-modal__container');
  
  if (cartContainer) {
    cartContainer.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }
}

// Checkout button - open order modal with pre-filled form
if (checkoutBtn) {
  checkoutBtn.addEventListener('click', () => {
    closeCartModal();
    setTimeout(() => {
      openModal();
    }, 300);
  });
}

const contactForm = document.getElementById('contactForm');
const contactSuccess = document.getElementById('contactSuccess');

if (contactForm && contactSuccess) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = contactForm.querySelector('#contact-name').value.trim();
    const email = contactForm.querySelector('#contact-email').value.trim();
    const phone = contactForm.querySelector('#contact-phone').value.trim();
    const message = contactForm.querySelector('#contact-message').value.trim();

    const subject = encodeURIComponent(`Putahe inquiry from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nPhone: ${phone || 'Not provided'}\n\nMessage:\n${message}`
    );

    window.location.href = `mailto:putahe@bbqtie.com?subject=${subject}&body=${body}`;

    contactForm.reset();
    contactSuccess.hidden = false;
    contactSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  contactForm.addEventListener('input', () => {
    if (!contactSuccess.hidden) {
      contactSuccess.hidden = true;
    }
  });
}