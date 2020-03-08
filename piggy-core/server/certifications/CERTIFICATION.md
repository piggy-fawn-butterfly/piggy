# 使用 WebSocket wss

> **声明：以下操作适用于 MacOS**

## 第一步 生成测试版自签名证书

参考 [OpenSSL 生成 SSL 证书的过程](https://bufbrane.com/openssl-generate-ssl-certificate/)

## 第二步 信任自签名证书

参考 [mac 浏览器(chrome, safari)信任自签名证书](https://www.cnblogs.com/ZhYQ-Note/p/8493848.html)

> 个人总结的操作步骤
>
> 1. 完全退出浏览器；
> 2. 双击 crt 证书文件，将证书添加到钥匙串；
> 3. 在钥匙串中找到证书文件，双击之后，打开信任选项，将 **加密套接字协议层(SSL)** 修改为 **始终信任**；
> 4. 打开 `https://localhost:port`；如果使用的是 Safari 浏览器，正常是 OK 的；如果使用 Chrome 或 Edge 浏览器，正常会显示`NET::ERR_CERT_COMMON_NAME_INVALID` 错误，这时点击高级，选择继续前往，没有报错说明证书已经可以用于正常的测试使用了。
