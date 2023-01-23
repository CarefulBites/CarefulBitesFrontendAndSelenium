
let map = undefined;
let map_latitude = 0;
let map_longitude = 0;
let marker, circle, zoomed;
let accuracy = 0;



main_fun = function () {
    // Sets map data source and associates with map
    const selectElement = document.getElementById('map');

    map = L.map('map');
    let temp_lat = 0;
    let temp_lon = 0;

    map.addEventListener('mousemove', function (ev) {
        temp_lat = ev.latlng.lat;
        temp_lon = ev.latlng.lng;

    });
    selectElement.addEventListener("contextmenu", function (event) {
        // Prevent the browser's context menu from appearing
        event.preventDefault();
        document.getElementById("fLat").innerHTML = temp_lat;
        document.getElementById("lLong").innerHTML = temp_lon;

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

    let location_test = sessionStorage.getItem("location_update");

    if (location_test == null || location_test == undefined) {

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
    //clear map
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
            let date_a = document.getElementById("f_date").value;
            let date_b = document.getElementById("f_date_until").value;
            let food_item = document.getElementById("f_browser").value;
            let amount = document.getElementById("f_amount").value;
            //let output_data = date_a + "," + date_b + "," + items + "," + "," + items + adress_data;
            let user = sessionStorage.getItem("CurrentUser");
            let output_data = user + ";" + amount + ";" + food_item + ";" + map_latitude + "," + map_longitude

            sessionStorage.setItem("data_output", output_data)
            GiveAways();
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


function Giveaway_click(val) {
    let data = val.split(",");
    map_latitude = data[0];
    map_longitude = data[1];
    SetTo();
}

function GiveAways() {

    let name_data = [["Adele", "1", "Cheese", "red", "55.6498944,12.461670482"], ["Jonatan", "2", "Egg", "green", "55.737852481384074,12.02612400054931838"], ["Billy", "1", "salad", "green", "55.6536118142508,11.868837453902158"], ["Calvin", "1", "beef", "yellow", "55.65478232088006,12.294387817382812"], ["Bob", "1", "chees", "red", "55.65478232088006,12.294387817382812"], ["Cindy", "4", "tomato", "yellow", "55.65478232088006,12.294387817382812"]];
    let new_givaway_data = sessionStorage.getItem("data_output")
    console.log(new_givaway_data)
    if (new_givaway_data != undefined && new_givaway_data != null) {
        new_givaway = new_givaway_data.split(";");
        name_data.unshift([new_givaway[0], new_givaway[1], new_givaway[2], "green", new_givaway[3]]);
    } else {
        //mayb temporay as map need only reaload when data_output is not set

    }
    const GiveAwaysList_div = document.getElementById("give_aways");
    GiveAwaysList_div.innerHTML = "";
    let box;
    for (let index = 0; index < name_data.length; index++) {
        let element = name_data[index];

        let p = element[0] + " " + element[1] + " " + element[2];
        let coler = element[3];
        box = document.createElement("li");
        box.classList.add('col_' + coler);
        box.onclick = "Giveaway_click()";
        box.innerHTML = "<a onclick=\"Giveaway_click(\' " + element[4] + "\')\" href=\"javascript:void(0);\">" + p + "<span class=\"choose\">&raquo;</span></a>";

        GiveAwaysList_div.appendChild(box);
    }
}
update_col()
GiveAways();


