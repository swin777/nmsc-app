import { AgGridReact } from "ag-grid-react";
import { useState, useRef, useCallback, useEffect, ChangeEvent, useMemo } from "react";
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
import LinqWorker  from "../../utils/linqWorker?worker";
import { Bar } from "react-chartjs-2";
import {CategoryScale} from 'chart.js'; 
import autocolors from 'chartjs-plugin-autocolors';
import Chart from 'chart.js/auto';
Chart.register(CategoryScale);
Chart.register(autocolors);

ModuleRegistry.registerModules([ClientSideRowModelModule]);

interface IFileTypes {
    id: number;
    object: File;
}

type SelectSCVProps = {
    input: any,
    gridData: any,
    setGridData:any
    setOperationTool?:any
}

const ResultChart = () => {
    const joinGridData = useRecoilValue<GridData|null>(joinGridDataAtom);
    const [xAxis, setXAxis] = useState<string>('')
    const [yAxis, setYAxis] = useState<string>('')
    const [dataSet, setDataSet] = useState<string>('')
    const [chartData, setChartData] = useState(null)
    const options = { responsive: true, plugins: {legend: {position: 'top' as const}, title: {display: false,text: joinGridData?.rowData?.length+''}, autocolors}};

    const chrartDraw = () => {
        if(joinGridData &&xAxis!=='' && yAxis!=='' && dataSet!==''){
            const labelUnique = new Set(joinGridData.rowData.map((e:any)=>e[xAxis]));
            let labels = [...labelUnique];
            const dataSetUnique = new Set(joinGridData.rowData.map((e:any)=>e[dataSet]));
            let datasets = [...dataSetUnique].map((e:any) => {
                return {
                    label: e,
                    data: labels.map((label:any) => joinGridData.rowData.reduce((sum:number, ele:any) => {
                        if(ele[xAxis] === label){
                            sum += isNaN(ele[yAxis]) ? 0 : parseInt(ele[yAxis])
                        }
                        return sum;
                    }, 0)),
                    //backgroundColor: 'rgba(255, 99, 132, 0.5)',
                }
            })

            let data:any = {
                labels,
                datasets: datasets
            }
            setChartData(data);
        }
    }

    return (
        <div>
            <div style={{marginTop:14,  display:'flex', flexFlow:'row wrap', alignItems:'center', justifyContent:'space-evenly'}}>
                <div style={{display:'flex', flexFlow:'column wrap', alignItems:'center'}}>
                    <h6>X???</h6>
                    <div className="select-style" style={{backgroundColor:'#fff'}}>
                        <label htmlFor="searchType">{xAxis===''?'??????':xAxis}</label>
                        <select id="xAxis" onChange={e=>setXAxis(e.target.value)} value={xAxis}>
                            <option value={''}></option>
                            {joinGridData?.columnDefs.map((column:any) =>
                            <option>{column.field}</option>
                            )}
                        </select>
                    </div>
                </div>
                <div style={{display:'flex', flexFlow:'column wrap', alignItems:'center'}}>
                    <h6>????????????</h6>
                    <div className="select-style" style={{backgroundColor:'#fff'}}>
                        <label htmlFor="searchType">{dataSet===''?'??????':dataSet}</label>
                        <select id="xAxis" onChange={e=>setDataSet(e.target.value)} value={dataSet}>
                            <option value={''}></option>
                            {joinGridData?.columnDefs.map((column:any) =>
                            <option>{column.field}</option>
                            )}
                        </select>
                    </div>
                </div>
                <div style={{display:'flex', flexFlow:'column wrap', alignItems:'center'}}>
                    <h6>Y???</h6>
                    <div className="select-style" style={{backgroundColor:'#fff'}}>
                        <label htmlFor="searchType">{yAxis===''?'??????':yAxis}</label>
                        <select id="xAxis" onChange={e=>setYAxis(e.target.value)} value={yAxis}>
                            <option value={''}></option>
                            {joinGridData?.columnDefs.map((column:any) =>
                            <option>{column.field}</option>
                            )}
                        </select>
                    </div>
                </div>
                <div style={{display:'flex', flexFlow:'column wrap', alignItems:'center'}}>
                    <div style={{height:42}}></div>
                    <button className="btn btn-primary" onClick={chrartDraw}>??????</button>&nbsp;
                </div>
            </div>
            {(xAxis!=='' && yAxis!=='' && dataSet!=='' && chartData) ?
                <Bar options={options} data={chartData}/>
              : <div className="chart_area"/>
            }
        </div>
        
    )
}

const SelectCSVGrid = ({input, gridData, setGridData, setOperationTool}:SelectSCVProps) => {
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
            alert('csv????????? ?????????????????????.');
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
        setGridData({columnDefs:convert.columnDefs, rowData:convert.rowData});
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

    useEffect(()=> {
        if(setOperationTool){
            setOperationTool({add:addRow, remove:removeRow, filterClear:filterClear, gridApi:gridApi.current});
        }
    },[gridData])

    const addRow = () => {
        const filterObj = gridApi.current.getFilterModel()
        let filterRow = Object.keys(filterObj).reduce((sumObj:any, key:any)=>{sumObj[key]=filterObj[key].filter; return sumObj;}, new Object())
        let newRow:any = {}
        gridData.columnDefs.forEach((e:any) => newRow[e.field]='')
        newRow = {...newRow, ...filterRow};
        setGridData({...gridData, rowData:JSON.parse(JSON.stringify([...gridData.rowData, newRow]))})
        gridApi.current.setRowData([...gridData.rowData, newRow])
        gridApi.current.ensureIndexVisible(gridData.rowData.length-1, 'middle');
    }

    const removeRow = () => {
        let idx = gridApi.current.getSelectedNodes()[0].rowIndex;
        let remainData = [...(gridData.rowData.slice(0, idx)), ...(gridData.rowData.slice(idx+1, gridData.rowData.length))]
        setGridData({...gridData, rowData:JSON.parse(JSON.stringify(remainData))})
        gridApi.current.setRowData([...gridData.rowData])
    }

    const filterClear = () => {
        gridApi.current.setFilterModel(null);
    }

    return (
        <div className="board-content center" ref={dragRef}>
            {!gridData && <p>????????? ????????? & ???????????? ?????????</p>}
            {gridData &&
            <div style={{height: '100%',width: '100%',}}className="ag-theme-alpine">
                <AgGridReact
                    columnDefs={gridData.columnDefs}
                    onGridReady = {(params:any) => {
                        setOperationTool({add:addRow, remove:removeRow, filterClear:filterClear, gridApi:params.api})
                        gridApi.current=params.api; 
                        params.api.setRowData(JSON.parse(JSON.stringify(gridData.rowData)))
                    }}
                    rowSelection={'single'}
                    animateRows={true}
                    defaultColDef={{resizable:true, sortable:true, editable:true}}
                    onCellValueChanged={(event:any)=>{
                        let chageData = [...(gridData.rowData.slice(0, event.rowIndex)), JSON.parse(JSON.stringify(event.data)), ...(gridData.rowData.slice(event.rowIndex+1, gridData.rowData.length))]
                        setGridData({...gridData, rowData:chageData})
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
    const [ worker, setWorker ] = useState<Worker>();
    const [leftOperationTool, setLeftOperationTool] = useState<any>({});
    const [rightOperationTool, setrightOperationTool] = useState<any>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [chartYN, setChartYN] = useState<boolean>(false);

    useMemo(()=>{
        setWorker(new LinqWorker())
    },[])

    const join = async(type:string) => {
        if(!leftGridData){
            alert('?????? ????????? ?????? 1 ???????????????.');
            return;
        }
        if(!rightGridData){
            alert('?????? ????????? ?????? 2 ???????????????.');
            return;
        }
        if(!(leftJoinKey && rightJoinKey)){
            alert('?????? Key??? ???????????????\n????????? ????????? ?????? key ????????? ???????????????.');
            return;
        }
        if(leftGridData && leftGridData.columnDefs && rightGridData && rightGridData.columnDefs){
            setLoading(true);
            let rightFilterCol = rightGridData.columnDefs.filter((right:any)=>
                !(leftGridData.columnDefs.some((left:any)=>left.field===right.field))
            ) //????????? ????????? ????????? ?????? ??????????????? ??????.
            let colDef = [...leftGridData.columnDefs, ...rightFilterCol];

            let leftTarget:any = [];
            leftOperationTool.gridApi.forEachNodeAfterFilter((node:any) => leftTarget.push(node.data))
            let rightTarget:any = [];
            rightOperationTool.gridApi.forEachNodeAfterFilter((node:any) => rightTarget.push(node.data))

            worker!.onmessage = e => {
                try{
                    setJoinGridData({columnDefs:colDef, rowData:e.data}); 
                    setLoading(false);
                }catch(e:any){
                    setLoading(false);
                }
            }
            worker!.onerror = e => alert('??????????????? ?????????????????????.');
            worker!.postMessage({type:type, leftData:leftTarget, rightData:rightTarget, leftKey:leftJoinKey, rightKey:rightJoinKey})
        }
    }

    const exportCSV = () => {
        let header = joinGridData?.columnDefs.reduce((sum:any, curr:any)=>{
            sum[curr.field] = curr.field
            return sum
        }, {})
        exportCSVFile(header, joinGridData?.rowData, '??????')
    } 

    return(
        <>
            <div className="btn-area right control_btn">
                <a href="javascript:void()" className="btn controler merge layerPopup" onClick={()=>setKeySettingPopYn(true)}>?????? Key</a>
            </div>
            <section className="divide_section" >
                <div className="board-view-section" style={{width:lrArea===0 ? '50%' : lrArea===-1 ? '100%' : '0%', display:lrArea===1 ? 'none' : ''}}>
                    <div className="board-header">
                        <strong>?????? ????????? ?????? 1</strong>
                        <div className="group flex">
                            <div className="file_upload_label">
                                <label htmlFor="left_file_upload">????????????</label>
                                <input type="file" id="left_file_upload" ref={leftFile} accept=".csv"/>
                            </div>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <div className="control_btn">
                                <a href="javascript:void()" onClick={leftOperationTool.add} className="btn controler plus" style={{width:86}}>??? ??????</a>
                                <a href="javascript:void()" onClick={leftOperationTool.remove} className="btn controler plus"style={{width:86}}>??? ??????</a>
                                <a href="javascript:void()" onClick={leftOperationTool.filterClear} className="btn controler reset" style={{width:108}}>?????? ?????????</a>
                            </div>
                            <span className="expand" title="????????????" onClick={()=>{setLRArea(lrArea => lrArea = lrArea===0 ? -1 : 0)}}>????????????</span>
                        </div>
                    </div>
                    <SelectCSVGrid input={leftFile} gridData={leftGridData} setGridData={setLeftGridData} setOperationTool={setLeftOperationTool}/>
                </div>
                <div className="board-view-section" style={{width:lrArea===0 ? '50%' : lrArea===1 ? '100%' : '0%', display:lrArea===-1 ? 'none' : ''}}>
                    <div className="board-header">
                        <strong>?????? ????????? ?????? 2</strong>
                        <div className="group flex">
                            <div className="file_upload_label">
                                <label htmlFor="right_file_upload">????????????</label>
                                <input type="file" id="right_file_upload" ref={rightFile} accept=".csv"/>
                            </div>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <div className="control_btn">
                                <a href="javascript:void()" onClick={rightOperationTool.add} className="btn controler plus" style={{width:86}}>??? ??????</a>
                                <a href="javascript:void()" onClick={rightOperationTool.remove} className="btn controler plus" style={{width:86}}>??? ??????</a>
                                <a href="javascript:void()" onClick={rightOperationTool.filterClear} className="btn controler reset" style={{width:108}}>?????? ?????????</a>
                            </div>
                            <span className="expand" title="????????????" onClick={()=>{setLRArea(lrArea => lrArea = lrArea===0 ? 1 : 0)}}>????????????</span>
                        </div>
                    </div>
                    <SelectCSVGrid input={rightFile} gridData={rightGridData} setGridData={setRightGridData} setOperationTool={setrightOperationTool}/>
                </div>
                <span className="warnning right">* ?????? ???????????? csv??? ?????? ?????????</span>
            </section>
            <section>
                <div className="table_title">
                    <h6>?????? ????????? ??????</h6>
                    <div className="btn-area">
                        {/* <button className="btn btn-line preview">?????? ????????? ????????????</button> */}
                        
                        <div className="control_btn">
                            <button className="btn btn-line preview" onClick={()=>join('_join_')}>??????</button> &nbsp;&nbsp;&nbsp;
                            <a href="javascript:void()" className="btn controler mergeLeft layerPopup" onClick={()=>join('_leftJoin_')}>Left ??????</a>&nbsp;
                            <a href="javascript:void()" className="btn controler mergeRight layerPopup" onClick={()=>join('_rightJoin_')}>Right ??????</a>
                        </div>
                    </div>
                </div>
                <div className="table_layout scroll_y">
                {joinGridData && !loading &&
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
                {loading &&
                <div style={{zIndex:1000, display:"flex", justifyContent:'center'}}>
                    <div className="loading"/>
                </div>
                }
                </div>
                <div className="btn-area right mt20">
                    <button className="btn btn-line excel" onClick={exportCSV}>??????????????????</button>&nbsp;
                    <button className="btn btn-line chart" onClick={()=>setChartYN(true)}>????????????</button>
                </div>
                {joinGridData && !loading && chartYN &&
                    <ResultChart/>
                }
            </section>
            <KeySettingPop/>
        </>
    )
}

export default GeneralUser;