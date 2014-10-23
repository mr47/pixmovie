var express = require('express'),
	fs = require('fs'),
	app = express.createServer(express.logger()),
	request = require('request'),
	taffy = require(__dirname + '/taffy.js');
var per_page = 5, published_pages = 0, pub_count = 0, DB = {};
var tid = -1;

/*
var conf = {
	tid_s : tid,
	per_page : per_page,
};
*/
var init = function(){
	var count = parseInt(fs.readFileSync(__dirname+'/data').toString());
	pub_count = count;
	published_pages = Math.ceil(pub_count/per_page);
	console.log("Published pages -> "+published_pages);
	console.log("Published count -> "+pub_count);
}
var update = function(){
	var count = parseInt(fs.readFileSync(__dirname+'/data').toString());
	count++;
	pub_count = count;
	published_pages = Math.ceil(pub_count/per_page);
	console.log("Published pages -> "+published_pages);
	console.log("Published count -> "+pub_count);	
	console.log('Update -> set count '+count);
	fs.writeFileSync(__dirname+'/data',count);
}

var cron_job = function(){
	/* 24*3600*1000  = One day */
	tid = setInterval(update,86400*1000);
}


app.configure(function() { 
	init();
    app.use(express.bodyParser());
	app.use(express.static(__dirname + '/assets/'));
	app.set('views', __dirname + '/views/');
	app.set('view engine', 'ejs');
	app.set('view options',{
		layout:false
	});
    app.use(app.router);
	
	DB = taffy.db(fs.readFileSync(__dirname+'/assets/db.json').toString());
});

app.get('/', function(req, res) {
	res.render('index',{
				title:'Pixmovie.ru',
				page:DB().limit(pub_count).get().slice(per_page*(published_pages-1),pub_count).reverse(),
				main_page:published_pages,
				page_num:published_pages,
				pp:published_pages
	});	
});
app.get('/page/:num',function(req, res){
	if(req.params.num>=published_pages) throw new Error('keyboard cat!');
		res.render('index',{
			title:'Pixmovie.ru',
			main_page:published_pages,
			page_num:req.params.num,
			page:DB().limit(pub_count).get().slice(per_page*(req.params.num-1),(req.params.num*per_page)).reverse(),
			pp:published_pages
		});
});
app.get('/update',function(req, res){
	update();
	res.send("It's UPDATED!");
});
app.get('/hq/:id',function(req, res){
	if (pub_count<req.params.id) throw new Error('keyboard cat!');
		var p = DB({id:parseInt(req.params.id)}).first();
		res.render('hq',{
			title:'Pixmovie :: цитата из '+p.name,
			page:p
		});
		console.log(DB({id:parseInt(req.params.id)}).first());
});
app.get('/idea',function(req, res){
		res.render('page_idea',{
			title:'Pixmovie.ru'
		});
});
app.get('/kill-cron',function(req, res){
	clearInterval(tid);
	res.send("cron -> Kill timer");
});
app.get('/cron',function(req, res){
	cron_job();
	res.send("cron -> start timer");
});

app.error(function(err, req, res){
	res.render('error', {
		title:'Pixmovie.ru - Error!',
		error: err
	});
});

/* FUTURE */
app.post('/add',function(req, res){
	res.send(":(");
});
app.get('/pub',function(req, res){
	
});


var port = 8000;
app.listen(port, function() {
  console.log("Listening on " + port);
});