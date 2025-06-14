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
    
    // 检查是否为数组格式
    if (Array.isArray(data) && data.length > 0) {
      let totalFiltered = 0;
      
      // 遍历数组中的每个缓存对象
      for (let i = 0; i < data.length; i++) {
        const cacheItem = data[i];
        
        // 检查是否有 content 字段且为数组
        if (cacheItem.content && Array.isArray(cacheItem.content)) {
          const originalLength = cacheItem.content.length;
          console.log(logPrefix + `缓存项 ${i} 原始 content 数量: ${originalLength}`);
          
          // 过滤 content 中的行为数据
          cacheItem.content = cacheItem.content.filter(item => {
            const keep = item.behaviorType === 1 || item.behaviorType === 4;
            if (!keep) {
              console.log(logPrefix + "过滤 behaviorType: " + item.behaviorType);
              totalFiltered++;
            }
            return keep;
          });
          
          const filteredLength = cacheItem.content.length;
          console.log(logPrefix + `缓存项 ${i} 过滤后 content 数量: ${filteredLength}`);
        }
      }
      
      console.log(logPrefix + "总共过滤掉 " + totalFiltered + " 条记录");
      $done({body: JSON.stringify(data)});
      return;
    } else {
      console.log(logPrefix + "数据格式不符合预期，直接放行");
    }
  } catch (e) {
    console.log(logPrefix + "JSON解析失败: " + e.message);
  }
}

// 默认放行
console.log(logPrefix + "请求放行");
$done({});
