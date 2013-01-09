/*
	jSlide Plugin
	Version: 1.0
	Framework: jQuery 1.4+
	Author: Ian Eicholtz
	====================================
	USAGE
	--------------
	$('#carousel').jslide();
	
	OPTIONS
	--------------
	duration: number
	easing: string
	direction: string
	style: string
	loop: boolean
	
*/

(function($){

	$.fn.jslide = function(options){
		
		if(typeof options !== 'object'){
			var args = arguments;
			return this.data('jslide_api')[ args[0] ] (args[1]);
		};
	
		var o = $.extend({
			duration: 800,
			easing: 'swing',
			direction: 'horizontal',
			style: 'multi',
			loop: false,
			allowHiding: true,
			page: 0
		}, options);
	
		return this.each(function(){
			
			var frame = $(this),
				slider = frame.children('ul'),
				items = slider.children('li'),
				frameW = frame.width(),
				frameH = frame.height(),
				itemW = items.outerWidth(true),
				itemH = items.outerHeight(true),
				sliderW = o.direction === 'horizontal' ? items.length * itemW : frameW,
				sliderH = o.direction === 'horizontal' ? frameH : items.length * itemH,
				api,
				backbtn = $(o.back),
				nextbtn = $(o.next),
				itemsPerView = o.direction === 'horizontal' ? Math.floor(frameW / itemW) : Math.floor( frameH / itemH),
				sliderMax =  o.style === 'multi' ? Math.ceil(items.length / itemsPerView) - 1 : items.length - itemsPerView,
				page = o.page > sliderMax ? sliderMax : o.page
			;
			
			//SETUP
			//======================
			
			frame.css({
				position:  frame.css('position')==='static' ? 'relative' : frame.css('position'),
				overflow: 'hidden'
			});
			
			slider.css({
				position: 'absolute',
				top: o.direction === 'horizontal' ? 0 : -(page * (o.style === 'multi' ? frameH : itemH) ),
				left: o.direction === 'horizontal' ? -(page * (o.style === 'multi' ? frameW : itemW) ) : 0 ,
				margin: 0,
				padding: 0,
				listStyle: 'none',
				display: 'block',
				width: sliderW,
				height: sliderH
			});
			
			items.css({
				'float': 'left'
			});
			
			if(page === sliderMax && o.loop === false && o.allowHiding === true){
				nextbtn.css({visibility: 'hidden'});
			};
			if(page === 0 && o.loop === false && o.allowHiding === true){
				backbtn.css({visibility: 'hidden'});
			};
			//EVENTS
			//======================
			
			var anim = function(){
			
				if(o.slider){
					$(o.slider).slider('value', page);
				};
			
				if(o.direction === 'horizontal'){
					slider.stop(true).animate({
						left: o.style === 'multi' ?  -(page * frameW) : -(page * itemW)
					}, o.duration, o.easing);
				}else{
					slider.stop(true).animate({
						top: o.style === 'multi' ? -(page * frameH) : -(page * itemH)
					}, o.duration, o.easing);
				};
			};
			
			var backfn = function(e){
				if(page > 0){
					page--;
				}else{
					if(o.loop === true){
						page = sliderMax
					}else{
						page = 0;
					};
					
					
				};
				nextbtn.css({visibility: 'visible'}).animate({opacity: 1}, 200);
					
					if(page === 0 && o.loop === false && o.allowHiding === true){
						backbtn.animate({opacity: 0}, 200, function(){
							backbtn.css({
								visibility: 'hidden'
							});
						});	
					};
				
				anim();
				if(e){e.preventDefault()};
			};
			var nextfn = function(e){
				if(page < sliderMax){
					page++;
				}else{
					if(o.loop === true){
						page = 0;
					}else{
						page = sliderMax;
					};
				};
				backbtn.css({visibility: 'visible'}).animate({opacity: 1}, 200);
				
				if(page === sliderMax && o.loop === false && o.allowHiding === true){
						nextbtn.animate({opacity:0}, 200, function(){
							nextbtn.css({
								visibility: 'hidden'
							});
						});	
					};
				
				anim();
				if(e){e.preventDefault()};
			};
			
			backbtn.bind('click.jslide', backfn);
			nextbtn.bind('click.jslide', nextfn)
			
			//SLIDESHOW
			//======================
			
			//PUBLIC API
			//======================
			
			api = {};
			
			api.back = backfn;
			api.next = nextfn;
			
			api.get = function(){
				return {
					page: page,
					max: sliderMax,
				};
			
			};
			
			api.go = function(n){
				if(n > page){
					page = n -1;
					nextfn();
				}else if(n < page){
					page = n + 1;
					backfn();
				};
			};
			frame.data('jslide_api', api);
		
		});	
	};

})(jQuery);