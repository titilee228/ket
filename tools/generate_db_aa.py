#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
填字游戏题库生成器
生成 puzzle_db_aa.js 供 aa-秒开版.html 使用
"""

import json
import random
import re
import os
from collections import defaultdict
from typing import List, Dict, Tuple, Optional, Set
from dataclasses import dataclass, field
from enum import Enum

# ==================== 配置常量 ====================

class Difficulty(Enum):
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"

# 难度配置
DIFFICULTY_CONFIG = {
    Difficulty.EASY: {
        'grid_size': (10, 10),
        'word_count_range': (5, 7),
        'word_length_range': (3, 6),
        'puzzles_to_generate': 1000
    },
    Difficulty.MEDIUM: {
        'grid_size': (13, 13),
        'word_count_range': (8, 12),
        'word_length_range': (4, 9),
        'puzzles_to_generate': 1000
    },
    Difficulty.HARD: {
        'grid_size': (16, 16),
        'word_count_range': (13, 18),
        'word_length_range': (5, 12),
        'puzzles_to_generate': 1000
    }
}

# ==================== 数据结构 ====================

@dataclass
class Position:
    """位置信息"""
    row: int
    col: int
    direction: str  # 'H' 或 'V'

@dataclass
class PlacedWord:
    """已放置的单词"""
    word: str
    row: int
    col: int
    direction: str
    hint: str = ""
    number: int = 0
    
    def get_cells(self) -> List[Tuple[int, int]]:
        """获取单词占用的所有格子坐标"""
        cells = []
        for i in range(len(self.word)):
            if self.direction == 'H':
                cells.append((self.row, self.col + i))
            else:
                cells.append((self.row + i, self.col))
        return cells

@dataclass
class Grid:
    """网格类"""
    rows: int
    cols: int
    cells: List[List[str]] = field(default_factory=list)
    
    def __post_init__(self):
        if not self.cells:
            self.cells = [['' for _ in range(self.cols)] for _ in range(self.rows)]
    
    def get(self, row: int, col: int) -> str:
        """获取格子内容"""
        if 0 <= row < self.rows and 0 <= col < self.cols:
            return self.cells[row][col]
        return None
    
    def set(self, row: int, col: int, char: str):
        """设置格子内容"""
        if 0 <= row < self.rows and 0 <= col < self.cols:
            self.cells[row][col] = char
    
    def is_empty(self, row: int, col: int) -> bool:
        """检查格子是否为空"""
        return self.get(row, col) == ''
    
    def copy(self) -> 'Grid':
        """复制网格"""
        new_grid = Grid(self.rows, self.cols)
        new_grid.cells = [row[:] for row in self.cells]
        return new_grid

@dataclass
class Puzzle:
    """谜题类"""
    grid_size: Tuple[int, int]
    words: List[PlacedWord]
    difficulty: str
    
    def to_dict(self) -> dict:
        """转换为字典格式"""
        return {
            'gridSize': {'rows': self.grid_size[0], 'cols': self.grid_size[1]},
            'words': [
                {
                    'w': w.word,
                    'r': w.row,
                    'c': w.col,
                    'd': w.direction,
                    'h': w.hint,
                    'n': w.number
                }
                for w in self.words
            ]
        }

# ==================== 词库管理 ====================

class WordBank:
    """词库管理类"""
    
    def __init__(self, words: List[str], hints: Dict[str, str]):
        self.words = [w.upper().strip() for w in words if w.strip()]
        self.hints = {k.upper(): v for k, v in hints.items()}
        self._build_index()
    
    def _build_index(self):
        """构建索引以加速查找"""
        # 按长度分组
        self.by_length: Dict[int, List[str]] = defaultdict(list)
        for word in self.words:
            self.by_length[len(word)].append(word)
        
        # 按字母位置索引 {(位置, 字母): [单词列表]}
        self.by_char_at: Dict[Tuple[int, str], List[str]] = defaultdict(list)
        for word in self.words:
            for i, char in enumerate(word):
                self.by_char_at[(i, char)].append(word)
    
    def get_hint(self, word: str) -> str:
        """获取单词提示"""
        return self.hints.get(word.upper(), f"Definition of {word}")
    
    def get_words_by_length(self, min_len: int, max_len: int) -> List[str]:
        """获取指定长度范围的单词"""
        result = []
        for length in range(min_len, max_len + 1):
            result.extend(self.by_length.get(length, []))
        return result
    
    def get_words_with_char_at(self, position: int, char: str, 
                                min_len: int = 3, max_len: int = 15) -> List[str]:
        """获取在指定位置有指定字母的单词"""
        candidates = self.by_char_at.get((position, char.upper()), [])
        return [w for w in candidates if min_len <= len(w) <= max_len]

# ==================== 谜题生成器 ====================

class PuzzleGenerator:
    """谜题生成器"""
    
    def __init__(self, word_bank: WordBank):
        self.word_bank = word_bank
    
    def generate(self, difficulty: Difficulty) -> Optional[Puzzle]:
        """生成一个谜题"""
        config = DIFFICULTY_CONFIG[difficulty]
        grid_size = config['grid_size']
        word_count_range = config['word_count_range']
        word_length_range = config['word_length_range']
        
        # 获取符合长度要求的单词
        available_words = self.word_bank.get_words_by_length(
            word_length_range[0], word_length_range[1]
        )
        
        if len(available_words) < word_count_range[1]:
            print(f"警告: 可用单词不足 ({len(available_words)})")
            return None
        
        # 尝试生成
        max_attempts = 50
        for attempt in range(max_attempts):
            result = self._try_generate(
                grid_size, 
                word_count_range,
                available_words.copy()
            )
            if result:
                puzzle = Puzzle(
                    grid_size=grid_size,
                    words=result,
                    difficulty=difficulty.value
                )
                self._assign_numbers(puzzle)
                self._assign_hints(puzzle)
                return puzzle
        
        return None
    
    def _try_generate(self, grid_size: Tuple[int, int], 
                      word_count_range: Tuple[int, int],
                      available_words: List[str]) -> Optional[List[PlacedWord]]:
        """尝试生成一个谜题"""
        grid = Grid(grid_size[0], grid_size[1])
        placed_words: List[PlacedWord] = []
        used_words: Set[str] = set()
        
        target_count = random.randint(word_count_range[0], word_count_range[1])
        
        # 随机打乱单词顺序
        random.shuffle(available_words)
        
        # 放置第一个单词（种子词）
        seed_word = self._select_seed_word(available_words, grid_size)
        if not seed_word:
            return None
        
        seed_pos = self._get_center_position(seed_word, grid_size, 'H')
        self._place_word(grid, seed_word, seed_pos)
        placed_words.append(PlacedWord(
            word=seed_word,
            row=seed_pos.row,
            col=seed_pos.col,
            direction=seed_pos.direction
        ))
        used_words.add(seed_word)
        
        # 迭代放置更多单词
        max_iterations = 500
        iteration = 0
        
        while len(placed_words) < target_count and iteration < max_iterations:
            iteration += 1
            
            # 找到最佳放置方案
            best_placement = self._find_best_placement(
                grid, placed_words, available_words, used_words
            )
            
            if not best_placement:
                continue
            
            word, position = best_placement
            self._place_word(grid, word, position)
            placed_words.append(PlacedWord(
                word=word,
                row=position.row,
                col=position.col,
                direction=position.direction
            ))
            used_words.add(word)
        
        # 检查是否达到最小单词数
        if len(placed_words) < word_count_range[0]:
            return None
        
        return placed_words
    
    def _select_seed_word(self, words: List[str], 
                          grid_size: Tuple[int, int]) -> Optional[str]:
        """选择种子词"""
        max_length = min(grid_size[0], grid_size[1]) - 2
        suitable_words = [w for w in words if 4 <= len(w) <= max_length]
        
        if not suitable_words:
            return None
        
        # 优先选择中等长度的词
        target_length = max_length // 2 + 2
        suitable_words.sort(key=lambda w: abs(len(w) - target_length))
        
        return suitable_words[0]
    
    def _get_center_position(self, word: str, grid_size: Tuple[int, int], 
                             direction: str) -> Position:
        """获取居中位置"""
        if direction == 'H':
            row = grid_size[0] // 2
            col = (grid_size[1] - len(word)) // 2
        else:
            row = (grid_size[0] - len(word)) // 2
            col = grid_size[1] // 2
        
        return Position(row, col, direction)
    
    def _find_best_placement(self, grid: Grid, placed_words: List[PlacedWord],
                             available_words: List[str], 
                             used_words: Set[str]) -> Optional[Tuple[str, Position]]:
        """找到最佳放置方案"""
        candidates = []
        
        # 遍历已放置的单词，寻找交叉点
        for placed in placed_words:
            for i, char in enumerate(placed.word):
                # 计算交叉点坐标
                if placed.direction == 'H':
                    cross_row = placed.row
                    cross_col = placed.col + i
                    new_direction = 'V'
                else:
                    cross_row = placed.row + i
                    cross_col = placed.col
                    new_direction = 'H'
                
                # 寻找能在此位置交叉的单词
                for word in available_words:
                    if word in used_words:
                        continue
                    
                    # 检查单词中是否有匹配的字母
                    for j, word_char in enumerate(word):
                        if word_char != char:
                            continue
                        
                        # 计算新单词的起始位置
                        if new_direction == 'H':
                            new_row = cross_row
                            new_col = cross_col - j
                        else:
                            new_row = cross_row - j
                            new_col = cross_col
                        
                        pos = Position(new_row, new_col, new_direction)
                        
                        # 验证放置有效性
                        if self._is_valid_placement(grid, word, pos, placed_words):
                            score = self._calculate_score(grid, word, pos)
                            candidates.append((word, pos, score))
        
        if not candidates:
            return None
        
        # 按得分排序，返回最佳方案
        candidates.sort(key=lambda x: x[2], reverse=True)
        
        # 添加一些随机性，从前几个候选中随机选择
        top_n = min(5, len(candidates))
        selected = random.choice(candidates[:top_n])
        
        return (selected[0], selected[1])
    
    def _is_valid_placement(self, grid: Grid, word: str, 
                           pos: Position, placed_words: List[PlacedWord]) -> bool:
        """验证放置是否有效"""
        rows, cols = grid.rows, grid.cols
        word_len = len(word)
        
        # 检查边界
        if pos.row < 0 or pos.col < 0:
            return False
        
        if pos.direction == 'H':
            if pos.col + word_len > cols or pos.row >= rows:
                return False
        else:
            if pos.row + word_len > rows or pos.col >= cols:
                return False
        
        # 检查起始位置前是否有字母（不能紧贴其他单词）
        if pos.direction == 'H':
            if pos.col > 0 and grid.get(pos.row, pos.col - 1) != '':
                return False
            # 检查结束位置后是否有字母
            end_col = pos.col + word_len
            if end_col < cols and grid.get(pos.row, end_col) != '':
                return False
        else:
            if pos.row > 0 and grid.get(pos.row - 1, pos.col) != '':
                return False
            end_row = pos.row + word_len
            if end_row < rows and grid.get(end_row, pos.col) != '':
                return False
        
        # 检查每个字母位置
        has_intersection = False
        for i, char in enumerate(word):
            if pos.direction == 'H':
                r, c = pos.row, pos.col + i
            else:
                r, c = pos.row + i, pos.col
            
            existing = grid.get(r, c)
            
            if existing == '':
                # 空格子：检查平行相邻是否有字母
                if pos.direction == 'H':
                    # 检查上下
                    if (r > 0 and grid.get(r - 1, c) != '' and 
                        not self._is_part_of_crossing_word(r - 1, c, 'V', placed_words)):
                        return False
                    if (r < rows - 1 and grid.get(r + 1, c) != '' and
                        not self._is_part_of_crossing_word(r + 1, c, 'V', placed_words)):
                        return False
                else:
                    # 检查左右
                    if (c > 0 and grid.get(r, c - 1) != '' and
                        not self._is_part_of_crossing_word(r, c - 1, 'H', placed_words)):
                        return False
                    if (c < cols - 1 and grid.get(r, c + 1) != '' and
                        not self._is_part_of_crossing_word(r, c + 1, 'H', placed_words)):
                        return False
            
            elif existing == char:
                # 交叉点：字母匹配
                has_intersection = True
            else:
                # 字母不匹配
                return False
        
        return has_intersection
    
    def _is_part_of_crossing_word(self, row: int, col: int, 
                                   direction: str, placed_words: List[PlacedWord]) -> bool:
        """检查位置是否属于指定方向的单词"""
        for pw in placed_words:
            if pw.direction != direction:
                continue
            cells = pw.get_cells()
            if (row, col) in cells:
                return True
        return False
    
    def _calculate_score(self, grid: Grid, word: str, pos: Position) -> float:
        """计算放置得分"""
        score = 0.0
        
        # 交叉数量得分
        intersections = 0
        for i in range(len(word)):
            if pos.direction == 'H':
                r, c = pos.row, pos.col + i
            else:
                r, c = pos.row + i, pos.col
            
            if grid.get(r, c) != '':
                intersections += 1
        
        score += intersections * 15
        
        # 居中程度得分
        center_row = grid.rows // 2
        center_col = grid.cols // 2
        
        if pos.direction == 'H':
            word_center_row = pos.row
            word_center_col = pos.col + len(word) // 2
        else:
            word_center_row = pos.row + len(word) // 2
            word_center_col = pos.col
        
        distance = abs(word_center_row - center_row) + abs(word_center_col - center_col)
        max_distance = center_row + center_col
        score += 10 * (1 - distance / max_distance)
        
        # 单词长度得分（中等长度最优）
        if 5 <= len(word) <= 8:
            score += 5
        elif 4 <= len(word) <= 9:
            score += 3
        
        return score
    
    def _place_word(self, grid: Grid, word: str, pos: Position):
        """将单词放置到网格"""
        for i, char in enumerate(word):
            if pos.direction == 'H':
                grid.set(pos.row, pos.col + i, char)
            else:
                grid.set(pos.row + i, pos.col, char)
    
    def _assign_numbers(self, puzzle: Puzzle):
        """分配单词编号"""
        # 收集所有单词的起始位置
        starts = {}
        for word in puzzle.words:
            key = (word.row, word.col)
            if key not in starts:
                starts[key] = {'H': None, 'V': None}
            starts[key][word.direction] = word
        
        # 按位置排序（从上到下，从左到右）
        sorted_positions = sorted(starts.keys(), key=lambda x: (x[0], x[1]))
        
        # 分配编号
        number = 1
        for pos in sorted_positions:
            words_at_pos = starts[pos]
            for direction in ['H', 'V']:
                if words_at_pos[direction]:
                    words_at_pos[direction].number = number
            number += 1
    
    def _assign_hints(self, puzzle: Puzzle):
        """分配单词提示"""
        for word in puzzle.words:
            word.hint = self.word_bank.get_hint(word.word)

# ==================== 提示提取器 ====================

class HintExtractor:
    """从HTML文件提取提示"""
    
    @staticmethod
    def extract_from_html(html_path: str) -> Dict[str, str]:
        """从HTML文件提取KNOWN_HINTS"""
        hints = {}
        
        if not os.path.exists(html_path):
            print(f"警告: HTML文件不存在 {html_path}")
            return hints
        
        try:
            with open(html_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # 查找 KNOWN_HINTS 对象
            pattern = r'const\s+KNOWN_HINTS\s*=\s*\{([^}]+)\}'
            match = re.search(pattern, content, re.DOTALL)
            
            if match:
                hints_content = match.group(1)
                # 解析每个条目
                entry_pattern = r'"([^"]+)"\s*:\s*"([^"]*)"'
                for entry_match in re.finditer(entry_pattern, hints_content):
                    word = entry_match.group(1).upper()
                    hint = entry_match.group(2)
                    hints[word] = hint
            
            print(f"从HTML提取了 {len(hints)} 个提示")
            
        except Exception as e:
            print(f"提取提示时出错: {e}")
        
        return hints

# ==================== 文件IO ====================

class FileIO:
    """文件输入输出"""
    
    @staticmethod
    def load_words(filepath: str) -> List[str]:
        """加载词库文件"""
        words = []
        
        if not os.path.exists(filepath):
            print(f"错误: 词库文件不存在 {filepath}")
            return words
        
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                for line in f:
                    word = line.strip().upper()
                    if word and word.isalpha() and len(word) >= 3:
                        words.append(word)
            
            print(f"加载了 {len(words)} 个单词")
            
        except Exception as e:
            print(f"加载词库时出错: {e}")
        
        return words
    
    @staticmethod
    def save_puzzle_db(puzzles: Dict[str, List[dict]], filepath: str):
        """保存题库到JS文件"""
        try:
            # 统计信息
            total = sum(len(p) for p in puzzles.values())
            
            # 生成JS内容
            js_content = f'''// 自动生成的填字游戏题库
// 生成时间: {__import__('datetime').datetime.now().isoformat()}
// 总题目数: {total}

const PUZZLE_DB = {{
    version: "1.0.0",
    totalCount: {total},
    puzzles: {json.dumps(puzzles, ensure_ascii=False, indent=2)}
}};
'''
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(js_content)
            
            print(f"题库已保存到 {filepath}")
            print(f"  - easy: {len(puzzles.get('easy', []))} 题")
            print(f"  - medium: {len(puzzles.get('medium', []))} 题")
            print(f"  - hard: {len(puzzles.get('hard', []))} 题")
            
        except Exception as e:
            print(f"保存题库时出错: {e}")

# ==================== 主程序 ====================

def main():
    """主函数"""
    print("=" * 50)
    print("填字游戏题库生成器")
    print("=" * 50)
    
    # 配置文件路径
    words_file = "words.txt"
    html_file = "../aa-秒开版.html"
    output_file = "../data/puzzle_db_aa.js"
    
    # 加载词库
    print("\n[1/4] 加载词库...")
    words = FileIO.load_words(words_file)
    if not words:
        print("错误: 无法加载词库")
        return
    
    # 提取提示
    print("\n[2/4] 提取单词提示...")
    hints = HintExtractor.extract_from_html(html_file)
    
    # 创建词库和生成器
    word_bank = WordBank(words, hints)
    generator = PuzzleGenerator(word_bank)
    
    # 生成各难度题库
    print("\n[3/4] 生成谜题...")
    all_puzzles = {}
    
    for difficulty in Difficulty:
        config = DIFFICULTY_CONFIG[difficulty]
        target_count = config['puzzles_to_generate']
        
        print(f"\n  生成 {difficulty.value} 难度 ({target_count} 题)...")
        
        puzzles = []
        attempts = 0
        max_attempts = target_count * 3
        
        while len(puzzles) < target_count and attempts < max_attempts:
            attempts += 1
            puzzle = generator.generate(difficulty)
            
            if puzzle:
                puzzles.append(puzzle.to_dict())
                
                # 进度显示
                if len(puzzles) % 100 == 0:
                    print(f"    已生成 {len(puzzles)}/{target_count}")
        
        all_puzzles[difficulty.value] = puzzles
        print(f"    完成: {len(puzzles)} 题")
    
    # 保存题库
    print("\n[4/4] 保存题库...")
    FileIO.save_puzzle_db(all_puzzles, output_file)
    
    print("\n" + "=" * 50)
    print("生成完成!")
    print("=" * 50)

if __name__ == "__main__":
    main()