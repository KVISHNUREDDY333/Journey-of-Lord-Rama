export class Camera {
    constructor(game) {
        this.game = game;
        this.x = 0;
        this.y = 0;
        this.target = null;
        this.smoothing = 0.1; // 0 to 1, lower = smoother
    }

    follow(target) {
        this.target = target;
    }

    update() {
        if (!this.target) return;

        // Calculate the ideal centered position
        const targetX = this.target.position.x - this.game.canvas.width / 2 + this.target.width / 2;
        const targetY = this.target.position.y - this.game.canvas.height / 2 + this.target.height / 2;

        // Smoothly interpolate current camera position toward the target
        this.x += (targetX - this.x) * this.smoothing;
        this.y += (targetY - this.y) * this.smoothing;

        // Optional: Clamp camera to world boundaries if defined
        if (this.game.world && this.game.world.map) {
            this.clampToWorld();
        }
    }

    clampToWorld() {
        const map = this.game.world.map;
        this.x = Math.max(0, Math.min(this.x, map.width - this.game.canvas.width));
        this.y = Math.max(0, Math.min(this.y, map.height - this.game.canvas.height));
    }
}
