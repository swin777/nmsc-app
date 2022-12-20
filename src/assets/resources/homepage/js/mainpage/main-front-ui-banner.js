"use strict";
GlobalUtil.displayTitle("국가기상위성센터");

var DATA_SELECT_ATCH = "/homepage/json/base/banner/selectAtchFile.do"
	
var device = {
  agent: navigator.userAgent.toLocaleLowerCase(),
  os: null,
  ver: null,
  init: function init() {
    if (device.agent.indexOf('iphone') > -1 || device.agent.indexOf('ipad') > -1) {
      var str = device.agent.substring(device.agent.indexOf('os') + 3);
      var ver = str.substring(0, str.indexOf(' like'));
      device.os = 'ios';
      device.ver = device.os + ver;
    }

    if (device.agent.indexOf('android') > -1) {
      var _str = device.agent.substring(device.agent.indexOf('android') + 8);

      var strSub = _str.substring(0, _str.indexOf(';'));

      var _ver = strSub.replace(/[.]/gi, '_');

      device.os = 'android';
      device.ver = device.os + _ver;
    }

    device.set();
  },
  set: function set() {
    var html = document.querySelector('html');
    var htmlClass = html.getAttribute('class');
    var trash = '';
    if (device.agent.indexOf('samsung') > -1) trash += ' samsung';
    if (device.agent.indexOf('naver') > -1) trash += ' naver';
    htmlClass ? html.setAttribute('class', htmlClass + ' ' + device.ver + trash) : html.setAttribute('class', device.ver + trash);
  }
};
var findEl = {
  obj: null,
  parent: function parent(el, str) {
    var tag = el.parentNode.tagName.toLowerCase();
    var cls = el.parentNode.classList;
    var id = el.parentNode.getAttribute('id');
    findEl.obj = el.parentNode;

    if (str !== tag && !cls.contains(str) && str != id) {
      if (tag != 'body') {
        findEl.parent(findEl.obj, str);
      } else {
        findEl.obj = null;
      }
    }

    return findEl.obj;
  },
  child: function child(el, str) {
    var arr = [];
    [].forEach.call(el.childNodes, function (obj) {
      if (obj.nodeType == 1) {
        var tag = obj.tagName.toLowerCase();
        var cls = obj.classList;
        var id = obj.getAttribute('id');

        if (str === tag || cls.contains(str) || str === id) {
          arr.push(obj);
        }
      }
    });

    if (arr.length > 0) {
      return arr;
    } else {
      return null;
    }
  },
  prevNode: function prevNode(str) {
    if (str.previousSibling != null) {
      if (str.previousSibling.nodeType == 1) {
        findEl.obj = str.previousSibling;
      } else {
        findEl.prevNode(str.previousSibling);
      }

      return findEl.obj;
    }
  },
  nextNode: function nextNode(str) {
    if (str.nextSibling != null) {
      if (str.nextSibling.nodeType == 1) {
        findEl.obj = str.nextSibling;
      } else {
        findEl.nextNode(str.nextSibling);
      }

      return findEl.obj;
    }
  }
};

var getUrlParams = function getUrlParams() {
  var params = {};
  window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (str, key, value) {
    params[key] = value;
  });
  return params;
};

window.addEventListener('DOMContentLoaded', function () {
  selectViewPopup();
  device.init();
}); // Main UI 

$(function () {
  // 기본 UI컴포넌트들에 대한 스크립트 처리
  $('label.select > select').selectric();

  function gnbSubMore() {
    if ($('.gnb-menu .depth2-menu').children('ul').hasClass('depth3-list')) {
      $('.depth2-menu > a').each(function () {
        if ($(this).next('ul').length > 0) {
          $(this).addClass('more');
        }
      });
    }
  }

  gnbSubMore(); // main visual slide number

  var mainVisual = function mainVisual() {
    $('.main-visual-wrap .swiper-slide').each(function (idx) {
      $(this).addClass('visual-slide' + (idx + 1));
    });
  };

  mainVisual(); // main visual slide

  var mainVisualWrap = $('.main-visual-wrap');
  var mainVisualSlide = new Swiper(mainVisualWrap, {
    initialSlide :1,
    init: false,
    loop: true,
    slidesPerView: 0,
    spaceBetween: 0,
    effect: 'fade',
    keyboard: {
      enabled: true
    },
    on: {
    	update : function(){
	 	  var r_idx = mainVisualSlide.activeIndex;
	  	  var slide = mainVisualSlide.slides[r_idx];
	  	  var href = $(slide).data("href");
	  	  $(".shortcut").attr("href", href);
  		  if(href){
  			  $(".shortcut").show();
  		  }else{
  			  $(".shortcut").hide();
  		  }
    	},
    	slideChange : function(){
    	  var r_idx = mainVisualSlide.activeIndex;
  	  	  var slide = mainVisualSlide.slides[r_idx];
  	  	  var href = $(slide).data("href");
  	  	  $(".shortcut").attr("href", href);
		  if(href){
			  $(".shortcut").show();
		  }else{
			  $(".shortcut").hide();
		  }
    	}

    },
    pagination: {
      el: '.swiper-pagination',
      type: "fraction",
      clickable: true
    },
    navigation: {
      prevEl: ".btn-swiper-arrow.prev",
      nextEl: ".btn-swiper-arrow.next"
    },
    autoplay: {
      delay: 3000,
      disableOnInteraction: false
    },
    resistance: '100%',
    resistanceRatio: 0
  });
  //슬라이드 변경 시 바로가기 링크 변경 이벤트
    mainVisualSlide.on('slideChange', function () { 
	  var r_idx = mainVisualSlide.activeIndex;
      var slide = mainVisualSlide.slides[r_idx];
      var href = $(slide).data("href");
	  $(".shortcut").attr("href", href);
  });
  
  mainVisualSlide.init();
  /* 20210524 삭제 */

  /* $(".main-visual-wrap .btn-swiper-arrow.play").on('click', function(){
  	mainVisualSlide.autoplay.start();
  })
  $(".main-visual-wrap .btn-swiper-arrow.pause").on('click', function(){
  	mainVisualSlide.autoplay.stop();
  }) */

  /* 20210524 추가 */

  var mainVisualBtn = function mainVisualBtn() {
    $('.main-visual-wrap .btn-swiper-arrow.pause').on('click', function () {
      $(this).toggleClass("play_active");
      
      if ($(this).hasClass('play_active')) {
        mainVisualSlide.autoplay.stop();
      } else {
        mainVisualSlide.autoplay.start();
      }
    });
  };

  mainVisualBtn(); // main banner 공지사항

  var mainNoticeSlide = new Swiper('.main-banner-notice', {
    init: false,
    loop: true,
    slidesPerView: 1,
    spaceBetween: 0,
    keyboard: {
      enabled: true
    },
    navigation: {
      prevEl: ".btn-swiper-arrow.prev",
      nextEl: ".btn-swiper-arrow.next"
    },
    autoplay: {
      delay: 3000,
      disableOnInteraction: false
    },
    resistance: '100%',
    resistanceRatio: 0
  });
  mainNoticeSlide.init();
  //loadSlide();
  //loadBanner();
  function loadSlide() {
	    Ajax.getData(
	    		"/homepage/json/base/bbs/slideBbs.do", {
	    			bbsCd: ["00237", "00239", "00026"] //메인페이지 게시판 슬라이드 게시판코드
	        },

	        function successHandler(data, status, request, form) {
	            if (!data.data || data.data.length == 0) {
	            	
	            } else {
	            	var content = [];
	            	var length = data.data.length;
	            	
	            	for (var i = 0; i < length; i++) {
	            		var info = data.data[i];
	            		
	            		content.push ("<div class='swiper-slide'>" +
	                    				"<h3 class='tit'>"+info.TABLE_NAME+"</h3>" +
	                    				"<a href='/homepage/html/base/bbs/selectBbs.do?bbsCd="+info.BBS_CD+"&bbsUsq="+info.BBS_USQ+"' class='notice-link'>" +
	                    				"<strong class='noti-tit'>"+info.TITLE+"</strong>" +
                						"<span class='noti-date'>"+info.REG_DATE+"</span>" +
										"</a></div>");
	                }
	            	mainNoticeSlide.appendSlide(content);
	            	mainNoticeSlide.update();
	            }
	            // 오류가 발생한 경우
	            if (data.error) {
	                // 오류를 처리한다.
	                handleError(request, status, data.error);

	                // 로딩 마스크를 숨긴다.
	                hideLoadingMask();

	                return;
	            }
	        }
	    );
	}
  
  function loadBanner() {
	    Ajax.getData(
	    		"/homepage/json/base/banner/listBanner.do", {},
	        function successHandler(data, status, request, form) {
                var content = [];
                var length = data.data.length;
                var style = ''
                var mStyle = '@media screen and (max-width: 767px) {'
                if( data.data ){
                    $.each( data.data, function(i, banner) {
                        var _usq = banner['BANNER_USQ'];
                        var _id = 'slide_' + _usq;
                        var _title = ( banner['TITLE'] || '' ).replace(/\n/gi,"<br>");
                        var _contents = ( banner['CONTENTS'] || '' ).replace(/\n/gi,"<br>");
                        var _copyright = ( banner['COPYRIGHT'] || '' ).replace(/\n/gi,"<br>");
                        var _style = JSON.parse( banner['STYLE'] );
                        var _files = banner['files'];
                        var _element =  $( '<div class="swiper-slide" >' ).attr( { 'name' :  _id, 'data-href' : banner['LINK'] } );
                        var _tit = $( '<strong class="tit">' ).html(  _title ).css( _style.title );
                        var _cnt = $( '<span class="txt">' ).html(  _contents ).css( _style.contents );
                        var _copy = $( '<p class="txt-caption">' ).html(  _copyright ).css( _style.copyright );
                        var bgUrl = null, mBgUrl = null;

                        _element.append( $( '<div class="swiper-inner" >' ).append( $( '<h2 class="desc">' ).append( _tit, _cnt ), _copy ) );

                        //#eaeaea
                        $.each( _files, function( i, file ){
                            if( file.filePath.indexOf( 'main/mobile' ) < 0 ) {
                                bgUrl = DATA_SELECT_ATCH+"?refTbUsq=" + _usq + "&attachFileUsq=" + file.attachFileUsq; /*refTbCd=main_banner&*/
                            }else{
                                mBgUrl = DATA_SELECT_ATCH+"?refTbUsq=" + _usq + "&attachFileUsq=" + file.attachFileUsq; /*refTbCd=main_banner&*/
                            }
                        });
                        if( bgUrl )  style += " .main-wrap .main-visual-wrap .swiper-slide[name=" + _id + "]{ background: #eaeaea url('" + bgUrl + "'); background-size:cover; }"
                        if( mBgUrl )  mStyle += " .main-wrap .main-visual-wrap .swiper-slide[name=" + _id + "] { background: #eaeaea url('" + mBgUrl + "'); background-size:cover; }"

                        content.push (_element[0]);
                    });
                }

                mStyle += '}'

                $( '.slide-style' ).append( $( '<style>' ).html( style + mStyle ) );

                mainVisualSlide.appendSlide(content);
                mainVisualSlide.update();

                // 오류가 발생한 경우
                if (data.error) {
                    // 오류를 처리한다.
                    handleError(request, status, data.error);

                    // 로딩 마스크를 숨긴다.
                    hideLoadingMask();

                    return;
                }
	        }
	    );
	}
  /* 20210524 삭제 */

  /* $(".main-banner-notice .btn-swiper-arrow.play").on('click', function(){
  	mainNoticeSlide.autoplay.start();
  })
  $(".main-banner-notice .btn-swiper-arrow.pause").on('click', function(){
  	mainNoticeSlide.autoplay.stop();
  }) */

  /* 20210524 추가 */

  var mainBannerNoticeBtn = function mainBannerNoticeBtn() {
    $('.main-banner-notice .btn-swiper-arrow.pause').on('click', function () {
      $(this).toggleClass("play_active");

      if ($(this).hasClass('play_active')) {
        mainNoticeSlide.autoplay.stop();
      } else {
        mainNoticeSlide.autoplay.start();
      }
    });
  };

  mainBannerNoticeBtn(); // main gnb 
  

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
      $(this).find(".depth2-list").show();
      $(this).find(".sub-depth-wrap").show();
      slogan.show();
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
      depth1.not($(this).parent()).find(".depth2-list").hide();
      depth1.not($(this).parent()).find(".sub-depth-wrap").hide();
      $(this).parent().find(".depth2-list").show();
      $(this).parent().find(".sub-depth-wrap").show();
      depth1link.removeClass('active');
      $(this).addClass('active');
    }
  });
  depth2link.on('click', function () {
    if (window.innerWidth <= mobileWidth) {
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
          $(this).parent().find(".depth2-list").show();
          $(this).parent().find(".sub-depth-wrap").show();
        }

        if (!isActive) {
          depth1link.eq(0).addClass('active');
          depth1link.eq(0).parent().find(".depth2-list").show();
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
});
//# sourceMappingURL=main-front-ui.js.map
