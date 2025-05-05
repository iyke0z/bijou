export default {
    formatDate(date) {
        var date = new Date(date)
        return date.toDateString()
    },
    formatTime(date) {
        var time = new Date(date)
        let hours = time.getHours()
        let minutes = time.getMinutes()
        let seconds = time.getSeconds()
        var ampm = hours >= 12 ? 'pm' : 'am'
        return hours + ":" + minutes + " " + ampm
    },
    dateTime(date) {
        var date = new Date(date)
        var time = new Date(date)
        let hours = time.getHours()
        let minutes = time.getMinutes()
        let seconds = time.getSeconds()
        var ampm = hours >= 12 ? 'pm' : 'am'
        return date.toDateString() + " " + hours + ":" + minutes + " " + ampm
    },
    dateOnly(date) {
        return date.substring(0, 4)
    },
    yearOnly(date) {
        return date.substring(0, 10)
    },
    toEpochTime(time) {
        return new Date(time).getTime()
    },
    upperCase(letter) {
        return letter.charAt(0).toUpperCase() + letter.slice(1)
    },
    delete_row(id) {
        document.getElementById("myTable").deleteRow(0);
    }

}