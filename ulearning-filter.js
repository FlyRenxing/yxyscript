// uLearning 过滤脚本 v7
try {
  const url = $request.url;
  console.log("[uLearning] 处理请求: " + url);
  
  // 拦截特定接口
  if (url.includes("setBehaviorTrace") || url.includes("saveExamLimit")) {
    console.log("[uLearning] 拦截请求并返回空响应");
    $done({
      response: {
        status: 200,
        headers: {"Content-Type": "application/json"},
        body: "{}"
      }
    });
  }
  // 过滤 saveLocalCache
  else if (url.includes("saveLocalCache") && $request.body) {
    console.log("[uLearning] 开始处理 saveLocalCache 请求");
    const data = JSON.parse($request.body);
    
    if (Array.isArray(data)) {
      console.log("[uLearning] 检测到数组格式，开始处理...");
      let totalOriginal = 0;
      let totalFiltered = 0;
      
      data.forEach((item, index) => {
        if (item.content && Array.isArray(item.content)) {
          const original = item.content.length;
          totalOriginal += original;
          
          item.content = item.content.filter(behavior => 
            behavior.behaviorType === 1 || behavior.behaviorType === 4
          );
          
          const filtered = item.content.length;
          totalFiltered += filtered;
          console.log("[uLearning] 缓存项" + index + ": " + original + " -> " + filtered);
        }
      });
      
      console.log("[uLearning] 总计: " + totalOriginal + " -> " + totalFiltered + " (过滤" + (totalOriginal - totalFiltered) + "条)");
      $done({body: JSON.stringify(data)});
    } else {
      console.log("[uLearning] 数据格式不是数组，直接放行");
      $done({});
    }
  }
  // 默认放行
  else {
    console.log("[uLearning] 不匹配规则，直接放行");
    $done({});
  }
} catch (e) {
  console.log("[uLearning] 脚本异常: " + e.message);
  $done({});
}
