
# 🌊 Bluwhale 自动签到脚本 | Bluwhale Auto Check-in Script

## 📌 功能简介 | Features
本脚本可自动完成 Bluwhale 平台的签到任务，让你轻松领取奖励。  
This script automates the check-in process for Bluwhale, making it effortless to collect rewards.

## 🚀 获取登录所需 Tokens | Get Required Tokens

### 1️⃣ 注册 Bluwhale 账号 | Register an Account
👉 [注册链接 | Sign Up](https://profile.bluwhale.com/login?referral=7da0a708-9050-4573-9989-3a051e776164)

### 2️⃣ 获取 Token | Retrieve Your Token

1. 打开浏览器控制台：按 `F12` 或 **右键 -> 检查 -> 控制台 (Console)**  
   Open your browser’s developer console by pressing `F12` or **Right-click -> Inspect -> Console**
2. 粘贴以下代码并按 `Enter`，然后复制输出的 Token  
   Paste the following code and press `Enter`, then copy the generated Token.

   ⚠️ **首次粘贴代码时，可能会提示 "allow pasting"，请手动输入并回车。**  
   ⚠️ **The first time you paste the code, you might see a prompt to "allow pasting." Just type it manually and press Enter.**

   ```js
   const obj=JSON.parse(sessionStorage.getItem('firebaseUser'))
   console.log(obj.displayName+'***'+obj.auth.apiKey+'***'+obj.stsTokenManager.refreshToken+'***'+obj.stsTokenManager.accessToken)
   ```

3. 复制生成的 Token，并粘贴到 `tokens.txt`（**每行一个 Token**）  
   Copy the generated Token and paste it into `tokens.txt` (**one per line**).

---

## 🌍 代理配置 | Proxy Configuration

如果需要使用代理，请按以下格式填写 `proxy.txt`（**每行一个代理**）：  
If you need to use proxies, add them to `proxy.txt` in the following format (**one per line**):

```
host:port:username:password
```

⚠️ **如果代理不够用，脚本会使用最后一个代理重复运行。**  
⚠️ **If proxies are insufficient, the script will reuse the last one.**

---

## 🛠️ 运行脚本 | Run the Script

### 📥 安装依赖 | Install Dependencies
```sh
npm install
```

### ▶️ 启动脚本 | Start Script
```sh
npm run start
```

### 🔄 后台运行 | Run in Background (Using PM2)
```sh
npm install -g pm2
pm2 start npm --name "bluwhale" -- run start --log log/output.log
```

---

## 📌 说明 | Notes
- **支持多账号**：你可以在 `tokens.txt` 中添加多个 Token，脚本会依次执行签到。  
  Supports multiple accounts: Add multiple tokens in `tokens.txt`, and the script will process them sequentially.
- **自动重试**：如果签到失败，脚本会自动重试，确保签到成功。  
  Automatic retries: If check-in fails, the script will attempt again.

💡 **建议定期更新脚本，以获取最新功能和修复！**  
💡 **It's recommended to update the script regularly for the latest features and fixes!**

---

✨ **Enjoy effortless check-ins with Bluwhale!** 🌊