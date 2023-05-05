# 二、Shell解释器

## 1.Linux提供的Shell解析器有

```bash
[xx@xx ~]$ cat /etc/shells
/bin/sh
/bin/bash
/sbin/nologin
/bin/bash
/bin/tcsh
/bin/csh
```

## 2.bash和sh的关系

```bash
[xx@xx ~]$ ll | grep bash
bash
sh -> bash
```

## 3.Centos默认的解析器事bash

```bash
$ echo $SHELL
/bin/bash
```