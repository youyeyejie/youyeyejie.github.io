import sys
import re


def process_md_file(input_file, output_file=None):
    """
    处理md文件，将!!! 折叠块转换为{% %} 格式
    """
    if output_file is None:
        output_file = input_file
    
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    lines = content.split('\n')
    result_lines = []
    i = 0
    
    while i < len(lines):
        line = lines[i]
        
        # 匹配 !!! 标题 模式 (!!!后面至少一个空格)
        match = re.match(r'^(\s*)!!!\s+(.+)$', line)
        
        if match:
            # 获取原始缩进
            indent = match.group(1)
            title = match.group(2)  # 标题内容
            
            # 获取标题的第一个单词
            title_parts = title.split()
            first_word = title_parts[0] if title_parts else 'fold'
            
            # 开始标签：原始缩进 + 4个空格（增加一层缩进）
            indent = indent + '\t'  # 使用一个tab表示4个空格
            result_lines.append(f'{indent}{{% {title} %}}')
            
            # 处理正文块 - 收集比!!!缩进层数更多的内容
            i += 1
            body_started = False
            
            while i < len(lines):
                current_line = lines[i]
                
                # 检查当前行的缩进
                current_indent_match = re.match(r'^(\s*)', current_line)
                current_indent = current_indent_match.group(1)
                
                # 如果是空行，直接收集
                if current_line.strip() == '':
                    result_lines.append(current_line)
                    i += 1
                    continue
                
                # 正文块：缩进大于原始indent的行
                if len(current_indent) > len(indent):
                    result_lines.append(current_line)
                    body_started = True
                    i += 1
                else:
                    # 正文块结束
                    break
            
            # 添加结束标签前的空行（只保留一个空行）
            # 移除末尾多余的空行
            while result_lines[-1] == '':
                result_lines.pop()
            result_lines.append('')  # end前一个空行
            
            # 添加结束标签（与开始标签同缩进）
            result_lines.append(f'{indent}{{% end{first_word} %}}')
            
            # end后增加一个空行隔开后续内容
            result_lines.append('')
        else:
            # 不是!!!开头的行，直接添加
            result_lines.append(line)
            i += 1
    
    # 写入输出文件
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write('\n'.join(result_lines))
    
    print(f"处理完成: {input_file} -> {output_file}")


def find_md_files(dirs):
    """查找指定目录列表下的所有 md 文件"""
    files = []
    for d in dirs:
        if not d.exists() or not d.is_dir():
            print(f"目录不存在: {d}")
            continue
        files.extend([p for p in d.glob("*.md") if p.is_file()])
    files.sort(key=lambda p: p.stat().st_mtime)  # 按最后修改时间升序
    return files

def main():
    import sys
    from pathlib import Path
    
    script_dir = Path(__file__).resolve().parent
    posts_dir = script_dir / "source" / "_posts"
    drafts_dir = script_dir / "source" / "_drafts"
    files = find_md_files([posts_dir, drafts_dir])
    if not files:
        print("未找到任何 md 文件。")
        return

    print("按最后修改时间排序的 md 文件:")
    for idx, p in enumerate(files, start=1):
        print(f"{idx}. {p.name}")

    indices = input(f"请选择要处理的文件编号，回车选择最后一个: ")
    if not indices:
        indices = [len(files)]
    else:
        indices = [int(i) for i in re.findall(r'\d+', indices)]

    total_changes = 0
    for i in indices:
        p = files[i-1]
        process_md_file(str(p))
        total_changes += 1

    print(f"完成。总共处理了 {total_changes} 个文件。")


if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print("\n已取消。")
        sys.exit(1)
