function startTime () {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    m = checkTime(m);
    s = checkTime(s);
    document.getElementById('txt').innerHTML =
    h + ':' + m + ':' + s;
    checkMBTA();
    // Used THIS https://stackoverflow.com/questions/24359073/navigator-geolocation-getcurrentposition-do-not-work-in-firefox-30-0
    //To change geolocation
    console.log(lastCheck);
    if ( lastCheck != m ) {
        lastCheck = m;
        if ( navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(locationSuccess, locationError,{timeout:10000});
        }
        else {
            locationError ( "Your Browser Does Not Support Geolocations");
        }
    }
    var t = setTimeout(startTime, 1000);
}

function checkTime (i) {
    if (i < 10) {i = '0' + i};  // add zero in front of numbers < 10
    return i;
}

function checkMBTA (){
    //$(document).ready( only makes the function available AND RUNS IT after the page is loaded ("ready")
    $(document).ready(function() {
        console.log( 'ready!' );
        var stop_name;
        var url = 'http://realtime.mbta.com/developer/api/v2/predictionsbystop?api_key=wX9NwuHnZU2ToO7GmGR9uw&stop=place-davis&format=json';
        var json = $.getJSON(url, function(data) {
// Perform any placement of json data in html here.
            document.getElementById('train').innerHTML = data.stop_name;
            var directions = sortDirections (data.mode[0].route[0].direction);
            // console.log(directions[1].trip[0].pre_away)
            addElement ("train", "div", directions[0].trip[0].trip_headsign);
            addElement ("train", "div", directions[0].trip[0].pre_away);
            addElement ("train", "div", directions[1].trip[0].trip_headsign);
            addElement ("train", "div", directions[1].trip[0].pre_away);
        });
    });
}

function addElement (existing_id, type, value) {
    var new_element = document.createElement(type);
    var node = document.createTextNode(value);
    new_element.appendChild(node);
    var existing_element = document.getElementById(existing_id);
    existing_element.appendChild(new_element);
}

function sortDirections (json_object) {
    var directions_order = [];
    var i = 0;
    switch (json_object[0].direction_name) {
        case "Northbound":
            south = json_object[1];
            if (typeof(json_object[1]) == 'undefined') {
                directions_order.push(createNullTrain("Southbound"));
            }
            else {
                directions_order.push(json_object[1]);
                
            }
            directions_order.push(json_object[0]);
            break;
        case "Southbound":
            directions_order.push(json_object[0]);
            north = json_object[1];
            if (typeof(json_object[1]) == 'undefined') {
                directions_order.push(createNullTrain("Northbound"));
            }
            else {
                directions_order.push(json_object[1]);
                
            }
            break;
        default:
            // directions_order.push(createNullTrain("Southbound");
            // directions_order.push(createNullTrain("Northbound");
            // break;
    }
    return directions_order;
}

function createNullTrain (direction) {
    var nullTrainObject = {
    "direction_name": "No "+direction+" trains",
    "trip":[
        {"trip_headsign": "No "+direction+" trains", "pre_away": "Infinity"},
            ]
    }
    return nullTrainObject;
}

function locationSuccess ( position ) {
    try {
        // Get cache and parse localStorage.weatherCache so you can access elements using cache 
        var cache = localStorage.weatherCache && JSON.parse( localStorage.weatherCache );
        
        var d = new Date();

        if ( cache && cache.timestamp && cache.timestamp > d.getTime() - 1*60*1000 ) {
            var offset = d.getTimezoneOffset() * 60 * 1000;
            var city = cache.data.city.name;
            var country = cache.data.city.country;
            var current_weather = cache.data.list[0];
            //this commented out code is a how to iterate through the list of html
            // $.each (cache.data.list, function() {
            $(document).ready(function() {
                //"this" holds a forecast object
                // Get the local time of this forecast (the api returns it in utc)

                var localTime = new Date(this.dt*1000 - offset);
                // console.log(this.main.temp);
                // addElement ("weather", "div", this.main.temp);
                $("#weather").text(current_weather.main.temp);
                // addWeather (
                //     this.weather[0].icon;
                //     // moment(localTime).calendar(),   // We are using the moment.js library to format the date
                //     // this.weather[0].main + ' <b>' + convertTemperature(this.main.temp_min) + '°' + DEG +
                //         ' / ' + convertTemperature(this.main.temp_max) + '°' + DEG+'</b>'

                // );
            });
            // // Add the location to the page
            // location.html(city+', <b>'+country+'</b>');

            // weatherDiv.addClass('loaded');

            // // Set the slider to the first slide
            // showSlide(0);

        }

        else{
            // If the cache is old or nonexistent, issue a new AJAX request

            var weatherAPI = 'http://api.openweathermap.org/data/2.5/forecast?lat='+position.coords.latitude+
                                '&lon='+position.coords.longitude+'&appid='+key

            $.getJSON(weatherAPI, function(response){

                // Store the cache
                localStorage.weatherCache = JSON.stringify({
                    timestamp:(new Date()).getTime(),   // getTime() returns milliseconds
                    data: response
                });

                // Call the function again
                locationSuccess(position);
            });
        }

    }
    catch(e){
        locationError("We can't find information about your city!");
        window.console && console.error(e);
    }
}


function locationError (error) {
    console.log(error);
}