/********************************************************************************/
var audio = new Audio("./mp3/nice.mp3");
var source;
audio.controls = true;
audio.loop = false;
audio.autoplay = false;

var canvas, ctx, source, context, analyser, fbc_array, bufferLength, bar_x,
        bar_width, bar_height,javascriptNode,analyser2,frameCount,sourceNode,
        splitter,fbc_array2,waveArray,waveArray2,ctx1,ctx2;
        
function initMp3Player(){
    canvas = $("#analyser_render").get()[0];
    ctx = canvas.getContext('2d');
    ctx1 = $("#wave1").get()[0].getContext('2d');
    ctx2 = $("#wave2").get()[0].getContext('2d');
    
    $('#audio_box').append(audio);
    context = new AudioContext();
    analyser = context.createAnalyser();
    analyser.fftSize = 512;
    analyser2 = context.createAnalyser();
    analyser2.fftSize = 512;
    
    source = context.createMediaElementSource(audio);
    splitter = context.createChannelSplitter(2);
    source.connect(splitter);
    
    splitter.connect(analyser,0,0);
    splitter.connect(analyser2,1,0);
    
    source.connect(context.destination);
    
    fbc_array = new Uint8Array(analyser.frequencyBinCount);
    waveArray = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(fbc_array);
    analyser.getByteTimeDomainData(waveArray);
    
    fbc_array2 =  new Uint8Array(analyser2.frequencyBinCount);
    waveArray2 = new Uint8Array(analyser2.frequencyBinCount);
    analyser2.getByteFrequencyData(fbc_array2);
    analyser2.getByteTimeDomainData(waveArray2);
    frameLooper();
}

function frameLooper(){
    window.requestAnimationFrame(frameLooper);
    analyser.getByteFrequencyData(fbc_array);
    analyser.getByteTimeDomainData(waveArray);
    analyser2.getByteFrequencyData(fbc_array2);
    analyser2.getByteTimeDomainData(waveArray2);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx1.clearRect(0, 0, canvas.width, 300);
    ctx2.clearRect(0, 0, canvas.width, 300);
    bufferLength = 1024;

    ctx1.lineWidth = 2;
    ctx1.strokeStyle = 'rgb(255,255,255)';
    ctx1.beginPath();
    ctx2.lineWidth = 2;
    ctx2.strokeStyle = 'rgb(255,255,255)';
    ctx2.beginPath();
        
    for( var i = 0; i < bufferLength; i++ ){
        var hue = i*2;
        ctx.fillStyle = "hsl("+hue+",100%,30%)";
        ctx.fillRect(i*4,299,4,-fbc_array[i]);
        ctx.fillRect(i*4,301,4,fbc_array2[i]);
        if( i === 0 ) {
            ctx1.moveTo(0,waveArray[i]+22);
            ctx2.moveTo(0,waveArray2[i]+22);
        }else{
            ctx1.lineTo(i*4,waveArray[i]+22);
            ctx2.lineTo(i*4,waveArray2[i]+22);
        }
    }
    ctx1.stroke();
    ctx2.stroke();
}
$(document).ready(initMp3Player);
/********************************************************************************/