import { api } from '../api/apiClient.js';

export class DialogueSystem {
    constructor() {
        this.box = document.getElementById('dialogue-box');
        this.speaker = this.box.querySelector('.speaker-name');
        this.text = this.box.querySelector('.text-content');
        this.choices = this.box.querySelector('.choices');
        this.nextBtn = document.getElementById('dialogue-next');
        
        this.isTyping = false;
        this.currentText = "";
        this.typingSpeed = 30; // ms per character
        
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
        this.speaker.innerText = character;
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

    async typeMessage(message) {
        this.isTyping = true;
        this.currentText = message;
        this.text.innerText = "";
        this.nextBtn.classList.add('hidden');

        for (let i = 0; i < message.length; i++) {
            if (!this.isTyping) break; // Skip if user force-finished
            this.text.innerText += message[i];
            await new Promise(r => setTimeout(r, this.typingSpeed));
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
