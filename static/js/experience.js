/**
 * Valentine's Day Experience - Interactive JavaScript
 * Handles the complete Valentine's experience flow with smooth transitions
 * 
 * @author patchyevole
 * @github https://github.com/patchyevolve
 */

class ValentineExperience {
    constructor() {
        this.currentState = 'loading';
        this.states = ['loading', 'welcome', 'personal-message', 'memory-reveal', 'question-state', 'decision-state'];
        this.stateIndex = 0;
        this.isTransitioning = false;
        this.experienceData = window.EXPERIENCE_DATA || {};
        
        // Initialize enhancement managers
        this.colorManager = new ColorGradientManager();
        this.particleManager = new ParticleSystemManager();
        this.svgManager = new SVGAnimationManager();
        this.typographyManager = new TypographyManager();
        
        this.init();
    }
    
    init() {
        console.log('💕 Initializing Valentine Experience...');
        
        try {
            this.cacheElements();
            this.setupEventListeners();
            this.initializeEnhancements();
            this.startExperience();
            
            console.log('✨ Experience initialized successfully');
        } catch (error) {
            console.error('💔 Experience initialization failed:', error);
            this.handleError('Failed to load the experience. Please refresh the page.');
        }
    }
    
    cacheElements() {
        // State containers
        this.stateContainers = {
            loading: document.getElementById('loading'),
            welcome: document.getElementById('welcome'),
            'personal-message': document.getElementById('personal-message'),
            'memory-reveal': document.getElementById('memory-reveal'),
            'question-state': document.getElementById('question-state'),
            'decision-state': document.getElementById('decision-state'),
            'confirmation-state': document.getElementById('confirmation-state'),
            'gentle-exit-state': document.getElementById('gentle-exit-state')
        };
        
        // Interactive elements
        this.decisionButtons = document.querySelectorAll('.decision-btn');
        this.video = document.getElementById('valentine-video');
        this.videoOverlay = document.getElementById('video-overlay');
        this.progressIndicator = document.getElementById('progress-indicator');
        this.announcements = document.getElementById('announcements');
        
        // Filter out states that don't exist (like memory if not provided)
        this.availableStates = Object.keys(this.stateContainers).filter(state => 
            this.stateContainers[state] !== null
        );
        
        console.log('📋 Elements cached, available states:', this.availableStates);
    }
    
    setupEventListeners() {
        // Welcome screen click
        const welcomeContainer = this.stateContainers.welcome;
        if (welcomeContainer) {
            welcomeContainer.addEventListener('click', () => {
                if (this.currentState === 'welcome') {
                    this.nextState();
                }
            });
        }
        
        // Decision buttons
        this.decisionButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const choice = e.currentTarget.dataset.choice;
                this.handleDecision(choice);
            });
        });
        
        // Video events
        if (this.video) {
            this.video.addEventListener('loadedmetadata', () => {
                console.log('📹 Video loaded successfully');
            });
            
            this.video.addEventListener('ended', () => {
                this.showVideoOverlay();
            });
            
            this.video.addEventListener('error', (e) => {
                console.error('Video error:', e);
                this.handleVideoError();
            });
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            this.handleKeyboard(e);
        });
        
        // Scroll handling for message states
        this.setupScrollHandling();
        
        console.log('🎯 Event listeners set up');
    }
    
    initializeEnhancements() {
        console.log('🎨 Initializing enhancements...');
        
        // Apply font style
        if (this.experienceData.font_style) {
            this.applyFontStyle(this.experienceData.font_style);
        }
        
        // Apply text effects
        if (this.experienceData.text_effect && this.experienceData.text_effect !== 'none') {
            this.applyTextEffect(this.experienceData.text_effect);
        }
        
        // Initialize background effects
        this.initializeBackgroundEffects();
        
        console.log('✨ Enhancements initialized');
    }
    
    async applyFontStyle(fontKey) {
        try {
            const textElements = document.querySelectorAll('.message-text, .creator-name, .recipient-name, .question-text, .memory-text');
            
            await this.typographyManager.loadGoogleFont(fontKey);
            
            textElements.forEach(element => {
                this.typographyManager.applyTypography(element, {
                    fontKey: fontKey,
                    animation: this.experienceData.text_animation || 'fade_in'
                });
            });
            
            console.log('🔤 Font style applied:', fontKey);
        } catch (error) {
            console.error('Font application error:', error);
        }
    }
    
    applyTextEffect(effectType) {
        const textElements = document.querySelectorAll('.message-text, .question-text');
        
        textElements.forEach(element => {
            element.classList.add(`text-${effectType}`);
        });
        
        console.log('✨ Text effect applied:', effectType);
    }
    
    initializeBackgroundEffects() {
        const backgroundContainer = document.querySelector('.experience-container');
        if (!backgroundContainer) return;
        
        const backgroundStyle = this.experienceData.background_style;
        
        // Handle particle systems
        if (['hearts', 'stars', 'petals', 'fireflies', 'bubbles'].includes(backgroundStyle)) {
            this.particleManager.startSystem(backgroundStyle, backgroundContainer, {
                count: this.getParticleCount(backgroundStyle)
            });
        }
        
        // Handle SVG animations
        if (backgroundStyle && backgroundStyle.startsWith('svg_')) {
            const animationType = backgroundStyle.replace('svg_', '');
            this.svgManager.startAnimation(animationType, backgroundContainer, {
                count: this.getSVGCount(animationType)
            });
        }
        
        console.log('🎭 Background effects initialized:', backgroundStyle);
    }
    
    getParticleCount(type) {
        const counts = {
            hearts: 12,
            stars: 25,
            petals: 15,
            fireflies: 18,
            bubbles: 10
        };
        return counts[type] || 15;
    }
    
    getSVGCount(type) {
        const counts = {
            hearts: 6,
            waves: 3,
            shapes: 8,
            nature: 5
        };
        return counts[type] || 6;
    }
    
    setupScrollHandling() {
        let scrollTimeout;
        
        document.addEventListener('wheel', (e) => {
            if (this.isTransitioning) return;
            
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                if (this.canScrollToNext()) {
                    if (e.deltaY > 0) {
                        this.nextState();
                    }
                }
            }, 150);
        });
        
        // Touch handling for mobile
        let touchStartY = 0;
        let touchEndY = 0;
        
        document.addEventListener('touchstart', (e) => {
            touchStartY = e.changedTouches[0].screenY;
        });
        
        document.addEventListener('touchend', (e) => {
            if (this.isTransitioning) return;
            
            touchEndY = e.changedTouches[0].screenY;
            const swipeDistance = touchStartY - touchEndY;
            
            if (Math.abs(swipeDistance) > 50 && this.canScrollToNext()) {
                if (swipeDistance > 0) {
                    this.nextState();
                }
            }
        });
    }
    
    canScrollToNext() {
        return ['personal-message', 'memory-reveal', 'question-state'].includes(this.currentState);
    }
    
    handleKeyboard(e) {
        if (this.isTransitioning) return;
        
        switch (e.key) {
            case ' ':
            case 'Enter':
                if (this.currentState === 'welcome') {
                    e.preventDefault();
                    this.nextState();
                }
                break;
            case 'ArrowDown':
                if (this.canScrollToNext()) {
                    e.preventDefault();
                    this.nextState();
                }
                break;
        }
    }
    
    async startExperience() {
        // Show loading state
        this.showState('loading');
        
        // Simulate loading time for dramatic effect
        await this.delay(3000);
        
        // Transition to welcome
        this.transitionTo('welcome');
    }
    
    showState(stateName) {
        // Hide all states
        Object.values(this.stateContainers).forEach(container => {
            if (container) {
                container.classList.remove('active');
            }
        });
        
        // Show target state
        const targetContainer = this.stateContainers[stateName];
        if (targetContainer) {
            targetContainer.classList.add('active');
            this.currentState = stateName;
            
            // Update progress
            this.updateProgress();
            
            // Announce to screen readers
            this.announceState(stateName);
            
            console.log(`🎭 Showing state: ${stateName}`);
        }
    }
    
    async transitionTo(stateName) {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        
        try {
            // Fade out current state
            const currentContainer = this.stateContainers[this.currentState];
            if (currentContainer) {
                currentContainer.style.transition = 'opacity 0.5s ease-out';
                currentContainer.style.opacity = '0';
            }
            
            await this.delay(500);
            
            // Show new state
            this.showState(stateName);
            
            // Fade in new state
            const newContainer = this.stateContainers[stateName];
            if (newContainer) {
                newContainer.style.opacity = '0';
                newContainer.style.transition = 'opacity 0.5s ease-out';
                
                // Force reflow
                newContainer.offsetHeight;
                
                newContainer.style.opacity = '1';
            }
            
            await this.delay(500);
            
            // Reset styles
            Object.values(this.stateContainers).forEach(container => {
                if (container) {
                    container.style.transition = '';
                    container.style.opacity = '';
                }
            });
            
        } catch (error) {
            console.error('Transition error:', error);
        } finally {
            this.isTransitioning = false;
        }
    }
    
    nextState() {
        if (this.isTransitioning) return;
        
        const currentIndex = this.availableStates.indexOf(this.currentState);
        
        if (currentIndex < this.availableStates.length - 1) {
            const nextState = this.availableStates[currentIndex + 1];
            this.transitionTo(nextState);
        } else if (this.currentState === 'question-state') {
            this.transitionTo('decision-state');
        }
    }
    
    handleDecision(choice) {
        console.log(`💝 Decision made: ${choice}`);
        
        // Add visual feedback
        const clickedBtn = document.querySelector(`[data-choice="${choice}"]`);
        if (clickedBtn) {
            clickedBtn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                clickedBtn.style.transform = '';
            }, 150);
        }
        
        switch (choice) {
            case 'yes':
                this.handleYesResponse();
                break;
            case 'maybe':
                this.handleMaybeResponse();
                break;
            case 'friends':
                this.handleFriendsResponse();
                break;
        }
    }
    
    async handleYesResponse() {
        console.log('🎉 YES response - showing confirmation');
        
        // Show celebration or video
        await this.transitionTo('confirmation-state');
        
        if (this.video && this.experienceData.has_video) {
            // Start video playback
            try {
                this.video.muted = false; // Unmute for user interaction
                await this.video.play();
                console.log('📹 Video playing');
            } catch (error) {
                console.error('Video play error:', error);
                this.handleVideoError();
            }
        }
        
        // Track the positive response
        this.trackEvent('decision', 'yes');
    }
    
    async handleMaybeResponse() {
        console.log('💭 MAYBE response - showing gentle message');
        
        // Update exit message for "maybe" response
        const exitMessage = document.getElementById('exit-message');
        if (exitMessage) {
            exitMessage.innerHTML = `
                <p>Take all the time you need, ${this.experienceData.recipient_name}.</p>
                <p>${this.experienceData.creator_name} will be here when you're ready.</p>
                <p>Sometimes the best things are worth waiting for. ✨</p>
            `;
        }
        
        await this.transitionTo('gentle-exit-state');
        this.trackEvent('decision', 'maybe');
    }
    
    async handleFriendsResponse() {
        console.log('🤗 FRIENDS response - showing understanding message');
        
        // Update exit message for "friends" response
        const exitMessage = document.getElementById('exit-message');
        if (exitMessage) {
            exitMessage.innerHTML = `
                <p>Friendship is a beautiful thing, ${this.experienceData.recipient_name}.</p>
                <p>${this.experienceData.creator_name} values your honesty and your friendship.</p>
                <p>The best relationships are built on understanding and respect. 🤗</p>
            `;
        }
        
        await this.transitionTo('gentle-exit-state');
        this.trackEvent('decision', 'friends');
    }
    
    showVideoOverlay() {
        if (this.videoOverlay) {
            this.videoOverlay.classList.add('show');
            
            // Hide overlay after 3 seconds
            setTimeout(() => {
                this.videoOverlay.classList.remove('show');
            }, 3000);
        }
    }
    
    handleVideoError() {
        console.error('Video failed to load or play');
        
        // Show fallback celebration
        const confirmationContainer = this.stateContainers['confirmation-state'];
        if (confirmationContainer) {
            confirmationContainer.innerHTML = `
                <div class="celebration-container">
                    <div class="celebration-content">
                        <h2 class="celebration-title">🎉 YES! 🎉</h2>
                        <p class="celebration-message">You've made ${this.experienceData.creator_name} the happiest person in the world!</p>
                        <p class="celebration-subtitle">This is the beginning of something beautiful ❤️</p>
                        <div class="celebration-hearts">
                            💕 Happy Valentine's Day! 💕
                        </div>
                    </div>
                </div>
            `;
        }
    }
    
    updateProgress() {
        if (!this.progressIndicator) return;
        
        const totalStates = this.availableStates.length;
        const currentIndex = this.availableStates.indexOf(this.currentState);
        const progress = ((currentIndex + 1) / totalStates) * 100;
        
        const progressFill = this.progressIndicator.querySelector('.progress-fill');
        if (progressFill) {
            progressFill.style.width = `${progress}%`;
        }
        
        // Show progress indicator during main flow
        if (['personal-message', 'memory-reveal', 'question-state'].includes(this.currentState)) {
            this.progressIndicator.classList.add('show');
        } else {
            this.progressIndicator.classList.remove('show');
        }
    }
    
    announceState(stateName) {
        if (!this.announcements) return;
        
        const announcements = {
            loading: 'Loading your Valentine\'s experience',
            welcome: `Welcome ${this.experienceData.recipient_name}`,
            'personal-message': 'Personal message from your Valentine',
            'memory-reveal': 'A special memory to share',
            'question-state': 'An important question',
            'decision-state': 'Time to make your choice',
            'confirmation-state': 'Celebrating your response',
            'gentle-exit-state': 'Thank you for your honesty'
        };
        
        this.announcements.textContent = announcements[stateName] || '';
    }
    
    trackEvent(category, action) {
        try {
            // Send analytics event to server
            fetch('/api/track', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    experience_id: this.experienceData.unique_id,
                    category: category,
                    action: action,
                    timestamp: new Date().toISOString()
                })
            }).catch(error => {
                console.warn('Analytics tracking failed:', error);
            });
        } catch (error) {
            console.warn('Analytics error:', error);
        }
    }
    
    handleError(message) {
        console.error('Experience error:', message);
        
        // Show error state
        document.body.innerHTML = `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100vh;
                background: linear-gradient(135deg, #ff6b9d 0%, #fd79a8 50%, #fdcb6e 100%);
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 2rem;
                font-family: 'Inter', sans-serif;
            ">
                <div style="
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(20px);
                    border-radius: 24px;
                    padding: 3rem;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                    text-align: center;
                    max-width: 500px;
                ">
                    <h1 style="
                        font-size: 2rem;
                        color: white;
                        margin-bottom: 1rem;
                        font-family: 'Playfair Display', serif;
                    ">💔 Oops!</h1>
                    <p style="
                        color: rgba(255, 255, 255, 0.9);
                        font-size: 1.1rem;
                        line-height: 1.6;
                        margin-bottom: 2rem;
                    ">${message}</p>
                    <button onclick="window.location.reload()" style="
                        background: linear-gradient(135deg, #ff6b9d, #fd79a8);
                        color: white;
                        border: none;
                        padding: 0.75rem 2rem;
                        border-radius: 50px;
                        font-size: 1rem;
                        font-weight: 600;
                        cursor: pointer;
                        transition: transform 0.2s ease;
                    " onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
                        Try Again
                    </button>
                </div>
            </div>
        `;
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize experience when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Add some dramatic flair with a slight delay
        setTimeout(() => {
            window.valentineExperience = new ValentineExperience();
        }, 500);
    } catch (error) {
        console.error('Failed to initialize Valentine Experience:', error);
        
        // Fallback error handling
        document.body.innerHTML = `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100vh;
                background: linear-gradient(135deg, #ff6b9d 0%, #fd79a8 50%, #fdcb6e 100%);
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 2rem;
                font-family: Arial, sans-serif;
            ">
                <div style="
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(20px);
                    border-radius: 24px;
                    padding: 3rem;
                    text-align: center;
                    color: white;
                ">
                    <h1>💔 Something went wrong</h1>
                    <p>But love always finds a way! Please refresh the page.</p>
                    <button onclick="window.location.reload()" style="
                        background: #ff6b9d;
                        color: white;
                        border: none;
                        padding: 1rem 2rem;
                        border-radius: 50px;
                        margin-top: 1rem;
                        cursor: pointer;
                    ">Refresh Page</button>
                </div>
            </div>
        `;
    }
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ValentineExperience;
}