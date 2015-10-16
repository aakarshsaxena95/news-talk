var relativeDate = function(date){
	var month = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
	var now = new Date();
	if(date === now){
		return "Just now";
	}
	var yearDiff = date.getYear()-now.getYear();
	var monDiff = date.getMonth()-now.getMonth();
	var dateDiff = date.getDate()-now.getDate();
	if(date.toDateString() === now.toDateString())
		return sameDay(date);
	else if(yearDiff){
		return date.getDate()+", "+month[date.getMonth()]+" "+date.getYear();
	}
	else if(monDiff){
		return date.getDate()+" "+month[date.getMonth()];
	}
	else if(Math.abs(dateDiff) == 1){
		return "Yesterday";
	}
	else{
		return (-dateDiff)+" days ago";
	}
};
var sameDay = function(date){
	var now = new Date();
	console.log(date,now);
	if(Math.abs(date.getHours()-now.getHours())>1){
		return Math.abs(date.getHours()-now.getHours())+" hours ago";
	}
	else if(Math.abs(date.getHours()-now.getHours())==1 && Math.abs(date.getMinutes()-now.getMinutes())>60){
		return "1 Hour ago";
	}
	else if(Math.abs(date.getHours()-now.getHours())==1 && Math.abs(date.getMinutes()-now.getMinutes())<=60){
		return Math.abs(now.getMinutes()+(60-date.getMinutes()))+" minutes ago";
	}
	else{
		if(Math.abs(date.getMinutes()-now.getMinutes())>1){
			return Math.abs(date.getMinutes()-now.getMinutes())+" minutes ago";
		}
		else if(Math.abs(date.getMinutes()-now.getMinutes())==1 && Math.abs(date.getSeconds()-now.getSeconds())>60){
			return "1 minute ago";
		}
		else if(Math.abs(date.getMinutes()-now.getMinutes())==1 && Math.abs(date.getSeconds()-now.getSeconds())<=60){
			return Math.abs(now.getSeconds()+(60-date.getSeconds()))+" seconds ago";
		}
		else{
			return Math.abs(date.getSeconds()-now.getSeconds())+" seconds ago";
		}
	}
};