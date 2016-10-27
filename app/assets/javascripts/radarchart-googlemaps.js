/*global google, $, window, d3 */
/*jslint browser:true, devel:true, this:true, for:true */
/*global google, d3, $ */

var RADAR_CHART = {};

var formatData = [];
for(var i=0;i<4;i++){
    formatData[i] = new Array(6);
}



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

    var k, axis =[], dataAxis;
    if(scores.length % 2 == 0){
        for (k=0;k < scores.length;k++){
            axis.push(0);    
            axis.push(3);    
            axis.push(0); 
        }   
    } else {
        for (k=0;k < scores.length;k++){
            axis.push(0);    
            axis.push(3);    
        }
    }
    

    dataAxis = [axis];
    




    paramCount = dataset[0].length;

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


    label  = (function(){
        var result = [];
        for(var i=0; i<paramCount; i++){
          result.push(max + 1);
        }
        return result;
      })();

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
        .attr('fill', '#1f77b4');

    svg.selectAll('path.axis')
        .data(dataAxis)
        .enter()
        .append('path')
        .attr('d', function (d,i) {
            return line(d) + "z";
        })
        .attr("stroke", "black")
        .attr("stroke-width", "2")
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
     .text(function(d, i){ return i+1; })
     .attr("text-anchor", "middle")
     .attr("dominant-baseline", "middle")
     .attr('x', function(d, i){ return rScale(d) * Math.cos(2 * Math.PI / paramCount * i - (Math.PI / 2)) + w/2; })
     .attr('y', function(d, i){ return rScale(d) * Math.sin(2 * Math.PI / paramCount * i - (Math.PI / 2)) + w/2; })
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
    function attachInfoWindow(){
        if(infoWindow === null){
            infoWindow = new google.maps.InfoWindow({
                content:　name + '<div id="infodiv' + index + '"></div>'
            });
            infoWindow.open(marker.getMap(), marker);
            google.maps.event.addListener(infoWindow,'closeclick',function(){
                infoWindow = null;
            });
        }
        google.maps.event.addListener(infoWindow, 'domready', function () {
                RADAR_CHART.radarChart(index, blankScores);
        });
    }

    attachInfoWindow();

    google.maps.event.addListener(marker, 'click', function () {
        attachInfoWindow();
    });
};


$(document).ready(function () {
    'use strict';

    var blankScores = [],
        center,
        options,
        map,
        markers = [];


    center = new google.maps.LatLng(35.5614174, 139.6928321);

    options = {
        zoom: 13,
        center: center,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map($('#map').get(0), options);

    $.getJSON("notes.json", function (spots) {
        var i;
        var isObject = function(o) {
            return (o instanceof Object && !(o instanceof Array)) ? true : false;
        };
        for(i=0; i<spots.length;i++){
            var obj = spots[i];
            var key01;
            var dataArray;
            var j;
            j=0;
            for(key01 in obj){
                if (!isObject(obj[key01])){
                } else {
                    var key02;
                    dataArray = [];
                    for( key02 in obj[key01]){
                        dataArray.push(obj[key01][key02]);
                    }
                    formatData[i][j] = dataArray;
                    j++;
                }
            }
        }
    });
});


// 自然のすがた
// formatData[][0]
$("#a0").on('click', function(e) {
    var blankScores =[];
    markers =[];
    center = new google.maps.LatLng(35.5614174, 139.6928321);

    options = {
        zoom: 13,
        center: center,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map($('#map').get(0), options);

    $.getJSON("notes.json", function(spots) {
        for (var i=0;i<spots.length; i++){
            blankScores = formatData[i][0];
            markers[i] = RADAR_CHART.createMarker(spots[i], map);
            RADAR_CHART.attachInfoWindow(markers[i],spots[i]["name"], blankScores, i);
        }
    });
    document.getElementById('content').innerHTML = '<p>項目: 自然のすがた</p><p>1:岸のようすは自然らしいですか？</p><p>2:水の流れはゆたかですか？</p><p>3:魚が川をさかのぼれるだろうか？</p>';
 
    e.preventDefault();
});

// ゆたかな生き物
// formatData[][1]
$("#a1").on('click', function(e) {
    var blankScores =[];
    markers =[];
    center = new google.maps.LatLng(35.5614174, 139.6928321);

    options = {
        zoom: 13,
        center: center,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map($('#map').get(0), options);

    $.getJSON("notes.json", function(spots) {
        for (var i=0;i<spots.length; i++){
            blankScores = formatData[i][1];
            markers[i] = RADAR_CHART.createMarker(spots[i], map);
            RADAR_CHART.attachInfoWindow(markers[i],spots[i]["name"], blankScores, i);
        }
    });
    document.getElementById('content').innerHTML = '<p>項目: ゆたかな生き物</p><p>1:海底に生き物がいますか？</p><p>2:河原と水辺に植物が生えていますか？</p><p>3:魚がいますか？</p><p>4:鳥はいますか？</p>';

    e.preventDefault();
});

// 水のきれいさ
// formatData[][2]
$("#a2").on('click', function(e) {
    var blankScores =[];
    markers =[];
    center = new google.maps.LatLng(35.5614174, 139.6928321);

    options = {
        zoom: 13,
        center: center,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map($('#map').get(0), options);

    $.getJSON("notes.json", function(spots) {
        for (var i=0;i<spots.length; i++){
            blankScores = formatData[i][2];
            markers[i] = RADAR_CHART.createMarker(spots[i], map);
            RADAR_CHART.attachInfoWindow(markers[i],spots[i]["name"], blankScores, i);
        }
    });
    document.getElementById('content').innerHTML = '<p>項目: 水のきれいさ</p><p>1:水はきれいですか？</p><p>2:水はくさくないですか？</p><p>3:水は透明ですか？</p>';

    e.preventDefault();
});

// 快適な水辺
// formatData[][3]
$("#a3").on('click', function(e) {
    var blankScores =[];
    markers =[];
    center = new google.maps.LatLng(35.5614174, 139.6928321);

    options = {
        zoom: 13,
        center: center,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map($('#map').get(0), options);

    $.getJSON("notes.json", function(spots) {
        for (var i=0;i<spots.length; i++){
            blankScores = formatData[i][3];
            markers[i] = RADAR_CHART.createMarker(spots[i], map);
            RADAR_CHART.attachInfoWindow(markers[i],spots[i]["name"], blankScores, i);
        }
    });
    document.getElementById('content').innerHTML = '<p>項目: 快適な水辺</p><p>1:ごみが目につきますか？</p><p>2:どんなにおいを感じますか？</p><p>3:どんな音が聞こえますか？</p><p>4:川やまわりの景色は美しいですか？</p><p>5:水にふれてみたいですか？</p>';

    e.preventDefault();
});

// 地域とのつながり
// formatData[][4]
$("#a4").on('click', function(e) {
    var blankScores =[];
    markers =[];
    center = new google.maps.LatLng(35.5614174, 139.6928321);

    options = {
        zoom: 13,
        center: center,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map($('#map').get(0), options);

    $.getJSON("notes.json", function(spots) {
        for (var i=0;i<spots.length; i++){
            blankScores = formatData[i][4];
            markers[i] = RADAR_CHART.createMarker(spots[i], map);
            RADAR_CHART.attachInfoWindow(markers[i],spots[i]["name"], blankScores, i);
        }
    });
    document.getElementById('content').innerHTML = '<p>項目: 地域とのつながり</p><p>1:多くの人が利用していますか？</p><p>2:川にまつわる話を聞いたことがありますか？</p><p>3:水辺に近づきやすいですか？</p><p>4:環境の活動</p><p>5:産業などの活動</p>';

    e.preventDefault();
});

// 総合平均
// formatData[][5]
$("#a5").on('click', function(e) {
    var blankScores =[];
    markers =[];
    center = new google.maps.LatLng(35.5614174, 139.6928321);

    options = {
        zoom: 13,
        center: center,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map($('#map').get(0), options);

    $.getJSON("notes.json", function(spots) {
        /* 同地点を判別する*/
        CheckSamePlace(spots);
        for (var i=0;i<spots.length; i++){
            blankScores = formatData[i][5];
            markers[i] = RADAR_CHART.createMarker(spots[i], map);
            RADAR_CHART.attachInfoWindow(markers[i],spots[i]["name"], blankScores, i);
        }
    });
    document.getElementById('content').innerHTML = '<p>項目: 総合平均</p><p>1:ゆたかな生き物</p><p>2:地域とのつながり</p><p>3:快適な水辺</p><p>4:水のきれいさ</p><p>5:自然のすがた</p>';
    e.preventDefault();
});

/* 同地点を判別する関数 */
function CheckSamePlace(spots){
    for(var i=0;i<spots.length;i++){
        for(var j=spots.length-1;j>i;j--){
            if(spots[i].lat == spots[j].lat && spots[i].lng == spots[j].lng){
                console.log(spots[i].name + 'と' + spots[j].name + 'は同じ緯度経度です');
                console.log('i='+i,'j='+j);
            }
        }
    }
}