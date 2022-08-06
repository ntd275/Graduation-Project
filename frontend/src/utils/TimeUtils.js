const getTimeStr = (timestamp) => {
    const now = new Date();
    const mins = Math.floor((now-timestamp)/(60000));

    if (mins > 10080) { // 1440 * 7
        return new Date(timestamp).toLocaleDateString();
    } else if (mins > 1440){ // 24*60
        return Math.floor(mins/1440) + " ngày trước";
    } else if (mins > 60){
        return Math.floor(mins/60) + " giờ trước";
    } else if(mins >= 1) {
        return mins + " phút trước";
    }else{
        return "Vừa xong"
    }
}

const formatDate = (date) => {
    const yyyy = date.getFullYear();
    let mm = date.getMonth() + 1;
    let dd = date.getDate();
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    return dd + '/' + mm + '/' + yyyy;
}

export { getTimeStr, formatDate }