const logPrefix = "[uLearning.Filter] ";
const url = $request.url;

// 拦截 setBehaviorTrace 和 saveExamLimit 请求，直接返回成功响应
if (url.includes("setBehaviorTrace") || url.includes("saveExamLimit")) {
  console.log(logPrefix + "拦截请求: " + url);
  $done({
    response: {
      status: 200,
      headers: { 
        "Content-Type": "application/json"
      },
      body: '{"code":0,"message":"success","data":{}}'
    }
  });
} 
// 处理 saveLocalCache 请求，过滤 behaviors 数组
else if (url.includes("saveLocalCache")) {
  if (!$request.body) {
    console.log(logPrefix + "请求体为空，直接放行");
    $done({});
  } else {
    try {
      let body = JSON.parse($request.body);
      
      if (body.behaviors && Array.isArray(body.behaviors)) {
        const originalLength = body.behaviors.length;
        
        // 只保留 behaviorType 为 1 或 4 的记录
        body.behaviors = body.behaviors.filter(item => 
          item.behaviorType === 1 || item.behaviorType === 4
        );
        
        const filteredLength = body.behaviors.length;
        console.log(logPrefix + `过滤 behaviors: ${originalLength} -> ${filteredLength}`);
        
        // 修改请求体
        $done({ 
          body: JSON.stringify(body)
        });
      } else {
        console.log(logPrefix + "未发现 behaviors 数组，直接放行");
        $done({});
      }
    } catch (e) {
      console.log(logPrefix + "JSON解析失败: " + e.message);
      $done({});
    }
  }
} 
// 其他请求直接放行
else {
  $done({});
}
