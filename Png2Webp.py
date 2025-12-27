import re
import sys
from pathlib import Path
from datetime import datetime

def find_md_files(posts_dir: Path):
    if not posts_dir.exists() or not posts_dir.is_dir():
        print(f"目录不存在: {posts_dir}")
        return []
    files = [p for p in posts_dir.glob("*.md") if p.is_file()]
    files.sort(key=lambda p: p.stat().st_mtime)  # 按最后修改时间升序
    return files

def format_mtime(p: Path):
    return datetime.fromtimestamp(p.stat().st_mtime).strftime("%Y-%m-%d %H:%M:%S")


def process_file(md_path: Path):
    text = md_path.read_text(encoding="utf-8")
    basename = md_path.stem  # md 文件名，不带扩展
    # 匹配 image/image.png 或 image/image-1.png , 替换为 {basename}/image.webp 或 {basename}/image-1.webp
    pattern = re.compile(r'image/(image(?:-\d+)?)\.png')
    new_text, n = pattern.subn(rf'{basename}/\1.webp', text)
    if n > 0:
        # 备份原文件（如果不存在）
        bak = md_path.with_suffix(md_path.suffix + ".bak")
        if not bak.exists():
            bak.write_text(text, encoding="utf-8")
        md_path.write_text(new_text, encoding="utf-8")

    # 将 {basename} 文件夹中未被引用的 webp 文件删除
    m = 0
    dir_path = md_path.parent / basename
    if dir_path.exists() and dir_path.is_dir():
        referenced_webps = set(re.findall(rf'{basename}/(image(?:-\d+)?)\.webp', new_text))
        for webp_file in dir_path.glob("image*.webp"):
            webp_name = webp_file.stem  # 不带扩展名
            if webp_name not in referenced_webps:
                webp_file.unlink()
                m += 1

    return n, m


def main():
    script_dir = Path(__file__).resolve().parent
    posts_dir = script_dir / "source" / "_posts"
    files = find_md_files(posts_dir)
    if not files:
        print("未找到任何 md 文件。")
        return

    print("按最后修改时间排序的 md 文件:")
    for idx, p in enumerate(files, start=1):
        print(f"{idx}. {p.name}")

    indices = input(f"请选择要处理的文件编号，回车选择{len(files)}: ")
    if not indices:
        indices = [len(files)]
    else:
        indices = [int(i) for i in re.findall(r'\d+', indices)]

    total_changes = (0, 0)
    for i in indices:
        p = files[i-1]
        n, m = process_file(p)
        print(f"{p.name}: 替换 {n} 处，删除未引用的 webp 文件 {m} 个。")
        total_changes = (total_changes[0] + n, total_changes[1] + m)

    print(f"完成。总共替换 {total_changes[0]} 处，删除未引用的 webp 文件 {total_changes[1]} 个。")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n已取消。")
        sys.exit(1)