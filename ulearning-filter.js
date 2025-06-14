function main() {
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
        headers: { 'content-type': 'application/json' },
        body: ''
      }
    });
    return;
  }

  // 匹配 saveLocalCache 请求，修改其 body
  if (/\/\/utestapi\.ulearning\.cn\/exams\/saveLocalCache/.test(url)) {
    try {
      console.log(logPrefix + "原始请求体: " + $request.body.string);
      let body = JSON.parse($request.body.string);

      if (body.behaviors && Array.isArray(body.behaviors)) {
        console.log(logPrefix + "原始 behaviors 数组长度: " + body.behaviors.length);

        body.behaviors = body.behaviors.filter(item => {
          const keep = item.behaviorType === 1 || item.behaviorType === 4;
          if (!keep) {
            console.log(logPrefix + "过滤掉 behaviorType: " + item.behaviorType, item);
          }
          return keep;
        });

        console.log(logPrefix + "过滤后 behaviors 数组长度: " + body.behaviors.length);

        $request.body.string = JSON.stringify(body);
        console.log(logPrefix + "修改后的请求体: " + $request.body.string);
      } else {
        console.log(logPrefix + "未发现 behaviors 数组，跳过处理");
      }

      $done({ body: $request.body.string });
    } catch (e) {
      console.error(logPrefix + "发生异常: " + e.message);
      console.error(logPrefix + "错误堆栈: ", e.stack);
      $done({});
    }
    return;
  }

  // 默认放行
  $done({});
}
