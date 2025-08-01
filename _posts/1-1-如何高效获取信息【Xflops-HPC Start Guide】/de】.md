---
date: 2025-07-07 16:01:19
archive: true
category_bar: true
title: 6-2-2 Python语法基础【Xflops-HPC Start Guide】
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

# Python语法基础

在这节內容中，我们将介绍Python的基本语法和数据结构。

## Python基础语法

Python是一种易于学习和使用的编程语言，其语法简洁明了。以下是一些Python的基本语法概念：

- **注释**：Python使用 `#` 符号来表示单行注释，使用三重引号 `"""` 或 `'''` 来表示多行注释。
    ```python
    # 这是一个单行注释
    """
    这是一个多行注释
    """
    ```
- **变量与赋值**：Python中的变量不需要声明类型，可以直接赋值。
- **数据类型**：Python支持多种数据类型，包括整数、浮点数、字符串、列表、元组、字典等。
    ```python
    x = 10  # 整数
    y = 3.14  # 浮点数
    name = "Alice"  # 字符串
    ```
- **运算符**：Python支持常见的算术运算符、比较运算符和逻辑运算符。
    ```python
    a = 5
    b = 2
    # 算术运算
    sum = a + b  # 加法
    diff = a - b  # 减法
    product = a * b  # 乘法
    quotient = a / b  # 除法
    remainder = a % b  # 取余
    power = a ** b  # 幂运算
    # 比较运算
    larger = (a > b)  # 大于
    smaller = (a < b)  # 小于
    is_equal = (a == b)  # 等于
    is_not_equal = (a != b)  # 不等于
    # 逻辑运算
    and_result = (a > 0 and b > 0)  # 与运算
    or_result = (a > 0 or b < 0)  # 或运算
    not_result = not (a > 0)  # 非运算
    ```
- **输入输出**：使用 `print()` 函数输出内容，使用 `input()` 函数获取用户输入。
    ```python
    name = input("Enter your name: ")
    print("Hello, " + name)
    ```
- **控制结构**：Python使用缩进来表示代码块，支持条件语句、循环语句等。
    ```python
    if x > 0:
        print("x is positive")
    elif x < 0:
        print("x is negative")
    else:
        print("x is zero")

    for i in range(5):
        print(i)  # 输出0到4

    while x > 0:
        print(x)
        x -= 1  # 每次循环减1，直到x为0
    ```
- **函数**：Python使用 `def` 关键字定义函数，可以有参数和返回值。
    ```python
    def add(a, b):
        return a + b

    result = add(3, 5)  # 调用函数
    print(result)  # 输出8
    ```
- **异常处理**：Python使用 `try` 和 `except` 语句来处理异常。
    ```python
    try:
        result = 10 / 0  # 可能引发除以零异常
    except ZeroDivisionError:
        print("Cannot divide by zero")
    ```

读者可以通过以下链接了解Python的基本语法：

- [Python基础语法](https://www.runoob.com/python3/python3-basic-syntax.html)
- [Python基本数据类型](https://www.runoob.com/python3/python3-data-type.html)
- [Python条件语句](https://www.runoob.com/python3/python3-conditional-statements.html)：if、elif、else
- [Python循环语句](https://www.runoob.com/python3/python3-loop.html)：for、while

## Python基础数据结构

Python内置了多种数据结构，常用的有以下几种：

- **数字（Number）**：支持证书整数（int）、浮点数（float）、布尔值（bool）和复数（complex）。
    ```python
    integer = 42  # 整数
    floating = 3.14  # 浮点数
    boolean = True  # 布尔值
    complex_number = 1 + 2j  # 复数
    ```
- **字符串（String）**：用于存储文本数据，可以使用单引号或双引号定义。
    ```python
    greeting = "Hello, World!"
    ```
- **列表（List）**：有序可变的元素集合，可以包含不同类型的元素。
    ```python
    fruits = ["apple", "banana", "cherry"]
    ```
- **元组（Tuple）**：有序不可变的元素集合，通常用于存储多个值。
    ```python
    point = (10, 20)
    ```
- **字典（Dictionary）**：无序可变的键值对集合，适合用于存储关联数据。
    ```python
    student = {"name": "Alice", "age": 20}
    ```
- **集合（Set）**：无序不重复的元素集合，常用于去重和集合运算。
    ```python
    unique_numbers = {1, 2, 3, 4, 5}
    ```

读者可以通过以下链接了解Python的基础数据结构：

- [Python数字](https://www.runoob.com/python3/python3-number.html)
- [Python字符串](https://www.runoob.com/python3/python3-string.html)
- [Python列表](https://www.runoob.com/python3/python3-list.html)
- [Python元组](https://www.runoob.com/python3/python3-tuple.html)
- [Python字典](https://www.runoob.com/python3/python3-dictionary.html)
- [Python集合](https://www.runoob.com/python3/python3-set.html)

## 可变与不可变类型

在Python中，数据类型可以分为不可变类型和可变类型，以上面介绍的六种数据结构为例：

- 不可变类型：数字（Number）、字符串（String）、元组（Tuple）
- 可变类型：列表（List）、字典（Dictionary）、集合（Set）

所谓“不可变类型”的数据对象，是指一旦创建后，其内容不能被修改；而用户视角下的修改操作实际上是创建了一个新的对象。相对的，“可变类型”的数据对象在创建之后，其值能够被修改，而且对象的身份保持不变。更进一步解释，当对不可变类型的对象进行修改时，其对应的内存地址会发生变化，而对可变类型的对象进行修改时，其内存地址保持不变。

这里给出一个简单的例子来说明可变与不可变类型的区别：

```python
# 示例1：字符串（不可变）
s = "hello"
print(id(s))  # 输出：140701435548848
s = s + " world"
print(id(s))  # 输出：140701435549008（ID改变，说明创建了新对象）

# 示例2：列表（可变）
lst = [1, 2, 3]
print(id(lst))  # 输出：140701435550080
lst.append(4)
print(id(lst))  # 输出：140701435550080（ID未变，还是原来的对象）
```

那么，这在实际应用中有什么影响呢？举两个例子：

- 作为函数参数时：
    - 不可变对象作为参数传递时，函数内部对其修改不会影响到外部的原始对象。
    - 可变对象作为参数传递时，函数内部对其修改会直接影响到外部的原始对象。
- 在容器中的情况：
    - 不可变对象可以作为dict的键或者set的元素，因为它们的哈希值不会改变。
    - 可变对象不能作为dict的键或者set的元素，因为它们的值可能会变化，导致哈希冲突。

因此，理解可变和不可变对象的区别，对于编写可靠的代码、避免意外副作用以及进行性能优化都非常关键。

## 小结

通过本节内容，我们希望你对Python的基本语法和数据结构有一定了解。Python是一种易于学习和使用的编程语言，具有丰富的内置数据结构和强大的功能。掌握这些基础知识后，你将能够更好地使用Python进行编程。

至于更进阶的Python知识，可以自行查阅相关资料或参考书籍，例如：

- [Python官方文档](https://docs.python.org/3/)
- [CS50课程](https://cs50.harvard.edu/python/)
- [CS61A课程](https://cs61a.org/)

{% fold info @练习 %}
1. 编写一个Python程序，创建一个包含至少5个元素的列表，使用循环接受用户输入并将输入的值添加到列表中，然后判断每项的类型，并输出每项的类型和内容。
2.  尝试运行下述的Python代码，并解释`data1.txt`中的内容。
    ```python
    import time
    def save_data(filename ,datas = []):
        # add timestamp as header
        datas.insert(0, time.time())
        with open(filename ,'w') as f:
            f.write("\n".join(map(str,datas)))

    save_data('data0.txt')
    save_data('data1.txt')
    ```
3. （选做）不使用任何第三方库，尝试利用定积分的定义编写一个Python程序计算$\int_{0}^{1} \frac{1}{x^2+1} \, dx$的值。
{% endfold %}