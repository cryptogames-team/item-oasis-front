export function displayCurrentDateTime() {
    let now = new Date();

    let year = now.getFullYear(); // 연도
    let month = now.getMonth() + 1; // 월 (0에서 시작하기 때문에 1을 더해야 함)
    let day = now.getDate(); // 일
    let hour = now.getHours(); // 시
    let minute = now.getMinutes(); // 분

    // 월, 일, 시, 분이 한 자리 숫자일 때 앞에 0을 붙임
    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;
    hour = hour < 10 ? '0' + hour : hour;
    minute = minute < 10 ? '0' + minute : minute;

    let dateTimeString = year + "/" + month + "/" + day + " " + hour + ":" + minute;

    console.log(dateTimeString);
    return dateTimeString.toString();
}

export function formatDateToNumber() {

    const currentDate = new Date(); // 현재 날짜를 구한다.

    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // 월은 0부터 시작하므로 1을 더하고 2자리로 맞춤
    const day = currentDate.getDate().toString().padStart(2, '0'); // 일도 2자리로 맞춤
    const hours = currentDate.getHours().toString().padStart(2, '0');
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');
  
    return parseInt(`${year}${month}${day}${hours}${minutes}`, 10);
  }

