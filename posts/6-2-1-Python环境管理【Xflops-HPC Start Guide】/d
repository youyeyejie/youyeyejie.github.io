---
date: 2025-07-07 16:09:30
archive: true
category_bar: true
title: 6-2-3 PyTorch基础【Xflops-HPC Start Guide】
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

# PyTorch基础

在前面的内容中，我们介绍了Python的基本语法和数据结构。本节将介绍PyTorch的基础知识，帮助你了解如何使用PyTorch进行张量运算和深度学习模型的构建。

## PyTorch简介

[PyTorch](https://pytorch.org/) 是一个开源的 Python 机器学习库，基于 Torch，用于自然语言处理等应用程序。它最初由 Facebook 人工智能研究院（FAIR）在 2017 年 1 月发布，现在已经成为人工智能领域最受欢迎的框架之一。PyTorch 提供了两个主要功能：一是具有强大的 GPU 加速的张量计算；二是包含自动微分系统的深度神经网络构建。

随着深度学习的快速发展，PyTorch 以其独特的优势在学术界和工业界得到了广泛的应用。这里简要列举几个 PyTorch 的主要优势：

1.  **动态计算图**：采用动态计算图机制，运行时可动态构建。相比静态计算图而言更加灵活，便于调试和修改模型结构，适合快速原型设计和研究。
2.  **易于使用**：PyTorch 拥有简洁直观的 API 设计，代码风格接近于标准 Python，便于上手和开发，适合初学者和研究人员快速实现模型。
3.  **强大的社区支持**：拥有庞大活跃的社区，可获取丰富学习资源、示例代码和解决方案。同时得到众多研究机构和企业支持，持续发展更新。
4.  **跨平台支持**：支持 Windows、Linux 和 macOS 等多种操作系统，可在 CPU 和 GPU 上运行，满足不同环境下的开发和部署需求。

## PyTorch基础概念

### 张量（Tensor）

张量是 PyTorch 中的基本数据结构，类似 NumPy 的数组，可表示标量、向量、矩阵及更高维数据，能在 CPU 或 GPU 上运行，通过 CUDA 技术加速计算。

**创建张量**有多种方式，其中使用较多的有直接创建和使用函数创建两种方式：

```python
import torch
# 创建标量张量
scalar = torch.tensor(5)
# 创建向量张量
vector = torch.tensor([1, 2, 3, 4])
# 创建矩阵张量
matrix = torch.tensor([[1, 2], [3, 4]])
# 创建3x3全零张量
zeros = torch.zeros((3, 3))
# 创建2x2全一张量
ones = torch.ones((2, 2))
# 创建3x3单位矩阵张量
eye_matrix = torch.eye(3)
# 创建2x3随机张量（正态分布）
random_tensor = torch.randn((2, 3))
```

张量支持加减乘除、矩阵运算、索引和切片等数学运算，与 NumPy 数组操作类似。
```python
# 张量加法
result = matrix + random_tensor
# 矩阵乘法
product = matrix @ random_tensor.t()  # @表示矩阵乘法，t()用于转置张量
# 索引和切片
print(matrix[0, 1])  # 输出第一行第二列元素
print(random_tensor[:, 1])  # 输出所有行第二列元素
```

### 自动微分（Autograd）
自动微分是 PyTorch 实现神经网络训练的关键，可自动计算张量梯度，通过反向传播更新模型参数，无需手动推导导数公式。可以通过将张量的 `requires_grad` 属性设为 `True` 启用自动微分功能。
```python
x = torch.tensor([1.0, 2.0, 3.0], requires_grad=True)
y = x * 2
z = y.mean()
z.backward()  # 反向传播计算梯度
print(x.grad)  # 输出x的梯度
```

训练神经网络时，每次迭代前需用 `zero_grad()` 方法清零梯度，避免累加。

```python
optimizer.zero_grad()  # 假设optimizer是优化器对象
```

### PyTorch算子
PyTorch算子是指在PyTorch中定义的操作或函数，用于对张量进行计算和处理。算子可以是内置的，也可以是用户自定义的。内置算子包括常见的数学运算、激活函数、损失函数等。

用户可以根据需要自定义算子，以实现特定的功能或优化性能。自定义算子通常需要使用C++或CUDA编写，并通过PyTorch提供的接口进行注册和调用。

### 神经网络模块（nn.Module）

`nn.Module` 是构建神经网络的基类，继承该类可定义自己的神经网络模型，提供常用神经网络层，方便构建复杂结构。

在定义神经网络模型时：需实现` __init__` 方法（初始化层和参数）和 `forward` 方法（定义前向传播过程）。

```python
import torch.nn as nn
class Net(nn.Module):
    def __init__(self):
        super(Net, self).__init__()
        self.fc1 = nn.Linear(784, 256)  # 输入层到隐藏层的线性层
        self.relu = nn.ReLU()  # 激活函数层
        self.fc2 = nn.Linear(256, 10)  # 隐藏层到输出层的线性层

    def forward(self, x):
        x = self.fc1(x)
        x = self.relu(x)
        x = self.fc2(x)
        return x
```

可以通过`parameters()`方法获取模型参数（权重和偏置），自动被自动微分系统跟踪，用于计算梯度和更新参数。

```python
model = Net()
for param in model.parameters():
    print(param)
```

## 使用PyTorch进行模型训练

### 数据准备

1. **数据集加载**：使用`torch.utils.data.Dataset`和`torch.utils.data.DataLoader`类处理数据集。
    ```python
    import torchvision
    import torchvision.transforms as transforms
    # 定义数据转换操作（如归一化）
    transform = transforms.Compose([transforms.ToTensor(), transforms.Normalize((0.5,), (0.5,))])
    # 加载训练集和测试集
    trainset = torchvision.datasets.MNIST(root='./data', train=True, download=True, transform=transform)
    testset = torchvision.datasets.MNIST(root='./data', train=False, download=True, transform=transform)
    # 创建数据加载器
    trainloader = torch.utils.data.DataLoader(trainset, batch_size=64, shuffle=True)
    testloader = torch.utils.data.DataLoader(testset, batch_size=64, shuffle=False)
    ```
2. **数据预处理**：输入神经网络前，进行归一化、标准化、数据增强等预处理，`torchvision.transforms`模块提供丰富预处理函数。

### 模型定义

根据任务需求，使用`nn.Module`定义合适的神经网络模型，如全连接神经网络、卷积神经网络（CNN）、循环神经网络（RNN）等。

### 损失函数和优化器选择

1. **损失函数**：衡量模型预测结果与真实标签的差距，PyTorch 提供均方误差损失（MSELoss）、交叉熵损失（CrossEntropyLoss）等，依任务类型选择。
    ```python
    criterion = nn.CrossEntropyLoss()  # 分类任务常用
    ```
2. **优化器**：更新模型参数以最小化损失函数，支持随机梯度下降（SGD）、Adam、RMSprop 等优化算法。
    ```python
    optimizer = torch.optim.Adam(model.parameters(), lr=0.001)
    ```

### 模型训练
1. **训练循环**：迭代处理小批量数据，包含前向传播、计算损失、反向传播和更新参数。
    ```python
    model.train()  # 设置模型为训练模式
    for epoch in range(num_epochs):
        running_loss = 0.0
        for inputs, labels in trainloader:
            # 梯度清零
            optimizer.zero_grad()
            # 前向传播
            outputs = model(inputs.view(-1, 784))  # 将图像数据展平为向量
            # 计算损失
            loss = criterion(outputs, labels)
            # 反向传播
            loss.backward()
            # 更新参数
            optimizer.step()
            running_loss += loss.item()
        print(f'Epoch {epoch + 1}, Loss: {running_loss / len(trainloader)}')
    ```
2. **训练技巧**：训练中可使用学习率调整、正则化（L1/L2 正则化、Dropout）、数据增强等技巧提升模型性能。


### 模型评估

训练后用测试集评估模型泛化能力，计算准确率、精确率、召回率、F1 值等指标。

```python
model.eval()  # 设置模型为评估模式
correct = 0
total = 0
with torch.no_grad():  # 不计算梯度，提高评估速度
    for inputs, labels in testloader:
        outputs = model(inputs.view(-1, 784))
        _, predicted = torch.max(outputs.data, 1)
        total += labels.size(0)
        correct += (predicted == labels).sum().item()
print(f'Accuracy on test set: {100 * correct / total}%')
```

### 模型保存和加载

在训练完成后，通常需要保存模型以便后续使用或部署。PyTorch 提供了简单的模型保存和加载方法。

1. **保存模型**：使用`torch.save()`函数保存模型参数或整个模型。
    ```python
    # 保存模型参数
    torch.save(model.state_dict(),'model.pth')
    # 保存整个模型
    torch.save(model,'model.pkl')
    ```

2. **加载模型**：用`torch.load()`函数加载，加载参数需先创建模型实例再用`load_state_dict()`方法。
    ```python
    # 加载模型参数
    model = Net()
    model.load_state_dict(torch.load('model.pth'))
    # 加载整个模型
    model = torch.load('model.pkl')
    ```

## 小结

通过本节内容，我们希望你对PyTorch的基本概念有一定了解。实际上，我们在这里介绍的只是PyTorch的冰山一角，并不要求你完全掌握所有内容。你只需要对PyTorch张量运算的基本规则和PyTorch的基础工作流程有一定了解即可，如果感兴趣，可以自行查找资料学习编写PyTorch的算子的方法。

这里我们给出一些有用的链接，供你进一步学习和参考：

- [PyTorch官方文档](https://pytorch.org/docs/stable/index.html)
- [PyTorch张量的基本运算](https://pytorch.ac.cn/tutorials/beginner/basics/tensorqs_tutorial.html)
- [PyTorch自动微分](https://pytorch.ac.cn/tutorials/beginner/basics/autogradqs_tutorial.html)
- [PyTorch自定义算子手册](https://pytorch.ac.cn/tutorials/advanced/custom_ops_landing_page.html)

{% fold info @练习 %}
1. 使用PyTorch的张量类型，编写程序使用定积分的定义计算$\int_{0}^{y} \frac{1}{x^2+1} \, dx$的值
    - 输入：一维torch.Tensor张量，每个数字代表一个y的取值。
    - 输出：一维torch.Tensor张量，每个位置对应于输入的y计算得到的定积分的值。
2. （选做）自己编写一个PyTorch算子（基于C++或CUDA），输入一个张量x，返回张量$\frac{1}{x^2+1}$。并在python中调用这个算子运用定积分的定义计算$\int_{0}^{y} \frac{1}{x^2+1} \, dx$的值（输入输出要求与 1 中相同）
3. （选做）使用PyTorch构建一个简单的神经网络模型，对手写数字（MNIST 数据集）进行分类，并评估模型性能。
{% endfold %}
