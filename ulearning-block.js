// uLearning 统一拦截脚本
console.log("[uLearning] 拦截请求: " + $request.url);

$done({
  response: {
    status: 200,
    headers: {"Content-Type": "application/json"},
    body: '{"code":0,"message":"success","data":{}}'
  }
});
