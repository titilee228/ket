/**
 * 深色模式管理
 */
const ThemeManager = {
    isDark: false,
    
    /**
     * 初始化
     */
    init() {
        // 从存储加载设置
        const savedDark = StorageManager.getSetting('darkMode');
        
        if (savedDark !== undefined) {
            this.isDark = savedDark;
        } else {
            // 检测系统偏好
            this.isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        
        this.apply();
        
        // 监听系统主题变化
        window.matchMedia('(prefers-color-scheme: dark)')
            .addEventListener('change', (e) => {
                if (StorageManager.getSetting('darkMode') === undefined) {
                    this.isDark = e.matches;
                    this.apply();
                }
            });
    },
    
    /**
     * 切换模式
     */
    toggle() {
        this.isDark = !this.isDark;
        StorageManager.setSetting('darkMode', this.isDark);
        this.apply();
        return this.isDark;
    },
    
    /**
     * 设置模式
     */
    setDark(isDark) {
        this.isDark = isDark;
        StorageManager.setSetting('darkMode', isDark);
        this.apply();
    },
    
    /**
     * 应用主题
     */
    apply() {
        document.documentElement.setAttribute(
            'data-theme', 
            this.isDark ? 'dark' : 'light'
        );
        
        // 更新 meta theme-color
        const metaTheme = document.querySelector('meta[name="theme-color"]');
        if (metaTheme) {
            metaTheme.content = this.isDark ? '#1E1E1E' : '#667eea';
        }
        
        EventBus.emit('theme:change', { isDark: this.isDark });
    }
};