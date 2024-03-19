<!-- TOC -->

- [1. blackview-admin-web](#1-blackview-admin-web)
  - [1.1. 初始化](#11-初始化)
  - [1.2. 改进](#12-改进)
  - [1.3. 增加多标签页来控制控制路由](#13-增加多标签页来控制控制路由)

<!-- /TOC -->

# 1. blackview-admin-web

the blackview-admin-web is just a demo, and very easy to learn。But no default page or default router。

if you want a default page or router, you can add it by yourself。i believe you can make it。

if you want a completed dashborad, maybe you should see https://github.com/PanJiaChen/vue-element-admin

![](./login.jpg)
![](./screen.png)

## 1.1. 初始化
```
yarn install
yarn run serve

```
## 1.2. 改进

- 使用vue-cli 3x
- 使用vuex
- 增加多标签页来控制控制路由


## 1.3. 增加多标签页来控制控制路由

1. 使用keep-alive
2. 使用keep-alive include属性来指明哪些页面需要缓存
3. navTags由vuex来管理

```
<keep-alive :include="navTags">
  <router-view></router-view>
</keep-alive>
```
## 运行vue项目 执行命令 npm run serve
## 将项目打包部署  执行命令 ：npm run build
