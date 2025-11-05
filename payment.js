document.addEventListener("DOMContentLoaded", function () {
    // === Stats Counter Animation ===
    function animateCounter(elementId, targetValue, duration = 2000) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        let startValue = 0;
        const increment = targetValue / (duration / 16); // 60fps
        
        function updateCounter() {
            startValue += increment;
            if (startValue < targetValue) {
                element.textContent = Math.floor(startValue).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = targetValue.toLocaleString();
            }
        }
        updateCounter();
    }

    // Animate counters when section is visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.target.id === 'feed-children') {
                animateCounter('meals-served', 12847);
                animateCounter('children-fed', 3542);
                animateCounter('communities-reached', 27);
                animateCounter('volunteers', 156);
                observer.unobserve(entry.target); // Run only once
            }
        });
    });
    
    const feedSection = document.getElementById('feed-children');
    if (feedSection) {
        observer.observe(feedSection);
    }

    // === Scroll Animations ===
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-section').forEach(el => {
        scrollObserver.observe(el);
    });

    // === Payment Tabs ===
    const tabs = document.querySelectorAll(".payment-tab");
    const methods = document.querySelectorAll(".payment-method");

    tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            // Reset all tabs
            tabs.forEach((t) => t.classList.remove("active-tab", "text-deep-navy", "border-gold-accent"));
            tabs.forEach((t) => t.classList.add("text-gray-500", "border-transparent"));

            // Hide all methods
            methods.forEach((m) => m.classList.add("hidden"));

            // Activate clicked tab
            tab.classList.add("active-tab", "text-deep-navy", "border-gold-accent");
            tab.classList.remove("text-gray-500", "border-transparent");

            // Show selected method
            const paymentType = tab.getAttribute("data-payment");
            const targetMethod = document.getElementById(`${paymentType}-payment`);
            if (targetMethod) {
                targetMethod.classList.remove("hidden");
            }
        });
    });

    // === Card Payment Form ===
    const donationForm = document.getElementById("donation-form");
    const customAmountInput = document.getElementById("custom-amount");
    const displayAmount = document.getElementById("display-amount");

    if (customAmountInput) {
        customAmountInput.addEventListener("input", () => {
            const value = parseFloat(customAmountInput.value) || 0;
            displayAmount.textContent = `$${value}`;
        });
    }

    if (donationForm) {
        donationForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const amount = customAmountInput.value;
            if (!amount || amount <= 0) {
                showAlert("Please enter a valid donation amount.", "error");
                return;
            }
            openPaymentModal(amount);
        });
    }

    // === Enhanced Bank Receipt Upload ===
    const uploadBtn = document.getElementById("upload-receipt-btn");
    const receiptUpload = document.getElementById("receipt-upload");
    
    if (uploadBtn && receiptUpload) {
        uploadBtn.addEventListener("click", () => {
            const file = receiptUpload.files[0];
            if (!file) {
                showAlert("Please select a receipt image first.", "error");
                return;
            }

            // Validate file type
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
            if (!validTypes.includes(file.type)) {
                showAlert("Please upload a valid image file (JPEG, PNG, or GIF).", "error");
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                showAlert("File size must be less than 5MB.", "error");
                return;
            }

            // Simulate upload process
            uploadBtn.disabled = true;
            uploadBtn.textContent = "Uploading...";
            uploadBtn.classList.add("opacity-50");

            // Create FormData for file upload simulation
            const formData = new FormData();
            formData.append('receipt', file);
            formData.append('timestamp', new Date().toISOString());
            formData.append('uploadId', generateUploadId());

            // Simulate API call delay
            setTimeout(() => {
                // In real implementation, you would send this to your server:
                // fetch('/api/upload-receipt', { method: 'POST', body: formData })
                
                console.log('Receipt uploaded successfully:', {
                    fileName: file.name,
                    fileSize: file.size,
                    fileType: file.type,
                    uploadId: generateUploadId(),
                    timestamp: new Date().toISOString()
                });

                uploadBtn.disabled = false;
                uploadBtn.textContent = "Upload Successful ✓";
                uploadBtn.classList.remove("opacity-50");
                uploadBtn.classList.remove("bg-deep-navy");
                uploadBtn.classList.add("bg-green-600");

                showAlert("Receipt uploaded successfully! We'll verify and confirm your donation shortly.", "success");
                
                // Reset button after 3 seconds
                setTimeout(() => {
                    uploadBtn.textContent = "Upload Receipt";
                    uploadBtn.classList.remove("bg-green-600");
                    uploadBtn.classList.add("bg-deep-navy");
                }, 3000);

            }, 2000); // Simulate 2-second upload time
        });

        // File input change handler for preview
        receiptUpload.addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (file) {
                const fileInfo = document.getElementById("file-info") || createFileInfoDisplay();
                fileInfo.textContent = `Selected: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`;
            }
        });
    }

    // === Card Number Formatting ===
    const cardNumber = document.getElementById("card-number");
    if (cardNumber) {
        cardNumber.addEventListener("input", (e) => {
            let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formattedValue;
        });
    }

    // === Expiry Date Formatting ===
    const expiryDate = document.getElementById("expiry-date");
    if (expiryDate) {
        expiryDate.addEventListener("input", (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
        });
    }

    // === CVV Formatting ===
    const cvv = document.getElementById("cvv");
    if (cvv) {
        cvv.addEventListener("input", (e) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
        });
    }
});

// === Helper Functions ===
function generateUploadId() {
    return 'upload_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
}

function createFileInfoDisplay() {
    const fileInfo = document.createElement('p');
    fileInfo.id = 'file-info';
    fileInfo.className = 'text-sm text-gray-600 mt-2';
    document.getElementById('receipt-upload').parentNode.appendChild(fileInfo);
    return fileInfo;
}

// === Payment Modal Functions ===
function openPaymentModal(amount) {
    const modal = document.getElementById("payment-modal");
    const paymentAmount = document.getElementById("payment-amount");
    if (modal && paymentAmount) {
        paymentAmount.textContent = amount;
        modal.classList.add("show");
        document.body.style.overflow = "hidden";

        // Reset modal to first step
        const step1 = document.getElementById("payment-step-1");
        const step2 = document.getElementById("payment-step-2");
        const errorDiv = document.getElementById("payment-error");
        
        if (step1) step1.classList.remove("hidden");
        if (step2) step2.classList.add("hidden");
        if (errorDiv) errorDiv.classList.add("hidden");

        // Hook payment form
        const form = document.getElementById("payment-auth-form");
        if (form) {
            form.onsubmit = function (e) {
                e.preventDefault();
                processPayment(amount);
            };
        }
    }
}

function closePaymentModal() {
    const modal = document.getElementById("payment-modal");
    if (modal) {
        modal.classList.remove("show");
        document.body.style.overflow = "auto";
    }
}

function processPayment(amount) {
    const step1 = document.getElementById("payment-step-1");
    const step2 = document.getElementById("payment-step-2");
    const successAmount = document.getElementById("success-amount");
    const errorDiv = document.getElementById("payment-error");

    // Validate form fields
    const cardNumber = document.getElementById("card-number").value.replace(/\s/g, '');
    const expiryDate = document.getElementById("expiry-date").value;
    const cvv = document.getElementById("cvv").value;
    const cardholderName = document.getElementById("cardholder-name").value;
    const email = document.getElementById("donor-email").value;

    // Basic validation
    if (!cardNumber || cardNumber.length < 13) {
        showPaymentError("Please enter a valid card number.");
        return;
    }
    if (!expiryDate || !expiryDate.match(/^\d{2}\/\d{2}$/)) {
        showPaymentError("Please enter a valid expiry date (MM/YY).");
        return;
    }
    if (!cvv || cvv.length < 3) {
        showPaymentError("Please enter a valid CVV.");
        return;
    }
    if (!cardholderName.trim()) {
        showPaymentError("Please enter the cardholder name.");
        return;
    }
    if (!email || !email.includes('@')) {
        showPaymentError("Please enter a valid email address.");
        return;
    }

    // Simulate payment processing
    step1.classList.add("hidden");
    
    // Show loading state
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'text-center py-8';
    loadingDiv.innerHTML = `
        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-gold-accent mx-auto mb-4"></div>
        <p class="text-gray-600">Processing your payment...</p>
    `;
    step1.parentNode.insertBefore(loadingDiv, step2);

    // Simulate processing time
    setTimeout(() => {
        loadingDiv.remove();
        
        // Random success/failure for demo (90% success rate)
        const isSuccess = Math.random() > 0.1;
        
        if (isSuccess && step2 && successAmount) {
            step2.classList.remove("hidden");
            successAmount.textContent = amount;
            
            // Log successful payment data
            console.log('Payment processed successfully:', {
                amount: amount,
                cardNumber: '**** **** **** ' + cardNumber.slice(-4),
                cardholderName: cardholderName,
                email: email,
                timestamp: new Date().toISOString(),
                transactionId: 'txn_' + Math.random().toString(36).substr(2, 9)
            });
        } else {
            showPaymentError("Payment failed. Please check your card details and try again.");
            step1.classList.remove("hidden");
        }
    }, 2000);
}

function showPaymentError(message) {
    const errorDiv = document.getElementById("payment-error");
    const errorMessage = document.getElementById("error-message");
    if (errorDiv && errorMessage) {
        errorMessage.textContent = message;
        errorDiv.classList.remove("hidden");
        
        // Hide error after 5 seconds
        setTimeout(() => {
            errorDiv.classList.add("hidden");
        }, 5000);
    }
}

// === PayPal Donation ===
function processPayPalDonation() {
    const amountInput = document.getElementById("paypal-amount");
    const amount = parseFloat(amountInput?.value) || 0;

    if (amount <= 0) {
        showAlert("Please enter a valid donation amount before continuing.", "error");
        return;
    }

    const container = document.getElementById("paypal-button-container");
    if (!container) return;
    
    container.innerHTML = "";

    // Check if PayPal SDK is loaded
    if (typeof paypal === 'undefined') {
        showAlert("PayPal is not available. Please try another payment method.", "error");
        return;
    }

    paypal.Buttons({
        createOrder: (data, actions) => {
            return actions.order.create({
                purchase_units: [{
                    amount: { 
                        value: amount.toString(),
                        currency_code: 'USD'
                    },
                    description: 'Donation to The Kingdom Pentecostal Church'
                }]
            });
        },
        onApprove: (data, actions) => {
            return actions.order.capture().then(details => {
                showAlert("Payment completed successfully by " + details.payer.name.given_name + "!", "success");
                console.log('PayPal payment completed:', details);
            });
        },
        onError: (err) => {
            console.error('PayPal payment error:', err);
            showAlert("PayPal payment failed. Please try again.", "error");
        },
        onCancel: () => {
            showAlert("PayPal payment was cancelled.", "error");
        }
    }).render("#paypal-button-container");
}

// === BTC Donation ===
function copyBTCAddress() {
    const address = "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh";
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(address).then(() => {
            showAlert("Bitcoin address copied to clipboard!", "success");
        }).catch(() => {
            fallbackCopyText(address);
        });
    } else {
        fallbackCopyText(address);
    }
}

function fallbackCopyText(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
        document.execCommand('copy');
        showAlert("Bitcoin address copied to clipboard!", "success");
    } catch (err) {
        showAlert("Could not copy address. Please copy manually.", "error");
    }
    document.body.removeChild(textArea);
}

// === Child Sponsorship Functions ===
function sponsorChild(packageType, amount) {
    // Scroll to give section and pre-fill amount
    scrollToSection('give');
    
    setTimeout(() => {
        const customAmountInput = document.getElementById("custom-amount");
        const displayAmount = document.getElementById("display-amount");
        
        if (customAmountInput && displayAmount) {
            customAmountInput.value = amount;
            displayAmount.textContent = `${amount}`;
        }
        
        showAlert(`Selected ${packageType} package (${amount}). Please complete your donation below.`, "success");
    }, 1000);
}

function openVolunteerModal() {
    showAlert("Volunteer registration form would open here. Contact us for more information!", "success");
}

// === Enhanced Alert System ===
function showAlert(message, type) {
    // Remove any existing alerts
    const existingAlert = document.querySelector('.custom-alert');
    if (existingAlert) {
        existingAlert.remove();
    }

    // Create alert element
    const alert = document.createElement("div");
    alert.className = `custom-alert fixed top-4 right-4 z-50 max-w-sm shadow-2xl rounded-lg overflow-hidden transform translate-x-full transition-transform duration-300`;
    
    const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
    const textColor = 'text-white';
    
    alert.innerHTML = `
        <div class="${bgColor} ${textColor} p-4">
            <div class="flex items-center justify-between">
                <div class="flex items-center">
                    <div class="mr-3">
                        ${type === 'success' ? 
                            '<svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>' :
                            type === 'error' ?
                            '<svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>' :
                            '<svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>'
                        }
                    </div>
                    <span class="font-medium">${message}</span>
                </div>
                <button onclick="this.closest('.custom-alert').remove()" class="ml-4 text-white hover:text-gray-200 font-bold text-xl">&times;</button>
            </div>
        </div>
    `;

    document.body.appendChild(alert);

    // Slide in animation
    setTimeout(() => {
        alert.classList.remove('translate-x-full');
    }, 100);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alert.parentElement) {
            alert.classList.add('translate-x-full');
            setTimeout(() => alert.remove(), 300);
        }
    }, 5000);
}