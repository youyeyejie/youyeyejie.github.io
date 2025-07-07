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
index_img: /img/cover/xflops.jpg
---

{% note info %}
新学期即将来临，Xflops超算队招新以及超算校内赛正在火热筹备中。作为Xflops超算队的一员，我与其他成员将共同负责[HPC入门指南](https://xflops.sjtu.edu.cn/hpc-start-guide)的修订与编写。Xflops超算队的HPC入门指南系列文章旨在帮助新成员快速入门和了解HPC知识，为校内赛的参赛者提供必要的知识储备和技能指导。
{% endnote %}

<a href="https://xflops.sjtu.edu.cn/hpc-start-guide" name="/img/cover/xflops.jpg" target="_blank" class="LinkCard">HPC入门指南</a>

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

- [Python字符串](https://www.runoob.com/python3/python3-string.html)
- [Python列表](https://www.runoob.com/python3/python3-list.html)
- [Python元组](https://www.runoob.com/python3/python3-tuple.html)
- [Python字典](https://www.runoob.com/python3/python3-dictionary.html)
- [Python集合](https://www.runoob.com/python3/python3-set.html)

## 小结

通过本节内容，我们希望你对Python的基本语法和数据结构有一定了解。Python是一种易于学习和使用的编程语言，具有丰富的内置数据结构和强大的功能。掌握这些基础知识后，你将能够更好地使用Python进行编程。

至于更进阶的Python知识，可以自行查阅相关资料或参考书籍，例如：

- [Python官方文档](https://docs.python.org/3/)
- [CS50课程](https://cs50.harvard.edu/python/)
- [CS61A课程](https://cs61a.org/)

{% fold info @练习 %}
1. 编写一个Python程序，使用条件语句判断一个数字是正数、负数还是零，并输出相应的结果。
2. 编写一个Python程序，创建一个包含至少5个元素的列表，使用循环接受用户输入并将输入的值添加到列表中，然后输出列表的内容。
3. 编写一个Python程序，使用try-except语句处理除以零异常。
4. 编写一个Python程序，使用for循环计算1到100的累加和。
5. （选做）不使用任何第三方库，尝试利用定积分的定义编写一个Python程序计算$\int_{0}^{1} \frac{1}{x^2+1} \, dx$的值。
{% endfold %}