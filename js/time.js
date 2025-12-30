(function(window){
  function formatTimeAgo(timeString){
    var time = new Date(timeString.replace(/-/g,'/'));
    var now = new Date();
    var diff = (now - time) / 1000; // 秒差

    var oneMinute = 60,
        oneHour = 3600,
        oneDay = 86400,
        oneWeek = 7 * oneDay,
        oneMonth = 30 * oneDay,
        sixMonths = 180 * oneDay,
        oneYear = 365 * oneDay,
        threeYears = 3 * 365 * oneDay;

    var timeY = time.getFullYear(),
        timeM = time.getMonth() + 1,
        timeD = time.getDate(),
        timeH = time.getHours(),
        timeMin = time.getMinutes();

    var nowY = now.getFullYear(),
        nowM = now.getMonth() + 1,
        nowD = now.getDate();

    // -------- 相对时间判断 --------
    if (diff < oneMinute) return '刚刚';
    if (diff < oneHour) return Math.floor(diff / oneMinute) + '分钟前';
    if (diff < oneDay) return Math.floor(diff / oneHour) + '小时前';
    if (diff < oneWeek) return Math.floor(diff / oneDay) + '天前';

    // 1周 ~ 1个月内：显示 X 周前
    if (diff < oneMonth) {
      return Math.floor(diff / oneWeek) + '周前';
    }

    // 1个月 ~ 6个月内：显示 X 月前
    if (diff < sixMonths) {
      var monthsAgo = Math.floor(diff / oneMonth);
      return monthsAgo === 1 ? '1个月前' : monthsAgo + '个月前';
    }

    // 6个月 ~ 1年内：显示 半年前
    if (diff < oneYear) return '半年前';

    // 1年 ~ 3年内：显示 X 年前
    if (diff < threeYears) {
      var yearsAgo = Math.floor(diff / oneYear);
      return yearsAgo === 1 ? '1年前' : yearsAgo + '年前';
    }

    // 超过 3年，显示中文日期
    var dateStr = '';
    if (timeY === nowY) {
      dateStr = timeM + '月' + timeD + '日';
    } else {
      dateStr = timeY + '年' + timeM + '月' + timeD + '日';
    }
    return dateStr;
  }

  function updateRelativeTimes(selector='time.post-time'){
    document.querySelectorAll(selector).forEach(function(t){
      var original = t.getAttribute('data-time');
      if (original) t.textContent = formatTimeAgo(original);
    });
  }

  document.addEventListener('DOMContentLoaded', function(){
    updateRelativeTimes();
    setInterval(updateRelativeTimes, 60000);
  });

  // 动态监听新节点（例如评论）
  var observer = new MutationObserver(function(mutations){
    mutations.forEach(function(mutation){
      mutation.addedNodes.forEach(function(node){
        if (node.nodeType === 1) {
          if (node.matches && node.matches('time.post-time')) {
            if (node.getAttribute('data-time')) 
              node.textContent = formatTimeAgo(node.getAttribute('data-time'));
          } else {
            node.querySelectorAll && node.querySelectorAll('time.post-time').forEach(function(t){
              if (t.getAttribute('data-time')) 
                t.textContent = formatTimeAgo(t.getAttribute('data-time'));
            });
          }
        }
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });

  window.TimeAgo = {
    update: updateRelativeTimes,
    format: formatTimeAgo
  };
})(window);
