/**
 * Typography Manager Module
 * Modular font and text styling system
 * 
 * @author patchyevole
 * @github https://github.com/patchyevolve
 */

class TypographyManager {
    constructor() {
        this.fontFamilies = {
            // Script & Handwritten - Simple and reliable
            script_elegant: {
                name: 'Dancing Script',
                family: '"Dancing Script", "Brush Script MT", cursive',
                category: 'script',
                description: 'Elegant flowing script for romantic messages',
                weight: '400',
                googleFont: 'Dancing+Script:400,700',
                previewText: 'I Love You Forever 💕'
            },
            script_casual: {
                name: 'Pacifico',
                family: '"Pacifico", "Bradley Hand", cursive',
                category: 'script',
                description: 'Casual friendly handwriting style',
                weight: '400',
                googleFont: 'Pacifico',
                previewText: 'You Make Me Happy 💕'
            },
            
            // Serif Fonts - Classic and elegant
            serif_classic: {
                name: 'Playfair Display',
                family: '"Playfair Display", "Times New Roman", serif',
                category: 'serif',
                description: 'Elegant classical serif for sophisticated messages',
                weight: '400',
                googleFont: 'Playfair+Display:400,700',
                previewText: 'My Dearest Love 💕'
            },
            serif_romantic: {
                name: 'Crimson Text',
                family: '"Crimson Text", "Georgia", serif',
                category: 'serif',
                description: 'Romantic book-style serif',
                weight: '400',
                googleFont: 'Crimson+Text:400,600',
                previewText: 'With All My Heart 💕'
            },
            
            // Sans Serif Fonts - Modern and clean
            sans_modern: {
                name: 'Poppins',
                family: '"Poppins", "Helvetica Neue", sans-serif',
                category: 'sans',
                description: 'Clean modern sans-serif',
                weight: '400',
                googleFont: 'Poppins:300,400,600',
                previewText: 'You Are Amazing 💕'
            },
            sans_elegant: {
                name: 'Montserrat',
                family: '"Montserrat", "Arial", sans-serif',
                category: 'sans',
                description: 'Sophisticated geometric sans-serif',
                weight: '400',
                googleFont: 'Montserrat:300,400,600',
                previewText: 'Be My Valentine 💕'
            },
            
            // Simple fallback fonts that always work
            classic_serif: {
                name: 'Times New Roman',
                family: '"Times New Roman", Times, serif',
                category: 'serif',
                description: 'Classic traditional serif font',
                weight: '400',
                googleFont: null,
                previewText: 'Classic Love Letter 💕'
            },
            classic_sans: {
                name: 'Arial',
                family: 'Arial, "Helvetica Neue", sans-serif',
                category: 'sans',
                description: 'Clean and readable sans-serif',
                weight: '400',
                googleFont: null,
                previewText: 'Simple & Beautiful 💕'
            }
        };

        this.textEffects = {
            glow: {
                name: 'Soft Glow',
                css: 'text-shadow: 0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor;'
            },
            shadow: {
                name: 'Drop Shadow',
                css: 'text-shadow: 2px 2px 4px rgba(0,0,0,0.3);'
            },
            outline: {
                name: 'Text Outline',
                css: '-webkit-text-stroke: 1px rgba(255,255,255,0.5); text-shadow: 0 0 2px rgba(0,0,0,0.5);'
            },
            gradient: {
                name: 'Gradient Text',
                css: 'background: linear-gradient(45deg, var(--primary-color), var(--secondary-color)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;'
            },
            emboss: {
                name: 'Embossed',
                css: 'text-shadow: 1px 1px 0px rgba(255,255,255,0.3), -1px -1px 0px rgba(0,0,0,0.3);'
            },
            neon: {
                name: 'Neon Glow',
                css: 'color: #fff; text-shadow: 0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor, 0 0 20px var(--accent-color);'
            }
        };

        this.animations = {
            typewriter: {
                name: 'Typewriter',
                class: 'text-typewriter',
                description: 'Types out text character by character'
            },
            fadeIn: {
                name: 'Fade In',
                class: 'text-fade-in',
                description: 'Gentle fade in animation'
            },
            slideUp: {
                name: 'Slide Up',
                class: 'text-slide-up',
                description: 'Slides up from below'
            },
            bounce: {
                name: 'Bounce In',
                class: 'text-bounce-in',
                description: 'Bounces in with spring effect'
            },
            glow: {
                name: 'Pulsing Glow',
                class: 'text-pulse-glow',
                description: 'Pulsing glow effect'
            },
            wave: {
                name: 'Wave',
                class: 'text-wave',
                description: 'Letters wave in sequence'
            }
        };

        this.loadedFonts = new Set();
    }

    /**
     * Load Google Fonts dynamically with better error handling
     */
    async loadGoogleFont(fontKey) {
        const font = this.fontFamilies[fontKey];
        if (!font || !font.googleFont || this.loadedFonts.has(fontKey)) {
            return Promise.resolve();
        }

        // Create a more reliable font loading approach
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = `https://fonts.googleapis.com/css2?family=${font.googleFont}&display=swap`;
        
        return new Promise((resolve) => {
            const timeout = setTimeout(() => {
                console.warn(`⚠️ Font loading timeout for: ${font.name} - using fallback`);
                resolve(); // Always resolve to not block UI
            }, 2000); // Shorter timeout for better UX
            
            link.onload = () => {
                clearTimeout(timeout);
                this.loadedFonts.add(fontKey);
                
                // Wait a bit for font to be ready
                setTimeout(resolve, 50);
            };
            
            link.onerror = (error) => {
                clearTimeout(timeout);
                console.warn(`⚠️ Font loading failed for: ${font.name} - using fallback`, error);
                resolve(); // Always resolve to not block UI
            };
            
            // Check if font is already loaded
            const existingLink = document.querySelector(`link[href*="${font.googleFont}"]`);
            if (existingLink) {
                this.loadedFonts.add(fontKey);
                resolve();
                return;
            }
            
            document.head.appendChild(link);
        });
    }

    /**
     * Apply typography to element
     */
    async applyTypography(element, options = {}) {
        const {
            fontKey = 'sans_modern',
            effect = null,
            animation = null,
            size = '1em',
            weight = null,
            lineHeight = '1.4',
            letterSpacing = 'normal'
        } = options;

        // Load font if needed
        try {
            await this.loadGoogleFont(fontKey);
        } catch (error) {
            console.warn(`⚠️ Font loading failed, using fallback for: ${fontKey}`, error);
        }

        const font = this.fontFamilies[fontKey];
        if (!font) return false;

        // Apply font family
        element.style.fontFamily = font.family;
        element.style.fontSize = size;
        element.style.fontWeight = weight || font.weight;
        element.style.lineHeight = lineHeight;
        element.style.letterSpacing = letterSpacing;

        // Apply text effect
        if (effect && this.textEffects[effect]) {
            const effectCSS = this.textEffects[effect].css;
            const styles = effectCSS.split(';').filter(s => s.trim());
            styles.forEach(style => {
                const [property, value] = style.split(':').map(s => s.trim());
                if (property && value) {
                    element.style.setProperty(property, value);
                }
            });
        }

        // Apply animation
        if (animation && this.animations[animation]) {
            element.classList.add(this.animations[animation].class);
        }

        return true;
    }

    /**
     * Create typewriter effect
     */
    createTypewriterEffect(element, text, options = {}) {
        const {
            speed = 50,
            cursor = true,
            onComplete = null
        } = options;

        element.textContent = '';
        if (cursor) {
            element.classList.add('typewriter-cursor');
        }

        let i = 0;
        const typeInterval = setInterval(() => {
            element.textContent += text[i];
            i++;

            if (i >= text.length) {
                clearInterval(typeInterval);
                if (cursor) {
                    setTimeout(() => {
                        element.classList.remove('typewriter-cursor');
                    }, 1000);
                }
                if (onComplete) onComplete();
            }
        }, speed);

        return typeInterval;
    }

    /**
     * Create wave text effect
     */
    createWaveEffect(element, text) {
        element.innerHTML = '';
        
        [...text].forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.cssText = `
                display: inline-block;
                animation: textWave 2s ease-in-out infinite;
                animation-delay: ${index * 0.1}s;
            `;
            element.appendChild(span);
        });
    }

    /**
     * Create font selector UI
     */
    createFontSelector(container, onSelect) {
        if (!container) return;

        container.innerHTML = '';
        
        // Create category tabs - only the working categories
        const categories = ['script', 'serif', 'sans'];
        const tabsContainer = document.createElement('div');
        tabsContainer.className = 'font-tabs';
        
        categories.forEach(category => {
            const tab = document.createElement('button');
            tab.type = 'button'; // Prevent form submission
            tab.className = 'font-tab';
            tab.textContent = category.charAt(0).toUpperCase() + category.slice(1);
            tab.dataset.category = category;
            
            tab.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent form submission
                container.querySelectorAll('.font-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.showFontsForCategory(container, category, onSelect);
            });
            
            tabsContainer.appendChild(tab);
        });
        
        container.appendChild(tabsContainer);
        
        // Create fonts container
        const fontsContainer = document.createElement('div');
        fontsContainer.className = 'fonts-container';
        container.appendChild(fontsContainer);
        
        // Show script category by default
        tabsContainer.querySelector('[data-category="script"]').click();
    }

    /**
     * Show fonts for specific category
     */
    showFontsForCategory(container, category, onSelect) {
        const fontsContainer = container.querySelector('.fonts-container');
        if (!fontsContainer) return;

        fontsContainer.innerHTML = '';
        
        const categoryFonts = Object.entries(this.fontFamilies)
            .filter(([key, font]) => font.category === category);
        
        categoryFonts.forEach(([key, font]) => {
            const fontItem = document.createElement('div');
            fontItem.className = 'font-item';
            
            const preview = document.createElement('div');
            preview.className = 'font-preview';
            preview.textContent = font.previewText || 'I Love You 💕';
            
            // Apply font styling immediately
            preview.style.cssText = `
                font-family: ${font.family};
                font-size: 20px;
                font-weight: ${font.weight};
                text-align: center;
                padding: 16px;
                background: rgba(255,255,255,0.1);
                border-radius: 8px;
                margin-bottom: 12px;
                min-height: 60px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                text-shadow: 0 1px 3px rgba(0,0,0,0.3);
                line-height: 1.2;
            `;
            
            const info = document.createElement('div');
            info.className = 'font-info';
            info.innerHTML = `
                <h4 style="margin: 0 0 4px 0; font-size: 16px; font-weight: 600; color: white;">${font.name}</h4>
                <p style="margin: 0; font-size: 13px; opacity: 0.9; line-height: 1.4; color: rgba(255,255,255,0.8);">${font.description}</p>
            `;
            
            fontItem.appendChild(preview);
            fontItem.appendChild(info);
            
            fontItem.addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                container.querySelectorAll('.font-item').forEach(item => 
                    item.classList.remove('selected'));
                fontItem.classList.add('selected');
                
                // Load Google Font if available
                if (font.googleFont) {
                    try {
                        await this.loadGoogleFont(key);
                        preview.style.fontFamily = font.family;
                    } catch (error) {
                        console.warn(`⚠️ Font loading failed for ${font.name}, using fallback`);
                    }
                }
                
                if (onSelect) onSelect(key, font);
            });
            
            fontsContainer.appendChild(fontItem);
            
            // Pre-load Google Fonts for better preview
            if (font.googleFont) {
                this.loadGoogleFont(key).then(() => {
                    preview.style.fontFamily = font.family;
                }).catch(() => {
                    // Fallback fonts will still work
                });
            }
        });
    }

    /**
     * Get available fonts by category
     */
    getFontsByCategory(category) {
        return Object.entries(this.fontFamilies)
            .filter(([key, font]) => font.category === category)
            .reduce((obj, [key, font]) => {
                obj[key] = font;
                return obj;
            }, {});
    }

    /**
     * Get all available effects
     */
    getTextEffects() {
        return this.textEffects;
    }

    /**
     * Get all available animations
     */
    getTextAnimations() {
        return this.animations;
    }
    
    /**
     * Get font configuration by key
     */
    getFontConfig(fontKey) {
        return this.fontFamilies[fontKey] || null;
    }
}

// Export for use in other modules
window.TypographyManager = TypographyManager;