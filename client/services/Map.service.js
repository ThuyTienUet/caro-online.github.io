angular
    .module('airQuality')
    .service('Map', map);

function map () {
    var init = function () {
        var MapOptions = {
            center: new google.maps.LatLng(21.0423793, 105.7791938),
            zoom: 16,
            // disableDefaultUI: true,
            // draggable: true,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
        };
        this.map = new google.maps.Map(document.getElementById("map"), MapOptions);
        this.places = new google.maps.places.PlacesService(this.map);
    }
    return {
        init: init
    }
}