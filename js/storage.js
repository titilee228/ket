/**
 * ==========================================
 * 本地存储管理器
 * ==========================================
 */

const StorageManager = {
    // 存储键前缀
    prefix: 'crossword_',
    
    // 存储键
    keys: {
        GAME_STATE: 'game_state',
        USER_SETTINGS: 'user_settings',
        STATISTICS: 'statistics',
        COMPLETED_PUZZLES: 'completed_puzzles'
    },
    
    /**
     * 初始化
     */
    init() {
        // 检查存储可用性
        this.available = this._checkAvailability();
        
        // 初始化默认数据
        this._initDefaults();
        
        // 版本迁移
        this._migrate();
    },
    
    /**
     * 检查存储可用性
     */
    _checkAvailability() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            console.warn('localStorage 不可用');
            return false;
        }
    },
    
    /**
     * 获取完整键名
     */
    _getKey(key) {
        return this.prefix + key;
    },
    
    /**
     * 保存数据
     */
    save(key, data) {
        if (!this.available) return false;
        
        try {
            const serialized = JSON.stringify({
                data,
                timestamp: Date.now(),
                version: '1.0'
            });
            localStorage.setItem(this._getKey(key), serialized);
            return true;
        } catch (e) {
            console.error('保存数据失败:', e);
            // 可能是存储满了，尝试清理
            this._cleanup();
            return false;
        }
    },
    
    /**
     * 读取数据
     */
    load(key, defaultValue = null) {
        if (!this.available) return defaultValue;
        
        try {
            const item = localStorage.getItem(this._getKey(key));
            if (!item) return defaultValue;
            
            const parsed = JSON.parse(item);
            return parsed.data ?? defaultValue;
        } catch (e) {
            console.error('读取数据失败:', e);
            return defaultValue;
        }
    },
    
    /**
     * 删除数据
     */
    remove(key) {
        if (!this.available) return;
        localStorage.removeItem(this._getKey(key));
    },
    
    /**
     * 清空所有游戏数据
     */
    clear() {
        if (!this.available) return;
        
        Object.values(this.keys).forEach(key => {
            localStorage.removeItem(this._getKey(key));
        });
    },
    
    /**
     * 初始化默认值
     */
    _initDefaults() {
        // 默认统计数据
        if (!this.load(this.keys.STATISTICS)) {
            this.save(this.keys.STATISTICS, {
                totalGamesPlayed: 0,
                totalGamesCompleted: 0,
                totalWordsCompleted: 0,
                totalTimePlayed: 0,
                bestTimes: {
                    easy: null,
                    medium: null,
                    hard: null
                },
                streaks: {
                    current: 0,
                    best: 0,
                    lastPlayDate: null
                }
            });
        }
        
        // 默认设置
        if (!this.load(this.keys.USER_SETTINGS)) {
            this.save(this.keys.USER_SETTINGS, {
                difficulty: 'medium',
                language: 'zh',
                soundEnabled: true,
                soundVolume: 0.7,
                animationsEnabled: true,
                darkMode: false,
                showTimer: true,
                autoCheck: false
            });
        }
    },
    
    /**
     * 版本迁移
     */
    _migrate() {
        // 未来版本可在此处理数据迁移
    },
    
    /**
     * 清理旧数据
     */
    _cleanup() {
        // 删除超过7天的游戏状态
        const gameState = this.load(this.keys.GAME_STATE);
        if (gameState && gameState.timestamp) {
            const age = Date.now() - gameState.timestamp;
            if (age > 7 * 24 * 60 * 60 * 1000) {
                this.remove(this.keys.GAME_STATE);
            }
        }
    },
    
    // ==================== 游戏状态 ====================
    
    /**
     * 保存游戏状态
     */
    saveGameState(state) {
        return this.save(this.keys.GAME_STATE, {
            puzzle: state.puzzle,
            difficulty: state.difficulty,
            puzzleIndex: state.puzzleIndex,
            userInput: state.userInput,
            timer: state.timer,
            completedWords: state.completedWords,
            timestamp: Date.now()
        });
    },
    
    /**
     * 加载游戏状态
     */
    loadGameState() {
        return this.load(this.keys.GAME_STATE);
    },
    
    /**
     * 清除游戏状态
     */
    clearGameState() {
        this.remove(this.keys.GAME_STATE);
    },
    
    /**
     * 检查是否有保存的游戏
     */
    hasSavedGame() {
        const state = this.loadGameState();
        return state !== null && state.userInput;
    },
    
    // ==================== 用户设置 ====================
    
    /**
     * 保存设置
     */
    saveSettings(settings) {
        const current = this.loadSettings();
        return this.save(this.keys.USER_SETTINGS, {
            ...current,
            ...settings
        });
    },
    
    /**
     * 加载设置
     */
    loadSettings() {
        return this.load(this.keys.USER_SETTINGS, {
            difficulty: 'medium',
            language: 'zh',
            soundEnabled: true,
            soundVolume: 0.7,
            animationsEnabled: true,
            darkMode: false,
            showTimer: true,
            autoCheck: false
        });
    },
    
    /**
     * 获取单个设置
     */
    getSetting(key) {
        const settings = this.loadSettings();
        return settings[key];
    },
    
    /**
     * 设置单个值
     */
    setSetting(key, value) {
        const settings = this.loadSettings();
        settings[key] = value;
        return this.save(this.keys.USER_SETTINGS, settings);
    },
    
    // ==================== 统计数据 ====================
    
    /**
     * 获取统计数据
     */
    getStatistics() {
        return this.load(this.keys.STATISTICS);
    },
    
    /**
     * 更新统计数据
     */
    updateStatistics(gameResult) {
        const stats = this.getStatistics() || {};
        
        // 更新基础统计
        stats.totalGamesPlayed = (stats.totalGamesPlayed || 0) + 1;
        stats.totalTimePlayed = (stats.totalTimePlayed || 0) + gameResult.time;
        
        if (gameResult.completed) {
            stats.totalGamesCompleted = (stats.totalGamesCompleted || 0) + 1;
            stats.totalWordsCompleted = (stats.totalWordsCompleted || 0) + gameResult.words;
            
            // 更新最佳时间
            if (!stats.bestTimes) stats.bestTimes = {};
            const currentBest = stats.bestTimes[gameResult.difficulty];
            if (!currentBest || gameResult.time < currentBest) {
                stats.bestTimes[gameResult.difficulty] = gameResult.time;
            }
            
            // 更新连胜
            this._updateStreak(stats, true);
        } else {
            this._updateStreak(stats, false);
        }
        
        this.save(this.keys.STATISTICS, stats);
        return stats;
    },
    
    /**
     * 更新连胜记录
     */
    _updateStreak(stats, won) {
        if (!stats.streaks) {
            stats.streaks = { current: 0, best: 0, lastPlayDate: null };
        }
        
        const today = new Date().toDateString();
        const lastPlay = stats.streaks.lastPlayDate;
        
        if (won) {
            if (lastPlay === today) {
                // 今天已经玩过，不增加
            } else {
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                
                if (lastPlay === yesterday.toDateString()) {
                    // 连续游玩
                    stats.streaks.current++;
                } else {
                    // 重新开始
                    stats.streaks.current = 1;
                }
            }
            
            // 更新最佳连胜
            if (stats.streaks.current > stats.streaks.best) {
                stats.streaks.best = stats.streaks.current;
            }
        } else {
            stats.streaks.current = 0;
        }
        
        stats.streaks.lastPlayDate = today;
    },
    
    /**
     * 重置统计数据
     */
    resetStatistics() {
        this.save(this.keys.STATISTICS, {
            totalGamesPlayed: 0,
            totalGamesCompleted: 0,
            totalWordsCompleted: 0,
            totalTimePlayed: 0,
            bestTimes: { easy: null, medium: null, hard: null },
            streaks: { current: 0, best: 0, lastPlayDate: null }
        });
    },
    
    // ==================== 已完成谜题 ====================
    
    /**
     * 标记谜题已完成
     */
    markPuzzleCompleted(difficulty, index) {
        const completed = this.load(this.keys.COMPLETED_PUZZLES, {});
        
        if (!completed[difficulty]) {
            completed[difficulty] = [];
        }
        
        if (!completed[difficulty].includes(index)) {
            completed[difficulty].push(index);
        }
        
        this.save(this.keys.COMPLETED_PUZZLES, completed);
    },
    
    /**
     * 检查谜题是否已完成
     */
    isPuzzleCompleted(difficulty, index) {
        const completed = this.load(this.keys.COMPLETED_PUZZLES, {});
        return completed[difficulty]?.includes(index) || false;
    },
    
    /**
     * 获取已完成数量
     */
    getCompletedCount(difficulty) {
        const completed = this.load(this.keys.COMPLETED_PUZZLES, {});
        return completed[difficulty]?.length || 0;
    },
    
    // ==================== 导出/导入 ====================
    
    /**
     * 导出所有数据
     */
    exportData() {
        const data = {};
        Object.entries(this.keys).forEach(([name, key]) => {
            data[name] = this.load(key);
        });
        return JSON.stringify(data, null, 2);
    },
    
    /**
     * 导入数据
     */
    importData(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            Object.entries(data).forEach(([name, value]) => {
                if (this.keys[name] && value !== null) {
                    this.save(this.keys[name], value);
                }
            });
            return true;
        } catch (e) {
            console.error('导入数据失败:', e);
            return false;
        }
    }
};
/**
 * 自动保存管理
 */
const AutoSave = {
    interval: null,
    debounceTimer: null,
    
    /**
     * 启动自动保存
     */
    start(saveCallback, intervalMs = 30000) {
        this.stop();
        
        // 定期保存
        this.interval = setInterval(() => {
            saveCallback();
        }, intervalMs);
        
        // 页面关闭前保存
        window.addEventListener('beforeunload', () => {
            saveCallback();
        });
        
        // 页面隐藏时保存
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                saveCallback();
            }
        });
    },
    
    /**
     * 停止自动保存
     */
    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    },
    
    /**
     * 触发防抖保存
     */
    trigger(saveCallback, delay = 2000) {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
            saveCallback();
        }, delay);
    }
};