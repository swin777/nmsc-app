$(function(){
	// Fix: Placeholder polyfill.
	$('form').placeholder();

	if ($('.filebox').length) {
		$(document).on('change','.filebox .upload-hidden',function(){  // 값이 변경되면
			if(window.FileReader){  // modern browser
				var filename = $(this)[0].files[0].name;
			}
			else {  // old IE
				var filename = $(this).val().split('/').pop().split('\\').pop();  // 파일명만 추출
			}

			// 추출한 파일명 삽입
			$(this).siblings('.upload-name').val(filename);
		});
	};

	// select box
	var select = $("select");
	select.change(function(){
		if(!$(this).hasClass("NO-CHG-LABEL")){
			var select_name = $(this).children("option:selected").text();
			$(this).siblings("label").text(select_name);
		}
	});

	//웹 접근성 관련 현재 활성화된 select에 표기시켜 준다.
	var $rootElem = $('#content');
    $rootElem.on('focus','select', function(){
		$(this).parent('.select-style').addClass('active');
	});

    $rootElem.on('blur', 'select', function(){
        $(this).parent('.select-style').removeClass('active');
    });

	// top button
	topBtn();
	function topBtn(){
		var top = $('.btn-top');
		$(window).scroll(function(){
			if($(this).scrollTop() > 200){
					top.fadeIn();
			}else{
				top.fadeOut();
			}
		});
		top.on('click', function(){
			$('body, html').animate({
				scrollTop:0
			},800);
			return false;
		})
	}
	siteLink();
	function siteLink(){
		$('.site-link>a').on('mouseover click', function(){
			$(this).next('.site-list').addClass('on');

			return false;
		})
		$('.site-link').on('mouseleave click', function(){
			$('.site-list').removeClass('on');

			return false;
		})
	}
	mainTab();
	function mainTab(){
		var btn = $('.btn-tab'),
			 tab = $('.tabs');
		btn.each(function(){
			$(this).on('click', function(){
				tab.removeClass('on');
				if(!$(this).parents('.tabs').hasClass('on')){
					$(this).parent().parent('.tabs').addClass('on').trigger("tabClick");
				}
			})
		})
	}

	mainSlide();
	function mainSlide(){
		$('.one-time').slick({
			dots: true,
			infinite: true,
			speed: 300,
			slidesToShow: 1,
			adaptiveHeight: true,
		});
	}

	searchAll();
	function searchAll(){
		$('.search-wrap .btn-search').on('click', function(){
			$('.search-form').animate({
				opacity:1,
			})
			$(this).parent('.search-wrap').addClass('open');
		})
		$('.search-wrap .btn-x').on('click', function(){
			$('.search-form').animate({
				opacity:0,
			})
			$(this).parents().find('.search-wrap').removeClass('open');
		})
	}

	layerPopup();
	function layerPopup(){
		var btn = $(".btn-layer");
		btn.on('click', function(){
			var $href = $(this).attr('href');
			popup($href);
		})
		function popup(el){
			var $el = $(el);
			var isDim = $el.prev().hasClass('layer-bg');
			$el.fadeIn();
			var $elWidth = ~~($el.outerWidth()),
				 $elHeight = ~~($el.outerHeight()),
				 docWidth = $(document).width(),
				 docHeight = $(document).height();

			// 화면의 중앙에 레이어를 띄운다.
			if ($elHeight < docHeight || $elWidth < docWidth) {
				$el.css({
					marginTop: -$elHeight /2,
					marginLeft: -$elWidth/2
				})
			} else {
				$el.css({top: 0, left: 0});
			}
			$el.find('a.btn-close').on('click', function(){
				isDim ? $('.layer-bg').fadeOut() : $el.fadeOut();
				return false;
			})
		}
	}

});


/* 221207 오세인추가 */

$(document).ready(function(){
	var tabBtn = $(".tab-btn > ul > li");
	var tabCont = $(".tab-cont > .tab");
	
	tabCont.hide().eq(0).show();
	
	tabBtn.click(function(e){
		e.preventDefault();
		var target = $(this);
		var index = target.index();
		tabBtn.removeClass("active");
		target.addClass("active");
		tabCont.css("display","none");
		tabCont.eq(index).css("display","block");
	});


	$(".layerPopup").click(function(e){
		e.preventDefault();
		$(".layer").show();
	}); 
	$(".layer .close").click(function(e){
		e.preventDefault();
		$(".layer").hide();
	});

	
});

