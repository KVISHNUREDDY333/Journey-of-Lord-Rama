export class StoryEngine {
    constructor(game) {
        this.game = game;
        this.currentLevelIndex = 0;
        this.missions = [];
        this.isLevelStarted = false;
    }

    async startLevel(index) {
        this.currentLevelIndex = index;
        const levelData = await this.getLevelData(index);
        
        const titleEl = document.getElementById('level-title');
        if (titleEl) titleEl.innerText = `Level ${index + 1}: ${levelData.title}`;
        
        this.missions = levelData.missions.map(m => ({ ...m, completed: false }));
        this.isLevelStarted = true;
        
        if (levelData.introDialogue) {
            await this.game.dialogue.speak(levelData.introDialogue.character, levelData.introDialogue.text, false);
        }
    }

    async completeLevel() {
        this.isLevelStarted = false;
        alert(`Chapter ${this.currentLevelIndex + 1} Complete: The training is finished. Now, your true journey begins.`);
        
        // Progression to level 2 (Swayamvar) would happen here
        this.currentLevelIndex++;
        // Reset or load level 2 data...
    }

    update() {
        if (!this.isLevelStarted) return;
        
        this.missions.forEach(mission => {
            if (!mission.completed && this.isMissionAvailable(mission)) {
                this.checkMissionStatus(mission);
            }
        });
    }

    isMissionAvailable(mission) {
        // Only allow mission if prerequisites (requiredMissionId) are met
        if (!mission.requiredMissionId) return true;
        const prereq = this.missions.find(m => m.id === mission.requiredMissionId);
        return prereq && prereq.completed;
    }

    checkMissionStatus(mission) {
        const player = this.game.player.position;

        if (mission.type === 'interaction') {
            const target = mission.target;
            const dist = Math.sqrt(Math.pow(player.x - target.x, 2) + Math.pow(player.y - target.y, 2));
            if (dist < 80) {
                this.completeMission(mission);
            }
        } else if (mission.type === 'reach_point') {
            const target = mission.target;
            const dist = Math.sqrt(Math.pow(player.x - target.x, 2) + Math.pow(player.y - target.y, 2));
            if (dist < 100) {
                this.completeMission(mission);
            }
        }
    }

    async completeMission(mission) {
        mission.completed = true;
        console.log(`Mission Complete: ${mission.description}`);
        
        if (mission.dialogue) {
            await this.game.dialogue.speak(mission.dialogue.character, mission.dialogue.text);
        }

        if (mission.isFinal) {
            this.completeLevel();
        }
    }

    async getLevelData(index) {
        // Hardcoded Level 1 Data
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
                        target: { x: 300, y: 500 },
                        description: "Speak with Sage Vishvamitra to receive instruction.",
                        dialogue: {
                            character: "Sage Vishvamitra",
                            text: "Rama, the path of a warrior is not just of strength, but of focus. Go now to the Sacred Altar and prove your speed and resolve."
                        }
                    },
                    {
                        id: 'reach_altar',
                        type: 'reach_point',
                        target: { x: 1400, y: 400 },
                        requiredMissionId: 'talk_to_sage',
                        description: "Reach the Golden Altar to complete your training.",
                        isFinal: true
                    }
                ]
            };
        }
        return { title: "Chapter " + (index + 1), missions: [] };
    }
}
