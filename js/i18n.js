/**
 * ==========================================
 * 多语言系统
 * ==========================================
 */

const I18n = {
    // 当前语言
    currentLang: 'zh',
    
    // 支持的语言
    supportedLangs: ['zh', 'en', 'ja'],
    
    // 语言包
    translations: {
        // ==================== 中文 ====================
        zh: {
            // 通用
            app: {
                title: '英语填字游戏',
                subtitle: '边玩边学单词'
            },
            
            // 按钮
            buttons: {
                newGame: '新游戏',
                check: '检查',
                hint: '提示',
                reset: '重置',
                pause: '暂停',
                resume: '继续',
                settings: '设置',
                statistics: '统计',
                close: '关闭',
                confirm: '确认',
                cancel: '取消',
                nextPuzzle: '下一题',
                playAgain: '再玩一次',
                continueGame: '继续游戏',
                startNew: '开始新游戏'
            },
            
            // 难度
            difficulty: {
                label: '难度',
                easy: '简单',
                medium: '中等',
                hard: '困难'
            },
            
            // 提示面板
            hints: {
                title: '单词提示',
                across: '横向',
                down: '纵向',
                currentWord: '当前单词'
            },
            
            // 状态栏
            status: {
                time: '用时',
                progress: '进度',
                words: '单词'
            },
            
            // 消息
            messages: {
                loading: '加载中...',
                selectCell: '选择一个格子开始',
                correct: '正确！',
                incorrect: '还有错误，再试试',
                complete: '恭喜完成！',
                allCorrect: '全部正确！',
                noHint: '没有可用的提示',
                saved: '游戏已保存',
                restored: '已恢复上次游戏',
                resetConfirm: '确定要重置吗？所有输入将被清除。',
                hasSavedGame: '发现未完成的游戏，是否继续？'
            },
            
            // 完成弹窗
            complete: {
                title: '🎉 恭喜完成！',
                subtitle: '你成功完成了这个填字游戏',
                time: '用时',
                words: '单词数',
                bestTime: '最佳时间',
                newRecord: '🏆 新纪录！'
            },
            
            // 统计
            statistics: {
                title: '游戏统计',
                gamesPlayed: '游戏次数',
                gamesCompleted: '完成次数',
                completionRate: '完成率',
                wordsCompleted: '完成单词',
                totalTime: '总用时',
                bestTimes: '最佳时间',
                currentStreak: '当前连胜',
                bestStreak: '最佳连胜',
                reset: '重置统计',
                resetConfirm: '确定要重置所有统计数据吗？'
            },
            
            // 设置
            settings: {
                title: '设置',
                language: '语言',
                sound: '音效',
                soundVolume: '音量',
                animations: '动画效果',
                darkMode: '深色模式',
                showTimer: '显示计时器',
                autoCheck: '自动检查',
                about: '关于'
            },
            
            // 时间格式
            time: {
                hours: '小时',
                minutes: '分钟',
                seconds: '秒'
            },
            
            // 操作提示
            tips: {
                keyboard: '使用键盘输入字母',
                arrows: '方向键移动光标',
                space: '空格键切换方向',
                tab: 'Tab 键切换单词',
                backspace: '退格键删除'
            }
        },
        
        // ==================== 英文 ====================
        en: {
            app: {
                title: 'Crossword Puzzle',
                subtitle: 'Learn words while playing'
            },
            
            buttons: {
                newGame: 'New Game',
                check: 'Check',
                hint: 'Hint',
                reset: 'Reset',
                pause: 'Pause',
                resume: 'Resume',
                settings: 'Settings',
                statistics: 'Statistics',
                close: 'Close',
                confirm: 'Confirm',
                cancel: 'Cancel',
                nextPuzzle: 'Next Puzzle',
                playAgain: 'Play Again',
                continueGame: 'Continue',
                startNew: 'Start New'
            },
            
            difficulty: {
                label: 'Difficulty',
                easy: 'Easy',
                medium: 'Medium',
                hard: 'Hard'
            },
            
            hints: {
                title: 'Clues',
                across: 'Across',
                down: 'Down',
                currentWord: 'Current word'
            },
            
            status: {
                time: 'Time',
                progress: 'Progress',
                words: 'Words'
            },
            
            messages: {
                loading: 'Loading...',
                selectCell: 'Select a cell to start',
                correct: 'Correct!',
                incorrect: 'Some errors remain, try again',
                complete: 'Congratulations!',
                allCorrect: 'All correct!',
                noHint: 'No hints available',
                saved: 'Game saved',
                restored: 'Previous game restored',
                resetConfirm: 'Are you sure? All input will be cleared.',
                hasSavedGame: 'Found an unfinished game. Continue?'
            },
            
            complete: {
                title: '🎉 Congratulations!',
                subtitle: 'You completed this crossword puzzle',
                time: 'Time',
                words: 'Words',
                bestTime: 'Best Time',
                newRecord: '🏆 New Record!'
            },
            
            statistics: {
                title: 'Statistics',
                gamesPlayed: 'Games Played',
                gamesCompleted: 'Games Completed',
                completionRate: 'Completion Rate',
                wordsCompleted: 'Words Completed',
                totalTime: 'Total Time',
                bestTimes: 'Best Times',
                currentStreak: 'Current Streak',
                bestStreak: 'Best Streak',
                reset: 'Reset Stats',
                resetConfirm: 'Reset all statistics?'
            },
            
            settings: {
                title: 'Settings',
                language: 'Language',
                sound: 'Sound',
                soundVolume: 'Volume',
                animations: 'Animations',
                darkMode: 'Dark Mode',
                showTimer: 'Show Timer',
                autoCheck: 'Auto Check',
                about: 'About'
            },
            
            time: {
                hours: 'h',
                minutes: 'm',
                seconds: 's'
            },
            
            tips: {
                keyboard: 'Type letters with keyboard',
                arrows: 'Arrow keys to move',
                space: 'Space to change direction',
                tab: 'Tab to next word',
                backspace: 'Backspace to delete'
            }
        },
        
        // ==================== 日文 ====================
        ja: {
            app: {
                title: 'クロスワードパズル',
                subtitle: '遊びながら単語を学ぼう'
            },
            
            buttons: {
                newGame: '新しいゲーム',
                check: 'チェック',
                hint: 'ヒント',
                reset: 'リセット',
                pause: '一時停止',
                resume: '再開',
                settings: '設定',
                statistics: '統計',
                close: '閉じる',
                confirm: '確認',
                cancel: 'キャンセル',
                nextPuzzle: '次の問題',
                playAgain: 'もう一度',
                continueGame: '続ける',
                startNew: '新規開始'
            },
            
            difficulty: {
                label: '難易度',
                easy: '簡単',
                medium: '普通',
                hard: '難しい'
            },
            
            hints: {
                title: 'ヒント',
                across: '横',
                down: '縦',
                currentWord: '現在の単語'
            },
            
            status: {
                time: '時間',
                progress: '進捗',
                words: '単語'
            },
            
            messages: {
                loading: '読み込み中...',
                selectCell: 'マスを選択してください',
                correct: '正解！',
                incorrect: 'まだ間違いがあります',
                complete: 'おめでとうございます！',
                allCorrect: '全問正解！',
                noHint: 'ヒントがありません',
                saved: 'ゲームを保存しました',
                restored: '前回のゲームを復元しました',
                resetConfirm: 'リセットしますか？入力が消えます。',
                hasSavedGame: '未完了のゲームがあります。続けますか？'
            },
            
            complete: {
                title: '🎉 クリア！',
                subtitle: 'パズルを完成させました',
                time: '時間',
                words: '単語数',
                bestTime: 'ベストタイム',
                newRecord: '🏆 新記録！'
            },
            
            statistics: {
                title: '統計',
                gamesPlayed: 'プレイ回数',
                gamesCompleted: '完了回数',
                completionRate: '完了率',
                wordsCompleted: '完了した単語',
                totalTime: '合計時間',
                bestTimes: 'ベストタイム',
                currentStreak: '現在の連勝',
                bestStreak: '最高連勝',
                reset: '統計をリセット',
                resetConfirm: '統計をリセットしますか？'
            },
            
            settings: {
                title: '設定',
                language: '言語',
                sound: '効果音',
                soundVolume: '音量',
                animations: 'アニメーション',
                darkMode: 'ダークモード',
                showTimer: 'タイマー表示',
                autoCheck: '自動チェック',
                about: 'について'
            },
            
            time: {
                hours: '時間',
                minutes: '分',
                seconds: '秒'
            },
            
            tips: {
                keyboard: 'キーボードで入力',
                arrows: '矢印キーで移動',
                space: 'スペースで方向変更',
                tab: 'Tabで次の単語',
                backspace: 'Backspaceで削除'
            }
        }
    },
    
    /**
     * 初始化
     */
    init() {
        // 从存储加载语言设置
        const savedLang = StorageManager.getSetting('language');
        if (savedLang && this.supportedLangs.includes(savedLang)) {
            this.currentLang = savedLang;
        } else {
            // 检测浏览器语言
            this.currentLang = this._detectLanguage();
        }
        
        // 更新页面
        this.updatePage();
    },
    
    /**
     * 检测浏览器语言
     */
    _detectLanguage() {
        const browserLang = navigator.language || navigator.userLanguage;
        const shortLang = browserLang.split('-')[0];
        
        if (this.supportedLangs.includes(shortLang)) {
            return shortLang;
        }
        
        return 'zh'; // 默认中文
    },
    
    /**
     * 切换语言
     */
    setLanguage(lang) {
        if (!this.supportedLangs.includes(lang)) {
            console.warn(`不支持的语言: ${lang}`);
            return false;
        }
        
        this.currentLang = lang;
        StorageManager.setSetting('language', lang);
        this.updatePage();
        
        EventBus.emit('language:change', { language: lang });
        return true;
    },
    
    /**
     * 获取翻译
     */
    t(key, params = {}) {
        const keys = key.split('.');
        let value = this.translations[this.currentLang];
        
        for (const k of keys) {
            if (value && typeof value === 'object') {
                value = value[k];
            } else {
                // 回退到英文
                value = this._getFallback(keys);
                break;
            }
        }
        
        if (typeof value !== 'string') {
            console.warn(`翻译未找到: ${key}`);
            return key;
        }
        
        // 替换参数
        return value.replace(/\{(\w+)\}/g, (match, param) => {
            return params[param] !== undefined ? params[param] : match;
        });
    },
    
    /**
     * 回退到英文
     */
    _getFallback(keys) {
        let value = this.translations['en'];
        for (const k of keys) {
            if (value && typeof value === 'object') {
                value = value[k];
            } else {
                return null;
            }
        }
        return value;
    },
    
    /**
     * 更新页面上所有翻译
     */
    updatePage() {
        // 更新所有带 data-i18n 属性的元素
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            el.textContent = this.t(key);
        });
        
        // 更新带 data-i18n-placeholder 的输入框
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            el.placeholder = this.t(key);
        });
        
        // 更新带 data-i18n-title 的元素
        document.querySelectorAll('[data-i18n-title]').forEach(el => {
            const key = el.getAttribute('data-i18n-title');
            el.title = this.t(key);
        });
        
        // 更新 HTML lang 属性
        document.documentElement.lang = this.currentLang;
    },
    
    /**
     * 获取语言名称
     */
    getLanguageName(lang) {
        const names = {
            zh: '中文',
            en: 'English',
            ja: '日本語'
        };
        return names[lang] || lang;
    },
    
    /**
     * 获取所有支持的语言
     */
    getSupportedLanguages() {
        return this.supportedLangs.map(lang => ({
            code: lang,
            name: this.getLanguageName(lang)
        }));
    }
};