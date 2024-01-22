 export function extractTimeFromDateString(dateString) {
    const dateObject = new Date(dateString);
  
    if (isNaN(dateObject.getTime())) {
      // 잘못된 날짜 형식일 경우 또는 파싱에 실패한 경우
      console.error("Invalid date string");
      return null;
    }
  
    const hours = dateObject.getHours();
    const minutes = dateObject.getMinutes();
  
    // 한 자리 수인 경우 앞에 0을 붙임
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  
    return `${formattedHours}:${formattedMinutes}`;
  }
  