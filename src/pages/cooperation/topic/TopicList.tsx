import { useEffect, useMemo, useState } from "react";
import { useRecoilValue, useRecoilValueLoadable, useSetRecoilState } from "recoil";
import { Topic, TopicListData } from "../../../models/topic";
import { serverCall } from "../../../utils/apiCallUtil";
import { listTopics, MODE, mode, selectCatory, selectTopic, topicDetailRefresh, topicRefresh } from "../state";

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
                    <span className="date">등록일 : {topic!.regDate}</span> 
                </div>
                <div className="group">
                    <span className="lang">작성 언어 : {topic!.language!=='undefined' ? topic!.language : '-'}</span> 
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

    const goTopicReg = () => {
        setSelectTopic(null)
        setMode(MODE.TOPIC_REG)
    }

    const deleteTopic = async() => {
        let res:any = await serverCall(`/homepage/html/base/collaboration/deleteTopic.do`, 'DELETE', {'topicIds':checkTopics, 'categoryId':category?.categoryId})
        if(res.data){
            alert('삭제되었습니다.');
            setTopicRefresh(new Date().getTime())
        }else{
            alert(res.error);
        }
    }

    useMemo(()=>{
        if(topicListDataAtom?.state){
            //loading
        }
        if(topicListDataAtom?.state === 'hasValue' && topicListDataAtom?.contents){
            setTopicListData(topicListDataAtom?.contents);
        }
    },[topicListDataAtom])

    return(
        <>
            <section className="board-list-section">
                <div style={{display:'flex', justifyContent:'space-between'}}>
                    <h4 className="sub-title">{category?.title}</h4>
                    <button className="btn btn-primary" onClick={()=>setMode(MODE.CATEGORY_LIST)}>카테고리 가기</button>
                </div>
                <div className="board-util mb-20">
                    <p className="all-tx">전체 {topicListData?.count}건</p>
                    <form name="searchForm" id="searchForm" method="post">
                    <input type="hidden" name="pageIndex" id="pageIndex" value="1"/>
                    <div className="search-box">
                        <div className="select-style">
                            <label htmlFor="searchType">검색조건</label>
                            <select id="searchType" name="searchType"><option value="">검색조건</option><option value="TITLE">제목</option><option value="CONTENTS">내용</option></select>
                        </div>
                        <div className="search-text">
                            <input type="text" className="input" title="검색어 입력" id="searchWord" name="searchWord" value=""/>
                            {/* <button className="btn-search searchBtn"><span className="hide">검색</span></button> */}
                        </div>
                    </div>
                    </form>
                </div>
                <div style={{height:700, overflowY:'auto'}}>
                    {topicListData && topicListData.topics && topicListData.topics.map((topic)=>
                    <TopicCard key={topic.topicId} topic={topic}/> 
                    )}
                </div>
                <div className="btn-area right">
                    <button className="btn btn-primary" onClick={goTopicReg}>토픽 생성</button>&nbsp;
                    <button className="btn btn-line red" onClick={deleteTopic}>토픽 삭제</button>
                </div>
            </section>

            <div className="btn-top">
                <button type="button"><span>TOP</span></button>
            </div>
        </>
    )
}

export default TopicList;