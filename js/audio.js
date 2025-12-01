/**
 * ==========================================
 * 音效管理器
 * ==========================================
 */

const AudioManager = {
    // 音效配置
    sounds: {
        keyPress: { src: null, volume: 0.3 },
        correct: { src: null, volume: 0.5 },
        incorrect: { src: null, volume: 0.4 },
        complete: { src: null, volume: 0.6 },
        click: { src: null, volume: 0.2 },
        hint: { src: null, volume: 0.4 },
        levelUp: { src: null, volume: 0.5 }
    },
    
    // 状态
    enabled: true,
    masterVolume: 0.7,
    audioContext: null,
    
    /**
     * 初始化音效系统
     */
    init() {
        // 尝试创建 AudioContext
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('Web Audio API 不支持，使用降级方案');
        }
        
        // 生成音效（使用 Web Audio API 合成）
        this._generateSounds();
        
        // 从本地存储恢复设置
        this._loadSettings();
        
        // 解锁音频（移动端需要用户交互）
        this._setupAudioUnlock();
    },
    
    /**
     * 生成合成音效
     */
    _generateSounds() {
        // 按键音 - 短促的点击声
        this.sounds.keyPress.play = () => this._playTone(800, 0.05, 'sine');
        
        // 正确音 - 上升的双音
        this.sounds.correct.play = () => {
            this._playTone(523, 0.1, 'sine'); // C5
            setTimeout(() => this._playTone(659, 0.15, 'sine'), 100); // E5
        };
        
        // 错误音 - 低沉的嗡嗡声
        this.sounds.incorrect.play = () => {
            this._playTone(200, 0.2, 'sawtooth', 0.3);
        };
        
        // 完成音 - 欢快的上升音阶
        this.sounds.complete.play = () => {
            const notes = [523, 587, 659, 698, 784, 880, 988, 1047]; // C5 到 C6
            notes.forEach((freq, i) => {
                setTimeout(() => this._playTone(freq, 0.15, 'sine'), i * 80);
            });
        };
        
        // 点击音
        this.sounds.click.play = () => this._playTone(600, 0.03, 'sine');
        
        // 提示音 - 柔和的提示
        this.sounds.hint.play = () => {
            this._playTone(440, 0.1, 'sine');
            setTimeout(() => this._playTone(550, 0.1, 'sine'), 100);
        };
        
        // 升级音
        this.sounds.levelUp.play = () => {
            const notes = [392, 494, 587, 784]; // G4, B4, D5, G5
            notes.forEach((freq, i) => {
                setTimeout(() => this._playTone(freq, 0.2, 'triangle'), i * 120);
            });
        };
    },
    
    /**
     * 使用 Web Audio API 播放音调
     */
    _playTone(frequency, duration, type = 'sine', volume = null) {
        if (!this.enabled || !this.audioContext) return;
        
        try {
            // 确保 AudioContext 处于运行状态
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.type = type;
            oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
            
            const vol = (volume !== null ? volume : 0.3) * this.masterVolume;
            gainNode.gain.setValueAtTime(vol, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(
                0.001, 
                this.audioContext.currentTime + duration
            );
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration);
        } catch (e) {
            console.warn('播放音效失败:', e);
        }
    },
    
    /**
     * 播放指定音效
     */
    play(soundName) {
        if (!this.enabled) return;
        
        const sound = this.sounds[soundName];
        if (sound && sound.play) {
            sound.play();
        }
    },
    
    /**
     * 设置启用/禁用
     */
    setEnabled(enabled) {
        this.enabled = enabled;
        this._saveSettings();
    },
    
    /**
     * 切换启用状态
     */
    toggle() {
        this.enabled = !this.enabled;
        this._saveSettings();
        return this.enabled;
    },
    
    /**
     * 设置主音量
     */
    setVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
        this._saveSettings();
    },
    
    /**
     * 移动端音频解锁
     */
    _setupAudioUnlock() {
        const unlock = () => {
            if (this.audioContext && this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }
            
            // 播放静音来解锁
            this._playTone(1, 0.001, 'sine', 0);
            
            // 移除事件监听
            document.removeEventListener('touchstart', unlock);
            document.removeEventListener('click', unlock);
        };
        
        document.addEventListener('touchstart', unlock, { once: true });
        document.addEventListener('click', unlock, { once: true });
    },
    
    /**
     * 保存设置
     */
    _saveSettings() {
        try {
            localStorage.setItem('audio_settings', JSON.stringify({
                enabled: this.enabled,
                masterVolume: this.masterVolume
            }));
        } catch (e) {
            console.warn('保存音效设置失败');
        }
    },
    
    /**
     * 加载设置
     */
    _loadSettings() {
        try {
            const saved = localStorage.getItem('audio_settings');
            if (saved) {
                const settings = JSON.parse(saved);
                this.enabled = settings.enabled ?? true;
                this.masterVolume = settings.masterVolume ?? 0.7;
            }
        } catch (e) {
            console.warn('加载音效设置失败');
        }
    }
};

// 导出或挂载到全局
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AudioManager;
}