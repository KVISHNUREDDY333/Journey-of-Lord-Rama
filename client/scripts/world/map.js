export const AYODHYA_MAP = {
    name: "Ayodhya Royal Square",
    width: 2000,
    height: 1200,
    obstacles: [
        // Main Palace Walls (Top & Bottom)
        { x: 0, y: 0, width: 2000, height: 100, type: 'wall', color: '#8b4513' },
        { x: 0, y: 1100, width: 2000, height: 100, type: 'wall', color: '#8b4513' },
        
        // Sacred Gateway (Left)
        { x: 400, y: 100, width: 40, height: 350, type: 'pillar', color: '#c0c0c0' },
        { x: 400, y: 750, width: 40, height: 350, type: 'pillar', color: '#c0c0c0' },
        
        // Inner Courtyard Boundaries
        { x: 800, y: 300, width: 50, height: 600, type: 'inner_wall', color: '#a0522d' },
        { x: 1200, y: 300, width: 50, height: 600, type: 'inner_wall', color: '#a0522d' },
        
        // Temple Structures
        { x: 1400, y: 450, width: 300, height: 300, type: 'temple', color: '#ffd700' },
        
        // Residential Blocks
        { x: 100, y: 200, width: 150, height: 150, type: 'house', color: '#cd853f' },
        { x: 100, y: 850, width: 150, height: 150, type: 'house', color: '#cd853f' }
    ],
    npc: {
        x: 350, y: 550, name: "Sage Vishvamitra", color: "#ff8c00"
    },
    decorations: [
        { x: 500, y: 200, type: 'garden_stone' },
        { x: 500, y: 900, type: 'garden_stone' },
        { x: 1000, y: 600, type: 'lotus_pond', width: 150, height: 100 }
    ]
};
