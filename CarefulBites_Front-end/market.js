//$("pos_button").click(function () {
//   $.post("demo_test.asp", function (data, status) {
//       alert("Data: " + data + "\nStatus: " + status);
//   });
//});
let map = undefined;
let map_latitude = 0;
let map_longitude = 0;
let marker, circle, zoomed;
let accuracy = 0;

/*
var closebtns = document.getElementsByClassName("close");
var i;

for (i = 0; i < closebtns.length; i++) {
    closebtns[i].addEventListener("click", function () {
        this.parentElement.style.display = 'none';
    });
}
*/

main_fun = function () {
    const selectElement = document.getElementById('map');
    //const map_cord = selectElement.getElementsByClassName('.leaflet-map-pane');
    map = L.map('map');
    let temp_lat = 0;
    let temp_lon = 0;
    //map.on('moveend', function (e) {
    //   let bounds = map.getBounds();
    //    console.log(bounds);
    //});
    map.addEventListener('mousemove', function (ev) {
        temp_lat = ev.latlng.lat;
        temp_lon = ev.latlng.lng;

    });
    selectElement.addEventListener("contextmenu", function (event) {
        // Prevent the browser's context menu from appearing
        event.preventDefault();
        document.getElementById("fLat").innerHTML = temp_lat;
        document.getElementById("lLong").innerHTML = temp_lon;
        // Add marker
        // L.marker([lat, lng], ....).addTo(map);
        //alert(lat + ' - ' + lng);
        map_latitude = temp_lat;
        map_longitude = temp_lon;
        SetTo();


        return false; // To disable default popup.
    });

    // Initializes map
    // Sets initial coordinates and zoom level
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    // Sets map data source and associates with map

    let location_test = sessionStorage.getItem("location_update");

    if (location_test == null || location_test != undefined) {
        map.setView([51.505, -0.09], 13);
        navigator.geolocation.watchPosition(success, error);
    } else {
        let cord_data = location_test.split(";")
        map_latitude = cord_data[0];
        map_longitude = cord_data[1];

        accuracy = cord_data[2];

        SetTo();
    }

}
function success(pos) {

    accuracy = pos.coords.accuracy;
    map_latitude = pos.coords.latitude;
    map_longitude = pos.coords.longitude;
    // Set map focus to current user position
    SetTo();
    document.getElementById("pos_button").disabled = false;
}
function error(err) {
    if (err.code === 1) {
        alert("Please allow geolocation access");
    } else {
        alert("Cannot get current location");
    }
}

function GoTo() {

    map.setView([map_latitude, map_longitude], 13);


}
function FindLocation() {

    navigator.geolocation.watchPosition(success, error);
    document.getElementById("pos_button").disabled = true;

}
function SetTo() {
    update_col()
    if (marker) {
        map.removeLayer(marker);
        map.removeLayer(circle);
    }
    // Removes any existing marker and circule (new ones about to be set)
    marker = L.marker([map_latitude, map_longitude]).addTo(map);
    circle = L.circle([map_latitude, map_longitude], { radius: accuracy }).addTo(map);
    // Adds marker to the map and a circle for accuracy
    if (!zoomed) {
        zoomed = map.fitBounds(circle.getBounds());
    }
    // Set zoom to boundaries of accuracy circle
    map.setView([map_latitude, map_longitude], accuracy);
    document.getElementById("fLat").innerHTML = map_latitude;
    document.getElementById("lLong").innerHTML = map_longitude;
    sessionStorage.setItem("location_update", map_latitude + ";" + map_longitude + "," + accuracy);

    fetch("https://nominatim.openstreetmap.org/search.php?q=" + map_latitude + "," + map_longitude + "&polygon_geojson=1&format=json")
        .then(response => response.json())
        .then(j => {
            document.getElementById("adress").innerHTML = j[0].display_name;
        })
}
function Save() {

    fetch("https://nominatim.openstreetmap.org/search.php?q=" + map_latitude + "," + map_longitude + "&polygon_geojson=1&format=json")
        .then(response => response.json())
        .then(j => {
            let adress_data = j[0].display_name;
            let user = document.getElementById("f_user").value;
            let date_a = document.getElementById("f_date").value;
            let date_b = document.getElementById("f_date_until").value;
            let items = document.getElementById("f_browser").value;
            let amount = document.getElementById("f_amount").value;
            let output_data = user + "," + date_a + "," + date_b + "," + items + "," + "," + items + adress_data;

            document.getElementById("data_output").innerHTML = output_data;
        })
}
update_col = function () {
    color = sessionStorage.getItem("userinfo")
    if (color == "chocolate") {

        let all_p = document.querySelectorAll(".col_change");
        all_p.forEach(p => {
            p.style.color = "#ffffff";
        });
    }
    if (color == "milk") {

        let all_p = document.querySelectorAll(".col_change");
        all_p.forEach(p => {
            p.style.color = "#000000";
        });
    }
}