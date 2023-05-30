var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');


function drawTriangle() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.moveTo(200, 0);
    ctx.lineTo(0, 400);
    ctx.lineTo(400, 200);
    ctx.closePath();
    ctx.stroke();

    drawCircle(200, 0, 10, "(0, 255, 137)"); // Вершина треугольника (200, 0)
    drawCircle(0, 400, 10, '(127, 0, 255)'); // Вершина треугольника (0, 400)
    drawCircle(400, 200, 10, '(254, 204, 2)'); // Вершина треугольника (400, 200)
}


function drawCircle(x, y, radius, color) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = "rgb" + `${color}`;
    ctx.fill();
    ctx.closePath();
}

function colorTriangle() {
    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var data = imageData.data;

    for (var y = 0; y < canvas.height; y++) {
        for (var x = 0; x < canvas.width; x++) {
            if (isPointInsideTriangle(x, y)) {
                var xK = { x: 0.635, y: 0.255, z: -388 / 600 };
                var yK = { x: -0.635, y: 0.51, z: 17 / 600 };
                var K = { x: 127, y: -204, z: -799 / 3 };
                var xResultVec = { x: xK.x * x, y: xK.y * x, z: xK.z * x };
                var yResultVec = { x: yK.x * y, y: yK.y * y, z: yK.z * y };
                var resultVec = { x: xResultVec.x - yResultVec.x - K.x, y: xResultVec.y - yResultVec.y - K.y, z: xResultVec.z - yResultVec.z - K.z };
                var pixelIndex = (y * canvas.width + x) * 4;
                data[pixelIndex] = resultVec.x;
                data[pixelIndex + 1] = resultVec.y;
                data[pixelIndex + 2] = resultVec.z;
                data[pixelIndex + 3] = 255; 
            }
        }
    }

    ctx.putImageData(imageData, 0, 0);
}

function isPointInsideTriangle(x, y) {
    var p0 = { x: 200, y: 0 };
    var p1 = { x: 0, y: 400 };
    var p2 = { x: 400, y: 200 };

    var dX = x - p2.x;
    var dY = y - p2.y;
    var dX21 = p2.x - p1.x;
    var dY12 = p1.y - p2.y;
    var D = dY12 * (p0.x - p2.x) + dX21 * (p0.y - p2.y);
    var s = dY12 * dX + dX21 * dY;
    var t = (p2.y - p0.y) * dX + (p0.x - p2.x) * dY;

    if (D < 0) {
        return s <= 0 && t <= 0 && s + t >= D;
    } else {
        return s >= 0 && t >= 0 && s + t <= D;
    }
}