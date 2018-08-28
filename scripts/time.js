"use strict";

function theTime() {
	let time = new Date(),
	  hour = time.getHours(),
	  minutes = time.getMinutes(),
	  amPM = "AM",
		 month = time.getMonth(),
	  date = time.getDate(),
	  day = time.getDay(),
	  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
	  days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];

	day = days[day];
	month = months[month];


	if (minutes < 10) {//Sets the format of minutes to 0# for single digit numbers
		minutes = `0${minutes}`;
	}

	if (hour > 12) { // Chooses between AM or PM
		hour -= 12;
		amPM = "PM";
  	} else if (hour == 0) {
  		hour = 12;
	}
	
	let formatTime = `${hour}:${minutes} ${amPM}`,
	formatDate = `${day}, ${month} ${date}`;
		
	document.getElementById("time").innerHTML = formatTime;
	document.getElementById("date").innerHTML = formatDate;

}
	
theTime();