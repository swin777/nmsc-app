var $menuInfo; 

var SYS = {
    status: {
        isMobileScreen: window.innerWidth > 767 ? false : true
    }
}

//manage 전용 공통 js
$(document).ready(function() {
	
	initializeValidator();	// jquery validator 초기화
	
	mnuInitHelper.loadMenuInfo();
	
	SiteLink.init();
	
	initCommonEventBind();
	
	initDatePicker();
	
});

function initDatePicker(){
	var options = $.datepicker.regional["ko"];
	options.dateFormat = 'yy-mm-dd';
	options.prevText = '이전달';
	options.nextText = '다음달';
	options.monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
	options.monthNamesShort = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
	options.dayNames= ['일', '월', '화', '수', '목', '금', '토'];
	options.dayNamesShort= ['일', '월', '화', '수', '목', '금', '토'];
	options.dayNamesMin= ['일', '월', '화', '수', '목', '금', '토'];
	options.showMonthAfterYear= true;
	options.yearSuffix= '년';
	options.buttonImage= "/resources/homepage/images/icon/icon-datepicker.png";
	options.buttonImageOnly= true;
	options.showOn= "focus";
	$.datepicker.setDefaults(options);
	
	$(".datePicker").each(function(){
		$(this).datepicker();
	});
}



function initCommonEventBind(){
	//프린트 이벤트 바인드
	$(".PRINT-BTN").bind("click", printContainerArea);
}

/**
 * 사이트 관련 링크 정보 이벤트를 바인딩 한다. 0524 메인페이지 변경 사용x
 */
var  SiteLink = {
	init : function(){
		
		$('#site-link-category').on('click', function(e){
			e.preventDefault();
		});
		
		$('a.site-link-category').on('click', function(e){
			e.preventDefault();
			var linkCategory = $(this).attr('href');
			var text = $(this).text();
			
			$('#site-link-category').attr('href', linkCategory);
			$('#site-link-category').text(text);
			
			
			SiteLink.loadSiteLinkData(linkCategory);
		});

        $('#site-link>a').on('click',function () {
        	//기본 동작을 막는다.
			return false;
        });

        $('#footerMoveBtn').on('click',function(){
            window.open($('#site-link>a').attr("href"), "target");
		});
		
		var initCategory = $('#site-link-category').attr('href');
		//SiteLink.loadSiteLinkData(initCategory);
		
	}
	,loadSiteLinkData : function(linkCategory){
		$.ajax({
			dataType : "json",
			url : "/homepage/json/base/code/listCommonCode.do",
			async : false,
			data : {
				prntCd : linkCategory
			},
			success : function(data, status, reaus) {
				var list = $('#site-link ul');
				list.empty();
				
				if (data.data) {
					$(data.data).each(function(idx, ele){
						
						if(idx == 0){
							$('#site-link>a').attr('href', this.ETC_1_CD);
							$('#site-link>a').text(this.NAME);
						}
						
						var link = $("<li><a href="+this.ETC_1_CD+" target='_blank'>"+this.NAME+"</a></li>");
                        link.on('click', function(){
                        	var $targetInfo = $(this).find('a');
                            var $siteLinkInfo = $('#site-link>a');

                            $siteLinkInfo.attr('href',$targetInfo.attr('href'));
                            $siteLinkInfo.text($targetInfo.text())

                            $('#site-link>.site-list').removeClass('on');
                        	return false;
						});
						list.append(link);
					});
				}
			}
		});
	}
}
/**
 * 관련 링크 작업 수행
 * @returns
 */
function initSiteLink(){
	
	$('#site-link-category').on('click', function(e){
		e.preventDefault();
	});
	
	$('a.site-link-category').on('click', function(e){
		e.preventDefault();
		var linkCategory = $(this).attr('href');
		var text = $(this).text();
		
		$('#site-link-category').attr('href', linkCategory);
		$('#site-link-category').text(text);
		
		
		$.ajax({
			dataType : "json",
			url : "/homepage/json/base/code/listCommonCode.do",
			async : false,
			data : {
				prntCd : linkCategory
			},
			success : function(data, status, reaus) {
				var list = $('#site-link ul');
				list.empty();
				
				if (data.data) {
					$(data.data).each(function(idx, ele){
						var link = $("<li><a href="+this.ETC_1_CD+" target='_blank'>"+this.NAME+"</a></li>");
						list.append(link);
					});
				}
			}
		});
	});
}

/**
 * jquery validator를 초기화한다.
 */
function initializeValidator() {
	
	
	if($.validator) {
		
		$.validator.addMethod("time", function(value, element) {
			return this.optional( element ) || value.isTime("HH:mm");
		}, '올바른 시간 형식이 아닙니다.');
		
		$.validator.addMethod("date", function(value, element) {
			return this.optional( element ) || value.match(/^(19|20)\d{2}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[0-1])$/); //YYYY-MM-DD 정규식(1900~2099년 사이)
		}, '날짜형식을 확인하여 주십시오.');
		
		
		$.validator.messages = {
			required: "필수항목입니다.",
			remote: "remote",
			email: "이메일 주소를 확인하여 주십시오.",
			url: "URL을 확인하여 주십시오.",
			dateISO: "날짜형식(ISO)을 확인하여 주십시오.",
			number: "숫자만 입력할 수 있습니다.",
			digits: "정수만 입력할 수 있습니다.",
			equalTo: "동일한 값을 입력해주십시오.",
			maxlength: $.validator.format( "입력 글자는 최대 {0}글자 입니다." ),
			minlength: $.validator.format( "입력 글자는 최소 {0}글자 입니다." ),
			rangelength: $.validator.format( "입력 글자는 최소 {0}글자 이상  최대 {1}글자 입니다." ),
			range: $.validator.format( "입력 항목은 최소 {0}이상  최대 {1}이하 입니다." ),
			max: $.validator.format( "입력 항목 최대값은 {0}입니다." ),
			min: $.validator.format( "입력 항목 최소값은 {0}입니다." ),
			step: $.validator.format( "입력 항목은 {0}의 배수이어야 합니다." ),
			
			//사용자 정의 메서드 관련 메세지
			time: "시간 형식을 확인하여 주십시오.",
			date: "날짜형식을 확인하여 주십시오.(YYYY-MM-DD)"
		};
	}
}


var mnuTemplate = {
	naviItem : {
		firstItem	: "<li><a href='/'>Home</a></li>",
		normalItem	: "<li><a href=''></a></li>",
		lstItem		: "<li class='active'></li>"
	}
}

var mnuInitHelper = {
		DATA_LIST : "/homepage/json/base/siteMenu/listSiteMenu.do"
		/**
		 * 해당되는 전체 메뉴 정보를 가져온다.
		 */
		,loadMenuInfo : function(){
			Ajax.getData(mnuInitHelper.DATA_LIST,{},function(data){
				$menuInfo = data.data;
				mnuInitHelper.initTopMenu(data.data);
				mnuInitHelper.selectedMenu(data.data);
			});
		}
		/**
		 * top 메뉴를 표출한다. 
		 */
		,initTopMenu : function(data){
			var target = $('#menutop');
			var topMenuIndex = 1;
			$.each(data, function(idx, item){
				if(item.LEV == '1'){
					var clazz = "depth1_" + topMenuIndex;
					var mnu = $('<li class="depth1-menu"><a href="#self"></a></li>');
					mnu.addClass(clazz);
					mnu.addClass('MENU-ITEM-CD-' + item.MNU_CD);
					mnu.find("a").text(item.MNU_CD_NM);
					//mnuInitHelper.bindTagEvent(mnu.find("a"), item.MNU_PTH, item.TARGET, item.TARGET_OPT);
					target.append(mnu);
					topMenuIndex++;			
				} else if(item.LEV == '2'){ //2depth 메뉴를 등록한다.
                    var mnu = $('<li class="depth2-menu"><a href="#self"></a></li>');
					mnu.addClass('MENU-ITEM-CD-' + item.MNU_CD);
					mnu.addClass('subMenu_'+item.MNU_CD);
					mnu.find("a").text(item.MNU_CD_NM);
					//mnuInitHelper.bindTagEvent(mnu.find("a"), item.MNU_PTH, item.TARGET, item.TARGET_OPT);
					
					if($('.TOP-MENU-UL-' + item.MNU_PRNT_CD).length == 0){
						$('.MENU-ITEM-CD-' + item.MNU_PRNT_CD).append($('<div class="sub-depth-wrap"><ul class="depth2-list TOP-MENU-UL-'+item.MNU_PRNT_CD+'"></ul></div>'));
					}
					
					$('.TOP-MENU-UL-' + item.MNU_PRNT_CD).append(mnu);
					
					// 상단 2단 메뉴에서 링크 활성화 해체
					if (! SYS.status.isMobileScreen) {
						if (item.MNU_PTH.length === 1 && item.MNU_PTH === "#") {
							mnu.find("a").removeAttr("href").css({
						        "cursor": "pointer"
						       , "pointer-events": "none" 	
						    });
						}
					}
					
				} else if(item.LEV == '3'){ //3depth 메뉴를 등록한다.
				
					var mnu = $('<li class="depth3-menu"><a href="#self" ></a></li>');
					mnu.addClass('MENU-ITEM-CD-' + item.MNU_CD);
					mnu.find("a").text(item.MNU_CD_NM);
					//mnuInitHelper.bindTagEvent(mnu.find("a"), item.MNU_PTH, item.TARGET, item.TARGET_OPT);
					
					if($('.SUB-MENU-UL-' + item.MNU_PRNT_CD).length == 0){
						$('.MENU-ITEM-CD-' + item.MNU_PRNT_CD).append($('<ul class="depth3-list SUB-MENU-UL-'+item.MNU_PRNT_CD+'"></ul>'));
					}
					
					$('.SUB-MENU-UL-' + item.MNU_PRNT_CD).append(mnu);
					
					// 상단 3단 메뉴에서 링크 이미지 추가
					if (item.MNU_PTH.indexOf("https://") > -1 || item.MNU_PTH.indexOf("http://") > -1) {
						mnu.find("a").append('<img src="/resources/common/images/icon/link.png" width="25" alt="link"/>');
					}
				}
				
				//현재 메뉴와 같은지 여부 확인하여 navi, dept4 이상의 동적 메뉴를 구성한다.
				if(item.MNU_CD == MNU_CD){
					//max dept가 4이상 일 시, 4dept 메뉴를 구성한다.
					if(MAX_DEPT>3){
						//평소엔 inner-menu를 숨기고 있다가, dept4메뉴가 있으면 메뉴를 표출한다.
						$('.inner-menu').css('display','');
						
						//mnuInitHelper.initDept4Menu(data);
					}
					//mnuInitHelper.initNavi(item, MAX_DEPT);
				}
			});
			
			gnb();//코딩 함수 요청
			
			/*
			$('#header .depth3').each(function(e){
				$(this).parent().addClass('children');
			});
			*/
			
		}
		/**
		 * dept4 메뉴를 구성한다. 모든 메뉴 중
		 * , 등록된 URL을 기준으로 메뉴를 필터링 하여 dept4 메뉴만 append한다.
		 */
		,initDept4Menu : function(menuArr){
			//preMenuCd와 앞부분이 같은 dept4 메뉴만 추출 
			var preMenuCd = MNU_CD.substr(0,7);
			
			//정규식을 통해 preMenuCd로 시작하는 메뉴코드(dept4)를 append한다.
			var re = new RegExp("^"+preMenuCd);
			
			var dept4Arr = $.grep(menuArr,function(menuItem){
				if(menuItem.LEV =='4' && re.test(menuItem.MNU_CD)){
					return true;
				}else return false;
			})
			
			var $dept4Target = $('div.inner-menu>ul');
			
			for(var i=0;i<dept4Arr.length;i++){
				var $dept4Item = $("<li><a href='#none'></a></li>");
				
				$dept4Item.addClass('MENU-ITEM-CD-' + dept4Arr[i].MNU_CD);
				$dept4Item.find("a").text(dept4Arr[i].MNU_CD_NM);
				
				//mnuInitHelper.bindTagEvent($dept4Item.find("a"), dept4Arr[i].MNU_PTH, dept4Arr[i].TARGET, dept4Arr[i].TARGET_OPT);
				
				$dept4Target.append($dept4Item);
			}
		}
		/**
		 * 프로그램과 메뉴에 맵핑된 정보를 가져온다.
		 */
		,selectedMenu : function(){
			
			$('li.MENU-ITEM-CD-' + DEPT1_MNU_CD).addClass('on');
			$('li.MENU-ITEM-CD-' + DEPT2_MNU_CD).addClass('on');
			$('li.MENU-ITEM-CD-' + DEPT3_MNU_CD).addClass('on');
        	if(MAX_DEPT >= 4)
        		$('li.MENU-ITEM-CD-' + DEPT4_MNU_CD).addClass('active');
			
			//mnuInitHelper.initClass(); //서브시스템에서 클래스가 동적으로 추가 되는 부분이 있어서 추갇됨
			
		}
		,initClass : function(){
			$('#topmenu li.depth1').each(function(index, element){
				if($(this).hasClass('on')){
					$('#homepage-container').addClass('container' + (index+1));
				}
			});
		}
		
		/**
		 * 메뉴 경로에서 해당 depth에 해당하는 메뉴 코드를 가져온다.
		 * @menupath : 메뉴코드정보/0000/0000/0000
		 * @depth : 가져올 메뉴 인덱스
		 * 
		 */
		,getMenuCd : function(menuPath, depth){
			var menu = menuPath.split("/");
			return menu[depth];
		}
		/**
		 * navi 정보를 표출한다.
		 */
		,initNavi : function(item,maxDept){
			if(!item)
				return;
			var target = $('div.breadcrumb');
			
			//사이트 타이틀 설정
			if(PROG_TITLE != ""){
				$('head title').text(PROG_TITLE);
			}else{
				if(LANG =="ko")
					$('head title').text(item.MNU_CD_NM);
				else
					$('head title').text(item.MNU_CD_EN_NM || item.MNU_CD_NM);
			}
			
			//첫번째 아이템을 붙인다.(home)
			/*
			var firstNavi = $(mnuTemplate.naviItem.firstItem);//템플릿 아이템
			firstNavi.find('a').attr('href',contextPath+'/');
			target.append(firstNavi);
			*/
			//두번째 부터 마지막-1 까지의 dept를 붙인다.
			var naviArray = item.NAVI.split("*");
			for(var i=1; i < naviArray.length; i++){
				if(i == naviArray.length - 1){
					target.append('<span class="gt"> &gt; </span> <span class="menu-active">' + naviArray[i] + "</span>");
				}else{
					target.append('<span class="gt"> &gt; </span> ' + naviArray[i]);
				}
			}
			
			//마지막 아이템을 붙인다.
			/*
			var lastNavi = $(mnuTemplate.naviItem.lstItem);//템플릿 아이템
			lastNavi.text(item.MNU_CD_NM);
			target.append(lastNavi);
			*/
			$('h3.title').text(item.MNU_CD_NM);
		}
		
		,bindTagEvent : function(anchorTag, url, target, targetOpt){
			targetOpt = targetOpt || '';
			
			if(target=='N'){
				$(anchorTag).attr('href',url);
			}else{
				var opts = targetOpt.split('|');
				var _t = opts[0].trim() || '_blank'
				var _opt = (opts[1] || '').trim();
				
				$(anchorTag).on('click',function(){
					window.open(url, _t, _opt);
					
					return false;
				});
			}
		}
}

//공통 레이어 정보 저장
var CommonLayer = {
		/**
		 * 회원 정보 레이어 오픈
		 */
		userInfoLayerOpen : function(element){
			
			var searchUserId = $(element).val(); 
			//var searchUserId = "nmsc489"; 
			
			Ajax.getData("/homepage/json/user/selectUser.do", {userId : searchUserId}, function(data){
				if(data.data){
					$("#userInfoLayer").remove();
					Layer.modalHtml("/resources/homepage/template/selectUserInfoLayer.html", {draggable : true, width :"500", title : "회원정보", buttons : []}, function(){
						CommonLayer.userInfoDataHandler(data.data);
						$('.USER-INFO-LAYER-BTN').on('click', function(){
							Layer.close('#userInfoLayer');
						});
					});
				}else{
					Message.alert("회원 정보가 존재하지 않습니다.");
				}
			}); 
			
		}
		,userInfoDataHandler : function(data){
			if(data){
				$.each(data, function(key, value){
					$("." + key).text(value);
				});
				
				if(data.listAuth){
					var listAuthUl = $('.AUTHORITY-LIST');
					$(data.listAuth).each(function(){
						var authLi = $('<li>').text(this.AUTHORITY_NAME);
						listAuthUl.append(authLi);
 					});
					
				}
			}
		}
}
