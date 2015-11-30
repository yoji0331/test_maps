/*global google, $, window, d3 */
/*jslint browser:true, devel:true, this:true, for:true */
/*global google, d3, $ */

var RADAR_CHART = {};

RADAR_CHART.radarChart = function (scores) {
    'use strict';

    var w,
        h,
        padding,
        svg,
        dataset,
        paramCount,
        max,
        rScale,
        grid,
        label,
        line1;

    w = 200;
    h = 200;
    padding = 20;

    svg = d3.select('#infodiv')
        .append('svg')
        .attr('width', w)
        .attr('height', h);

    dataset = scores;

    paramCount = dataset.length;

    max = d3.max(dataset);

    console.log("aaa");
    
    rScale = d3.scale.linear()
        .domain([0, max])
        .range([0, w / 2 - padding]);

    grid = function () {
        var result = [],
            i,
            j,
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
    console.log("bbb");


    label = function () {
        var result = [],
            i;

        for (i = 0; i < paramCount; i += 1) {
            result.push(max + 1);
        }

        return result;
    };
    label();
    console.log("ccc");


    line1 = d3.svg.line()
        .x(function (d, i) {
            console.log("d=" + d);
            console.log("i=" + i);
            var lx =  rScale(d) * Math.cos(2 * Math.PI / paramCount * i - (Math.PI / 2)) + w / 2;
            console.log("lx=" + lx);
            return rScale(d) * Math.cos(2 * Math.PI / paramCount * i - (Math.PI / 2)) + w / 2;
        })
        .y(function (d, i) {
            var ly = rScale(d) * Math.sin(2 * Math.PI / paramCount * i - (Math.PI / 2)) + w / 2;
            console.log("ly=" + ly);
            return rScale(d) * Math.sin(2 * Math.PI / paramCount * i - (Math.PI / 2)) + w / 2;
        })
        .interpolate('linear');
    console.log("ddd");


    svg.selectAll('path')
        .data(dataset)
        .enter()
        .append('path')
        .attr('d', function (d) {
            console.log("d=" + d);
            console.log("line(d)=" + line1(d));
            return line1(d) + "z";
        })
        .attr("stroke", function (i) {
            return d3.scale.category10().range()[i];
        })
        .attr("stroke-width", 2)
        .attr('fill', 'none');
    console.log("eee");


    svg.selectAll("path.grid")
        .data(grid)
        .enter()
        .append("path")
        .attr("d", function (d) {
             console.log("d=" + d);
            console.log("line(d)=" + line1(d));
            return line1(d) + "z";
        })
        .attr("stroke", "black")
        .attr("stroke-dasharray", "2")
        .attr('fill', 'none');

    console.log("fff");

    svg.selectAll("text")
        .data(label)
        .enter()
        .append('text')
        .text(function (i) {
            return i + 1;
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
    console.log("ggg");

};

RADAR_CHART.createMarker = function (spot, map) {
    'use strict';

    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(spot.lat, spot.lng),
        map: map
    });

    return marker;
};

RADAR_CHART.attachInfoWindow = function (marker, name, blankScores) {
    'use strict';

    var infoWindow;

    google.maps.event.addListener(marker, 'click', function () {
        infoWindow = new google.maps.InfoWindow({
            content:　name + '<div id="infodiv"></div>'
        });
        infoWindow.open(marker.getMap(), marker);
        google.maps.event.addListener(infoWindow, 'domready', function () {
  //          console.log(blankScores);
            RADAR_CHART.radarChart(blankScores);
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

    center = new google.maps.LatLng(40.7845, 140.778);

    options = {
        zoom: 15,
        center: center,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map($('#map').get(0), options);

    $.getJSON("data.json", function (spots) {

        var i;
        for (i = 0; i < spots.length; i += 1) {
           // console.log(spots[i].name);
            blankScores = spots[i].scores;
            markers[i] = RADAR_CHART.createMarker(spots[i], map);
            RADAR_CHART.attachInfoWindow(markers[i], spots[i].name, blankScores);
        }
    });
});
