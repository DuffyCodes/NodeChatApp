/**
 * a NodeJS chat app, made to teach myself NodeJS
 */

var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:3000/messages', {useNewUrlParser: true})
	.then(()=>console.log('DB Connected'))
	.catch(err => console.log('mongo db connection', err))

var db = mongoose.connection

//db.on("error", console.error.bind(console, "connection error"))
//db.once("open", function(callback){
//	console.log("Connection established.")
//})

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

//var dbUrl ='mongodb://user:user@cluster0-shard-00-00-rtens.gcp.mongodb.net:27017,cluster0-shard-00-01-rtens.gcp.mongodb.net:27017,cluster0-shard-00-02-rtens.gcp.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true'
var messSchema = new mongoose.Schema({
	name: String,
	message: String
})
var Message = mongoose.model('Message', messSchema)	
	


app.get('/messages', (req, res)=>{
	Message.find({}, (err, messages)=> {
		res.send(messages)
	})
})

app.post('/messages', (req, res)=>{
	var message = new Message(req.body)
	
	message.save((err)=>{
		if(err)
			sendStatus(500)
		
		io.emit('message',req.body)
		res.sendStatus(200)
	})
})

io.on('connection',(socket)=>{
	console.log('a user connected')
})

//mongoose.connect(dbUrl, {useNewUrlParser: true}, (err) => {
//	console.log('mongo db connection', err)
//})
Message.update(function(error){
	console.log("Message saved")
	if(error)
		console.log("error: ", error)
})

var server = http.listen(3000, ()=>{
	console.log('server is listening on port', server.address().port)
})

