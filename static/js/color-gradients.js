/**
 * Enhanced Color Gradients Module
 * Modular system for managing expanded color palettes
 * 
 * @author patchyevole
 * @github https://github.com/patchyevolve
 */

class ColorGradientManager {
    constructor() {
        this.gradients = {
            // Original gradients (keeping existing)
            romantic_pink: {
                name: 'Romantic Pink',
                primary: '#ff6b9d',
                secondary: '#c44569',
                accent: '#f8b500',
                background: 'linear-gradient(135deg, #ff6b9d 0%, #c44569 50%, #f8b500 100%)',
                description: 'Classic romantic pink with warm accents',
                category: 'romantic'
            },
            sunset_orange: {
                name: 'Sunset Orange',
                primary: '#ff9a56',
                secondary: '#fd79a8',
                accent: '#fdcb6e',
                background: 'linear-gradient(135deg, #ff9a56 0%, #ff6b9d 50%, #c44569 100%)',
                description: 'Warm sunset colors with orange and pink',
                category: 'romantic'
            },
            purple_dream: {
                name: 'Purple Dream',
                primary: '#a29bfe',
                secondary: '#6c5ce7',
                accent: '#fd79a8',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #a29bfe 100%)',
                description: 'Dreamy purple with mystical vibes',
                category: 'mystical'
            },
            ocean_blue: {
                name: 'Ocean Blue',
                primary: '#74b9ff',
                secondary: '#0984e3',
                accent: '#00cec9',
                background: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 50%, #00cec9 100%)',
                description: 'Calming ocean blues and teals',
                category: 'nature'
            },
            forest_green: {
                name: 'Forest Green',
                primary: '#00b894',
                secondary: '#00a085',
                accent: '#55a3ff',
                background: 'linear-gradient(135deg, #00b894 0%, #55a3ff 50%, #667eea 100%)',
                description: 'Natural forest greens with sky blue',
                category: 'nature'
            },
            golden_hour: {
                name: 'Golden Hour',
                primary: '#fdcb6e',
                secondary: '#f39c12',
                accent: '#ff7675',
                background: 'linear-gradient(135deg, #fdcb6e 0%, #f39c12 50%, #ff7675 100%)',
                description: 'Warm golden tones like sunset',
                category: 'romantic'
            },

            // NEW ENHANCED GRADIENTS
            neon_cyberpunk: {
                name: 'Neon Cyberpunk',
                primary: '#ff0080',
                secondary: '#00ffff',
                accent: '#ff4081',
                background: 'linear-gradient(135deg, #ff0080 0%, #7928ca 30%, #00ffff 70%, #ff4081 100%)',
                description: 'Electric neon colors with cyberpunk vibes',
                category: 'modern'
            },
            pastel_rainbow: {
                name: 'Pastel Rainbow',
                primary: '#ffeaa7',
                secondary: '#fab1a0',
                accent: '#fd79a8',
                background: 'linear-gradient(135deg, #ffeaa7 0%, #fab1a0 25%, #fd79a8 50%, #a29bfe 75%, #74b9ff 100%)',
                description: 'Soft pastel rainbow with dreamy colors',
                category: 'dreamy'
            },
            dark_gothic: {
                name: 'Dark Gothic',
                primary: '#2d3436',
                secondary: '#636e72',
                accent: '#e17055',
                background: 'linear-gradient(135deg, #2d3436 0%, #636e72 50%, #e17055 100%)',
                description: 'Dark romantic with gothic elegance',
                category: 'dramatic'
            },
            metallic_gold: {
                name: 'Metallic Gold',
                primary: '#f39c12',
                secondary: '#d35400',
                accent: '#fdcb6e',
                background: 'linear-gradient(135deg, #f39c12 0%, #d35400 30%, #fdcb6e 70%, #f1c40f 100%)',
                description: 'Luxurious metallic gold with bronze',
                category: 'luxury'
            },
            metallic_silver: {
                name: 'Metallic Silver',
                primary: '#95a5a6',
                secondary: '#7f8c8d',
                accent: '#bdc3c7',
                background: 'linear-gradient(135deg, #95a5a6 0%, #7f8c8d 50%, #bdc3c7 100%)',
                description: 'Elegant metallic silver tones',
                category: 'luxury'
            },
            tropical_sunset: {
                name: 'Tropical Sunset',
                primary: '#ff7675',
                secondary: '#fd79a8',
                accent: '#fdcb6e',
                background: 'linear-gradient(135deg, #ff7675 0%, #fd79a8 25%, #fdcb6e 50%, #e17055 75%, #d63031 100%)',
                description: 'Vibrant tropical sunset colors',
                category: 'tropical'
            },
            winter_ice: {
                name: 'Winter Ice',
                primary: '#74b9ff',
                secondary: '#0984e3',
                accent: '#ddd',
                background: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 30%, #ddd 70%, #b2bec3 100%)',
                description: 'Cool winter ice with crystal blues',
                category: 'winter'
            },
            cherry_blossom: {
                name: 'Cherry Blossom',
                primary: '#fd79a8',
                secondary: '#fdcb6e',
                accent: '#fab1a0',
                background: 'linear-gradient(135deg, #fd79a8 0%, #fdcb6e 30%, #fab1a0 70%, #ffeaa7 100%)',
                description: 'Soft cherry blossom pink and cream',
                category: 'nature'
            },
            midnight_aurora: {
                name: 'Midnight Aurora',
                primary: '#00b894',
                secondary: '#00cec9',
                accent: '#a29bfe',
                background: 'linear-gradient(135deg, #2d3436 0%, #00b894 30%, #00cec9 60%, #a29bfe 100%)',
                description: 'Northern lights over midnight sky',
                category: 'mystical'
            },
            rose_gold: {
                name: 'Rose Gold',
                primary: '#e84393',
                secondary: '#fd79a8',
                accent: '#fdcb6e',
                background: 'linear-gradient(135deg, #e84393 0%, #fd79a8 40%, #fdcb6e 80%, #f39c12 100%)',
                description: 'Elegant rose gold with warm tones',
                category: 'luxury'
            }
        };

        this.categories = {
            romantic: 'Romantic',
            mystical: 'Mystical',
            nature: 'Nature',
            modern: 'Modern',
            dreamy: 'Dreamy',
            dramatic: 'Dramatic',
            luxury: 'Luxury',
            tropical: 'Tropical',
            winter: 'Winter'
        };
    }

    /**
     * Get all gradients
     */
    getAllGradients() {
        return this.gradients;
    }

    /**
     * Get gradients by category
     */
    getGradientsByCategory(category) {
        return Object.entries(this.gradients)
            .filter(([key, gradient]) => gradient.category === category)
            .reduce((obj, [key, gradient]) => {
                obj[key] = gradient;
                return obj;
            }, {});
    }

    /**
     * Get gradient by key
     */
    getGradient(key) {
        return this.gradients[key] || null;
    }

    /**
     * Apply gradient to element
     */
    applyGradient(element, gradientKey) {
        const gradient = this.getGradient(gradientKey);
        if (!gradient || !element) return false;

        element.style.background = gradient.background;
        element.style.setProperty('--primary-color', gradient.primary);
        element.style.setProperty('--secondary-color', gradient.secondary);
        element.style.setProperty('--accent-color', gradient.accent);

        return true;
    }

    /**
     * Generate gradient preview
     */
    generatePreview(gradientKey, size = '100px') {
        const gradient = this.getGradient(gradientKey);
        if (!gradient) return null;

        const preview = document.createElement('div');
        preview.style.width = size;
        preview.style.height = size;
        preview.style.background = gradient.background;
        preview.style.borderRadius = '8px';
        preview.style.border = '2px solid rgba(255,255,255,0.2)';
        preview.className = 'gradient-preview';

        return preview;
    }

    /**
     * Create gradient selector UI
     */
    createGradientSelector(container, onSelect) {
        if (!container) return;

        container.innerHTML = '';
        
        // Create category tabs
        const tabsContainer = document.createElement('div');
        tabsContainer.className = 'gradient-tabs';
        
        Object.entries(this.categories).forEach(([key, name]) => {
            const tab = document.createElement('button');
            tab.className = 'gradient-tab';
            tab.textContent = name;
            tab.dataset.category = key;
            
            tab.addEventListener('click', () => {
                // Update active tab
                container.querySelectorAll('.gradient-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Show gradients for this category
                this.showGradientsForCategory(container, key, onSelect);
            });
            
            tabsContainer.appendChild(tab);
        });
        
        container.appendChild(tabsContainer);
        
        // Create gradients container
        const gradientsContainer = document.createElement('div');
        gradientsContainer.className = 'gradients-container';
        container.appendChild(gradientsContainer);
        
        // Show romantic category by default
        tabsContainer.querySelector('[data-category="romantic"]').click();
    }

    /**
     * Show gradients for specific category
     */
    showGradientsForCategory(container, category, onSelect) {
        const gradientsContainer = container.querySelector('.gradients-container');
        if (!gradientsContainer) return;

        gradientsContainer.innerHTML = '';
        
        const categoryGradients = this.getGradientsByCategory(category);
        
        Object.entries(categoryGradients).forEach(([key, gradient]) => {
            const gradientItem = document.createElement('div');
            gradientItem.className = 'gradient-item';
            
            const preview = this.generatePreview(key, '60px');
            const info = document.createElement('div');
            info.className = 'gradient-info';
            info.innerHTML = `
                <h4>${gradient.name}</h4>
                <p>${gradient.description}</p>
            `;
            
            gradientItem.appendChild(preview);
            gradientItem.appendChild(info);
            
            gradientItem.addEventListener('click', () => {
                // Update selection
                container.querySelectorAll('.gradient-item').forEach(item => 
                    item.classList.remove('selected'));
                gradientItem.classList.add('selected');
                
                if (onSelect) onSelect(key, gradient);
            });
            
            gradientsContainer.appendChild(gradientItem);
        });
    }
}

// Export for use in other modules
window.ColorGradientManager = ColorGradientManager;