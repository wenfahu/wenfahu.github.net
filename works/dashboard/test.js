function loadImgs(num_of_page){
    console.log(num_of_page);
    var $container = $('.masonry-container');
    var raw_tpl = $('script.template').html();
    var tpl = _.template(raw_tpl);
    //var hook = $('masonry-container');
	$.getJSON('https://api.flickr.com/services/rest/?jsoncallback=?',
	  {
	      method: 'flickr.photos.search',
	      tags: "couple",
	      tag_mode: 'any',
	      page: num_of_page,
	      api_key: '6e721dcec7584a0a5a2bd6d9fff864cd',
	      per_page: 30,
	      format: 'json'
	  } 
	 ,function(data){
	     $.each(data.photos.photo, function(i, item){
		var src = "http://farm"+ item.farm +".static.flickr.com/"+ item.server +"/"+ item.id +"_"+ item.secret +"_m.jpg";
		//console.log(src);
		var html = tpl({url: src, title: item.title});
		//hook.append(html);
		$('.masonry-container').imagesLoaded(function() {
		    $container.masonry({
			    columnWidth: '.item',
			    itemSelector: '.item'
		    });
		    $container.append(html).masonry('appended', html);
		});
	     });
	 }
     );
};
(function(){
    loadImgs(1);
    var i = 2;
    $(window).scroll(function(){
	if($(window).scrollTop() === $(document).height() - $(window).height()){
	    console.log("touch the end");
	    loadImgs(i++);
	}
    });

})()
