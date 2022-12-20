////////////////////////////////////////////////////////////////////////////////
// 글로벌 변수
////////////////////////////////////////////////////////////////////////////////
// var DATA_LIST = "/homepage/json/base/bbs/listBbs.do";
// var DATA_DOWNLOAD_ALL = "/homepage/html/base/bbs/listAtchFile.do";
// var VIEW_SELECT = "/homepage/html/base/bbs/selectBbs.do";

var DATA_LIST = "";
var DATA_DOWNLOAD_ALL = "";
var VIEW_SELECT = "";

var template = null;
var userAgent = window.navigator.userAgent;	

var BbsListComponent = {
	template : hereDoc(function(){
    	/*<tbody id="search-data">
            <tr v-for="(item, index) in list" v-if="list.length > 0">
            	<td>
					<span v-if="(item.TOP_DISP_FL == 'Y')">공지</span>
					<span v-else v-text="rowNumber(item.BBS_USQ, number, index, topNtceCount)"></span>
				</td>
				<td class="left">
					<span class="bbs-repl" v-if="(item.BBS_DEPTH != 1)">[답글]</span>
					<a href="javascript:void(0);" v-on:click.prevent="detaiItem(item.BBS_USQ, $event)">
					<span v-text="getText(item.TITLE, item.DEL_FL)"></span>
					<span v-if="(item.IS_NEW === 'Y')" class="flag flag-new">New</span>
					</a>
				</td>
				<td>관리자</td>
				<td v-text="date(item.REG_DATE)"></td>
				<td v-text="item.HITS"></td>
				<td>
					<a href="#none" v-if="(item.HAS_ATTACH_FILE > 0)" v-on:click.prevent="downloadAll(item.BBS_CD, item.BBS_USQ, $event)">
					<i class="icon-attach"><span class="hide">파일첨부</span></i>
					</a>
				</td>
            </tr>
            <tr  v-if="list.length == 0"><td colspan="6">등록된 게시글이 없습니다.</td></tr>
        </tbody >*/
	})
	,props : ["list", "number", "topNtceCount"]
	,methods : {
        detaiItem : function(usq, e){
            updateFormData();

            var frm = $('#searchForm');
            frm.attr("action", VIEW_SELECT + "?bbsCd=" + BBS_CD + "&bbsUsq=" + usq);
            frm.submit();
        },
        getText : function(txt, delFl){
            if(delFl == 'Y')
                return getMessage('msg.delete.bbs.sbjt');
            else
                return txt;
        },
        downloadAll : function(bbsCd, bbsUsq, e){
            var downloadAllUrl = DATA_DOWNLOAD_ALL + "?bbsCd=" + BBS_CD + "&bbsUsq=" + bbsUsq;

            $("#hidden-iframe").attr("src", downloadAllUrl);
            return false;
        }
	}
}


////////////////////////////////////////////////////////////////////////////////
//초기화 함수
////////////////////////////////////////////////////////////////////////////////
/**
* 이벤트를 바인딩한다.
*/
function bindEvent() {
	
	// 리셋 버튼에 클릭이벤트를 바인딩한다.
	$(".resetBtn").on("click", function() {
		// 검색영역을 초기화한다.
		Form.reset("searchForm");
		// 검색단어를 초기화한다.
		$("#searchWord").val("");
		
		updateGlobalData();
		
	});
	
	$(".searchBtn").on("click", function() {
		updateGlobalData();
		changePage(1);
		
		return false;
	});
}

/**
 * 메시지를 처리한다.
 * 
 * @param messages {Object} 메시지
 */
function handleMessage(messages) {
	Message.alert(messages.message);
	changePage(1);
}

/** 
* 옵션을 로드한다.
*/
function loadOptions() {
	
	var options = 
		[{
			CODE: "",
			NAME: "검색조건"
		}, {
			CODE: "TITLE",
			NAME: "제목"
		}, {
			CODE: "CONTENTS",
			NAME: "내용"
		}];
	
	initComboOptions("searchType", options, SearchParam.searchType);
}

/**
* 데이터를 로드한다.
*/
function loadData() {
	
	if(userAgent.indexOf("Webserver Stress Tool") > 0){
		return;
	}
	
	changePage($('#pageIndex').val());
}

/**
* 컴포넌트를 초기화한다.
*/
function initComponent() {
	//template = $('#search-data').html(); //로우 테이블 정보를 셋팅
}

////////////////////////////////////////////////////////////////////////////////
//디폴트 함수
////////////////////////////////////////////////////////////////////////////////


var vm;

/**
* 데이터를 처리한다.
* 
* @param data {Array} 검색 데이터
* @param count {Number} 검색 카운트
* @param total {Number} 전체 카운트
* @param page {Number} 페이지 번호
* @param rows {Number} 페이지 크기
*/
function handleData(data, count, total, page, rows) {

	if($.isArray(data)){
		if (count == 0 && data.length == 0) {		//공지만 있을 시, count는 0이 됨
			$(".board-view-section").remove();
			$('.all-tx').text("전체 "+NumberUtil.numberWithCommas(0)+"건"); //총 카운트 수
		}

		if(vm){
            vm.list = data;
            vm.number = Paging.getRowNumber(count, page, rows);
            vm.topNtceCount = Paging.getTopNtceCnt(data);
		}else{
            vm = new Vue({
                el: "#listComponent"
                ,components : {
                    "bbs-component" : BbsListComponent
                }
                ,data: {
                     number : Paging.getRowNumber(count, page, rows)
                    ,list : data
                    ,topNtceCount : Paging.getTopNtceCnt(data)
                }
            });
		}



		$('.all-tx').text("전체 "+NumberUtil.numberWithCommas(count)+"건"); //총 카운트 수

		// 페이징을 처리한다.
		Paging.handlePaging(count, page, rows);


		if($('#listContentsFl').val() == 'Y'){
			//가장 최근 글은 상단영역에 표출한다.
			$(data).each(function(index, item){
				if(index == 0){
					displayTopContents(item);
				}
			});
		}
	}
}

function displayTopContents(item){
	var date = DateUtil.date(item.REG_DATE);


	$("strong.TITLE").text(item.TITLE);
	$("span.REG-DATE").text("등록일 : " + date);
	if(item.HTML_FL == 'Y'){
		$("div.CONTENTS").text(item.CONTENTS);
	}else{
		$("div.CONTENTS").html(item.CONTENTS);
	}
	
}

/**
* 페이지를 변경한다.
* 
* @param page {Number} 페이지 번호
*/
function changePage(page) {
	
	$("#pageIndex").val(page);
	
	Ajax.getData(
		DATA_LIST,
		{
			pageIndex :$("#pageIndex").val(),
			searchType:SearchParam['searchType'],
			searchWord:SearchParam['searchWord'],
			bbsCd:BBS_CD,
		},
		handleResponse
	);
}

/**
 * 전역 변수에 검색 조건을 넣은다.
 */
function updateGlobalData(){
	SearchParam['searchType'] = $("#searchType").val();
	SearchParam['searchWord'] = $("#searchWord").val();
}

/**
 * 전역변수에 담긴 데이터를 검색조건에 넣는다.
 */
function updateFormData(){
	$("#searchType").val(SearchParam['searchType'] || "");
	$("#searchWord").val(SearchParam['searchWord'] || "");
}