---
date: 2025-07-06 18:01:53
archive: true
category_bar: true
title: 6-2-1 Python环境管理【Xflops-HPC Start Guide】
tags:
    - Xflops
    - HPC
categories:
    - Xflops-HPC Start Guide
excerpt: Xflops超算队HPC入门指南——编程语言学习：Python
index_img: /img/cover/xflops.webp
---

{% note info %}
新学期即将来临，Xflops超算队招新以及HelloHPC超算校内赛正在火热筹备中。作为Xflops超算队的一员，我与其他成员将共同负责[HPC入门指南](https://xflops.sjtu.edu.cn/hpc-start-guide)的修订与编写。Xflops超算队的HPC入门指南系列文章旨在帮助新成员快速入门和了解HPC知识，为校内赛的参赛者提供必要的知识储备和技能指导。
{% endnote %}

<a href="https://xflops.sjtu.edu.cn/hpc-start-guide" name="/img/cover/xflops.webp" target="_blank" class="LinkCard">HPC入门指南</a>

# Python简介

Python是一种广泛使用的高级编程语言，因其简洁易读的语法和强大的库支持而受到开发者的喜爱，近年来随着AI和数据科学的兴起，Python的使用越来越普及。Python支持多种编程范式，包括面向对象、函数式和命令式编程，并且拥有丰富的标准库和第三方库，使得开发者可以快速构建各种应用程序。因其适用于包括数据分析、机器学习、Web开发、自动化脚本等在内的多种应用场景，我们需要掌握基础的Python知识。

在本节内容中，我们将会向您介绍Python环境的搭建与管理，以便您能够在自己的计算机上进行Python编程和开发。而在后续的内容中，我们还将介绍Python的基本语法以及Pytorch库的使用。

# Python环境搭建

{% note success %}
我们提供的标准开发环境中已经包含了Python环境和Conda，因此您可以运行下面的命令激活conda环境进行Python编程和开发。
```bash
source ~/scripts/conda.sh
```
如果您希望在自己的计算机上搭建Python环境，可以参考以下内容。
{% endnote %}

在开始Python编程之前，您需要在您的计算机上安装Python环境。一般来说，我们可以直接安装Python的官方版本，也可以使用Miniconda等发行版来管理Python环境和依赖库。

## 安装Python的官方版本

{% fold info @MacOS系统与Linux系统已预装Python %}
事实上MacOS系统与Linux系统默认安装了`python`，可以在命令行中使用`python3`命令运行。但是预装的Python是一些系统工具的依赖，通常不建议使用这个Python作为您的开发环境。我们推荐您使用`conda`来创建Python开发环境。
{% endfold %}

{% fold info @Windows上快速安装Python %}
新版本的Windows上有`winget`可以用于快速安装常用工具链。运行`winget install Python`即可自动完成Python的安装。但是如果有多Python环境管理的需求，我们仍然建议您使用`conda`来创建Python的开发环境。
{% endfold %}

以下是安装Python官方版本的步骤：

1. **下载Python**：访问[Python官网](https://www.python.org/downloads/)下载适合您操作系统的Python版本。建议下载最新的稳定版本。
2. **安装Python**：运行下载的安装程序，按照提示完成安装。在安装过程中，请确保勾选“Add Python to PATH”选项，这样可以在命令行中直接使用Python命令。
3. **验证安装**：安装完成后，在命令行中输入以下命令来验证Python是否安装成功并添加到环境变量中：
    ```bash
    python --version
    ```
    如果安装成功，您将看到Python的版本信息。
4. **安装pip**：Python 3.4及以上版本默认包含 `pip` ，如果您的版本不包含，可以手动安装。验证 `pip` 是否安装成功：
    ```bash
    pip --version
    ```

### 使用Miniconda安装Python
Anaconda是一个流行的Python发行版，包含了Python解释器和大量的科学计算和数据分析库。而Miniconda是Anaconda的轻量级版本，适合需要更小安装包的用户。这里以Miniconda为例介绍安装步骤：

1. **下载Miniconda**：访问Anaconda官网的[Miniconda下载界面](https://www.anaconda.com/download/success)下载适合您操作系统的Miniconda安装包。
2. **安装Miniconda**：运行下载的安装程序，按照提示完成安装。在安装过程中，您可以选择将Miniconda添加到系统的环境变量中，这样可以在命令行中直接使用 `conda` 命令。
3. **验证安装**：安装完成后，在命令行中输入以下命令来验证Miniconda是否安装成功：
   ```bash
   conda --version
   ```
   如果安装成功，您将看到conda的版本信息。

## 选择合适的IDE

Python只是一种编程语言，您还需要一个合适的集成开发环境（IDE）来编写和运行Python代码。我们推荐使用以下两种IDE：

- VSCode + Python插件
- Pycharm

如果在搭建Python环境的过程中遇到问题，可以参考以下教程：

- [VSCode安装教程](https://www.runoob.com/vscode/vscode-install.html)
- [Pycharm安装教程](https://www.runoob.com/pycharm/pycharm-install.html)
- [Python安装教程](https://www.runoob.com/python3/python3-install.html)

{% fold info @练习 %}
1. 在您的计算机上安装Python环境，并验证安装是否成功。
2. 使用IDE通过SSH连接到标准开发环境，并尝试编写和运行一个简单的Python程序，例如打印“Hello, World!”，并在终端中运行该程序。
{% endfold %}

# Python环境管理
Python环境管理是指在不同的项目中使用不同的Python版本和依赖库，以避免版本冲突和依赖问题。常用的Python环境管理工具有 `venv`、`virtualenv` 和 `conda`。

## 使用 venv 进行环境管理
venv 是 Python 自带的虚拟环境管理工具，可以创建独立的Python环境，通常配合 pip 使用来管理项目的依赖库。以下是使用 venv 进行环境管理的常用指令：

- **创建虚拟环境**：在命令行中输入以下命令来创建一个新的虚拟环境：
    ```bash
    python -m venv myenv
    ```
    这将创建一个名为 `myenv` 的虚拟环境。
- **激活虚拟环境**：
    - Windows用户：
        ```bash
        myenv/Scripts/activate
        ```
    - macOS和Linux用户：
        ```bash
        source myenv/bin/activate
        ```
- **安装依赖库**：在虚拟环境中，您可以使用 pip 安装所需的依赖库，例如：
    ```bash
    pip install numpy pandas
    ```
- **退出虚拟环境**：完成开发后，您可以通过以下命令退出虚拟环境：
    ```bash
    deactivate
    ```
- **删除虚拟环境**：如果您不再需要某个虚拟环境，可以直接删除该目录。

## 使用 virtualenv 进行环境管理
virtualenv 是一个第三方库，可以创建独立的Python环境，使用前需要用 pip 安装它。virtualenv 的使用与 venv 类似，这里不多赘述，感兴趣的读者可以参考[virtualenv官方文档](https://virtualenv.pypa.io/en/latest/)。

## 使用 conda 进行环境管理
conda 是 Anaconda 和 Miniconda 自带的包管理和环境管理工具，适用于数据科学和机器学习领域。以下是使用 conda 进行环境管理的常用指令：

- **创建虚拟环境**：在命令行中输入以下命令来创建一个新的虚拟环境：
    ```bash
    conda create --name myenv python=3.8
    ```
    这将创建一个名为 `myenv` 的虚拟环境，并安装Python 3.8版本。
- **激活虚拟环境**：在命令行中输入以下命令来激活虚拟环境：
    ```bash
    conda activate myenv
    ```
- **安装依赖库**：在虚拟环境中，您可以使用 conda 安装所需的依赖库，例如：
    ```bash
    conda install numpy pandas
    ```
- **退出虚拟环境**：完成开发后，您可以通过以下命令退出虚拟环境：
    ```bash
    conda deactivate
    ```
- **列出所有虚拟环境**：在命令行中输入以下命令来列出所有已创建的虚拟环境：
    ```bash
    conda env list
    ```
- **删除虚拟环境**：如果您不再需要某个虚拟环境，可以使用以下命令删除它：
    ```bash
    conda remove --name myenv --all
    ```
- **导出环境**：在命令行中输入以下命令来生成当前环境中已安装的所有包及其版本信息的文件，以便于在其他环境中复现相同的依赖：
    ```bash
    conda env export > environment.yml
    ```
- **根据依赖文件创建环境**：在命令行中输入以下命令来根据 `environment.yml` 文件创建一个新的conda环境：
    ```bash
    conda env create -f environment.yml
    ```

{% fold info @离线conda环境迁移 %}
使用上述导出环境并根据依赖文件创建环境的的方式需要新conda环境安装的机器上能够连接互联网下载依赖文件。如果您需要将现有的conda环境迁移到无互联网连接的机器上，可以使用以下命令导出conda环境到单个文件中：
```bash
conda pack -n your_env_name -o env_packages.tar.gz
```
将此文件上传到需要安装此环境的机器上。并运行以下命令来安装此环境：
```bash
tar -xzf env_packages.tar.gz -C new_env_path
```
我们推荐`new_env_path`设置为该机器原有的conda环境的虚拟环境管理路径。例如对于标准开发环境来说应该是`/home/xflops/apps/miniconda3/envs/<your_env_name>`，这样之后你可以方便的使用该机器的`conda`管理此环境。你也可以设置为一个自选的`new_env_path`。这样你将需要运行下述命令来激活此环境：
```
source new_env_path/bin/activate  # Linux/macOS
.\new_env_path\Scripts\activate   # Windows
```
**但需要注意**：该迁移方式直接将依赖项的代码与二进制进行迁移，因此需保证迁移前后的系统一致处理器架构一致，例如将linux上的环境按上述方法迁移到windows将无法使用。
{% endfold %}

{% fold info @练习 %}
使用 `venv` 或 `conda` 工具，在实践中亲自体会一遍创建、激活、安装依赖、退出和删除虚拟环境的过程。
{% endfold %}

# Python包管理
Python包管理是指管理Python项目中的依赖库和包。常用的Python包管理工具有 `pip` 和 `conda`。实际上，Python的环境管理与包管理是紧密相关的，这里将简要介绍这两种工具的使用。

## 使用 pip 管理包
pip 是 Python 自带的包管理工具，可以安装、升级和卸载Python包。以下是一些常用的 pip 命令：

- **安装包**：在命令行中输入以下命令来安装一个Python包：
    ```bash
    pip install package_name
    ```
    - **安装特定版本的包**：如果您需要安装特定版本的包，可以在包名后指定版本号或最低版本号，例如：
        ```bash
        pip install package_name==1.0.0
        pip install package_name>=1.0.0
        ```
- **升级包**：在命令行中输入以下命令来升级一个已安装的Python包：
    ```bash
    pip install --upgrade package_name
    ```
    - 由于 pip 本身也是一个Python包，因此您可以使用同样的命令来升级 pip 自身，这在某些情况下是必要的。
- **卸载包**：在命令行中输入以下命令来卸载一个已安装的Python包：
    ```bash
    pip uninstall package_name
    ```
- **列出已安装的包**：在命令行中输入以下命令来列出当前环境中已安装的所有Python包：
    ```bash
    pip list
    ```
- **查看包信息**：在命令行中输入以下命令来查看某个已安装包的详细信息：
    ```bash
    pip show package_name
    ```
- **搜索包**：在命令行中输入以下命令来搜索Python包：
    ```bash
    pip search package_name
    ```
- **生成依赖文件**：在命令行中输入以下命令来生成当前环境中已安装的所有包及其版本信息的文件，以便于在其他环境中复现相同的依赖：
    ```bash
    pip freeze > requirements.txt
    ```
- **安装依赖文件中的包**：在命令行中输入以下命令来安装 `requirements.txt` 文件中列出的所有包：
    ```bash
    pip install -r requirements.txt
    ```
- **配置镜像源**：如果在使用 pip 时遇到网络问题，可以尝试更换镜像源。常用的镜像源包括清华大学、阿里云等，具体操作可以参考[清华pip镜像源配置](https://mirrors.tuna.tsinghua.edu.cn/help/pypi/)。
    在命令行输入以下命令来配置清华大学的镜像源：
    ```bash
    pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple
    ```
    或者临时使用清华镜像源安装包：
    ```bash
    pip install -i https://pypi.tuna.tsinghua.edu.cn/simple package_name
    ```

需要注意的是，上述操作均针对的是当前所处于的Python环境。如果您在虚拟环境中操作，所有的包管理操作都将只影响该虚拟环境中的Python包；相反，如果您在全局环境中操作，则会影响全局的Python包。

## 使用 conda 管理包
conda 是 Anaconda 和 Miniconda 自带的包管理和环境管理工具，可以安装、升级和卸载Python包以及其他语言的包。以下是一些常用的 conda 命令：

- **安装包**：在命令行中输入以下命令来安装一个或多个Python包：
    ```bash
    conda install package_name1 package_name2
    ```
    - **安装特定版本的包**：如果您需要安装特定版本的包，可以在包名后指定版本号，例如：
        ```bash
        conda install package_name=1.0.0
        ```
- **升级包**：在命令行中输入以下命令来升级一个已安装的Python包：
    ```bash
    conda update package_name
    ```
    - **升级所有包**：如果您想要升级当前环境中的所有包，可以使用以下命令：
        ```bash
        conda update --all
        ```
- **卸载包**：在命令行中输入以下命令来卸载一个已安装的Python包：
    ```bash
    conda remove package_name
    ```
- **搜索包**：在命令行中输入以下命令来搜索Python包：
    ```bash
    conda search package_name
    ```
- **列出已安装的包**：在命令行中输入以下命令来列出当前环境中已安装的所有包：
    ```bash
    conda list
    ```
- **配置镜像源**：如果在使用 conda 时遇到网络问题，可以尝试更换镜像源。常用的镜像源包括清华大学、阿里云等，具体操作可以参考[清华conda镜像源配置](https://mirrors.tuna.tsinghua.edu.cn/help/anaconda/)。
    在命令行输入以下命令来配置清华大学的镜像源：
    ```bash
    conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main/
    conda config --set show_channel_urls yes
    ```
    配置后可以通过下面的指令验证配置是否成功：
    ```bash
    conda config --show channels
    ```

如果在使用 conda 时遇到问题，可以参考[Conda官方文档](https://docs.conda.io/projects/conda/en/latest/)。   

{% fold info @练习 %}
1. 使用 `pip` 或 `conda` 工具，在实践中亲自体会一遍安装、升级、卸载包的过程。
2. 配置镜像源，对比使用镜像源和不使用镜像源安装同一个包的安装速度差异。
3. 在你的计算机上，一共存在几个版本的Python？如果存在多个，请思考它们之间的关系。
4. 对比你的计算机上的Python全局环境和虚拟环境中同一个包（如 `numpy`）的版本，他们是否存在差异？如果存在差异，请思考原因。
5. 小明创建并激活了一个名为 `myenv` 的虚拟环境，并在其中安装了 `numpy` 和 `pandas`。然而，小明代码中的 `import numpy` 却在他使用的IDE VSCode中报错，提示找不到该模块，请思考可能的原因以及解决方法。并思考：如果小明在这个虚拟环境中运行该代码，是否会报错（假设不存在其他错误）？
{% endfold %}