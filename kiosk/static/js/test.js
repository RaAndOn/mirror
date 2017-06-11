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
    var t = setTimeout(startTime, 1000);
}
function checkTime (i) {
    if (i < 10) {i = '0' + i};  // add zero in front of numbers < 10
    return i;
}
function checkMBTA (){
    $(document).ready(function() {
        console.log( 'ready!' );
        var stop_name;
        var url = 'http://realtime.mbta.com/developer/api/v2/predictionsbystop?api_key=wX9NwuHnZU2ToO7GmGR9uw&stop=place-davis&format=json';
        var json = $.getJSON(url, function(data) {
// Perform any placement of json data in html here.
            document.getElementById('train').innerHTML = data.stop_name;
            var directions = sortDirections (data.mode[0].route[0].direction);
            console.log(directions[1].trip[0].pre_away)
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