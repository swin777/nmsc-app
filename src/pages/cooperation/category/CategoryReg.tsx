import { useSetRecoilState } from "recoil"
import { mode, MODE } from '../state'
import { CKEditor } from "@ckeditor/ckeditor5-react"
import ClassicEditor from "@ckeditor/ckeditor5-build-classic"
import { useState } from "react";

const CategoryReg = () => {
    const setMode = useSetRecoilState(mode);
    const [content, setContent] = useState()

    return(
        <div className="content-wrap">
            <article id="content">
                <section className="board-list-section">
                    <h4 className="sub-title">카테고리</h4>
                    <div className="board-util">
                        <input type="text" className="input" title="제목을 입력해 주세요." id="" name="" value="" placeholder="제목을 입력해 주세요."/>
                        {/* <div className="ck" dangerouslySetInnerHTML={{ __html: content }} ></div> */}
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
                        <input type="text" className="input" title="#태그를 입력해 주세요." name="" id="" placeholder="#태그를 입력해 주세요."/>
                    </div>
                    <div className="btn-area right">
                        <button className="btn btn-primary">생성</button>&nbsp;
                        <button className="btn btn-gray" onClick={e=>setMode(MODE.CATEGORY_LIST)}>취소</button>
                    </div>
                </section>
                <div className="btn-top">
                    <button type="button"><span>TOP</span></button>
                </div>
            </article>
        </div>
    )
}

export default CategoryReg;