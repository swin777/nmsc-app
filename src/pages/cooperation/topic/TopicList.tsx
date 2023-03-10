import { useEffect, useMemo, useState } from "react";
import { useRecoilState, useRecoilValue, useRecoilValueLoadable, useSetRecoilState } from "recoil";
import PopLoading from "../../../components/PopLoading";
import { Topic, TopicListData } from "../../../models/topic";
import { serverCall } from "../../../utils/apiCallUtil";
import { listTopics, MODE, mode, SEARCH_TYPE, selectCatory, selectTopic, topicDetailRefresh, topicRefresh, topicSearchKeyWord, topicSearchType as topicSearchTypeAtom } from "../state";

type TopicProps = {
    topic: Topic|null,
}

let checkTopics:Array<number> = [];

const TopicCard = ({topic}:TopicProps) => {
    const setMode = useSetRecoilState(mode); 
    const setTopicDetailRefresh = useSetRecoilState(topicDetailRefresh);
    const setSelectTopic = useSetRecoilState(selectTopic);
    const [check, setCheck] = useState(false);

    const goTopicDetail = () => {
        setTopicDetailRefresh(new Date().getTime())
        setSelectTopic(topic)
        setMode(MODE.TOPIC_DETAIL)
    }

    useEffect(()=>{
        if(check){
            checkTopics = [...checkTopics, topic!.topicId]
        }else{
            checkTopics = [...checkTopics.filter(e=>e!==topic!.topicId)];
        }
    }, [check])

    return (
        <section className="board-view-section">
            <div className="board-header">
                <div className="checks center">
                    <input type="checkbox" id={topic?.topicId+''} checked={check} onChange={e=>{setCheck(!check);}}/>
                    <div className="text">
                        <strong className="title full ml20" style={{cursor:'pointer'}} onClick={goTopicDetail}>
                            {topic?.title}
                        </strong>
                    </div>
                </div>
            </div> 
            <div className="board-content">
                <div className="cke_contents" dangerouslySetInnerHTML={{ __html: topic!.contents }} ></div>
            </div>
            <div className="board-footer">
                <div className="group">
                    <span className="date">????????? : {topic!.regDate}</span> 
                </div>
                <div className="group">
                    <span className="lang">?????? ?????? : {topic!.language!=='undefined' ? topic!.language : '-'}</span> 
                </div>
            </div>
        </section>
    )
}

const TopicList = () => {
    const setMode = useSetRecoilState(mode);
    const category = useRecoilValue(selectCatory)
    const topicListDataAtom = useRecoilValueLoadable<TopicListData|null>(listTopics({}))
    const [topicListData, setTopicListData] = useState<TopicListData|null>(null)
    const setSelectTopic = useSetRecoilState(selectTopic) 
    const setTopicRefresh = useSetRecoilState(topicRefresh);

    const [topicSearchType, setTopicSearchType] = useRecoilState(topicSearchTypeAtom)
    const setTopicSearchKeyWord = useSetRecoilState(topicSearchKeyWord)

    const [searchType, setSearchType] = useState<string|null>('')
    const [searchKeyWord, setSearchKeyWord] = useState<string|null>('')

    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        setSearchType(topicSearchType)
    },[])

    const goTopicReg = () => {
        setSelectTopic(null)
        setMode(MODE.TOPIC_REG)
    }

    const deleteTopic = async() => {
        let res:any = await serverCall(`/homepage/html/base/collaboration/deleteTopic.do`, 'DELETE', {'topicIds':checkTopics, 'categoryId':category?.categoryId})
        if(res.data){
            alert('?????????????????????.');
            setTopicRefresh(new Date().getTime())
        }else{
            alert(res.error);
        }
    }

    const search = () => {
        setTopicSearchType(searchType)
        setTopicSearchKeyWord(searchKeyWord)
    }

    useMemo(()=>{
        if(topicListDataAtom?.state){
            setLoading(true)
        }
        if(topicListDataAtom?.state === 'hasValue' && topicListDataAtom?.contents){
            setTopicListData(topicListDataAtom?.contents);
            setLoading(false)
        }
    },[topicListDataAtom])

    return(
        <>
            {loading && <PopLoading/>}
            <section className="board-list-section">
                <div style={{display:'flex', justifyContent:'space-between'}}>
                    <h4 className="sub-title">{category?.title}</h4>
                    <button className="btn btn-primary" onClick={()=>setMode(MODE.CATEGORY_LIST)}>???????????? ??????</button>
                </div>
                <div className="board-util mb-20">
                    <p className="all-tx">?????? {topicListData?.count}???</p>
                    <input type="hidden" name="pageIndex" id="pageIndex" value="1"/>
                    <div className="search-box">
                        <div className="select-style" style={{backgroundColor:'#fff'}}>
                            <label htmlFor="searchType">{searchType}</label>
                            <select id="searchType" name="searchType" onChange={e=>setSearchType(e.target.value+'')} value={searchType+''}>
                                {/* <option value="" >????????????</option> */}
                                <option value={SEARCH_TYPE.searchTitle} >{SEARCH_TYPE.searchTitle}</option>
                                <option value={SEARCH_TYPE.searchContents} >{SEARCH_TYPE.searchContents}</option>
                                {/* <option value={SEARCH_TYPE.searchAuthor} >{SEARCH_TYPE.searchAuthor}</option> */}
                            </select>
                        </div>
                        <div className="search-text">
                            <input type="text" className="input" title="????????? ??????" id="searchWord" name="searchWord" onChange={(e)=>setSearchKeyWord(e.target.value)}/>
                            <button className="btn-search searchBtn" onClick={search}></button>
                        </div>
                    </div>
                </div>
                {/* <div style={{height:700, overflowY:'auto'}}> */}
                <div>
                    {topicListData && topicListData.topics && topicListData.topics.map((topic)=>
                    <TopicCard key={topic.topicId} topic={topic}/> 
                    )}
                </div>
                <div className="btn-area right">
                    <button className="btn btn-primary" onClick={goTopicReg}>?????? ??????</button>&nbsp;
                    <button className="btn btn-line red" onClick={deleteTopic}>?????? ??????</button>
                </div>
            </section>

            <div className="btn-top">
                <button type="button"><span>TOP</span></button>
            </div>
        </>
    )
}

export default TopicList;