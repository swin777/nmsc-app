import { useRecoilValue } from "recoil";
import { MODE, mode as modeAtom } from "../state";
import CategoryList from "./CategoryList";
import CategoryReg from "./CategoryReg";

const CategoryIntro = () => {
    const mode = useRecoilValue(modeAtom);

    return(
        <>
            <div style={{display:mode===MODE.CATEGORY_LIST ? 'block' : 'none'}}><CategoryList/></div>
            { mode===MODE.CATEGORY_REG && <CategoryReg/> }
        </>
    )
}

export default CategoryIntro;