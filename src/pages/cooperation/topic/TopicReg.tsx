import { useSetRecoilState } from "recoil";
import { MODE, mode as modeAtom } from "../state";
import { CKEditor } from "@ckeditor/ckeditor5-react"
import ClassicEditor from "@ckeditor/ckeditor5-build-classic"
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";

interface IFileTypes {
    id: number;
    object: File;
}

const TopicReg = () => {
    const setMode = useSetRecoilState(modeAtom);
    const [content, setContent] = useState();
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [files, setFiles] = useState<IFileTypes[]>([]);
    const dragRef = useRef<HTMLDivElement | null>(null);
    const fileId = useRef<number>(0);

    const onChangeFiles = useCallback(
        (e: ChangeEvent<HTMLInputElement> | any): void => {
          let selectFiles: File[] = [];
          let tempFiles: IFileTypes[] = files;

          if (e.type === "drop") {
            selectFiles = e.dataTransfer.files;
          } else {
            selectFiles = e.target.files;
          }
    
          for (const file of selectFiles) {
            tempFiles = [...tempFiles, {id: fileId.current++,object: file}];
          }
          setFiles(tempFiles);
        },
        [files]
    );

    const handleDragIn = useCallback((e: DragEvent): void => {
        e.preventDefault();
        e.stopPropagation();
    }, []);
    
    const handleDragOut = useCallback((e: DragEvent): void => {
        e.preventDefault();
        e.stopPropagation();
    
        setIsDragging(false);
    }, []);
    
    const handleDragOver = useCallback((e: DragEvent): void => {
        e.preventDefault();
        e.stopPropagation();
    
        if (e.dataTransfer!.files) {
          setIsDragging(true);
        }
    }, []);
    
    const handleDrop = useCallback(
        (e: DragEvent): void => {
          e.preventDefault();
          e.stopPropagation();
    
          onChangeFiles(e);
          setIsDragging(false);
        },
        [onChangeFiles]
    );

    const handleFilterFile = useCallback(
        (id: number): void => {setFiles(files.filter((file: IFileTypes) => file.id !== id));
    },[files]);

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

    return(
        <div className="content-wrap">
            <article id="content">
                <section className="board-list-section">
                    <h4 className="sub-title">천리안 위성 1호</h4>
                    
                    <input type="text" className="input" title="제목을 입력해 주세요." id="" name="" value="" placeholder="제목을 입력해 주세요."/>
                    <CKEditor
                        editor={ClassicEditor}
                        onChange={(event:any, editor:any) => {
                            setContent(content => content = editor.getData());
                        }}
                        onBlur={(event:any, editor:any) => {
                            console.log('Blur.', editor)
                        }}
                        onFocus={(event:any, editor:any) => {
                            console.log('Focus.', editor)
                        }}
                        config={{}}
                    />
                    <div className="file_upload_wrap">
                        <div className="divide_wrap">
                            <div className="file_upload_label">
                                <label htmlFor="file_upload">찾아보기</label>
                                <input type="file" className="input" id="file_upload" multiple={true} onChange={onChangeFiles}/>
                            </div>
                            <div className="divide_box file_upload_result scroll_y" ref={dragRef}>
                            {files.length > 0 &&
                                files.map((file: IFileTypes) => {
                                const {id, object: {name}} = file;
                    
                                return (
                                    <div key={id}>
                                        <div className="file_wrap" style={{display:'flex', justifyContent:'space-between', padding:'0 10px 0 4px', marginBottom:0}}>
                                            <span className="file_name">{name}</span>
                                            <div className="DragDrop-Files-Filter"onClick={() => handleFilterFile(id)}>
                                                삭제
                                            </div>
                                        </div>
                                    </div>
                                );
                                })}
                            </div>
                        </div>
                        <div className="divide_wrap">
                            <h5 className="title">comment</h5>
                            <textarea className="divide_box scroll_y" style={{width:'100%', height:'200px'}}></textarea>
                        </div>
                    </div>
                    <div className="btn-area right">
                        <button className="btn btn-primary">생성</button>&nbsp;
                        <button className="btn btn-gray" onClick={()=>setMode(MODE.TOPIC_LIST)}>취소</button>
                    </div>
                </section>
            </article>
        </div>
    )
}

export default TopicReg;

/*
    <div className="file_wrap">
        <span className="file_name">첨부파일명</span>.py
    </div>
*/