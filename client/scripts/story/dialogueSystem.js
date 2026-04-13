import { api } from '../api/apiClient.js';

export class DialogueSystem {
    constructor() {
        this.box = document.getElementById('dialogue-box');
        this.speaker = this.box.querySelector('.speaker-name');
        this.text = this.box.querySelector('.text-content');
        this.portrait = this.box.querySelector('.character-portrait');
        this.nextBtn = document.getElementById('dialogue-next');
        
        this.isTyping = false;
        this.currentText = "";
        this.typingSpeed = 25; 
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.nextBtn.addEventListener('click', () => {
            if (this.isTyping) {
                this.skipTypewriter();
            } else {
                this.hide();
            }
        });
    }

    async speak(character, message, useAI = true) {
        this.show();
        this.updatePortrait(character);
        this.speaker.innerText = character.toUpperCase();
        this.nextBtn.classList.add('hidden');
        
        let finalMessage = message;

        if (useAI) {
            this.text.innerText = "...";
            const response = await api.post('/dialogue/chat', {
                character: character,
                message: message
            });
            finalMessage = response.error ? message : response.response;
        }

        await this.typeMessage(finalMessage);
    }

    updatePortrait(character) {
        // Placeholder colors for portraits
        const colors = {
            'RAMA': '#ffcc33',
            'SAGE VISHVAMITRA': '#ff8c00',
            'NARRATOR': '#8b0000'
        };
        this.portrait.style.backgroundColor = colors[character.toUpperCase()] || '#555';
    }

    async typeMessage(message) {
        this.isTyping = true;
        this.currentText = message;
        this.text.innerText = "";
        this.nextBtn.classList.add('hidden');

        for (let i = 0; i < message.length; i++) {
            if (!this.isTyping) break;
            this.text.innerText += message[i];
            
            // Randomize typing speed slightly for natural feel
            const jitter = Math.random() * 15;
            await new Promise(r => setTimeout(r, this.typingSpeed + jitter));
        }

        this.isTyping = false;
        this.nextBtn.classList.remove('hidden');
    }

    skipTypewriter() {
        this.isTyping = false;
        this.text.innerText = this.currentText;
        this.nextBtn.classList.remove('hidden');
    }

    show() {
        this.box.classList.remove('hidden');
    }

    hide() {
        this.box.classList.add('hidden');
    }
}
