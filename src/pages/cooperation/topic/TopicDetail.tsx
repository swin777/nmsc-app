import { useEffect, useMemo, useState } from "react";
import { useRecoilState, useRecoilValue, useRecoilValueLoadable, useSetRecoilState } from "recoil";
import { detailTopic, MODE, mode as modeAtom, readFile, selectAttachFileUsq as selectAttachFileUsqAtom, selectCatory, selectTopic } from "../state";
import Highlight from 'react-highlight'
// import 'highlight.js/styles/vs2015.css';
import '../../../assets/resources/homepage/css/hightlight.css'
import { History, TopicDetail } from "../../../models/topic";
import { serverCall } from "../../../utils/apiCallUtil";
import axios, { AxiosRequestConfig } from "axios";


const enum TAB_MODE {FILE, HISTORY}

type FileContentType = {str:string}

const FileContent = ({str}:FileContentType) => {
    return (
        <div className="textarea_wrap" >
            <Highlight className=''>{str}</Highlight>
        </div>
    )
}

type HistoryProps = {
    historyArr: History[]|undefined,
    categoryId: number|undefined,
    topicId: number|undefined,
    topicName: string|undefined
}

const HistoryContent = ({historyArr, categoryId, topicId, topicName}:HistoryProps) => {
    const download = async(history:History) => {
        let params = {version:history.version, categoryId:categoryId, topicId:topicId, zipYn:'Y'}
        return new Promise((resolve, reject) => {
            axios({ url: `/homepage/html/base/collaboration/downloadAttachFile.do`, method: 'POST', responseType:'blob', data: params, headers: {}, credentials: true } as AxiosRequestConfig)
            .then(res => { 
              const url = window.URL.createObjectURL(new Blob([res.data]));
              const link = document.createElement('a');
              link.href = url;
              link.setAttribute('download', `${topicName}_V${history.version}.zip`);
              document.body.appendChild(link);
              link.click();
             })
            .catch(err => {
              reject(err)
            })
        });
    }

    return(
        // <div className="history_wrap" style={{height:480, overflowY:'auto'}}>
        <div className="history_wrap">
            {historyArr && historyArr.map((history)=>
            <div className="history_box">
                <div className="history_thumbnail">
                    <span className="profile"></span>
                </div>
                <div className="board-view-section">
                    <div className="board-header">
                        <strong>ver.{history.version}</strong> 
                        <div className="group">
                            <span className="date">{history.regDate}</span> 
                            <span className="save" title="저장하기" onClick={() => download(history)}>저장하기</span> 
                        </div>
                    </div> 
                    <div className="board-content scroll_y">
                        <div className="cke_contents" dangerouslySetInnerHTML={{ __html:history.comments }} ></div>
                    </div>
                </div>
            </div>
            )}
        </div>
    )
}

const TopicIntro = () => {
    const setMode = useSetRecoilState(modeAtom);
    const category = useRecoilValue(selectCatory)
    const detailTopicAtom = useRecoilValueLoadable<TopicDetail|null>(detailTopic({}))
    const readFileStr = useRecoilValueLoadable<string|null>(readFile)
    const [selectAttachFileUsq, setSelectAttachFileUsq] = useRecoilState(selectAttachFileUsqAtom)
    const [topicDetail, setTopicDetail] = useState<TopicDetail|null>(null)
    const [tabMode, setTabMode] = useState(TAB_MODE.FILE)
    const [fileStr, setFileStr] = useState('');

    useMemo(()=>{
        if(detailTopicAtom?.state){
            //loading
        }
        if(detailTopicAtom?.state === 'hasValue' && detailTopicAtom?.contents){
            if(detailTopicAtom?.contents && detailTopicAtom?.contents.history.length>0 ){
                if(detailTopicAtom?.contents.history[0].files.length > 0){
                    setSelectAttachFileUsq(detailTopicAtom?.contents.history[0].files[0].attachFileUsq)
                }
            }
            setTopicDetail(detailTopicAtom?.contents);
        }
    },[detailTopicAtom])

    useMemo(()=>{
        if(readFileStr?.state){
            //loading
        }
        if(readFileStr?.state === 'hasValue' && readFileStr?.contents){
            setFileStr(readFileStr?.contents);
        }
    },[readFileStr])

    const goList = () => {
        setSelectAttachFileUsq(null);
        setMode(MODE.TOPIC_LIST);
    }

    return(
        <>
            <div className="collabo_title">
                <div className="sub-title_wrap">
                    <h3 className="sub-title">{topicDetail?.topic.title} </h3>
                    <h4 className="sub-title">{category?.title}</h4>
                </div>
                <div className="button_wrap">
                    <button className="btn btn-line upload" style={{width:60}} onClick={()=>setMode(MODE.TOPIC_REG)}>업로드</button>
                    {/* <button className="btn btn-line download">전체 다운로드</button> */}
                </div>
            </div>
            <section className="tap-section">
                <div className="tab-menu">
                    <div className="tab-btn">
                        <ul>
                            <li className={tabMode===TAB_MODE.FILE ? 'active' : ''}><a href="javascript:void()" onClick={()=>setTabMode(TAB_MODE.FILE)}>Files</a></li>
                            <li className={tabMode===TAB_MODE.HISTORY ? 'active' : ''}><a href="javascript:void()" onClick={()=>setTabMode(TAB_MODE.HISTORY)}>History</a></li>
                        </ul>
                        <div className="group">
                            <span className="date">{topicDetail && topicDetail.history.length>0 && topicDetail.history[0].regDate} 수정</span>&nbsp;&nbsp;&nbsp;&nbsp;
                            {/* <button className="btn btn-primary" onClick={goList}>목록</button> */}
                        </div>
                        
                    </div>
                    <div className="tab-cont scroll_y">
                        <div className="tab">
                            <div className="file_upload_result scroll_y">
                            {topicDetail && topicDetail.history.length>0 && topicDetail.history[0].files.map((file)=>
                            <div className="file_wrap" style={{cursor:'pointer', backgroundColor:selectAttachFileUsq===file.attachFileUsq ? '#dae9f4': '#fff'}} 
                                onClick={()=>setSelectAttachFileUsq(file.attachFileUsq)}>
                                <span className="file_name">{file.originalFileName}</span>
                            </div>
                            )}
                            </div>
                        </div>
                    </div>
                    {tabMode===TAB_MODE.FILE && <FileContent str={fileStr}/>}
                    {tabMode===TAB_MODE.HISTORY && <HistoryContent historyArr={topicDetail?.history} categoryId={category?.categoryId} topicId={topicDetail?.topic.topicId} topicName={topicDetail?.topic.title}/>}
                </div>
            </section>
            <div className="btn-area right">
                <button className="btn btn-primary" onClick={goList}>목록</button>
            </div>
        </>
    )
}

export default TopicIntro;