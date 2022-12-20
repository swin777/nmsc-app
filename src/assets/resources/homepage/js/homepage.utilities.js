var GlobalUtil = {
    /**
     * 홈페이지의 타이틀일 변경한다.
     */
    displayTitle : function(title){
        setTimeout(function(){
            $("head title").text(title);
        }, 1000)
    }
}

var LoginMask = {
show : function(){
    try {
        $.blockUI({
            message: '<img src="/resources/common/images/common/loading.gif" style="z-index:1012;"/>'
                ,css :
                {
                     padding : 0
                    ,margin : 0
                    ,textAlign: 'center'
                    //,width : '5%'
                    ,border: 'none'
                    ,cursor: 'wait'
                    ,backgroundColor : 'none'
                }
                ,overlayCSS : {backgroundColor : '#ffffff', opacity:0.4, cursor: 'wait'}
        });
    } catch(err) {
        console.log("$.blockUI lib not found");
    }
},
hide : function(){
    try {
        $.unblockUI();
    } catch(err) {
        console.log("$.blockUI lib not found");
    }
}
}

/**
* 로딩 마스크를 보인다.
*/
function showLoadingMask(flag) {
LoginMask.show();
}

/**
* 로딩 마스크를 숨긴다.
*/
function hideLoadingMask() {
LoginMask.hide();
}
/**
* 콤보 옵션을 초기화한다.
*
* @param id
*            {String} 아이디
* @param data
*            {Array} 데이터
* @param defaultValue
*            {String} 디폴트 값
*/
function initComboOptions(id, data, defaultValue) {
var combobox = $("#" + id);

var _lang = "ko";
if(typeof(LANG) != 'undefined'){
    _lang = LANG;
}

combobox.find("option").each(function(index, element) {
    $(this).remove();
});

for (var i = 0; i < data.length; i++) {
    var option = $("<option></option>");

    option.val(data[i].CODE);
    if(_lang == "ko"){
        option.text(data[i].NAME);
    }else{
        //EN_NAME이 정의 되어 있지 않을 경우, NAME을 추가
        option.text(data[i].EN_NAME || data[i].NAME);
    }

    combobox.append(option);
}

if (defaultValue) {
    //code에 맞는 Name을 검색한다.
    var defaultObj = $.grep(data, function(obj){
        return obj.CODE == defaultValue;
    });

    //option list 중 default value가 없을 시
    if(defaultObj.length === 0)	return;

    combobox.val(defaultValue);

    if(_lang == "ko"){
        if(!combobox.hasClass("NO-CHG-LABEL")){
            combobox.siblings('label').text(defaultObj[0].NAME);
        }
    }else{
        //EN_NAME이 정의 되어 있지 않을 경우, NAME을 추가
        if(!combobox.hasClass("NO-CHG-LABEL")){
            combobox.siblings('label').text(defaultObj[0].EN_NAME || defaultObj[0].NAME);
        }
    }

}
}


/**
* 좌측 메뉴를 로드한다.
*
* @param selector
*            {String} 셀렉터
* @param site
*            {String} 사이트
* @param lang
*            {String} 언어
* @param menu
*            {Object} 메뉴
*/
function loadLeftMenus(selector, site, lang, menu) {
$.post("/json/" + site + "/" + lang + "/common/Menu/searchMenu.do", {
    SITE_MNU_SEQ_N : menu.LV1_SITE_MNU_SEQ_N
}, function(data, status, request) {
    if (data.data) {
        // 좌측 메뉴를 초기화한다.
        initLeftMenus(selector, data.data, site, lang, menu);
    }
}, "json");
}



/**
* 체크박스를 토글한다.
*
* @param checkbox
*            {Object} 체크박스
* @param selector
*            {String} 셀렉터
*/
function toggleCheckbox(checkbox, selector) {
$(selector).each(function(index, element) {
    this.checked = checkbox.checked;
});
}
/**
* 체크박스의 선택된 항목을 가져온다.
*
* @param elementName
*            {String} 엘리먼트 명
*/
function getCheckedValues(elementName) {
var checkedValues = $("input[name='" + elementName + "']:checkbox:checked").map(function() {
            return $(this).val();

        }).get();
return checkedValues;
}

var Paging = {
/**
 * 페이징을 처리한다.
 *
 * @param count
 *            {Number} 검색 카운트
 * @param page
 *            {Number} 페이지 번호
 * @param rows
 *            {Number} 페이지 크기
 */

handlePaging : function(count, page, rows, $selector) {
    var target = $selector || $("#paging-area");// 기본 paging-area. 한 화면 안에
    // 여러 페이징 처리가 있을 수 있어서
    // $selectoc 추가


    target.children('div').remove();
    target.append($('<div>', {
        'class' : 'paging'
    }));

    var list = target.children('div');

    var item = {// 각 class는 이벤트 바인딩 시 사용하는 필수 class
            prev0 : "<a href=\"#\" class=\"prev-end\"><span class=\"hide\">첫페이지</span></a>",// 맨 처음
            prev1 : "<a href=\"#\" class=\"prev\"><span class=\"hide\">이전</span></a>", // 이전
            normal :"<a href=\"#\"></a>", // 일반
            next1 : "<a href=\"#\" class=\"next\"><span class=\"hide\">다음</span></a>", // 다음
            next0 : "<a href=\"#\" class=\"next-end\"><span class=\"hide\">마지막페이지</span></a>" // 맨 끝
    };

    list.append($(item.prev0)); // 맨 앞 버튼 추가
    list.append($(item.prev1)); // 이전 버튼 추가

    if (count > 0) {
        var pages = Math.floor(count / rows) + (count % rows > 0 ? 1 : 0);
        var index = (page > pages ? pages : page) - 1;
        var first = Math.floor(index / 10) * 10 + 1;

        // normal 버튼 추가. 최대 10개 까지 표기
        for (var i = 0, n = first; i < 10; i++, n++) {
            var pageNumberElement = $(item.normal);
            pageNumberElement.text(n);
            if (n == index + 1) {
                pageNumberElement.addClass('on');
            }else{
                pageNumberElement.on('click', {	c : count }, function(e){
                    e.preventDefault();

                    // 페이지를 변경한다.
                    var p = this.text;
                    if (!(index + 1 == p) && e.data.c > 0)// 현재 페이지와 요청 페이지가 다를 시만
                        // changePage
                        changePage(parseInt(p));
                });
            }
            list.append(pageNumberElement);

            if (n == pages) {
                break;
            }
        }
    }

    // 처음 버튼 이벤트 바인딩
    list.off("click", '.prev-end');
    list.on("click", '.prev-end', {
        c : count,
        i : index
    }, function(e) {
        e.preventDefault();
        if (e.data.c > 0 && e.data.i > 0)
            changePage(1);
        return false;
    });

    // 이전 이벤트 바인딩
    list.off("click", '.prev');
    list.on("click", '.prev', {
        page : page,
        c : count,
        i : index
    }, function(e) {
        e.preventDefault();
        if (e.data.c > 0 && e.data.i > 0)
            changePage(parseInt(e.data.page) - 1);
        return false;
    });

    // 다음 이벤트 바인딩
    list.off("click", '.next');
    list.on("click", '.next', {
        page : page,
        pages : pages,
        c : count,
        i : index
    }, function(e) {
        e.preventDefault();

        if ((e.data.i < e.data.pages - 1) && e.data.c > 0)
            changePage(parseInt(e.data.page) + 1);
        return false;
    });

    // 맨 끝 이벤트 바인딩
    list.off("click", '.next-end');
    list.on("click", '.next-end', {
        pages : pages,
        c : count,
        i : index
    }, function(e) {
        // 페이지를 변경한다.
        e.preventDefault();
        if ((e.data.i < e.data.pages - 1) && e.data.c > 0)
            changePage(e.data.pages);
        return false;
    });

    list.append($(item.next1)); // 다음 버튼 추가
    list.append($(item.next0)); // 맨 마지막 버튼 추가
}
/**
 * 테이블 바디를 초기화 한다.
 *
 * @param id
 *            아이디 정보
 * @param isAppend
 *            추가할지 삭제할지의 여부
 * @param tempate
 *            템를릿
 */
,
initTableBody : function(selector, tempate, isAppend) {
    var list = $(selector);

    isAppend = !(isAppend == null);

    if (!isAppend) {
        list.find("tr").each(function(index, element) {
            $(this).remove();
        });
    }
    list.append(tempate);
}
/**
 * 행번호를 반환한다.
 *
 * @param count
 *            {Number} 검색 카운트
 * @param page
 *            {Number} 페이지 번호
 * @param rows
 *            {Number} 페이지 크기
 * @returns {Number} 행번호
 */
,
getRowNumber : function(count, page, rows) {
    var pages = Math.floor(count / rows) + (count % rows > 0 ? 1 : 0);
    var index = (page > pages ? pages : page) - 1;
    return count - (index * rows);
}
/**
 * 데이터가 없는 경우 빈 ROW를 추가한다.
 *
 * @param selector
 *            jquery 셀렉터 문자열
 * @param columnCount
 *            colspan 카운트 갯수
 * @param message
 *            출력할 문자열
 */
,
noData : function(selector, columnCount, message) {

    // 페이징 영역을 제거한다.
    $("#paging-area").children('div').remove();

    var template = $("<tr><td colspan=" + columnCount
            + " class=\"text-center EMPTY_TXT\"></td></tr>");
    if (message == null) {
        message = "검색된 데이터가 없습니다.";
    }

    $(selector).find("tr").each(function(index, element) {
        $(this).remove();
    });

    template.find(".EMPTY_TXT").text(message);
    $(selector).append(template);
}
,
/**
 * data중 상단글 갯수를 반환한다.
 * @param data
 */
getTopNtceCnt : function(data){
    if(!($.isArray(data)))
        return 0;
    var cnt=0;
    $.each(data,function(i,v){
        if(v.TOP_DISP_FL =='Y')
            cnt++;
    })

    return cnt;
}
};

/**
* 파일이름을 반환한다.
*
* @param path
*            {String} 파일경로
* @returns {String} 파일이름
*/
function getFileName(path) {
return path.substring(path.lastIndexOf("\\") + 1);
}

/**
* 파일확장자을 반환한다.
*
* @param path
*            {String} 파일경로
* @returns {String} 파일이름
*/
function getFileExt(path) {
return path.substring(path.lastIndexOf(".") + 1);
}

/**
* 파일확장자 체크
*
* @param ext
*            {String} 파일 확장자
* @returns {boolean} 사용가능여부 (true : 사용가능, false: 사용불가)
*/
function checkFileExt(ext) {

ext = (ext.charAt(0) == '.') ? ext.toLowerCase() : "." + ext.toLowerCase();
var fileExension = new Array(".zip", ".pdf", ".doc", ".docx", ".hwp",
        ".xls", ".xlsx", ".ppt", ".pptx", ".txt", ".jpg", ".jpeg", ".tif",
        ".tiff", ".png", ".bmp", ".gif");
var fileExtFlag = false;
for (var i = 0; i < fileExension.length; i++) {
    if (fileExension[i] == ext) {
        fileExtFlag = true;
        break;
    }
}

return fileExtFlag;
}

/**
* 파일크기를 포맷한다.
*
* @param size
*            {Number} 파일크기
* @returns {String} 파일크기
*/
function getFileSize(size) {
return ("" + Math.ceil(size / 1024)).toCurrency() + "KB";
}

/**
* 파일크기를 포맷한다.
*
* @param size
*            {Number} 파일크기
* @returns {String} 파일크기
*/
function getFileSize2(size) {
var size_str = "";
if (size > 1024 * 1024 * 1024) {// Gb
    size = (size / (1024 * 1024 * 1024)) * 100;
    size = Math.ceil(size) / 100;
    size_str = ("" + size).toCurrency() + " GB";

} else if (size > 1024 * 1024) {// Mb
    size = (size / (1024 * 1024)) * 10;
    size = Math.ceil(size) / 10;
    size_str = ("" + size).toCurrency() + " MB";
} else if (size > 1024) { // kb
    size_str = ("" + Math.ceil(size / 1024)).toCurrency() + " KB";
} else if (size < 1024) {
    size_str = ("" + size).toCurrency() + " Byte";
    ;
}
return size_str;
}





/**
* 웹 에디터를 생성한다.
*
* @param id
*            {String} 아이디
* @param width
*            {String} 너비
* @param height
*            {String} 높이
*/
function createWebEditor(id, width, height) {
var editor = new cheditor();

editor.inputForm = id;
editor.config.editorWidth = width ? width : $("#" + id).width() + "px";
editor.config.editorHeight = height ? height : $("#" + id).height() + "px";

editor.run();

return editor;
}

/**
* 메시지를 반환한다.
*
* @param code
*            {String} 코드
* @param args
*            {Array} 변수
* @returns {String} 메시지
*/
function getMessage(code, args) {
var message = indiMsgUtil[code];

if (args) {
    for (var i = 0; i < args.length; i++) {
        message = message.replace("{" + i + "}", args[i]);
    }
}

return message;
}

/**
* 달력 옵션을 반환한다.
*
* @returns {Object} 달력 옵션 gubun 값이 없으면 단일 달력. 2개 이상일 경우 시작일자와 종료일자를 구분한다.
*/
function getCalendarOptions(gubun) {
altMSG = getMessage("B0006");
if (gubun == "s") {
    altMSG = "검색시작일자";
} else if (gubun == "e") {
    altMSG = "검색종료일자";
}
return {
    showOn : "button",
    buttonText : altMSG,
    buttonImage:"/resources/manage/images/common/icon_calendar.gif",
    buttonImageOnly:true
};
}

/**
* 타임스탬프를 반환한다.
*
* @returns {Number} 타임스탬프
*/
function getTimestamp() {
return new Date().getTime();
}

/**
* 윈도우를 띄운다.
*
* @param url
*            {String} 주소
* @param target
*            {String} 대상
* @param options
*            {Object} 특성
* @param params
*            {Array} 파라메터
* @returns {Object} 윈도우
*/
function popupWindow(url, target, options, params) {
var feature = "";

if (options) {
    feature += "top=" + (options.top != null ? options.top : "10px") + ",";
    feature += "left=" + (options.left != null ? options.left : "10px")
            + ",";
    feature += "width=" + (options.width != null ? options.width : "400px")
            + ",";
    feature += "height="
            + (options.height != null ? options.height : "300px") + ",";
    feature += "resizable="
            + (options.resizable != null ? options.resizable : "0") + ",";
    feature += "menubar="
            + (options.menubar != null ? options.menubar : "0") + ",";
    feature += "status=" + (options.status != null ? options.status : "0")
            + ",";
    feature += "scrollbars="
            + (options.scrollbars != null ? options.scrollbars : "0");
}

var query = "";

if (params) {
    for (var i = 0; i < params.length; i++) {
        if (i == 0) {
            query += "?";
        } else {
            query += "&";
        }

        query += params[i].name + "=" + params[i].value;
    }
}

return window.open(url + query, target ? target : "", feature);
}

/**
* 윈도우를 닫는다.
*/
function closeWindow() {
window.close();
}

/**
* 등록자를 조회한다.
*
* @param key
*            {Number} 키
* @param who
*            {String} 등록자 구분
*/
function selectRegister(key, who) {
// 고객인 경우
if (who == "1") {
    // 윈도우를 띄운다.
    popupWindow("/html/homepage/ko/user/Customer/selectCustomerPop.do",
            "selectCustomerPop", {
                width : "600px",
                height : "440px"
            }, [ {
                name : "CUST_SEQ_N",
                value : key
            } ]);
}
// 관리자인 경우
else {
    // 윈도우를 띄운다.
    popupWindow("/html/homepage/ko/user/Manager/selectManagerPop.do",
            "selectManagerPop", {
                width : "600px",
                height : "576px"
            }, [ {
                name : "MNGR_SEQ_N",
                value : key
            } ]);
}
}

/**
* 수정자를 조회한다.
*
* @param key
*            {Number} 키
* @param who
*            {String} 수정자 구분
*/
function selectModifier(key, who) {
// 고객인 경우
if (who == "1") {
    // 윈도우를 띄운다.
    popupWindow("/html/homepage/ko/user/Customer/selectCustomerPop.do",
            "selectCustomerPop", {
                width : "600px",
                height : "440px"
            }, [ {
                name : "CUST_SEQ_N",
                value : key
            } ]);
}
// 관리자인 경우
else {
    // 윈도우를 띄운다.
    popupWindow("/html/homepage/ko/user/Manager/selectManagerPop.do",
            "selectManagerPop", {
                width : "600px",
                height : "576px"
            }, [ {
                name : "MNGR_SEQ_N",
                value : key
            } ]);
}
}


/**
* 비밀번호 유효성을 검증한다.
*
* @param id
*            {String} 아이디
*/
function validatePassword(id) {
var password = $("#" + id);

if (!/^.*(?=.{10,}).*$/.test(password.val())) {
    Message.alert("비밀번호를 최소 10자리 이상 입력하여 주십시오.");

    password.focus();

    return false;
}

if (/^.*(?=.*[\s]).*$/.test(password.val())) {
    Message.alert("비밀번호에 공백문자를 입력할 수 없습니다.");

    password.focus();

    return false;
}

if (!/^.*(?=.*[a-zA-Z]).*$/.test(password.val())) {
    Message.alert("비밀번호에 최소한 하나의 영문자를 입력하여 주십시오.");

    password.focus();

    return false;
}

if (!/^.*(?=.*[0-9]).*$/.test(password.val())) {
    Message.alert("비밀번호에 최소한 하나의 숫자를 입력하여 주십시오.");

    password.focus();

    return false;
}

if (!/^.*(?=.*[^0-9a-zA-Z]).*$/.test(password.val())) {
    Message.alert("비밀번호에 최소한 하나의 특수문자를 입력하여 주십시오.");

    password.focus();

    return false;
}

return true;
}

/**
* 페이지 block UI
*/

function showLoading(obj) {
$.blockUI({
            message : '로딩중..</br><img src=\'/html/homepage/ko/images/common/ajax-loader_bar.gif\'>',
            css : {
                border : '3px solid #a00'
            }
        });
}
function hideLoading(obj) {
$.unblockUI();
}

function showLoadingBlock(obj) {
obj.block({
            message : '로딩중..</br><img src=\'/html/homepage/ko/images/common/ajax-loader_bar.gif\'>',
            css : {
                border : '3px solid #a00'
            }
        });
}
function hideLoadingBlock(obj) {
obj.unblock();
}

/**
* 익스플로러 버전을 가져온다.
*
* @param void
*/
function getInternetExplorerVersion() {
var rv = -1; // Return value assumes failure.
if (navigator.appName == 'Microsoft Internet Explorer') {
    var ua = navigator.userAgent;
    var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
    if (re.exec(ua) != null)
        rv = parseFloat(RegExp.$1);
}
return rv;
}

/**
* time 포맷을 반환한다.
*
* @returns {String}
*/
function getTimeFormat() {
return 'HH:mm';
}

/**
* 날짜 포맷을 반환한다.
*
* @returns {String}
*/
function getDateFormat() {
return 'yyyy-MM-dd';
}

/**
* function 함수를 실행한다.
*
* @returns {String}
*/
function functionDispatch(fn, args) {
fn = (typeof fn == "function") ? fn : window[fn]; // Allow fn to be a
                                                    // function object or
                                                    // the name of a global
                                                    // function
return fn.apply(this, args || []); // args is optional, use an empty array
                                    // by default
}

/**
* Aja 처리를 하기 위한 Adapter 객체
*/
var Ajax = {
/**
 * Ajax를 호출하고 결과값을 json형태로 반환한다.
 *
 * @param $url
 *            {String} 요청 url 정보를 반환한다.
 * @param $param
 *            {Object} 파라메터정보 {key:value, key: value}
 * @param successFnc
 *            {function} 요청 url 정보를 반환한다.
 */
getData : function($url, $param, successFnc, errorFunction) {
    $.ajax({
        dataType : "json",
        type : "POST",
        url : $url,
        cache:false,
        data : $param,
        beforeSend : function() {
            // 로딩 마스크를 보인다.
            showLoadingMask();
        },
        success : function(data, status, request) {
            functionDispatch(successFnc, [ data, status, request ]);
        },
        complete : function() {
            // 로딩 마스크를 숨긴다.
            hideLoadingMask();
        },
        error : function(data, status, error) {
            // 오류를 처리한다.
            //handleError(data, status, error);

            if($.isFunction( errorFunction )){
                errorFunction(data, status, error);
            }
        }
    });
},
getAsyncData : function($url, $param, successFnc, errorFunction) {
    $.ajax({
        dataType : "json",
        type : "POST",
        url : $url,
        data : $param,
        cache:false,
        async : false,
        beforeSend : function() {
            // 로딩 마스크를 보인다.
            showLoadingMask();
        },
        success : function(data, status, request) {
            functionDispatch(successFnc, [ data, status, request ]);
        },
        complete : function() {
            // 로딩 마스크를 숨긴다.
            hideLoadingMask();
        },
        error : function(data, status, error) {
            // 오류를 처리한다.
            handleError(data, status, error);

            if($.isFunction( errorFunction )){
                errorFunction(data, status, error);
            }
        }
    });
},
/**
 * 파일 업로드시 사용하며 form을 서브밋하고 결과값을 json형태로 반환한다.
 *
 * @param formId
 *            {String} 폼아이디
 * @param successFnc
 *            {function} 요청 url 정보를 반환한다.
 */
formSubmit : function(formId, url, successFnc, errorFnc) {
    $("#" + formId).ajaxSubmit({
        dataType : "json",
        url : url,
        beforeSend : function() {
            // 로딩 마스크를 보인다.
            showLoadingMask();
        },
        uploadProgress : function(event, position, total, percentComplete) {
            console.log(percentComplete);
        },
        success : function(data, status, request) {
            functionDispatch(successFnc, [ data, status, request ]);
        },
        complete : function() {
            // 로딩 마스크를 숨긴다.
            hideLoadingMask();
        },
        error : function(data, status, error) {
            // 오류를 처리한다.
            if(errorFnc != null){
                functionDispatch(errorFnc, [ data, status, request ]);
            }else{
                handleError(data, status, error);
            }
        }
    });
}
};

/**
* alert 메세지 출력
*/
var Message = {
//메세지 팝업시 포커스 된 element
$focusTarget : null
    /**
     * jAlert를 사용한 확인 메세지 팝업
     * @param message 팝업창 메세지
     * @param title 팝업창 타이틀
     * @param funcCB 확인 시 실행 될 콜백함수
     */
,alert : function(message, funcCB, title) {
    //jAlert(message, title || '알림', funcCB);

    Message.$focusTarget = $(':focus');

    Message.$focusTarget.blur();

    $(window).on("keydown.closeByEnter", function(event) {
        if (event.which == 13) {
            //dialog창이 존재 시, enter를 눌렀을 때 click 이벤트 발동
            $('.lnv-dialog-ft .alert-btn').click();

            return false;
        }
    });

    lnv.alert({
        title: title || '알림',
        content: message,
        alertBtnText: 'Ok',
        alertHandler: function(){

            if(Message.$focusTarget && Message.$focusTarget.length > 0)
                Message.$focusTarget.focus();

            if(funcCB){
                functionDispatch(funcCB);
            }

            $(window).off("keydown.closeByEnter");
        }
    });
},
confirm : function(message, handlerFunction, title) {
    /*
    jConfirm(message, title || '확인', function(yes) {
        if (yes) {
            functionDispatch(handlerFunction, [ yes ]);
        }
    });
    */
    lnv.confirm({
        title: title || '확인',
        content: message,
        confirmBtnText: 'Confirm',
        confirmHandler: function(){
            functionDispatch(handlerFunction);
        },
        cancelBtnText: 'Cancel',
        cancelHandler: function(){

        }
    })
}

, confirmYn : function(message, handlerFunction, title) {
    
    lnv.confirm({
        title: title
        , content: message
        , confirmBtnText: (LANG === "ko") ? "네" : "Yes"
        , confirmHandler: function() {
            functionDispatch(handlerFunction);
        }
        , cancelBtnText: (LANG === "ko") ? "아니오" : "No"
        , cancelHandler: function() {
        }
    })
    
    // 제목 컬러배경 변경
    $(".lnv-dialog-hd").css({ 
        "background-color" : "rgb(187, 101, 102)" 
    });
    
    // 제목 컬러 변경
    $(".lnv-dialog-title").css({ 
        "color" : "white"
    });
}
};

/**
* 공통 코드 정보 조회
*/
var CmnCode = {
/**
 * 다수의 공통코드 정보를 콤보박스에 추가할 경우 사용한다.
 * @param data 공통코드를 가져오기 위산 옵션값 {elementId : "", code : "", defaultVal : "", options : {NAME:"",CODE:"",BACK:false}}
 */
loadCodes : function(data){
    var codeArray = [];
    if($.isArray(data)){ //배열인지 체크
        $(data).each(function(idx, element){
            if(element.code){
                codeArray.push(element.code);
            }
        });

        if(codeArray.length > 0){ //코드값이 하나라도 있으면 수행
            $.ajax({
                dataType : "json",
                async : false,
                url : "/homepage/json/base/code/listCommonArrayCode.do",
                data : {
                    prntCd : codeArray
                },
                success : function(result, status, reaus) {
                    if(result.data) {
                        var dummy = {};
                        $(result.data).each(function(idx, element){
                            if(!dummy[element.PRNT_CD]){
                                dummy[element.PRNT_CD] = [];
                            }
                            dummy[element.PRNT_CD].push(element);
                        });

                        $(data).each(function(idx, item){//실제 옵션값 셋팅
                            var options = $.extend([], dummy[item.code]); // 기본 옵션 객체 복사

                            if(item.options){
                                var appendOptions = item.options;
                                if(appendOptions.BACK){
                                    options.push(appendOptions);
                                }else{
                                    options.unshift(appendOptions);
                                }
                            }
                            initComboOptions(item.elementId, options, item.defaultVal);
                        });
                    }
                }
            });
        }
    }else{
        loadCode(data.elementId, data.code, data.value, data.options);
    }
},

/**
 * 공통코드 정보를 조회한다.
 */
loadCode : function(elementId, codeCd, defaultValue, appendOptions, isBack) {

    if (isBack === null){
        isBack = false;
    }

    $.ajax({
        dataType : "json",
        url : "/homepage/json/base/code/listCommonCode.do",
        async : false,
        data : {
            prntCd : codeCd
        },
        success : function(data, status, reaus) {
            if (data.data) {
                // 콤보 옵션을 초기화한다.

                if (appendOptions) {// 추가 옵션 정보가 있는지의 여부를 체크한다.

                    if (isBack) { // 엘리먼트 요소를 처음에 넣을지 판단
                        data.data.push(appendOptions);
                    } else {
                        data.data.unshift(appendOptions);
                    }
                }

                initComboOptions(elementId, data.data, defaultValue);

            }
        }
    });
},
/**
 * 다수 엘리먼트의 공통코드 정보를 초기화 한다.
 *
 * @deprecated loadCodes로 대체
 * @param elementIds 엘리먼트 아이디 ex)select01,select02
 * @param codeCds 공통코드 아이디 ex)COM01,COM02
 * @param defaultValue 기본 셋팅값 정보 아이디 ex)01,,03
 */
loadCodesxx : function(elementIds, codeCds, defaultValue, appendOptions, isBack) {

    $.ajax({
        dataType : "json",
        async : false,
        url : "/homepage/json/base/code/listCommonArrayCode.do",
        data : {
            prntCd : codeCds
        },
        success : function(data, status, reaus) {
            if (data.data) {

                for (var i = 0; i < elementIds.length; i++) {
                    var options = [];
                    var codeCd = codeCds[i];
                    var defaultVal = "";
                    var isBk = true;
                    var defaultOp = null;

                    try {
                        defaultVal = defaultValue[i];
                    } catch (err) {
                    }

                    try {
                        isBk = isBack[i];
                    } catch (err) {
                        console.log(err.message);
                    }

                    try {
                        defaultOp = appendOptions[i];
                    } catch (err) {
                    }

                    $(data.data).each(function(index, element) {
                        if (element.PRNT_CD == codeCd) {
                            options.push({
                                NAME : element.NAME,
                                CODE : element.CODE
                            });
                        }
                    });

                    if (defaultOp != null) {
                        if (!isBk) { // 엘리먼트 요소를 처음에 넣을지 판단
                            options.unshift(defaultOp);
                        } else {
                            options.push(defaultOp);
                        }
                    }

                    initComboOptions(elementIds[i], options, defaultVal);
                }
            }
        }
    });
},
convertCodeNameGenerate : function(data){
    var codeArray = [];
    if($.isArray(data)){
        $(data).each(function(index, element){
            CmnCode.getCodeCd(element, codeArray);
        });
    }else{
            CmnCode.getCodeCd(data, codeArray);
    }

    if(codeArray.length > 0){
        Ajax.getAsyncData('/homepage/json/base/code/listCommonArrayCode.do', {prntCd : codeArray}, function(dta, sts, req){
            if(dta.data){

                //현재 lang를 불러온다.
                var _lang = "ko";
                if(typeof(LANG) != 'undefined'){
                    _lang = LANG;
                }

                $(data).each(function(idx, item){
                    if(item['_code_resolve']){
                        var codeSet = item['_code_resolve'].split(",");
                        for(var i = 0; i < codeSet.length; i++){
                            var column = codeSet[i].split("#")[0];
                            var code = codeSet[i].split("#")[1];
                            $(dta.data).each(function(codeIdx, codeItem){ //코드 키 네임 매핑
                                if(codeItem.PRNT_CD == code && codeItem.CODE == item[column]){
                                    if(_lang == "ko"){
                                        item[column + "_NM"] = codeItem.NAME;

                                        return false;
                                    }else{
                                        //EN_NAME이 정의 되어 있지 않을 경우, NAME을 추가
                                        item[column + "_NM"] = codeItem.EN_NAME || codeItem.NAME;

                                        return false;
                                    }
                                }
                            });
                        }
                    }
                });
            }
        });
    }
},
getCodeCd: function(element, codeArray){
    if(element['_code_resolve']){
        var codeSet = element['_code_resolve'].split(",");
        for(var idx = 0; idx < codeSet.length; idx++){
            var code = codeSet[idx].split("#")[1];
            if($.inArray(code, codeArray) == -1){
                codeArray.push(code);
            }
        }
    }
}
};

/**
* 리소스로더 javascript, css 파일을 동적로드하기 위한 함수를 제공한다.
*/
var ResourceLoader = {
/**
 * css 자원을 로드 한다.
 *
 * @param cssFullPath
 *            css 전체 파일 경로
 */
css : function(cssFullPath) {
    var headID = document.getElementsByTagName("head")[0];
    var cssNode = document.createElement('link');
    cssNode.type = 'text/css';
    cssNode.rel = 'stylesheet';
    cssNode.href = cssFullPath;
    headID.appendChild(cssNode);
},
/**
 * javascript 리소스 정보를 동적 로드한다.
 *
 * @param javascriptFullPath
 */
javascript : function(javascriptFullPath) {
    var nowDate = new Date(); // 캐쉬문제로 인한 변수 호출
    nowDate = nowDate.getTime();
    var headID = document.getElementsByTagName("head")[0]; // 해더 사이에 위치 지정
    var jsNode = document.createElement('script'); // 엘리멘터리 생성
    jsNode.type = 'text/javascript'; // 속성 지정
    jsNode.src = javascriptFullPath + '?' + nowDate; // 속성지정
    headID.appendChild(jsNode); // 해더사이에 추가
}
}

var Layer = {
defaultOption : {
    modal : true,
    draggable : false,
    closeOnEscape : false,
    open : function( event, ui ) {
    },
    buttons : [ {
        text : "OK",
        /*
         * icons : { primary : "ui-icon-heart" },
         */
        click : function() {
            $(this).dialog("close");
        }
    } ]
},
dialog : function(html, options) {
    var _options = jQuery.extend({}, this.defaultOption); // 기본 옵션 객체 복사

    $.each(options, function(k, v) { // 넘어온 옵션값 지정
        _options[k] = v;
    });

    //var layerId="layer_" + new Date().getMilliseconds();
    //$(html).attr('id', layerId);
    //$('body').append($(html));

    $(html).dialog(_options);

},
modal : function(html, options) {
    if (!options)
        options = {};
    options['draggable'] = false;
    options["modal"] = true;
    this.dialog(html, options);
},
dragModal : function(html, options) {
    if (!options)
        options = {};
    options['draggable'] = true;
    options["modal"] = true;
    this.dialog(html, options);
},
modeless : function(html, options) {
    if (!options)
        options = {};
    options['draggable'] = false;
    options["modal"] = false;
    this.dialog(html, options);
},
dragModeless : function(html, options) {
    if (!options)
        options = {};
    options['draggable'] = true;
    options["modal"] = false;
    this.dialog(html, options);
},
/**
 * html 형태의 템플릿을 불러온 후 다이얼 로그를 출력한다.
 *
 * @url {String} html 템플릿 주소
 * @isModal {boolean} 모달로 띄울 모달리스로 처리할지의 여부 체크 기본값은 모달
 *
 */
modalHtml : function(url, options, successHandler) {
    if (!options) options = {};
    $.ajax({
        type: 'POST',
        url: url,
        dataType : "html",
        async: true,
        cache : false,
        success: function(data) {
            options["modal"] = true;
            Layer.dialog($(data), options);

            if(successHandler){
                functionDispatch(successHandler, [ $(data) ]);
            }
        },
        complete : function() {
            // 로딩 마스크를 숨긴다.
            hideLoadingMask();
        }
   });
},
modelessHtml : function(url, options, successHandler) {
    if (!options)
        options = {};
    $.get(url, function(data) {
        options["modal"] = false;
        Layer.dialog($(data), options);

        if(successHandler){
            functionDispatch(successHandler, [ $(data) ]);
        }

    }).complete(function() {
        // 로딩 마스크를 숨긴다.
        hideLoadingMask();
    });
},
/**
 * 레이어를 닫는다.
 *
 * @param selector jquery 셀렉터
 */
close : function(selector){
    $( selector ).dialog( "close" );
}

};

var Util = {
/**
 * originalstr: lpad 할 text length: lpad할 길이 strToPad: lpad 시킬 text
 */
lpad : function(originalstr, length, strToPad) {
    while (originalstr.length < length)
        originalstr = strToPad + originalstr;
    return originalstr;
},

/**
 * originalstr: rpad 할 text length: rpad할 길이 strToPad: rpad 시킬 text
 */

rpad : function(originalstr, length, strToPad) {
    while (originalstr.length < length)
        originalstr = originalstr + strToPad;
    return originalstr;
}
};

var Form = {
/**
 * 폼을 리셋한다.
 * @param id {String} 폼 아이디명
 */
reset : function(id) {
    $("#" + id)[0].reset();
},
/**
 * 폼을 서브밋 시킨다.
 * @param id {String} 폼 아이디명
 * @param action {String} 액션 정보
 */
submit : function(id, action) {
    if (action)
        $('#' + id).attr('action', action);
    $('#' + id).submit();
},

validationForm : function(formId, msgObj) {
    var $form = $('#' + formID);
    var msg = msgObj || {};

    var result = true;
    $form.find('input, textarea').each(
        function(idx, item) {
            var objVal = $(this).val() || $(this).text() || "";

            if ($(this).hasClass('not-emp')) {
                if (objVal.trim() == "") {
                    // TODO : getMessage 추가
                    var m = msg['not-emp'] || 'TODO : getMessage 공백 x';
                    Message.alert(m);
                    result = false;
                    $(this).focus();
                    return false;
                }
            }
            if ($(this).hasClass('range')) {
                var minRange = $(this).attr('min');
                var maxRange = $(this).attr('max');

                var r = msg['range'] || {};

                if (!objVal.isBytes(minRange)) {
                    // TODO : getMessage 추가
                    var m = r['min'] || 'TODO : getMessage 영문기준 '
                            + minRange + "이상";
                    Message.alert(m);
                    result = false;
                    $(this).focus();
                    return false;
                } else if (!objVal.isBytes(minRange, maxRange)) {
                    // TODO : getMessage 추가
                    var m = r['max'] || 'TODO : getMessage 영문기준 '
                            + maxRange + "이하";
                    Message.alert(m);
                    result = false;
                    $(this).focus();
                    return false;
                }
            }

            if ($(this).hasClass('password')) {
                if (!validatePassword(objVal)) {
                    $rtnObj = false;
                    $(this).focus();
                    return false;
                }
            }

            if ($(this).hasClass('is-time')) {
                if (!objVal.isTime(getTimeFormat())) {
                    // TODO : getMessage 추가
                    var m = msg['is-time']
                            || 'TODO : getMessage HH:mm 형태 x';
                    Message.alert(m);
                    result = false;
                    $(this).focus();
                    return false;
                }
            }

            if ($(this).hasClass('is-date')) {
                if (!objVal.isDate(getDateFormat())) {
                    // TODO : getMessage 추가
                    var m = msg['is-date']
                            || 'TODO : getMessage yyyy-MM-dd 형태 x';
                    Message.alert(m);
                    result = false;
                    $(this).focus();
                    return false;
                }
            }
        });

    return result;
}
};


var AtchFile = {
    /**
     * jquery MultiFile 라이브러리를 사용하여 1개 이상의 파일 업로드 형태로 초기화 한다.
     * @param inputFileId <input type="file"/> 형태의 input id
     * @param listId	업로드 예정 파일 목록 태그id
     * @param option	추가 옵션. 없을 시 default값으로 대체 된다.
     */
    initMultiFile : function(inputFileId, listId, option){

        option = option || {};

        if((option.max == null) || isNaN(option.max))
            option.max = 0;

        //파일 업로드
        $('#'+inputFileId).MultiFile({
            max : option.max, 	//최대 파일갯수
            accept : this.extend[option.extend] || this.extend.defExt,//확장자 제한
            maxfile : option.maxfile || -1,//각 파일 최대 업로드 크기(KB);
            maxsize : option.maxsize || -1,//전체 파일 최대 업로드 크기(KB);
            list : '#'+listId,
            STRING: {
              remove : this.multiFileStr.remove,
              duplicate : this.multiFileStr.duplicate,
              selected : this.multiFileStr.selected,
              toobig : this.multiFileStr.toobig,
              toomany : this.multiFileStr.toomany,
              denied : this.multiFileStr.denied
              //file: '<em title="Click to remove" onclick="$(this).parent().prev().click()">$file</em>'
            },
            onFileRemove: function(element, value, master_element){},
            afterFileRemove: function(element, value, master_element){
                alert('remove');
            },
            onFileAppend: function(element, value, master_element){},
            afterFileAppend: function(element, value, master_element){
                alert('append');
                $(element).remove();
            },
            onFileSelect: function(element, value, master_element){},
            afterFileSelect: function(element, value, master_element){},
            onFileInvalid: function(element, value, master_element){},
            onFileDuplicate: function(element, value, master_element){},
            onFileTooMany: function(element, value, master_element){},
            onFileTooBig: function(element, value, master_element){},
            onFileTooMuch: function(element, value, master_element){},
            onFileOpen: function(element, value, master_element){
                //alert('open');
            }
         });
    },
    /**
     * 확장자 제한 목록 구룹핑
     */
    extend : {
        defExt : 'zip|pdf|doc|docx|hwp|xls|xlsx|ppt|pptx|txt|jpg|jpeg|tif|tiff|png|bmp|gif',
        image : 'jpg|jpeg|gif|png|tiff',
        document : 'zip|pdf|doc|docx|hwp|xls|xlsx|ppt|pptx|txt|csv',
        avi : 'avi|mp4|mpeg|wmv',
        excel : 'xls|xlsx'
    },
    /**
     * multiFile 관련 String 모음. 커스터 마이징이 필요할 경우, 아래변수만 커스터 마이징 하면 된다.
     */
    multiFileStr : {
        remove:'<span type="button" class="nmsc_btn nmsc_inline nmsc_btn_tiny nmsc_btn_style03">삭제</span>',
        duplicate: '이미 선택 된 파일입니다. : $file',
        selected:'$file 을 선택했습니다.',
        toobig: '$file 파일 크기가 너무 큽니다. (최대 :  $size)',
        toomany: '선택된 파일이 너무 많습니다. (max: $max)',
        denied:'첨부파일 형식이 올바르지 않습니다.'
    },
    /**
     * 이미 등록된 첨부파일 목록을 리스트 박스에 반영한다.
     * @param inputFileId 파일아이디
     * @param listId 파일목록 박스 아이디명
     * @param fileList 파일 목록 [{"NAME":"file.txt", "SEQ":"23"},{"NAME":"test.txt", "SEQ":"24"}]
     */
    appendFileList : function(inputFileId, listId, fileList){

        if(fileList == null || fileList.length == 0) return false;

        var mf = $('#' + inputFileId).MultiFile('data');
        var template =
            "<div class=\"MultiFile-label\">"+
            "	<a class=\"MultiFile-remove\" href=\"#atchFile\"></a>"+
            "	<span>"+
            "		<span class=\"MultiFile-label\">"+
            "			<span class=\"MultiFile-title\"></span>"+
            "		</span>"+
            "	</span>"+
            "</div>";

        $(fileList).each(function(index, file){
            var fileItem = $(template);
            fileItem.find('.MultiFile-remove').html(mf.STRING.remove);
            fileItem.find('.MultiFile-remove').on('click',{attachFileUsq : file.attachFileUsq} ,function(e){
                e.preventDefault();
                $(this).parent().append("<input type=\"hidden\" name=\"detachFile\" value='"+e.data.attachFileUsq+"' />");
                $(this).parent().hide();
            });
            fileItem.find('.MultiFile-title').text(file.originalName);
            $('#' + listId).append(fileItem);
        });
    },
    getFileItemSize : function(listId){
        return $('#' + listId + " > div").length();
    }

}


var IndiFile = {
max : 0,
accept : 'zip|pdf|doc|docx|hwp|xls|xlsx|ppt|pptx|txt|jpg|jpeg|tif|tiff|png|bmp|gif', //파일 확장자
remove : "<span type=\"button\" class=\"nmsc_btn nmsc_inline nmsc_btn_tiny nmsc_btn_style03\">삭제</span>", //삭제버튼
fileListId : "atchFileList", //파일 등록 목록 영역 아이디
fileId : "atchUploadFiles", //파일 input 영역 아이디
fileName : "atchFile", //파일 input 박스 명
fileItem : "<li style=\"height:23px;\"><a href=\"#none\" class=\"btn_type6 detach-button\">remove</a> <span class=\"attach-file\"></span></li>",
addNewFile : function(file){
    $(file).blur();
    var timestamp =  IndiFile.getTimestamp();

    //용량 체크
    if(IndiFile.max != 0 && IndiFile.getFileListSize() >= IndiFile.max){
        Message.alert(getMessage("E0047").replace('${size}', IndiFile.max));
        IndiFile.createNewFileElement(timestamp);
        $(file).remove();
        return false;
    }

    //null 문자 체크
    var fileName = $(file).val();
    if(fileName.indexOf("%00") > -1 || fileName.indexOf("\0") > -1){
        Message.alert("업로드 파일명에 포함할 수 없는 문자열이 포함되었습니다.");
        IndiFile.createNewFileElement(timestamp);
        $(file).remove();
        return false;
    }

    var accept = IndiFile.accept.replace(/\W+/g, '|').replace(/^\W|\W$/g, '');
    var rxAccept = new RegExp('(' + (accept ? accept : '') + ')$', 'gi');
    var ext = IndiFile.getFileExt($(file).val());
    if(ext.match(rxAccept)){

        $(file).css({
            position: 'absolute',
            top: '-3000px'
        });

        IndiFile.addNewList(file, timestamp);
        IndiFile.createNewFileElement(timestamp);
        return true;
    }else{
        Message.alert(getMessage("E0046"));
        IndiFile.createNewFileElement(timestamp);
        $(file).remove();
        return false;
    }
},
addNewList : function(file, timestamp){
    var item = $(IndiFile.fileItem);
    item.attr("id", "attch_file_item_" + timestamp);
    item.find(".attach-file").text(IndiFile.getFileName($(file).val()));
    item.find(".detach-button").html(IndiFile.remove);
    item.find(".detach-button").click(function(e){
        e.preventDefault();
        $(this).parent().remove();
        $(file).remove();
    });
    $("#" + IndiFile.fileListId).append(item);
},
createNewFileElement : function(timestamp){
    var item = $("<input name='"+IndiFile.fileName+"' type=\"file\" style=\"width:100%;\" />");
    item.attr("id", "attch_file_" + timestamp);
    item.change(function(){
        IndiFile.addNewFile(this);
    });
    $("#" + IndiFile.fileId).append(item);

},
appendFileList : function(fileList){
    if(fileList == null || fileList.length == 0) return false;

    $(fileList).each(function(index, file){
        var item = $(IndiFile.fileItem);
        item.attr("id", "attch_file_item_" + IndiFile.getTimestamp());
        item.find(".attach-file").text(file.originalFileName);
        item.find(".detach-button").html(IndiFile.remove);
        item.find(".detach-button").on("click", {attachFileUsq : file.attachFileUsq}, function(e){
            e.preventDefault();
            $("#" + IndiFile.fileId).append("<input type=\"hidden\" name=\"detachFile\" value='"+e.data.attachFileUsq+"' />");
            $(this).parent().remove();
        });
        $("#" + IndiFile.fileListId).append(item);
    });
},
getFileName : function(path){
    return path.match(/[^\/\\]+$/gi);
},
getFileExt : function(path){
    return String(path.match(/[^\.]+$/i) || '');
},
getFileSize : function(x){
    return x > 1048576 ? (x / 1048576).toFixed(1) + 'Mb' : (x==1024?'1Mb': (x / 1024).toFixed(1) + 'Kb' );
},
/**
 * 타임스탬프를 반환한다.
 *
 * @returns {Number} 타임스탬프
 */
getTimestamp : function() {
    return new Date().getTime();
},
getFileListSize : function(){
    return $("#" + IndiFile.fileListId + " li").length;
}
,fileDownload : function(url, attachFileUsq, refTbUsq){
    url = url + "?attachFileUsq=" + attachFileUsq;
    if(refTbUsq){
        url += "&refTbUsq=" + refTbUsq;
    }
    $("#hidden-iframe").attr("src", url);
}
};


/**
* 다운로드 요청을 한다.
*/
function downloadAtchFile(url){

if($('#hidden-iframe').length == 0){
    var hiddenFrame = $('<iframe id="hidden-iframe" style="display: none;"></iframe>');
    $('body').append(hiddenFrame);
}

$("#hidden-iframe").attr("src", url);
}

var NumberUtil =
{
/**
 * 세자리 수마다 콤마 표시
 */
numberWithCommas : function(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
}

/**
* 컨텐츠 영역을 프린트 한다.
* @returns
*/
function printContainerArea() {

var printWindow = window.open("", "print", "height=600,width=600");
var printHtml = "<html><head><link rel=\"stylesheet\" type=\"text/css\" href=\"/resources/homepage/css/style.css\" /><title>print</title></head><body style='margin:0 5px 0 5px'>"+$("#homepage-container").html()+"</body></html>";

printWindow.document.open();
printWindow.document.write(printHtml);
printWindow.document.close();


printWindow.onload=function(){ // necessary if the div contain images
    printWindow.document.close();
    printWindow.focus(); // necessary for IE >= 10
    printWindow.print();
    printWindow.close();
 };
}

/**
* 주석 형태로 싸여진 html을 가져오기 위해서 사용한다.
* header_html = hereDoc(function() {
*  <pre> /@ <div class="container"></div>  @/ </pre>
* }
* @param f
* @returns
*/
function hereDoc(f) {
var scriptEls = document.getElementsByTagName('script'),
     scriptSrc = scriptEls[scriptEls.length - 1].src,
     isIdx = /\?index$/.test(scriptSrc);

return f.toString().
replace(/^[^\/]+\/\*!?/, '').
replace(/\*\/[^\/]+$/, '').
replace(isIdx ? /="\.\.\//g : '', isIdx ? '="../' : '');

//'/
}

var Plugin = {
Vue : {
      filters : {}
    , method : {}
    , utils : {
        /**
         * data가 랜더링 된 이후에 data에 새로운 프로퍼티(key)가 생기면
         * vue에서 이를 감지하지 못함(랜더링x) 각 프로퍼티마다 setter를
         * 정의해줘야하는데 vue에 옵저버가 생성되기 전에 프로퍼티 키값만 미리 생성
         * @param dataObj
         * @returns {*}
         */
        addPropsBeforeObserve : function(dataObj){
            if(dataObj['_code_resolve']){
                var codeSet = dataObj['_code_resolve'].split(",");
                for(var i = 0; i < codeSet.length; i++){
                    var code = codeSet[i].split("#")[1];

                    if(code){
                        dataObj[code+"_NM"] = null;
                    }
                }
            }

            return dataObj;
        }
    }
}
}

/**
* date 관련 함수 정의
* @type {{}}
*/
var DateUtil = {

date : function(value){
    if(value == undefined || value == null) return "";
    var dt = Util.rpad(value, 14, "0");
    return dt.toDate("yyyyMMddHHiiss", "yyyy.MM.dd");
}


}

/**
* 가장 근접한 시간대에 인덱스를 반환한다.( 홈페이지(국/영문)-위성영상에서 사용 )
*   (time이 23:50 fileList["label"]은 00:00 ~ 04:00 일경우 04:00이 가장 근접한 값)
* @param {*} time : 기준점이 되는 관측시간 정보
* @param {*} fileList : 배열 정보
*/
function getNearIndex(time, fileList) {

time = parseInt( time.replace(/:/gi, "") );

var currentIndex = 0;
var diff = Math.abs(time - parseInt(fileList[currentIndex]["label"].split(/\s/gi)[0].replace(/:/gi, "")));

for (var i = 0; i < fileList.length; i++) {
    var newdiff = Math.abs(time - parseInt(fileList[i]["label"].split(/\s/gi)[0].replace(/:/gi, "")));
    if (newdiff < diff) {
        diff = newdiff;
        currentIndex = i;
    }
}

return currentIndex;
}