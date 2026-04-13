export class UIManager {
    constructor(game) {
        this.game = game;
        this.screens = {
            loading: document.getElementById('loading-screen'),
            mainMenu: document.getElementById('main-menu'),
            hud: document.getElementById('hud')
        };
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('btn-start').addEventListener('click', () => {
            this.startGame();
        });
    }

    showMainMenu() {
        this.hideAll();
        this.screens.mainMenu.classList.remove('hidden');
    }

    startGame() {
        this.hideAll();
        this.screens.hud.classList.remove('hidden');
        this.game.loop.start();
        
        // Initial AI Dialogue
        this.game.story.startLevel(0);
    }

    showVictoryScreen(levelIndex) {
        alert(`Chapter ${levelIndex + 1} Complete! Your journey continues...`);
        // In a full implementation, this would show a nice UI overlay
    }

    hideAll() {
        Object.values(this.screens).forEach(screen => {
            screen.classList.add('hidden');
        });
    }
}
