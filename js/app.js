/**
 * ==========================================
 * 填字游戏 - 应用入口
 * ==========================================
 */

const App = {
    /**
     * 初始化应用
     */
    async init() {
        console.log('🎮 填字游戏启动中...');
        
        try {
            // 1. 初始化存储
            StorageManager.init();
            console.log('✓ 存储系统就绪');
            
            // 2. 初始化多语言
            I18n.init();
            console.log('✓ 多语言系统就绪');
            
            // 3. 初始化主题
            ThemeManager.init();
            console.log('✓ 主题系统就绪');
            
            // 4. 初始化音效
            AudioManager.init();
            console.log('✓ 音效系统就绪');
            
            // 5. 初始化动画
            AnimationManager.init();
            console.log('✓ 动画系统就绪');
            
            // 6. 初始化渲染器
            Renderer.init();
            console.log('✓ 渲染器就绪');
            
            // 7. 初始化设置面板
            SettingsController.init();
            console.log('✓ 设置面板就绪');
            
            // 8. 初始化统计面板
            StatisticsController.init();
            console.log('✓ 统计面板就绪');
            
            // 9. 初始化游戏控制器（不自动开始游戏）
            GameController.init();
            console.log('✓ 游戏控制器就绪');
            
            // 10. 检查是否有保存的游戏
            if (!this._checkSavedGame()) {
                // 如果没有保存的游戏或用户选择不恢复，开始新游戏
                const difficulty = StorageManager.getSetting('difficulty') || 'medium';
                GameController.currentDifficulty = difficulty;
                GameController.newGame(difficulty);
            }
            
            // 11. 启动自动保存
            AutoSave.start(() => {
                GameController.saveCurrentState();
            }, 30000);
            
            console.log('🎮 填字游戏启动完成！');
            
        } catch (error) {
            console.error('应用初始化失败:', error);
            this._showError('应用加载失败，请刷新页面重试');
        }
    },
    
    /**
     * 检查保存的游戏
     * @returns {boolean} 是否恢复了游戏
     */
    _checkSavedGame() {
        if (StorageManager.hasSavedGame()) {
            const message = I18n.t('messages.hasSavedGame');
            
            if (confirm(message)) {
                if (GameController.restoreSavedGame()) {
                    return true; // 成功恢复
                } else {
                    // 恢复失败，清除状态
                    StorageManager.clearGameState();
                }
            } else {
                // 用户选择不恢复，清除状态
                StorageManager.clearGameState();
            }
        }
        return false; // 没有保存的游戏或未恢复
    },
    
    /**
     * 显示错误
     */
    _showError(message) {
        const overlay = document.createElement('div');
        overlay.className = 'error-overlay';
        overlay.innerHTML = `
            <div class="error-modal">
                <div class="error-icon">❌</div>
                <h2>出错了</h2>
                <p>${message}</p>
                <button onclick="location.reload()">刷新页面</button>
            </div>
        `;
        document.body.appendChild(overlay);
    }
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// 防止意外关闭
window.addEventListener('beforeunload', (e) => {
    if (GameController.isPlaying && !GameController.isComplete) {
        e.preventDefault();
        e.returnValue = '';
    }
});