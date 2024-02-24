var canvas,
    ctx,
    source,
    context,
    analyser,
    fbc_array,
    bar_count,
    bar_pos,
    bar_width,
    bar_height;

var audio = new Audio();

audio.id = "audio_player";
audio.src = "mp3/test.mp3";
audio.controls = true;
audio.loop = true;
audio.autoplay = true;

window.addEventListener(
    "load",
    function () {
        document.getElementById("audio").appendChild(audio);

        document.getElementById("audio_player").onplay = function () {
            if (typeof (context) === "undefined") {
                context = new AudioContext();
                analyser = context.createAnalyser();
                canvas = document.getElementById("canvas");
                ctx = canvas.getContext("2d");
                source = context.createMediaElementSource(audio);

                canvas.width = window.innerWidth * 0.80;
                canvas.height = window.innerHeight * 0.60;

                source.connect(analyser);
                analyser.connect(context.destination);
            }

            FrameLooper();
        };
    },
    false
);

function FrameLooper() {
    window.RequestAnimationFrame =
        window.requestAnimationFrame(FrameLooper) ||
        window.msRequestAnimationFrame(FrameLooper) ||
        window.mozRequestAnimationFrame(FrameLooper) ||
        window.webkitRequestAnimationFrame(FrameLooper);

    fbc_array = new Uint8Array(analyser.frequencyBinCount);
    bar_count = window.innerWidth / 2;

    analyser.getByteFrequencyData(fbc_array);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "";

    for (var i = 0; i < bar_count; i++) {
        bar_pos = i * 4;
        bar_width = 2;
        bar_height = -(fbc_array[i] / 2);
        ctx.fillStyle = (fbc_array[i] <= 18) ? '#ffffff' : '#f56f52'
        bitValue = fbc_array[i];
        switch (true) {
            case bitValue < 10: ctx.fillStyle = '#ffffff';break;
            case bitValue >= 10 && bitValue < 30: ctx.fillStyle = '#3cd129';break;
            case bitValue >= 30 && bitValue < 50: ctx.fillStyle = '#0da1b8';break;
            case bitValue >= 50 && bitValue < 70: ctx.fillStyle = '#1709bb';break;
            case bitValue >= 70 && bitValue < 100: ctx.fillStyle = '#940fb6';break;
            case bitValue >= 100: ctx.fillStyle = '#c30606';break;
        }
        ctx.fillRect(bar_pos, canvas.height, bar_width, bar_height);
    }
}
