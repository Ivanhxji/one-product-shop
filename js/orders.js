/* ============================================
   ORDERS MODULE — Checkout form + Google Sheets
   ============================================ */

// ВСТАВЬ СЮДА URL ИЗ GOOGLE APPS SCRIPT DEPLOY
const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbwK5VitNwbWC2A3rbGVOh5hQ3JPgD9O6BgLpvORsduTJWZzIrld-pVFm8Nuz1Yo4pw/exec';

const PRODUCT_NAME = 'AutoLink Pro — Wireless CarPlay & Android Auto Adapter';
const PRODUCT_PRICE = 59.99;

// --- Create checkout modal ---
function createCheckoutModal() {
    const modal = document.createElement('div');
    modal.id = 'checkoutModal';
    modal.className = 'checkout-modal';
    modal.innerHTML = `
        <div class="checkout-overlay" id="checkoutOverlay"></div>
        <div class="checkout-content">
            <button class="checkout-close" id="checkoutClose">&times;</button>
            <div class="checkout-left">
                <h2>Order Summary</h2>
                <div class="checkout-product">
                    <div class="checkout-product-icon">&#128663;</div>
                    <div>
                        <strong>AutoLink Pro</strong>
                        <span>Wireless CarPlay & Android Auto</span>
                    </div>
                </div>
                <div class="checkout-line">
                    <span>Price</span>
                    <span id="checkoutPrice">$59.99</span>
                </div>
                <div class="checkout-line">
                    <span>Quantity</span>
                    <span id="checkoutQty">1</span>
                </div>
                <div class="checkout-line">
                    <span>Shipping</span>
                    <span class="free-tag">FREE</span>
                </div>
                <div class="checkout-line checkout-total">
                    <span>Total</span>
                    <span id="checkoutTotal">$59.99</span>
                </div>
                <div class="checkout-badges">
                    <span>&#128274; Secure</span>
                    <span>&#128666; Free Shipping</span>
                    <span>&#128260; 30-Day Return</span>
                </div>
            </div>
            <div class="checkout-right">
                <h2>Shipping Details</h2>
                <form id="checkoutForm">
                    <div class="form-row">
                        <div class="form-group">
                            <label>First Name *</label>
                            <input type="text" name="firstName" required placeholder="John">
                        </div>
                        <div class="form-group">
                            <label>Last Name *</label>
                            <input type="text" name="lastName" required placeholder="Smith">
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Email *</label>
                        <input type="email" name="email" required placeholder="john@example.com">
                    </div>
                    <div class="form-group">
                        <label>Phone *</label>
                        <input type="tel" name="phone" required placeholder="+1 (555) 123-4567">
                    </div>
                    <div class="form-group">
                        <label>Street Address *</label>
                        <input type="text" name="address" required placeholder="123 Main Street, Apt 4">
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>City *</label>
                            <input type="text" name="city" required placeholder="New York">
                        </div>
                        <div class="form-group">
                            <label>State</label>
                            <input type="text" name="state" placeholder="NY">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>ZIP Code *</label>
                            <input type="text" name="zip" required placeholder="10001">
                        </div>
                        <div class="form-group">
                            <label>Country *</label>
                            <select name="country" required>
                                <option value="">Select...</option>
                                <option value="US">United States</option>
                                <option value="CA">Canada</option>
                                <option value="UK">United Kingdom</option>
                                <option value="AU">Australia</option>
                                <option value="DE">Germany</option>
                                <option value="FR">France</option>
                                <option value="NL">Netherlands</option>
                                <option value="SE">Sweden</option>
                                <option value="NO">Norway</option>
                                <option value="DK">Denmark</option>
                                <option value="ES">Spain</option>
                                <option value="IT">Italy</option>
                                <option value="JP">Japan</option>
                                <option value="KR">South Korea</option>
                                <option value="OTHER">Other</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Order Notes (optional)</label>
                        <textarea name="notes" rows="2" placeholder="Car model, special requests..."></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary btn-xl checkout-submit" id="checkoutSubmit">
                        Place Order — <span id="submitTotal">$59.99</span>
                        <span class="btn-subtext">You'll receive order confirmation by email</span>
                    </button>
                    <p class="checkout-disclaimer">&#128274; Your data is secure. We never share your information.</p>
                </form>

                <!-- Success state -->
                <div class="checkout-success" id="checkoutSuccess" style="display:none;">
                    <div class="success-icon">&#9989;</div>
                    <h2>Order Placed!</h2>
                    <p class="success-order-num" id="successOrderNum"></p>
                    <p>We'll send a confirmation email to <strong id="successEmail"></strong> with tracking details within 24 hours.</p>
                    <div class="success-details">
                        <div><strong>Product:</strong> AutoLink Pro</div>
                        <div><strong>Shipping:</strong> FREE — 5-14 business days</div>
                        <div><strong>Guarantee:</strong> 30-day money back</div>
                    </div>
                    <button class="btn btn-primary" onclick="closeCheckout()">Close</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    initCheckoutEvents();
}

function initCheckoutEvents() {
    const overlay = document.getElementById('checkoutOverlay');
    const closeBtn = document.getElementById('checkoutClose');
    const form = document.getElementById('checkoutForm');

    overlay.addEventListener('click', closeCheckout);
    closeBtn.addEventListener('click', closeCheckout);

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = document.getElementById('checkoutSubmit');
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Processing... <span class="btn-subtext">Please wait</span>';

        const formData = new FormData(form);
        const qty = parseInt(document.getElementById('qtyInput').value) || 1;
        const total = (PRODUCT_PRICE * qty).toFixed(2);

        const orderData = {
            name: formData.get('firstName') + ' ' + formData.get('lastName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            address: formData.get('address'),
            city: formData.get('city'),
            state: formData.get('state'),
            zip: formData.get('zip'),
            country: formData.get('country'),
            product: PRODUCT_NAME,
            quantity: qty,
            price: '$' + PRODUCT_PRICE,
            total: '$' + total,
            notes: formData.get('notes') || ''
        };

        try {
            // Save to Google Sheets
            await fetch(GOOGLE_SHEETS_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });

            // Notify n8n → Telegram (fire and forget)
            fetch('https://maliutin.app.n8n.cloud/webhook/new-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            }).catch(() => {});

            // Show success (no-cors = opaque response, so we assume success)
            form.style.display = 'none';
            const successDiv = document.getElementById('checkoutSuccess');
            successDiv.style.display = 'block';
            document.getElementById('successEmail').textContent = orderData.email;
            document.getElementById('successOrderNum').textContent =
                'Order #AL-' + new Date().toISOString().slice(0,10).replace(/-/g,'') + '-' + Math.floor(Math.random()*900+100);

        } catch (err) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = `Place Order — <span id="submitTotal">$${total}</span><span class="btn-subtext">You'll receive order confirmation by email</span>`;
            alert('Something went wrong. Please try again or contact support.');
        }
    });
}

function openCheckout() {
    const modal = document.getElementById('checkoutModal');
    const qty = parseInt(document.getElementById('qtyInput').value) || 1;
    const total = (PRODUCT_PRICE * qty).toFixed(2);

    document.getElementById('checkoutPrice').textContent = '$' + PRODUCT_PRICE;
    document.getElementById('checkoutQty').textContent = qty;
    document.getElementById('checkoutTotal').textContent = '$' + total;
    document.getElementById('submitTotal').textContent = '$' + total;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCheckout() {
    const modal = document.getElementById('checkoutModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';

    // Reset form state
    const form = document.getElementById('checkoutForm');
    const successDiv = document.getElementById('checkoutSuccess');
    form.style.display = '';
    successDiv.style.display = 'none';
    form.reset();
    const submitBtn = document.getElementById('checkoutSubmit');
    submitBtn.disabled = false;
}

// --- Init on DOM ready ---
document.addEventListener('DOMContentLoaded', () => {
    createCheckoutModal();
});
