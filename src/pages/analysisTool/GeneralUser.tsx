import { AgGridReact } from "ag-grid-react";
import { useState, useRef, useCallback, useEffect, ChangeEvent } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { leftJoinKey as leftJoinKeyAtom, rightJoinKey as rightJoinKeyAtom, keySettingPopYn, 
        leftGridData as leftGridDatasAtom, rightGridData as rightGridDataAtom, 
        joinGridData as joinGridDataAtom, GridData, joinGridData } from "./state";
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { ModuleRegistry } from '@ag-grid-community/core';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { converter } from "../../utils/utils";
import KeySettingPop from "./KeySettingPop";
import { _join_ } from "../../utils/linqUtil";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

interface IFileTypes {
    id: number;
    object: File;
}

type SelectSCVProps = {
    input: any,
    gridData: any,
    setGridData:any
}

const SelectCSVArea = ({input, gridData, setGridData}:SelectSCVProps) => {
    const dragRef = useRef<HTMLDivElement | null>(null);
    const setLeftJoinKey = useSetRecoilState(leftJoinKeyAtom);
    const setRightJoinKey = useSetRecoilState(rightJoinKeyAtom);
    const setJoinGridData = useSetRecoilState(joinGridData);

    const onChangeFiles = async(e: ChangeEvent<HTMLInputElement> | any) => {
        let file = null;
        if (e.type === "drop") {
            file = e.dataTransfer.files[0];
        } else {
            file = e.target.files[0];
        }
        let readFile = (file:any) => new Promise( (resolve, reject) => {
            let reader = new FileReader();
            reader.onload = (e) => resolve(reader.result);
            
            reader.readAsText(file);
        });
        input.current.value='';
        let csvText = await readFile(file);
        let convert:any = converter(csvText+'');
        setLeftJoinKey('');
        setRightJoinKey('');
        setJoinGridData(null)
        setGridData({columnDefs:convert.columnDefs, rowData:convert.rowData});
    }
        

    const handleDragIn = useCallback((e: DragEvent): void => {
        e.preventDefault();
        e.stopPropagation();
    }, []);
    
    const handleDragOut = useCallback((e: DragEvent): void => {
        e.preventDefault();
        e.stopPropagation();
    }, []);
    
    const handleDragOver = useCallback((e: DragEvent): void => {
        e.preventDefault();
        e.stopPropagation();
    }, []);
    
    const handleDrop = useCallback(
        (e: DragEvent): void => {
          e.preventDefault();
          e.stopPropagation();
          onChangeFiles(e);
        },
        [onChangeFiles]
    );

    const initDragEvents = useCallback((): void => {
        if (dragRef.current !== null) {
            dragRef.current.addEventListener("dragenter", handleDragIn);
            dragRef.current.addEventListener("dragleave", handleDragOut);
            dragRef.current.addEventListener("dragover", handleDragOver);
            dragRef.current.addEventListener("drop", handleDrop);
        }
    }, [handleDragIn, handleDragOut, handleDragOver, handleDrop]);
    
    const resetDragEvents = useCallback((): void => {
        if (dragRef.current !== null) {
            dragRef.current.removeEventListener("dragenter", handleDragIn);
            dragRef.current.removeEventListener("dragleave", handleDragOut);
            dragRef.current.removeEventListener("dragover", handleDragOver);
            dragRef.current.removeEventListener("drop", handleDrop);
        }
    }, [handleDragIn, handleDragOut, handleDragOver, handleDrop]);
    
    useEffect(() => {
        initDragEvents();
        return () => resetDragEvents();
    }, [initDragEvents, resetDragEvents]);

    useEffect(() => {
        if(input.current){
            input.current.onchange = onChangeFiles;
        }
    }, [input]);

    return (
        <div className="board-content center" ref={dragRef}>
            {!gridData && <p>파일을 드래그 & 드롭하여 업로드</p>}
            {gridData &&
            <div style={{height: '100%',width: '100%',}}className="ag-theme-alpine">
                <AgGridReact
                    columnDefs={gridData.columnDefs}
                    rowData={gridData.rowData}
                    rowSelection={'single'}
                    animateRows={true}
                    defaultColDef={{resizable:true, sortable:true}}
                />
            </div>
            }
        </div>
    )
}

const GeneralUser = () => {
    const [lrArea, setLRArea] = useState(0);
    const leftFile = useRef<any>();
    const rightFile = useRef<any>();
    const [leftGridData, setLeftGridData] = useRecoilState<GridData|null>(leftGridDatasAtom);
    const [rightGridData, setRightGridData] = useRecoilState<GridData|null>(rightGridDataAtom);
    const setKeySettingPopYn = useSetRecoilState(keySettingPopYn);
    const [joinGridData, setJoinGridData] = useRecoilState<GridData|null>(joinGridDataAtom);
    const leftJoinKey = useRecoilValue(leftJoinKeyAtom);
    const rightJoinKey = useRecoilValue(rightJoinKeyAtom);

    const join = () => {
        if(leftGridData && leftGridData.columnDefs && rightGridData && rightGridData.columnDefs){
            
            let rightFilterCol = rightGridData.columnDefs.filter((right:any)=>
                !(leftGridData.columnDefs.some((left:any)=>left.field===right.field))
            ) //오른쪽 그리드 컬럼중 왼쪽 겹치는것을 뺀다.
            let colDef = [...leftGridData.columnDefs, ...rightFilterCol];

            let resultData = _join_(leftGridData.rowData, rightGridData.rowData, leftJoinKey, rightJoinKey)
            setJoinGridData({columnDefs:colDef, rowData:resultData})
        }
    }

    return(
        <>
            <div className="btn-area right control_btn">
                <a href="javascript:void()" className="btn controler merge layerPopup" onClick={()=>setKeySettingPopYn(true)}>융합</a>
            </div>
            <section className="divide_section" >
                <div className="board-view-section" style={{width:lrArea===0 ? '50%' : lrArea===-1 ? '100%' : '0%', display:lrArea===1 ? 'none' : ''}}>
                    <div className="board-header">
                        <strong>융합 데이터 자료 1</strong>
                        <div className="group flex">
                            <div className="file_upload_label">
                                <label htmlFor="left_file_upload">파일선택</label>
                                <input type="file" id="left_file_upload" ref={leftFile}/>
                            </div>
                            <span className="expand" title="확대보기" onClick={()=>{setLRArea(lrArea => lrArea = lrArea===0 ? -1 : 0)}}>확대보기</span>
                        </div>
                    </div>
                    <SelectCSVArea input={leftFile} gridData={leftGridData} setGridData={setLeftGridData}/>
                </div>
                <div className="board-view-section" style={{width:lrArea===0 ? '50%' : lrArea===1 ? '100%' : '0%', display:lrArea===-1 ? 'none' : ''}}>
                    <div className="board-header">
                        <strong>융합 데이터 자료 2</strong>
                        <div className="group flex">
                            <div className="file_upload_label">
                                <label htmlFor="right_file_upload">파일선택</label>
                                <input type="file" id="right_file_upload" ref={rightFile}/>
                            </div>
                            <span className="expand" title="확대보기" onClick={()=>{setLRArea(lrArea => lrArea = lrArea===0 ? 1 : 0)}}>확대보기</span>
                        </div>
                    </div>
                    <SelectCSVArea input={rightFile} gridData={rightGridData} setGridData={setRightGridData}/>
                </div>
                <span className="warnning right">* 파일 확장자는 csv만 가능 합니다</span>
            </section>
            <section>
                <div className="table_title">
                    <h6>융합 데이터 자료</h6>
                    <div className="btn-area">
                        {/* <button className="btn btn-line preview">융합 데이터 미리보기</button> */}
                        <button className="btn btn-line preview" onClick={join}>융합 하기</button>
                    </div>
                </div>
                <div className="table_layout scroll_y">
                {joinGridData &&
                <div style={{height: '100%',width: '100%',}}className="ag-theme-alpine">
                    <AgGridReact
                        columnDefs={joinGridData.columnDefs}
                        rowData={joinGridData.rowData}
                        rowSelection={'single'}
                        animateRows={true}
                        defaultColDef={{resizable:true, sortable:true}}
                    />
                </div>
                }
                </div>
                <div className="btn-area right mt20">
                    <button className="btn btn-line excel">엑셀다운로드</button>
                    <button className="btn btn-line chart">차트보기</button>
                </div>
                {/* <div className="chart_area">
                    <span>차트영역입니다.</span>
                </div> */}
            </section>
            <KeySettingPop/>
        </>
    )
}

export default GeneralUser;