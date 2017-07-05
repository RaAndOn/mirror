function startTime () {
  var today = new Date();
  var h = today.getHours();
  var m = today.getMinutes();
  var s = today.getSeconds();
  m = checkTime(m);
  s = checkTime(s);
  $('#time > h1').text( h + ':' + m + ':' + s );
  checkMBTA();
  // Used THIS https://stackoverflow.com/questions/24359073/navigator-geolocation-getcurrentposition-do-not-work-in-firefox-30-0
  //To change geolocation
  if ( lastCheck != m ) {
    lastCheck = m;
    if ( navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(locationSuccess, locationError,{timeout:10000});
    }
    else {
      locationError ( "Your Browser Does Not Support Geolocations");
    }
  }
  $(document).ready(function(){
    $(window).resize(function(){
        $(".fullheight").height($(document).height());
    });
  });
  var t = setTimeout(startTime, 1000);
}

function checkTime (i) {
  if (i < 10) {i = '0' + i};  // add zero in front of numbers < 10
  return i;
}

function checkMBTA (){
  //$(document).ready( only makes the function available AND RUNS IT after the page is loaded ("ready")
  $(document).ready(function() {
    var stop_name;
    var url = 'http://realtime.mbta.com/developer/api/v2/predictionsbystop?api_key=wX9NwuHnZU2ToO7GmGR9uw&stop=place-davis&format=json';
    var json = $.getJSON(url, function(data) {
// Perform any placement of json data in html here.
      $("#station > h1").text(data.stop_name);
      var directions = sortDirections (data.mode[0].route[0].direction);
      var min_to_south = convertSecToMin( directions[0].trip[0].pre_away );
      var min_to_north = convertSecToMin( directions[1].trip[0].pre_away );
      $("#southbound > h1").text(directions[0].trip[0].trip_headsign);
      $("#southbound-eta > h1 ").text(min_to_south);
      $("#northbound > h1").text(directions[1].trip[0].trip_headsign);
      $("#northbound-eta > h1").text(min_to_north);
    });
  });
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
    var weatherCache = localStorage.weatherCache && JSON.parse( localStorage.weatherCache );
    var forecastCache = localStorage.forecastCache && JSON.parse( localStorage.forecastCache );
    
    var d = new Date();

    if ( weatherCache && weatherCache.timestamp && weatherCache.timestamp > d.getTime() - 1*60*1000 ) {
      var offset = d.getTimezoneOffset() * 60 * 1000;
      var current_weather = weatherCache.data;
      var forecast_weather = forecastCache.data;
      var current_temp = convertTemp(current_weather.main.temp);
      var current_icon_src = "/static/images/" + current_weather.weather[0].icon + ".png";
      var high_temp = current_weather.main.temp_max;
      var low_temp = current_weather.main.temp_min;
      var forecast_icon_src = [];
      for (var i = 0; i < forecastLength; i++) {
        forecast_icon_src.push("/static/images/" + forecast_weather.list[i].weather[0].icon + ".png");
        high_temp = Math.max( high_temp, forecast_weather.list[i].main.temp_max);
        low_temp = Math.min( low_temp, forecast_weather.list[i].main.temp_min);
      }
      high_temp = convertTemp( high_temp );
      low_temp = convertTemp( low_temp );
      //this commented out code is a how to iterate through the list of html
      // $.each (cache.data.list, function() {
      $(document).ready(function() {
        //"this" holds a forecast object
        // Get the local time of this forecast (the api returns it in utc)
        var localTime = new Date(this.dt*1000 - offset);
        $("#min-temp > h1").text(low_temp);
        $("#min-temp").css("height", currWeatherIconSize+"px");
        $("#max-temp > h1").text(high_temp);
        $("#max-temp").css("height", currWeatherIconSize+"px");
        $("#weather-icon-current").attr("src", current_icon_src).css("height", currWeatherIconSize+"px");
        $("img").filter("#forecast-icon").remove();
        for (var i = forecastLength-1; i >= 0; i--){
          $('#forecast-weather').prepend("<img src='"+forecast_icon_src[i]+"' class='img-responsive center-block' id='forecast-icon' style='width:"+forecastWeatherIconSize+"px')/>");
        }
      });

    }

    else{
      var weatherAPI = 'http://api.openweathermap.org/data/2.5/weather?lat='+position.coords.latitude+
                       '&lon='+position.coords.longitude+'&appid='+key;
      //The code below would provide a forecast return
      var forecastAPI = 'http://api.openweathermap.org/data/2.5/forecast?lat='+position.coords.latitude+
                       '&lon='+position.coords.longitude+'&appid='+key;

      $.getJSON(weatherAPI, function(response){
          // Store the cache
        localStorage.weatherCache = JSON.stringify({
          timestamp:(new Date()).getTime(),   // getTime() returns milliseconds
          data: response
        });
      });

      $.getJSON(forecastAPI, function(response){

          // Store the cache
        localStorage.forecastCache = JSON.stringify({
          timestamp:(new Date()).getTime(),   // getTime() returns milliseconds
          data: response
        });
        // Call the function again
        locationSuccess(position);
      });
      // Recurssive call MUST happen in the getJSON function.
      // If it is done outside the function the file breaks cause JavaScript can't do recursive calls
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

function convertTemp (tempK) {
  switch (DEG) {
    case 'f':
      return parseInt(tempK * 9/5 - 459.67).toString() + 'F';
      break;
    case 'c':
      return parseInt(tempK - 273.15).toString() + 'C';
      break;
    default:
      return tempK.toString() + 'K';
    }

}

function convertSecToMin (seconds) {
  var min = parseInt(seconds/60)
  switch ( min == 0 ) {
    case true: 
      return "Train Arriving";
      break;
    case false:
      return min.toString() + ' Min';
      break;
    default:
  }
}
