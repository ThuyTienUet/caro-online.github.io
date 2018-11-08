angular
    .module('airQuality')
    .controller('homeCtrl', homeCtrl);

function homeCtrl($sce, $scope, Map, $window) {

    $window.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: { lat: 21.036504, lng: 105.789661 }
    });

    let lat_end = 21.036824;
    let lng_end = 105.782065;
    let lat_start = 21.036504;
    let lng_start = 105.789661;
    let list = [];

    for (let i = 21.036504; i < 21.036824; i += 0.000020) {
        list.push({
            center: {
                lat: i
            }
        })
    }

    let j = 105.789661;
    for (let i = 0; i < list.length; i++) {
        list[i].center.lng = j;
        list[i].item1 = Math.floor(Math.random() * 101);
        list[i].size = 100;
        j -= 0.00050;
    }
    console.log(list);

    // let citymap = {
    //     dhqg: {
    //         center: { lat: 21.036815, lng: 105.781519 },
    //         population: 100,
    //         item1: 1,
    //         item2: 11,
    //         item3: 21
    //     },
    //     dhqg1: {
    //         center: { lat: 21.036796, lng: 105.782774 },
    //         population: 100,
    //         item1: 11,
    //         item2: 21,
    //         item3: 31
    //     }
    // };

    $scope.click = function (item) {
        items = document.getElementsByClassName("item");
        for (i = 0; i < items.length; i++) {
            items[i].className = items[i].className.replace(" active", "");
        }
        event.currentTarget.className += " active";
        let color;
        let tmp;
        for (let i in list) {
            if (item == 'item1') tmp = list[i].item1;
            else if (item == 'item2') tmp = list[i].item2;
            else tmp = list[i].item3;

            if (tmp < 21) color = '#0000FF';
            else if (tmp < 41) color = '#1E90FF';
            else if (tmp < 61) color = '#00BFFF';
            else if (tmp < 81) color = '#FF4500';
            else color = '#FF0000';

            var cityCircle = new google.maps.Circle({
                strokeOpacity: 1,
                strokeWeight: 0.5,
                fillColor: color,
                fillOpacity: 1,
                border: 1,
                map: map,
                center: list[i].center,
                radius: Math.sqrt(list[i].size) * 2
            });
            console.log(cityCircle);

        }

    }
}