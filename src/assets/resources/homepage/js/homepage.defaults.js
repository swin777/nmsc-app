var rivets;

$(document).ready(function() {
	
	siteDefaultInitialize();
	
    if( typeof( bindEvent ) == "function" ) bindEvent();
    
    // 옵션을 로드한다.
    if( typeof( loadOptions ) == "function" ) loadOptions();
    
    // 데이터를 로드한다.
    if( typeof( loadData ) == "function" ) loadData();
    
    // 컴포넌트를 초기화한다.
    if( typeof( initComponent ) == "function" ) initComponent();
});


/**
 * 사이트 전반적으로 초기화 되어야 할 코드를 정의
 * @returns
 */
function siteDefaultInitialize (){
	
	initializeRiverts(); //리버트 공통 코드를 초기화 한다.

	initializeVue(); //vue 공통 코드를 초기화 한다.

}

////////////////////////////////////////////////////////////////////////////////
// 디폴트 함수
////////////////////////////////////////////////////////////////////////////////

/**
 * 응답을 처리한다.
 * 
 * @param data {Object} 데이터
 * @param status {String} 상태
 * @param request {Object} XHR 요청
 * @param form {Object} 폼
 */
function handleResponse(data, status, request, form) {
	
	if (data.data) {
		
		CmnCode.convertCodeNameGenerate(data.data); //공통코드가 컨퍼팅 정보가 존재하는지의 여부를 확인 후 매핑한다.
		
        // 데이터를 처리한다.
        handleData(data.data, data.count, data.total, data.page, data.rows);
        
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
    	handleWarning(data.warn);
    	
    	// 로딩 마스크를 숨긴다.
    	hideLoadingMask();
    	
    	return;
    }
    
    // 오류가 발생한 경우
    if (data.error) {

        // 오류를 처리한다.
        handleError(request, status, data.error);
        
        // 로딩 마스크를 숨긴다.
        //hideLoadingMask();
        
        return;
    }
}

/**
 * warning 처리를 한다.
 * @param messages
 */
function handleWarning(messages){
	Message.alert(messages);
}

/**
 * 오류를 처리한다.
 * 
 * @param request {Object} XHR 요청
 * @param status {String} 상태
 * @param error {Object} 오류
 */
// function handleError(request, status, error) {
//     // 서비스 오류인 경우
// 	location.href = "/homepage/html/main/error.do";
// }


/**
 * 메시지를 처리한다.
 * 
 * @param messages {Object} 메시지
 */
function handleMessage(messages) {
	Message.alert(messages.message);
}

/**
 * riverts 공동 초기화를 진행한다.
 */
function initializeRiverts(){
	
	if(rivets){
		rivets.configure({
			prefix: "data-rv"
		});
		
		//목록 게시판의 글번호
		rivets.formatters.rowNumber = function(value, number, index, topNtceCount){
			if(topNtceCount == null) topNtceCount = 0; //상단 게시글이 존재할 경우 처리
			return (number - index) + topNtceCount;
		}
		
		//날짜값 셋팅
		rivets.formatters.date = function(value){
			if(value == undefined || value == null) return "";
			var dt = Util.rpad(value, 14, "0");
			return dt.toDate("yyyyMMddHHiiss", "yyyy.MM.dd");
		}
		//날짜값 셋팅
		rivets.formatters.dateToString = function(value){
			if(value == undefined || value == null) return "";
			var date = new Date(value);
			return $.datepicker.formatDate('yy-mm-dd', date);
		}
		//날짜값 셋팅
		rivets.formatters.toDate = function(value){
			if(value == undefined || value == null) return "";
			return value.toDate("yyyyMMdd", "yyyy.MM.dd");
		}
		//날짜값 셋팅
		rivets.formatters.toTime = function(value){
			if(value == undefined || value == null) return "";
			return value.toTime("HHmm", "HH:mm");
		
		}
		
		//신규글 여부 판별
		rivets.formatters.isNew = function(isNew){
			return isNew=='Y';
		}
		
		//개행문자 변경
		rivets.formatters.rplTxt = function(value){
			return value.replace(/\n/g, "<br>");
		}
	}
}

function initializeVue(){
	if(typeof Vue !== "undefined") {
        Vue.mixin({
            methods: {
                date: function (value) {
                    if (value == undefined || value == null) return "";
                    var dt = Util.rpad(value, 14, "0");
                    return dt.toDate("yyyyMMddHHiiss", "yyyy-MM-dd");
                },
                getUniqueId: function (id, prefix) {
                    return prefix + "_" + id;
                },
                comma: function (value) {
                    if (value == undefined || value == null) return "0";
                    return NumberUtil.numberWithCommas(value);
                },
                rowNumber: function (value, number, index, topNtceCount) {
                    if (topNtceCount == null) topNtceCount = 0; //상단 게시글이 존재할 경우 처리
                    return (number - index) + topNtceCount;
                },
                toDateTime: function (value) {
                    if (value == undefined || value == null) return "";
                    var dt = Util.rpad(value, 12, "0");
                    return dt.toDateTime("yyyyMMddHHmi", "yyyy-MM-dd HH:mi");
                },
                addNewLine: function (strValue) {
                    if (!strValue) return "";
                    return strValue + "".replace(/\n/g, "<br>");
                }

            }
        });
    }
}