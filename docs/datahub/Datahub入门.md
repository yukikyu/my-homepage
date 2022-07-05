# Datahub入门

## 简介

Datahub的架构有三个主要部分

- 前端为Datahub frontend作为前端的页面展示

丰富的前端展示让Datahub 拥有了支撑大多数功能的能力。其前端基于React框架研发，对于有二次研发打算的公司，要注意此技术栈的匹配性。

- 后端 Datahub serving来提供后端的存储服务。

Datahub 的后端开发语言为Python，存储基于ES或者Neo4J。

- 而Datahub ingestion则用于抽取元数据信息。

Datahub 提供了基于API元数据主动拉取方式，和基于Kafka的实时元数据获取方式。这对于元数据的获取非常的灵活。

这三部分也是我们部署过程中主要关注的点，下面我们就从零开始部署Datahub，并获取一个数据库的元数据信息。

## 安装jq

```shell
# 安装EPEL源
yum install epel-release

# 安装完EPEL源后，可以查看下jq包是否存在：
yum list jq

# 安装jq
yum install jq
```

## 安装依赖

```shell
yum -y groupinstall "Development tools" yum -y install zlib-devel bzip2-devel openssl-devel ncurses-devel sqlite-devel readline-devel tk-devel gdbm-devel db4-devel libpcap-devel xz-devel libffi-devel
```

## 下载安装包

```shell
wget https://www.python.org/ftp/python/3.8.3/Python-3.8.3.tgz
tar -zxvf Python-3.8.3.tgz
```

## 编译安装

```shell
mkdir /usr/local/python3
cd Python-3.8.3
./configure --prefix=/usr/local/python3 --with-ssl
make && make install
```

## 修改系统默认python指向

```shell
rm -rf /usr/bin/python
ln -s /usr/local/python3/bin/python3 /usr/bin/python
```

## 修改系统默认pip指向

```shell
rm -rf /usr/bin/pip
ln -s /usr/local/python3/bin/pip3 /usr/bin/pip
```

## 验证

```shell
python -V
```

## 修复yum

python3会导致yum不能正常使用
```shell
vi /usr/bin/yum 
```

> 把 ##! /usr/bin/python 修改为 ##! /usr/bin/python2 

```shell
vi /usr/libexec/urlgrabber-ext-down 
```

> 把 ##! /usr/bin/python 修改为 ##! /usr/bin/python2 

```shell
vi /usr/bin/yum-config-manager 
```

> ##!/usr/bin/python 改为 ##!/usr/bin/python2 没有的不用修改

## 安装与启动datahub

首先升级pip
```shell
python3 -m pip install --upgrade pip wheel setuptools
```

需要看到下面成功的返回。
Attempting uninstall: setuptools Found existing installation: setuptools 57.4.0 Uninstalling setuptools-57.4.0: Successfully uninstalled setuptools-57.4.0 Attempting uninstall: pip Found existing installation: pip 21.2.3 Uninstalling pip-21.2.3: Successfully uninstalled pip-21.2.3
检查环境

```shell
python3 -m pip uninstall datahub acryl-datahub || true ## sanity check - ok if it fails
```

收到这样的提示说明没有问题。
WARNING: Skipping datahub as it is not installed. WARNING: Skipping acryl-datahub as it is not installed.
安装datahub，此步骤时间较长，耐心等待。

```shell
python3 -m pip install --upgrade acryl-datahub
```

收到这样的提示说明安装成功。
Successfully installed PyYAML-6.0 acryl-datahub-0.8.20.0 avro-1.11.0 avro-gen3-0.7.1 backports.zoneinfo-0.2.1 certifi-2021.10.8 charset-normalizer-2.0.9 click-8.0.3 click-default-group-1.2.2 docker-5.0.3 entrypoints-0.3 expandvars-0.7.0 idna-3.3 mypy-extensions-0.4.3 progressbar2-3.55.0 pydantic-1.8.2 python-dateutil-2.8.2 python-utils-2.6.3 pytz-2021.3 pytz-deprecation-shim-0.1.0.post0 requests-2.26.0 stackprinter-0.2.5 tabulate-0.8.9 toml-0.10.2 typing-extensions-3.10.0.2 typing-inspect-0.7.1 tzdata-2021.5 tzlocal-4.1 urllib3-1.26.7 websocket-client-1.2.3
最后我们看到datahub的版本情况。

```shell
python3 -m datahub version
```

DataHub CLI version: 0.8.20.0 Python version: 3.8.3 (default, Aug 10 2021, 14:25:56) [GCC 4.8.5 20150623 (Red Hat 4.8.5-44)]
随后启动datahub

```shell
python3 -m datahub docker quickstart
```

会经过漫长的下载过程，耐心等待。

开始启动，注意观察报错情况。如果网速不好，需要多执行几次。

如果可以看到如下显示，证明安装成功了。

访问ip:9002 输入 datahub datahub 登录