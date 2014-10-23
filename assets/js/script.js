$(function(){
	var width = $('ul.FavList p').outerWidth();
	$('ul.FavList p').each(function(){
		$(this).addClass('sliced').splitLines({width:width});
	});
	$(".color-1").tipTip({
		activation:"click",
		content:$("#story-1").html(),
		delay:100,
		maxWidth:'350px',
		keepAlive:true
	});
	$(".color-2").tipTip({
		activation:"click",
		content:$("#story-2").html(),
		delay:100,
		maxWidth:'350px',
		keepAlive:true
	});
	$(".color-3").tipTip({
		activation:"click",
		content:$("#story-3").html(),
		delay:100,
		maxWidth:'350px',
		keepAlive:true
	});	
});