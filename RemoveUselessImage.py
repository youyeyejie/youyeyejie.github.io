import os
import glob

def list_subfolders(path):
    return [f for f in os.listdir(path) if os.path.isdir(os.path.join(path, f))]

def select_folders(folders):
    print("子文件夹列表：")
    for idx, folder in enumerate(folders):
        print(f"{idx+1}. {folder}")
    selected = input("请输入要处理的文件夹编号（可用空格分隔多选）：")
    indices = [int(i.strip())-1 for i in selected.split(" ") if i.strip().isdigit()]
    return [folders[i] for i in indices if 0 <= i < len(folders)]

def get_images(folder_path):
    exts = ('*.png', '*.jpg', '*.jpeg', '*.gif', '*.bmp', '*.webp')
    images = []
    for ext in exts:
        images.extend(glob.glob(os.path.join(folder_path, ext)))
    return images

def confirm_and_delete(image_path):
    confirm = input(f"图片 {os.path.basename(image_path)} 未被引用，是否删除？(y/N): ")
    if confirm.lower() == 'y':
        os.remove(image_path)
        print(f"已删除 {image_path}")

def main():
    base_path = os.getcwd()
    subfolders = list_subfolders(base_path)
    if not subfolders:
        print("当前文件夹下没有子文件夹。")
        return
    selected_folders = select_folders(subfolders)
    for folder in selected_folders:
        folder_path = os.path.join(base_path, folder)
        md_path = os.path.join(base_path, f"{folder}.md")
        if not os.path.isfile(md_path):
            print(f"未找到 {folder}.md，跳过。")
            continue
        with open(md_path, 'r', encoding='utf-8') as f:
            md_content = f.read()
        images = get_images(folder_path)
        for img_path in images:
            img_name = os.path.basename(img_path)
            if img_name not in md_content:
                confirm_and_delete(img_path)
                # os.remove(img_path)
    print("处理完成。")

if __name__ == "__main__":
    main()