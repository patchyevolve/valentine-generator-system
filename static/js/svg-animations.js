/**
 * SVG Animation System Module
 * Modular SVG-based background animations
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
            size: options.size || 40,
            ...options
        };

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
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
            
            const x = Math.random() * 80 + 10; // 10-90% of width
            const y = Math.random() * 80 + 10; // 10-90% of height
            heart.setAttribute('transform', `translate(${x}%, ${y}%)`);
            
            svg.appendChild(heart);
        }

        container.appendChild(svg);
        return { element: svg, destroy: () => svg.remove() };
    }

    createHeartPath(color, size) {
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        
        path.setAttribute('d', 'M12,21.35l-1.45-1.32C5.4,15.36,2,12.28,2,8.5 C2,5.42,4.42,3,7.5,3c1.74,0,3.41,0.81,4.5,2.09C13.09,3.81,14.76,3,16.5,3 C19.58,3,22,5.42,22,8.5c0,3.78-3.4,6.86-8.55,11.54L12,21.35z');
        path.setAttribute('fill', color);
        path.setAttribute('stroke', 'rgba(255,255,255,0.3)');
        path.setAttribute('stroke-width', '0.5');
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

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
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
        const amplitude = 50 + index * 20;
        const frequency = 0.02 + index * 0.01;
        
        let d = `M 0,${200 + index * 100}`;
        for (let x = 0; x <= 100; x += 2) {
            const y = 200 + index * 100 + Math.sin(x * frequency) * amplitude;
            d += ` L ${x * 10},${y}`;
        }
        d += ` L 1000,1000 L 0,1000 Z`;
        
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

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
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
                20 + Math.random() * 30
            );
            
            const x = Math.random() * 90 + 5;
            const y = Math.random() * 90 + 5;
            shape.setAttribute('transform', `translate(${x}%, ${y}%)`);
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
                element.setAttribute('r', size / 2);
                element.setAttribute('cx', 0);
                element.setAttribute('cy', 0);
                break;
            
            case 'triangle':
                element = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
                element.setAttribute('points', `0,-${size/2} -${size/2},${size/2} ${size/2},${size/2}`);
                break;
            
            case 'square':
                element = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                element.setAttribute('width', size);
                element.setAttribute('height', size);
                element.setAttribute('x', -size/2);
                element.setAttribute('y', -size/2);
                break;
            
            case 'diamond':
                element = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
                element.setAttribute('points', `0,-${size/2} ${size/2},0 0,${size/2} -${size/2},0`);
                break;
        }

        element.setAttribute('fill', color);
        element.setAttribute('stroke', 'rgba(255,255,255,0.1)');
        element.setAttribute('stroke-width', '1');
        
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

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
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
            
            const x = Math.random() * 80 + 10;
            const y = Math.random() * 80 + 10;
            element.setAttribute('transform', `translate(${x}%, ${y}%)`);
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
                path.setAttribute('d', 'M12,2C13.1,2 14,2.9 14,4C14,5.1 13.1,6 12,6C10.9,6 10,5.1 10,4C10,2.9 10.9,2 12,2M21,9V7L15,1H5C3.89,1 3,1.89 3,3V21A2,2 0 0,0 5,23H19A2,2 0 0,0 21,21V9M19,9H14V4H5V21H19V9Z');
                break;
            
            case 'flower':
                path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute('d', 'M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M12,16A3,3 0 0,1 15,19A3,3 0 0,1 12,22A3,3 0 0,1 9,19A3,3 0 0,1 12,16M16,8A3,3 0 0,1 19,11A3,3 0 0,1 16,14A3,3 0 0,1 13,11A3,3 0 0,1 16,8M8,8A3,3 0 0,1 11,11A3,3 0 0,1 8,14A3,3 0 0,1 5,11A3,3 0 0,1 8,8Z');
                break;
            
            case 'butterfly':
                path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute('d', 'M12,2C11.5,2 11,2.19 10.59,2.59L2.59,10.59C1.8,11.37 1.8,12.63 2.59,13.41L10.59,21.41C11.37,22.2 12.63,22.2 13.41,21.41L21.41,13.41C22.2,12.63 22.2,11.37 21.41,10.59L13.41,2.59C13,2.19 12.5,2 12,2Z');
                break;
        }

        path.setAttribute('fill', color);
        path.setAttribute('stroke', 'rgba(255,255,255,0.2)');
        path.setAttribute('stroke-width', '0.5');
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