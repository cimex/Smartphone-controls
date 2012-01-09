var sys = require('util'), http = require('http');

var app = require('express').createServer(), io = require('socket.io').listen(app);
var usercounter = 0;
app.listen(4000);
io.configure(function() {
	io.set('transports', ['websocket', 'flashsocket', 'xhr-polling']);
	io.set('log level', 1);
});
var gamescreen = io.of('/screen');
var control = io.of('/control');
	
	control.on('connection', function(socket) {
	socket.set('assignname', 'user' + usercounter, function() {
		usercounter++;
	});
	socket.on('control', function(data) {
		console.log(data);
		socket.get('assignname', function(err, name) {
			gamescreen.emit('controlemit', {
				control : data,
				user : name
			});
		});
	});
});

app.get('/', function(req, res) {
	res.sendfile(__dirname + '/connect.html');
});

app.get('/:asset', function(req, res) {
	res.sendfile(__dirname + '/' + req.params.asset);
});
