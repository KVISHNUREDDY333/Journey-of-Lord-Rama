export class Player {
    constructor(game) {
        this.game = game;
        
        // Physical Properties
        this.width = 50;
        this.height = 80;
        this.position = { x: 100, y: 100 };
        this.velocity = { x: 0, y: 0 };
        this.acceleration = 0.8;
        this.friction = 0.85;
        this.maxSpeed = 6;
        
        // Character States
        this.states = { IDLE: 'idle', WALKING: 'walking' };
        this.state = this.states.IDLE;
        this.direction = 1; // 1: Right, -1: Left
        
        // Animation & Visuals
        this.frameCount = 0;
        this.bobAmount = 0;
        this.trail = []; // For scarf/movement trail
        this.trailLength = 5;
    }

    update() {
        this.handleInput();
        this.applyMomentum();
        this.updateState();
        this.checkBoundaries();
        this.updateAnimation();
        this.updateTrail();
    }

    handleInput() {
        const input = this.game.input;
        
        // Horizontal Movement with Acceleration
        if (input.isPressed('ArrowLeft')) {
            this.velocity.x -= this.acceleration;
            this.direction = -1;
        } else if (input.isPressed('ArrowRight')) {
            this.velocity.x += this.acceleration;
            this.direction = 1;
        }

        // Vertical Movement with Acceleration
        if (input.isPressed('ArrowUp')) {
            this.velocity.y -= this.acceleration;
        } else if (input.isPressed('ArrowDown')) {
            this.velocity.y += this.acceleration;
        }
    }

    applyMomentum() {
        // Apply friction
        this.velocity.x *= this.friction;
        this.velocity.y *= this.friction;

        // Cap at max speed
        this.velocity.x = Math.max(-this.maxSpeed, Math.min(this.velocity.x, this.maxSpeed));
        this.velocity.y = Math.max(-this.maxSpeed, Math.min(this.velocity.y, this.maxSpeed));

        // Horizontal Collision
        const originalX = this.position.x;
        this.position.x += this.velocity.x;
        if (this.game.world.checkCollision(this.getBounds())) {
            this.position.x = originalX;
            this.velocity.x = 0;
        }

        // Vertical Collision
        const originalY = this.position.y;
        this.position.y += this.velocity.y;
        if (this.game.world.checkCollision(this.getBounds())) {
            this.position.y = originalY;
            this.velocity.y = 0;
        }
    }

    updateState() {
        const moving = Math.abs(this.velocity.x) > 0.5 || Math.abs(this.velocity.y) > 0.5;
        this.state = moving ? this.states.WALKING : this.states.IDLE;
    }

    checkBoundaries() {
        if (this.position.x < 0) this.position.x = 0;
        if (this.position.x + this.width > this.game.canvas.width) this.position.x = this.game.canvas.width - this.width;
        if (this.position.y < 0) this.position.y = 0;
        if (this.position.y + this.height > this.game.canvas.height) this.position.y = this.game.canvas.height - this.height;
    }

    updateAnimation() {
        this.frameCount++;
        if (this.state === this.states.WALKING) {
            this.bobAmount = Math.sin(this.frameCount * 0.2) * 4;
        } else {
            this.bobAmount = Math.sin(this.frameCount * 0.05) * 2; // Gentle idle breathing
        }
    }

    updateTrail() {
        // Store previous positions for the scarf effect
        this.trail.unshift({ x: this.position.x, y: this.position.y });
        if (this.trail.length > this.trailLength) {
            this.trail.pop();
        }
    }

    getBounds() {
        return {
            x: this.position.x,
            y: this.position.y,
            width: this.width,
            height: this.height
        };
    }

    draw(ctx) {
        const { x, y } = this.position;

        // Draw Scarf Trail (Royal Red)
        ctx.strokeStyle = '#8b0000';
        ctx.lineWidth = 15;
        ctx.lineCap = 'round';
        ctx.beginPath();
        this.trail.forEach((p, i) => {
            const offset = (this.direction === 1) ? 5 : 45;
            if (i === 0) ctx.moveTo(p.x + offset, p.y + 20 + this.bobAmount);
            else ctx.lineTo(p.x + offset, p.y + 20 + this.bobAmount);
        });
        ctx.globalAlpha = 0.6;
        ctx.stroke();
        ctx.globalAlpha = 1.0;

        // Draw Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(x + this.width/2, y + this.height, 20, 10, 0, 0, Math.PI * 2);
        ctx.fill();

        // Draw Player Body (Saffron)
        ctx.fillStyle = '#ffcc33';
        ctx.fillRect(x, y + this.bobAmount, this.width, this.height);
        
        // Draw Head/Crown
        ctx.fillStyle = '#ff9933';
        ctx.fillRect(x + 5, y + this.bobAmount - 15, 40, 20);

        // Draw Eyes (indicators of direction)
        ctx.fillStyle = '#000';
        const eyeOffset = this.direction === 1 ? 30 : 10;
        ctx.fillRect(x + eyeOffset, y + this.bobAmount + 5, 5, 5);
        ctx.fillRect(x + eyeOffset + 10, y + this.bobAmount + 5, 5, 5);

        // State Indicator
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.font = '10px Cinzel';
        ctx.textAlign = 'center';
        ctx.fillText(this.state.toUpperCase(), x + this.width/2, y - 25);
    }
}
