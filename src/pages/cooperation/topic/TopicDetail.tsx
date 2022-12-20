import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { MODE, mode as modeAtom } from "../state";
import Highlight from 'react-highlight'
import 'highlight.js/styles/vs2015.css';

const enum TAB_MODE {FILE, HISTORY}

const FileContent = () => {
    return (
        <div className="textarea_wrap">
            <Highlight className='python'>
                {`
                from django.conf import settings

                import math
                
                def tilePath(layer_name, lev, row, col, extension):
                    size = settings.TILE_SIZE
                    scale = 2048.0 / math.pow(2, int( lev))
                    offset = int((2787645 - 1214781) / size /  scale)
                    
                    tmpCol = int(col, 16)
                    tmpRow = offset-int(row, 16)-1
                
                    return "%s/%s/%s/%s.%s"%(layer_name, lev,  tmpCol,  tmpRow, extension)
                `}
            </Highlight>
        </div>
    )
}

const HistoryContent = () => {
    return(
        <div className="history_wrap">
            {[1,2,5].map(()=>
            <div className="history_box">
                <div className="history_thumbnail">
                    <span className="profile"></span>
                </div>
                <div className="board-view-section">
                    <div className="board-header">
                        <strong>ver.1</strong> 
                        <div className="group">
                            <span className="date">2022.12.08</span> 
                            <span className="save" title="저장하기">저장하기</span> 
                        </div>
                    </div> 
                    <div className="board-content scroll_y">
                        <div className="cke_contents">
                            - 표출알고리즘.py 수정 : 소스에서 아이디 “jellyfish”로 검색
                        </div>
                        <div className="cke_contents">
                            - 표출 처리 속도 개선
                        </div>
                    </div>
                </div>
            </div>
            )}
        </div>
    )
}

const TopicIntro = () => {
    const setMode = useSetRecoilState(modeAtom);
    const [tabMode, setTabMode] = useState(TAB_MODE.FILE)

    return(
        <div className="content-wrap">
            <article id="content">
                <div className="collabo_title">
                    <div className="sub-title_wrap">
                        <h3 className="sub-title">이박사 / 위험기상요소 처리 알고리즘 </h3>
                        <h4 className="sub-title"># 천리안 위성 1호</h4>
                    </div>
                    <div className="button_wrap">
                        <button className="btn btn-line upload">전체 업로드</button>
                        <button className="btn btn-line download">전체 다운로드</button>
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
                                <span className="date">2022.07.05. 수정</span> 
                            </div>
                        </div>
                        <div className="tab-cont scroll_y">
                            <div className="tab">
                                <div className="file_upload_result scroll_y">
                                {[1,2,5].map(()=>
                                <div className="file_wrap">
                                    <span className="file_name">첨부파일명</span>.py
                                </div>
                                )}
                                </div>
                            </div>
                        </div>
                        {tabMode===TAB_MODE.FILE && <FileContent/>}
                        {tabMode===TAB_MODE.HISTORY && <HistoryContent/>}
                    </div>
                </section>
                <div className="btn-area right">
                    <button className="btn btn-primary" onClick={()=>setMode(MODE.TOPIC_LIST)}>목록</button>
                </div>
            </article>
        </div>
    )
}

export default TopicIntro;