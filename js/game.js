/**
 * ==========================================
 * 填字游戏 - 主模块
 * ==========================================
 */

// ==================== 游戏配置 ====================

const CONFIG = {
    // 难度名称映射
    difficultyNames: {
        easy: '简单',
        medium: '中等',
        hard: '困难'
    },
    
    // 动画延迟(ms)
    animationDelay: 200,
    
    // 自动保存间隔(ms)
    autoSaveInterval: 30000,
    
    // 本地存储键名
    storageKey: 'crossword_game_state'
};

// ==================== 工具函数 ====================

const Utils = {
    /**
     * 生成唯一ID
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },
    
    /**
     * 格式化时间(秒 -> MM:SS)
     */
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    },
    
    /**
     * 防抖函数
     */
    debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    },
    
    /**
     * 深拷贝对象
     */
    deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }
};

// ==================== 事件系统 ====================

const EventBus = {
    events: {},
    
    /**
     * 订阅事件
     */
    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
        
        // 返回取消订阅函数
        return () => this.off(event, callback);
    },
    
    /**
     * 取消订阅
     */
    off(event, callback) {
        if (!this.events[event]) return;
        this.events[event] = this.events[event].filter(cb => cb !== callback);
    },
    
    /**
     * 触发事件
     */
    emit(event, data) {
        if (!this.events[event]) return;
        this.events[event].forEach(callback => {
            try {
                callback(data);
            } catch (e) {
                console.error(`Event handler error for ${event}:`, e);
            }
        });
    }
};

// ==================== 题库加载器 ====================

const PuzzleLoader = {
    /**
     * 获取题库对象（兼容不同的变量名和数据结构）
     */
    _getPuzzleDB() {
        // 尝试不同的变量名
        if (typeof PUZZLE_DB !== 'undefined') {
            return PUZZLE_DB;
        }
        if (typeof PUZZLE_DB_AA !== 'undefined') {
            return PUZZLE_DB_AA;
        }
        return null;
    },
    
    /**
     * 获取指定难度的谜题数组
     */
    _getPuzzles(difficulty) {
        const db = this._getPuzzleDB();
        if (!db) return null;
        
        // 兼容不同的数据结构
        if (db.puzzles && db.puzzles[difficulty]) {
            return db.puzzles[difficulty];
        }
        if (db[difficulty]) {
            return db[difficulty];
        }
        return null;
    },
    
    /**
     * 获取随机谜题
     */
    getRandomPuzzle(difficulty) {
        console.log(`🔍 获取 ${difficulty} 难度的随机谜题...`);
        
        const db = this._getPuzzleDB();
        if (!db) {
            console.error('❌ 题库未加载，PUZZLE_DB 和 PUZZLE_DB_AA 都不存在');
            return null;
        }
        console.log('✓ 题库已加载:', db);
        
        const puzzles = this._getPuzzles(difficulty);
        if (!puzzles || puzzles.length === 0) {
            console.error(`❌ 难度 ${difficulty} 无可用谜题`);
            return null;
        }
        console.log(`✓ 找到 ${puzzles.length} 个 ${difficulty} 难度的谜题`);
        
        const index = Math.floor(Math.random() * puzzles.length);
        const puzzle = puzzles[index];
        console.log(`✓ 选择第 ${index} 个谜题:`, puzzle);
        
        // 确保谜题有正确的结构
        if (!puzzle.gridSize && puzzle[0]) {
            // 如果谜题是数组格式，需要转换
            console.log('⚠️ 谜题格式需要转换');
            return this._convertPuzzleFormat(puzzle, difficulty, index);
        }
        
        const result = {
            ...puzzle,
            difficulty,
            index
        };
        console.log('✓ 返回谜题:', result);
        return result;
    },
    
    /**
     * 转换谜题格式（从数组格式转换为对象格式）
     */
    _convertPuzzleFormat(wordsArray, difficulty, index) {
        // 计算网格大小
        let maxRow = 0, maxCol = 0;
        wordsArray.forEach(word => {
            const endRow = word.d === 'H' ? word.r : word.r + word.w.length - 1;
            const endCol = word.d === 'H' ? word.c + word.w.length - 1 : word.c;
            maxRow = Math.max(maxRow, endRow);
            maxCol = Math.max(maxCol, endCol);
        });
        
        // 根据难度确定网格大小
        let gridSize;
        if (difficulty === 'easy') {
            gridSize = { rows: 10, cols: 10 };
        } else if (difficulty === 'medium') {
            gridSize = { rows: 13, cols: 13 };
        } else {
            gridSize = { rows: 16, cols: 16 };
        }
        
        // 确保网格足够大
        gridSize.rows = Math.max(gridSize.rows, maxRow + 1);
        gridSize.cols = Math.max(gridSize.cols, maxCol + 1);
        
        return {
            gridSize,
            words: wordsArray,
            difficulty,
            index
        };
    },
    
    /**
     * 获取指定谜题
     */
    getPuzzleByIndex(difficulty, index) {
        const puzzles = this._getPuzzles(difficulty);
        if (!puzzles || index >= puzzles.length) return null;
        
        const puzzle = puzzles[index];
        
        // 确保谜题有正确的结构
        if (!puzzle.gridSize && puzzle[0]) {
            return this._convertPuzzleFormat(puzzle, difficulty, index);
        }
        
        return {
            ...puzzle,
            difficulty,
            index
        };
    },
    
    /**
     * 获取谜题数量
     */
    getPuzzleCount(difficulty) {
        const puzzles = this._getPuzzles(difficulty);
        return puzzles ? puzzles.length : 0;
    }
};

// ==================== 网格管理器 ====================

const GridManager = {
    grid: null,
    puzzle: null,
    
    /**
     * 初始化网格
     */
    init(puzzle) {
        this.puzzle = puzzle;
        const { rows, cols } = puzzle.gridSize;
        
        // 创建空网格
        this.grid = [];
        for (let r = 0; r < rows; r++) {
            this.grid[r] = [];
            for (let c = 0; c < cols; c++) {
                this.grid[r][c] = {
                    char: '',           // 用户输入
                    correct: '',        // 正确答案
                    isBlack: true,      // 默认黑色
                    number: null,       // 编号
                    wordIds: []         // 所属单词
                };
            }
        }
        
        // 填充单词信息
        puzzle.words.forEach((word, wordIndex) => {
            const wordId = `${word.d}${word.n}`;
            
            for (let i = 0; i < word.w.length; i++) {
                const r = word.d === 'H' ? word.r : word.r + i;
                const c = word.d === 'H' ? word.c + i : word.c;
                
                if (r >= 0 && r < rows && c >= 0 && c < cols) {
                    this.grid[r][c].correct = word.w[i];
                    this.grid[r][c].isBlack = false;
                    this.grid[r][c].wordIds.push(wordId);
                    
                    // 设置编号(仅起始格)
                    if (i === 0) {
                        this.grid[r][c].number = word.n;
                    }
                }
            }
        });
        
        return this.grid;
    },
    
    /**
     * 获取格子
     */
    getCell(row, col) {
        if (!this.grid) return null;
        if (row < 0 || row >= this.grid.length) return null;
        if (col < 0 || col >= this.grid[0].length) return null;
        return this.grid[row][col];
    },
    
    /**
     * 设置格子字符
     */
    setCell(row, col, char) {
        const cell = this.getCell(row, col);
        if (cell && !cell.isBlack) {
            cell.char = char.toUpperCase();
            return true;
        }
        return false;
    },
    
    /**
     * 获取单词的所有格子坐标
     */
    getWordCells(wordData) {
        const cells = [];
        for (let i = 0; i < wordData.w.length; i++) {
            const r = wordData.d === 'H' ? wordData.r : wordData.r + i;
            const c = wordData.d === 'H' ? wordData.c + i : wordData.c;
            cells.push({ row: r, col: c });
        }
        return cells;
    },
    
    /**
     * 获取用户输入的单词
     */
    getUserWord(wordData) {
        let word = '';
        const cells = this.getWordCells(wordData);
        cells.forEach(({ row, col }) => {
            const cell = this.getCell(row, col);
            word += cell ? cell.char : '';
        });
        return word;
    },
    
    /**
     * 清空用户输入
     */
    clearInput() {
        if (!this.grid) return;
        
        for (let r = 0; r < this.grid.length; r++) {
            for (let c = 0; c < this.grid[0].length; c++) {
                if (!this.grid[r][c].isBlack) {
                    this.grid[r][c].char = '';
                }
            }
        }
    },
    
    /**
     * 获取网格尺寸
     */
    getSize() {
        if (!this.grid) return { rows: 0, cols: 0 };
        return {
            rows: this.grid.length,
            cols: this.grid[0]?.length || 0
        };
    }
};

// ==================== 验证器 ====================

const Validator = {
    /**
     * 验证单个单词
     */
    validateWord(wordData) {
        const userWord = GridManager.getUserWord(wordData);
        return userWord === wordData.w;
    },
    
    /**
     * 验证整个谜题
     */
    validatePuzzle(puzzle) {
        const results = {
            isComplete: true,
            correctCount: 0,
            totalCount: puzzle.words.length,
            details: []
        };
        
        puzzle.words.forEach(word => {
            const isCorrect = this.validateWord(word);
            const wordId = `${word.d}${word.n}`;
            
            results.details.push({
                wordId,
                word: word.w,
                isCorrect,
                userInput: GridManager.getUserWord(word)
            });
            
            if (isCorrect) {
                results.correctCount++;
            } else {
                results.isComplete = false;
            }
        });
        
        return results;
    },
    
    /**
     * 检查是否所有格子都已填写
     */
    isAllFilled(puzzle) {
        const grid = GridManager.grid;
        if (!grid) return false;
        
        for (let r = 0; r < grid.length; r++) {
            for (let c = 0; c < grid[0].length; c++) {
                const cell = grid[r][c];
                if (!cell.isBlack && !cell.char) {
                    return false;
                }
            }
        }
        return true;
    }
};

// ==================== 输入处理器 ====================

const InputHandler = {
    selection: {
        row: -1,
        col: -1,
        direction: 'H',
        wordData: null
    },
    
    /**
     * 初始化
     */
    init() {
        this.selection = {
            row: -1,
            col: -1,
            direction: 'H',
            wordData: null
        };
    },
    
    /**
     * 处理格子点击
     */
    handleCellClick(row, col) {
        const cell = GridManager.getCell(row, col);
        if (!cell || cell.isBlack) return;
        
        // 点击同一格子，切换方向
        if (this.selection.row === row && this.selection.col === col) {
            this.selection.direction = this.selection.direction === 'H' ? 'V' : 'H';
        } else {
            this.selection.row = row;
            this.selection.col = col;
        }
        
        // 更新当前单词
        this._updateCurrentWord();
        
        // 触发事件
        EventBus.emit('selection:change', {
            ...this.selection
        });
    },
    
    /**
     * 处理键盘输入
     */
    handleKeyDown(event) {
        const { row, col, direction } = this.selection;
        if (row < 0 || col < 0) return;
        
        const key = event.key;
        
        // 字母输入
        if (/^[a-zA-Z]$/.test(key)) {
            event.preventDefault();
            this._inputLetter(key.toUpperCase());
            return;
        }
        
        // 特殊键处理
        switch (key) {
            case 'Backspace':
                event.preventDefault();
                this._handleBackspace();
                break;
                
            case 'Delete':
                event.preventDefault();
                this._handleDelete();
                break;
                
            case 'ArrowLeft':
                event.preventDefault();
                this._move(0, -1);
                break;
                
            case 'ArrowRight':
                event.preventDefault();
                this._move(0, 1);
                break;
                
            case 'ArrowUp':
                event.preventDefault();
                this._move(-1, 0);
                break;
                
            case 'ArrowDown':
                event.preventDefault();
                this._move(1, 0);
                break;
                
            case 'Tab':
                event.preventDefault();
                this._moveToNextWord(event.shiftKey);
                break;
                
            case ' ':
                event.preventDefault();
                this.selection.direction = direction === 'H' ? 'V' : 'H';
                this._updateCurrentWord();
                EventBus.emit('selection:change', { ...this.selection });
                break;
        }
    },
    
    /**
     * 输入字母
     */
    _inputLetter(char) {
        const { row, col, direction } = this.selection;
        
        if (GridManager.setCell(row, col, char)) {
            EventBus.emit('cell:input', { row, col, char });
            
            // 移动到下一格
            this._moveToNextCell();
        }
    },
    
    /**
     * 处理退格键
     */
    _handleBackspace() {
        const { row, col, direction } = this.selection;
        const cell = GridManager.getCell(row, col);
        
        if (cell && cell.char) {
            // 当前格有字符，删除它
            GridManager.setCell(row, col, '');
            EventBus.emit('cell:input', { row, col, char: '' });
        } else {
            // 当前格为空，移动到上一格并删除
            this._moveToPrevCell();
            const newCell = GridManager.getCell(this.selection.row, this.selection.col);
            if (newCell && newCell.char) {
                GridManager.setCell(this.selection.row, this.selection.col, '');
                EventBus.emit('cell:input', { 
                    row: this.selection.row, 
                    col: this.selection.col, 
                    char: '' 
                });
            }
        }
    },
    
    /**
     * 处理删除键
     */
    _handleDelete() {
        const { row, col } = this.selection;
        GridManager.setCell(row, col, '');
        EventBus.emit('cell:input', { row, col, char: '' });
    },
    
    /**
     * 移动到下一格
     */
    _moveToNextCell() {
        const { row, col, direction } = this.selection;
        const newPos = this._getNextCell(row, col, direction, 1);
        
        if (newPos) {
            this.selection.row = newPos.row;
            this.selection.col = newPos.col;
            this._updateCurrentWord();
            EventBus.emit('selection:change', { ...this.selection });
        }
    },
    
    /**
     * 移动到上一格
     */
    _moveToPrevCell() {
        const { row, col, direction } = this.selection;
        const newPos = this._getNextCell(row, col, direction, -1);
        
        if (newPos) {
            this.selection.row = newPos.row;
            this.selection.col = newPos.col;
            this._updateCurrentWord();
            EventBus.emit('selection:change', { ...this.selection });
        }
    },
    
    /**
     * 获取下一个格子
     */
    _getNextCell(row, col, direction, delta) {
        const size = GridManager.getSize();
        let newRow = row;
        let newCol = col;
        
        if (direction === 'H') {
            newCol += delta;
        } else {
            newRow += delta;
        }
        
        // 检查边界
        if (newRow < 0 || newRow >= size.rows) return null;
        if (newCol < 0 || newCol >= size.cols) return null;
        
        // 检查是否黑色格子
        const cell = GridManager.getCell(newRow, newCol);
        if (!cell || cell.isBlack) return null;
        
        return { row: newRow, col: newCol };
    },
    
    /**
     * 方向移动
     */
    _move(rowDelta, colDelta) {
        const size = GridManager.getSize();
        let newRow = this.selection.row + rowDelta;
        let newCol = this.selection.col + colDelta;
        
        // 寻找下一个非黑格子
        while (newRow >= 0 && newRow < size.rows && 
               newCol >= 0 && newCol < size.cols) {
            const cell = GridManager.getCell(newRow, newCol);
            if (cell && !cell.isBlack) {
                this.selection.row = newRow;
                this.selection.col = newCol;
                
                // 根据移动方向更新输入方向
                if (rowDelta !== 0) {
                    this.selection.direction = 'V';
                } else if (colDelta !== 0) {
                    this.selection.direction = 'H';
                }
                
                this._updateCurrentWord();
                EventBus.emit('selection:change', { ...this.selection });
                return;
            }
            newRow += rowDelta;
            newCol += colDelta;
        }
    },
    
    /**
     * 移动到下一个单词
     */
    _moveToNextWord(reverse = false) {
        const puzzle = GridManager.puzzle;
        if (!puzzle) return;
        
        const words = puzzle.words;
        const currentWordId = this.selection.wordData 
            ? `${this.selection.wordData.d}${this.selection.wordData.n}`
            : null;
        
        let currentIndex = -1;
        for (let i = 0; i < words.length; i++) {
            if (`${words[i].d}${words[i].n}` === currentWordId) {
                currentIndex = i;
                break;
            }
        }
        
        let nextIndex;
        if (reverse) {
            nextIndex = currentIndex <= 0 ? words.length - 1 : currentIndex - 1;
        } else {
            nextIndex = currentIndex >= words.length - 1 ? 0 : currentIndex + 1;
        }
        
        const nextWord = words[nextIndex];
        this.selection.row = nextWord.r;
        this.selection.col = nextWord.c;
        this.selection.direction = nextWord.d;
        this._updateCurrentWord();
        EventBus.emit('selection:change', { ...this.selection });
    },
    
    /**
     * 更新当前单词
     */
    _updateCurrentWord() {
        const { row, col, direction } = this.selection;
        const puzzle = GridManager.puzzle;
        if (!puzzle) return;
        
        // 查找包含当前格子且方向匹配的单词
        for (const word of puzzle.words) {
            if (word.d !== direction) continue;
            
            const cells = GridManager.getWordCells(word);
            for (const cell of cells) {
                if (cell.row === row && cell.col === col) {
                    this.selection.wordData = word;
                    return;
                }
            }
        }
        
        // 如果找不到匹配方向的单词，尝试另一个方向
        const otherDir = direction === 'H' ? 'V' : 'H';
        for (const word of puzzle.words) {
            if (word.d !== otherDir) continue;
            
            const cells = GridManager.getWordCells(word);
            for (const cell of cells) {
                if (cell.row === row && cell.col === col) {
                    this.selection.direction = otherDir;
                    this.selection.wordData = word;
                    return;
                }
            }
        }
    },
    
    /**
     * 选择指定单词
     */
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
    
    /**
     * 初始化DOM元素引用
     */
    init() {
        this.elements = {
            gridContainer: document.getElementById('grid-container'),
            hintsAcross: document.getElementById('hints-across'),
            hintsDown: document.getElementById('hints-down'),
            currentWord: document.getElementById('current-word'),
            timer: document.getElementById('timer'),
            progress: document.getElementById('progress'),
            progressBar: document.getElementById('progress-bar'),
            difficulty: document.getElementById('difficulty-display')
        };
        
        // 调试：检查元素是否找到
        if (!this.elements.gridContainer) {
            console.error('❌ 未找到 grid-container 元素');
        }
        if (!this.elements.hintsAcross) {
            console.error('❌ 未找到 hints-across 元素');
        }
        if (!this.elements.hintsDown) {
            console.error('❌ 未找到 hints-down 元素');
        }
        console.log('✓ Renderer 初始化完成', this.elements);
    },
    
    /**
     * 渲染网格
     */
    renderGrid(puzzle) {
        console.log('🎨 开始渲染网格...', puzzle);
        
        const grid = GridManager.grid;
        if (!grid) {
            console.error('❌ GridManager.grid 为空，无法渲染');
            return;
        }
        
        if (!this.elements.gridContainer) {
            console.error('❌ gridContainer 元素不存在');
            return;
        }
        
        const { rows, cols } = GridManager.getSize();
        console.log(`📐 网格大小: ${rows}x${cols}`);
        
        let html = '<table class="crossword-grid">';
        
        for (let r = 0; r < rows; r++) {
            html += '<tr>';
            for (let c = 0; c < cols; c++) {
                const cell = grid[r][c];
                html += this._renderCell(cell, r, c);
            }
            html += '</tr>';
        }
        
        html += '</table>';
        
        this.elements.gridContainer.innerHTML = html;
        console.log('✓ 网格已渲染到DOM');
        
        // 绑定事件
        this._bindGridEvents();
    },
    
    /**
     * 渲染单个格子
     */
    _renderCell(cell, row, col) {
        if (cell.isBlack) {
            return '<td class="cell black"></td>';
        }
        
        const numberHtml = cell.number 
            ? `<span class="cell-number">${cell.number}</span>` 
            : '';
        
        return `
            <td class="cell" data-row="${row}" data-col="${col}">
                ${numberHtml}
                <input type="text" 
                       maxlength="1" 
                       class="cell-input" 
                       data-row="${row}" 
                       data-col="${col}"
                       value="${cell.char}"
                       autocomplete="off"
                       autocapitalize="characters">
            </td>
        `;
    },
    
    /**
     * 绑定网格事件
     */
    _bindGridEvents() {
        const container = this.elements.gridContainer;
        
        // 点击事件
        container.addEventListener('click', (e) => {
            const cell = e.target.closest('.cell');
            if (cell && !cell.classList.contains('black')) {
                const row = parseInt(cell.dataset.row);
                const col = parseInt(cell.dataset.col);
                InputHandler.handleCellClick(row, col);
            }
        });
        
        // 输入事件
        container.addEventListener('keydown', (e) => {
            if (e.target.classList.contains('cell-input')) {
                InputHandler.handleKeyDown(e);
            }
        });
        
        // 聚焦事件
        container.addEventListener('focus', (e) => {
            if (e.target.classList.contains('cell-input')) {
                const row = parseInt(e.target.dataset.row);
                const col = parseInt(e.target.dataset.col);
                if (InputHandler.selection.row !== row || 
                    InputHandler.selection.col !== col) {
                    InputHandler.handleCellClick(row, col);
                }
            }
        }, true);
    },
    
    /**
     * 更新格子显示
     */
    updateCell(row, col) {
        const cell = GridManager.getCell(row, col);
        if (!cell) return;
        
        const input = this.elements.gridContainer.querySelector(
            `.cell-input[data-row="${row}"][data-col="${col}"]`
        );
        
        if (input) {
            input.value = cell.char;
            
            // 添加动画效果
            const td = input.closest('.cell');
            td.classList.add('pop');
            setTimeout(() => td.classList.remove('pop'), 200);
        }
    },
    
    /**
     * 更新选中状态
     */
    updateSelection(selection) {
        const container = this.elements.gridContainer;
        
        // 清除所有选中状态
        container.querySelectorAll('.cell.selected, .cell.highlighted')
            .forEach(el => el.classList.remove('selected', 'highlighted'));
        
        if (selection.row < 0 || !selection.wordData) return;
        
        // 高亮当前单词
        const cells = GridManager.getWordCells(selection.wordData);
        cells.forEach(({ row, col }) => {
            const cell = container.querySelector(
                `.cell[data-row="${row}"][data-col="${col}"]`
            );
            if (cell) {
                cell.classList.add('highlighted');
            }
        });
        
        // 标记当前格子
        const currentCell = container.querySelector(
            `.cell[data-row="${selection.row}"][data-col="${selection.col}"]`
        );
        if (currentCell) {
            currentCell.classList.add('selected');
            const input = currentCell.querySelector('.cell-input');
            if (input) {
                input.focus();
            }
        }
        
        // 更新当前单词显示
        if (this.elements.currentWord && selection.wordData) {
            const dir = selection.wordData.d === 'H' ? '横向' : '纵向';
            this.elements.currentWord.innerHTML = 
                `当前: <strong>${selection.wordData.n}${dir}</strong> - ${selection.wordData.h}`;
        }
    },
    
    /**
     * 渲染提示列表
     */
    renderHints(puzzle) {
        console.log('📝 开始渲染提示...', puzzle);
        
        if (!puzzle || !puzzle.words) {
            console.error('❌ 谜题数据无效，无法渲染提示');
            return;
        }
        
        const acrossWords = puzzle.words.filter(w => w.d === 'H')
            .sort((a, b) => a.n - b.n);
        const downWords = puzzle.words.filter(w => w.d === 'V')
            .sort((a, b) => a.n - b.n);
        
        console.log(`📋 横向单词: ${acrossWords.length} 个，纵向单词: ${downWords.length} 个`);
        
        if (this.elements.hintsAcross) {
            this.elements.hintsAcross.innerHTML = this._renderHintList(acrossWords);
            console.log('✓ 横向提示已渲染');
        } else {
            console.error('❌ hintsAcross 元素不存在');
        }
        
        if (this.elements.hintsDown) {
            this.elements.hintsDown.innerHTML = this._renderHintList(downWords);
            console.log('✓ 纵向提示已渲染');
        } else {
            console.error('❌ hintsDown 元素不存在');
        }
        
        // 绑定点击事件
        this._bindHintEvents();
    },
    
    /**
     * 渲染提示项
     */
    _renderHintList(words) {
        return words.map(word => `
            <li class="hint-item" data-word-id="${word.d}${word.n}" 
                data-row="${word.r}" data-col="${word.c}" data-dir="${word.d}">
                <span class="hint-number">${word.n}.</span>
                <span class="hint-text">${word.h}</span>
            </li>
        `).join('');
    },
    
    /**
     * 绑定提示点击事件
     */
    _bindHintEvents() {
        const hints = document.querySelectorAll('.hint-item');
        hints.forEach(hint => {
            hint.addEventListener('click', () => {
                const row = parseInt(hint.dataset.row);
                const col = parseInt(hint.dataset.col);
                const dir = hint.dataset.dir;
                
                // 查找对应单词
                const puzzle = GridManager.puzzle;
                const wordData = puzzle.words.find(w => 
                    w.r === row && w.c === col && w.d === dir
                );
                
                if (wordData) {
                    InputHandler.selectWord(wordData);
                }
            });
        });
    },
    
    /**
     * 更新提示高亮
     */
    updateHintHighlight(wordId) {
        // 清除所有高亮
        document.querySelectorAll('.hint-item.active')
            .forEach(el => el.classList.remove('active'));
        
        // 添加新高亮
        const hint = document.querySelector(`.hint-item[data-word-id="${wordId}"]`);
        if (hint) {
            hint.classList.add('active');
            hint.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    },
    
    /**
     * 标记完成的单词
     */
    markWordCompleted(wordId, isCorrect) {
        const hint = document.querySelector(`.hint-item[data-word-id="${wordId}"]`);
        if (hint) {
            hint.classList.toggle('completed', isCorrect);
        }
    },
    
    /**
     * 显示验证结果
     */
    showValidationResult(results) {
        const container = this.elements.gridContainer;
        
        results.details.forEach(detail => {
            const wordData = GridManager.puzzle.words.find(w => 
                `${w.d}${w.n}` === detail.wordId
            );
            
            if (wordData) {
                const cells = GridManager.getWordCells(wordData);
                cells.forEach(({ row, col }, index) => {
                    const cellEl = container.querySelector(
                        `.cell[data-row="${row}"][data-col="${col}"]`
                    );
                    
                    if (cellEl) {
                        cellEl.classList.remove('correct', 'incorrect');
                        
                        const userChar = detail.userInput[index] || '';
                        const correctChar = wordData.w[index];
                        
                        if (userChar === correctChar) {
                            cellEl.classList.add('correct');
                        } else if (userChar) {
                            cellEl.classList.add('incorrect');
                        }
                    }
                });
            }
        });
    },
    
    /**
     * 清除验证结果
     */
    clearValidationResult() {
        this.elements.gridContainer
            .querySelectorAll('.cell.correct, .cell.incorrect')
            .forEach(el => el.classList.remove('correct', 'incorrect'));
    },
    
    /**
     * 更新进度显示
     */
    updateProgress(completed, total) {
        if (this.elements.progress) {
            this.elements.progress.textContent = `${completed}/${total}`;
        }
        
        if (this.elements.progressBar) {
            const percent = total > 0 ? (completed / total * 100) : 0;
            this.elements.progressBar.style.width = `${percent}%`;
        }
    },
    
    /**
     * 更新计时器
     */
    updateTimer(seconds) {
        if (this.elements.timer) {
            this.elements.timer.textContent = Utils.formatTime(seconds);
        }
    },
    
    /**
     * 更新难度显示
     */
    updateDifficulty(difficulty) {
        if (this.elements.difficulty) {
            this.elements.difficulty.textContent = 
                CONFIG.difficultyNames[difficulty] || difficulty;
        }
    },
    
    /**
     * 显示完成弹窗
     */
    showCompleteModal(stats) {
        const modal = document.getElementById('complete-modal');
        if (!modal) return;
        
        // 更新统计数据
        const timeEl = modal.querySelector('.stat-time');
        const wordsEl = modal.querySelector('.stat-words');
        
        if (timeEl) timeEl.textContent = Utils.formatTime(stats.time);
        if (wordsEl) wordsEl.textContent = stats.words;
        
        // 显示弹窗
        modal.classList.add('active');
        
        // 网格庆祝动画
        const gridWrapper = document.querySelector('.grid-wrapper');
        if (gridWrapper) {
            gridWrapper.classList.add('celebrate');
            setTimeout(() => gridWrapper.classList.remove('celebrate'), 600);
        }
    },
    
    /**
     * 隐藏弹窗
     */
    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
        }
    }
};

// ==================== 计时器 ====================

const Timer = {
    seconds: 0,
    interval: null,
    isRunning: false,
    
    /**
     * 开始计时
     */
    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.interval = setInterval(() => {
            this.seconds++;
            Renderer.updateTimer(this.seconds);
        }, 1000);
    },
    
    /**
     * 暂停计时
     */
    pause() {
        this.isRunning = false;
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    },
    
    /**
     * 重置计时
     */
    reset() {
        this.pause();
        this.seconds = 0;
        Renderer.updateTimer(0);
    },
    
    /**
     * 获取当前时间
     */
    getTime() {
        return this.seconds;
    }
};

// ==================== 游戏控制器 ====================

const GameController = {
    currentPuzzle: null,
    currentDifficulty: 'medium',
    isPlaying: false,
    isComplete: false,
    
    /**
     * 初始化游戏
     */
    init() {
        // 初始化渲染器
        Renderer.init();
        
        // 绑定全局事件
        this._bindEvents();
        
        // 绑定按钮事件
        this._bindButtons();
        
        // 注意：不自动开始新游戏，由app.js控制
        // this.newGame(this.currentDifficulty);
    },
    
    /**
     * 绑定事件
     */
    _bindEvents() {
        // 选择变化
        EventBus.on('selection:change', (selection) => {
            Renderer.updateSelection(selection);
            if (selection.wordData) {
                const wordId = `${selection.wordData.d}${selection.wordData.n}`;
                Renderer.updateHintHighlight(wordId);
            }
        });
        
        // 输入变化
        EventBus.on('cell:input', ({ row, col, char }) => {
            Renderer.updateCell(row, col);
            Renderer.clearValidationResult();
            this._checkProgress();
        });
    },
    
    /**
     * 绑定按钮
     */
    _bindButtons() {
        // 新游戏按钮
        document.getElementById('btn-new-game')?.addEventListener('click', () => {
            this.newGame(this.currentDifficulty);
        });
        
        // 难度选择
        document.getElementById('difficulty-select')?.addEventListener('change', (e) => {
            this.currentDifficulty = e.target.value;
            this.newGame(this.currentDifficulty);
        });
        
        // 检查按钮
        document.getElementById('btn-check')?.addEventListener('click', () => {
            this.checkAnswers();
        });
        
        // 提示按钮
        document.getElementById('btn-hint')?.addEventListener('click', () => {
            this.revealLetter();
        });
        
        // 重置按钮
        document.getElementById('btn-reset')?.addEventListener('click', () => {
            this.resetPuzzle();
        });
        
        // 弹窗关闭
        document.getElementById('btn-next-puzzle')?.addEventListener('click', () => {
            Renderer.hideModal('complete-modal');
            this.newGame(this.currentDifficulty);
        });
        
        // 键盘事件（全局）
        document.addEventListener('keydown', (e) => {
            // 只有在非输入框时处理
            if (document.activeElement.classList.contains('cell-input')) {
                return; // 让输入框自己处理
            }
        });
    },
    
    /**
     * 开始新游戏
     */
    newGame(difficulty) {
        console.log(`🎮 开始新游戏，难度: ${difficulty}`);
        this.currentDifficulty = difficulty;
        
        // 获取随机谜题
        const puzzle = PuzzleLoader.getRandomPuzzle(difficulty);
        if (!puzzle) {
            console.error('❌ 无法加载谜题');
            alert('无法加载谜题，请刷新页面重试');
            return;
        }
        
        console.log('✓ 谜题加载成功:', puzzle);
        this.currentPuzzle = puzzle;
        
        // 初始化网格
        console.log('📐 初始化网格...');
        GridManager.init(puzzle);
        console.log('✓ 网格初始化完成');
        
        InputHandler.init();
        Timer.reset();
        
        // 渲染
        console.log('🎨 开始渲染...');
        Renderer.renderGrid(puzzle);
        Renderer.renderHints(puzzle);
        Renderer.updateDifficulty(difficulty);
        Renderer.updateProgress(0, puzzle.words.length);
        console.log('✓ 渲染完成');
        
        // 选择第一个单词
        if (puzzle.words && puzzle.words.length > 0) {
            InputHandler.selectWord(puzzle.words[0]);
        }
        
        // 开始计时
        Timer.start();
        this.isPlaying = true;
        this.isComplete = false;
        console.log('🎮 新游戏启动完成');
    },
    
    /**
     * 检查答案
     */
    checkAnswers() {
        if (!this.currentPuzzle) return;
        
        const results = Validator.validatePuzzle(this.currentPuzzle);
        Renderer.showValidationResult(results);
        
        // 更新完成的单词
        results.details.forEach(detail => {
            Renderer.markWordCompleted(detail.wordId, detail.isCorrect);
        });
        
        // 检查是否完成
        if (results.isComplete) {
            this.isComplete = true;
            this.isPlaying = false;
            Timer.pause();
            
            // 更新统计数据
            if (typeof StorageManager !== 'undefined') {
                StorageManager.updateStatistics({
                    completed: true,
                    time: Timer.getTime(),
                    words: results.totalCount,
                    difficulty: this.currentDifficulty
                });
            }
            
            Renderer.showCompleteModal({
                time: Timer.getTime(),
                words: results.totalCount
            });
        }
    },
    
    /**
     * 显示提示(揭示一个字母)
     */
    revealLetter() {
        const { row, col } = InputHandler.selection;
        if (row < 0 || col < 0) return;
        
        const cell = GridManager.getCell(row, col);
        if (cell && !cell.isBlack && !cell.char) {
            GridManager.setCell(row, col, cell.correct);
            Renderer.updateCell(row, col);
            
            // 标记为提示
            const cellEl = document.querySelector(
                `.cell[data-row="${row}"][data-col="${col}"]`
            );
            if (cellEl) {
                cellEl.classList.add('revealed');
            }
            
            // 移动到下一格
            InputHandler._moveToNextCell();
        }
    },
    
    /**
     * 重置谜题
     */
    resetPuzzle() {
        if (!this.currentPuzzle) return;
        
        if (confirm('确定要重置当前谜题吗？所有输入将被清除。')) {
            GridManager.clearInput();
            Renderer.renderGrid(this.currentPuzzle);
            Renderer.clearValidationResult();
            Renderer.updateProgress(0, this.currentPuzzle.words.length);
            Timer.reset();
            Timer.start();
            
            // 重新选择第一个单词
            if (this.currentPuzzle.words.length > 0) {
                InputHandler.selectWord(this.currentPuzzle.words[0]);
            }
        }
    },
    
    /**
     * 检查进度
     */
    _checkProgress() {
        if (!this.currentPuzzle) return;
        
        let completed = 0;
        this.currentPuzzle.words.forEach(word => {
            if (Validator.validateWord(word)) {
                completed++;
            }
        });
        
        Renderer.updateProgress(completed, this.currentPuzzle.words.length);
    },
    
    /**
     * 保存当前游戏状态
     */
    saveCurrentState() {
        if (!this.currentPuzzle || !this.isPlaying) return;
        
        // 收集用户输入
        const userInput = {};
        const grid = GridManager.grid;
        const size = GridManager.getSize();
        
        for (let r = 0; r < size.rows; r++) {
            for (let c = 0; c < size.cols; c++) {
                const cell = grid[r][c];
                if (!cell.isBlack && cell.char) {
                    userInput[`${r},${c}`] = cell.char;
                }
            }
        }
        
        // 保存状态
        StorageManager.saveGameState({
            puzzle: this.currentPuzzle,
            difficulty: this.currentDifficulty,
            puzzleIndex: this.currentPuzzle.index,
            userInput: userInput,
            timer: Timer.getTime(),
            completedWords: this._getCompletedWords(),
            timestamp: Date.now()
        });
    },
    
    /**
     * 恢复保存的游戏
     */
    restoreSavedGame() {
        const savedState = StorageManager.loadGameState();
        if (!savedState) return false;
        
        try {
            // 加载谜题
            const puzzle = PuzzleLoader.getPuzzleByIndex(
                savedState.difficulty, 
                savedState.puzzleIndex
            ) || PuzzleLoader.getRandomPuzzle(savedState.difficulty);
            
            if (!puzzle) return false;
            
            this.currentPuzzle = puzzle;
            this.currentDifficulty = savedState.difficulty;
            
            // 初始化网格
            GridManager.init(puzzle);
            
            // 恢复用户输入
            if (savedState.userInput) {
                Object.entries(savedState.userInput).forEach(([key, char]) => {
                    const [r, c] = key.split(',').map(Number);
                    GridManager.setCell(r, c, char);
                });
            }
            
            InputHandler.init();
            
            // 恢复计时器
            Timer.reset();
            if (savedState.timer) {
                Timer.seconds = savedState.timer;
            }
            
            // 渲染
            Renderer.renderGrid(puzzle);
            Renderer.renderHints(puzzle);
            Renderer.updateDifficulty(savedState.difficulty);
            
            // 恢复选中状态
            if (puzzle.words.length > 0) {
                InputHandler.selectWord(puzzle.words[0]);
            }
            
            // 恢复进度
            this._checkProgress();
            
            // 开始计时
            Timer.start();
            this.isPlaying = true;
            this.isComplete = false;
            
            return true;
        } catch (e) {
            console.error('恢复游戏失败:', e);
            return false;
        }
    },
    
    /**
     * 获取已完成的单词列表
     */
    _getCompletedWords() {
        if (!this.currentPuzzle) return [];
        
        const completed = [];
        this.currentPuzzle.words.forEach(word => {
            if (Validator.validateWord(word)) {
                completed.push(`${word.d}${word.n}`);
            }
        });
        return completed;
    }
};

// ==================== 初始化 ====================
// 注意：初始化由 app.js 统一管理，这里不再自动初始化
// 如果需要独立使用，可以取消注释：
// document.addEventListener('DOMContentLoaded', () => {
//     GameController.init();
// });