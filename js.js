//old code remains uncommented because it has already been graded and it is therefor not worth the effort
$.ajax({
	'url': 'http://apis.is/concerts',
	'type': 'GET',
	'dataType': 'json',
	'success': function(response) {
		renderData(response);
		startSearch();
		loadLocationCheckboxes();
		checkboxFilter();
		filterByDate();
	}
});
function renderData(datas) {
	var data = datas['results']
	console.log(data.length);
	for (var i = 0; i < data.length; i++) {
		var event = data[i];
		var date = changeDate(event.dateOfShow);
		var insert = $("#mainThing");
		var eventTile = "<div class=\"col-md-4 eventContainer\"><img src='" + event.imageSource + "'><div class='eventName'>" + event.eventDateName + "</div><div class='location' data-location='" + event.eventHallName + "'>Staðsetning: " + event.eventHallName + "</div><div class='eventTime' data-time='" + event.dateOfShow + "'>Tími: " + date + "</div></div>";
		insert.append(eventTile);
	}
}
function changeDate(date) {
	var d = new Date(date);
	var day = d.getDate() + "." + (d.getMonth() + 1) + "." + d.getFullYear();
	var time = date.substring(11, date.length -3);
	return (day + " - " + time);
}
//end old code
//start new code
var filterByDate = function () {
	var events = $('#mainThing .eventContainer');
	var cache = [];
	//run through all the events and add them in the correct manor to the cache array
	events.each(function() {
		//get the us date from the data-time tag in each event
		var date = $(this).children('.eventTime').data().time.trim().toLowerCase();
		//make the date into an actual date
		var fixedDate = new Date(date);
		cache.push({
			element: this,
			//add the number of seconds since january 1st 1970 into the object next to the element itself
			date: fixedDate.getTime()
		});
	});
	//get the from and to dates from the form
	$("#dateButton").click(function() {
		var fromDate = new Date($("#fromDate").val());
		var toDate = new Date($("#toDate").val());
		for (var i = 0; i < cache.length; i++) {
			if (cache[i].date >= fromDate && cache[i].date <= toDate) {
				cache[i].element.style.display = "";
			}
			else{
				cache[i].element.style.display = "none";
			}
		}
	});

}

var startSearch = function() {
	//works despite being reserved
	//get all the event divs
	var events = $('#mainThing .eventContainer');
	//get the search div
	var search = $('#textSearch');
	//make a cache for storing the element and it's name in a comfortable fashion
	var cache = [];
	//run through all the events and add them in the correct manor to the cache array
	events.each(function() {
		cache.push({
			element: this,
			text: $(this).children('.eventName').text().trim().toLowerCase()
		});
	});
	//does the actual filetering
	function filter() {
		//trim and lowercase the value of the input
		var query = this.value.trim().toLowerCase();
		//run throug all the events in the cache
		cache.forEach(function(thing) {
		//make the index variable here for scope
		var index = 0;
		//get the index of the query in the name of the event, returns -1 if not found
		index = thing.text.indexOf(query);
		//set the style of the element according to whether or not a match was found
		thing.element.style.display = index === -1 ? 'none' : '';
	});
	}
	//hook the filter function to a keyup function
	search.on('keyup', filter);
}
//returns all the unique locations in the dataset for later useage
var getLocations = function() {
	//get all the events locations
	var events = $('#mainThing .eventContainer .location');
	//make an empty array for all the locations
	var allTheLocations = [];
	//run trough all the events and get only the proper string
	events.each(function() {
		//trim and get the string to lowercase
		var location = $(this).data().location.trim().toLowerCase();
		//add the string to the array
		allTheLocations.push(location);
	});
	return allTheLocations.unique();

}
//loads all the checkboxes onto the page
var loadLocationCheckboxes = function() {
	//get the unique locations in a neat little array
	var l = getLocations();
	var container = $("#checkboxContainer");
	l.forEach(function (thing) {
		container.append('<div class="checkbox"><label><input type="checkbox" class="locationCheckbox" value="' + thing + '"> ' + thing + '</label></div>');
	});
}
var checkboxFilter = function () {
	//start of by getting all of the checkboxes
	var container = $("#checkboxContainer");
	var checkers = $(".locationCheckbox");
	var cache = [];
	//run through all the events and add them in the correct manor to the cache array
	var events = $('#mainThing .eventContainer');
	events.each(function() {
		cache.push({
			element: this,
			text: $(this).children('.location').data().location.trim().toLowerCase()
		});
	});
	//run if anything changes in the checkboxes and filter out all that do not apply
	checkers.change(function() {
		console.log(this);
		var checkedArray = getCheckedArray();
		if (checkedArray.length == 0) {
			for (var i = 0; i < cache.length; i++) {
				cache[i].element.style.display = '';
			}
			console.log("nothing checked");
			return;
		}else{
			for (var i = 0; i < cache.length; i++) {
				for (var j = 0; j < checkedArray.length; j++) {
					if (checkedArray[j] == cache[i].text) {
						cache[i].element.style.display = '';
						break;
					}
					cache[i].element.style.display = 'none';
				}
			}
		}
	});
	function getCheckedArray() {
		var arr = [];
		checkers.each(function () {
			if (this.checked) {
				arr.push($(this).val().trim().toLowerCase());
			}
			return arr;
		});
		return arr;
	}
}




//add two functions onto all arrays, contains and unique
//returns true or false depending on whether or not an array contains a certain element
Array.prototype.contains = function(v) {
	//run through all of the array
    for(var i = 0; i < this.length; i++) {
    	//if the array contains the value return true
        if(this[i] === v){
        	 return true;
        }
    }
    //if not, return false
    return false;
};
//return an array of only the unique elements in the requested array
Array.prototype.unique = function() {
	//define the to-be-returned array
    var arr = [];
    //run through the array
    for(var i = 0; i < this.length; i++) {
    	//if the array does not contain element 
        if(!arr.contains(this[i])) {
        	//add element to array
            arr.push(this[i]);
        }
    }
    //return new array once finished
    return arr; 
}