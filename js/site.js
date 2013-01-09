$('document').ready(function(){
	
/*------------------------------------------------------
\\\\\\\\\\\\\\\\\\\variables/////////////////
------------------------------------------------------*/	
	
	var landingHTML = '',
		appHTML = '',
		settingsHTML = '',
	 	wrap = $('#wrapper'),
		uName = '',
		pass = '',
		url = '',
		feed = '',
		settings = '',
		top = '',
		nav='',
		num= 5,
		body ='';
	
/*------------------------------------------------------
\\\\\\\\\\\\\\\\\\\main page functions/////////////////
------------------------------------------------------*/
		
	var init = function(){
		checkLogin();
	};
	
	
	
	var checkLogin= function(){
		$.ajax({
			url: 'xhr/protect.php',
			type: 'get',
			dataType: 'json',
			success: function(r){
				if(!r.error){
					loadApp();
				}else{
					loadLand();
				};
			},
			error: function(){
				alert("checklogin error");
			}
		});
	};
	
	var loadLand = function(){
		$.ajax({
			url: 'xhr/content.html',
			type: 'get',
			dataType: 'html',
			success: function(r){
				landingHTML = $(r).find("#landing-html");
				wrap.html(landingHTML);
			},
			error: function(){
				alert("loadland error");
			},
			complete: function(){
				landingInit();
			}
		});
	};
	
	var loadApp = function(){
		
		wrap.empty();
		
			$.ajax({
				url: 'xhr/content.html',
				type: 'get',
				dataType: 'html',
				success: function(r){
					appHTML = $(r).find("#app-html");
					wrap.html(appHTML);
				},
				error: function(){
					alert("loadApp error");
				},
				complete: function(){
					buildTop();
					buildNav();
					buildSlider();
				}
		});
	};
	
		var buildTop = function(){
				top = appHTML.find('#top');
				settings = $('#settings');
			
			};
		
			var buildSettings= function(){
				top.addClass('notActive');
				settings.removeClass('notActive');
				settings.find('#active').empty();
				settings.find('#inactive').empty();
				
				
				$.ajax({
					url: 'xhr/get_all.php',
					type: 'get',
					dataType: 'json',
					success: function(r){
						for(var i=0, j=r.actives.length; i<j; i++){
						 	var rss = r.actives[i];
							$('<li class="draggable" rel="'+ rss.id + '"><img src="img/'+ rss.title +'.png" alt="'+ rss.title + '"/></li>').appendTo('#active');
						};
						for(var i=0, j=r.inactives.length; i<j; i++){
						 	var rss = r.inactives[i];
							$('<li class="draggable" rel="'+ rss.id + '"><img src="img/'+ rss.title +'.png" alt="'+ rss.title + '"/></li>').appendTo('#inactive');
						};
						
						$('#active, #inactive').sortable({
							connectWith: '.sortable',
								receive: function(e, ui){
									var rssid = ui.item.attr('rel');
									var addrem = ui.sender.attr('id')==='active'?'inactives' : 'actives';
									console.log(addrem);
									$.ajax({
										url: 'xhr/modify.php',
										type: 'get',
										dataType: 'json',
										data: {id:rssid, addrem:addrem},
										success: function(r){
											nav.empty();
										},
										error: function(){
											alert('fail');
										},
										complete: function(){
											buildNav();
										}
									});
								}
						});
					},
					error: function(){
						alert("buildSettings error");
					},
					complete: function(){
						
					}
				});
			};
			
		var buildNav = function(){
			nav = $('#contentNav');
				$.ajax({
					url: 'xhr/get_all.php',
					type: 'get',
					dataType: 'json',
					success: function(r){
						for(var i=0, j=r.actives.length; i<j; i++){
							console.log(r.actives)
						 	var rss = r.actives[i];
							$('<li rel="'+ rss.id + '"><a href="'+ rss.url + '">'+ rss.title +'</a></li>').appendTo(nav);
						};
					},
					complete: function(){
						nav.children('li:first')
						.addClass('current');
						loadFeed(num);
					}
				});	
		};
		
		
		var buildSlider = function(){
			var urls = [];
			$.ajax({
				url: 'xhr/get_all.php',
				type: 'get',
				dataType: 'json',
				success: function(r){
					var c = 0;
					for(var i=0, j=r.actives.length; i<j; i++){
					 	var rss = r.actives[i];
						urls.push(rss.url);
						};
						for(var i=0, j=urls.length; i<j; i++){
							var link = urls[i];
					 		var feed = new google.feeds.Feed(link);
							feed.includeHistoricalEntries();
							feed.setNumEntries(1);
							feed.load(function(f){
								c++;
								var art = f.feed.entries[0];
								$('<li><h3>'+art.title+'</h3><p>'+art.contentSnippet+'</p><span>'+art.publishedDate+'</span><a href="'+art.link+'">Continue Reading</a></li>').appendTo('#topArticle ul');
								if(c >= r.actives.length-1){
									$('#topArticle').jslide({
										duration: 800,
										direction: 'horizontal',
										style: 'single',
										loop: false,
										back: '#prev',
										next: '#next'
									});
								}
							});
						};	
				},
				error: function(){
					alert("buildSlider error");
				},
				complete: function(){
					
				}
			});
		};
		
		var loadFeed = function(number){
			body=$('#contentBody')
			body.empty();
			

			url = $('.current').find('a').attr('href');
			feed = new google.feeds.Feed(url);
			feed.includeHistoricalEntries();
			feed.setNumEntries(number);
			feed.load(function(r){
				for(var i=0, j=number; i<j; i++){
				 	var ent = r.feed.entries[i];
					$('<div class="contentArticles"><h3>'+ ent.title + '</h3><p>' + ent.contentSnippet + '</p><ul><li>'+ ent.publishedDate + '</li><li><a href="'+ ent.link +'">Continue Reading</a></li></ul></div')
						.appendTo(body).hide().slideDown();
				};
			});
		};
		
/*------------------------------------------------------
\\\\\\\\\\\\\\\\\\\\\\\landing/////////////////////////
------------------------------------------------------*/
		
	var landingInit = function(){
		
		uName = $('#username');
		pass = $('#password');
		sEmail = $('#s_email');
		sUser = $('#s_user');
		sPass = $('#s_pass');
		sRepass = $('#s_repass');
		
		
		uName.attr('value', 'Username');
		pass.attr('value', 'Password');
		sEmail.attr('value', 'Email');
		sUser.attr('value', 'Username');
		sPass.attr('value', 'Password');
		sRepass.attr('value', 'Confirm Pass');
		
		
		
		uName.bind({
			mouseenter: function(e){
				$(this)
				.attr('value', '')
				.css({'color': 'white'});
			},
			mouseleave: function(e){
				$(this).attr('value', 'Username');
			}

		});
		
		pass.bind({
			mouseenter: function(e){
				$(this)
				.attr('value', '')
				.css({'color': 'white'});
			},
			mouseleave: function(e){
				$(this).attr('value', 'Password');
			}
		});
		
		sEmail.bind({
				mouseenter: function(e){
					$(this).attr('value', '');
				},
				mouseleave: function(e){
					$(this).attr('value', 'Email');
				}
		});
		
		sUser.bind({
			mouseenter: function(e){
				$(this).attr('value', '');
			},
			mouseleave: function(e){
				$(this).attr('value', 'Username');
			}
		});
		
		sPass.bind({
			mouseenter: function(e){
				$(this).attr('value', '');
			},
			mouseleave: function(e){
				$(this).attr('value', 'Password');
			}
		});
		
		sRepass.bind({
			mouseenter: function(e){
				$(this).attr('value', '');
			},
			mouseleave: function(e){
				$(this).attr('value', 'Confirm Pass');
			}
		});
		
	};
			
/*------------------------------------------------------
\\\\\\\\\\\\\\\\\\\\\\\events/////////////////////////
------------------------------------------------------*/

$('#login').live('submit', function(e){
	
	u = uName.val();
	p = pass.val();
	$.ajax({
		url: 'xhr/login.php',
		type: 'get',
		dataType: 'json',
		data: {login: u, passphrase: p},
		success: function(r){
			if(!r.error){
				checkLogin();
			}else{
				uName.css({'color': 'red'});
				pass.css({'color': 'red'});
			};
		},
		error: function(){
			alert('login submit error');
		}	
	});
	e.preventDefault();
});

$('#signup').live('submit', function(e){
	e.preventDefault();
});

$('#logout').live('click', function(e){
	
	$.ajax({
		url:'xhr/logout.php',
		type: 'get',
		dataType: 'json',
		success: function(r){
			if(r.success){
				loadLand();
			}else{
				alert("logout failed");
			}
		},
		error: function(){
			alert("logout function error");
		}
	});
	
	e.preventDefault();
});

$('#contentNav li').live('click', function(e){
	list = '';
	that = $(this);
	list = that.parent().children();
	if(list.hasClass('current')){
		list.removeClass('current');
	};
	
	that.addClass('current');
	loadFeed(num);
	e.preventDefault();
});

$('#topBtn').live('click', function(e){
	buildSettings();
	e.preventDefault();
});

$('#settingsBtn').live('click', function(e){
	top.removeClass('notActive');
	settings.addClass('notActive');
	
	e.preventDefault();
});

$('#artNum').live('change', function(e){
	num = '';
	num = $(this).val();
	loadFeed(num);
});

		
		
		
	
/*------------------------------------------------------
\\\\\\\\\\\\\\\\\\\site code/////////////////
------------------------------------------------------*/
	
	init();
	
});