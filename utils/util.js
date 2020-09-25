const formatTime = (date, flag=false) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  let paddingTime = [year, month, day].map(formatNumber);
  let result = paddingTime.join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':');
  if (flag) {
    let [y, m, d] = paddingTime;
    result = `${y}年${m}月${d}日 ${[hour, minute, second].map(formatNumber).join(':')}`
  };
  return result;
}

const timestampToTime = timestamp => {
  const date = new Date(timestamp * 1000); 
  const Y = date.getFullYear() + '-';
  const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  const D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
  return  Y + M + D;
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime,
  timestampToTime : timestampToTime
}
