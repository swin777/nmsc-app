////////////////////////////////////////////////////////////////////////////////
// 글로벌 변수
////////////////////////////////////////////////////////////////////////////////
var DATA_LIST_POPUP = "/homepage/json/base/popup/listViewPopup.do";
////////////////////////////////////////////////////////////////////////////////
// 초기화 함수
////////////////////////////////////////////////////////////////////////////////

/**
 * 이벤트를 바인딩한다.
 */
function bindEvent() {
}

/** 
 * 옵션을 로드한다.
 */
function loadOptions() {
}

/**
 * 데이터를 로드한다.
 */
function loadData() {
}

/**
 * 컴포넌트를 초기화한다.
 */
function initComponent() {
}

////////////////////////////////////////////////////////////////////////////////
// 디폴트 함수
////////////////////////////////////////////////////////////////////////////////
/**
 * 메시지를 처리한다.
 * 
 * @param messages {Object} 메시지
 */
function handleMessage(messages) {
}

/**
 * 응답을 처리한다.
 * 
 * @param data {Object} 데이터
 * @param status {String} 상태
 * @param request {Object} XHR 요청
 * @param form {Object} 폼
 */
function handleResponsePopup(data, status, request, form) {
	
	if (data.data) {
		
		CmnCode.convertCodeNameGenerate(data.data); //공통코드가 컨퍼팅 정보가 존재하는지의 여부를 확인 후 매핑한다.
		
        // 데이터를 처리한다.
        handleDataPopup(data.data);
        
        // 로딩 마스크를 숨긴다.
        hideLoadingMask();
        
        return;
    }
    
    // 처리가 완료된 경우
    if (data.success) {
        // 메시지를 처리한다.
        handleMessage(data.success);
        
        // 로딩 마스크를 숨긴다.
        hideLoadingMask();
        
        return;
    }
    
    // 처리가 완료된 경우
    if (data.warn) {
    	// 메시지를 처리한다.
    	handleWarn(request, status, data.warn);
    	
    	// 로딩 마스크를 숨긴다.
    	hideLoadingMask();
    	
    	return;
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

/**
 * 팝업 데이터를 처리한다.
 * @param data {Array} 검색 데이터
 */
function handleDataPopup(data) {
	var items = data.data;
	
	for (var i = 0; i < items.length; i++) {
		var cookieName = "POPUP_" + items[i].POPUP_USQ;
		
		/**
		 * note : $.cookie('POPUP_{POPUP_USQ}')로 저장된 쿠키값 확인
		 */  
		if ($.cookie(cookieName) != "done") {
			var $popTag = $('<div/>',{
				"id" : 'popup_'+i
			})
			
			$("#popupLayer").append($popTag);
            $popTag.append(items[i].CONTENTS); // 에디터에서 가져온 내용을 div에 세팅한다.

            $popTag.parent().css({"top" : "0px", "left" : "0px"}); // dialog 위치 초기화
           
            
            $popTag.dialog({
				title : items[i].TITLE,
				modal : false,
				width : items[i].WIDTH_SIZE,
				height : items[i].HEIGHT_SIZE,
				resizable : false,
				cookieNm : cookieName,
				/*position: {                   
		                my: "left+30 top+30",
		                at: "left+30 top+30",
		                of: document
		            },*/
				/*open : function(e, ui){
					$(".ui-dialog-titlebar-close", ui.dialog | ui).hide();
				},*/
				buttons : {
			        "오늘 하루 열지 않기": function() {
			        	var cName = $(this).dialog("option", "cookieNm");
			        	$.cookie(cName, "done" , {expires:1, path:'/'});
			            $(this).dialog("close");
			        },
			        "닫기": function() {
			            $(this).dialog("close");
			        }
				}
			});
			
            var _left = items[i].START_X * 1;
            var _top = items[i].START_Y * 1;

            $popTag.parent().css({
            	"position" : "absolute",
				"top" : _top,
				"left" : _left,
				"z-index" : (1000 + i)
			});
            $popTag.parent().find(".ui-dialog-buttonpane").css({"margin-top": "0px", "padding":"0px"});
		}// end if
	}
	
	
}

/**
 * 팝업을 검색한다.
 * @returns
 */
function selectViewPopup() {
	Ajax.getData(DATA_LIST_POPUP, null, handleResponsePopup);
}

/**
 * 팝업창을 미리본다.
 */
function selectReViewPopup() {
	
	$("#popupLayer").empty();
	$(".ui-dialog").css({"top" : "0px", "left" : "0px"}); // dialog 위치 초기화
	$(".ui-dialog-buttonpane").css({"margin-top": "0px", "padding":"0px"});
	
	var contents = CKEDITOR.instances.contents.getData();
	$("#popupLayer").append(contents); // 에디터에서 가져온 내용을 div에 셋팅한다.
	
	$("#popupLayer").dialog({
		title : $("#title").val(),
		modal : true,
		width : $("#widthSize").val(),
		height : $("#heightSize").val(),
		/*open : function(e, ui){
			$(".ui-dialog-titlebar-close", ui.dialog | ui).hide();
		},*/
		buttons: {
	        "오늘 하루 열지 않기": function() {
	            //$(this).dialog("close");
	        },
	        "닫기": function() {
	            //$(this).dialog("close");
	        }
		}
	});
	
	var start_x = $("#start_x").val();
	var start_y = $("#start_y").val();
	
	$(".ui-dialog").css({
		"top" : Number(start_x),
		"left" : Number(start_y),
	});
}