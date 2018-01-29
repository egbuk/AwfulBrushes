var mode, steps, color, sRadius, pRadius;

function changemode(that) {
    mode = that.options[that.selectedIndex].value;
    return true;
}

function changesteps(that) {
    steps = that.value;
    return true;
}

function changecolor(that) {
    color = that.value;
    return true;
}

function changeradius(that) {
    sRadius = that.value;
}

function changePointRadius(that) {
    pRadius = that.value;
}

var draw_canvas;

function save() {
    var image = draw_canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    var link = document.getElementById('link');
    link.setAttribute('download', 'AwfulPicture.png');
    link.setAttribute('href', image);
    link.click();
}

var dctx;

function clearCanvas() {
    dctx.fillStyle = 'white';
    dctx.fillRect(0, 0, draw_canvas.width, draw_canvas.height);
}

function init() {
    mode =  document.getElementById('modeSelect').options[document.getElementById('modeSelect').selectedIndex].value;
    steps = document.getElementById('stepsSelect').value;
    color = document.getElementById('colorpicker').value;
    sRadius = document.getElementById('radiusSelect').value;
    pRadius = document.getElementById('pointRadiusSelect').value;
    var canvas = document.getElementById('view');
    var view = canvas.getContext('2d');
    var mX = 0;
    var mY = 0;
    var draw = false;
    var x, y, radius;

    canvas.onmousemove = mousemove;
    canvas.ontouchmove = touchmove;
    window.onresize = resize;
    canvas.onmousedown = drawStart;
    canvas.ontouchstart = drawStart;
    canvas.onmouseup = drawEnd;
    canvas.ontouchend = drawEnd;
    var firstMove = false;
    var newPosSet = false;

    function drawStart(e){
        dctx.beginPath();
        if (mode == '3') {
            dctx.strokeStyle = 'white';
            dctx.fillStyle = 'white';
        } else {
            dctx.strokeStyle = color;
            dctx.fillStyle = color;
        }
        draw = true;
        firstMove = true;
        newPosSet = false;
    }

    function drawEnd(e){
        draw = false;
        dctx.closePath();
    }

    function mousemove(event) {
        mX = event.clientX;
        mY = event.clientY;
        newPosSet = true;
    }

    function touchmove(event) {
        mX = event.touches[0].clientX;
        mY = event.touches[0].clientY;
        newPosSet = true;
    }

    function resize(event) {
        canvas.height = window.innerHeight - 50;
        canvas.width = window.innerWidth - 4;
        m_canvas.height = canvas.height;
        m_canvas.width = canvas.width;
        let tmpCanvas = document.createElement('canvas');
        var tctx = tmpCanvas.getContext('2d');
        tmpCanvas.height = draw_canvas.height;
        tmpCanvas.width = draw_canvas.width;
        tctx.drawImage(draw_canvas, 0, 0);
        draw_canvas.height = canvas.height;
        draw_canvas.width = canvas.width;
        dctx.fillStyle = 'white';
        dctx.fillRect(0, 0, canvas.width, canvas.height);
        dctx.drawImage(tmpCanvas, 0, 0);
    }

    var m_canvas = document.createElement('canvas');
    var ctx = m_canvas.getContext('2d');
    draw_canvas = document.createElement('canvas');
    dctx = draw_canvas.getContext('2d');
    resize();

    var phase = 0;
    var rPhase = 0;

    function render() {
        ctx.drawImage(draw_canvas, 0, 0);

        phase++;
        switch (mode) {
            case '0':
                x = mX;
                y = mY;
                let tmp = phase % (steps * 2);
                if (tmp < steps) radius = tmp;
                    else radius = steps - (tmp - steps);
                break;
            case '1':
                x = mX + (Math.cos((phase % steps)/steps*2*3.14)*sRadius);
                y = mY + (Math.sin((phase % steps)/steps*2*3.14)*sRadius);
                radius = pRadius;
                break;
            case '2':
                rPhase++;
                let trad;
                let ttmp = rPhase % (sRadius * 2);
                if (ttmp < (sRadius)) trad = ttmp;
                    else trad = sRadius - (ttmp - (sRadius));
                x = mX + (Math.cos((phase % steps)/steps*2*3.14)*trad);
                y = mY + (Math.sin((phase % steps)/steps*2*3.14)*trad);
                radius = pRadius;
                break;
            case '3':
                x = mX;
                y = mY;
                radius = pRadius;
                break;
        }

        if (firstMove && newPosSet) {
            dctx.moveTo(x, y);
            firstMove = false;
            newPosSet = false;
        }

        let cctx;
        if (draw && (!firstMove)) {
            dctx.lineWidth = radius * 2;
            dctx.lineTo(x, y);
            dctx.stroke();
            dctx.beginPath();
            dctx.arc(x, y, radius, 0, 2 * Math.PI, false);
            dctx.fill();
            dctx.beginPath();
            dctx.moveTo(x, y);
            dctx.lineWidth = radius;
        }
        
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'black';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(mX, mY, 3, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'red';
        ctx.fill();

        view.drawImage(m_canvas, 0, 0);
        requestAnimationFrame(render);
    }

    render();
    return true;
}