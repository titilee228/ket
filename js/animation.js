/**
 * ==========================================
 * 动画管理器
 * ==========================================
 */

const AnimationManager = {
    // 动画开关
    enabled: true,
    
    // 减弱动画（无障碍）
    reducedMotion: false,
    
    /**
     * 初始化
     */
    init() {
        // 检测用户偏好
        this.reducedMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        ).matches;
        
        // 监听变化
        window.matchMedia('(prefers-reduced-motion: reduce)')
            .addEventListener('change', (e) => {
                this.reducedMotion = e.matches;
            });
    },
    
    /**
     * 格子输入动画
     */
    cellInput(element) {
        if (!this.enabled || this.reducedMotion) return;
        
        element.classList.add('cell-input-animate');
        setTimeout(() => element.classList.remove('cell-input-animate'), 200);
    },
    
    /**
     * 格子正确动画
     */
    cellCorrect(element) {
        if (!this.enabled || this.reducedMotion) return;
        
        element.classList.add('cell-correct-animate');
        
        // 添加波纹效果
        this._createRipple(element, 'var(--success-color)');
        
        setTimeout(() => element.classList.remove('cell-correct-animate'), 500);
    },
    
    /**
     * 格子错误动画
     */
    cellIncorrect(element) {
        if (!this.enabled || this.reducedMotion) return;
        
        element.classList.add('cell-incorrect-animate');
        setTimeout(() => element.classList.remove('cell-incorrect-animate'), 400);
    },
    
    /**
     * 单词完成动画（依次高亮）
     */
    wordComplete(cells) {
        if (!this.enabled || this.reducedMotion) return;
        
        cells.forEach((cell, index) => {
            setTimeout(() => {
                cell.classList.add('word-complete-animate');
                setTimeout(() => cell.classList.remove('word-complete-animate'), 500);
            }, index * 50);
        });
    },
    
    /**
     * 游戏完成庆祝动画
     */
    celebrate(container) {
        if (!this.enabled) return;
        
        // 网格缩放动画
        const gridWrapper = container.querySelector('.grid-wrapper');
        if (gridWrapper) {
            gridWrapper.classList.add('celebrate-bounce');
            setTimeout(() => gridWrapper.classList.remove('celebrate-bounce'), 1000);
        }
        
        // 发射彩带
        this._launchConfetti(container);
    },
    
    /**
     * 彩带效果
     */
    _launchConfetti(container) {
        if (this.reducedMotion) return;
        
        const confettiContainer = document.createElement('div');
        confettiContainer.className = 'confetti-container';
        container.appendChild(confettiContainer);
        
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dfe6e9'];
        const confettiCount = 100;
        
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.cssText = `
                left: ${Math.random() * 100}%;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                animation-delay: ${Math.random() * 0.5}s;
                animation-duration: ${2 + Math.random() * 2}s;
            `;
            confettiContainer.appendChild(confetti);
        }
        
        // 清理
        setTimeout(() => confettiContainer.remove(), 5000);
    },
    
    /**
     * 创建波纹效果
     */
    _createRipple(element, color) {
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.backgroundColor = color;
        
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = '50%';
        ripple.style.top = '50%';
        ripple.style.transform = 'translate(-50%, -50%)';
        
        element.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    },
    
    /**
     * 提示面板滑入
     */
    slideIn(element, direction = 'right') {
        if (!this.enabled || this.reducedMotion) return;
        
        element.classList.add(`slide-in-${direction}`);
        setTimeout(() => element.classList.remove(`slide-in-${direction}`), 300);
    },
    
    /**
     * 淡入效果
     */
    fadeIn(element, duration = 300) {
        if (!this.enabled) {
            element.style.opacity = '1';
            return;
        }
        
        element.style.opacity = '0';
        element.style.transition = `opacity ${duration}ms ease`;
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
        });
    },
    
    /**
     * 抖动效果
     */
    shake(element) {
        if (!this.enabled || this.reducedMotion) return;
        
        element.classList.add('shake');
        setTimeout(() => element.classList.remove('shake'), 500);
    },
    
    /**
     * 脉冲效果
     */
    pulse(element) {
        if (!this.enabled || this.reducedMotion) return;
        
        element.classList.add('pulse');
        setTimeout(() => element.classList.remove('pulse'), 300);
    },
    
    /**
     * 数字滚动动画
     */
    countUp(element, from, to, duration = 1000) {
        if (!this.enabled || this.reducedMotion) {
            element.textContent = to;
            return;
        }
        
        const start = performance.now();
        const range = to - from;
        
        const update = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            // 使用 easeOutQuart 缓动
            const eased = 1 - Math.pow(1 - progress, 4);
            const current = Math.round(from + range * eased);
            
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        };
        
        requestAnimationFrame(update);
    },
    
    /**
     * 打字机效果
     */
    typewriter(element, text, speed = 50) {
        if (!this.enabled || this.reducedMotion) {
            element.textContent = text;
            return Promise.resolve();
        }
        
        return new Promise(resolve => {
            element.textContent = '';
            let i = 0;
            
            const type = () => {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                    setTimeout(type, speed);
                } else {
                    resolve();
                }
            };
            
            type();
        });
    },
    
    /**
     * 设置动画开关
     */
    setEnabled(enabled) {
        this.enabled = enabled;
        document.body.classList.toggle('animations-disabled', !enabled);
    }
};