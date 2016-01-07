/*--Gallery by vivi@closelycoded.net--
 version 1.1
note:
- bug fix : zoom
- bug fix : large image 
- add hyperlink
- show title 
- remove image effect to css
- click large image to next image - bug fixed
- bug fix : set position 
 * */

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
            hyperlink : false,
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
        
        //gallery wrapper
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
        
        //create horizontal or vertical list
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
        //default active thumbnail
        obj.find('li:first').addClass('active');

        //create arrow to scroll
        var parWrap = obj.parents('.vg_wrapper');
        if($('#'+objId+'_wrap').find('.vg_control').size() <=0 ){
            parWrap.append('<div class="vg_control"><div class="vg_prev_nav"><a href="/" class="vg_prev">Prev</a></div><div class="vg_next_nav"><a href="/" class="vg_next">Next</a></div></div>');
        }
        
        var anWh = 0;
        var anHt = 0;
        var anBackWh = 0;
        var anBackHt = 0;
        
        //next scroll
        $("body").on("click", "a.vg_next",function(event){
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
        $("body").on("click", "a.vg_prev",function(event){
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
        var nextNav = obj.parents('.vg_wrapper').find('.vg_next_nav');
        var prevNav = obj.parents('.vg_wrapper').find('.vg_next_nav');
            
        prevNav.addClass('disabled');
        if(lastPost <= 1){
            nextNav.addClass('disabled').removeClass('active');
        }else{
            prevNav.removeClass('disabled').addClass('active');
        }
        
        //--------------------cek position--------------------//
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
                    nextNav.removeClass('active').addClass('disabled');
                    prevNav.removeClass('disabled').addClass('active');
                }
            }
            
        }
        
        //------------default display large picture-------------------//
        var vglargePic = $('#'+objId+'_wrap').find('.vg_large_picture');
        
        //if large picture doesn't exist create before or after thumbnail list
        if(options.large_picture_position == 'top'){
            if(vglargePic.size() <= 0 ){
                $('#'+objId+'_wrap').prepend('<div class="vg_large_picture"></div>');
            }
        }else{
            if(vglargePic.size() <= 0 ){
                $('#'+objId+'_wrap').append('<div class="vg_large_picture"></div>');
            }
        }
        var large_image = obj.find('li:first').children().attr('data-full');
        if(options.hyperlink){
            var link = obj.find('li:first').children().attr('href');
            var next_id = '';
            if(options.link_next_image){
                next_id = 'id="to_next"';
            }
            if($('#'+objId+'_wrap').find('#large_image').size() <= 0){
                obj.parents('.vg_wrapper').find('.vg_large_picture').append('<a href="'+link+'" '+next_id+'><img src="'+large_image+'" id="large_image" alt="large_image" class="idx_0"/></a>');
            }
        }else{
            if(options.link_next_image){
                if($('#'+objId+'_wrap').find('#large_image').size() <= 0){
                    obj.parents('.vg_wrapper').find('.vg_large_picture').append('<a href="/" id="to_next"><img src="'+large_image+'" id="large_image" alt="large_image" class="idx_0"/></a>');
                }
            }else{
                if($('#'+objId+'_wrap').find('#large_image').size() <= 0){
                    obj.parents('.vg_wrapper').find('.vg_large_picture').append('<img src="'+large_image+'" id="large_image" alt="large_image" class="idx_0"/>');
                }
            } 
        }
        obj.parents('.vg_wrapper').find('.vg_large_picture').fadeIn('slow');
        
        
        //default show title
        if(options.show_title){
            if(options.large_picture_position == 'top'){
                obj.parents('.vg_wrapper').prepend('<div class="show_title"></div>');
            }else{
                obj.parents('.vg_wrapper').append('<div class="show_title"></div>');
            }
            var title_photo = obj.find('li:first').find('img').attr('alt');
            if(options.hyperlink){
                if(link != ""){
                    obj.parents('.vg_wrapper').find('.show_title').html('<a href="'+link+'">'+title_photo+'</a>');
                }else{
                    obj.parents('.vg_wrapper').find('.show_title').html(title_photo);
                }
            }else{
                obj.parents('.vg_wrapper').find('.show_title').html(title_photo);
            }
            obj.parents('.vg_wrapper').find('.show_title').fadeIn('slow');
        }
        
        //default zoom picture
        if(options.zoom){
            var zoom_image = obj.find('li:first').children().attr('data-zoom');
            if($('#'+objId+'_wrap').find('#zoom_image').size() <= 0){
                obj.parents('.vg_wrapper').find('.vg_large_picture').append('<img src="'+zoom_image+'" id="zoom_image" alt="zoom_image" />');
            }
        }      
        
        //thumbnail click to large pic
        obj.find('a').on("click",function(e){
            e.preventDefault();
            var large_pic = $(this).attr('data-full');
            var zoom_image = $(this).attr('data-zoom');
            var this_class = $(this).parent('li').attr('class');
            obj.find('li').removeClass('active');
            $(this).parent('li').addClass('active');
            var split_class = this_class.split(" ");
            var idx = split_class[0].replace("idx_","");
            if(options.hyperlink){
                var link_tn = $(this).attr('href');
            }
            if(options.show_title){  
                var title_photo_tn = $(this).find('img').attr('alt');
                obj.parents('.vg_wrapper').find('.show_title').fadeOut('slow', function(){
                    obj.parents('.vg_wrapper').find('.show_title').empty();
                    if(options.hyperlink){
                        if(link_tn != ""){
                            obj.parents('.vg_wrapper').find('.show_title').html('<a href="'+link_tn+'">'+title_photo_tn+'</a>');
                        }else{
                            obj.parents('.vg_wrapper').find('.show_title').html(title_photo_tn);
                        }
                    }else{
                        obj.parents('.vg_wrapper').find('.show_title').html(title_photo_tn);
                    }
                    obj.parents('.vg_wrapper').find('.show_title').fadeIn('slow');
                });   
            }
            
            obj.parents('.vg_wrapper').find('.vg_large_picture').fadeOut('slow',function(){
                obj.parents('.vg_wrapper').find('#large_image').detach();
                if(link_tn !="" && link_tn != undefined){
                    if(options.link_next_image){
                        obj.parents('.vg_wrapper').find('#to_next').detach();
                    }
                    if($('#'+objId+'wrap').find('#large_image').size <= 0){
                        obj.parents('.vg_wrapper').find('.vg_large_picture').append('<a href="'+link_tn+'" '+next_id+'><img src="'+large_pic+'" id="large_image" alt="large_image" class="idx_'+idx+'" /></a>'); 
                    }
                    
                } else{
                    if(options.link_next_image){
                        if($('#'+objId+'wrap').find('#large_image').size <= 0){
                            obj.parents('.vg_wrapper').find('.vg_large_picture').append('<a href="/" id="to_next"><img src="'+large_pic+'" id="large_image" alt="large_image" class="idx_'+idx+'" /></a>'); 
                        }
                    }else{
                        if($('#'+objId+'wrap').find('#large_image').size <= 0){
                            obj.parents('.vg_wrapper').find('.vg_large_picture').append('<img src="'+large_pic+'" id="large_image" alt="large_image" class="idx_'+idx+'" />'); 
                        }
                    }  
                }
                obj.parents('.vg_wrapper').find('.vg_large_picture').fadeIn('slow',function(){
                    if(options.zoom){
                        if(options.zoomtype == "inner"){
                            obj.parents('.vg_wrapper').find('.vg_large_picture').append('<img src="'+zoom_image+'" id="zoom_image" alt="zoom_image" />');
                            innerZoom(large_pic, zoom_image, idx);
                        }else if(options.zoomtype == "outer"){
                            obj.parents('.vg_wrapper').find('.vg_large_picture').append('<img src="'+zoom_image+'" id="zoom_image" alt="zoom_image" />');
                            outerZoom(large_pic, zoom_image, idx);
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
                obj.parents('.vg_wrapper').find('.vg_large_picture').append('<div class="inner_control"></div>');
                obj.parents('.vg_wrapper').find('.inner_control').append('<a href="/" class="vg_prev_pic">Prev</a><a href="/" class="vg_next_pic">Next</a>');
            }
            $('body').on("click","a.vg_next_pic",function(e){
                e.preventDefault();
                var large_class = $('#large_image').attr('class').split('_');
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
                var large_class = $('#large_image').attr('class').split('_');
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
          var innerZoom = function(large_image, zoom_image, class_image) {
            $('#'+objId+'_wrap').find('#large_image').detach();
            $('#'+objId+'_wrap').find('#zoom_image').detach();
            if($('#'+objId+'_wrap').find('#large_image').size() <= 0){
                obj.parents('.vg_wrapper').find('.vg_large_picture').append('<img src="'+large_image+'" data-zoom-image="'+zoom_image+'" id="large_image" class="idx_'+class_image+'" alt="large_image" />');
            }
            obj.parents('.vg_wrapper').find("#large_image").elevateZoom({
                zoomType: "inner",
                cursor: "crosshair",
                zoomWindowWidth:300, 
                zoomWindowHeight:100
            });
          }
          
          //outer zoom function with elevate zoom
        var outerZoom = function(large_image, zoom_image, class_image){ 
            $('#'+objId+'_wrap').find('#large_image').detach();
            $('#'+objId+'_wrap').find('#zoom_image').detach();
            if($('#'+objId+'_wrap').find('#large_image').size() <= 0){
                obj.parents('.vg_wrapper').find('.vg_large_picture').append('<img src="'+large_image+'" data-zoom-image="'+zoom_image+'" id="large_image" class="idx_'+class_image+'" alt="large_image" />');
            }
            obj.parents('.vg_wrapper').find("#large_image").elevateZoom({
                zoomWindowWidth:340,
                zoomWindowHeight:500,
                borderSize: 0, 
                zoomType: "inner"
            });
          }
          
          //zoom hovering
        if(options.zoom){
            if(options.zoomtype == "inner"){
                innerZoom(large_image, zoom_image, 0);
            }else if(options.zoomtype == "outer"){
                outerZoom(large_image, zoom_image, 0);
            }
         }
        
        }else{
            obj.parents('.vg_wrapper').html('<span>Image not found.</span>');
        }
         
    }
})(jQuery);
