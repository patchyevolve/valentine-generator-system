/**
 * SVG Animation System Module
 * Modular SVG-based background animations
 * 
 * @author patchyevole
 * @github https://github.com/patchyevolve
 */

class SVGAnimationManager {
    constructor() {
        this.animations = {};
        this.activeAnimation = null;
    }

    /**
     * Create animated hearts SVG
     */
    createAnimatedHearts(container, options = {}) {
        const config = {
            count: options.count || 8,
            colors: options.colors || ['#ff6b9d', '#fd79a8', '#ff7675'],
            size: options.size || 20, // Smaller for previews
            ...options
        };

        // Get container dimensions for proper scaling
        const containerRect = container.getBoundingClientRect();
        const isSmallContainer = containerRect.width < 300 || containerRect.height < 200;
        
        if (isSmallContainer) {
            config.count = Math.min(config.count, 3);
            config.size = Math.min(config.size, 15);
        }

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.setAttribute('viewBox', '0 0 100 100');
        svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
        svg.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            pointer-events: none;
            z-index: 1;
        `;

        for (let i = 0; i < config.count; i++) {
            const heart = this.createHeartPath(config.colors[i % config.colors.length], config.size);
            heart.style.cssText = `
                transform-origin: center;
                animation: svgHeartPulse ${2 + Math.random() * 2}s infinite ease-in-out;
                animation-delay: ${Math.random() * 2}s;
            `;
            
            const x = 10 + Math.random() * 80; // 10-90 units in viewBox
            const y = 10 + Math.random() * 80; // 10-90 units in viewBox
            heart.setAttribute('transform', `translate(${x}, ${y})`);
            
            svg.appendChild(heart);
        }

        container.appendChild(svg);
        return { element: svg, destroy: () => svg.remove() };
    }

    createHeartPath(color, size) {
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        
        // Scale the heart path for the viewBox
        const scale = size / 24; // Base size 24
        path.setAttribute('d', 'M12,21.35l-1.45-1.32C5.4,15.36,2,12.28,2,8.5 C2,5.42,4.42,3,7.5,3c1.74,0,3.41,0.81,4.5,2.09C13.09,3.81,14.76,3,16.5,3 C19.58,3,22,5.42,22,8.5c0,3.78-3.4,6.86-8.55,11.54L12,21.35z');
        path.setAttribute('fill', color);
        path.setAttribute('stroke', 'rgba(255,255,255,0.3)');
        path.setAttribute('stroke-width', '0.5');
        path.setAttribute('transform', `scale(${scale}) translate(-12, -12)`);
        path.style.filter = 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))';
        
        g.appendChild(path);
        return g;
    }

    /**
     * Create geometric wave patterns
     */
    createGeometricWaves(container, options = {}) {
        const config = {
            waves: options.waves || 3,
            colors: options.colors || ['rgba(255,107,157,0.1)', 'rgba(253,121,168,0.1)', 'rgba(255,118,117,0.1)'],
            ...options
        };

        // Get container dimensions for proper scaling
        const containerRect = container.getBoundingClientRect();
        const isSmallContainer = containerRect.width < 300 || containerRect.height < 200;
        
        if (isSmallContainer) {
            config.waves = Math.min(config.waves, 2);
        }

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.setAttribute('viewBox', '0 0 100 100');
        svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
        svg.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            pointer-events: none;
            z-index: 1;
        `;

        for (let i = 0; i < config.waves; i++) {
            const wave = this.createWavePath(config.colors[i % config.colors.length], i);
            svg.appendChild(wave);
        }

        container.appendChild(svg);
        return { element: svg, destroy: () => svg.remove() };
    }

    createWavePath(color, index) {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const amplitude = 10 + index * 5; // Smaller amplitude for viewBox
        const frequency = 0.3 + index * 0.1;
        const baseY = 30 + index * 20; // Position in viewBox coordinates
        
        let d = `M 0,${baseY}`;
        for (let x = 0; x <= 100; x += 5) {
            const y = baseY + Math.sin(x * frequency) * amplitude;
            d += ` L ${x},${y}`;
        }
        d += ` L 100,100 L 0,100 Z`;
        
        path.setAttribute('d', d);
        path.setAttribute('fill', color);
        path.style.cssText = `
            animation: svgWaveFlow ${8 + index * 2}s infinite ease-in-out;
            animation-delay: ${index * 0.5}s;
        `;
        
        return path;
    }

    /**
     * Create floating geometric shapes
     */
    createFloatingShapes(container, options = {}) {
        const config = {
            count: options.count || 12,
            shapes: options.shapes || ['circle', 'triangle', 'square', 'diamond'],
            colors: options.colors || ['rgba(255,107,157,0.2)', 'rgba(253,121,168,0.2)', 'rgba(116,185,255,0.2)'],
            ...options
        };

        // Get container dimensions for proper scaling
        const containerRect = container.getBoundingClientRect();
        const isSmallContainer = containerRect.width < 300 || containerRect.height < 200;
        
        if (isSmallContainer) {
            config.count = Math.min(config.count, 6);
        }

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.setAttribute('viewBox', '0 0 100 100');
        svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
        svg.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            pointer-events: none;
            z-index: 1;
        `;

        for (let i = 0; i < config.count; i++) {
            const shape = this.createShape(
                config.shapes[i % config.shapes.length],
                config.colors[i % config.colors.length],
                3 + Math.random() * 4 // Smaller size for viewBox
            );
            
            const x = 5 + Math.random() * 90; // 5-95 units in viewBox
            const y = 5 + Math.random() * 90; // 5-95 units in viewBox
            shape.setAttribute('transform', `translate(${x}, ${y})`);
            shape.style.cssText = `
                animation: svgShapeFloat ${4 + Math.random() * 4}s infinite ease-in-out;
                animation-delay: ${Math.random() * 2}s;
            `;
            
            svg.appendChild(shape);
        }

        container.appendChild(svg);
        return { element: svg, destroy: () => svg.remove() };
    }

    createShape(type, color, size) {
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        let element;

        switch (type) {
            case 'circle':
                element = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                element.setAttribute('r', size);
                element.setAttribute('cx', 0);
                element.setAttribute('cy', 0);
                break;
            
            case 'triangle':
                element = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
                element.setAttribute('points', `0,-${size} -${size},${size} ${size},${size}`);
                break;
            
            case 'square':
                element = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                element.setAttribute('width', size * 2);
                element.setAttribute('height', size * 2);
                element.setAttribute('x', -size);
                element.setAttribute('y', -size);
                break;
            
            case 'diamond':
                element = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
                element.setAttribute('points', `0,-${size} ${size},0 0,${size} -${size},0`);
                break;
        }

        element.setAttribute('fill', color);
        element.setAttribute('stroke', 'rgba(255,255,255,0.1)');
        element.setAttribute('stroke-width', '0.5');
        
        g.appendChild(element);
        return g;
    }

    /**
     * Create animated nature elements
     */
    createNatureElements(container, options = {}) {
        const config = {
            elements: options.elements || ['leaf', 'flower', 'butterfly'],
            count: options.count || 6,
            colors: options.colors || ['#00b894', '#fd79a8', '#fdcb6e'],
            ...options
        };

        // Get container dimensions for proper scaling
        const containerRect = container.getBoundingClientRect();
        const isSmallContainer = containerRect.width < 300 || containerRect.height < 200;
        
        if (isSmallContainer) {
            config.count = Math.min(config.count, 3);
        }

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.setAttribute('viewBox', '0 0 100 100');
        svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
        svg.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            pointer-events: none;
            z-index: 1;
        `;

        for (let i = 0; i < config.count; i++) {
            const elementType = config.elements[i % config.elements.length];
            const element = this.createNatureElement(
                elementType,
                config.colors[i % config.colors.length]
            );
            
            const x = 10 + Math.random() * 80; // 10-90 units in viewBox
            const y = 10 + Math.random() * 80; // 10-90 units in viewBox
            element.setAttribute('transform', `translate(${x}, ${y})`);
            element.style.cssText = `
                animation: svgNatureFloat ${3 + Math.random() * 3}s infinite ease-in-out;
                animation-delay: ${Math.random() * 2}s;
            `;
            
            svg.appendChild(element);
        }

        container.appendChild(svg);
        return { element: svg, destroy: () => svg.remove() };
    }

    createNatureElement(type, color) {
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        let path;

        switch (type) {
            case 'leaf':
                path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute('d', 'M12,2 Q16,6 12,12 Q8,6 12,2 Z M12,12 L12,18');
                break;
            
            case 'flower':
                path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute('d', 'M12,8 Q8,4 4,8 Q8,12 12,8 Q16,4 20,8 Q16,12 12,8 M12,8 Q8,12 4,16 Q8,20 12,16 Q16,12 20,16 Q16,20 12,16');
                break;
            
            case 'butterfly':
                path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute('d', 'M12,4 Q8,2 6,6 Q8,10 12,8 Q16,2 18,6 Q16,10 12,8 M12,8 Q8,10 6,14 Q8,18 12,16 Q16,10 18,14 Q16,18 12,16 M12,4 L12,16');
                break;
        }

        path.setAttribute('fill', color);
        path.setAttribute('stroke', 'rgba(255,255,255,0.2)');
        path.setAttribute('stroke-width', '0.5');
        path.setAttribute('transform', 'scale(0.3) translate(-12, -12)'); // Scale down for preview
        path.style.filter = 'drop-shadow(0 1px 3px rgba(0,0,0,0.1))';
        
        g.appendChild(path);
        return g;
    }

    /**
     * Start SVG animation
     */
    startAnimation(type, container, options = {}) {
        this.stopAnimation();
        
        let animation;
        switch (type) {
            case 'hearts':
                animation = this.createAnimatedHearts(container, options);
                break;
            case 'waves':
                animation = this.createGeometricWaves(container, options);
                break;
            case 'shapes':
                animation = this.createFloatingShapes(container, options);
                break;
            case 'nature':
                animation = this.createNatureElements(container, options);
                break;
            default:
                return;
        }
        
        this.activeAnimation = animation;
    }

    /**
     * Stop current animation
     */
    stopAnimation() {
        if (this.activeAnimation) {
            this.activeAnimation.destroy();
            this.activeAnimation = null;
        }
    }

    /**
     * Get available animations
     */
    getAvailableAnimations() {
        return {
            hearts: {
                name: 'Animated Hearts',
                description: 'Pulsing heart shapes with smooth animations'
            },
            waves: {
                name: 'Geometric Waves',
                description: 'Flowing wave patterns with gradient colors'
            },
            shapes: {
                name: 'Floating Shapes',
                description: 'Geometric shapes floating with depth'
            },
            nature: {
                name: 'Nature Elements',
                description: 'Animated leaves, flowers, and butterflies'
            }
        };
    }
}

// Export for use in other modules
window.SVGAnimationManager = SVGAnimationManager;