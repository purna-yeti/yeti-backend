exports.getLastVisitText = (date1, date2) => {
  let result = "";
  let diff = date1 - date2;

  const day = Math.floor(diff / (1000 * 24 * 60 * 60));
  result += day > 0? `${day}day `: '';
  diff %=  (1000 * 24 * 60 * 60);
  const hour = Math.floor(diff / (1000 * 60 * 60));
  result += hour > 0? `${hour}hour `: '';
  diff %=  (1000 * 60 * 60);
  const min = Math.floor(diff / (1000 * 60));
  result += min > 0? `${min}min `: '';
  diff %=  (1000 * 60);
  const sec = Math.floor(diff / (1000));
  result += sec > 0? `${sec}sec `: '';
  diff %=  (1000);
  
  if (result === '') return 'just now';
  return result + "ago";
}