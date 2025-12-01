/**
 * ==========================================
 * 设置管理模块
 * ==========================================
 */

const SettingsController = {
    // 默认设置
    defaults: {
        difficulty: 'medium',
        language: 'zh',
        soundEnabled: true,
        soundVolume: 0.7,
        animationsEnabled: true,
        darkMode: false,
        showTimer: true,
        autoCheck: false
    },

    /**
     * 初始化
     */
    init() {
        this._bindEvents();
        this._loadSettings();
        this._applySettings();
    },

    /**
     * 绑定事件
     */
    _bindEvents() {
        // 打开设置按钮
        const btnSettings = document.getElementById('btn-settings');
        if (btnSettings) {
            btnSettings.addEventListener('click', () => {
                this.open();
            });
        }

        // 关闭按钮（包括所有带 data-close-modal 的元素）
        document.querySelectorAll('[data-close-modal]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.close();
            });
        });

        // 点击遮罩关闭
        const modal = document.getElementById('settings-modal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target.classList.contains('modal-overlay')) {
                    this.close();
                }
            });
        }

        // ESC 键关闭
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.close();
            }
        });

        // 语言切换
        const langSelect = document.getElementById('setting-language');
        if (langSelect) {
            langSelect.addEventListener('change', (e) => {
                this._onLanguageChange(e.target.value);
            });
        }

        // 音效开关
        const soundCheck = document.getElementById('setting-sound');
        if (soundCheck) {
            soundCheck.addEventListener('change', (e) => {
                this._onSoundToggle(e.target.checked);
            });
        }

        // 音量调节
        const volumeRange = document.getElementById('setting-volume');
        if (volumeRange) {
            volumeRange.addEventListener('input', (e) => {
                this._onVolumeChange(e.target.value);
            });
        }

        // 动画开关
        const animCheck = document.getElementById('setting-animations');
        if (animCheck) {
            animCheck.addEventListener('change', (e) => {
                this._onAnimationsToggle(e.target.checked);
            });
        }

        // 深色模式
        const darkCheck = document.getElementById('setting-dark-mode');
        if (darkCheck) {
            darkCheck.addEventListener('change', (e) => {
                this._onDarkModeToggle(e.target.checked);
            });
        }

        // 显示计时器
        const timerCheck = document.getElementById('setting-timer');
        if (timerCheck) {
            timerCheck.addEventListener('change', (e) => {
                this._onTimerToggle(e.target.checked);
            });
        }

        // 自动检查
        const autoCheck = document.getElementById('setting-auto-check');
        if (autoCheck) {
            autoCheck.addEventListener('change', (e) => {
                this._onAutoCheckToggle(e.target.checked);
            });
        }

        // 查看统计按钮
        const btnStats = document.getElementById('btn-view-stats');
        if (btnStats) {
            btnStats.addEventListener('click', () => {
                this.close();
                if (typeof StatisticsController !== 'undefined') {
                    StatisticsController.open();
                }
            });
        }

        // 导出数据按钮
        const btnExport = document.getElementById('btn-export-data');
        if (btnExport) {
            btnExport.addEventListener('click', () => {
                this._exportData();
            });
        }

        // 导入数据按钮
        const btnImport = document.getElementById('btn-import-data');
        if (btnImport) {
            btnImport.addEventListener('click', () => {
                this._importData();
            });
        }

        // 重置统计按钮
        const btnReset = document.getElementById('btn-reset-stats');
        if (btnReset) {
            btnReset.addEventListener('click', () => {
                this._resetStatistics();
            });
        }
    },

    /**
     * 加载设置到UI
     */
    _loadSettings() {
        const settings = this._getSettings();

        // 语言
        const langSelect = document.getElementById('setting-language');
        if (langSelect) {
            langSelect.value = settings.language;
        }

        // 音效
        const soundCheck = document.getElementById('setting-sound');
        if (soundCheck) {
            soundCheck.checked = settings.soundEnabled;
        }

        // 音量
        const volumeRange = document.getElementById('setting-volume');
        const volumeDisplay = document.getElementById('volume-display');
        if (volumeRange) {
            volumeRange.value = Math.round(settings.soundVolume * 100);
            if (volumeDisplay) {
                volumeDisplay.textContent = Math.round(settings.soundVolume * 100) + '%';
            }
        }

        // 音量设置可见性
        const volumeSetting = document.getElementById('volume-setting');
        if (volumeSetting) {
            volumeSetting.style.display = settings.soundEnabled ? 'flex' : 'none';
        }

        // 动画
        const animCheck = document.getElementById('setting-animations');
        if (animCheck) {
            animCheck.checked = settings.animationsEnabled;
        }

        // 深色模式
        const darkCheck = document.getElementById('setting-dark-mode');
        if (darkCheck) {
            darkCheck.checked = settings.darkMode;
        }

        // 计时器
        const timerCheck = document.getElementById('setting-timer');
        if (timerCheck) {
            timerCheck.checked = settings.showTimer;
        }

        // 自动检查
        const autoCheck = document.getElementById('setting-auto-check');
        if (autoCheck) {
            autoCheck.checked = settings.autoCheck;
        }
    },

    /**
     * 应用设置到各个系统
     */
    _applySettings() {
        const settings = this._getSettings();

        // 应用音效设置
        if (typeof AudioManager !== 'undefined') {
            AudioManager.setEnabled(settings.soundEnabled);
            AudioManager.setVolume(settings.soundVolume);
        }

        // 应用动画设置
        if (typeof AnimationManager !== 'undefined') {
            AnimationManager.setEnabled(settings.animationsEnabled);
        }

        // 应用主题设置
        if (typeof ThemeManager !== 'undefined') {
            ThemeManager.setDark(settings.darkMode);
        }

        // 应用计时器可见性
        this._setTimerVisibility(settings.showTimer);
    },

    /**
     * 获取设置
     */
    _getSettings() {
        if (typeof StorageManager !== 'undefined') {
            return StorageManager.loadSettings();
        }
        return this.defaults;
    },

    /**
     * 保存单个设置
     */
    _saveSetting(key, value) {
        if (typeof StorageManager !== 'undefined') {
            StorageManager.setSetting(key, value);
        }
    },

    // ==================== 设置变更处理 ====================

    /**
     * 语言变更
     */
    _onLanguageChange(lang) {
        this._saveSetting('language', lang);
        
        if (typeof I18n !== 'undefined') {
            I18n.setLanguage(lang);
        }

        if (typeof AudioManager !== 'undefined') {
            AudioManager.play('click');
        }
    },

    /**
     * 音效开关
     */
    _onSoundToggle(enabled) {
        this._saveSetting('soundEnabled', enabled);
        
        if (typeof AudioManager !== 'undefined') {
            AudioManager.setEnabled(enabled);
            if (enabled) {
                AudioManager.play('click');
            }
        }

        // 显示/隐藏音量设置
        const volumeSetting = document.getElementById('volume-setting');
        if (volumeSetting) {
            volumeSetting.style.display = enabled ? 'flex' : 'none';
        }
    },

    /**
     * 音量变更
     */
    _onVolumeChange(value) {
        const volume = parseInt(value) / 100;
        this._saveSetting('soundVolume', volume);
        
        if (typeof AudioManager !== 'undefined') {
            AudioManager.setVolume(volume);
        }

        const volumeDisplay = document.getElementById('volume-display');
        if (volumeDisplay) {
            volumeDisplay.textContent = value + '%';
        }
    },

    /**
     * 动画开关
     */
    _onAnimationsToggle(enabled) {
        this._saveSetting('animationsEnabled', enabled);
        
        if (typeof AnimationManager !== 'undefined') {
            AnimationManager.setEnabled(enabled);
        }

        if (typeof AudioManager !== 'undefined') {
            AudioManager.play('click');
        }
    },

    /**
     * 深色模式开关
     */
    _onDarkModeToggle(enabled) {
        this._saveSetting('darkMode', enabled);
        
        if (typeof ThemeManager !== 'undefined') {
            ThemeManager.setDark(enabled);
        }

        if (typeof AudioManager !== 'undefined') {
            AudioManager.play('click');
        }
    },

    /**
     * 计时器显示开关
     */
    _onTimerToggle(enabled) {
        this._saveSetting('showTimer', enabled);
        this._setTimerVisibility(enabled);

        if (typeof AudioManager !== 'undefined') {
            AudioManager.play('click');
        }
    },

    /**
     * 设置计时器可见性
     */
    _setTimerVisibility(visible) {
        const timerItem = document.querySelector('.status-item:has(#timer)');
        if (timerItem) {
            timerItem.style.display = visible ? 'flex' : 'none';
        }
        
        // 备用选择器（兼容不支持 :has 的浏览器）
        const timer = document.getElementById('timer');
        if (timer) {
            const parent = timer.closest('.status-item');
            if (parent) {
                parent.style.display = visible ? 'flex' : 'none';
            }
        }
    },

    /**
     * 自动检查开关
     */
    _onAutoCheckToggle(enabled) {
        this._saveSetting('autoCheck', enabled);

        if (typeof AudioManager !== 'undefined') {
            AudioManager.play('click');
        }

        // 通知游戏控制器
        if (typeof EventBus !== 'undefined') {
            EventBus.emit('settings:autoCheckChanged', { enabled });
        }
    },

    // ==================== 数据管理 ====================

    /**
     * 导出数据
     */
    _exportData() {
        try {
            let data;
            
            if (typeof StorageManager !== 'undefined') {
                data = StorageManager.exportData();
            } else {
                data = JSON.stringify({ message: 'No data available' });
            }

            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `crossword_backup_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            URL.revokeObjectURL(url);

            if (typeof AudioManager !== 'undefined') {
                AudioManager.play('correct');
            }

            this._showToast('数据导出成功');
        } catch (error) {
            console.error('导出失败:', error);
            this._showToast('导出失败，请重试');
        }
    },

    /**
     * 导入数据
     */
    _importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = event.target.result;
                    
                    if (typeof StorageManager !== 'undefined') {
                        const success = StorageManager.importData(data);
                        if (success) {
                            this._showToast('数据导入成功，页面将刷新');
                            setTimeout(() => location.reload(), 1500);
                        } else {
                            this._showToast('导入失败，数据格式错误');
                        }
                    }
                } catch (error) {
                    console.error('导入失败:', error);
                    this._showToast('导入失败，请检查文件格式');
                }
            };
            
            reader.readAsText(file);
        };
        
        input.click();
    },

    /**
     * 重置统计
     */
    _resetStatistics() {
        const message = typeof I18n !== 'undefined' 
            ? I18n.t('statistics.resetConfirm')
            : '确定要重置所有统计数据吗？此操作不可撤销。';

        if (confirm(message)) {
            if (typeof StorageManager !== 'undefined') {
                StorageManager.resetStatistics();
            }

            if (typeof AudioManager !== 'undefined') {
                AudioManager.play('click');
            }

            this._showToast('统计数据已重置');
        }
    },

    // ==================== UI 操作 ====================

    /**
     * 