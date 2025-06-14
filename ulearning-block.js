// 直接拦截请求并返回成功响应
$done({
  response: {
    status: 200,
    headers: {"Content-Type": "application/json"},
    body: "{}"
  }
});
