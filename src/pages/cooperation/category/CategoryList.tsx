import { useMemo, useState, useEffect } from "react";
import { useRecoilState, useRecoilValueLoadable, useSetRecoilState } from "recoil"
import { categoryRefresh, listCategories, mode, MODE, selectCatory, topicRefresh, categorySearchKeyWord, categorySearchType, SEARCH_TYPE } from '../state'
import Pagination from "react-js-pagination";
import { Category, CategoryListData } from "../../../models/category";
import { serverCall } from "../../../utils/apiCallUtil";
import PopLoading from "../../../components/PopLoading";

type CategoryProps = {
    category: Category|null,
}

let checkCategories:Array<number> = [];

const CategoryCard = ({category}:CategoryProps) => {
    const setMode = useSetRecoilState(mode);
    const setSelectCatory = useSetRecoilState(selectCatory);
    const setTopicRefresh = useSetRecoilState(topicRefresh);
    const [check, setCheck] = useState(false);

    const goTopic = () => {
        setTopicRefresh(new Date().getTime())
        setSelectCatory(category);
        setMode(MODE.TOPIC_LIST)
    }
    
    useEffect(()=>{
        if(check){
            checkCategories = [...checkCategories, category!.categoryId]
        }else{
            checkCategories = [...checkCategories.filter(e=>e!==category!.categoryId)];
        }
    }, [check])

    return(
        <li>
            <div className="checks center">
                <input type="checkbox" id={category?.categoryId+''} checked={check} onChange={e=>{setCheck(!check);}}/>
                <div className="text">
                    <strong className="title" style={{cursor:'pointer'}} onClick={goTopic}>{category?.title}</strong>
                    <div className="ck" dangerouslySetInnerHTML={{ __html: category!.contents }} ></div>
                    <div className="tag_group">
                        {category?.tags}
                    </div>
                </div>
            </div>
        </li>
    )
}

const CategoryList = () => {
    const setMode = useSetRecoilState(mode);

    const limit = 5; //한 페이지에 있는 리스트 개수
    const [page, setPage] = useState<number>(1); //현재 페이지
    const setCategoryRefresh = useSetRecoilState(categoryRefresh);

    const categoryListDataAtom = useRecoilValueLoadable<CategoryListData|null>(listCategories({page:page}))
    const [categoryListData, setCategoryListData] = useState<CategoryListData|null>(null)

    const [searchType, setSearchType] = useRecoilState(categorySearchType)
    const [searchKeyWord, setSearchKeyWord] = useRecoilState(categorySearchKeyWord)
    const [loading, setLoading] = useState<boolean>(false);

    const handlePageChange = (page:number) => {
        setPage(page);
    };

    const deleteCategory = async() => {
        let res:any = await serverCall(`/homepage/html/base/collaboration/deleteCategory.do`, 'DELETE', {'categoryIds':checkCategories})
        if(res.data){
            alert('삭제되었습니다.');
            setPage(1);
            setCategoryRefresh(new Date().getTime())
        }else{
            alert(res.error);
        }
    }

    useMemo(()=>{
        if(categoryListDataAtom?.state){
            setLoading(true)
        }
        if(categoryListDataAtom?.state === 'hasValue' && categoryListDataAtom?.contents){
            setCategoryListData(categoryListDataAtom?.contents);
            setLoading(false)
        }
    },[categoryListDataAtom])

    return(
        <>
            {loading && <PopLoading/>}
            <section className="board-list-section">
                <h4 className="sub-title">카테고리</h4>
                <div className="board-util">
                    <p className="all-tx">전체 {categoryListData?.total.toLocaleString()}건</p>
                    <form name="searchForm" id="searchForm" method="post">
                    <input type="hidden" name="pageIndex" id="pageIndex" value="1"/>
                    <div className="search-box" style={{borderRight:'solid #8d8d8d 1px'}}>
                        <div className="select-style" style={{backgroundColor:'#fff'}}>
                            <label htmlFor="searchType">{searchType}</label>
                            <select id="searchType" name="searchType" onChange={e=>setSearchType(e.target.value+'')} value={searchType+''}>
                                {/* <option value="" >검색조건</option> */}
                                <option value={SEARCH_TYPE.searchTitle} >{SEARCH_TYPE.searchTitle}</option>
                                <option value={SEARCH_TYPE.searchContents} >{SEARCH_TYPE.searchContents}</option>
                                {/* <option value={SEARCH_TYPE.searchAuthor} >{SEARCH_TYPE.searchAuthor}</option> */}
                            </select>
                        </div>
                        <div className="search-text">
                            <input type="text" className="input" title="검색어 입력" id="searchWord" name="searchWord" onChange={(e)=>setSearchKeyWord(e.target.value)}/>
                            {/* <button className="btn-search searchBtn">
                                <span className="hide">검색</span>
                            </button> */}
                        </div>
                    </div>
                    </form>
                </div>

                {/* <ul id="search-data" className="gallery-list collabo" style={{height:600, overflowY:'auto'}}> */}
                <ul id="search-data" className="gallery-list collabo">
                    {categoryListData && categoryListData.categories && categoryListData.categories.map((category)=>
                    <CategoryCard key={category.categoryId} category={category}/> 
                    )}
                </ul>
                <div id="paging-area">
                    <Pagination 
                        activePage={page} // 현재 페이지
                        itemsCountPerPage={categoryListData ? categoryListData.rows : 0} // 한 페이지에 보여줄 데이터 갯수
                        totalItemsCount={categoryListData ? categoryListData.total : 0} // 총 데이터 갯수
                        pageRangeDisplayed={10} // paginator의 페이지 범위(한번에 보여줄 페이지 범위)
                        onChange={handlePageChange} // 페이지 변경을 핸들링하는 함수
                    />
                </div>
                <div className="btn-area right">
                    <button className="btn btn-primary" onClick={e=>setMode(MODE.CATEGORY_REG)}>카테고리 생성</button>&nbsp;
                    <button className="btn btn-line red" onClick={deleteCategory}>삭제</button>
                </div>
            </section>
            
            <div className="btn-top">
                <button type="button"><span>TOP</span></button>
            </div>
        </>
    )
}

export default CategoryList;