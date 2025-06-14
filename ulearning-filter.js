const logPrefix = "[uLearning.Filter] ";
const url = $request.url;
console.log(logPrefix + "匹配到请求: " + url);

// 匹配需要拦截并返回空响应的 URL
if (
  /\/\/utestapi\.ulearning\.cn\/exams\/setBehaviorTrace/.test(url) ||
  /\/\/apps\.ulearning\.cn\/exam\/saveExamLimit\.do/.test(url)
) {
  console.log(logPrefix + "拦截请求并返回空响应");
  $done({
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: '{}'
    }
  });
}

// 匹配 saveLocalCache 请求，修改其 body
else if (/\/\/utestapi\.ulearning\.cn\/exams\/saveLocalCache/.test(url)) {
  try {
    console.log(logPrefix + "原始请求体: " + $request.body);
    let body = JSON.parse($request.body);
    
    if (body.behaviors && Array.isArray(body.behaviors)) {
      console.log(logPrefix + "原始 behaviors 数组长度: " + body.behaviors.length);
      
      body.behaviors = body.behaviors.filter(item => {
        const keep = item.behaviorType === 1 || item.behaviorType === 4;
        if (!keep) {
          console.log(logPrefix + "过滤掉 behaviorType: " + item.behaviorType);
        }
        return keep;
      });
      
      console.log(logPrefix + "过滤后 behaviors 数组长度: " + body.behaviors.length);
      
      const modifiedBody = JSON.stringify(body);
      console.log(logPrefix + "修改后的请求体: " + modifiedBody);
      
      $done({ body: modifiedBody });
    } else {
      console.log(logPrefix + "未发现 behaviors 数组，跳过处理");
      $done({});
    }
  } catch (e) {
    console.error(logPrefix + "发生异常: " + e.message);
    console.error(logPrefix + "错误堆栈: " + e.stack);
    $done({});
  }
}

// 默认放行
else {
  $done({});
}
