import os
from PIL import Image
import argparse

def process_markdown_file(md_file_path):
    """处理Markdown文件，添加图片SVG标签"""
    # 验证MD文件是否存在
    if not os.path.exists(md_file_path):
        print(f"错误：文件 '{md_file_path}' 不存在。")
        return
    
    # 提取文件名（不带扩展名）
    md_file_name = os.path.basename(md_file_path)
    base_name = os.path.splitext(md_file_name)[0]
    
    # 获取图片文件夹路径
    image_folder = os.path.join(os.path.dirname(md_file_path), base_name)
    
    # 验证图片文件夹是否存在
    if not os.path.exists(image_folder):
        print(f"错误：图片文件夹 '{image_folder}' 不存在。")
        return
    
    # 获取图片文件夹中的所有图片文件，如果图片名中包含“封面”则跳过
    image_extensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp']
    image_files = [f for f in os.listdir(image_folder)
                   if os.path.isfile(os.path.join(image_folder, f))
                   and os.path.splitext(f)[1].lower() in image_extensions
                   and "封面" not in f]

    if not image_files:
        print(f"提示：图片文件夹 '{image_folder}' 中没有找到图片文件。")
        return
    
    # 准备追加到MD文件的内容
    append_content = "\n\n<!-- 自动生成的图片画廊区域 -->\n"
    
    # 遍历图片文件，获取尺寸并生成SVG标签
    for image_file in image_files:
        image_path = os.path.join(image_folder, image_file)
        try:
            with Image.open(image_path) as img:
                width, height = img.size
                # 生成相对路径（相对于文件夹）
                relative_img_path = os.path.join('./', image_file)
                # 生成SVG标签
                svg_tag = (f'<svg\n'
                          f'class="custom-gallery-svg"\n'
                          f'style=\'background-image: url("{relative_img_path}");\'\n'
                          f'viewBox="0 0 {width} {height}"></svg>\n\n')
                append_content += svg_tag
        except Exception as e:
            print(f"警告：无法处理图片 '{image_file}': {str(e)}")
    
    # 将生成的内容追加到MD文件
    try:
        with open(md_file_path, 'a', encoding='utf-8') as f:
            f.write(append_content)
        print(f"成功将 {len(image_files)} 个图片的SVG标签追加到 {md_file_path}")
    except Exception as e:
        print(f"错误：无法写入文件 '{md_file_path}': {str(e)}")

def main():
    """主函数，处理命令行参数"""
    parser = argparse.ArgumentParser(description='为Markdown文件添加图片SVG标签')
    parser.add_argument('md_file', nargs='?', help='Markdown文件路径')
    args = parser.parse_args()

    if args.md_file:
        process_markdown_file(args.md_file)
    else:
        # 自动查找 source/_posts/ 下的 md 文件
        script_dir = os.path.dirname(os.path.abspath(__file__))
        posts_dir = os.path.join(script_dir, 'source', '_posts')
        if not os.path.exists(posts_dir):
            print(f"错误：未找到目录 {posts_dir}")
            return
        md_files = [f for f in os.listdir(posts_dir) if f.endswith('.md')]
        if not md_files:
            print(f"提示：目录 {posts_dir} 下没有 Markdown 文件。")
            return
        print("请选择一个 Markdown 文件：")
        md_files.sort(key=lambda f: os.path.getmtime(os.path.join(posts_dir, f)))
        for idx, fname in enumerate(md_files, 1):
            print(f"{idx}. {fname}")
        try:
            choice = input(f"请选择要处理的文件编号，回车选择{len(md_files)}: ")
            if not choice:
                choice = len(md_files)
            if 1 <= choice <= len(md_files):
                md_file_path = os.path.join(posts_dir, md_files[choice - 1])
                process_markdown_file(md_file_path)
            else:
                print("无效的选择。")
        except Exception as e:
            print(f"输入错误: {e}")

if __name__ == "__main__":
    main()    