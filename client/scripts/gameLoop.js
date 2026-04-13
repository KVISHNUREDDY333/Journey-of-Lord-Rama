export class GameLoop {
    constructor(game) {
        this.game = game;
        this.lastTime = 0;
        this.running = false;
    }

    start() {
        if (this.running) return;
        this.running = true;
        requestAnimationFrame(this.loop.bind(this));
    }

    stop() {
        this.running = false;
    }

    loop(timestamp) {
        if (!this.running) return;

        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;

        this.update(deltaTime);
        this.render();

        requestAnimationFrame(this.loop.bind(this));
    }

    update(deltaTime) {
        if (!this.game.player) return;
        this.game.player.update(deltaTime);
        this.game.camera.update();
        this.game.story.update();
    }

    render() {
        this.game.renderer.draw();
    }
}
