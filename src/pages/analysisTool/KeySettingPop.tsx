import { useRecoilState, useRecoilValue } from "recoil";
import { GridData, keySettingPopYn as keySettingPopYnAtom, 
        leftGridData as leftGridDatasAtom, rightGridData as rightGridDataAtom, 
        leftJoinKey as leftJoinKeyAtom, rightJoinKey as rightJoinKeyAtom} from "./state";

const KeySettingPop = () => {
    const [keySettingPopYn, setKeySettingPopYn] = useRecoilState(keySettingPopYnAtom);
    const leftGridData = useRecoilValue<GridData|null>(leftGridDatasAtom);
    const rightGridData = useRecoilValue<GridData|null>(rightGridDataAtom);
    const [leftJoinKey, setLeftJoinKey] = useRecoilState(leftJoinKeyAtom);
    const [rightJoinKey, setRightJoinKey] = useRecoilState(rightJoinKeyAtom);

    return (
        <div className="layer" style={{display:keySettingPopYn ? 'block' : 'none'}}>
            <div className="layer_box scroll">
                <div className="layer_title">
                    <h4>융합키설정</h4>
                    <a href="javascript:void()" className="close" onClick={()=>setKeySettingPopYn(false)}>닫기</a>
                </div>
                <div className="layer_cont">
                    <table className="table">
                        <colgroup>
                            <col width="30%"/>
                            <col width="70%"/>
                            {/* <col width="50%"/>
                            <col width="20%"/> */}
                        </colgroup>
                        <tbody>
                            <tr>
                                <th>융합데이터 자료1</th>
                                <td className="border_right">
                                    <div className="select-style" style={{width:'100%', backgroundColor:'#fff'}}>
                                        <label >{leftJoinKey ? leftJoinKey : ''}</label>
                                        <select id="leftKey"  onChange={(e)=>setLeftJoinKey(e.target.value)} value={leftJoinKey}>
                                            <option value={''}></option>
                                            {leftGridData && leftGridData.columnDefs && leftGridData.columnDefs.map((col:any) =>
                                            <option value={col.field}>{col.field}</option>
                                            )}
                                        </select>
                                    </div>
                                </td>
                                {/* <td rowSpan={2} className="tl_c rowspan2">
                                    <button className="btn btn-primary mt30">추가</button>
                                </td> */}
                            </tr>
                            <tr>
                                <th>융합데이터 자료2</th>
                                <td className="border_right">
                                    <div className="select-style" style={{width:'100%', backgroundColor:'#fff'}}>
                                        <label >{rightJoinKey ? rightJoinKey : ''}</label>
                                        <select id="rightKey" onChange={(e)=>setRightJoinKey(e.target.value)} value={rightJoinKey}>
                                            <option value={''}></option>
                                            {rightGridData && rightGridData.columnDefs && rightGridData.columnDefs.map((col:any) =>
                                            <option value={col.field}>{col.field}</option>
                                            )}
                                        </select>
                                    </div>
                                </td>
                            </tr>
                            {/* <tr>
                                <th>적용 컬럼</th>
                                <td>
                                    <span className="column">주소</span>
                                </td>
                            </tr> */}
                        </tbody>
                    </table>
                    {/* <div className="btn-area right">
                        <button className="btn btn-primary">적용</button>&nbsp;
                        <button className="btn btn-gray close" onClick={()=>setKeySettingPopYn(false)}>취소</button>
                    </div> */}
                </div>
            </div>
        </div>
    )
}

export default KeySettingPop;