
/* グローバル関数の宣言 */

/*global google, $, window, d3 */
/*jslint browser:true, devel:true, this:true, for:true */
/*global google, d3, $ */

'use strict';

var blankScores = [],
    center,
    options,
    map,
    score,
    markers = [];

var lat_array = [];
var lng_array = [];
var window_open_array = [];
var obj = [];

var RADAR_CHART = {};

var formatData = [];
for(var i=0;i<4;i++){
    formatData[i] = new Array(6);
}

center = new google.maps.LatLng(35.5614174, 139.6928321);
options = {
    zoom: 10,
    center: center,
    mapTypeId: google.maps.MapTypeId.ROADMAP
};
map = new google.maps.Map($('#map').get(0), options);


/* 関数群の宣言 */

/* zoomの値から1pxあたり何mかを計算する */
function mpp(zoom){
    // 赤道の距離
    var equator = 40075334.2563;
    // 1ピクセルあたりの距離
    var one_pixel = equator / (256 * 2 ** zoom);
    return one_pixel;
}

function MarkerClear(){
    if(markers.length > 0){
        for(var i=0;i<markers.length; i++){
            markers[i].setMap();
        }
    }
};

function Find_1second_distance_by_LatLng(lat, lng){
    var lat0,lng0;
    var earthradius = 6378150;
    var circumference = 2 * Math.PI * earthradius;
    lat0 = circumference / (360 * 60 * 60);
    var lng0 = earthradius * Math.cos(lng / 180 * Math.PI) * 2 * Math.PI / (360 * 60 * 60)
    if(lng0 < 0){
        lng0 = lng0 * -1;
    }
}
function CreateIntersects(lat,lng,diff){
    var lat0 = parseInt(lat * 100000);
    var lng0 = parseInt(lng * 100000);
    var dis = diff;
    var sw = new google.maps.LatLng((lat0-dis) / 100000,(lng0+dis) / 100000);
    var ne = new google.maps.LatLng((lat0+dis) / 100000,(lng0-dis) / 100000);
    var latlngBounds = new google.maps.LatLngBounds(sw, ne);
    return latlngBounds;
}

function CheckNearPlace(spots,score,zoom){
    var flag;
    var latlngBounds1,latlngBounds2;
    for(var i=0;i<spots.length;i++){
        flag = false;
        latlngBounds1 = CreateIntersects(spots[i].lat, spots[i].lng,Find(spots[i].lat,spots[i].lng,zoom));
        for(var j=0;j<i;j++){
            latlngBounds2 = CreateIntersects(spots[j].lat, spots[i].lng,Find(spots[j].lat, spots[i].lng,zoom));
            if(latlngBounds1.intersects(latlngBounds2) == true){
                flag = true;
            }                
        }
        blankScores = formatData[i][score];
        markers[i] = RADAR_CHART.createMarker(spots[i], map);
        lat_array.push(spots[i].lat);
        lng_array.push(spots[i].lng);
        if(window_open_array[i] == 1){
            RADAR_CHART.attachSameInfoWindow(markers[i],spots[i]["name"], blankScores, i, flag);
        }
        Find(spots[i].lat, spots[i].lng);

    }

}
function Find(lat,lng,zoom){
    var lat0,lng0;
    var earthradius = 6378150;
    var circumference = 2 * Math.PI * earthradius;
    lat0 = circumference / (360 * 60 * 60);
    var lng0 = earthradius * Math.cos(lng / 180 * Math.PI) * 2 * Math.PI / (360 * 60 * 60)
    if(lng0 < 0){
        lng0 = lng0 * -1;
    }
    // 100pxでは何秒ずれるか
    var temp = mpp(zoom) * 100 / lat0;
    return temp;
}




/* RADAR_CHARTクラス */
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

RADAR_CHART.removeRadarchart = function(index){
    var svg = d3.select('#infodiv' + index).remove();
}

RADAR_CHART.createMarker = function (spot, map) {
    'use strict';
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(spot.lat, spot.lng),
        map: map
    });

    return marker;
};

RADAR_CHART.attachSameInfoWindow = function (marker, name, blankScores, index,same) {
    'use strict';

    var infoWindow = null;
    if(infoWindow == null){
            if(same == false){
              infoWindow = new google.maps.InfoWindow({
                  content:　name + '<div id="infodiv' + index + '"></div>'
                });
            } else {
                infoWindow = new google.maps.InfoWindow({
                    content:　name + '<div id="infodiv' + index + '"></div>',
                    pixelOffset: new google.maps.Size(-100 * index, 50 * index)
                });
            }
        }
    console.log(window_open_array);
    infoWindow.addListener('domready', function () {
        if(window_open_array[index] == 1){
          RADAR_CHART.radarChart(index, blankScores);
        }
    });
    infoWindow.open(map, marker)
    infoWindow.addListener('closeclick' , function(){
        window_open_array[index] = 0;
        infoWindow.close();
        console.log(window_open_array);
    });
        
    marker.addListener('click', function(){
        infoWindow.open(map, marker)
    })
};

/* メイン関数 */
/* get.JSON()の処理 */
$(document).ready(function(){
    $.getJSON("notes.json", function (spots) {
        var i;
        var isObject = function(o) {
            return (o instanceof Object && !(o instanceof Array)) ? true : false;
        };
        for(i=0; i<spots.length;i++){

            obj.push(spots[i]);
            window_open_array[i] = 1;
            var object = spots[i];
            var key01;
            var dataArray;
            var j;
            j=0;
            for(key01 in object){
                if (!isObject(object[key01])){
                } else {
                    var key02;
                    dataArray = [];
                    for( key02 in object[key01]){

                        dataArray.push(object[key01][key02]);
                    }
                    formatData[i][j] = dataArray;
                    j++;
                }
            }
        }
    });
});

/* デフォルトのビューを表示 */
$(window).load(function(){
    (function def() {
        var blankScores =[];
        score=5;
        for(var i=0;i<markers.length;i++){
            markers[i].setMap();
        };
        var zoom = map.getZoom();
        CheckNearPlace(obj, score,zoom);
        document.getElementById('content').innerHTML = '<p>項目: 総合平均</p><p>1:ゆたかな生き物</p><p>2:地域とのつながり</p><p>3:快適な水辺</p><p>4:水のきれいさ</p><p>5:自然のすがた</p>';
    }());    
});

/* イベントハンドラ */
map.addListener('zoom_changed', function(){
    if(markers.length > 0){
        var zoom = map.getZoom();
        MarkerClear();
        for(var i=0;i<lat_array.length;i++){
            RADAR_CHART.removeRadarchart(i);        
        }
    }
    CheckNearPlace(obj, score,zoom);
});