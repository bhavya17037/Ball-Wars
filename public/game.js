var socket;

var playerX = 300;
var playerY = 300;

var enemyX = 300;
var enemyY = 300;

var player_score = 0;
var enemy_score = 0;

var playerName;
var enemyName;

var a1;
var a2;

var num = 0;

var pbullets = {};
var ebullets = {};

function setup(){
    createCanvas(600,600);
    background(0);
    playerName = createDiv('You');
    enemyName = createDiv('Enemy');
    YourScore = createDiv('Your Score: ' + player_score);
    EnemyScore = createDiv("Enemy's Score: " + enemy_score);
    YourScore.position(30,40);
    EnemyScore.position(500,40);
    YourScore.style('color','white');
    EnemyScore.style('color','red');
    playerName.position(playerX,playerY - 30);
    enemyName.position(enemyX,enemyY - 30);
    playerName.style('color','white');
    enemyName.style('color','red');
    frameRate(20);
    
    socket = io.connect('http://localhost:5000');
    
    socket.on('enemy_pos',function(data){
        enemyX = data.x;
        enemyY = data.y;
    });
    
    socket.on('enemy_score',function(score){
        enemy_score = score;
    });
    
    socket.on('bullet_info',function(B){
        ebullets = B;
    });
    
}

function draw(){
    background(0);
    YourScore.remove();
    EnemyScore.remove();
    
    YourScore = createDiv('Your Score: ' + player_score);
    EnemyScore = createDiv("Enemy's Score: " + enemy_score);
    YourScore.position(30,40);
    EnemyScore.position(500,40);
    YourScore.style('color','white');
    EnemyScore.style('color','red');
    
    a1 = 300;
    a2 = 300;
    
    socket.emit('player_score',player_score);
    
    ellipse(playerX,playerY,30,30);
    ellipse(enemyX,enemyY,30,30);
    for(var r in pbullets){
        ellipse(pbullets[r].xpos,pbullets[r].ypos,10,10);
    }
    
    for(var r in ebullets){
        ellipse(ebullets[r].xpos,ebullets[r].ypos,10,10);
    }
    
    playerName.position(playerX,playerY - 30);
    enemyName.position(enemyX,enemyY - 30);
    
    playerX = constrain(playerX,30,570);
    playerY = constrain(playerY,30,570);
    
    check_collision();
    update_bullet_pos();
    send_player_pos();
    send_bullet_pos();
}

function send_bullet_pos(){
    socket.emit('bullet_info',pbullets);
}

function check_collision(){
    for(var p in pbullets){
        if(pbullets[p].tag == 0){
            var d = sqrt((pbullets[p].xpos - enemyX)*(pbullets[p].xpos - enemyX) + (pbullets[p].ypos - enemyY)*(pbullets[p].ypos - enemyY));
            if(d <= 40){
                delete pbullets[p];
                player_score += 1;
            }
        }
    }
    
    for(var p in pbullets){
        if(pbullets[p].xpos < 0 || pbullets[p].xpos > 600 || pbullets[p].ypos < 0 || pbullets[p].ypos > 600){
            delete pbullets[p];
        }
    }
    
    
}



function send_player_pos(){
    var D = {
        x: playerX,
        y: playerY
    };
    socket.emit('player_info',D);
}

function update_bullet_pos(){
    for(var r in pbullets){
        pbullets[r].xpos += (pbullets[r].destX - pbullets[r].startposx) / 2;
        pbullets[r].ypos += (pbullets[r].destY - pbullets[r].startposy) / 2;
    }
}

function mousePressed(){
    num += 1;
    pbullets[num] = {
        xpos: playerX,
        ypos: playerY,
        destX: mouseX,
        destY: mouseY,
        startposx: playerX,
        startposy: playerY,
        tag: 0
    };
}

function keyPressed(){
    if(keyIsDown(UP_ARROW)){
        playerY -= 10;
    }
    
    if(keyIsDown(DOWN_ARROW)){
        playerY += 10;
    }
    
    if(keyIsDown(RIGHT_ARROW)){
        playerX += 10;
    }
    
    if(keyIsDown(LEFT_ARROW)){
        playerX -= 10;
    }
}