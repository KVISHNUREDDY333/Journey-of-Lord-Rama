import { AYODHYA_MAP } from './map.js';
import { NPC } from '../characters/npc.js';

export class Environment {
    constructor(game) {
        this.game = game;
        this.map = AYODHYA_MAP;
        this.obstacles = this.map.obstacles;
        
        // Spawn NPCs
        this.npcs = [];
        if (this.map.npc) {
            this.npcs.push(new NPC(this.map.npc.name, this.map.npc.x, this.map.npc.y, { color: this.map.npc.color }));
        }
    }

    draw(ctx) {
        // Draw floor pattern (simple grid for Ayodhya)
        this.drawFloor(ctx);

        // Draw static obstacles
        this.obstacles.forEach(obs => {
            ctx.fillStyle = obs.color || '#555';
            ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
            
            // Add some detail to obstacles
            ctx.strokeStyle = 'rgba(255,255,255,0.2)';
            ctx.strokeRect(obs.x, obs.y, obs.width, obs.height);
        });

        // Draw NPCs
        this.npcs.forEach(npc => npc.draw(ctx));
    }

    drawFloor(ctx) {
        const gridSize = 100;
        ctx.strokeStyle = 'rgba(255, 204, 51, 0.05)';
        ctx.lineWidth = 1;
        
        for (let x = 0; x < this.game.canvas.width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, this.game.canvas.height);
            ctx.stroke();
        }
        for (let y = 0; y < this.game.canvas.height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(this.game.canvas.width, y);
            ctx.stroke();
        }
    }

    checkCollision(rect) {
        // Check if a rectangle (e.g., player) intersects with any obstacle
        for (const obs of this.obstacles) {
            if (rect.x < obs.x + obs.width &&
                rect.x + rect.width > obs.x &&
                rect.y < obs.y + obs.height &&
                rect.y + rect.height > obs.y) {
                return true;
            }
        }
        return false;
    }
}
