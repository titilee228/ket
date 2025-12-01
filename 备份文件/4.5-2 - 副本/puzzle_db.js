// 题库数据 - 包含预设的填字游戏谜题
const PUZZLE_DB = {
    version: "1.0.0",
    puzzles: {
        // ===== 简单难度 =====
        easy: [
            {
                gridSize: { rows: 8, cols: 8 },
                words: [
                    { w: "CAT", r: 1, c: 2, d: "H", h: "A small pet that says meow", n: 1 },
                    { w: "DOG", r: 3, c: 1, d: "H", h: "A pet that barks", n: 2 },
                    { w: "COW", r: 1, c: 2, d: "V", h: "An animal that gives milk", n: 1 },
                    { w: "OWL", r: 3, c: 3, d: "V", h: "A bird that hoots at night", n: 3 }
                ]
            },
            {
                gridSize: { rows: 8, cols: 8 },
                words: [
                    { w: "SUN", r: 2, c: 1, d: "H", h: "It shines in the sky during day", n: 1 },
                    { w: "MOON", r: 4, c: 0, d: "H", h: "It shines at night", n: 2 },
                    { w: "STAR", r: 1, c: 3, d: "V", h: "It twinkles in the sky", n: 3 },
                    { w: "SKY", r: 2, c: 1, d: "V", h: "Look up and you see it", n: 1 }
                ]
            }
        ],
        
        // ===== 中等难度 =====
        medium: [
            {
                gridSize: { rows: 10, cols: 10 },
                words: [
                    { w: "APPLE", r: 2, c: 1, d: "H", h: "A red or green fruit", n: 1 },
                    { w: "PEARL", r: 2, c: 2, d: "V", h: "A gem found in oysters", n: 2 },
                    { w: "LEMON", r: 4, c: 4, d: "H", h: "A sour yellow fruit", n: 3 },
                    { w: "GRAPE", r: 6, c: 2, d: "H", h: "Small fruit used for wine", n: 4 },
                    { w: "PEACH", r: 4, c: 4, d: "V", h: "A fuzzy sweet fruit", n: 3 }
                ]
            },
            {
                gridSize: { rows: 10, cols: 10 },
                words: [
                    { w: "WATER", r: 1, c: 2, d: "H", h: "You drink this every day", n: 1 },
                    { w: "BREAD", r: 3, c: 1, d: "H", h: "Made from flour, baked", n: 2 },
                    { w: "RICE", r: 5, c: 3, d: "H", h: "Asian staple food", n: 3 },
                    { w: "WHEAT", r: 1, c: 2, d: "V", h: "Grain used to make flour", n: 1 },
                    { w: "EGG", r: 3, c: 5, d: "V", h: "Laid by a chicken", n: 4 }
                ]
            }
        ],
        
        // ===== 困难难度 =====
        hard: [
            {
                gridSize: { rows: 12, cols: 12 },
                words: [
                    { w: "COMPUTER", r: 2, c: 1, d: "H", h: "Electronic device for work", n: 1 },
                    { w: "MOUSE", r: 4, c: 3, d: "H", h: "Click with this device", n: 2 },
                    { w: "SCREEN", r: 2, c: 4, d: "V", h: "Display part of computer", n: 3 },
                    { w: "KEYBOARD", r: 6, c: 0, d: "H", h: "Type letters with this", n: 4 },
                    { w: "PRINTER", r: 8, c: 2, d: "H", h: "Makes paper copies", n: 5 },
                    { w: "CABLE", r: 4, c: 3, d: "V", h: "Wire that connects devices", n: 2 }
                ]
            },
            {
                gridSize: { rows: 12, cols: 12 },
                words: [
                    { w: "ELEPHANT", r: 1, c: 1, d: "H", h: "Largest land animal", n: 1 },
                    { w: "TIGER", r: 3, c: 2, d: "H", h: "Striped big cat", n: 2 },
                    { w: "LION", r: 5, c: 4, d: "H", h: "King of the jungle", n: 3 },
                    { w: "EAGLE", r: 1, c: 3, d: "V", h: "Bird with sharp eyes", n: 4 },
                    { w: "GIRAFFE", r: 7, c: 1, d: "H", h: "Animal with long neck", n: 5 },
                    { w: "ZEBRA", r: 3, c: 6, d: "V", h: "Horse with stripes", n: 6 }
                ]
            }
        ]
    }
};