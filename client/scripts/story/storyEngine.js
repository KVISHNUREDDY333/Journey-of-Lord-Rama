import { api } from '../api/apiClient.js';

export class StoryEngine {
    constructor(game) {
        this.game = game;
        this.currentLevelIndex = 0;
        this.missions = [];
        this.activeMissions = [];
        this.isLevelStarted = false;
        
        // UI Cache
        this.missionBox = null;
    }

    async startLevel(index) {
        this.currentLevelIndex = index;
        const levelData = await this.getLevelData(index);
        
        // Sync with HUD
        const titleEl = document.getElementById('level-title');
        if (titleEl) titleEl.innerText = `LEVEL ${index + 1}: ${levelData.title.toUpperCase()}`;
        
        // Setup Missions
        this.missions = levelData.missions.map(m => ({ ...m, completed: false }));
        this.activeMissions = this.missions.filter(m => !m.requiredMissionId);
        
        this.isLevelStarted = true;
        this.updateMissionHUD();

        // Initial Cutscene
        if (levelData.introDialogue) {
            await this.game.dialogue.speak(levelData.introDialogue.character, levelData.introDialogue.text, false);
        }
        
        // Save progress to backend
        this.saveProgress();
    }

    async saveProgress() {
        await api.post('/progress/save', {
            levelIndex: this.currentLevelIndex,
            timestamp: Date.now()
        });
    }

    update() {
        if (!this.isLevelStarted) return;
        
        // Process Active Missions
        this.activeMissions.forEach(mission => {
            if (!mission.completed) {
                this.checkMissionStatus(mission);
            }
        });
    }

    checkMissionStatus(mission) {
        const player = this.game.player.position;

        if (mission.type === 'interaction') {
            const target = mission.target;
            const dist = Math.sqrt(Math.pow(player.x - target.x, 2) + Math.pow(player.y - target.y, 2));
            if (dist < 80) this.completeMission(mission);
        } else if (mission.type === 'reach_point') {
            const target = mission.target;
            const dist = Math.sqrt(Math.pow(player.x - target.x, 2) + Math.pow(player.y - target.y, 2));
            if (dist < 100) this.completeMission(mission);
        }
    }

    async completeMission(mission) {
        mission.completed = true;
        console.log(`Dharma Path: ${mission.description} (Complete)`);
        
        // Logic for unlocking next missions in sequence
        this.unlockNextMissions(mission.id);
        this.updateMissionHUD();

        if (mission.dialogue) {
            await this.game.dialogue.speak(mission.dialogue.character, mission.dialogue.text);
        }

        if (mission.isFinal) {
            this.completeLevel();
        }
    }

    unlockNextMissions(completedId) {
        const next = this.missions.filter(m => m.requiredMissionId === completedId);
        this.activeMissions.push(...next);
    }

    updateMissionHUD() {
        // Find or create mission HUD
        let hud = document.getElementById('mission-objective');
        if (!hud) {
            hud = document.createElement('div');
            hud.id = 'mission-objective';
            document.body.appendChild(hud);
        }
        
        const currentMissions = this.activeMissions.filter(m => !m.completed);
        if (currentMissions.length > 0) {
            hud.innerHTML = `<span>CURRENT DHARMA:</span><br>${currentMissions[0].description}`;
            hud.classList.remove('hidden');
        } else {
            hud.classList.add('hidden');
        }
    }

    async completeLevel() {
        this.isLevelStarted = false;
        this.game.ui.showVictoryScreen(this.currentLevelIndex);
        this.currentLevelIndex++;
    }

    async getLevelData(index) {
        // Full Level 1 Roadmap
        if (index === 0) {
            return {
                title: "The Childhood Training",
                introDialogue: {
                    character: "Narrator",
                    text: "In the golden city of Ayodhya, Prince Rama begins his training under the watchful eye of Sage Vishvamitra."
                },
                missions: [
                    {
                        id: 'talk_to_sage',
                        type: 'interaction',
                        target: { x: 350, y: 550 },
                        description: "Speak with Sage Vishvamitra",
                        dialogue: {
                            character: "Sage Vishvamitra",
                            text: "Rama, the path of a warrior is not just of strength, but of focus. Go now to the Temple Altar and prove your resolve."
                        }
                    },
                    {
                        id: 'reach_altar',
                        type: 'reach_point',
                        target: { x: 1400, y: 450 },
                        requiredMissionId: 'talk_to_sage',
                        description: "Reach the Sacred Golden Altar",
                        isFinal: true
                    }
                ]
            };
        }
        return { title: "Chapter " + (index + 1), missions: [] };
    }
}
