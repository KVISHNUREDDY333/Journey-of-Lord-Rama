export class Player {
    constructor(game) {
        this.game = game;
        
        // Physical Properties
        this.width = 50;
        this.height = 80;
        this.position = { x: 100, y: 100 };
        this.velocity = { x: 0, y: 0 };
        this.speed = 5;
        this.friction = 0.85; // For smooth stopping
        
        // Character States
        this.states = { IDLE: 'idle', WALKING: 'walking' };
        this.state = this.states.IDLE;
        this.direction = 1; // 1 for right, -1 for left
        
        // Animation Placeholders
        this.frame = 0;
        this.frameCount = 0;
    }

    update() {
        this.handleInput();
        this.applyPhysics();
        this.updateState();
        this.checkBoundaries();
        this.updateAnimation();
    }

    handleInput() {
        // Reset velocity before input
        this.velocity.x = 0;
        this.velocity.y = 0;

        if (this.game.input.isPressed('ArrowLeft')) {
            this.velocity.x = -this.speed;
            this.direction = -1;
        }
        if (this.game.input.isPressed('ArrowRight')) {
            this.velocity.x = this.speed;
            this.direction = 1;
        }
        if (this.game.input.isPressed('ArrowUp')) this.velocity.y = -this.speed;
        if (this.game.input.isPressed('ArrowDown')) this.velocity.y = this.speed;
    }

    applyPhysics() {
        // Try Moving X
        const originalX = this.position.x;
        this.position.x += this.velocity.x;
        if (this.game.world.checkCollision(this.getBounds())) {
            this.position.x = originalX;
        }

        // Try Moving Y
        const originalY = this.position.y;
        this.position.y += this.velocity.y;
        if (this.game.world.checkCollision(this.getBounds())) {
            this.position.y = originalY;
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

    updateState() {
        // Simple state transition logic
        if (Math.abs(this.velocity.x) > 0 || Math.abs(this.velocity.y) > 0) {
            this.state = this.states.WALKING;
        } else {
            this.state = this.states.IDLE;
        }
    }

    checkBoundaries() {
        if (this.position.x < 0) this.position.x = 0;
        if (this.position.x + this.width > this.game.canvas.width) this.position.x = this.game.canvas.width - this.width;
        if (this.position.y < 0) this.position.y = 0;
        if (this.position.y + this.height > this.game.canvas.height) this.position.y = this.game.canvas.height - this.height;
    }

    updateAnimation() {
        // Placeholder for frame stepping
        this.frameCount++;
        if (this.frameCount % 10 === 0) {
            this.frame = (this.frame + 1) % 4; // Cycle 4 frames
        }
    }

    draw(ctx) {
        const { x, y } = this.position;

        // Visual effects for walking (subtle bobbing)
        let bob = 0;
        if (this.state === this.states.WALKING) {
            bob = Math.sin(this.frameCount * 0.2) * 5;
        }

        // Draw Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(x + this.width/2, y + this.height, 20, 10, 0, 0, Math.PI * 2);
        ctx.fill();

        // Draw Player Body (The rectangle now 'bobs' when walking)
        ctx.fillStyle = '#ffcc33';
        ctx.fillRect(x, y + bob, this.width, this.height);
        
        // Draw Eyes (indicators of direction)
        ctx.fillStyle = '#000';
        const eyeOffset = this.direction === 1 ? 30 : 10;
        ctx.fillRect(x + eyeOffset, y + bob + 15, 5, 5);
        ctx.fillRect(x + eyeOffset + 10, y + bob + 15, 5, 5);

        // State indicator (debug info)
        ctx.fillStyle = '#fff';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(this.state.toUpperCase(), x + this.width/2, y - 20);
    }
}
