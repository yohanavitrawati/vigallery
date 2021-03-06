/*--Gallery by vivi@closelycoded.net--
 version 1.1
*/

(function($){
    $.fn.ViGallery = function(options){
        
        var defaults = {
            zoom : true,                        //require elevateZoom to zoom image
            zoomtype : "inner",                 //type of zoom inner or outer
            thumbnail : 3,                      //how many thumbnail to display
            pagination : true,                  //using pagination or not, value 'true' or 'false'
            arrow : true,                       //using arrow or not, value 'true' or 'false'
            scroll : 'horizontal',              //horizontal, vertical
            speed : 1000,                       //speed of animation
            hyperlink : false,                  //set hyperlink on large image
            link_next_image : false,            
            show_title : false,
            hoverpause : true,
            pause : 5000,
            arrow_next_image : false,
            large_picture_position : 'bottom'   //position of large picture 'top' or 'bottom'

        }
        var options = $.extend(defaults, options);
        
        var obj = $(this);
        var objId = $(this).attr('id');
        var toTb = obj.children('li').length;
        
        /*-----------------gallery wrapper--------------*/
        if($("#"+objId+"_wrap").length <= 0){
            obj.wrap('<div class="vg_wrapper" id="'+objId+'_wrap"></div>');
        }
        
        if(toTb > 0){
        //create thumbnail list
        if($("#"+objId+"_wrap").find('.vg_list_wrapper').size() <= 0){
            obj.wrap('<div class="vg_list_wrapper"></div>');
        }
        var thumb = obj.children('li');
        var x = 0;
        thumb.each(function(){
            $(this).addClass('idx_'+x);
            x++;
        });
        obj.find('li:first').addClass('first');
        
        //---create horizontal or vertical list---//
        var margVal = 0;
        
        //if create horizontal list
        if(options.scroll == 'horizontal'){
            obj.find('li').addClass('vg_horizontal');
            var ulWh = 0;
            var wrapWh = 0;
            var i = 0;
            var lastMarg = parseInt(obj.find('li:last').css('marginRight'));
            thumb.each(function(){
                var margRt = parseInt($(this).css('marginRight'));
                margVal = margRt;
                ulWh += $(this).outerWidth() + margRt;
                if( i < options.thumbnail){
                    if( i==(options.thumbnail - 1)){
                        margRt = 0;
                    }
                    wrapWh += $(this).outerWidth() + margRt;
                }
                
                i++;
            });
             obj.css('width',ulWh);
             obj.parent('.vg_list_wrapper').css('width',wrapWh);
        }else if(options.scroll == 'vertical'){ //if create vertical list
            obj.find('li').addClass('vg_vertical');
            var ulHt = 0;
            var wrapHt = 0;
            var i = 0;
            var lastMarg = parseInt(obj.find('li:last').css('marginBottom'));
            thumb.each(function(){
                var margBt = parseInt($(this).css('marginBottom'));
                margVal = margBt;
                ulHt += $(this).outerHeight() + margBt;
                if( i < options.thumbnail){
                    if( i==(options.thumbnail - 1)){
                        margBt = 0;
                    }
                    wrapHt += $(this).outerHeight() + margBt;
                }
                i++;
            });
             obj.css('width',ulHt);
             obj.parent('.vg_list_wrapper').css('height',wrapHt);
        }
        //---end create horizontal or vertical list--//
        
        //default active thumbnail
        obj.find('li:first').addClass('active');

        //create arrow to scroll
        var parWrap = obj.parents('.vg_wrapper');
        if($('#'+objId+'_wrap').find('.vg_control').size() <=0 ){
            parWrap.append('<div class="vg_control"><div class="vg_prev_nav"><a href="/" class="vg_prev" id="vg_prev_'+objId+'">Prev</a></div><div class="vg_next_nav"><a href="/" class="vg_next" id="vg_next_'+objId+'">Next</a></div></div>');
        }
        
        var anWh = 0;
        var anHt = 0;
        var anBackWh = 0;
        var anBackHt = 0;
        
        //next scroll
        $("body").on("click", "a#vg_next_"+objId,function(event){
            event.preventDefault();
            var parCs = $(this).parent();
            if(!parCs.hasClass('disabled')){
                if(options.scroll == 'horizontal' && !obj.is(':animated')){
                    var curPost = parseInt(obj.css('left'));
                    anWh = wrapWh -(curPost);
                    obj.animate({"left": -(anWh + margVal)}, 
                    options.speed,
                    function(){
                        setPosition();
                        if(options.autoscroll){
                            nextLoop(); 
                        } 
                    });
                }else{
                    var curPost = parseInt(obj.css('top'));
                    anHt = wrapHt -(curPost);
                    obj.animate({"top": -(anHt + margVal)}, 
                    options.speed,
                    function(){
                        setPosition();
                    });
                }
            }
        });
        
        //prev scroll
        $("body").on("click", "a#vg_prev_"+objId,function(event){
            event.preventDefault();
            var parCs = $(this).parent();
            if(!parCs.hasClass('disabled')){
                if(options.scroll == 'horizontal' && !obj.is(':animated')){
                    var curPost = parseInt(obj.css('left'));
                    anBackWh = curPost + wrapWh;
                    obj.animate({"left": anBackWh + margVal}, 
                    options.speed,
                    function(){
                        setPosition();
                    });
                }else{
                    var curPost = parseInt(obj.css('top'));
                    anBackHt = curPost + wrapHt;
                    obj.animate({"top": anBackHt + margVal}, 
                    options.speed,
                    function(){
                        setPosition();
                    });
                }
            }
        });
        
        //default nav before setPosition
        var lastPost = Math.ceil(toTb / options.thumbnail);
        
        var nextNav = parWrap.find('.vg_next_nav');
        var prevNav = parWrap.find('.vg_prev_nav');
  
        prevNav.addClass('disabled');
        if(lastPost <= 1){
            nextNav.addClass('disabled').removeClass('active');
        }else{
            nextNav.removeClass('disabled').addClass('active');
        }
        
        //--------------------check position for thumbnail arrow--------------------//
        function setPosition(){
            var position = obj.position();
            
            if(position.left != 0){
                obj.find('li').removeClass('first');
            }
            if(options.scroll=='horizontal'){
                var leftPost = parseInt(obj.css('left'));
                var newUlWh = obj.width();
                var leftRm = (newUlWh - (parseInt(obj.css('left')) * -1)) - lastMarg;

                if(wrapWh >= leftRm){
                    nextNav.addClass('disabled').removeClass('active');
                    prevNav.removeClass('disabled').addClass('active');
                }else{
                    nextNav.removeClass('disabled').addClass('active');
                    prevNav.removeClass('disabled').addClass('active');
                }
                if(leftPost == 0){
                    nextNav.removeClass('disabled').addClass('active');
                    prevNav.removeClass('active').addClass('disabled');
                }
            }else{
                var topPost = parseInt(obj.css('top'));
                var newUlHt = obj.height();
                var topRm = (newUlHt - (parseInt(obj.css('top')) * -1)) - lastMarg;

                if(wrapHt >= topRm){
                    nextNav.removeClass('active').addClass('disabled');
                    prevNav.removeClass('disabled').addClass('active');
                }else{
                    nextNav.removeClass('disabled').addClass('active');
                    prevNav.removeClass('disabled').addClass('active');
                }
                if(topPost == 0){
                    nextNav.removeClass('disabled').addClass('active');
                    prevNav.removeClass('active').addClass('disabled');
                }
            }
            
        }
        
        //------------default display large picture-------------------//
        
        var vglargePic = $('#'+objId+'_wrap').find('.vg_large_picture');
        //if large picture doesn't exist create before or after thumbnail list
        if(vglargePic.size() <= 0 ){
            if(options.large_picture_position == 'top'){
                $('#'+objId+'_wrap').prepend('<div class="vg_large_picture"></div>');
            }else{
                $('#'+objId+'_wrap').append('<div class="vg_large_picture"></div>');
            }
        }

        vglargePic = $('#'+objId+'_wrap').children('.vg_large_picture');
        var largePic = obj.find('li:first').children().attr('data-full');
        var zoomPic = obj.find('li:first').children().attr('data-zoom');
        var findLarge = $('#'+objId+'_wrap').find('.large_image');
        
        if(options.hyperlink){
            var link = obj.find('li:first').children().attr('href');
            var nextId = '';
            if(options.link_next_image){
                nextId = 'id="to_next"';
            }
            if(findLarge.size() <= 0){
                vglargePic.append('<a href="'+link+'" '+nextId+'><img src="'+largePic+'" id="large_image_'+objId+'" alt="large_image" class="idx_0 large_image"/></a>');
            }
        }else{
            if(options.link_next_image){
                if(findLarge.size() <= 0){
                    vglargePic.append('<a href="/" id="to_next"><img src="'+largePic+'" id="large_image_'+objId+'" alt="large_image" class="idx_0 large_image"/></a>');
                }
            }else{
                if(findLarge.size() <= 0){
                    vglargePic.append('<img src="'+largePic+'" id="large_image_'+objId+'" alt="large_image" class="idx_0 large_image"/>');
                }
            } 
        }
        vglargePic.fadeIn('slow');
        
        
        //default if show image title
        var titlePic = obj.find('li:first').find('img').attr('alt');
        var findShowTitle = obj.parents('.vg_wrapper').find('.show_title');
        if(options.show_title){
            if(options.large_picture_position == 'top'){
                obj.parents('.vg_wrapper').prepend('<div class="show_title"></div>');
            }else{
                obj.parents('.vg_wrapper').append('<div class="show_title"></div>');
            }
            
            if(options.hyperlink){
                if(link != ""){
                    findShowTitle.html('<a href="'+link+'">'+titlePic+'</a>');
                }else{
                    findShowTitle.html(titlePic);
                }
            }else{
                findShowTitle.html(titlePic);
            }
            findShowTitle.fadeIn('slow');
        }     
        
        //thumbnail click to large pic
        obj.find('a').on("click",function(e){
            e.preventDefault();
            largePic = $(this).attr('data-full');
            zoomPic = $(this).attr('data-zoom');
            var tnClass = $(this).parent('li').attr('class');
            obj.find('li').removeClass('active');
            $(this).parent('li').addClass('active');
            var splitClass = tnClass.split(" ");
            var idx = splitClass[0].replace("idx_","");
            if(options.hyperlink){
                var linkTn = $(this).attr('href');
            }
            if(options.show_title){  
                var titlePicTn = $(this).find('img').attr('alt');
                obj.parents('.vg_wrapper').find('.show_title').fadeOut('slow', function(){
                    findShowTitle.empty();
                    if(options.hyperlink){
                        if(linkTn != ""){
                            findShowTitle.html('<a href="'+linkTn+'">'+titlePicTn+'</a>');
                        }else{
                            findShowTitle.html(titlePicTn);
                        }
                    }else{
                        findShowTitle.html(titlePicTn);
                    }
                    findShowTitle.fadeIn('slow');
                });   
            }
            
            vglargePic.fadeOut('slow',function(){
                findLarge = $('#'+objId+'_wrap').find('.large_image');
                if(linkTn !="" && linkTn != undefined){
                    if(options.link_next_image){
                        obj.parents('.vg_wrapper').find('#to_next').detach();
                    }
                    if($('#'+objId+'wrap').find('.large_image').size <= 0){
                        vglargePic.append('<a href="'+linkTn+'" '+nextId+'><img src="'+largePic+'" id="large_image_'+objId+'" alt="large_image" class="idx_'+idx+' large_image" /></a>'); 
                    }
                    
                } else{
                    if(options.link_next_image){
                        if($('#'+objId+'wrap').find('.large_image').size <= 0){
                            vglargePic.append('<a href="/" id="to_next"><img src="'+largePic+'" id="large_image_'+objId+'" alt="large_image" class="idx_'+idx+' large_image" /></a>'); 
                        }
                    }else{
                            findLarge.attr('src', largePic+"?v="+(new Date()).getTime());
                            //vglargePic.append('<img src="'+largePic+'" id="large_image_'+objId+'" alt="large_image" class="idx_'+idx+'" />'); 
                    }  
                }
                vglargePic.fadeIn('slow',function(){
                    if(options.zoom){
                        if(options.zoomtype == "inner"){
                            innerZoom(largePic, zoomPic+"?v="+(new Date()).getTime(), idx);
                        }else if(options.zoomtype == "outer"){
                            outerZoom(largePic, zoomPic+"?v="+(new Date()).getTime(), idx);
                        }
                    }
                }); 
            });
            
            
            
            
        });
        
        //to the next image
        if(options.link_next_image){
            $("body").on("click", "a#to_next", function(event){
                event.preventDefault();
                var this_idx = $(this).find('img').attr('class');
                var next_idx = parseInt(this_idx.replace('idx_','')) + 1;
                $('.idx_'+next_idx).find('a').click();
                
                var curPost = Math.ceil((next_idx) / options.thumbnail);
                var next_position = Math.ceil((next_idx + 1) / options.thumbnail);

                if(next_position > curPost){ 
                      $('a.vg_next').click();         
                }
          });
        }
        
        //arrow next image
        if(options.arrow_next_image){
            if ($('#'+objId+'_wrap').find('.inner_control').size() <= 0){
                vglargePic.append('<div class="inner_control"></div>');
                obj.parents('.vg_wrapper').find('.inner_control').append('<a href="/" class="vg_prev_pic_'+objId+'">Prev</a><a href="/" class="vg_next_pic">Next</a>');
            }
            $('body').on("click","a.vg_next_pic",function(e){
                e.preventDefault();
                var large_class = obj.parents('.vg_wrapper').find('.large_image').attr('class').split('_');
                var cur_idx = large_class[1];
                var next_idx = parseInt(cur_idx) + 1;
                $('.idx_'+next_idx).find('a').click();
                
                var now_pos = Math.ceil((next_idx) / options.thumbnail);
                var next_pos = Math.ceil((next_idx + 1) / options.thumbnail);

                if(next_pos > now_pos){ 
                      $('a.vg_next').click();         
                }
            });
            
            $('body').on("click","a.vg_prev_pic",function(e){
                e.preventDefault();
                var large_class = obj.parents('.vg_wrapper').find('.large_image').attr('class').split('_');
                var cur_idx = large_class[1];
                var prev_idx = parseInt(cur_idx) - 1;
                $('.idx_'+prev_idx).find('a').click();
                
                var now_pos = Math.ceil((parseInt(cur_idx) + 1) / options.thumbnail);
                var prev_pos = Math.ceil((prev_idx + 1) / options.thumbnail);

                if(prev_pos < now_pos){ 
                      $('a.vg_prev').click();         
                }
            });
        }
        
        //inner zoom function with elevate zoom
          var innerZoom = function(largePic, zoomPic, class_image) {
              $('.zoomContainer').remove();
              var findLarge = $('#'+objId+'_wrap').find('.large_image');
               findLarge.removeAttr('data-zoom-image');
               findLarge.attr('data-zoom-image', zoomPic);
               findLarge.data('zoom-image', zoomPic).elevateZoom({
                   zoomType: "inner",
                   cursor: "crosshair",
                   zoomWindowWidth:300, 
                   zoomWindowHeight:100
               });
          }
          
          //outer zoom function with elevate zoom
        var outerZoom = function(largePic, zoomPic, class_image){ 
            $('.zoomContainer').remove();
                var findLarge = $('#'+objId+'_wrap').find('.large_image');
                findLarge.removeAttr('data-zoom-image');
                findLarge.attr('data-zoom-image', zoomPic);
                findLarge.data('zoom-image', zoomPic).elevateZoom({
                    zoomWindowWidth:340,
                    zoomWindowHeight:500,
                    borderSize: 0, 
                    zoomType: "outer"
                });
          }
          
          //zoom hovering for first image
        if(options.zoom){
            if(options.zoomtype == "inner"){
                innerZoom(largePic, zoomPic, 0);
            }else if(options.zoomtype == "outer"){
                outerZoom(largePic, zoomPic, 0);
            }
         }
        
        }else{
            obj.parents('.vg_wrapper').html('<span>Image not found.</span>');
        }
         
    }
})(jQuery);
