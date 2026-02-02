/**
 * Valentine's Day Experience Generator - Professional JavaScript
 * Handles form validation, step navigation, file uploads, and experience creation
 */

class ValentineGenerator {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 4;
        this.formData = new FormData();
        this.isSubmitting = false;
        
        this.init();
    }
    
    init() {
        console.log('🌹 Initializing Valentine Generator...');
        
        try {
            this.cacheElements();
            this.setupEventListeners();
            this.setupFileUpload();
            this.updateProgress();
            
            console.log('✨ Generator initialized successfully');
        } catch (error) {
            console.error('💔 Generator initialization failed:', error);
            this.showError('Failed to initialize the generator. Please refresh the page.');
        }
    }
    
    cacheElements() {
        // Form elements
        this.form = document.getElementById('valentine-form');
        this.steps = document.querySelectorAll('.form-step');
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.createBtn = document.getElementById('create-btn');
        
        // Progress elements
        this.progressFill = document.querySelector('.progress-fill');
        this.progressSteps = document.querySelectorAll('.progress-step');
        
        // Modal elements
        this.successModal = document.getElementById('success-modal');
        this.loadingOverlay = document.getElementById('loading-overlay');
        this.shareLinkInput = document.getElementById('share-link');
        this.copyLinkBtn = document.getElementById('copy-link-btn');
        this.accessPinInput = document.getElementById('access-pin');
        this.copyPinBtn = document.getElementById('copy-pin-btn');
        
        // File upload
        this.videoUploadArea = document.getElementById('video-upload-area');
        this.videoFileInput = document.getElementById('video_file');
        
        // Validation
        this.requiredFields = {
            1: ['creator_name', 'recipient_name'],
            2: ['personal_message'],
            3: ['color_palette'],
            4: ['custom_pin']
        };
        
        console.log('📋 Elements cached successfully');
        
        // Debug: Log cached elements
        console.log('🔍 Cached elements debug:', {
            form: !!this.form,
            successModal: !!this.successModal,
            shareLinkInput: !!this.shareLinkInput,
            accessPinInput: !!this.accessPinInput,
            copyPinBtn: !!this.copyPinBtn,
            copyLinkBtn: !!this.copyLinkBtn
        });
    }
    
    setupEventListeners() {
        // Navigation buttons
        this.prevBtn?.addEventListener('click', () => this.previousStep());
        this.nextBtn?.addEventListener('click', () => this.nextStep());
        this.createBtn?.addEventListener('click', (e) => this.handleSubmit(e));
        
        // Form submission
        this.form?.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // PIN functionality
        this.setupPinFunctionality();
        
        // Modal buttons
        document.getElementById('copy-link-btn')?.addEventListener('click', () => this.copyShareLink());
        document.getElementById('copy-pin-btn')?.addEventListener('click', () => this.copyAccessPin());
        document.getElementById('create-another-btn')?.addEventListener('click', () => this.createAnother());
        document.getElementById('view-experience-btn')?.addEventListener('click', () => this.viewExperience());
        
        // Share buttons
        document.getElementById('share-whatsapp')?.addEventListener('click', () => this.shareViaWhatsApp());
        document.getElementById('share-email')?.addEventListener('click', () => this.shareViaEmail());
        document.getElementById('share-sms')?.addEventListener('click', () => this.shareViaSMS());
        
        // Real-time validation
        this.setupRealTimeValidation();
        
        // Auto-save form data
        this.setupAutoSave();
        
        console.log('🎯 Event listeners set up');
    }
    
    setupPinFunctionality() {
        const customPinInput = document.getElementById('custom_pin');
        
        if (customPinInput) {
            console.log('📍 Custom PIN input found, setting up validation');
            
            // Validate PIN input (only numbers, 4 digits)
            customPinInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/[^0-9]/g, ''); // Only numbers
                if (value.length > 4) {
                    value = value.substring(0, 4); // Max 4 digits
                }
                e.target.value = value;
                
                // Visual feedback
                this.validatePinInput(e.target);
            });
            
            // Generate PIN on paste (clean it up)
            customPinInput.addEventListener('paste', (e) => {
                setTimeout(() => {
                    let value = e.target.value.replace(/[^0-9]/g, '');
                    if (value.length > 4) {
                        value = value.substring(0, 4);
                    }
                    e.target.value = value;
                    this.validatePinInput(e.target);
                }, 10);
            });
        } else {
            console.error('❌ Custom PIN input not found');
        }
        
        console.log('🔐 PIN functionality set up');
    }
    
    validatePinInput(input) {
        const value = input.value;
        const isValid = /^[0-9]{4}$/.test(value);
        
        // Remove existing validation classes
        input.classList.remove('valid', 'invalid', 'partial');
        
        if (value.length === 0) {
            // Empty - neutral state
        } else if (value.length < 4) {
            // Too short - partial state
            input.classList.add('partial');
        } else if (isValid) {
            // Valid PIN
            input.classList.add('valid');
        } else {
            // Invalid
            input.classList.add('invalid');
        }
        
        return isValid;
    }
    
    setupFileUpload() {
        if (!this.videoUploadArea || !this.videoFileInput) return;
        
        // Drag and drop
        this.videoUploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.videoUploadArea.classList.add('dragover');
        });
        
        this.videoUploadArea.addEventListener('dragleave', () => {
            this.videoUploadArea.classList.remove('dragover');
        });
        
        this.videoUploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            this.videoUploadArea.classList.remove('dragover');
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleFileSelect(files[0]);
            }
        });
        
        // File input change
        this.videoFileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleFileSelect(e.target.files[0]);
            }
        });
        
        console.log('📁 File upload set up');
    }
    
    handleFileSelect(file) {
        try {
            // Validate file type
            const allowedTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/mkv', 'video/webm'];
            if (!allowedTypes.includes(file.type)) {
                this.showError('Please upload a valid video file (MP4, MOV, AVI, MKV, or WebM)');
                return;
            }
            
            // Validate file size (100MB)
            const maxSize = 100 * 1024 * 1024;
            if (file.size > maxSize) {
                this.showError('Video file is too large. Please upload a file smaller than 100MB.');
                return;
            }
            
            // Update UI
            const uploadContent = this.videoUploadArea.querySelector('.upload-content');
            uploadContent.innerHTML = `
                <div class="upload-icon">✅</div>
                <p class="upload-text">Video selected: ${file.name}</p>
                <p class="upload-help">Size: ${this.formatFileSize(file.size)}</p>
            `;
            
            console.log('📹 Video file selected:', file.name);
            
        } catch (error) {
            console.error('File selection error:', error);
            this.showError('Error selecting file. Please try again.');
        }
    }
    
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    setupRealTimeValidation() {
        // Add input event listeners for real-time validation
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                this.validateField(input);
                this.updateNavigationButtons();
            });
            
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
        });
    }
    
    validateField(field) {
        const value = field.value.trim();
        const isRequired = field.hasAttribute('required');
        
        // Remove existing validation classes
        field.classList.remove('valid', 'invalid');
        
        if (isRequired && !value) {
            field.classList.add('invalid');
            return false;
        } else if (value) {
            // Email validation
            if (field.type === 'email' && value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    field.classList.add('invalid');
                    return false;
                }
            }
            
            // PIN validation
            if (field.name === 'custom_pin' && value) {
                const pinRegex = /^[0-9]{4,6}$/;
                if (!pinRegex.test(value)) {
                    field.classList.add('invalid');
                    return false;
                }
                
                // Check for weak PINs
                const weakPins = ['0000', '1111', '2222', '3333', '4444', '5555', '6666', '7777', '8888', '9999', 
                                 '1234', '4321', '0123', '9876', '1122', '2211'];
                if (weakPins.includes(value)) {
                    field.classList.add('invalid');
                    return false;
                }
            }
            
            field.classList.add('valid');
            return true;
        }
        
        return true;
    }
    
    setupAutoSave() {
        // Save form data to localStorage
        const inputs = this.form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                this.saveFormData();
            });
        });
        
        // Load saved data
        this.loadFormData();
    }
    
    saveFormData() {
        try {
            const formData = new FormData(this.form);
            const data = {};
            
            for (let [key, value] of formData.entries()) {
                if (key !== 'video_file') { // Don't save file data
                    data[key] = value;
                }
            }
            
            localStorage.setItem('valentine_form_data', JSON.stringify(data));
        } catch (error) {
            console.warn('Failed to save form data:', error);
        }
    }
    
    loadFormData() {
        try {
            const savedData = localStorage.getItem('valentine_form_data');
            if (savedData) {
                const data = JSON.parse(savedData);
                
                Object.keys(data).forEach(key => {
                    const field = this.form.querySelector(`[name="${key}"]`);
                    if (field) {
                        if (field.type === 'radio') {
                            const radioField = this.form.querySelector(`[name="${key}"][value="${data[key]}"]`);
                            if (radioField) radioField.checked = true;
                        } else {
                            field.value = data[key];
                        }
                    }
                });
                
                console.log('📝 Form data loaded from localStorage');
            }
        } catch (error) {
            console.warn('Failed to load form data:', error);
        }
    }
    
    validateCurrentStep() {
        const requiredFields = this.requiredFields[this.currentStep] || [];
        let isValid = true;
        
        requiredFields.forEach(fieldName => {
            const field = this.form.querySelector(`[name="${fieldName}"]`);
            if (field && !this.validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    nextStep() {
        if (!this.validateCurrentStep()) {
            this.showError('Please fill in all required fields before continuing.');
            return;
        }
        
        if (this.currentStep < this.totalSteps) {
            this.currentStep++;
            this.showStep(this.currentStep);
            this.updateProgress();
            this.updateNavigationButtons();
        }
    }
    
    previousStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.showStep(this.currentStep);
            this.updateProgress();
            this.updateNavigationButtons();
        }
    }
    
    showStep(stepNumber) {
        console.log(`🔄 Showing step ${stepNumber}, current scroll position: ${window.pageYOffset}`);
        
        // Hide all steps
        this.steps.forEach(step => {
            step.classList.remove('active');
        });
        
        // Show current step
        const currentStep = document.querySelector(`[data-step="${stepNumber}"]`);
        if (currentStep) {
            currentStep.classList.add('active');
        }
        
        // Keep the user at the same scroll position - no scrolling at all
        console.log(`✅ Step ${stepNumber} shown, scroll position maintained: ${window.pageYOffset}`);
    }
    
    updateProgress() {
        const progress = (this.currentStep / this.totalSteps) * 100;
        
        if (this.progressFill) {
            this.progressFill.style.width = `${progress}%`;
        }
        
        // Update step indicators
        this.progressSteps.forEach((step, index) => {
            step.classList.remove('active', 'completed');
            
            if (index + 1 < this.currentStep) {
                step.classList.add('completed');
                step.textContent = '✓';
            } else if (index + 1 === this.currentStep) {
                step.classList.add('active');
                step.textContent = index + 1;
            } else {
                step.textContent = index + 1;
            }
        });
    }
    
    updateNavigationButtons() {
        // Previous button
        if (this.prevBtn) {
            this.prevBtn.style.display = this.currentStep > 1 ? 'block' : 'none';
        }
        
        // Next/Create button
        if (this.currentStep < this.totalSteps) {
            if (this.nextBtn) {
                this.nextBtn.style.display = 'block';
                this.nextBtn.disabled = !this.validateCurrentStep();
            }
            if (this.createBtn) {
                this.createBtn.style.display = 'none';
            }
        } else {
            if (this.nextBtn) {
                this.nextBtn.style.display = 'none';
            }
            if (this.createBtn) {
                this.createBtn.style.display = 'block';
                this.createBtn.disabled = !this.validateCurrentStep();
            }
        }
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        if (this.isSubmitting) return;
        
        if (!this.validateCurrentStep()) {
            this.showError('Please fill in all required fields.');
            return;
        }
        
        try {
            this.isSubmitting = true;
            this.showLoading(true);
            
            // Prepare form data
            const formData = new FormData(this.form);
            
            // Submit to server
            const response = await fetch('/create', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.showSuccess(result);
                this.clearFormData();
            } else {
                throw new Error(result.error || 'Failed to create experience');
            }
            
        } catch (error) {
            console.error('Submission error:', error);
            this.showError(error.message || 'Failed to create your Valentine\'s experience. Please try again.');
        } finally {
            this.isSubmitting = false;
            this.showLoading(false);
        }
    }
    
    showSuccess(result) {
        console.log('🎉 Success result received:', result);
        
        // Ensure modal elements are available before proceeding
        this.ensureModalElements();
        
        // Populate modal with results
        if (this.shareLinkInput) {
            this.shareLinkInput.value = result.url || '';
            console.log('📎 Link set:', result.url);
        } else {
            console.error('❌ Share link input not found');
        }
        
        // Handle PIN display with multiple fallback attempts
        if (result.access_pin) {
            const pinSetSuccess = this.setPinValue(result.access_pin);
            if (!pinSetSuccess) {
                console.error('❌ Failed to set PIN value, trying fallback methods');
                this.setPinValueFallback(result.access_pin);
            }
        } else {
            console.error('❌ No access_pin in result:', result);
        }
        
        // Set other modal content
        this.setModalContent(result);
        
        // Store for sharing
        this.experienceData = result;
        
        // Show modal with delay to ensure DOM is ready
        setTimeout(() => {
            if (this.successModal) {
                this.successModal.classList.add('active');
                console.log('✅ Success modal shown');
            } else {
                console.error('❌ Success modal not found');
            }
        }, 100);
        
        console.log('🎉 Experience created successfully:', result.unique_id, 'PIN:', result.access_pin);
    }
    
    ensureModalElements() {
        // Re-cache critical elements if they're missing
        if (!this.successModal) {
            this.successModal = document.getElementById('success-modal');
            console.log('🔄 Re-cached successModal:', !!this.successModal);
        }
        
        if (!this.accessPinInput) {
            this.accessPinInput = document.getElementById('access-pin');
            console.log('🔄 Re-cached accessPinInput:', !!this.accessPinInput);
        }
        
        if (!this.copyPinBtn) {
            this.copyPinBtn = document.getElementById('copy-pin-btn');
            console.log('🔄 Re-cached copyPinBtn:', !!this.copyPinBtn);
        }
        
        if (!this.shareLinkInput) {
            this.shareLinkInput = document.getElementById('share-link');
            console.log('🔄 Re-cached shareLinkInput:', !!this.shareLinkInput);
        }
    }
    
    setPinValue(pin) {
        if (this.accessPinInput) {
            this.accessPinInput.value = pin;
            console.log('🔐 PIN set via cached element:', pin);
            
            // Verify the value was set
            if (this.accessPinInput.value === pin) {
                console.log('✅ PIN value verified:', this.accessPinInput.value);
                return true;
            } else {
                console.error('❌ PIN value verification failed. Expected:', pin, 'Got:', this.accessPinInput.value);
                return false;
            }
        } else {
            console.error('❌ Cached accessPinInput not available');
            return false;
        }
    }
    
    setPinValueFallback(pin) {
        // Fallback method using direct DOM access
        const pinInput = document.getElementById('access-pin');
        if (pinInput) {
            pinInput.value = pin;
            console.log('🔐 PIN set via fallback method:', pin);
            
            // Force update the cached reference
            this.accessPinInput = pinInput;
            
            // Verify
            if (pinInput.value === pin) {
                console.log('✅ Fallback PIN value verified:', pinInput.value);
            } else {
                console.error('❌ Fallback PIN verification failed');
            }
        } else {
            console.error('❌ PIN input element not found in DOM');
            
            // Last resort: create error message
            this.showError('PIN display failed. Your PIN is: ' + pin + ' (please copy manually)');
        }
    }
    
    setModalContent(result) {
        const experienceIdElement = document.getElementById('experience-id');
        const recipientNameElement = document.getElementById('recipient-name-display');
        
        if (experienceIdElement) {
            experienceIdElement.textContent = result.unique_id || 'Unknown';
        }
        
        if (recipientNameElement) {
            const recipientNameInput = this.form.querySelector('[name="recipient_name"]');
            if (recipientNameInput) {
                recipientNameElement.textContent = recipientNameInput.value || 'Unknown';
            }
        }
    }
    
    showLoading(show) {
        if (this.loadingOverlay) {
            if (show) {
                this.loadingOverlay.classList.add('active');
            } else {
                this.loadingOverlay.classList.remove('active');
            }
        }
    }
    
    showError(message) {
        // Create or update error notification
        let errorNotification = document.getElementById('error-notification');
        
        if (!errorNotification) {
            errorNotification = document.createElement('div');
            errorNotification.id = 'error-notification';
            errorNotification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(239, 68, 68, 0.9);
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 12px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                z-index: 10000;
                max-width: 400px;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.2);
                animation: slideInRight 0.3s ease-out;
            `;
            document.body.appendChild(errorNotification);
        }
        
        errorNotification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span style="font-size: 1.2rem;">⚠️</span>
                <span>${message}</span>
            </div>
        `;
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            if (errorNotification.parentNode) {
                errorNotification.style.animation = 'slideOutRight 0.3s ease-out forwards';
                setTimeout(() => {
                    errorNotification.remove();
                }, 300);
            }
        }, 5000);
        
        // Add CSS animations
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                @keyframes slideOutRight {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    async copyShareLink() {
        try {
            // Use modern Clipboard API
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(this.shareLinkInput.value);
            } else {
                // Fallback for older browsers
                this.shareLinkInput.select();
                document.execCommand('copy');
            }
            
            // Update button text temporarily
            const originalText = this.copyLinkBtn.textContent;
            this.copyLinkBtn.textContent = '✅ Copied!';
            this.copyLinkBtn.style.background = 'var(--green-heart)';
            
            setTimeout(() => {
                this.copyLinkBtn.textContent = originalText;
                this.copyLinkBtn.style.background = '';
            }, 2000);
            
        } catch (error) {
            console.error('Copy failed:', error);
            this.showError('Failed to copy link. Please copy it manually.');
        }
    }
    
    async copyAccessPin() {
        try {
            // Ensure elements are available
            this.ensureModalElements();
            
            if (!this.accessPinInput || !this.copyPinBtn) {
                console.error('PIN elements not found:', {
                    accessPinInput: !!this.accessPinInput,
                    copyPinBtn: !!this.copyPinBtn
                });
                this.showError('PIN elements not available. Please copy the PIN manually.');
                return;
            }
            
            const pinValue = this.accessPinInput.value;
            if (!pinValue || pinValue === 'ERROR') {
                console.error('No valid PIN value to copy:', pinValue);
                this.showError('No valid PIN to copy. Please check the PIN display.');
                return;
            }
            
            console.log('📋 Attempting to copy PIN:', pinValue);
            
            // Use modern Clipboard API
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(pinValue);
                console.log('✅ PIN copied via Clipboard API');
            } else {
                // Fallback for older browsers
                this.accessPinInput.select();
                this.accessPinInput.setSelectionRange(0, 99999); // For mobile devices
                const success = document.execCommand('copy');
                if (!success) {
                    throw new Error('document.execCommand failed');
                }
                console.log('✅ PIN copied via legacy method');
            }
            
            // Update button text temporarily
            const originalText = this.copyPinBtn.textContent;
            this.copyPinBtn.textContent = '✅ Copied!';
            this.copyPinBtn.style.background = 'var(--green-heart, #28a745)';
            
            setTimeout(() => {
                this.copyPinBtn.textContent = originalText;
                this.copyPinBtn.style.background = '';
            }, 2000);
            
            console.log('📋 PIN copied successfully:', pinValue);
            
        } catch (error) {
            console.error('Copy PIN failed:', error);
            
            // Show error with the PIN value so user can copy manually
            const pinValue = this.accessPinInput ? this.accessPinInput.value : 'Unknown';
            this.showError(`Failed to copy PIN automatically. Please copy manually: ${pinValue}`);
        }
    }
    
    shareViaWhatsApp() {
        const recipientName = this.form.querySelector('[name="recipient_name"]').value;
        const message = `💕 I created something special for you! Check out this Valentine's Day experience: ${this.experienceData.url}\n\n🔐 Access PIN: ${this.experienceData.access_pin}\n\nYou'll need both the link and PIN to view it!`;
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    }
    
    shareViaEmail() {
        const recipientName = this.form.querySelector('[name="recipient_name"]').value;
        const creatorName = this.form.querySelector('[name="creator_name"]').value;
        const subject = `💕 A Valentine's Day Message from ${creatorName}`;
        const body = `Hi ${recipientName},\n\nI created a special Valentine's Day experience just for you!\n\nClick here to see it: ${this.experienceData.url}\n\n🔐 Access PIN: ${this.experienceData.access_pin}\n\nYou'll need both the link and PIN to view the experience.\n\nWith love,\n${creatorName} 💕`;
        
        const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailtoUrl;
    }
    
    shareViaSMS() {
        const message = `💕 I created something special for you! ${this.experienceData.url}\n\n🔐 PIN: ${this.experienceData.access_pin}\n\nYou need both to view it!`;
        const smsUrl = `sms:?body=${encodeURIComponent(message)}`;
        window.location.href = smsUrl;
    }
    
    createAnother() {
        // Reset form
        this.form.reset();
        this.currentStep = 1;
        this.showStep(1);
        this.updateProgress();
        this.updateNavigationButtons();
        
        // Close modal
        this.successModal.classList.remove('active');
        
        // Clear saved data
        this.clearFormData();
        
        // NO SCROLLING - let the user stay where they are
    }
    
    viewExperience() {
        if (this.experienceData && this.experienceData.url) {
            window.open(this.experienceData.url, '_blank');
        }
    }
    
    clearFormData() {
        try {
            localStorage.removeItem('valentine_form_data');
        } catch (error) {
            console.warn('Failed to clear form data:', error);
        }
    }
    
    // Debug method to test PIN elements
    debugPinElements() {
        console.log('🔍 DEBUG: PIN Elements Check');
        
        const elements = {
            successModal: document.getElementById('success-modal'),
            accessPinInput: document.getElementById('access-pin'),
            copyPinBtn: document.getElementById('copy-pin-btn'),
            shareLinkInput: document.getElementById('share-link'),
            copyLinkBtn: document.getElementById('copy-link-btn'),
            customPinInput: document.getElementById('custom_pin')
        };
        
        console.log('Elements found:', elements);
        
        // Test setting PIN value
        if (elements.accessPinInput) {
            elements.accessPinInput.value = 'TEST-1234';
            console.log('✅ Test PIN set:', elements.accessPinInput.value);
        }
        
        // Test custom PIN validation
        if (elements.customPinInput) {
            const testPin = '5678';
            elements.customPinInput.value = testPin;
            this.validatePinInput(elements.customPinInput);
            console.log('✅ Test custom PIN set and validated:', testPin);
        }
        
        // Test showing modal
        if (elements.successModal) {
            elements.successModal.classList.add('active');
            console.log('✅ Modal shown for testing');
            
            // Hide after 3 seconds
            setTimeout(() => {
                elements.successModal.classList.remove('active');
                console.log('✅ Modal hidden');
            }, 3000);
        }
        
        // Test copy functionality
        if (elements.copyPinBtn) {
            elements.copyPinBtn.click();
        }
        
        return elements;
    }
}

// Initialize the generator when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    try {
        window.valentineGenerator = new ValentineGenerator();
    } catch (error) {
        console.error('Failed to initialize Valentine Generator:', error);
    }
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ValentineGenerator;
}