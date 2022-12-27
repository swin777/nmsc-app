import { AgGridReact } from "ag-grid-react";
import { useState, useRef, useCallback, useEffect, ChangeEvent } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { leftJoinKey as leftJoinKeyAtom, rightJoinKey as rightJoinKeyAtom, keySettingPopYn, 
        leftGridData as leftGridDataAtom, rightGridData as rightGridDataAtom, 
        joinGridData as joinGridDataAtom, GridData, joinGridData } from "./state";
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { ModuleRegistry } from '@ag-grid-community/core';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { csvToJSON, exportCSVFile } from "../../utils/utils";
import KeySettingPop from "./KeySettingPop";
import { _join_, _leftJoin_ } from "../../utils/linqUtil";
import { CellValueChangedEvent, FilterChangedEvent } from "ag-grid-community/dist/lib/events";
import LinqWorker  from "../../utils/linqUtil2?worker";

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
    const gridApi:any = useRef();

    const onChangeFiles = async(e: ChangeEvent<HTMLInputElement> | any) => {
        let file = null;
        if (e.type === "drop") {
            file = e.dataTransfer.files[0];
        } else {
            file = e.target.files[0];
        }
        if(file.name.split('.').pop().toLowerCase() !== 'csv'){
            alert('csv파일만 입력가능합니다.');
            return;
        }
        let readFile = (file:any) => new Promise( (resolve, reject) => {
            let reader = new FileReader();
            reader.onload = (e) => resolve(reader.result);
            reader.readAsText(file);
        });
        input.current.value='';
        let csvText = await readFile(file);
        let convert:any = csvToJSON(csvText+'');
        setLeftJoinKey('');
        setRightJoinKey('');
        setJoinGridData(null)
        setGridData({columnDefs:convert.columnDefs, rowData:convert.rowData, editData:null});
        if(gridApi.current){
            gridApi.current.setRowData(JSON.parse(JSON.stringify(convert.rowData)))
        }
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

    const addRow = () => {
        let newRow:any = {}
        gridData.columnDefs.forEach((e:any) => newRow[e.field]='')
        if(gridData.editData){
            setGridData({...gridData, rowData:[...gridData.rowData, newRow], editData:[...gridData.editData, newRow]})
            gridApi.current.setRowData(JSON.parse(JSON.stringify([...gridData.editData, newRow])))
            gridApi.current.ensureIndexVisible(gridData.editData.length-1, 'middle');
        }else{
            setGridData({...gridData, rowData:JSON.parse(JSON.stringify([...gridData.rowData, newRow]))})
            gridApi.current.setRowData([...gridData.rowData, newRow])
            gridApi.current.ensureIndexVisible(gridData.rowData.length-1, 'middle');
        }
    }

    const deleteRow = () => {
        let idx = gridApi.current.getSelectedNodes()[0].rowIndex;
        if(gridData.editData){
            let remainData = [...(gridData.editData.slice(0, idx)), ...(gridData.editData.slice(idx+1, gridData.editData.length))]
            setGridData({...gridData, rowData:[...gridData.rowData], editData:remainData})
            gridApi.current.setRowData(JSON.parse(JSON.stringify(remainData)))
        }else{
            let remainData = [...(gridData.rowData.slice(0, idx)), ...(gridData.rowData.slice(idx+1, gridData.rowData.length))]
            setGridData({...gridData, rowData:JSON.parse(JSON.stringify(remainData))})
            gridApi.current.setRowData([...gridData.rowData])
        }
    }

    return (
        <div className="board-content center" ref={dragRef}>
            {/* <button onClick={addRow}>add</button> &nbsp;&nbsp;
            <button onClick={deleteRow}>delete</button> */}
            {!gridData && <p>파일을 드래그 & 드롭하여 업로드</p>}
            {gridData &&
            <div style={{height: '100%',width: '100%',}}className="ag-theme-alpine">
                <AgGridReact
                    columnDefs={gridData.columnDefs}
                    //rowData={JSON.parse(JSON.stringify(gridData.editData ? gridData.editData : gridData.rowData))}
                    // rowData={gridData.rowData}
                    onGridReady = {(params:any) => {gridApi.current=params.api; params.api.setRowData(JSON.parse(JSON.stringify(gridData.rowData)))}}
                    rowSelection={'single'}
                    animateRows={true}
                    defaultColDef={{resizable:true, sortable:true, editable:true}}
                    onCellValueChanged={(event:any)=>{
                        let chageData;
                        if(!gridData.editData){
                            let cloneData = JSON.parse(JSON.stringify(gridData.rowData))
                            chageData = [...(cloneData.slice(0, event.rowIndex)), JSON.parse(JSON.stringify(event.data)), ...(cloneData.slice(event.rowIndex+1, cloneData.length))]
                        }else{
                            chageData = [...(gridData.editData.slice(0, event.rowIndex)), JSON.parse(JSON.stringify(event.data)), ...(gridData.editData.slice(event.rowIndex+1, gridData.editData.length))]
                        }
                        setGridData({...gridData, editData:chageData})
                    }}
                    onFilterChanged = {(event:FilterChangedEvent)=>{
                        const allRowData:any = [];
                        //event.api.forEachNode((node:any) => allRowData.push(node.data));
                        event.api.forEachNodeAfterFilter((node:any) => allRowData.push(node.data));
                        setGridData({...gridData, editData:JSON.parse(JSON.stringify(allRowData))})
                    }}
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
    const [leftGridData, setLeftGridData] = useRecoilState<GridData|null>(leftGridDataAtom);
    const [rightGridData, setRightGridData] = useRecoilState<GridData|null>(rightGridDataAtom);
    const setKeySettingPopYn = useSetRecoilState(keySettingPopYn);
    const [joinGridData, setJoinGridData] = useRecoilState<GridData|null>(joinGridDataAtom);
    const leftJoinKey = useRecoilValue(leftJoinKeyAtom);
    const rightJoinKey = useRecoilValue(rightJoinKeyAtom);
    const [worker, setWorker] = useState<Worker>(new LinqWorker());

    const join = async() => {
        if(leftGridData && leftGridData.columnDefs && rightGridData && rightGridData.columnDefs){
            let rightFilterCol = rightGridData.columnDefs.filter((right:any)=>
                !(leftGridData.columnDefs.some((left:any)=>left.field===right.field))
            ) //오른쪽 그리드 컬럼중 왼쪽 겹치는것을 뺀다.
            let colDef = [...leftGridData.columnDefs, ...rightFilterCol];

            let leftTarget = leftGridData.editData ? leftGridData.editData : leftGridData.rowData;
            let rightTarget = rightGridData.editData ? rightGridData.editData : rightGridData.rowData

            // let resultData = _join_(leftTarget, rightTarget, leftJoinKey, rightJoinKey)
            // setJoinGridData({columnDefs:colDef, rowData:resultData, editData:null})

            worker.onmessage = e => {
                setJoinGridData({columnDefs:colDef, rowData:e.data, editData:null})
            }
            worker.postMessage({type:'_join_', leftData:leftTarget, rightData:rightTarget, leftJoinKey:leftJoinKey, rightJoinKey:rightJoinKey})
        }
    }

    const exportCSV = () => {
        let header = joinGridData?.columnDefs.reduce((sum:any, curr:any)=>{
            sum[curr.field] = curr.field
            return sum
        }, {})
        exportCSVFile(header, joinGridData?.rowData, '융합')
        //joinGridData?.rowData
    }

    useEffect(() => {
        return () => {
            //worker.terminate()
        };
      }, []);
      

    return(
        <>
            <div className="btn-area right control_btn">
                <a href="javascript:void()" className="btn controler merge layerPopup" onClick={()=>setKeySettingPopYn(true)}>융합 Key</a>
            </div>
            <section className="divide_section" >
                <div className="board-view-section" style={{width:lrArea===0 ? '50%' : lrArea===-1 ? '100%' : '0%', display:lrArea===1 ? 'none' : ''}}>
                    <div className="board-header">
                        <strong>융합 데이터 자료 1</strong>
                        <div className="group flex">
                            <div className="file_upload_label">
                                <label htmlFor="left_file_upload">파일선택</label>
                                <input type="file" id="left_file_upload" ref={leftFile} accept=".csv"/>
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
                                <input type="file" id="right_file_upload" ref={rightFile} accept=".csv"/>
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
                    <button className="btn btn-line excel" onClick={exportCSV}>엑셀다운로드</button>&nbsp;
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