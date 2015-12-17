/*global google, $, window, d3 */
/*jslint browser:true, devel:true, this:true, for:true */
/*global google, d3, $ */

var RADAR_CHART = {};

RADAR_CHART.radarChart = function (index, scores) {
    'use strict';

    var w,
        h,
        padding,
        i,
        j,
        svg,
        dataset,
        paramCount,
        max,
        rScale,
        grid,
        label,
        line;

    w = 200;
    h = 200;
    padding = 30;

    svg = d3.select('#infodiv' + index)
        .append('svg')
        .attr('width', w)
        .attr('height', h);

    dataset = [scores];

    paramCount = dataset[0].length;

    // max = d3.max(d3.merge(dataset));
    max = 3;

    rScale = d3.scale.linear()
        .domain([0, max])
        .range([0, w / 2 - padding]);

    grid = function () {
        var result = [],
            arr;
        for (i = 1; i <= max; i += 1) {
            arr = [];
            for (j = 0; j < paramCount; j += 1) {
                arr.push(i);
            }
            result.push(arr);
        }
        return result;
    };
    grid();

    label = function () {
        var result = [];
        for (i = 0; i < paramCount; i += 1) {
            result.push(max + 1);
        }
        return result;
    };
    label();

    line = d3.svg.line()
        .x(function (d, i) {
            return rScale(d) * Math.cos(2 * Math.PI / paramCount * i - (Math.PI / 2)) + w / 2;
        })
        .y(function (d, i) {
            return rScale(d) * Math.sin(2 * Math.PI / paramCount * i - (Math.PI / 2)) + w / 2;
        })
        .interpolate('linear');

    svg.selectAll('path')
        .data(dataset)
        .enter()
        .append('path')
        .attr('d', function (d, i) {
            return line(d) + "z";
        })
        .attr("stroke", function (d, i) {
            return d3.scale.category10().range()[i];
        })
        .attr("stroke-width", 2)
        .attr('fill', 'none');

    svg.selectAll("path.grid")
        .data(grid)
        .enter()
        .append("path")
        .attr("d", function (d, i) {
            return line(d) + "z";
        })
        .attr("stroke", "black")
        .attr("stroke-dasharray", "2")
        .attr('fill', 'none');

    svg.selectAll("text")
        .data(label)
        .enter()
        .append('text')
        .text(function (i) {
            return i - 1;
        })
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr('x', function (d, i) {
            return rScale(d) * Math.cos(2 * Math.PI / paramCount * i - (Math.PI / 2)) + w / 2;
        })
        .attr('y', function (d, i) {
            return rScale(d) * Math.sin(2 * Math.PI / paramCount * i - (Math.PI / 2)) + w / 2;
        })
        .attr("font-size", "15px");
};

RADAR_CHART.createMarker = function (spot, map) {
    'use strict';
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(spot.lat, spot.lng),
        map: map
    });

    return marker;
};

RADAR_CHART.attachInfoWindow = function (marker, name, blankScores, index) {
    'use strict';

    var infoWindow = null;


    google.maps.event.addListener(marker, 'click', function () {
        if(infoWindow === null){
            infoWindow = new google.maps.InfoWindow({
                content:　name + '<div id="infodiv' + index + '"></div>'
            });
            infoWindow.open(marker.getMap(), marker);
            google.maps.event.addListener(infoWindow,'closeclick',function(){
                infoWindow = null;
                console.log(infoWindow);
            });
        }

        google.maps.event.addListener(infoWindow, 'domready', function () {
                RADAR_CHART.radarChart(index, blankScores);
            });
    });
    
};


$(document).ready(function () {
    'use strict';

    var blankScores = [],
        center,
        options,
        map,
        markers = [];

    center = new google.maps.LatLng(40.691153, 141.089492);

    options = {
        zoom: 13,
        center: center,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map($('#map').get(0), options);


    // サンプルデータ
    /*
    $.getJSON("data.json", function (spots) {

        var i;
        for (i = 0; i < spots.length; i += 1) {
            blankScores = spots[i].scores;
            markers[i] = RADAR_CHART.createMarker(spots[i], map);
            RADAR_CHART.attachInfoWindow(markers[i], spots[i].name, blankScores, i);
        }
    });
    */

    $.getJSON("notes.json", function (spots) {
        
        /*
        // for(.. in ,,) 
        // dataが[object object]となり
        // 値が取得できない 
        var i;
        var isObject = function(o) {
            return (o instanceof Object && !(o instanceof Array)) ? true : false;
        };
        for(i=0; i<spots.length;i++){
            var obj = spots[i];
            console.log(obj);
            var key;
            for(key in obj){
                console.log("---");
                console.log("key:" + key);
                if (!isObject(obj[key])){
                    console.log("data:" + obj[key]);
                } else {
                    var tmp;
                    for(tmp in obj[key]){
                        console.log("tmp:" + tmp);
                        console.log(obj[key][tmp]);
                    }
                }

            }
        }*/
        

        // 連想配列のキーを配列に入れる
        // 配列は作成できたが
        // マーカーが作成できない
        var i;
        var dataAll;
        for (i = 0; i < spots.length; i += 1) {
            dataAll = [];
            dataAll.push(spots[i]["自然のすがた"]["水の流れはゆたかですか？"]);
            dataAll.push(spots[i]["自然のすがた"]["岸のようすは自然らしいですか？"]);
            dataAll.push(spots[i]["自然のすがた"]["魚が川をさかのぼれるだろうか？"]);
           // console.log(dataAll);
            blankScores = dataAll;
            markers[i] = RADAR_CHART.createMarker(spots[i], map);
            RADAR_CHART.attachInfoWindow(markers[i], spots[i]["name"], blankScores, i);
            // console.log(spots[i]["name"]);
        }

    });
});

$("#a1").on('click', function(e) {
    alert("a1-alert");
    e.preventDefault();
});