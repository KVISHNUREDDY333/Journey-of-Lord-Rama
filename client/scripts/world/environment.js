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
        this.drawFloor(ctx);
        this.drawObstacles(ctx);
        this.drawDecorations(ctx);
        this.npcs.forEach(npc => npc.draw(ctx));
    }

    drawFloor(ctx) {
        const { width, height } = this.game.canvas;
        
        // Base ground color (Warm Sand)
        ctx.fillStyle = '#f5deb3';
        ctx.fillRect(-this.game.camera.x, -this.game.camera.y, this.map.width, this.map.height);

        // Luxury Tile Grid
        const gridSize = 100;
        ctx.strokeStyle = 'rgba(139, 69, 19, 0.1)';
        ctx.lineWidth = 1;
        
        for (let x = 0; x <= this.map.width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, this.map.height);
            ctx.stroke();
        }
        for (let y = 0; y <= this.map.height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(this.map.width, y);
            ctx.stroke();
        }
    }

    drawObstacles(ctx) {
        this.obstacles.forEach(obs => {
            // Gradient for depth
            const grad = ctx.createLinearGradient(obs.x, obs.y, obs.x, obs.y + obs.height);
            grad.addColorStop(0, obs.color);
            grad.addColorStop(1, this.calculateShadowColor(obs.color));
            
            ctx.fillStyle = grad;
            ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
            
            // Accents
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.strokeRect(obs.x, obs.y, obs.width, obs.height);
        });
    }

    drawDecorations(ctx) {
        this.map.decorations.forEach(dec => {
            if (dec.type === 'lotus_pond') {
                ctx.fillStyle = '#4682b4';
                ctx.beginPath();
                ctx.ellipse(dec.x, dec.y, dec.width/2, dec.height/2, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = '#87ceeb';
                ctx.stroke();
            }
        });
    }

    calculateShadowColor(hex) {
        // Simple mock for a darker version of the color
        return hex === '#ffd700' ? '#b8860b' : '#3d1f00';
    }

    checkCollision(rect) {
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
