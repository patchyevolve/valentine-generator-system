/**
 * Advanced Particle Systems Module
 * Modular particle effects for enhanced backgrounds
 * 
 * @author patchyevole
 * @github https://github.com/patchyevolve
 */

class ParticleSystemManager {
    constructor() {
        this.systems = {};
        this.activeSystem = null;
        this.animationFrame = null;
    }

    /**
     * Heart Rain Particle System
     */
    createHeartRain(container, options = {}) {
        const config = {
            count: options.count || 15,
            speed: options.speed || 2,
            size: options.size || 20,
            colors: options.colors || ['#ff6b9d', '#fd79a8', '#ff7675'],
            ...options
        };

        const particles = [];
        
        for (let i = 0; i < config.count; i++) {
            const heart = document.createElement('div');
            heart.className = 'particle-heart';
            heart.innerHTML = '💖';
            heart.style.cssText = `
                position: absolute;
                font-size: ${config.size + Math.random() * 10}px;
                color: ${config.colors[Math.floor(Math.random() * config.colors.length)]};
                pointer-events: none;
                z-index: 1;
                opacity: ${0.6 + Math.random() * 0.4};
                animation: heartFloat ${3 + Math.random() * 2}s infinite ease-in-out;
            `;
            
            this.resetHeartPosition(heart, container);
            container.appendChild(heart);
            
            particles.push({
                element: heart,
                speed: config.speed + Math.random() * 2,
                sway: Math.random() * 2 - 1
            });
        }

        return {
            particles,
            update: () => this.updateHeartRain(particles, container),
            destroy: () => particles.forEach(p => p.element.remove())
        };
    }

    resetHeartPosition(heart, container) {
        heart.style.left = Math.random() * container.offsetWidth + 'px';
        heart.style.top = -50 + 'px';
    }

    updateHeartRain(particles, container) {
        particles.forEach(particle => {
            const currentTop = parseFloat(particle.element.style.top);
            const currentLeft = parseFloat(particle.element.style.left);
            
            particle.element.style.top = (currentTop + particle.speed) + 'px';
            particle.element.style.left = (currentLeft + particle.sway) + 'px';
            
            if (currentTop > container.offsetHeight) {
                this.resetHeartPosition(particle.element, container);
            }
        });
    }

    /**
     * Starfield Particle System
     */
    createStarfield(container, options = {}) {
        const config = {
            count: options.count || 50,
            twinkleSpeed: options.twinkleSpeed || 2000,
            colors: options.colors || ['#ffffff', '#ffeaa7', '#74b9ff', '#fd79a8'],
            ...options
        };

        const particles = [];
        
        for (let i = 0; i < config.count; i++) {
            const star = document.createElement('div');
            star.className = 'particle-star';
            star.style.cssText = `
                position: absolute;
                width: ${2 + Math.random() * 4}px;
                height: ${2 + Math.random() * 4}px;
                background: ${config.colors[Math.floor(Math.random() * config.colors.length)]};
                border-radius: 50%;
                pointer-events: none;
                z-index: 1;
                box-shadow: 0 0 6px currentColor;
                animation: twinkle ${config.twinkleSpeed + Math.random() * 1000}ms infinite ease-in-out alternate;
            `;
            
            star.style.left = Math.random() * container.offsetWidth + 'px';
            star.style.top = Math.random() * container.offsetHeight + 'px';
            
            container.appendChild(star);
            particles.push({ element: star });
        }

        return {
            particles,
            destroy: () => particles.forEach(p => p.element.remove())
        };
    }

    /**
     * Rose Petals Particle System
     */
    createRosePetals(container, options = {}) {
        const config = {
            count: options.count || 20,
            speed: options.speed || 1.5,
            colors: options.colors || ['#fd79a8', '#fab1a0', '#ffeaa7'],
            ...options
        };

        const particles = [];
        
        for (let i = 0; i < config.count; i++) {
            const petal = document.createElement('div');
            petal.className = 'particle-petal';
            petal.innerHTML = '🌸';
            petal.style.cssText = `
                position: absolute;
                font-size: ${15 + Math.random() * 10}px;
                color: ${config.colors[Math.floor(Math.random() * config.colors.length)]};
                pointer-events: none;
                z-index: 1;
                opacity: ${0.7 + Math.random() * 0.3};
                transform: rotate(${Math.random() * 360}deg);
                animation: petalFloat ${4 + Math.random() * 3}s infinite ease-in-out;
            `;
            
            this.resetPetalPosition(petal, container);
            container.appendChild(petal);
            
            particles.push({
                element: petal,
                speed: config.speed + Math.random() * 1,
                rotation: Math.random() * 5 - 2.5,
                sway: Math.random() * 3 - 1.5
            });
        }

        return {
            particles,
            update: () => this.updateRosePetals(particles, container),
            destroy: () => particles.forEach(p => p.element.remove())
        };
    }

    resetPetalPosition(petal, container) {
        petal.style.left = Math.random() * container.offsetWidth + 'px';
        petal.style.top = -30 + 'px';
    }

    updateRosePetals(particles, container) {
        particles.forEach(particle => {
            const currentTop = parseFloat(particle.element.style.top);
            const currentLeft = parseFloat(particle.element.style.left);
            const currentRotation = parseFloat(particle.element.style.transform.match(/rotate\(([^)]+)deg\)/)?.[1] || 0);
            
            particle.element.style.top = (currentTop + particle.speed) + 'px';
            particle.element.style.left = (currentLeft + particle.sway) + 'px';
            particle.element.style.transform = `rotate(${currentRotation + particle.rotation}deg)`;
            
            if (currentTop > container.offsetHeight) {
                this.resetPetalPosition(particle.element, container);
            }
        });
    }

    /**
     * Fireflies Particle System
     */
    createFireflies(container, options = {}) {
        const config = {
            count: options.count || 25,
            speed: options.speed || 0.5,
            glowColor: options.glowColor || '#ffeaa7',
            ...options
        };

        const particles = [];
        
        for (let i = 0; i < config.count; i++) {
            const firefly = document.createElement('div');
            firefly.className = 'particle-firefly';
            firefly.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: ${config.glowColor};
                border-radius: 50%;
                pointer-events: none;
                z-index: 1;
                box-shadow: 0 0 10px ${config.glowColor}, 0 0 20px ${config.glowColor};
                animation: fireflyGlow ${2 + Math.random() * 2}s infinite ease-in-out alternate;
            `;
            
            container.appendChild(firefly);
            
            particles.push({
                element: firefly,
                x: Math.random() * container.offsetWidth,
                y: Math.random() * container.offsetHeight,
                vx: (Math.random() - 0.5) * config.speed,
                vy: (Math.random() - 0.5) * config.speed,
                speed: config.speed
            });
        }

        return {
            particles,
            update: () => this.updateFireflies(particles, container),
            destroy: () => particles.forEach(p => p.element.remove())
        };
    }

    updateFireflies(particles, container) {
        particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Bounce off edges
            if (particle.x <= 0 || particle.x >= container.offsetWidth) {
                particle.vx *= -1;
            }
            if (particle.y <= 0 || particle.y >= container.offsetHeight) {
                particle.vy *= -1;
            }
            
            // Keep in bounds
            particle.x = Math.max(0, Math.min(container.offsetWidth, particle.x));
            particle.y = Math.max(0, Math.min(container.offsetHeight, particle.y));
            
            particle.element.style.left = particle.x + 'px';
            particle.element.style.top = particle.y + 'px';
        });
    }

    /**
     * Bubbles Particle System
     */
    createBubbles(container, options = {}) {
        const config = {
            count: options.count || 15,
            speed: options.speed || 1,
            ...options
        };

        const particles = [];
        
        for (let i = 0; i < config.count; i++) {
            const bubble = document.createElement('div');
            bubble.className = 'particle-bubble';
            const size = 20 + Math.random() * 30;
            bubble.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), rgba(255,255,255,0.1));
                border: 1px solid rgba(255,255,255,0.3);
                border-radius: 50%;
                pointer-events: none;
                z-index: 1;
                animation: bubbleFloat ${5 + Math.random() * 3}s infinite ease-in-out;
            `;
            
            this.resetBubblePosition(bubble, container);
            container.appendChild(bubble);
            
            particles.push({
                element: bubble,
                speed: config.speed + Math.random() * 0.5,
                sway: Math.random() * 2 - 1
            });
        }

        return {
            particles,
            update: () => this.updateBubbles(particles, container),
            destroy: () => particles.forEach(p => p.element.remove())
        };
    }

    resetBubblePosition(bubble, container) {
        bubble.style.left = Math.random() * container.offsetWidth + 'px';
        bubble.style.top = container.offsetHeight + 50 + 'px';
    }

    updateBubbles(particles, container) {
        particles.forEach(particle => {
            const currentTop = parseFloat(particle.element.style.top);
            const currentLeft = parseFloat(particle.element.style.left);
            
            particle.element.style.top = (currentTop - particle.speed) + 'px';
            particle.element.style.left = (currentLeft + particle.sway) + 'px';
            
            if (currentTop < -50) {
                this.resetBubblePosition(particle.element, container);
            }
        });
    }

    /**
     * Start particle system
     */
    startSystem(type, container, options = {}) {
        this.stopSystem();
        
        let system;
        switch (type) {
            case 'hearts':
                system = this.createHeartRain(container, options);
                break;
            case 'stars':
                system = this.createStarfield(container, options);
                break;
            case 'petals':
                system = this.createRosePetals(container, options);
                break;
            case 'fireflies':
                system = this.createFireflies(container, options);
                break;
            case 'bubbles':
                system = this.createBubbles(container, options);
                break;
            default:
                return;
        }
        
        this.activeSystem = system;
        
        if (system.update) {
            const animate = () => {
                system.update();
                this.animationFrame = requestAnimationFrame(animate);
            };
            animate();
        }
    }

    /**
     * Stop current particle system
     */
    stopSystem() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
        
        if (this.activeSystem) {
            this.activeSystem.destroy();
            this.activeSystem = null;
        }
    }

    /**
     * Get available particle systems
     */
    getAvailableSystems() {
        return {
            hearts: {
                name: 'Heart Rain',
                description: 'Falling animated hearts'
            },
            stars: {
                name: 'Starfield',
                description: 'Twinkling stars with depth'
            },
            petals: {
                name: 'Rose Petals',
                description: 'Floating rose petals'
            },
            fireflies: {
                name: 'Fireflies',
                description: 'Glowing dots with trails'
            },
            bubbles: {
                name: 'Bubbles',
                description: 'Floating soap bubbles'
            }
        };
    }
}

// Export for use in other modules
window.ParticleSystemManager = ParticleSystemManager;