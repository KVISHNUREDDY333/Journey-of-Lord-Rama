import { GameLoop } from './gameLoop.js';
import { UIManager } from './ui/menu.js';
import { Renderer } from './engine/renderer.js';
import { DialogueSystem } from './story/dialogueSystem.js';
import { InputHandler } from './inputHandler.js';
import { Player } from './characters/rama.js';
import { Environment } from './world/environment.js';
import { Camera } from './engine/camera.js';
import { StoryEngine } from './story/storyEngine.js';

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.input = new InputHandler();
        this.world = new Environment(this);
        this.player = new Player(this);
        this.camera = new Camera(this);
        this.story = new StoryEngine(this);
        
        this.camera.follow(this.player);
        
        this.ui = new UIManager(this);
        this.dialogue = new DialogueSystem();
        this.renderer = new Renderer(this);
        this.loop = new GameLoop(this);
        
        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        // Start loading sequence
        this.loadAssets().then(() => {
            this.ui.showMainMenu();
        });
    }

    async loadAssets() {
        // Simulate asset loading
        const loader = document.getElementById('loading-progress');
        for(let i = 0; i <= 100; i += 5) {
            loader.style.width = `${i}%`;
            await new Promise(r => setTimeout(r, 100));
        }
        document.getElementById('loading-screen').classList.add('hidden');
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
}

// Initialize the game
window.addEventListener('load', () => {
    window.game = new Game();
});
