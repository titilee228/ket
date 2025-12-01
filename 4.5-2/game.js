// ========================================
// 填字游戏 - 游戏逻辑
// ========================================

// 全局变量
let currentPuzzle = null;      // 当前谜题
let currentDifficulty = 'medium';  // 当前难度
let grid = [];                 // 网格数据
let selection = {              // 当前选中
    row: -1,
    col: -1,
    direction: 'H',
    wordData: null
};
let timerInterval = null;      // 计时器
let seconds = 0;               // 秒数

// ========================================
// 初始化游戏
// ========================================
function init() {
    // 绑定按钮事件
    document.getElementById('btn-new-game').addEventListener('click', newGame);
    document.getElementById('btn-check').addEventListener('click', checkAnswers);
      document.getElementById('btn-reveal').addEventListener('click', revealAnswers);  // 新增这行
    document.getElementById('btn-next').addEventListener('click', () => {
        hideModal();
        newGame();
    });
    
    // 绑定难度选择
    document.getElementById('difficulty-select').addEventListener('change', (e) => {
        currentDifficulty = e.target.value;
        newGame();
    });
    
    // 开始新游戏
    newGame();
}

// ========================================
// 开始新游戏
// ========================================
function newGame() {
    // 获取随机谜题
    const puzzles = PUZZLE_DB.puzzles[currentDifficulty];
    const randomIndex = Math.floor(Math.random() * puzzles.length);
    currentPuzzle = puzzles[randomIndex];
    
    // 初始化网格
    initGrid();
    
    // 渲染网格
    renderGrid();
    
    // 渲染提示
    renderHints();
    
    // 重置计时器
    resetTimer();
    startTimer();
    
    // 重置进度
    updateProgress();
    
    // 重置选中状态
    selection = { row: -1, col: -1, direction: 'H', wordData: null };
    document.getElementById('current-word').textContent = '点击格子开始游戏';
}

// ========================================
// 初始化网格数据
// ========================================
function initGrid() {
    const { rows, cols } = currentPuzzle.gridSize;
    
    // 创建空网格
    grid = [];
    for (let r = 0; r < rows; r++) {
        grid[r] = [];
        for (let c = 0; c < cols; c++) {
            grid[r][c] = {
                char: '',           // 用户输入
                correct: '',        // 正确答案
                isBlack: true,      // 是否黑色格子
                number: null,       // 编号
                wordIds: []         // 所属单词
            };
        }
    }
    
    // 填充单词信息
    currentPuzzle.words.forEach((word) => {
        const wordId = word.d + word.n;
        
        for (let i = 0; i < word.w.length; i++) {
            const r = word.d === 'H' ? word.r : word.r + i;
            const c = word.d === 'H' ? word.c + i : word.c;
            
            if (r >= 0 && r < rows && c >= 0 && c < cols) {
                grid[r][c].correct = word.w[i];
                grid[r][c].isBlack = false;
                grid[r][c].wordIds.push(wordId);
                
                // 设置编号
                if (i === 0) {
                    grid[r][c].number = word.n;
                }
            }
        }
    });
}

// ========================================
// 渲染网格
// ========================================
function renderGrid() {
    const container = document.getElementById('grid-container');
    const { rows, cols } = currentPuzzle.gridSize;
    
    let html = '<table class="crossword-grid">';
    
    for (let r = 0; r < rows; r++) {
        html += '<tr>';
        for (let c = 0; c < cols; c++) {
            const cell = grid[r][c];
            
            if (cell.isBlack) {
                html += '<td class="cell black"></td>';
            } else {
                const numberHtml = cell.number 
                    ? `<span class="cell-number">${cell.number}</span>` 
                    : '';
                
                html += `
                    <td class="cell" data-row="${r}" data-col="${c}">
                        ${numberHtml}
                        <input type="text" 
                               maxlength="1" 
                               class="cell-input" 
                               data-row="${r}" 
                               data-col="${c}"
                               autocomplete="off">
                    </td>
                `;
            }
        }
        html += '</tr>';
    }
    
    html += '</table>';
    container.innerHTML = html;
    
    // 绑定事件
    bindGridEvents();
}

// ========================================
// 绑定网格事件
// ========================================
function bindGridEvents() {
    const container = document.getElementById('grid-container');
    
    // 点击格子
    container.addEventListener('click', (e) => {
        const cell = e.target.closest('.cell');
        if (cell && !cell.classList.contains('black')) {
            const row = parseInt(cell.dataset.row);
            const col = parseInt(cell.dataset.col);
            handleCellClick(row, col);
        }
    });
    
    // 键盘输入
    container.addEventListener('keydown', (e) => {
        if (e.target.classList.contains('cell-input')) {
            handleKeyDown(e);
        }
    });
    
    // 输入事件
    container.addEventListener('input', (e) => {
        if (e.target.classList.contains('cell-input')) {
            const row = parseInt(e.target.dataset.row);
            const col = parseInt(e.target.dataset.col);
            const value = e.target.value.toUpperCase();
            
            if (/^[A-Z]$/.test(value)) {
                grid[row][col].char = value;
                e.target.value = value;
                moveToNextCell();
            } else {
                e.target.value = grid[row][col].char;
            }
            
            updateProgress();
        }
    });
}

// ========================================
// 处理格子点击
// ========================================
function handleCellClick(row, col) {
    // 如果点击同一个格子，切换方向
    if (selection.row === row && selection.col === col) {
        selection.direction = selection.direction === 'H' ? 'V' : 'H';
    } else {
        selection.row = row;
        selection.col = col;
    }
    
    // 更新当前单词
    updateCurrentWord();
    
    // 更新高亮
    updateHighlight();
    
    // 聚焦输入框
    const input = document.querySelector(
        `.cell-input[data-row="${row}"][data-col="${col}"]`
    );
    if (input) {
        input.focus();
        input.select();
    }
}

// ========================================
// 处理键盘事件
// ========================================
function handleKeyDown(e) {
    const key = e.key;
    
    switch (key) {
        case 'ArrowLeft':
            e.preventDefault();
            moveSelection(0, -1);
            break;
        case 'ArrowRight':
            e.preventDefault();
            moveSelection(0, 1);
            break;
        case 'ArrowUp':
            e.preventDefault();
            moveSelection(-1, 0);
            break;
        case 'ArrowDown':
            e.preventDefault();
            moveSelection(1, 0);
            break;
        case 'Backspace':
            e.preventDefault();
            handleBackspace();
            break;
        case ' ':
            e.preventDefault();
            selection.direction = selection.direction === 'H' ? 'V' : 'H';
            updateCurrentWord();
            updateHighlight();
            break;
    }
}

// ========================================
// 移动选中位置
// ========================================
function moveSelection(rowDelta, colDelta) {
    const { rows, cols } = currentPuzzle.gridSize;
    let newRow = selection.row + rowDelta;
    let newCol = selection.col + colDelta;
    
    // 找到下一个有效格子
    while (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
        if (!grid[newRow][newCol].isBlack) {
            handleCellClick(newRow, newCol);
            return;
        }
        newRow += rowDelta;
        newCol += colDelta;
    }
}

// ========================================
// 移动到下一个格子
// ========================================
function moveToNextCell() {
    const { rows, cols } = currentPuzzle.gridSize;
    let newRow = selection.row;
    let newCol = selection.col;
    
    if (selection.direction === 'H') {
        newCol++;
    } else {
        newRow++;
    }
    
    if (newRow < rows && newCol < cols && !grid[newRow][newCol].isBlack) {
        handleCellClick(newRow, newCol);
    }
}

// ========================================
// 处理退格键
// ========================================
function handleBackspace() {
    const { row, col } = selection;
    
    if (grid[row][col].char) {
        // 删除当前格子
        grid[row][col].char = '';
        const input = document.querySelector(
            `.cell-input[data-row="${row}"][data-col="${col}"]`
        );
        if (input) input.value = '';
    } else {
        // 移动到上一个格子
        let newRow = row;
        let newCol = col;
        
        if (selection.direction === 'H') {
            newCol--;
        } else {
            newRow--;
        }
        
        if (newRow >= 0 && newCol >= 0 && !grid[newRow][newCol].isBlack) {
            handleCellClick(newRow, newCol);
            grid[newRow][newCol].char = '';
            const input = document.querySelector(
                `.cell-input[data-row="${newRow}"][data-col="${newCol}"]`
            );
            if (input) input.value = '';
        }
    }
    
    updateProgress();
}

// ========================================
// 更新当前单词
// ========================================
function updateCurrentWord() {
    const { row, col, direction } = selection;
    
    // 查找当前单词
    for (const word of currentPuzzle.words) {
        if (word.d !== direction) continue;
        
        const cells = getWordCells(word);
        for (const cell of cells) {
            if (cell.row === row && cell.col === col) {
                selection.wordData = word;
                
                // 更新显示
                const dir = word.d === 'H' ? '横向' : '纵向';
                document.getElementById('current-word').innerHTML = 
                    `<strong>${word.n} ${dir}</strong>: ${word.h}`;
                return;
            }
        }
    }
}

// ========================================
// 获取单词的所有格子
// ========================================
function getWordCells(word) {
    const cells = [];
    for (let i = 0; i < word.w.length; i++) {
        const r = word.d === 'H' ? word.r : word.r + i;
        const c = word.d === 'H' ? word.c + i : word.c;
        cells.push({ row: r, col: c });
    }
    return cells;
}

// ========================================
// 更新高亮显示
// ========================================
function updateHighlight() {
    // 清除所有高亮
    document.querySelectorAll('.cell.selected, .cell.highlighted')
        .forEach(el => el.classList.remove('selected', 'highlighted'));
    
    if (!selection.wordData) return;
    
    // 高亮当前单词
    const cells = getWordCells(selection.wordData);
    cells.forEach(({ row, col }) => {
        const cell = document.querySelector(
            `.cell[data-row="${row}"][data-col="${col}"]`
        );
        if (cell) {
            cell.classList.add('highlighted');
        }
    });
    
    // 标记当前格子
    const currentCell = document.querySelector(
        `.cell[data-row="${selection.row}"][data-col="${selection.col}"]`
    );
    if (currentCell) {
        currentCell.classList.add('selected');
    }
    
    // 高亮提示项
    document.querySelectorAll('.hint-item.active')
        .forEach(el => el.classList.remove('active'));
    
    const hintItem = document.querySelector(
        `.hint-item[data-word-id="${selection.wordData.d}${selection.wordData.n}"]`
    );
    if (hintItem) {
        hintItem.classList.add('active');
    }
}

// ========================================
// 渲染提示列表
// ========================================
function renderHints() {
    const acrossWords = currentPuzzle.words
        .filter(w => w.d === 'H')
        .sort((a, b) => a.n - b.n);
    
    const downWords = currentPuzzle.words
        .filter(w => w.d === 'V')
        .sort((a, b) => a.n - b.n);
    
    document.getElementById('hints-across').innerHTML = 
        renderHintList(acrossWords);
    
    document.getElementById('hints-down').innerHTML = 
        renderHintList(downWords);
    
    // 绑定点击事件
    document.querySelectorAll('.hint-item').forEach(item => {
        item.addEventListener('click', () => {
            const row = parseInt(item.dataset.row);
            const col = parseInt(item.dataset.col);
            const dir = item.dataset.dir;
            
            selection.direction = dir;
            handleCellClick(row, col);
        });
    });
}

// ========================================
// 渲染提示项
// ========================================
function renderHintList(words) {
    return words.map(word => `
        <li class="hint-item" 
            data-word-id="${word.d}${word.n}"
            data-row="${word.r}" 
            data-col="${word.c}" 
            data-dir="${word.d}">
            <span class="hint-number">${word.n}</span>
            <span class="hint-text">${word.h}</span>
        </li>
    `).join('');
}

// ========================================
// 检查答案
// ========================================
function checkAnswers() {
    let allCorrect = true;
    let correctCount = 0;
    
    // 清除之前的状态
    document.querySelectorAll('.cell.correct, .cell.incorrect')
        .forEach(el => el.classList.remove('correct', 'incorrect'));
    
    // 检查每个单词
    currentPuzzle.words.forEach(word => {
        const cells = getWordCells(word);
        let wordCorrect = true;
        
        cells.forEach(({ row, col }, index) => {
            const userChar = grid[row][col].char;
            const correctChar = word.w[index];
            
            const cellEl = document.querySelector(
                `.cell[data-row="${row}"][data-col="${col}"]`
            );
            
            if (userChar === correctChar) {
                if (cellEl) cellEl.classList.add('correct');
            } else {
                if (cellEl && userChar) cellEl.classList.add('incorrect');
                wordCorrect = false;
                allCorrect = false;
            }
        });
        
        if (wordCorrect) correctCount++;
        
        // 更新提示项状态
        const hintItem = document.querySelector(
            `.hint-item[data-word-id="${word.d}${word.n}"]`
        );
        if (hintItem) {
            hintItem.classList.toggle('completed', wordCorrect);
        }
    });
    
    // 如果全部正确，显示完成弹窗
    if (allCorrect) {
        stopTimer();
        showCompleteModal();
    }
}

// ========================================
// 更新进度
// ========================================
function updateProgress() {
    let correctCount = 0;
    
    currentPuzzle.words.forEach(word => {
        const cells = getWordCells(word);
        let wordCorrect = true;
        
        cells.forEach(({ row, col }, index) => {
            if (grid[row][col].char !== word.w[index]) {
                wordCorrect = false;
            }
        });
        
        if (wordCorrect) correctCount++;
    });
    
    document.getElementById('progress').textContent = 
        `${correctCount}/${currentPuzzle.words.length}`;
}

// ========================================
// 计时器功能
// ========================================
function startTimer() {
    timerInterval = setInterval(() => {
        seconds++;
        updateTimerDisplay();
    }, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function resetTimer() {
    stopTimer();
    seconds = 0;
    updateTimerDisplay();
}

function updateTimerDisplay() {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const display = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    document.getElementById('timer').textContent = display;
}

function formatTime(totalSeconds) {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// ========================================
// 弹窗功能
// ========================================
function showCompleteModal() {
    document.getElementById('final-time').textContent = formatTime(seconds);
    document.getElementById('final-words').textContent = currentPuzzle.words.length;
    document.getElementById('complete-modal').classList.add('active');
}

function hideModal() {
    document.getElementById('complete-modal').classList.remove('active');
}


// ========================================
// 显示答案
// ========================================
function revealAnswers() {
    // 弹出确认框
    if (!confirm('确定要查看答案吗？\n\n这会显示所有正确答案。')) {
        return;
    }
    
    // 停止计时
    stopTimer();
    
    // 遍历所有单词，填入正确答案
    currentPuzzle.words.forEach(word => {
        const cells = getWordCells(word);
        
        cells.forEach(({ row, col }, index) => {
            const correctChar = word.w[index];
            
            // 更新数据
            grid[row][col].char = correctChar;
            
            // 更新显示
            const input = document.querySelector(
                `.cell-input[data-row="${row}"][data-col="${col}"]`
            );
            if (input) {
                input.value = correctChar;
            }
            
            // 添加揭示样式
            const cellEl = document.querySelector(
                `.cell[data-row="${row}"][data-col="${col}"]`
            );
            if (cellEl) {
                cellEl.classList.add('revealed');
            }
        });
        
        // 标记提示为完成
        const hintItem = document.querySelector(
            `.hint-item[data-word-id="${word.d}${word.n}"]`
        );
        if (hintItem) {
            hintItem.classList.add('completed');
        }
    });
    
    // 更新进度
    document.getElementById('progress').textContent = 
        `${currentPuzzle.words.length}/${currentPuzzle.words.length}`;
    
    // 显示提示
    document.getElementById('current-word').innerHTML = 
        '🔓 <strong>答案已显示</strong> - 点击"新游戏"开始下一题';
}
// ========================================
// 页面加载完成后初始化
// ========================================
document.addEventListener('DOMContentLoaded', init);