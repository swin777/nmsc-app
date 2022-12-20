import { useSetRecoilState } from "recoil";
import { MODE, mode } from "../state";

const TopicCard = () => {
    const setMode = useSetRecoilState(mode);

    const goTopicDetail = () => {
        setMode(MODE.TOPIC_DETAIL)
    }

    return (
        <section className="board-view-section">
            <div className="board-header">
                <div className="checks center">
                    <input type="checkbox" name="" id="category01"/>
                    <div className="text">
                        <strong className="title full ml20" style={{cursor:'pointer'}} onClick={goTopicDetail}>
                            이박사 / 위험기상요소 처리 알고리즘
                        </strong>
                    </div>
                </div>
            </div> 
            <div className="board-content">
                <div className="cke_contents">
                    위험기상요소 처리 알고리즘 연구
                </div>
            </div>
            <div className="board-footer">
                <div className="group">
                    <span className="date">등록일 : 2022.12.07</span> 
                </div>
                <div className="group">
                    <span className="lang">작성 언어 : Python</span> 
                </div>
            </div>
        </section>
    )
}

const TopicList = () => {
    const setMode = useSetRecoilState(mode);
    return(
        <div className="content-wrap">
            <article id="content">
                <div style={{display:'flex', justifyContent:'space-between'}}>
                    <h4 className="sub-title"># 천리안 위성 2호</h4>
                    <button className="btn btn-primary" onClick={()=>setMode(MODE.CATEGORY_LIST)}>카테고리 가기</button>
                </div>
                <div className="board-util mb-20">
                    <p className="all-tx">전체 1,388건</p>
                    <form name="searchForm" id="searchForm" method="post">
                    <input type="hidden" name="pageIndex" id="pageIndex" value="1"/>
                    <div className="search-box">
                        <div className="select-style">
                            <label htmlFor="searchType">검색조건</label>
                            <select id="searchType" name="searchType"><option value="">검색조건</option><option value="TITLE">제목</option><option value="CONTENTS">내용</option></select>
                        </div>
                        <div className="search-text">
                            <input type="text" className="input" title="검색어 입력" id="searchWord" name="searchWord" value=""/>
                            <button className="btn-search searchBtn"><span className="hide">검색</span></button>
                        </div>
                    </div>
                    </form>
                </div>
                <div>
                    {[1,2].map(()=>
                        <TopicCard/> 
                    )}
                </div>
                <div className="btn-area right">
                    <button className="btn btn-primary" onClick={()=>setMode(MODE.TOPIC_REG)}>토픽 생성</button>&nbsp;
                    <button className="btn btn-line red">토픽 삭제</button>
                </div>
            </article>
        </div>
    )
}

export default TopicList;