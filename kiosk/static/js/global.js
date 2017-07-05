//global variables
var DEG = 'f'; // c for celsius, f for fahrenheit
var weatherDiv = $('#weather');
var scroller = $('#scroller');
var place = $('p.loc');
var key = '8978729d9a7d093a6b92470998e5cf1f';
var lastCheck = 0;
var forecastLength = 3;
var windowHeight = $(window).height();
var currWeatherIconSize = (windowHeight/4).toString();
var forecastWeatherIconSize = (windowHeight/4).toString();