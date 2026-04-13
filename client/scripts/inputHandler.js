export class InputHandler {
    constructor() {
        this.keys = {};
        
        window.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
        });
        
        window.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
    }

    isPressed(key) {
        // Handle both Arrow keys and WASD
        if (key === 'ArrowUp' || key === 'w') return this.keys['ArrowUp'] || this.keys['w'];
        if (key === 'ArrowDown' || key === 's') return this.keys['ArrowDown'] || this.keys['s'];
        if (key === 'ArrowLeft' || key === 'a') return this.keys['ArrowLeft'] || this.keys['a'];
        if (key === 'ArrowRight' || key === 'd') return this.keys['ArrowRight'] || this.keys['d'];
        return this.keys[key];
    }
}
