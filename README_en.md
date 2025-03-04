 [中文](README.md) | [English](README_en.md)

# 🌊 Bluwhale Auto Check-in Script
## 📌 Features
Automates daily check-in process for Bluwhale platform with multi-account support and proxy rotation.

## 🚀 Get Required Tokens
### 1️⃣ Register Account
👉 [Sign Up](https://profile.bluwhale.com/login?referral=7da0a708-9050-4573-9989-3a051e776164)

### 2️⃣ Retrieve Token
1. Open browser console (`F12` > Console)
2. Execute this code:
```js
   const obj=JSON.parse(sessionStorage.getItem('firebaseUser'))
   console.log(obj.displayName+'***'+obj.auth.apiKey+'***'+obj.stsTokenManager.refreshToken+'***'+obj.stsTokenManager.accessToken)
```
3. Save tokens in `tokens.txt` (one per line)

## 🌍 Proxy Configuration
Add proxies in `proxy.txt` with format:
```
host:port:username:password
```
⚠️ Script will reuse last proxy if insufficient.

## 🛠️ Usage
### 📥 Install Dependencies

```sh

git clone https://github.com/HuangZumao/bluwhale-bot.git
cd bluwhale-bot

```

```sh
npm install
```

### ▶️ Run Script
```sh
npm run start
```

### 🔄 Background Run (PM2)
```sh
npm install -g pm2
pm2 start index.js --name "bluwhale"  --output log/output.log --error log/error.log

```
search log
```sh
pm2 logs bluwhale
```
or
```shell
cd log
tail -f output.log
```
terminal
```sh
pm2 stop bluwhale
pm2 delete bluwhale
```

## 📌 Notes
- Multi-account: Add multiple tokens in `tokens.txt`
- Auto-retry: 3 retries on failure
- Proxy rotation supported

💡 **Recommend updating script regularly for new features!**

---
✨ **Enjoy effortless check-ins with Bluwhale!** 🌊



