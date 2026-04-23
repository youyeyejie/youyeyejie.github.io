import re
import sys
from io import BytesIO
from pathlib import Path
from datetime import datetime
from typing import Any

try:
    from PIL import Image
except ImportError:
    Image = None

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

def format_mtime(p: Path):
    return datetime.fromtimestamp(p.stat().st_mtime).strftime("%Y-%m-%d %H:%M:%S")


def choose_convert_mode():
    print("\n请选择 PNG 转 WEBP 方式:")
    print("1. 固定质量 90%")
    print("2. 上限 100KB（自动寻找合适质量）")
    print("3. 尽量保真且不超过阈值（可自定义 KB）")
    print("4. 指定质量")

    while True:
        mode = input("请输入选项编号(1/2/3/4)，默认 1: ").strip() or "1"
        if mode in {"1", "2", "3", "4"}:
            break
        print("无效选项，请输入 1、2、3 或 4。")

    if mode == "1":
        return {"type": "fixed", "quality": 90}
    if mode == "2":
        return {"type": "limit", "max_kb": 100}
    if mode == "3":
        while True:
            kb = input("请输入阈值大小(KB，正整数): ").strip()
            if kb.isdigit() and int(kb) > 0:
                return {"type": "limit", "max_kb": int(kb), "report_quality": True}
            print("阈值无效，请输入正整数。")

    while True:
        q = input("请输入质量(1-100): ").strip()
        if q.isdigit() and 1 <= int(q) <= 100:
            return {"type": "fixed", "quality": int(q)}
        print("质量无效，请输入 1 到 100 的整数。")


def encode_webp_bytes(img: Any, quality: int):
    buf = BytesIO()
    img.save(buf, format="WEBP", quality=quality, method=6)
    return buf.getvalue()


def find_best_quality_under_limit(img: Any, max_bytes: int):
    lo, hi = 1, 100
    best_data = None
    best_quality = None
    while lo <= hi:
        mid = (lo + hi) // 2
        data_mid = encode_webp_bytes(img, mid)
        if len(data_mid) <= max_bytes:
            best_data = data_mid
            best_quality = mid
            lo = mid + 1
        else:
            hi = mid - 1

    if best_data is None:
        # 在最小质量下也超限时，仍输出最低质量结果
        return encode_webp_bytes(img, 1), 1, False
    return best_data, best_quality, True


def md_has_png_assets(md_path: Path):
    basename = md_path.stem
    dir_path = md_path.parent / basename
    return dir_path.exists() and dir_path.is_dir() and any(dir_path.glob("*.png"))


def convert_png_to_webp(dir_path: Path, convert_mode):
    converted = 0
    failed = 0
    quality_records = []

    if not dir_path.exists() or not dir_path.is_dir():
        return converted, failed, quality_records

    for png_path in sorted(dir_path.glob("*.png")):
        webp_path = png_path.with_suffix(".webp")
        try:
            with Image.open(png_path) as im:
                img = im.convert("RGBA") if im.mode in ("P", "LA", "RGBA") else im.convert("RGB")

                if convert_mode["type"] == "fixed":
                    quality = convert_mode["quality"]
                    data = encode_webp_bytes(img, quality)
                else:
                    max_bytes = convert_mode["max_kb"] * 1024
                    data, quality, _ = find_best_quality_under_limit(img, max_bytes)

            webp_path.write_bytes(data)
            png_path.unlink()
            converted += 1
            quality_records.append((png_path.name, quality, len(data)))
        except Exception as e:
            failed += 1
            print(f"转换失败: {png_path.name} ({e})")

    return converted, failed, quality_records


def process_file(md_path: Path, convert_mode=None):
    text = md_path.read_text(encoding="utf-8")
    basename = md_path.stem  # md 文件名，不带扩展
    dir_path = md_path.parent / basename

    # 先将文章对应文件夹中的 png 转为 webp
    converted, failed, quality_records = (0, 0, [])
    if convert_mode is not None:
        converted, failed, quality_records = convert_png_to_webp(dir_path, convert_mode)

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
    if dir_path.exists() and dir_path.is_dir():
        referenced_webps = set(re.findall(rf'{basename}/(image(?:-\d+)?)\.webp', new_text))
        for webp_file in dir_path.glob("image*.webp"):
            webp_name = webp_file.stem  # 不带扩展名
            if webp_name not in referenced_webps:
                webp_file.unlink()
                m += 1

    return converted, failed, n, m, quality_records


def main():
    if Image is None:
        print("未安装 Pillow，请先执行: pip install pillow")
        sys.exit(1)

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

    indices = input(f"请选择要处理的文件编号，回车选择{len(files)}: ")
    if not indices:
        indices = [len(files)]
    else:
        indices = [int(i) for i in re.findall(r'\d+', indices)]

    selected_files = []
    for i in indices:
        if i < 1 or i > len(files):
            print(f"跳过无效编号: {i}")
            continue
        selected_files.append(files[i-1])

    if not selected_files:
        print("没有有效文件可处理。")
        return

    need_convert = any(md_has_png_assets(p) for p in selected_files)
    convert_mode = choose_convert_mode() if need_convert else None

    total = {"converted": 0, "failed": 0, "replaced": 0, "deleted": 0}
    for p in selected_files:
        converted, failed, n, m, quality_records = process_file(p, convert_mode)
        if need_convert:
            print(
                f"{p.name}: PNG->WEBP 转换 {converted} 个，失败 {failed} 个；"
                f"替换 {n} 处，删除未引用的 webp 文件 {m} 个。"
            )
        if convert_mode is not None and convert_mode.get("report_quality"):
            for name, q, size_bytes in quality_records:
                print(f"  - {name} 最终质量={q}，输出大小={size_bytes / 1024:.1f}KB")
        total["converted"] += converted
        total["failed"] += failed
        total["replaced"] += n
        total["deleted"] += m

    print(
        "完成。"
        f"总共 PNG->WEBP 转换 {total['converted']} 个，失败 {total['failed']} 个；"
        f"替换 {total['replaced']} 处，删除未引用的 webp 文件 {total['deleted']} 个。"
    )

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n已取消。")
        sys.exit(1)