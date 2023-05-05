# 三、Shell脚本入门

## 1.脚本格式

脚本以#!/bin/bash开头（指定解析器）

## 2.第一个Shell脚本：helloworld

### 2.1.需求：创建一个Shell脚本，输出helloworld

```bash
#!/bin/bash
echo 'hello world'
```

> 可以使用 sh、bash执行，可以跟绝对路径或者相对路径。
> 

```bash
$ sh helloworld.sh
$ bash helloworld.sh

# 直接执行文件，需要提前赋予执行权限
$ chmod 777 helloworld.sh
$ ./helloworld.sh
```

## 3.第二个Shell脚本：多命令处理

### 3.1.需求：

在根目录下创建一个 demo.txt，在demo.txt文件中增加“hello world”。

```bash
cd /
touch demo.txt
echo "hello world" >> demo.txt
```