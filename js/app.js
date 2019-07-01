window.onload = function(){
    init();
}


function init(){
    app = document.getElementById('app');
    game = app.getContext('2d');
    setInterval(loop, 1000/60);
}

function loop(){

}

