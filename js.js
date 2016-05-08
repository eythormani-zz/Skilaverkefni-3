$.ajax({
	'url': 'http://apis.is/concerts',
	'type': 'GET',
	'dataType': 'json',
	'success': function(response) {
		renderData(response);
		showImages();
	}
});

function renderData(datas) {
	var data = datas['results']
	console.log(data.length);
	for (var i = 0; i < data.length; i++) {
		console.log(data[i]);
		var event = data[i];
		var date = changeDate(event.dateOfShow);
		var insert = $("#mainThing");
		var eventTile = "<div class=\"col-md-4 eventContainer\"><img src='" + event.imageSource + "'><div>Nafn: " + event.eventDateName + "</div><div>Staðsetning: " + event.eventHallName + "</div><div>Tími: " + date + "</div></div>";
		insert.append(eventTile);
	}
}

function changeDate(date) {
	var d = new Date(date);
	var day = d.getDate() + "." + (d.getMonth() + 1) + "." + d.getFullYear();
	var time = date.substring(11, date.length -3);
	return (day + " - " + time);
}

function showImages() {
	$(".image").hide();
	$('.contentRow[data-toggle="tooltip"]').tooltip({
		html: true
	});
}