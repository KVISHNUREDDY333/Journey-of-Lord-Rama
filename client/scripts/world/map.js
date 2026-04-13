export const AYODHYA_MAP = {
    name: "Ayodhya Gates",
    width: 2000,
    height: 1000,
    obstacles: [
        { x: 400, y: 0, width: 50, height: 400, type: 'pillar', color: '#c0c0c0' },
        { x: 400, y: 600, width: 50, height: 400, type: 'pillar', color: '#c0c0c0' },
        { x: 800, y: 200, width: 400, height: 50, type: 'wall', color: '#8b4513' },
        { x: 800, y: 700, width: 400, height: 50, type: 'wall', color: '#8b4513' },
        { x: 1400, y: 400, width: 200, height: 200, type: 'altar', color: '#ffd700' }
    ],
    npc: {
        x: 300, y: 500, name: "Sage Vishvamitra", color: "#ff8c00"
    },
    decorations: [
        { x: 200, y: 200, type: 'flower' },
        { x: 200, y: 800, type: 'flower' },
        { x: 1000, y: 450, type: 'statue' }
    ]
};
