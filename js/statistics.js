/**
 * 统计面板控制器
 */
const StatisticsController = {
    /**
     * 初始化
     */
    init() {
        this._bindEvents();
    },
    
    /**
     * 绑定事件
     */
    _bindEvents() {
        document.getElementById('btn-close-stats')?.addEventListener('click', () => {
            this.close();
        });
        
        document.getElementById('statistics-modal')?.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                this.close();
            }
        });
    },
    
    /**
     * 打开统计面板
     */
    open() {
        this._updateDisplay();
        document.getElementById('statistics-modal')?.classList.add('active');
        
        // 数字动画
        if (AnimationManager.enabled) {
            this._animateNumbers();
        }
    },
    
    /**
     * 关闭统计面板
     */
    close() {
        document.getElementById('statistics-modal')?.classList.remove('active');
    },
    
    /**
     * 更新显示
     */
    _updateDisplay() {
        const stats = StorageManager.getStatistics() || {};
        
        // 基础统计
        document.getElementById('stat-games-played').textContent = 
            stats.totalGamesPlayed || 0;
        document.getElementById('stat-games-completed').textContent = 
            stats.totalGamesCompleted || 0;
        document.getElementById('stat-words-completed').textContent = 
            stats.totalWordsCompleted || 0;
        
        // 完成率
        const rate = stats.totalGamesPlayed > 0 
            ? Math.round((stats.totalGamesCompleted / stats.totalGamesPlayed) * 100)
            : 0;
        document.getElementById('stat-completion-rate').textContent = rate + '%';
        
        // 连胜
        document.getElementById('stat-current-streak').textContent = 
            stats.streaks?.current || 0;
        document.getElementById('stat-best-streak').textContent = 
            stats.streaks?.best || 0;
        
        // 最佳时间
        const bestTimes = stats.bestTimes || {};
        ['easy', 'medium', 'hard'].forEach(diff => {
            const el = document.getElementById(`best-time-${diff}`);
            if (el) {
                el.textContent = bestTimes[diff] 
                    ? Utils.formatTime(bestTimes[diff])
                    : '--:--';
            }
        });
        
        // 总用时
        const totalSeconds = stats.totalTimePlayed || 0;
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        document.getElementById('stat-total-time').textContent = 
            `${hours}${I18n.t('time.hours')} ${minutes}${I18n.t('time.minutes')}`;
    },
    
    /**
     * 数字动画效果
     */
    _animateNumbers() {
        const stats = StorageManager.getStatistics() || {};
        
        const animations = [
            ['stat-games-played', 0, stats.totalGamesPlayed || 0],
            ['stat-games-completed', 0, stats.totalGamesCompleted || 0],
            ['stat-words-completed', 0, stats.totalWordsCompleted || 0]
        ];
        
        animations.forEach(([id, from, to], index) => {
            const el = document.getElementById(id);
            if (el) {
                setTimeout(() => {
                    AnimationManager.countUp(el, from, to, 800);
                }, index * 150);
            }
        });
    }
};