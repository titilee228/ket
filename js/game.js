/**
 * ==========================================
 * 填字游戏 - 主模块 (修复版)
 * 修复点：
 * 1. 自动识别是否独立运行 (兼容 aa-秒开版.html)
 * 2. 暴露 GameController 给全局，修复按钮点击无效问题
 * 3. 补全了“显示答案”功能
 * ==========================================
 */

// ==================== 游戏配置 ====================

const CONFIG = {
    difficultyNames: {
        easy: '简单',
        medium: '中等',
        hard: '困难'
    },
    animationDelay: 200,
    storageKey: 'crossword_game_state'
};

// ==================== 工具函数 ====================

const Utils = {
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
};

// ==================== 事件系统 ====================

const EventBus = {
    events: {},
    on(event, callback) {
        if (!this.events[event]) this.events[event] = [];
        this.events[event].push(callback);
    },
    emit(event, data) {
        if (!this.events[event]) return;
        this.events[event].forEach(cb => {
            try { cb(data); } catch (e) { console.error(e); }
        });
    }
};

// ==================== 题库加载器 ====================

const PuzzleLoader = {
    _getPuzzleDB() {
        if (typeof PUZZLE_DB !== 'undefined') return PUZZLE_DB;
        if (typeof PUZZLE_DB_AA !== 'undefined') return PUZZLE_DB_AA;
        return null;
    },
    
    _getPuzzles(difficulty) {
        const db = this._getPuzzleDB();
        if (!db) return null;
        if (db.puzzles && db.puzzles[difficulty]) return db.puzzles[difficulty];
        if (db[difficulty]) return db[difficulty];
        return null;
    },
    
    getRandomPuzzle(difficulty) {
        const db = this._getPuzzleDB();
        if (!db) {
            console.error('❌ 题库未加载');
            return null;
        }
        
        const puzzles = this._getPuzzles(difficulty);
        if (!puzzles || puzzles.length === 0) return null;
        
        const index = Math.floor(Math.random() * puzzles.length);
        const puzzle = puzzles[index];
        
        // 格式转换：处理压缩数组格式
        if (!puzzle.gridSize && (puzzle[0] || Array.isArray(puzzle))) {
            return this._convertPuzzleFormat(puzzle, difficulty, index);
        }
        
        return { ...puzzle, difficulty, index };
    },

    getPuzzleByIndex(difficulty, index) {
        const puzzles = this._getPuzzles(difficulty);
        if (!puzzles || !puzzles[index]) return null;
        
        let puzzle = puzzles[index];
        if (!puzzle.gridSize && (puzzle[0] || Array.isArray(puzzle))) {
            return this._convertPuzzleFormat(puzzle, difficulty, index);
        }
        
        return { ...puzzle, difficulty, index };
    },
    
    _convertPuzzleFormat(wordsArray, difficulty, index) {
        let maxRow = 0, maxCol = 0;
        wordsArray.forEach(word => {
            const endRow = word.d === 'H' ? word.r : word.r + word.w.length - 1;
            const endCol = word.d === 'H' ? word.c + word.w.length - 1 : word.c;
            maxRow = Math.max(maxRow, endRow);
            maxCol = Math.max(maxCol, endCol);
        });
        
        let gridSize;
        if (difficulty === 'easy') gridSize = { rows: 10, cols: 10 };
        else if (difficulty === 'medium') gridSize = { rows: 13, cols: 13 };
        else gridSize = { rows: 16, cols: 16 };
        
        gridSize.rows = Math.max(gridSize.rows, maxRow + 1);
        gridSize.cols = Math.max(gridSize.cols, maxCol + 1);
        
        return { gridSize, words: wordsArray, difficulty, index };
    }
};

// ==================== 网格管理器 ====================

const GridManager = {
    grid: null,
    puzzle: null,
    
    init(puzzle) {
        this.puzzle = puzzle;
        const { rows, cols } = puzzle.gridSize;
        
        this.grid = [];
        for (let r = 0; r < rows; r++) {
            this.grid[r] = [];
            for (let c = 0; c < cols; c++) {
                this.grid[r][c] = {
                    char: '', correct: '', isBlack: true, number: null, wordIds: []
                };
            }
        }
        
        puzzle.words.forEach(word => {
            const wordId = `${word.d}${word.n}`;
            for (let i = 0; i < word.w.length; i++) {
                const r = word.d === 'H' ? word.r : word.r + i;
                const c = word.d === 'H' ? word.c + i : word.c;
                
                if (r >= 0 && r < rows && c >= 0 && c < cols) {
                    this.grid[r][c].correct = word.w[i];
                    this.grid[r][c].isBlack = false;
                    this.grid[r][c].wordIds.push(wordId);
                    if (i === 0) this.grid[r][c].number = word.n;
                }
            }
        });
    },
    
    getCell(row, col) {
        if (!this.grid || row < 0 || row >= this.grid.length) return null;
        return this.grid[row][col];
    },
    
    setCell(row, col, char) {
        const cell = this.getCell(row, col);
        if (cell && !cell.isBlack) {
            cell.char = char.toUpperCase();
            return true;
        }
        return false;
    },
    
    getWordCells(wordData) {
        const cells = [];
        for (let i = 0; i < wordData.w.length; i++) {
            const r = wordData.d === 'H' ? wordData.r : wordData.r + i;
            const c = wordData.d === 'H' ? wordData.c + i : wordData.c;
            cells.push({ row: r, col: c });
        }
        return cells;
    },

    clearInput() {
        if (!this.grid) return;
        this.grid.forEach(row => row.forEach(cell => {
            if (!cell.isBlack) cell.char = '';
        }));
    },
    
    getSize() {
        if (!this.grid) return { rows: 0, cols: 0 };
        return { rows: this.grid.length, cols: this.grid[0].length };
    }
};

// ==================== 验证器 ====================

const Validator = {
    validatePuzzle(puzzle) {
        const results = { isComplete: true, correctCount: 0, totalCount: puzzle.words.length, details: [] };
        
        puzzle.words.forEach(word => {
            const cells = GridManager.getWordCells(word);
            let currentWord = '';
            cells.forEach(({row, col}) => {
                const cell = GridManager.getCell(row, col);
                currentWord += cell ? cell.char : '';
            });
            
            const isCorrect = currentWord === word.w;
            results.details.push({
                wordId: `${word.d}${word.n}`,
                isCorrect,
                userInput: cells.map(c => GridManager.getCell(c.row, c.col)?.char || '')
            });
            if (isCorrect) results.correctCount++;
            else results.isComplete = false;
        });
        return results;
    }
};

// ==================== 输入处理器 ====================

const InputHandler = {
    selection: { row: -1, col: -1, direction: 'H', wordData: null },
    
    init() {
        this.selection = { row: -1, col: -1, direction: 'H', wordData: null };
    },
    
    handleCellClick(row, col) {
        const cell = GridManager.getCell(row, col);
        if (!cell || cell.isBlack) return;
        
        if (this.selection.row === row && this.selection.col === col) {
            this.selection.direction = this.selection.direction === 'H' ? 'V' : 'H';
        } else {
            this.selection.row = row;
            this.selection.col = col;
        }
        
        this._updateCurrentWord();
        EventBus.emit('selection:change', { ...this.selection });
    },
    
    handleKeyDown(event) {
        const { row, col } = this.selection;
        if (row < 0 || col < 0) return;
        
        const key = event.key;
        if (/^[a-zA-Z]$/.test(key)) {
            event.preventDefault();
            if (GridManager.setCell(row, col, key.toUpperCase())) {
                EventBus.emit('cell:input', { row, col, char: key.toUpperCase() });
                this._moveCursor(1);
            }
        } else if (key === 'Backspace') {
            event.preventDefault();
            const cell = GridManager.getCell(row, col);
            if (cell && cell.char) {
                GridManager.setCell(row, col, '');
                EventBus.emit('cell:input', { row, col, char: '' });
            } else {
                this._moveCursor(-1);
                const newPos = this.selection;
                GridManager.setCell(newPos.row, newPos.col, '');
                EventBus.emit('cell:input', { row: newPos.row, col: newPos.col, char: '' });
            }
        } else if (key === ' ') {
            event.preventDefault();
            this.selection.direction = this.selection.direction === 'H' ? 'V' : 'H';
            this._updateCurrentWord();
            EventBus.emit('selection:change', { ...this.selection });
        } else if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
            event.preventDefault();
            this._handleArrowKey(key);
        } else if (key === 'Tab') {
            event.preventDefault();
            this._moveToNextWord(event.shiftKey);
        }
    },
    
    _handleArrowKey(key) {
        let dRow = 0, dCol = 0;
        if (key === 'ArrowUp') dRow = -1;
        if (key === 'ArrowDown') dRow = 1;
        if (key === 'ArrowLeft') dCol = -1;
        if (key === 'ArrowRight') dCol = 1;
        
        const newRow = this.selection.row + dRow;
        const newCol = this.selection.col + dCol;
        const cell = GridManager.getCell(newRow, newCol);
        if (cell && !cell.isBlack) {
            this.selection.row = newRow;
            this.selection.col = newCol;
            this._updateCurrentWord();
            EventBus.emit('selection:change', { ...this.selection });
        }
    },

    _moveCursor(delta) {
        const { row, col, direction } = this.selection;
        let r = row, c = col;
        if (direction === 'H') c += delta; else r += delta;
        
        const cell = GridManager.getCell(r, c);
        if (cell && !cell.isBlack) {
            this.selection.row = r;
            this.selection.col = c;
            this._updateCurrentWord();
            EventBus.emit('selection:change', { ...this.selection });
        }
    },

    _moveToNextWord(reverse) {
        const puzzle = GridManager.puzzle;
        if (!puzzle) return;
        const idx = puzzle.words.findIndex(w => w === this.selection.wordData);
        let nextIdx = reverse ? idx - 1 : idx + 1;
        if (nextIdx < 0) nextIdx = puzzle.words.length - 1;
        if (nextIdx >= puzzle.words.length) nextIdx = 0;
        
        this.selectWord(puzzle.words[nextIdx]);
    },
    
    _updateCurrentWord() {
        const { row, col, direction } = this.selection;
        const puzzle = GridManager.puzzle;
        if (!puzzle) return;
        
        const isInside = (w, r, c) => (w.d === 'H') ? (r === w.r && c >= w.c && c < w.c + w.w.length) : (c === w.c && r >= w.r && r < w.r + w.w.length);
        
        let word = puzzle.words.find(w => w.d === direction && isInside(w, row, col));
        if (!word) {
            const otherDir = direction === 'H' ? 'V' : 'H';
            word = puzzle.words.find(w => w.d === otherDir && isInside(w, row, col));
            if (word) this.selection.direction = otherDir;
        }
        this.selection.wordData = word || null;
    },
    
    selectWord(wordData) {
        this.selection.row = wordData.r;
        this.selection.col = wordData.c;
        this.selection.direction = wordData.d;
        this.selection.wordData = wordData;
        EventBus.emit('selection:change', { ...this.selection });
    }
};

// ==================== 渲染器 ====================

const Renderer = {
    elements: {},
    
    init() {
        this.elements = {
            gridContainer: document.getElementById('grid-container'),
            hintsAcross: document.getElementById('hints-across'),
            hintsDown: document.getElementById('hints-down'),
            currentWord: document.getElementById('current-word'),
            timer: document.getElementById('timer'),
            progress: document.getElementById('progress'),
            difficulty: document.getElementById('difficulty-display')
        };
    },
    
    renderGrid(puzzle) {
        if (!this.elements.gridContainer) return;
        const { rows, cols } = GridManager.getSize();
        
        let html = '<table class="crossword-grid">';
        for (let r = 0; r < rows; r++) {
            html += '<tr>';
            for (let c = 0; c < cols; c++) {
                const cell = GridManager.getCell(r, c);
                if (cell.isBlack) {
                    html += '<td class="cell black"></td>';
                } else {
                    const numberHtml = cell.number ? `<span class="cell-number">${cell.number}</span>` : '';
                    html += `<td class="cell" data-row="${r}" data-col="${c}">
                                ${numberHtml}
                                <input type="text" maxlength="1" class="cell-input" data-row="${r}" data-col="${c}" readonly>
                             </td>`;
                }
            }
            html += '</tr>';
        }
        html += '</table>';
        this.elements.gridContainer.innerHTML = html;
        
        // 绑定网格点击
        this.elements.gridContainer.onclick = (e) => {
            const cell = e.target.closest('.cell');
            if (cell && !cell.classList.contains('black')) {
                InputHandler.handleCellClick(parseInt(cell.dataset.row), parseInt(cell.dataset.col));
            }
        };
    },
    
    renderHints(puzzle) {
        const renderList = (words) => words.map(w => `
            <li class="hint-item" data-word-id="${w.d}${w.n}" onclick="GameController.selectHint('${w.d}', ${w.n})">
                <span class="hint-number">${w.n}.</span>
                <span class="hint-text">${w.h}</span>
            </li>`).join('');
            
        if (this.elements.hintsAcross) {
            this.elements.hintsAcross.innerHTML = renderList(puzzle.words.filter(w => w.d === 'H').sort((a,b)=>a.n-b.n));
        }
        if (this.elements.hintsDown) {
            this.elements.hintsDown.innerHTML = renderList(puzzle.words.filter(w => w.d === 'V').sort((a,b)=>a.n-b.n));
        }
    },
    
    updateSelection(selection) {
        const container = this.elements.gridContainer;
        if (!container) return;
        
        container.querySelectorAll('.cell.selected, .cell.highlighted').forEach(el => 
            el.classList.remove('selected', 'highlighted'));
        document.querySelectorAll('.hint-item.active').forEach(el => el.classList.remove('active'));
        
        if (selection.wordData) {
            GridManager.getWordCells(selection.wordData).forEach(({row, col}) => {
                const cell = container.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
                if (cell) cell.classList.add('highlighted');
            });
            
            const hint = document.querySelector(`.hint-item[data-word-id="${selection.wordData.d}${selection.wordData.n}"]`);
            if (hint) {
                hint.classList.add('active');
                hint.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
            
            if (this.elements.currentWord) {
                const dir = selection.wordData.d === 'H' ? '横向' : '纵向';
                this.elements.currentWord.innerHTML = `当前: <strong>${selection.wordData.n}${dir}</strong> - ${selection.wordData.h}`;
            }
        }
        
        if (selection.row >= 0) {
            const cell = container.querySelector(`.cell[data-row="${selection.row}"][data-col="${selection.col}"]`);
            if (cell) cell.classList.add('selected');
        }
    },
    
    updateCell(row, col) {
        const cell = GridManager.getCell(row, col);
        const input = this.elements.gridContainer.querySelector(`.cell-input[data-row="${row}"][data-col="${col}"]`);
        if (input && cell) input.value = cell.char;
    },
    
    showValidationResult(results) {
        const container = this.elements.gridContainer;
        container.querySelectorAll('.cell.correct, .cell.incorrect').forEach(el => el.classList.remove('correct', 'incorrect'));
        
        results.details.forEach(detail => {
            const word = GridManager.puzzle.words.find(w => `${w.d}${w.n}` === detail.wordId);
            if (word) {
                GridManager.getWordCells(word).forEach(({row, col}, i) => {
                    const el = container.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
                    if (el) {
                        if (detail.userInput[i] === word.w[i]) el.classList.add('correct');
                        else if (detail.userInput[i]) el.classList.add('incorrect');
                    }
                });
            }
        });
    },
    
    updateTimer(seconds) {
        if (this.elements.timer) this.elements.timer.textContent = Utils.formatTime(seconds);
    },
    
    updateDifficulty(diff) {
        if (this.elements.difficulty) this.elements.difficulty.textContent = CONFIG.difficultyNames[diff] || diff;
    },
    
    updateProgress(completed, total) {
        if (this.elements.progress) this.elements.progress.textContent = `${completed}/${total}`;
    }
};

// ==================== 计时器 ====================

const Timer = {
    seconds: 0,
    interval: null,
    
    start() {
        if (this.interval) return;
        this.interval = setInterval(() => {
            this.seconds++;
            Renderer.updateTimer(this.seconds);
        }, 1000);
    },
    pause() {
        clearInterval(this.interval);
        this.interval = null;
    },
    reset() {
        this.pause();
        this.seconds = 0;
        Renderer.updateTimer(0);
    },
    getTime() { return this.seconds; }
};

// ==================== 游戏控制器 ====================

const GameController = {
    currentPuzzle: null,
    currentDifficulty: 'medium',
    isPlaying: false,
    
    init() {
        Renderer.init();
        this._bindEvents();
        this._bindButtons();
        
        // 关键：标记已初始化，防止 app.js 重复初始化
        window.CROSSWORD_GAME_INITIALIZED = true;
    },
    
    _bindEvents() {
        EventBus.on('selection:change', sel => Renderer.updateSelection(sel));
        EventBus.on('cell:input', ({row, col}) => {
            Renderer.updateCell(row, col);
        });
        
        document.addEventListener('keydown', (e) => {
            if (!e.target.classList.contains('cell-input')) {
                InputHandler.handleKeyDown(e);
            }
        });
    },
    
    _bindButtons() {
        const bind = (id, fn) => {
            const el = document.getElementById(id);
            if (el) el.addEventListener('click', fn.bind(this));
        };
        
        bind('btn-new-game', () => this.newGame(this.currentDifficulty));
        bind('difficulty-select', (e) => {
            this.currentDifficulty = e.target.value;
            this.newGame(this.currentDifficulty);
        });
        bind('btn-check', this.checkAnswers);
        bind('btn-hint', this.revealLetter);
        bind('btn-reveal', this.revealPuzzle); // 绑定显示答案按钮
        bind('btn-reset', this.resetPuzzle);
        bind('btn-next-puzzle', () => this.newGame(this.currentDifficulty));
    },
    
    newGame(difficulty) {
        this.currentDifficulty = difficulty || this.currentDifficulty;
        const puzzle = PuzzleLoader.getRandomPuzzle(this.currentDifficulty);
        
        if (!puzzle) {
            console.error('无法加载谜题');
            return;
        }
        
        this.currentPuzzle = puzzle;
        this.isPlaying = true;
        
        GridManager.init(puzzle);
        InputHandler.init();
        Timer.reset();
        
        Renderer.renderGrid(puzzle);
        Renderer.renderHints(puzzle);
        Renderer.updateDifficulty(this.currentDifficulty);
        Renderer.updateProgress(0, puzzle.words.length);
        
        if (puzzle.words.length > 0) {
            InputHandler.selectWord(puzzle.words[0]);
        }
        
        Timer.start();
    },
    
    checkAnswers() {
        if (!this.currentPuzzle) return;
        const results = Validator.validatePuzzle(this.currentPuzzle);
        Renderer.showValidationResult(results);
        
        if (results.isComplete) {
            Timer.pause();
            
            // 安全调用 StorageManager（防止报错）
            if (typeof StorageManager !== 'undefined') {
                StorageManager.updateStatistics({
                    completed: true,
                    time: Timer.getTime(),
                    words: results.totalCount,
                    difficulty: this.currentDifficulty
                });
            }
            alert(`恭喜！完成时间：${Utils.formatTime(Timer.getTime())}`);
        }
    },
    
    revealLetter() {
        const { row, col } = InputHandler.selection;
        const cell = GridManager.getCell(row, col);
        if (cell && !cell.isBlack && !cell.char) {
            GridManager.setCell(row, col, cell.correct);
            Renderer.updateCell(row, col);
        }
    },
    
    revealPuzzle() {
        if (!this.currentPuzzle || !confirm('确定要显示所有答案吗？挑战将结束。')) return;
        Timer.pause();
        const { rows, cols } = GridManager.getSize();
        for(let r=0; r<rows; r++) {
            for(let c=0; c<cols; c++) {
                const cell = GridManager.getCell(r, c);
                if(cell && !cell.isBlack) {
                    GridManager.setCell(r, c, cell.correct);
                    Renderer.updateCell(r, c);
                }
            }
        }
        this.isPlaying = false;
        Renderer.showValidationResult({ details: [] });
    },
    
    resetPuzzle() {
        if (confirm('重置当前谜题？')) {
            GridManager.clearInput();
            Renderer.renderGrid(this.currentPuzzle);
            Timer.reset();
            Timer.start();
        }
    },
    
    selectHint(dir, n) {
        const word = this.currentPuzzle.words.find(w => w.d === dir && w.n === n);
        if (word) InputHandler.selectWord(word);
    },
    
    // 供 App 调用
    saveCurrentState() { return {}; },
    restoreSavedGame() { return false; }
};

// ==================== 暴露与初始化 ====================

// 1. 暴露给全局 (修复 aa-秒开版.html 报错)
window.GameController = GameController;

// 2. 智能初始化 (修复无法启动问题)
// 如果 100ms 内没有其他脚本（如 app.js）接管，则自动启动
setTimeout(() => {
    if (!window.CROSSWORD_APP_INITIALIZED) {
        console.log('🚀 独立模式启动...');
        GameController.init();
        GameController.newGame('medium');
    }
}, 100);
