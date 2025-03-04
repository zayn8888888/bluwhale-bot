[中文](README.md) | [English](README_en.md)

# 🌊 Bluwhale 自动签到脚本
## 📌 功能简介
支持多账号自动签到、代理轮换和失败重试的自动化脚本。

## 🚀 获取登录凭证
### 1️⃣ 注册账号
👉 [注册链接](https://profile.bluwhale.com/login?referral=7da0a708-9050-4573-9989-3a051e776164)

### 2️⃣ 获取Token
1. 打开浏览器控制台 (`F12` > 控制台)
2. 执行代码：
```js
   const obj=JSON.parse(sessionStorage.getItem('firebaseUser'))
   console.log(obj.displayName+'***'+obj.auth.apiKey+'***'+obj.stsTokenManager.refreshToken+'***'+obj.stsTokenManager.accessToken)
```
3. 将Token保存至`tokens.txt`（每行一个）

## 🌍 代理配置
在`proxy.txt`中添加代理，格式：
```
host:port:username:password
```
⚠️ 代理不足时将重复使用最后一个

## 🛠️ 使用指南
### 📥 安装依赖
```sh
npm install
```

### ▶️ 运行脚本
```sh
npm run start
```

### 🔄 后台运行 (PM2)
```sh
npm install -g pm2
pm2 start index --name "bluwhale"  --output log/output.log --error log/error.log

```
日志查询
```sh
pm2 logs bluwhale
```
或者
```shell
cd log
tail -f output.log
```
terminal
```sh
pm2 stop bluwhale
pm2 delete bluwhale
```

## 📌 注意事项
- 多账号：在`tokens.txt`中添加多个Token
- 自动重试：失败时重试3次
- 支持代理轮换

💡 **建议定期更新脚本以获取新功能！**

---
✨ 让Bluwhale签到变得轻松简单！🌊

