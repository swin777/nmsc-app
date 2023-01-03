import { useSetRecoilState } from "recoil"
import { mode, MODE, categoryRefresh } from '../state'
import { CKEditor } from "@ckeditor/ckeditor5-react"
import ClassicEditor from "@ckeditor/ckeditor5-build-classic"
import { useState } from "react";
import { Category, categorySendMake } from "../../../models/category";
import { serverCall } from "../../../utils/apiCallUtil";

const CategoryReg = () => {
    const setMode = useSetRecoilState(mode);
    const setCategoryRefresh = useSetRecoilState(categoryRefresh);
    const [content, setContent] = useState();
    const [category, setCategory] = useState<Category>(new Category('dms02user01'));

    const reg = async() => {
        if(!validate()){return}
        let res:any = await serverCall(`/homepage/html/base/collaboration/insertCategory.do`, 'POST', categorySendMake(category))
        if(res.data){
            setCategoryRefresh(new Date().getTime())
            alert('등록되었습니다.');
            setMode(MODE.CATEGORY_LIST);
        }else{
            alert(res.error);
        }
    }

    const validate = ():boolean => {
        let result = true
        if(!category.title){
            alert("제목을 입력하세요.")
            return result = false;
        }
        if(!category.contents){
            alert("내용을 입력하세요.")
            return result = false;
        }
        return result;
    }

    return(
        <>
            <section className="board-list-section">
                <h4 className="sub-title">카테고리</h4>
                <div className="board-util">
                    <input type="text" className="input" title="제목을 입력해 주세요." id="categoryTitle" value={category.title} placeholder="제목을 입력해 주세요."
                        onChange={e=>setCategory({...category, title:e.target.value})}/>
                    <CKEditor
                        editor={ClassicEditor}
                        onChange={(event:any, editor:any) => {
                            setCategory(category => category = {...category, contents:editor.getData()});
                        }}
                        onReady={(editor:any) => {
                            editor.editing.view.change((writer:any) => {
                                writer.setStyle("height","400px",editor.editing.view.document.getRoot());
                            });
                        }}
                    />
                    <input type="text" className="input" title="#태그를 입력해 주세요." id="categoryTags" value={category.tags} placeholder="#태그를 입력해 주세요."
                        onChange={e=>setCategory({...category, tags:e.target.value})}/>
                </div>
                <div className="btn-area right">
                    <button className="btn btn-primary" onClick={reg}>생성</button>&nbsp;
                    <button className="btn btn-gray" onClick={e=>setMode(MODE.CATEGORY_LIST)}>취소</button>
                </div>
            </section>
            <div className="btn-top">
                <button type="button"><span>TOP</span></button>
            </div>
        </>
    )
}

export default CategoryReg;