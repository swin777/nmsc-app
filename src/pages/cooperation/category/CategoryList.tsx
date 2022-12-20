import { useState } from "react";
import { useSetRecoilState } from "recoil"
import { mode, MODE } from '../state'
import Pagination from "react-js-pagination";

const CategoryCard = () => {
    const setMode = useSetRecoilState(mode);

    const goTopic = () => {
        setMode(MODE.TOPIC_LIST)
    }

    return(
        <li>
            <div className="checks center">
                <input type="checkbox" name="" id="category01"/>
                <div className="text">
                    <strong className="title" style={{cursor:'pointer'}} onClick={goTopic}>천리안위성 1호</strong>
                    <p>천리안위성 1호 관련 협업 공간입니다.</p>
                    <div className="tag_group">
                        <span className="tag">해시태그1</span>
                        <span className="tag">해시태그1</span>
                        <span className="tag">해시태그1</span>
                        <span className="tag">해시태그1</span>
                        <span className="tag">해시태그1</span>
                    </div>
                </div>
            </div>
        </li>
    )
}

const CategoryList = () => {
    const [cacheBust, setCacheBust] = useState(new Date().getTime());
    //pagination
    const limit = 5; //한 페이지에 있는 리스트 개수
    const [page, setPage] = useState<number>(1); //현재 페이지

    const handlePageChange = (page:number) => {
        setPage(page);
    };

    const setMode = useSetRecoilState(mode);
    return(
        <div className="content-wrap">
            <article id="content">
                <section className="board-list-section">
                    <h4 className="sub-title">카테고리</h4>
                    <div className="board-util">
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

                    <ul id="search-data" className="gallery-list collabo">
                        {[1,2,3].map(()=>
                        <CategoryCard/> 
                        )}
                    </ul>
                    <div id="paging-area">
                        <Pagination 
                            activePage={page} // 현재 페이지
                            itemsCountPerPage={limit} // 한 페이지에 보여줄 데이터 갯수
                            totalItemsCount={30} // 총 데이터 갯수
                            pageRangeDisplayed={10} // paginator의 페이지 범위(한번에 보여줄 페이지 범위)
                            onChange={handlePageChange} // 페이지 변경을 핸들링하는 함수
                        />
                    </div>
                    <div className="btn-area right">
                        <button className="btn btn-primary" onClick={e=>setMode(MODE.CATEGORY_REG)}>카테고리 생성</button>&nbsp;
                        <button className="btn btn-line red">삭제</button>
                    </div>
                </section>
                
                <div className="btn-top">
                    <button type="button"><span>TOP</span></button>
                </div>
            </article>
        </div>
    )
}

export default CategoryList;