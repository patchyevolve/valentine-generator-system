/**
 * Enhanced Particle Systems Module - Wave-based Continuous Effects
 * Creates organized, continuous particle effects with wave patterns
 * 
 * @author patchyevole
 * @github https://github.com/patchyevolve
 */

class ParticleSystemManager {
    constructor() {
        this.systems = {};
        this.activeSystem = null;
        this.animationFrame = null;
        this.isRunning = false;
        this.waveOffset = 0;
    }

    /**
     * Enhanced Heart Rain - Wave Pattern with Continuous Flow
     */
    createHeartRain(container, options = {}) {
        const config = {
            count: options.count || 25,
            speed: options.speed || 1.5,
            size: options.size || 20,
            colors: options.colors || ['💖', '💕', '💗', '❤️', '💝'],
            waveAmplitude: 50,
            waveFrequency: 0.02,
            ...options
        };

        const particles = [];
        
        for (let i = 0; i < config.count; i++) {
            const heart = document.createElement('div');
            heart.className = 'particle-heart';
            heart.innerHTML = config.colors[Math.floor(Math.random() * config.colors.length)];
            heart.style.cssText = `
                position: fixed;
                font-size: ${config.size + Math.random() * 10}px;
                pointer-events: none;
                z-index: 1000;
                opacity: ${0.7 + Math.random() * 0.3};
                user-select: none;
                text-shadow: 0 0 10px rgba(255, 107, 157, 0.5);
            `;
            
            const wavePosition = (i / config.count) * window.innerWidth;
            const waveY = Math.sin(wavePosition * config.waveFrequency) * config.waveAmplitude;
            
            heart.style.left = wavePosition + 'px';
            heart.style.top = (-100 + waveY) + 'px';
            
            document.body.appendChild(heart);
            
            particles.push({
                element: heart,
                baseX: wavePosition,
                y: -100 + waveY,
                speed: config.speed + Math.random() * 1,
                waveOffset: Math.random() * Math.PI * 2,
                lifetime: 0,
                maxLifetime: 8000 + Math.random() * 4000
            });
        }

        return {
            particles,
            config,
            update: () => this.updateHeartRain(particles, config),
            destroy: () => particles.forEach(p => p.element.remove())
        };
    }

    updateHeartRain(particles, config) {
        this.waveOffset += 0.02;
        
        particles.forEach((particle, index) => {
            particle.lifetime += 16;
            particle.y += particle.speed;
            
            const waveX = particle.baseX + Math.sin(particle.y * 0.01 + particle.waveOffset + this.waveOffset) * config.waveAmplitude;
            
            particle.element.style.left = waveX + 'px';
            particle.element.style.top = particle.y + 'px';
            
            if (particle.y > window.innerHeight + 100 || particle.lifetime > particle.maxLifetime) {
                particle.y = -100 + Math.sin(particle.baseX * config.waveFrequency + this.waveOffset) * config.waveAmplitude;
                particle.lifetime = 0;
                particle.waveOffset = Math.random() * Math.PI * 2;
                particle.baseX = (index / particles.length) * window.innerWidth + (Math.random() - 0.5) * 100;
            }
        });
    }

    /**
     * Enhanced Starfield - Organized Twinkling Pattern
     */
    createStarfield(container, options = {}) {
        const config = {
            count: options.count || 60,
            layers: 3,
            twinkleSpeed: options.twinkleSpeed || 2000,
            colors: options.colors || ['#ffffff', '#ffeaa7', '#74b9ff', '#fd79a8'],
            ...options
        };

        const particles = [];
        const cols = Math.ceil(Math.sqrt(config.count));
        const rows = Math.ceil(config.count / cols);
        
        for (let i = 0; i < config.count; i++) {
            const star = document.createElement('div');
            star.className = 'particle-star';
            
            const layer = Math.floor(Math.random() * config.layers);
            const size = (2 + layer) + Math.random() * 2;
            const opacity = 0.3 + (layer * 0.3);
            
            star.style.cssText = `
                position: fixed;
                width: ${size}px;
                height: ${size}px;
                background: ${config.colors[Math.floor(Math.random() * config.colors.length)]};
                border-radius: 50%;
                pointer-events: none;
                z-index: ${1000 - layer};
                box-shadow: 0 0 ${size * 2}px currentColor;
                opacity: ${opacity};
            `;
            
            const col = i % cols;
            const row = Math.floor(i / cols);
            const x = (col / cols) * window.innerWidth + (Math.random() - 0.5) * 100;
            const y = (row / rows) * window.innerHeight + (Math.random() - 0.5) * 100;
            
            star.style.left = x + 'px';
            star.style.top = y + 'px';
            
            document.body.appendChild(star);
            
            particles.push({
                element: star,
                twinklePhase: Math.random() * Math.PI * 2,
                twinkleSpeed: 0.02 + Math.random() * 0.02,
                baseOpacity: opacity
            });
        }

        return {
            particles,
            update: () => this.updateStarfield(particles),
            destroy: () => particles.forEach(p => p.element.remove())
        };
    }

    updateStarfield(particles) {
        particles.forEach(particle => {
            particle.twinklePhase += particle.twinkleSpeed;
            const twinkle = Math.sin(particle.twinklePhase) * 0.3 + 0.7;
            particle.element.style.opacity = particle.baseOpacity * twinkle;
        });
    }

    /**
     * Enhanced Rose Petals - Spiral Wave Pattern
     */
    createRosePetals(container, options = {}) {
        const config = {
            count: options.count || 30,
            speed: options.speed || 1,
            colors: options.colors || ['🌸', '🌺', '🌹', '🥀'],
            spiralRadius: 80,
            ...options
        };

        const particles = [];
        
        for (let i = 0; i < config.count; i++) {
            const petal = document.createElement('div');
            petal.className = 'particle-petal';
            petal.innerHTML = config.colors[Math.floor(Math.random() * config.colors.length)];
            petal.style.cssText = `
                position: fixed;
                font-size: ${15 + Math.random() * 10}px;
                pointer-events: none;
                z-index: 1000;
                opacity: ${0.6 + Math.random() * 0.4};
                transform: rotate(${Math.random() * 360}deg);
                user-select: none;
            `;
            
            const angle = (i / config.count) * Math.PI * 4;
            const radius = (i / config.count) * config.spiralRadius;
            const x = window.innerWidth / 2 + Math.cos(angle) * radius;
            const y = -100 + (i / config.count) * 200;
            
            petal.style.left = x + 'px';
            petal.style.top = y + 'px';
            
            document.body.appendChild(petal);
            
            particles.push({
                element: petal,
                angle: angle,
                radius: radius,
                y: y,
                speed: config.speed + Math.random() * 0.5,
                rotationSpeed: (Math.random() - 0.5) * 4,
                currentRotation: Math.random() * 360,
                spiralSpeed: 0.01,
                lifetime: 0,
                maxLifetime: 10000 + Math.random() * 5000
            });
        }

        return {
            particles,
            config,
            update: () => this.updateRosePetals(particles, config),
            destroy: () => particles.forEach(p => p.element.remove())
        };
    }

    updateRosePetals(particles, config) {
        particles.forEach((particle, index) => {
            particle.lifetime += 16;
            particle.y += particle.speed;
            particle.angle += particle.spiralSpeed;
            particle.currentRotation += particle.rotationSpeed;
            
            const x = window.innerWidth / 2 + Math.cos(particle.angle) * particle.radius;
            
            particle.element.style.left = x + 'px';
            particle.element.style.top = particle.y + 'px';
            particle.element.style.transform = `rotate(${particle.currentRotation}deg)`;
            
            if (particle.y > window.innerHeight + 100 || particle.lifetime > particle.maxLifetime) {
                const newAngle = (index / particles.length) * Math.PI * 4;
                particle.angle = newAngle;
                particle.y = -100 + (index / particles.length) * 200;
                particle.lifetime = 0;
            }
        });
    }

    /**
     * Enhanced Fireflies - Organized Swarm Pattern
     */
    createFireflies(container, options = {}) {
        const config = {
            count: options.count || 35,
            speed: options.speed || 0.8,
            glowColor: options.glowColor || '#ffeaa7',
            swarmRadius: 150,
            ...options
        };

        const particles = [];
        const swarms = 3;
        const particlesPerSwarm = Math.ceil(config.count / swarms);
        
        for (let s = 0; s < swarms; s++) {
            const swarmCenterX = (s + 1) * (window.innerWidth / (swarms + 1));
            const swarmCenterY = window.innerHeight / 2;
            
            for (let i = 0; i < particlesPerSwarm && particles.length < config.count; i++) {
                const firefly = document.createElement('div');
                firefly.className = 'particle-firefly';
                firefly.style.cssText = `
                    position: fixed;
                    width: 6px;
                    height: 6px;
                    background: ${config.glowColor};
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 1000;
                    box-shadow: 0 0 15px ${config.glowColor}, 0 0 30px ${config.glowColor};
                `;
                
                document.body.appendChild(firefly);
                
                particles.push({
                    element: firefly,
                    swarmCenterX: swarmCenterX,
                    swarmCenterY: swarmCenterY,
                    angle: Math.random() * Math.PI * 2,
                    radius: Math.random() * config.swarmRadius,
                    speed: config.speed + Math.random() * 0.5,
                    glowPhase: Math.random() * Math.PI * 2,
                    glowSpeed: 0.03 + Math.random() * 0.02
                });
            }
        }

        return {
            particles,
            update: () => this.updateFireflies(particles),
            destroy: () => particles.forEach(p => p.element.remove())
        };
    }

    updateFireflies(particles) {
        particles.forEach(particle => {
            particle.angle += particle.speed * 0.01;
            particle.glowPhase += particle.glowSpeed;
            
            const x = particle.swarmCenterX + Math.cos(particle.angle) * particle.radius;
            const y = particle.swarmCenterY + Math.sin(particle.angle) * particle.radius * 0.5;
            
            particle.element.style.left = x + 'px';
            particle.element.style.top = y + 'px';
            
            const glow = Math.sin(particle.glowPhase) * 0.5 + 0.5;
            particle.element.style.opacity = 0.6 + glow * 0.4;
        });
    }

    /**
     * Enhanced Bubbles - Rising Wave Pattern
     */
    createBubbles(container, options = {}) {
        const config = {
            count: options.count || 20,
            speed: options.speed || 1.2,
            waveAmplitude: 60,
            ...options
        };

        const particles = [];
        
        for (let i = 0; i < config.count; i++) {
            const bubble = document.createElement('div');
            bubble.className = 'particle-bubble';
            const size = 15 + Math.random() * 25;
            bubble.style.cssText = `
                position: fixed;
                width: ${size}px;
                height: ${size}px;
                background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), rgba(255,255,255,0.1));
                border: 1px solid rgba(255,255,255,0.3);
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                opacity: ${0.6 + Math.random() * 0.4};
            `;
            
            const waveX = (i / config.count) * window.innerWidth;
            const waveY = window.innerHeight + 100;
            
            bubble.style.left = waveX + 'px';
            bubble.style.top = waveY + 'px';
            
            document.body.appendChild(bubble);
            
            particles.push({
                element: bubble,
                baseX: waveX,
                y: waveY,
                speed: config.speed + Math.random() * 0.8,
                waveOffset: Math.random() * Math.PI * 2,
                lifetime: 0,
                maxLifetime: 12000 + Math.random() * 6000
            });
        }

        return {
            particles,
            config,
            update: () => this.updateBubbles(particles, config),
            destroy: () => particles.forEach(p => p.element.remove())
        };
    }

    updateBubbles(particles, config) {
        this.waveOffset += 0.015;
        
        particles.forEach((particle, index) => {
            particle.lifetime += 16;
            particle.y -= particle.speed;
            
            const waveX = particle.baseX + Math.sin(particle.y * 0.008 + particle.waveOffset + this.waveOffset) * config.waveAmplitude;
            
            particle.element.style.left = waveX + 'px';
            particle.element.style.top = particle.y + 'px';
            
            if (particle.y < -100 || particle.lifetime > particle.maxLifetime) {
                particle.y = window.innerHeight + 100;
                particle.lifetime = 0;
                particle.baseX = (index / particles.length) * window.innerWidth + (Math.random() - 0.5) * 100;
            }
        });
    }

    /**
     * Start particle system with continuous operation
     */
    startSystem(type, container, options = {}) {
        if (this.activeSystem && this.activeSystem.type === type && this.isRunning) {
            return;
        }
        
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
        
        if (!system) return;
        
        system.type = type;
        this.activeSystem = system;
        this.isRunning = true;
        
        if (system.update) {
            const animate = () => {
                if (this.isRunning && this.activeSystem === system) {
                    system.update();
                    this.animationFrame = requestAnimationFrame(animate);
                }
            };
            animate();
        }
    }

    /**
     * Stop current particle system
     */
    stopSystem() {
        this.isRunning = false;
        
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
     * Pause/Resume system (for state changes without restart)
     */
    pauseSystem() {
        this.isRunning = false;
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
    }

    resumeSystem() {
        if (this.activeSystem && !this.isRunning) {
            this.isRunning = true;
            if (this.activeSystem.update) {
                const animate = () => {
                    if (this.isRunning && this.activeSystem) {
                        this.activeSystem.update();
                        this.animationFrame = requestAnimationFrame(animate);
                    }
                };
                animate();
            }
        }
    }

    /**
     * Get available particle systems
     */
    getAvailableSystems() {
        return {
            hearts: {
                name: 'Heart Rain',
                description: 'Continuous wave of falling hearts'
            },
            stars: {
                name: 'Starfield',
                description: 'Organized twinkling stars'
            },
            petals: {
                name: 'Rose Petals',
                description: 'Spiral pattern of floating petals'
            },
            fireflies: {
                name: 'Fireflies',
                description: 'Swarm-based glowing particles'
            },
            bubbles: {
                name: 'Bubbles',
                description: 'Rising wave of soap bubbles'
            }
        };
    }
}

// Export for use in other modules
window.ParticleSystemManager = ParticleSystemManager;