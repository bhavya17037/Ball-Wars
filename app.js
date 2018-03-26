var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

server.listen(5000);

app.use(express.static('public'));

app.get('/',function(req,res){
    res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection',function(socket){
    socket.on('player_score',function(score){
        socket.broadcast.emit('enemy_score',score);
    });
    
    socket.on('bullet_info',function(b_info){
        for(var U in b_info){
            b_info[U].tag = 1;
        }
        socket.broadcast.emit('bullet_info',b_info);
    });
    
    socket.on('player_info',function(D){
        socket.broadcast.emit('enemy_pos',D);
    });
});