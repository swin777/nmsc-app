
$(function(){
	
	removeEvent();
	
	//gnb();
	
	innerTab();
	$(window).scroll(function(){
		sticky();

	});
});

function removeEvent() {
	$('#gnb li,#gnb a,#gnb div').off('mouseover mouseout mouseleave focus blur click');
}

function gnb(){
	
	  var newGnb = $('#new-gnb');
	  var slogan = $('.gnb-menu > .slogan');
	  var depth1 = $('.depth1-list > li');
	  var depth2 = $('.depth2-list > li');
	  var depth1link = $('.depth1-list > li > a');
	  var depth2link = $('.depth2-list > li > a');
	  var mobileWidth = 767;
	  
	  depth1.on('mouseover', function () {
	    if (window.innerWidth > mobileWidth) {
	      depth1.not($(this)).find(".depth2-list").hide();
	      depth1.not($(this)).find(".sub-depth-wrap").hide();
	      //$(this).find(".depth2-list").show();
	      $(this).find(".depth2-list").attr('style', '');
	      $(this).find(".sub-depth-wrap").show();
	      slogan.show();
	      if($(this).find(".depth2-list").length < 1){
	    	  slogan.hide();
	      }
	    }
	  });
	  newGnb.on('mouseout', function () {
	    if (window.innerWidth > mobileWidth) {
	      $(".depth2-list").hide();
	      $('.sub-depth-wrap').hide();
	      slogan.hide();
	    }
	  });
	  depth1link.on('click', function () {
	    if (window.innerWidth <= mobileWidth) {
	      event.preventDefault();
	      depth1.not($(this).parent()).find(".depth2-list").hide();
	      depth1.not($(this).parent()).find(".sub-depth-wrap").hide();
	      //$(this).parent().find(".depth2-list").show();
	      $(this).parent().find(".depth2-list").attr('style', '');
	      $(this).parent().find(".sub-depth-wrap").show();
	      depth1link.removeClass('active');
	      $(this).addClass('active');
	    }
	  });
	  depth2link.on('click', function () {
	    if (window.innerWidth <= mobileWidth) {
	      event.preventDefault();
	      if ($(this).parent().hasClass('open')) {
	        $(this).parent().removeClass('open');
	      } else {
	        $(this).parent().addClass('open');
	      }
	    }
	  });
	  $('.btn-all-menu').on('click', function () {
	    $('.gnb-wrap').addClass('open');

	    if (isMobileScreen) {
	      depth1link.each(function () {
	        var isActive = false;

	        if ($(this).hasClass('active')) {
	          isActive = true;
//	          $(this).parent().find(".depth2-list").show();
	          $(this).parent().find(".depth2-list").attr('style', '');
	          $(this).parent().find(".sub-depth-wrap").show();
	        }

	        if (!isActive) {
	          depth1link.eq(0).addClass('active');
//	          depth1link.eq(0).parent().find(".depth2-list").show();
	          depth1link.eq(0).parent().find(".depth2-list").attr('style', '');
	          depth1link.eq(0).parent().find(".sub-depth-wrap").show();
	        }
	      });
	    }
	  });
	  $('.btn-all-close').on('click', function () {
	    $('.gnb-wrap').removeClass('open');
	  });
	  var isMobileScreen = window.innerWidth > mobileWidth ? false : true;
	  $(window).resize(function () {
	    if (window.innerWidth > mobileWidth) {
	      // PC
	      if (isMobileScreen) {
	        console.log('pc');
	        depth1link.removeClass('active');
	        depth1link.blur();
	      }

	      isMobileScreen = false;
	    } else {
	      // 모바일
	      if (!isMobileScreen) {
	        $('.gnb-wrap').removeClass('open');
	      }

	      isMobileScreen = true;
	    }
	  });
	  siteLink();
	  gnbSubMore(); // main visual slide number
}

function gnbSubMore() {
    if ($('.gnb-menu .depth2-menu').children('ul').hasClass('depth3-list')) {
      $('.depth2-menu > a').each(function () {
        if ($(this).next('ul').length > 0) {
          $(this).addClass('more');
        }
      });
    }
  }
  
function siteLink() {
    $('.site-link > a').on('mouseover click', function () {
      $(this).next('ul').addClass('open');
      var linkCategory = $(this).attr('href');
      
      $.ajax({
			dataType : "json",
			url : "/homepage/json/base/code/listCommonCode.do",
			async : false,
			data : {
				prntCd : linkCategory
			},
			success : function(data, status, reaus) {
				var list = $('.site-link ul');
				list.empty();
				
				if (data.data) {
					$(data.data).each(function(idx, ele){
						
						if(idx == 0){
							$('.site-address>a').attr('href', this.ETC_1_CD);
							$('.site-address>a').text(this.NAME);
						}
						
						var link = $("<li><a href="+this.ETC_1_CD+" target='_blank'>"+this.NAME+"</a></li>");
						link.on('click', function(){
							var $targetInfo = $(this).find('a');
							var $siteLinkInfo = $('.site-address>li>a');

							$siteLinkInfo.attr('href',$targetInfo.attr('href'));
							$siteLinkInfo.text($targetInfo.text())
							window.open($('.site-address>li>a').attr("href"), "target");
							$('site-address').removeClass('on');
							return false;
						});
						list.append(link);
					});
				}
			}
		});
      return false;
    });
    $('.site-link').on('mouseleave click', function () {
      $('.site-link > ul').removeClass('open');
      return false;
    });
  }

function gnbEng(){

	/*var gnb = $('#gnb');

	var depth1 = $('.depth1-list > li');
	var depth2 = $('.depth2-list > li');
	var depth3 = $('.depth3-list > li');
	var button = $('.menuBtn'); 

	gnb.on('mouseout',function(e){
		depth1.removeClass("on");
        $('li.MENU-ITEM-CD-' + DEPT1_MNU_CD).addClass('on');
		$(".depth2-list").hide();
	});
    
    depth1.on('mouseover', function(e){
    	
    	depth1.not($(this)).find(".depth2-list").hide();    	
    	depth1.not($(this)).removeClass("on");
    	
    	$(this).find(".depth2-list").show();  
    	$(this).addClass("on");
    	
    	$('li.MENU-ITEM-CD-' + DEPT1_MNU_CD).addClass('on');
    	
    });
    
    $(".depth1-list > li > a").on('focusin',function(e){
    	depth1.not($(this)).find(".depth2-list").hide();    	
    	depth1.not($(this)).removeClass("on");
    	
    	$(this).parent().find(".depth2-list").show();  
    	$(this).parent().addClass("on");
    	
    	$('li.MENU-ITEM-CD-' + DEPT1_MNU_CD).addClass('on');
    });
    
    button.on('click', function(){
    	
    	if($(".depth1-list").is(":visible")){
    		$(".depth1-list").css('display','none');
    	}else{
    		$(".depth1-list").css('display','block');
    	}
    	
    	if($("#topmenu").is(":visible")){
    		$("#topmenu").css('display','none');
    	}else{
    		$("#topmenu").css('display','block');
    	}
    	

    });*/
	$('label.select > select').selectric();

	  var newGnb = $('#new-gnb');
	  var depth1 = $('.depth1-list > li');
	  var depth2 = $('.depth2-list > li');
	  var depth1link = $('.depth1-list > li > a');
	  var depth2link = $('.depth2-list > li > a');
	  var depth2Menu = $('.depth2-menu');
	  var mobileWidth = 767;

	  function gnbDepthFlex() {
	    depth2Menu.each(function (i) {
	      if ($(this).children().hasClass('depth3-list')) {
	    	  $(this).parent().addClass('flex-item');
	      }
	    });
	  }

	  depth1.on('mouseover', function () {
	    if (window.innerWidth > mobileWidth) {
	      depth1.not($(this)).find(".depth2-list").hide();
	      depth1.not($(this)).find(".sub-depth-wrap").hide();
	      $(this).find(".depth2-list").show();
	      $(this).find(".sub-depth-wrap").show();
	      gnbDepthFlex();
	    }
	  });
	  newGnb.on('mouseout', function () {
	    if (window.innerWidth > mobileWidth) {
	      $(".depth2-list").hide();
	      $('.sub-depth-wrap').hide();
	    }
	  });
	  depth1link.on('click', function () {
	    
	    if (window.innerWidth <= mobileWidth) {
	      /*depth1.not($(this).parent()).find(".depth2-list").hide();
	      depth1.not($(this).parent()).find(".sub-depth-wrap").hide();
	      $(this).parent().find(".depth2-list").show();
	      $(this).parent().find(".sub-depth-wrap").show();
	      depth1link.removeClass('active');
	      $(this).addClass('active');*/
    	  event.preventDefault();
	      depth1.not($(this).parent()).find(".depth2-list").hide();
	      depth1.not($(this).parent()).find(".sub-depth-wrap").hide();
	      //$(this).parent().find(".depth2-list").show();
	      $(this).parent().find(".depth2-list").attr('style', '');
	      $(this).parent().find(".sub-depth-wrap").show();
	      depth1link.removeClass('active');
	      $(this).addClass('active');
	    }
	  });
	  depth2link.on('click', function () {
	    /*if (window.innerWidth <= mobileWidth) {
	      if ($(this).parent().hasClass('open')) {
	        $(this).parent().removeClass('open');
	      } else {
	        $(this).parent().addClass('open');
	      }
	    }*/
		  if (window.innerWidth <= mobileWidth) {
		      //event.preventDefault();
		      if ($(this).parent().hasClass('open')) {
		        $(this).parent().removeClass('open');
		      } else {
		        $(this).parent().addClass('open');
		      }
		    }
	  });
	  
	  depth2Menu.find('a').on('click', function () {
		  if (window.innerWidth <= mobileWidth) {
			  if ($(this).hasClass('more')) {
				  	event.preventDefault();
		      }
		    }
	  });
	  
	  $('.btn-all-menu').on('click', function () {
	    $('.gnb-wrap').addClass('open');
	    $('body').css('position', 'fixed');

	    if (isMobileScreen) {
	      depth1link.each(function () {
	        var isActive = false;

	        /*if ($(this).hasClass('active')) {
	          isActive = true;
	          $(this).parent().find(".depth2-list").show();
	          $(this).parent().find(".sub-depth-wrap").show();
	        }

	        if (!isActive) {
	          depth1link.eq(0).addClass('active');
	          depth1link.eq(0).parent().find(".depth2-list").show();
	          depth1link.eq(0).parent().find(".sub-depth-wrap").show();
	        }*/
	        if ($(this).hasClass('active')) {
		          isActive = true;
//		          $(this).parent().find(".depth2-list").show();
		          $(this).parent().find(".depth2-list").attr('style', '');
		          $(this).parent().find(".sub-depth-wrap").show();
		        }

		        if (!isActive) {
		          depth1link.eq(0).addClass('active');
//		          depth1link.eq(0).parent().find(".depth2-list").show();
		          depth1link.eq(0).parent().find(".depth2-list").attr('style', '');
		          depth1link.eq(0).parent().find(".sub-depth-wrap").show();
		        }
	      });
	    }
	  });
	  $('.btn-all-close').on('click', function () {
	    $('.gnb-wrap').removeClass('open');
	    $('body').css('position', 'static');
	  });
	  var isMobileScreen = window.innerWidth > mobileWidth ? false : true;
	  $(window).resize(function () {
	    if (window.innerWidth > mobileWidth) {
	      // PC
	      if (isMobileScreen) {
	        console.log('pc');
	        depth1link.removeClass('active');
	        depth1link.blur();
	      }

	      isMobileScreen = false;
	    } else {
	      // 모바일
	      if (!isMobileScreen) {
	        $('.gnb-wrap').removeClass('open');
	      }

	      isMobileScreen = true;
	    }
	  });
	  gnbSubMore();
}

//sticky
function sticky(){
	var winTop = $(window).scrollTop();
	if(winTop >= 60){
		$(".depth2").addClass('sticky');
	}else{
		$(".depth2").removeClass('sticky');
	}
}
//tab
function innerTab(){
	$( ".tab>li>a" ).each(function(){
		$(this).on('click', function(){
			$(this).parent().addClass("on").siblings().removeClass("on");
			return false;
		});
	});

}