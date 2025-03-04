const axios = require("axios");
const fs = require("fs");
const qs = require("querystring"); // 用于将表单数据转换为 URL 编码格式
const { SocksProxyAgent } = require("socks-proxy-agent");
const { exec } = require("child_process");

// 读取 tokens 和 proxies
const tokens = fs
  .readFileSync("tokens.txt", "utf-8")
  .split("\n")
  .filter((item) => item)
  .map((item) => {
    const arr = item.split("***");
    if (!arr[0] || !arr[1] || !arr[2] || !arr[3]) {
      console.error("token格式错误");
      return {};
    }
    return {
      name: arr[0].trim(),
      key: arr[1].trim(),
      refresh_token: arr[2].trim(),
      token: arr[3].trim(),
    };
  });

const proxies = fs
  .readFileSync("proxys.txt", "utf-8")
  .split("\n")
  .filter((item) => item);

const url = "https://ses.bluwhale.com/api/v1/wallets/sign_in/";
const headers = {
  Accept: "application/json, text/plain, */*",
  "Accept-Language": "en-US,en;q=0.9",
  "Content-Type": "application/json",
  Origin: "https://profile.bluwhale.com",
  Referer: "https://profile.bluwhale.com/",
  Connection: "keep-alive",
  "Sec-Fetch-Dest": "empty",
  "Sec-Fetch-Mode": "cors",
  "Sec-Fetch-Site": "same-site",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
};

const maxRetries = 10;

const asyncToken = () => {
  fs.writeFileSync(
    "tokens.txt",
    tokens
      .map((item) => {
        return `${item.key}***${item.refresh_token}***${item.token}`;
      })
      .join("\n"),
    "utf-8",
  );
};

const refreshTokenFs = (tokenData, tokenObj) => {
  tokenObj.token = tokenData.access_token;
  tokenObj.refresh_token = tokenData.refresh_token;
  asyncToken();
};

async function refreshTokenFn(tokenObj, proxy) {
  // 构造请求体
  const requestBody = qs.stringify({
    grant_type: "refresh_token",
    refresh_token: tokenObj.refresh_token,
    key: tokenObj.key,
  });
  // 设置请求头
  const headers = {
    Accept: "*/*",
    "Accept-Language": "en-US,en;q=0.9",
    "Content-Type": "application/x-www-form-urlencoded",
    Origin: "https://profile.bluwhale.com",
    Priority: "u=1, i",
    Referer: "https://profile.bluwhale.com/",
    "Sec-CH-UA":
      '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
    "Sec-CH-UA-Mobile": "?0",
    "Sec-CH-UA-Platform": '"Windows"',
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "cross-site",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
    "X-Client-Data": "CIL8ygE=",
    "X-Client-Version": "Chrome/JsCore/10.7.0/FirebaseCore-web",
    "X-Firebase-GMPID": "1:968372383603:web:1e414fcbe76b45cf739f06",
  };
  const axiosInstance = axios.create({
    headers: {
      ...headers,
    },
  });
  if (proxy) {
    const [host, port, username, password] = proxy.split(":");
    if (host && port) {
      const agent = new SocksProxyAgent(
        `socks5://${username}:${password}@${host}:${port}`,
      );
      axiosInstance.defaults.httpsAgent = agent;
      axiosInstance.defaults.httpAgent = agent;
    }
  }
  try {
    const response = await axiosInstance.post(
      "https://securetoken.googleapis.com/v1/token",
      requestBody,
      {
        headers,
      },
    );
    console.log(new Date().toLocaleString(), "新 Token:", response.data); // 打印返回的新 token
    refreshTokenFs(response.data, tokenObj);
  } catch (error) {
    console.error(
      "刷新 Token 失败:",
      error.response ? error.response.data : error.message,
    );
  }
}

async function signInWithTokenAndProxy(tokenObj, proxy) {
  const axiosInstance = axios.create({
    baseURL: url,
    headers: {
      ...headers,
      Authorization: `Bearer ${tokenObj.token}`,
    },
  });
  if (proxy) {
    const [host, port, username, password] = proxy.split(":");
    if (host && port) {
      const agent = new SocksProxyAgent(
        `socks5://${username}:${password}@${host}:${port}`,
      );
      axiosInstance.defaults.httpsAgent = agent;
      axiosInstance.defaults.httpAgent = agent;
    }
  }

  const data = "{}"; // Empty body

  try {
    const response = await axiosInstance.post("", data);
    if (response.status === 200) {
      console.log(
        new Date().toLocaleString(),
        `签到成功，${tokenObj.name}  返回 ${JSON.stringify(response.data)}`,
      );
    } else {
      throw new Error(`签到失败，状态码: ${response.status}`);
    }
    return true;
  } catch (error) {
    console.error(
      `签到失败，错误信息: ${(error.response?.data && JSON.stringify(error.response.data)) || error.message}`,
    );
    if (error.response?.status === 401) {
      // 刷新token
      console.log(
        new Date().toLocaleString(),
        `token: ${tokenObj.name}  失效，尝试刷新token`,
      );
      await refreshTokenFn(tokenObj, proxy);
    } else {
      console.log(new Date().toLocaleString(), error);
    }

    return false;
  }
}

async function attemptSignIn(tokenObj, proxy, attempts = 1) {
  if (attempts > maxRetries) {
    console.log(
      new Date().toLocaleString(),
      `达到最大重试次数，跳过当前  ${tokenObj.name}，代理: ${proxy}`,
    );
    return;
  }

  const success = await signInWithTokenAndProxy(tokenObj, proxy);
  if (success) {
    return;
  }

  // 等待1秒再重试
  await new Promise((resolve) => setTimeout(resolve, 1000));

  console.log(
    new Date().toLocaleString(),
    `重试第 ${attempts} 次，当前: ${tokenObj.name}，代理: ${proxy}`,
  );
  await attemptSignIn(tokenObj, proxy, attempts + 1);
}

async function runSignIn() {
  if (!tokens.length) {
    console.log(new Date().toLocaleString(), "请先输入token");
    // 退出程序
    process.exit(0);
    return;
  }
  tokens.forEach((tokenObj, index) => {
    // 如果代理为空，则不适用代理
    if (!proxies.length) {
      console.log(
        new Date().toLocaleString(),
        `开始签到，使用: ${tokenObj.name} `,
      );
      attemptSignIn(tokenObj, "");
    }
    // 如果代理不够用，则使用最后一个代理
    const proxy =
      proxies[index >= proxies.length ? proxies.length - 1 : index].trim();
    console.log(
      new Date().toLocaleString(),
      `开始签到，使用: ${tokenObj.name} 和代理: ${proxy}`,
    );
    attemptSignIn(tokenObj, proxy);
  });
}

// 每天定时运行签到
runSignIn();
setInterval(
  () => {
    runSignIn();
  },
  12 * 60 * 60 * 1000,
); // 每12小时运行一次
