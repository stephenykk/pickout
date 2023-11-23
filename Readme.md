简介
---
个人办公环境下，登录各个业务系统有不同的账号(*没有单点登录*), 经常要打开账号记事本去查对应系统的登录信息，比较麻烦!

希望有个命令，只要告诉它我要什么账号，它就直接回答我相关字段内容

所以就有了这么个工具

安装
---
```shell
npm i pkout -g
```

使用
---
```bash
# 查看帮助
pkout
pkout help
pkout help data

# 查看所有数据
pkout data 

# 查看某项数据
pkout data site.url 
pkout data sites[0].url 

# 查看yaml文件位置
pkout file

# 用vscode编辑文件
pkout edit data
pkout edit config
pkout edit code

# 查看配置
pkout config

# 重置配置
pkout config -c

```

注意
---
数据文件用yaml格式书写(*yaml用缩进表示数据结构，可读性很好*)


```yml
# yml 语法参考 (https://www.runoob.com/w3cnote/yaml-intro.html)
npm: &acc
  name: alice
  pass: &pass alice123

notebook:
  <<: *acc

email:
  name: alice@123.com
  pass: *pass

user:
    name: lufy
    fav: 
        - eating
        - sleeping
        - laughing

    members:
        -
            name: nami
        -
            name: zoro
    

```

