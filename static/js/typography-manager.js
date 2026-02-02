/**
 * Typography Manager Module
 * Modular font and text styling system
 */

class TypographyManager {
    constructor() {
        this.fontFamilies = {
            // Script & Handwritten
            script_elegant: {
                name: 'Elegant Script',
                family: '"Dancing Script", "Brush Script MT", cursive',
                category: 'script',
                description: 'Flowing script font perfect for romantic messages',
                weight: '400',
                googleFont: 'Dancing+Script:400,700'
            },
            script_romantic: {
                name: 'Romantic Script',
                family: '"Great Vibes", "Lucida Handwriting", cursive',
                category: 'script',
                description: 'Romantic handwritten style',
                weight: '400',
                googleFont: 'Great+Vibes'
            },
            script_modern: {
                name: 'Modern Script',
                family: '"Pacifico", "Bradley Hand", cursive',
                category: 'script',
                description: 'Modern casual script',
                weight: '400',
                googleFont: 'Pacifico'
            },
            
            // Serif Fonts
            serif_classic: {
                name: 'Classic Serif',
                family: '"Playfair Display", "Times New Roman", serif',
                category: 'serif',
                description: 'Elegant classical serif',
                weight: '400',
                googleFont: 'Playfair+Display:400,700,400italic'
            },
            serif_romantic: {
                name: 'Romantic Serif',
                family: '"Crimson Text", "Georgia", serif',
                category: 'serif',
                description: 'Romantic book-style serif',
                weight: '400',
                googleFont: 'Crimson+Text:400,600,400italic'
            },
            serif_vintage: {
                name: 'Vintage Serif',
                family: '"Libre Baskerville", "Book Antiqua", serif',
                category: 'serif',
                description: 'Vintage newspaper style',
                weight: '400',
                googleFont: 'Libre+Baskerville:400,700,400italic'
            },
            
            // Sans Serif Fonts
            sans_modern: {
                name: 'Modern Sans',
                family: '"Poppins", "Helvetica Neue", sans-serif',
                category: 'sans',
                description: 'Clean modern sans-serif',
                weight: '400',
                googleFont: 'Poppins:300,400,600,700'
            },
            sans_elegant: {
                name: 'Elegant Sans',
                family: '"Montserrat", "Arial", sans-serif',
                category: 'sans',
                description: 'Sophisticated sans-serif',
                weight: '400',
                googleFont: 'Montserrat:300,400,500,600,700'
            },
            sans_friendly: {
                name: 'Friendly Sans',
                family: '"Open Sans", "Verdana", sans-serif',
                category: 'sans',
                description: 'Warm and friendly',
                weight: '400',
                googleFont: 'Open+Sans:300,400,600,700'
            },
            
            // Decorative Fonts
            decorative_fancy: {
                name: 'Fancy Decorative',
                family: '"Cinzel", "Papyrus", fantasy',
                category: 'decorative',
                description: 'Ornate decorative font',
                weight: '400',
                googleFont: 'Cinzel:400,600'
            },
            decorative_modern: {
                name: 'Modern Decorative',
                family: '"Raleway", "Impact", sans-serif',
                category: 'decorative',
                description: 'Modern stylish display',
                weight: '300',
                googleFont: 'Raleway:300,400,500,600,700'
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
     * Load Google Fonts dynamically
     */
    async loadGoogleFont(fontKey) {
        const font = this.fontFamilies[fontKey];
        if (!font || !font.googleFont || this.loadedFonts.has(fontKey)) {
            return;
        }

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = `https://fonts.googleapis.com/css2?family=${font.googleFont}&display=swap`;
        
        return new Promise((resolve, reject) => {
            link.onload = () => {
                this.loadedFonts.add(fontKey);
                resolve();
            };
            link.onerror = reject;
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
        await this.loadGoogleFont(fontKey);

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
        
        // Create category tabs
        const categories = ['script', 'serif', 'sans', 'decorative'];
        const tabsContainer = document.createElement('div');
        tabsContainer.className = 'font-tabs';
        
        categories.forEach(category => {
            const tab = document.createElement('button');
            tab.className = 'font-tab';
            tab.textContent = category.charAt(0).toUpperCase() + category.slice(1);
            tab.dataset.category = category;
            
            tab.addEventListener('click', () => {
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
            preview.textContent = 'Love is in the air 💕';
            preview.style.fontFamily = font.family;
            
            const info = document.createElement('div');
            info.className = 'font-info';
            info.innerHTML = `
                <h4>${font.name}</h4>
                <p>${font.description}</p>
            `;
            
            fontItem.appendChild(preview);
            fontItem.appendChild(info);
            
            fontItem.addEventListener('click', async () => {
                container.querySelectorAll('.font-item').forEach(item => 
                    item.classList.remove('selected'));
                fontItem.classList.add('selected');
                
                await this.loadGoogleFont(key);
                if (onSelect) onSelect(key, font);
            });
            
            fontsContainer.appendChild(fontItem);
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
}

// Export for use in other modules
window.TypographyManager = TypographyManager;