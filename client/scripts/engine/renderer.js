export class Renderer {
    constructor(game) {
        this.game = game;
        this.ctx = game.ctx;
    }

    draw() {
        const { width, height } = this.game.canvas;
        
        // Clear canvas
        this.ctx.fillStyle = '#111';
        this.ctx.fillRect(0, 0, width, height);
        
        // Draw background decoration (example)
        this.drawStars(width, height);
        
        // Apply Camera Offset
        this.ctx.save();
        this.ctx.translate(-Math.floor(this.game.camera.x), -Math.floor(this.game.camera.y));
        
        // Draw World (Map and Obstacles)
        if (this.game.world) {
            this.game.world.draw(this.ctx);
        }

        // Draw Player
        if (this.game.player) {
            this.game.player.draw(this.ctx);
        }

        this.ctx.restore();

        // Draw Fixed UI Elements (Overlay)
        this.ctx.fillStyle = '#ffcc33';
        this.ctx.font = '20px Cinzel';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('AYODHYA GATEWAY', width / 2, 50);
    }

    drawStars(w, h) {
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        for(let i = 0; i < 50; i++) {
            const x = (Math.sin(i * 123.45) * 0.5 + 0.5) * w;
            const y = (Math.cos(i * 678.90) * 0.5 + 0.5) * h;
            const size = Math.random() * 2;
            this.ctx.beginPath();
            this.ctx.arc(x, y, size, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }
}
