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
            zoom : true,
            zoomtype : "inner",                 //outer, inner
            thumbnail : 3,
            pagination : true,
            arrow : true,
            scroll : 'horizontal',              //horizontal, vertical
            speed : 1000,
            hyperlink : false,
            link_next_image : false,
            show_title : false,
            hoverpause : true,
            pause : 5000,
            arrow_next_image : false,
            large_picture_position : 'bottom'

        }
        var options = $.extend(defaults, options);
        
        var object = $(this);
        var object_id = $(this).attr('id');
        var total_thumb = object.children('li').length;
        
        if($("#"+object_id+"_wrap").length <= 0){
            object.wrap('<div class="vg_wrapper" id="'+object_id+'_wrap"></div>');
        }
        
        if(total_thumb > 0){
        //create thumbnail
        if($("#"+object_id+"_wrap").find('.vg_list_wrapper').length <= 0){
            object.wrap('<div class="vg_list_wrapper"></div>');
        }
        var thumb = object.children('li');
        var x = 0;
        thumb.each(function(){
            $(this).addClass('idx_'+x);
            x++;
        });
        object.find('li:first').addClass('first');
        
        var margin_val = 0;
        if(options.scroll == 'horizontal'){
            object.find('li').addClass('vg_horizontal');
            var ul_width = 0;
            var wrap_width = 0;
            var i = 0;
            var last_tn_margin = parseInt(object.find('li:last').css('marginRight'));
            thumb.each(function(){
                var margin_right = parseInt($(this).css('marginRight'));
                margin_val = margin_right;
                ul_width += $(this).outerWidth() + margin_right;
                if( i < options.thumbnail){
                    if( i==(options.thumbnail - 1)){
                        margin_right = 0;
                    }
                    wrap_width += $(this).outerWidth() + margin_right;
                }
                
                i++;
            });
             object.css('width',ul_width);
             object.parent('.vg_list_wrapper').css('width',wrap_width);
        }else if(options.scroll == 'vertical'){
            object.find('li').addClass('vg_vertical');
            var ul_height = 0;
            var wrap_height = 0;
            var i = 0;
            var last_tn_margin = parseInt(object.find('li:last').css('marginBottom'));
            thumb.each(function(){
                var margin_bottom = parseInt($(this).css('marginBottom'));
                margin_val = margin_bottom;
                ul_height += $(this).outerHeight() + margin_bottom;
                if( i < options.thumbnail){
                    if( i==(options.thumbnail - 1)){
                        margin_bottom = 0;
                    }
                    wrap_height += $(this).outerHeight() + margin_bottom;
                }
                i++;
            });
             object.css('width',ul_height);
             object.parent('.vg_list_wrapper').css('height',wrap_height);
        }
        //default active thumbnail
        object.find('li:first').addClass('active');

        if(options.image_effect == 'border'){
            var img = object.find('img');
            var border_default = img.css('border');
            img.hover(function(){
               $(this).css('border',options.border_value); 
            },function(){
                $(this).css('border',border_default); 
            });
        }

        //create arrow to scroll
        if($('#'+object_id+'_wrap').find('.vg_control').size() <=0 ){
            object.parents('.vg_wrapper').append('<div class="vg_control"><div class="vg_prev_nav"><a href="/" class="vg_prev">Prev</a></div><div class="vg_next_nav"><a href="/" class="vg_next">Next</a></div></div>');
        }
        
        var animate_width = 0;
        var animate_height = 0;
        var animate_back_width = 0;
        var animate_back_height = 0;
        $("body").on("click", "a.vg_next",function(event){
            event.preventDefault();
            var parent_class = $(this).parent();
            if(!parent_class.hasClass('disabled')){
                if(options.scroll == 'horizontal' && !object.is(':animated')){
                    var now_position = parseInt(object.css('left'));
                    animate_width = wrap_width -(now_position);
                    object.animate({"left": -(animate_width + margin_val)}, 
                    options.speed,
                    function(){
                        setPosition();
                        if(options.autoscroll){
                            nextLoop(); 
                        } 
                    });
                }else{
                    var now_position = parseInt(object.css('top'));
                    animate_height = wrap_height -(now_position);
                    object.animate({"top": -(animate_height + margin_val)}, 
                    options.speed,
                    function(){
                        setPosition();
                    });
                }
            }
        });
        $("body").on("click", "a.vg_prev",function(event){
            event.preventDefault();
            var parent_class = $(this).parent();
            if(!parent_class.hasClass('disabled')){
                if(options.scroll == 'horizontal' && !object.is(':animated')){
                    var now_position = parseInt(object.css('left'));
                    animate_back_width = now_position + wrap_width;
                    object.animate({"left": animate_back_width + margin_val}, 
                    options.speed,
                    function(){
                        setPosition();
                    });
                }else{
                    var now_position = parseInt(object.css('top'));
                    animate_back_height = now_position + wrap_height;
                    object.animate({"top": animate_back_height + margin_val}, 
                    options.speed,
                    function(){
                        setPosition();
                    });
                }
            }
        });
        
        //default nav before setPosition
        var last_position = Math.ceil(total_thumb / options.thumbnail);
        var next_nav = object.parents('.vg_wrapper').find('.vg_next_nav');
        var prev_nav = object.parents('.vg_wrapper').find('.vg_next_nav');
            
        prev_nav.addClass('disabled');
        if(last_position <= 1){
            next_nav.addClass('disabled').removeClass('active');
        }else{
            prev_nav.removeClass('disabled').addClass('active');
        }
        
        //cek position
        function setPosition(){
            var position = object.position();
            
            if(position.left != 0){
                object.find('li').removeClass('first');
            }
            if(options.scroll=='horizontal'){
                var left_position = parseInt(object.css('left'));
                var new_ul_width = object.width();
                var left_remain = (new_ul_width - (parseInt(object.css('left')) * -1)) - last_tn_margin;
                
                if(wrap_width >= left_remain){
                    next_nav.addClass('disabled').removeClass('active');
                    prev_nav.removeClass('disabled').addClass('active');
                }else{
                    next_nav.removeClass('disabled').addClass('active');
                    prev_nav.removeClass('disabled').addClass('active');
                }
                if(left_position == 0){
                    next_nav.removeClass('disabled').addClass('active');
                    prev_nav.removeClass('active').addClass('disabled');
                }
            }else{
                var top_position = parseInt(object.css('top'));
                var new_ul_height = object.height();
                var top_remain = (new_ul_height - (parseInt(object.css('top')) * -1)) - last_tn_margin;
                if(wrap_height >= top_remain){
                    next_nav.removeClass('active').addClass('disabled');
                    prev_nav.removeClass('disabled').addClass('active');
                }else{
                    next_nav.removeClass('disabled').addClass('active');
                    prev_nav.removeClass('disabled').addClass('active');
                }
                if(top_position == 0){
                    next_nav.removeClass('active').addClass('disabled');
                    prev_nav.removeClass('disabled').addClass('active');
                }
            }
            
        }
        
        //default display large picture
        if(options.large_picture_position == 'top'){
            if($('#'+object_id+'_wrap').find('.vg_large_picture').size() <= 0 ){
                $('#'+object_id+'_wrap').prepend('<div class="vg_large_picture"></div>');
            }
        }else{
            if($('#'+object_id+'_wrap').find('.vg_large_picture').size() <= 0 ){
                $('#'+object_id+'_wrap').append('<div class="vg_large_picture"></div>');
            }
        }
        var large_image = object.find('li:first').children().attr('data-full');
        if(options.hyperlink){
            var link = object.find('li:first').children().attr('href');
            var next_id = '';
            if(options.link_next_image){
                next_id = 'id="to_next"';
            }
            if($('#'+object_id+'_wrap').find('#large_image').size() <= 0){
                object.parents('.vg_wrapper').find('.vg_large_picture').append('<a href="'+link+'" '+next_id+'><img src="'+large_image+'" id="large_image" alt="large_image" class="idx_0"/></a>');
            }
        }else{
            if(options.link_next_image){
                if($('#'+object_id+'_wrap').find('#large_image').size() <= 0){
                    object.parents('.vg_wrapper').find('.vg_large_picture').append('<a href="/" id="to_next"><img src="'+large_image+'" id="large_image" alt="large_image" class="idx_0"/></a>');
                }
            }else{
                if($('#'+object_id+'_wrap').find('#large_image').size() <= 0){
                    object.parents('.vg_wrapper').find('.vg_large_picture').append('<img src="'+large_image+'" id="large_image" alt="large_image" class="idx_0"/>');
                }
            } 
        }
        object.parents('.vg_wrapper').find('.vg_large_picture').fadeIn('slow');
        
        
        //default show title
        if(options.show_title){
            if(options.large_picture_position == 'top'){
                object.parents('.vg_wrapper').prepend('<div class="show_title"></div>');
            }else{
                object.parents('.vg_wrapper').append('<div class="show_title"></div>');
            }
            var title_photo = object.find('li:first').find('img').attr('alt');
            if(options.hyperlink){
                if(link != ""){
                    object.parents('.vg_wrapper').find('.show_title').html('<a href="'+link+'">'+title_photo+'</a>');
                }else{
                    object.parents('.vg_wrapper').find('.show_title').html(title_photo);
                }
            }else{
                object.parents('.vg_wrapper').find('.show_title').html(title_photo);
            }
            object.parents('.vg_wrapper').find('.show_title').fadeIn('slow');
        }
        
        //default zoom picture
        if(options.zoom){
            var zoom_image = object.find('li:first').children().attr('data-zoom');
            if($('#'+object_id+'_wrap').find('#zoom_image').size() <= 0){
                object.parents('.vg_wrapper').find('.vg_large_picture').append('<img src="'+zoom_image+'" id="zoom_image" alt="zoom_image" />');
            }
        }      
        
        //thumbnail click to large pic
        object.find('a').on("click",function(e){
            e.preventDefault();
            var large_pic = $(this).attr('data-full');
            var zoom_image = $(this).attr('data-zoom');
            var this_class = $(this).parent('li').attr('class');
            object.find('li').removeClass('active');
            $(this).parent('li').addClass('active');
            var split_class = this_class.split(" ");
            var idx = split_class[0].replace("idx_","");
            if(options.hyperlink){
                var link_tn = $(this).attr('href');
            }
            if(options.show_title){  
                var title_photo_tn = $(this).find('img').attr('alt');
                object.parents('.vg_wrapper').find('.show_title').fadeOut('slow', function(){
                    object.parents('.vg_wrapper').find('.show_title').empty();
                    if(options.hyperlink){
                        if(link_tn != ""){
                            object.parents('.vg_wrapper').find('.show_title').html('<a href="'+link_tn+'">'+title_photo_tn+'</a>');
                        }else{
                            object.parents('.vg_wrapper').find('.show_title').html(title_photo_tn);
                        }
                    }else{
                        object.parents('.vg_wrapper').find('.show_title').html(title_photo_tn);
                    }
                    object.parents('.vg_wrapper').find('.show_title').fadeIn('slow');
                });   
            }
            
            object.parents('.vg_wrapper').find('.vg_large_picture').fadeOut('slow',function(){
                object.parents('.vg_wrapper').find('#large_image').detach();
                if(link_tn !="" && link_tn != undefined){
                    if(options.link_next_image){
                        object.parents('.vg_wrapper').find('#to_next').detach();
                    }
                    if($('#'+object_id+'wrap').find('#large_image').size <= 0){
                        object.parents('.vg_wrapper').find('.vg_large_picture').append('<a href="'+link_tn+'" '+next_id+'><img src="'+large_pic+'" id="large_image" alt="large_image" class="idx_'+idx+'" /></a>'); 
                    }
                    
                } else{
                    if(options.link_next_image){
                        if($('#'+object_id+'wrap').find('#large_image').size <= 0){
                            object.parents('.vg_wrapper').find('.vg_large_picture').append('<a href="/" id="to_next"><img src="'+large_pic+'" id="large_image" alt="large_image" class="idx_'+idx+'" /></a>'); 
                        }
                    }else{
                        if($('#'+object_id+'wrap').find('#large_image').size <= 0){
                            object.parents('.vg_wrapper').find('.vg_large_picture').append('<img src="'+large_pic+'" id="large_image" alt="large_image" class="idx_'+idx+'" />'); 
                        }
                    }  
                }
                object.parents('.vg_wrapper').find('.vg_large_picture').fadeIn('slow',function(){
                    if(options.zoom){
                        if(options.zoomtype == "inner"){
                            object.parents('.vg_wrapper').find('.vg_large_picture').append('<img src="'+zoom_image+'" id="zoom_image" alt="zoom_image" />');
                            innerZoom(large_pic, zoom_image, idx);
                        }else if(options.zoomtype == "outer"){
                            object.parents('.vg_wrapper').find('.vg_large_picture').append('<img src="'+zoom_image+'" id="zoom_image" alt="zoom_image" />');
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
                
                var now_position = Math.ceil((next_idx) / options.thumbnail);
                var next_position = Math.ceil((next_idx + 1) / options.thumbnail);

                if(next_position > now_position){ 
                      $('a.vg_next').click();         
                }
          });
        }
        
        //arrow next image
        if(options.arrow_next_image){
            if ($('#'+object_id+'_wrap').find('.inner_control').size() <= 0){
                object.parents('.vg_wrapper').find('.vg_large_picture').append('<div class="inner_control"></div>');
                object.parents('.vg_wrapper').find('.inner_control').append('<a href="/" class="vg_prev_pic">Prev</a><a href="/" class="vg_next_pic">Next</a>');
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
            $('#'+object_id+'_wrap').find('#large_image').detach();
            $('#'+object_id+'_wrap').find('#zoom_image').detach();
            if($('#'+object_id+'_wrap').find('#large_image').size() <= 0){
                object.parents('.vg_wrapper').find('.vg_large_picture').append('<img src="'+large_image+'" data-zoom-image="'+zoom_image+'" id="large_image" class="idx_'+class_image+'" alt="large_image" />');
            }
            object.parents('.vg_wrapper').find("#large_image").elevateZoom({
                zoomType: "inner",
                cursor: "crosshair",
                zoomWindowWidth:300, 
                zoomWindowHeight:100
            });
          }
          
          //outer zoom function with elevate zoom
        var outerZoom = function(large_image, zoom_image, class_image){ 
            $('#'+object_id+'_wrap').find('#large_image').detach();
            $('#'+object_id+'_wrap').find('#zoom_image').detach();
            if($('#'+object_id+'_wrap').find('#large_image').size() <= 0){
                object.parents('.vg_wrapper').find('.vg_large_picture').append('<img src="'+large_image+'" data-zoom-image="'+zoom_image+'" id="large_image" class="idx_'+class_image+'" alt="large_image" />');
            }
            object.parents('.vg_wrapper').find("#large_image").elevateZoom({
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
            object.parents('.vg_wrapper').html('<span>Image not found.</span>');
        }
         
    }
})(jQuery);
