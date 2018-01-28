var mode, steps, color;

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

var draw_canvas;

function save() {
    var image = draw_canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    var link = document.getElementById('link');
    link.setAttribute('download', 'AwfulPicture.png');
    link.setAttribute('href', image);
    link.click();
}

function init() {
    mode =  document.getElementById('modeSelect').options[document.getElementById('modeSelect').selectedIndex].value;
    steps = document.getElementById('stepsSelect').value;
    color = document.getElementById('colorpicker').value;
    var canvas = document.getElementById('view');
    var view = canvas.getContext('2d');
    var mX = 0;
    var mY = 0;
    var draw = false;
    var x, y, radius;

    canvas.onmousemove = mousemove;
    window.onresize = resize;
    canvas.onmousedown = function(e){
        dctx.beginPath();
        dctx.strokeStyle = color;
        dctx.fillStyle = color;
        dctx.moveTo(x, y);
        draw = true;
    }

    canvas.onmouseup = function(e){
        draw = false;
    }

    function mousemove(event) {
        mX = event.clientX;
        mY = event.clientY;
    }

    function resize(event) {
        canvas.height = window.innerHeight - 50;
        canvas.width = window.innerWidth - 4;
        m_canvas.width = canvas.width;
        m_canvas.height = canvas.height;
        draw_canvas.width = canvas.width;
        draw_canvas.height = canvas.height;
    }

    var m_canvas = document.createElement('canvas');
    var ctx = m_canvas.getContext('2d');
    draw_canvas = document.createElement('canvas');
    var dctx = draw_canvas.getContext('2d');
    resize();
    dctx.fillStyle = 'white';
    dctx.fillRect(0, 0, canvas.width, canvas.height);

    var phase = 0;

    function render() {
        //ctx.fillStyle = 'white';
        //ctx.fillRect(0, 0, canvas.width, canvas.height);
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
                x = mX + (Math.cos((phase % steps)/steps*2*3.14)*10);
                y = mY + (Math.sin((phase % steps)/steps*2*3.14)*10);
                radius = 1;
                break;
            case '2':
                let trad;
                let ttmp = phase % (steps * 4);
                if (ttmp < (steps * 2)) trad = ttmp;
                    else trad = (steps * 2) - (ttmp - (steps * 2));
                x = mX + (Math.cos((phase % steps)/steps*2*3.14)*trad);
                y = mY + (Math.sin((phase % steps)/steps*2*3.14)*trad);
                radius = 1;
                break;
        }

        let cctx;
        if (draw) {
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
        
        if (mode != 0)
            radius = radius * 2;
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