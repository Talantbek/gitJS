var Stage = acgraph.create("container");
var Layer = Stage.layer();

var arrayY = [0];
var x = 0; 

// ENTER    
$(document).keypress(function (e) {
    if (e.which == 13) {
            if (document.getElementById("clearButton") == document.activeElement) document.getElementById("clearButton").click(); 
            else if (document.getElementById("addButton") !== document.activeElement) document.getElementById("addButton").click(); 
    }
});

// Очистить
function clearButt() {
    arrayY.splice(1, x);
    x = 0;
    yInput.focus();
    Layer.removeChildren();
    yInput.value = null;
}

// Добавить
function addButt() {
    var y = yInput.value;
    if (y == '') {
        yInput.value = null;
        alert('Введите значение оси Y по одному'); 
    } 
    else {
        arrayY.push(y);
        x++;
        yInput.value = null;
        startXY();
    }
    yInput.focus();
}

// Действия при изменении размера окна
$(window).resize(function(){
    startXY();
  }); 

// Построение графика
startXY = function(){
    var maxY = Math.max.apply(null, arrayY);
    var minY = Math.min.apply(null, arrayY);
    var maxX = x;
    var minX = 0;

    var stepOY;
    minY < 0 ? stepOY = 1 - minY : stepOY = 1;

    var minMaxX = maxX-minX+2;
    var minMaxY = maxY-minY+2;
    var width = document.getElementById('container').offsetWidth;
    var height = document.getElementById('container').offsetHeight;
    var widthStep = parseInt(width/minMaxX);
    var heightStep = parseInt(height/minMaxY);
    document.body.style.backgroundSize = widthStep+'px'+' '+heightStep+'px';
    Layer.removeChildren();
    for (var j=0; j<arrayY.length; j++) {
        xy(j, arrayY[j], j+1, arrayY[j+1],minY, minMaxX, minMaxY, widthStep, heightStep, height);
    };
    xoy(width, height, widthStep, heightStep, stepOY, maxX, maxY, minY);
}

// Прорисовка графика
xy = function(xo, yo, xl, yl, minY, minMaxX, minMaxY, widthStep, heightStep, height) {
    var x1 = (xo+1)*widthStep;
    var y1 = ((height - yo*heightStep)+minY*heightStep)-heightStep;
    var x2 = (xl+1)*widthStep;
    var y2 = ((height - yl*heightStep)+minY*heightStep)-heightStep;
    var lineXY = Layer.path();   
    lineXY.moveTo(x1, y1);
    lineXY.lineTo(x2, y2);
    var pointXY = Layer.circle(x2, y2, 3);
    pointXY.fill('blue');
    // lineXY.curveTo(xo*(width/mm), , x*(width/mm), ,x*(width/mm), (height - y*(height/mm))+min*(height/mm));
}

// Прорисовка оси коордиат
xoy = function(width, height, widthStep, heightStep, stepOY, maxX, maxY, minY) {
    var lineOY = Layer.path();   
    lineOY.moveTo(widthStep, 0);
    lineOY.lineTo(widthStep, height);

    var lineOX = Layer.path();   
    lineOX.moveTo(0, height - heightStep*stepOY);
    lineOX.lineTo(width, height - heightStep*stepOY);

    var minStep = Math.min(widthStep, heightStep);
    if (minStep/2 > 25) sizeText = 25;
    else if (minStep/2 < 10) sizeText = 10;
    else sizeText = minStep/2;

    var text0 = Layer.text(widthStep-sizeText,height-heightStep*stepOY, "O");
    text0.fontSize(sizeText+'px');
    var textX = Layer.text(width-sizeText,height-heightStep*stepOY, "X");
    textX.fontSize(sizeText+'px');
    var textY = Layer.text(widthStep-sizeText,0, "Y");
    textY.fontSize(sizeText+'px');
    
    var textXmax = Layer.text((maxX+1)*widthStep, height-heightStep*stepOY, maxX);
    textXmax.fontSize(sizeText+'px');
    textXmax.color("blue");
    var textYmax = Layer.text(widthStep-sizeText, height-((maxY+1)*heightStep)+minY*heightStep, maxY);
    textYmax.fontSize(sizeText+'px');
    textYmax.color("blue");
    if (minY<0){
    var textYmin = Layer.text(widthStep-sizeText, height-heightStep, minY);
    textYmin.fontSize(sizeText+'px');
    textYmin.color("blue");
    };
}