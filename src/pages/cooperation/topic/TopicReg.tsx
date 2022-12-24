import { useRecoilValue, useSetRecoilState } from "recoil";
import { MODE, mode as modeAtom, selectCatory, selectTopic as selectTopicAtom, topicDetailRefresh, topicRefresh } from "../state";
import { CKEditor } from "@ckeditor/ckeditor5-react"
import ClassicEditor from "@ckeditor/ckeditor5-build-classic"
import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Topic, UploadTopic } from "../../../models/topic";
import { serverCall } from "../../../utils/apiCallUtil";

interface IFileTypes {
    id: number;
    object: File;
}

const TopicReg = () => {
    const setMode = useSetRecoilState(modeAtom);
    const setTopicRefresh = useSetRecoilState(topicRefresh);
    const setTopicDetailRefresh = useSetRecoilState(topicDetailRefresh);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [files, setFiles] = useState<IFileTypes[]>([]);
    const dragRef = useRef<HTMLDivElement | null>(null);
    const fileId = useRef<number>(0);
    const file = useRef<any>();
    const category = useRecoilValue(selectCatory);
    const selectTopic = useRecoilValue(selectTopicAtom) 
    const [uploadTopic, setUploadTopic] = useState<UploadTopic>(new UploadTopic(category!.categoryId));

    useMemo(() => {
        setUploadTopic({...uploadTopic, ...selectTopic});
    }, [selectTopic])

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

    const topicReg = async() => {
        let formData = new FormData();
        
        files.forEach((file:IFileTypes) => {
            formData.append('file', file.object);
        })

        if(selectTopic){
            formData.append('comments', uploadTopic.comments);
            formData.append('language', uploadTopic.language);
            formData.append('categoryId', uploadTopic.categoryId+"");
            formData.append('topicId', selectTopic.topicId+"");
            let res:any = await serverCall(`/homepage/html/base/collaboration/insertTopicContents.do`, 'POST', formData)
            if(res.data){
                alert('새버전이 생성되었습니다.');
                setTopicDetailRefresh(new Date().getTime())
                setMode(MODE.TOPIC_DETAIL)
            }else{
                alert(res.error);
            }
        }else{
            formData.append('title', uploadTopic.title);
            formData.append('contents', uploadTopic.contents);
            formData.append('comments', uploadTopic.comments);
            formData.append('language', uploadTopic.language);
            formData.append('categoryId', uploadTopic.categoryId+"");
            let res:any = await serverCall(`/homepage/html/base/collaboration/insertTopic.do`, 'POST', formData) 
            if(res.data){
                alert('등록되었습니다.');
                setTopicRefresh(new Date().getTime())
                setMode(MODE.TOPIC_LIST)
            }else{
                alert(res.error);
            }
        }
    }

    return(
        <>
            <section className="board-list-section">
                <h4 className="sub-title">{category?.title}</h4>
                {!selectTopic &&
                <>
                <input type="text" className="input" title="제목을 입력해 주세요." id="topicTitle" value={uploadTopic.title} placeholder="제목을 입력해 주세요."
                    onChange={e=>setUploadTopic({...uploadTopic, title:e.target.value})}/>
                <CKEditor
                    data={uploadTopic.contents}
                    editor={ClassicEditor}
                    onChange={(event:any, editor:any) => {
                        setUploadTopic(uploadTopic => uploadTopic = {...uploadTopic, contents:editor.getData()});
                    }}
                    onReady={(editor:any) => {
                        editor.editing.view.change((writer:any) => {
                            writer.setStyle("height","400px",editor.editing.view.document.getRoot());
                        });
                    }}
                />
                <input type="text" className="input" title="프로그램언어를 입력해 주세요." id="categoryTags" value={uploadTopic.language} placeholder="프로그램언어를 입력해 주세요."
                        onChange={e=>setUploadTopic({...uploadTopic, language:e.target.value})}/>
                </>
                }
                <div className="file_upload_wrap">
                    <div className="divide_wrap">
                        <div className="file_upload_label">
                            <label htmlFor="file_upload">찾아보기</label>
                            <input type="file" className="input" id="file_upload" multiple={true} onChange={onChangeFiles} ref={file}/>
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
                        <div style={{paddingBottom:12}}></div>
                        <CKEditor
                            editor={ClassicEditor}
                            onChange={(event:any, editor:any) => {
                                setUploadTopic(uploadTopic => uploadTopic = {...uploadTopic, comments:editor.getData()});
                            }}
                            config={{toolbar:[]}}
                        />
                    </div>
                </div>
                <div className="btn-area right">
                    <button className="btn btn-primary" onClick={topicReg}>생성</button>&nbsp;
                    <button className="btn btn-gray" onClick={()=>setMode(selectTopic ? MODE.TOPIC_DETAIL : MODE.TOPIC_LIST)}>취소</button>
                </div>
            </section>
        </>
    )
}

export default TopicReg;

/*
    <div className="file_wrap">
        <span className="file_name">첨부파일명</span>.py
    </div>
*/