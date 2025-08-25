// Contact form functionality for OEM Waterproof Bags website

// Initialize contact form when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeContactForm();
    initializeQuoteCalculator();
    initializeFAQToggle();
});

// Contact form initialization
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactFormSubmit);
        
        // Real-time validation
        const inputs = contactForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
    }
}

// Handle contact form submission
function handleContactFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    
    // Validate all fields
    if (!validateContactForm(form)) {
        window.OEMWaterproofBags.showNotification('Please correct the errors in the form', 'error');
        return;
    }
    
    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        // Reset form
        form.reset();
        
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
        // Show success message
        window.OEMWaterproofBags.showNotification('Thank you for your inquiry! We will contact you within 24 hours.', 'success', 5000);
        
        // Log form data for development (remove in production)
        console.log('Form submitted with data:', Object.fromEntries(formData));
        
    }, 2000);
}

// Validate entire contact form
function validateContactForm(form) {
    let isValid = true;
    
    // Get all required fields
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Validate individual field
function validateField(field) {
    const value = field.value.trim();
    const fieldType = field.type;
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';
    
    // Check if required field is empty
    if (field.hasAttribute('required') && !window.OEMWaterproofBags.validateRequired(value)) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    // Validate email
    else if (fieldType === 'email' && value && !window.OEMWaterproofBags.validateEmail(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address';
    }
    // Validate phone
    else if (fieldName === 'phone' && value && !window.OEMWaterproofBags.validatePhone(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid phone number';
    }
    // Validate minimum quantity
    else if (fieldName === 'quantity' && value && parseInt(value) < 100) {
        isValid = false;
        errorMessage = 'Minimum order quantity is 100 pieces';
    }
    // Validate message length
    else if (fieldName === 'message' && value && value.length < 10) {
        isValid = false;
        errorMessage = 'Please provide more details (minimum 10 characters)';
    }
    
    // Show or hide error
    if (!isValid) {
        showFieldError(field, errorMessage);
    } else {
        clearFieldError(field);
    }
    
    return isValid;
}

// Show field error
function showFieldError(field, message) {
    clearFieldError(field);
    
    field.classList.add('error');
    
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.cssText = `
        color: #e74c3c;
        font-size: 14px;
        margin-top: 5px;
        display: block;
    `;
    
    field.parentNode.appendChild(errorElement);
}

// Clear field error
function clearFieldError(field) {
    field.classList.remove('error');
    
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

// Quote calculator functionality
function initializeQuoteCalculator() {
    const quantityInput = document.getElementById('quantity');
    const productSelect = document.getElementById('product-type');
    const customizationSelect = document.getElementById('customization-level');
    const estimateDisplay = document.getElementById('price-estimate');
    
    if (quantityInput && productSelect && customizationSelect && estimateDisplay) {
        const inputs = [quantityInput, productSelect, customizationSelect];
        
        inputs.forEach(input => {
            input.addEventListener('change', calculateEstimate);
            input.addEventListener('input', window.OEMWaterproofBags.debounce(calculateEstimate, 500));
        });
        
        // Initial calculation
        calculateEstimate();
    }
}

// Calculate price estimate
function calculateEstimate() {
    const quantity = parseInt(document.getElementById('quantity')?.value) || 0;
    const productType = document.getElementById('product-type')?.value || '';
    const customizationLevel = document.getElementById('customization-level')?.value || '';
    const estimateDisplay = document.getElementById('price-estimate');
    
    if (!estimateDisplay || quantity < 100) {
        if (estimateDisplay) {
            estimateDisplay.textContent = 'Please enter quantity (minimum 100 pieces)';
        }
        return;
    }
    
    // Base prices (USD per piece)
    const basePrices = {
        'waterproof-backpack': 15,
        'travel-bag': 25,
        'cooler-bag': 20,
        'fishing-bag': 30,
        'custom-design': 35
    };
    
    // Customization multipliers
    const customizationMultipliers = {
        'basic': 1.0,
        'standard': 1.2,
        'premium': 1.5,
        'luxury': 2.0
    };
    
    // Quantity discounts
    const quantityDiscounts = {
        100: 1.0,
        500: 0.9,
        1000: 0.8,
        5000: 0.7,
        10000: 0.6
    };
    
    const basePrice = basePrices[productType] || 20;
    const customizationMultiplier = customizationMultipliers[customizationLevel] || 1.0;
    
    // Find applicable quantity discount
    let quantityDiscount = 1.0;
    const discountTiers = Object.keys(quantityDiscounts).map(Number).sort((a, b) => b - a);
    
    for (const tier of discountTiers) {
        if (quantity >= tier) {
            quantityDiscount = quantityDiscounts[tier];
            break;
        }
    }
    
    const unitPrice = basePrice * customizationMultiplier * quantityDiscount;
    const totalPrice = unitPrice * quantity;
    
    // Display estimate
    estimateDisplay.innerHTML = `
        <div class="estimate-breakdown">
            <div class="estimate-line">
                <span>Unit Price:</span>
                <span>$${unitPrice.toFixed(2)}</span>
            </div>
            <div class="estimate-line">
                <span>Quantity:</span>
                <span>${quantity.toLocaleString()} pieces</span>
            </div>
            <div class="estimate-line total">
                <span><strong>Total Estimate:</strong></span>
                <span><strong>$${totalPrice.toLocaleString()}</strong></span>
            </div>
            <div class="estimate-note">
                <small>* This is a rough estimate. Final pricing may vary based on specific requirements, materials, and current market conditions.</small>
            </div>
        </div>
    `;
}

// FAQ toggle functionality
function initializeFAQToggle() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        if (question && answer) {
            question.addEventListener('click', function() {
                const isOpen = item.classList.contains('open');
                
                // Close all other FAQ items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('open');
                        const otherAnswer = otherItem.querySelector('.faq-answer');
                        if (otherAnswer) {
                            otherAnswer.style.maxHeight = '0';
                        }
                    }
                });
                
                // Toggle current item
                if (isOpen) {
                    item.classList.remove('open');
                    answer.style.maxHeight = '0';
                } else {
                    item.classList.add('open');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                }
            });
        }
    });
}

// File upload functionality (if needed)
function initializeFileUpload() {
    const fileInputs = document.querySelectorAll('input[type="file"]');
    
    fileInputs.forEach(input => {
        input.addEventListener('change', function() {
            const files = Array.from(this.files);
            const maxSize = 5 * 1024 * 1024; // 5MB
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
            
            let validFiles = [];
            let errors = [];
            
            files.forEach(file => {
                if (file.size > maxSize) {
                    errors.push(`${file.name} is too large (max 5MB)`);
                } else if (!allowedTypes.includes(file.type)) {
                    errors.push(`${file.name} is not a supported file type`);
                } else {
                    validFiles.push(file);
                }
            });
            
            if (errors.length > 0) {
                window.OEMWaterproofBags.showNotification(errors.join('\n'), 'error');
            }
            
            if (validFiles.length > 0) {
                displaySelectedFiles(this, validFiles);
            }
        });
    });
}

// Display selected files
function displaySelectedFiles(input, files) {
    let fileList = input.parentNode.querySelector('.file-list');
    
    if (!fileList) {
        fileList = document.createElement('div');
        fileList.className = 'file-list';
        input.parentNode.appendChild(fileList);
    }
    
    fileList.innerHTML = '';
    
    files.forEach(file => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px;
            background: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 5px;
            margin-top: 10px;
        `;
        
        fileItem.innerHTML = `
            <span>${file.name} (${(file.size / 1024).toFixed(1)} KB)</span>
            <button type="button" onclick="removeFile(this)" style="background: #e74c3c; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">Remove</button>
        `;
        
        fileList.appendChild(fileItem);
    });
}

// Remove file from selection
function removeFile(button) {
    const fileItem = button.parentNode;
    const fileList = fileItem.parentNode;
    const input = fileList.parentNode.querySelector('input[type="file"]');
    
    fileItem.remove();
    
    // Clear input if no files left
    if (fileList.children.length === 0) {
        input.value = '';
        fileList.remove();
    }
}

// Initialize file upload if file inputs exist
if (document.querySelector('input[type="file"]')) {
    document.addEventListener('DOMContentLoaded', initializeFileUpload);
}

// Export functions for global use
window.removeFile = removeFile;

// Auto-save form data (optional)
function initializeAutoSave() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    const inputs = form.querySelectorAll('input, textarea, select');
    const formId = 'contact-form-autosave';
    
    // Load saved data
    const savedData = localStorage.getItem(formId);
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            Object.keys(data).forEach(key => {
                const field = form.querySelector(`[name="${key}"]`);
                if (field && field.type !== 'file') {
                    field.value = data[key];
                }
            });
        } catch (e) {
            console.warn('Failed to load saved form data:', e);
        }
    }
    
    // Save data on input
    const saveData = window.OEMWaterproofBags.debounce(() => {
        const formData = new FormData(form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            if (form.querySelector(`[name="${key}"]`).type !== 'file') {
                data[key] = value;
            }
        }
        
        localStorage.setItem(formId, JSON.stringify(data));
    }, 1000);
    
    inputs.forEach(input => {
        if (input.type !== 'file') {
            input.addEventListener('input', saveData);
        }
    });
    
    // Clear saved data on successful submission
    form.addEventListener('submit', () => {
        setTimeout(() => {
            localStorage.removeItem(formId);
        }, 3000);
    });
}

// Initialize auto-save
// initializeAutoSave();