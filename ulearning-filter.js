// uLearning Filter Script
const logPrefix = "[uLearning.Filter] ";
const url = $request.url;

console.log(logPrefix + "处理请求: " + url);

// 直接拦截这两个接口，返回成功响应
if (url.indexOf("setBehaviorTrace") !== -1 || url.indexOf("saveExamLimit") !== -1) {
  console.log(logPrefix + "拦截请求: " + url);
  $done({
    response: {
      status: 200,
      headers: {"Content-Type": "application/json"},
      body: "{}"
    }
  });
  return;
}

// 处理 saveLocalCache 接口
if (url.indexOf("saveLocalCache") !== -1) {
  if (!$request.body) {
    console.log(logPrefix + "请求体为空，直接放行");
    $done({});
    return;
  }
  
  try {
    console.log(logPrefix + "开始解析请求体");
    const data = JSON.parse($request.body);
    
    if (data.behaviors && Array.isArray(data.behaviors)) {
      const originalLength = data.behaviors.length;
      console.log(logPrefix + "原始 behaviors 数量: " + originalLength);
      
      // 过滤行为数据
      data.behaviors = data.behaviors.filter(item => {
        const keep = item.behaviorType === 1 || item.behaviorType === 4;
        if (!keep) {
          console.log(logPrefix + "过滤 behaviorType: " + item.behaviorType);
        }
        return keep;
      });
      
      const filteredLength = data.behaviors.length;
      console.log(logPrefix + "过滤后 behaviors 数量: " + filteredLength);
      console.log(logPrefix + "共过滤掉 " + (originalLength - filteredLength) + " 条记录");
      
      $done({body: JSON.stringify(data)});
      return;
    } else {
      console.log(logPrefix + "未找到 behaviors 数组，直接放行");
    }
  } catch (e) {
    console.log(logPrefix + "JSON解析失败: " + e.message);
  }
}

// 默认放行
console.log(logPrefix + "请求放行");
$done({});
