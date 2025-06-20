// 背景黑色线条 bynote.cn
(function () {
    function getAttr(el, attr, defaultValue) {
        return el.getAttribute(attr) || defaultValue;
    }

    function getTags(tag) {
        return document.getElementsByTagName(tag);
    }

    function getConfig() {
        var scripts = getTags("script");
        var lastScript = scripts[scripts.length - 1];
        return {
            l: scripts.length,
            z: getAttr(lastScript, "zIndex", -1),
            o: getAttr(lastScript, "opacity", 0.5),
            c: getAttr(lastScript, "color", "0,0,0"),
            n: getAttr(lastScript, "count", 99)
        };
    }

    function setCanvasSize() {
        width = canvas.width = window.innerWidth ||
            document.documentElement.clientWidth ||
            document.body.clientWidth;
        height = canvas.height = window.innerHeight ||
            document.documentElement.clientHeight ||
            document.body.clientHeight;
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);
        var allPoints = [mouse].concat(points);

        points.forEach(function (p) {
            p.x += p.xa;
            p.y += p.ya;
            p.xa *= (p.x > width || p.x < 0) ? -1 : 1;
            p.ya *= (p.y > height || p.y < 0) ? -1 : 1;
            ctx.fillRect(p.x - 0.5, p.y - 0.5, 1, 1);

            for (var v = 0; v < allPoints.length; v++) {
                var q = allPoints[v];
                if (p !== q && q.x !== null && q.y !== null) {
                    var dx = p.x - q.x;
                    var dy = p.y - q.y;
                    var dist = dx * dx + dy * dy;
                    if (dist < q.max) {
                        if (q === mouse && dist >= q.max / 2) {
                            p.x -= 0.03 * dx;
                            p.y -= 0.03 * dy;
                        }
                        var ratio = (q.max - dist) / q.max;
                        ctx.beginPath();
                        ctx.lineWidth = ratio / 2;
                        ctx.strokeStyle = "rgba(" + config.c + "," + (ratio + 0.2) + ")";
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(q.x, q.y);
                        ctx.stroke();
                    }
                }
            }
            allPoints.splice(allPoints.indexOf(p), 1);
        });

        animation(draw);
    }

    var canvas = document.createElement("canvas"),
        config = getConfig(),
        canvasId = "c_n" + config.l,
        ctx = canvas.getContext("2d"),
        width, height,
        animation = window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (fn) { window.setTimeout(fn, 1000 / 45); },
        random = Math.random,
        mouse = { x: null, y: null, max: 20000 };

    canvas.id = canvasId;
    canvas.style.cssText =
        "position:fixed;top:0;left:0;z-index:" + config.z + ";opacity:" + config.o;
    getTags("body")[0].appendChild(canvas);

    setCanvasSize();
    window.onresize = setCanvasSize;

    window.onmousemove = function (e) {
        e = e || window.event;
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    };
    window.onmouseout = function () {
        mouse.x = null;
        mouse.y = null;
    };

    var points = [];
    for (var i = 0; i < config.n; i++) {
        var x = random() * width,
            y = random() * height,
            xa = 2 * random() - 1,
            ya = 2 * random() - 1;
        points.push({ x: x, y: y, xa: xa, ya: ya, max: 6000 });
    }

    setTimeout(function () {
        draw();
    }, 100);
})();