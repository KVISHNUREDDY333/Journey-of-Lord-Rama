export class Camera {
    constructor(game) {
        this.game = game;
        this.x = 0;
        this.y = 0;
        this.target = null;
        
        // Settings
        this.smoothing = 0.08; // How fast the camera catches up
        this.lookAheadDistance = 15; // How much to look ahead in movement direction
    }

    follow(target) {
        this.target = target;
    }

    update() {
        if (!this.target) return;

        // Base Target Position (Centered)
        let targetX = this.target.position.x - this.game.canvas.width / 2 + this.target.width / 2;
        let targetY = this.target.position.y - this.game.canvas.height / 2 + this.target.height / 2;

        // Add Predictive Lead (Offset based on player velocity)
        if (this.target.velocity) {
            targetX += this.target.velocity.x * this.lookAheadDistance;
            targetY += this.target.velocity.y * this.lookAheadDistance;
        }

        // Apply Smooth Interpolation (Lerp)
        this.x += (targetX - this.x) * this.smoothing;
        this.y += (targetY - this.y) * this.smoothing;

        // Ensure we stay within the world boundaries
        this.clampToWorld();
    }

    clampToWorld() {
        if (!this.game.world || !this.game.world.map) return;
        
        const map = this.game.world.map;
        
        // Prevent camera from going outside the map
        const maxX = Math.max(0, map.width - this.game.canvas.width);
        const maxY = Math.max(0, map.height - this.game.canvas.height);
        
        this.x = Math.max(0, Math.min(this.x, maxX));
        this.y = Math.max(0, Math.min(this.y, maxY));
    }
}
