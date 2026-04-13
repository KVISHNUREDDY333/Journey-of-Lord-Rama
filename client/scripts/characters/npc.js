export class NPC {
    constructor(name, x, y, options = {}) {
        this.name = name;
        this.position = { x, y };
        this.width = 50;
        this.height = 80;
        this.color = options.color || '#ffffff';
        this.dialogueTriggered = false;
    }

    draw(ctx) {
        // Simple Sage representation (Orange robes)
        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
        
        // Halo effect
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.beginPath();
        ctx.arc(this.position.x + this.width/2, this.position.y + 20, 40, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#fff';
        ctx.font = '14px Cinzel';
        ctx.textAlign = 'center';
        ctx.fillText(this.name, this.position.x + this.width/2, this.position.y - 10);
    }
}
