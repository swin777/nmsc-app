import CategoryIntro from "./category/CategoryIntro";
import TopicIntro from "./topic/TopicIntro";
import { MODE, mode as modeAtom } from "./state"
import { useRecoilValue } from "recoil";

const Cooperation = () => {
    const mode = useRecoilValue(modeAtom);
    
    return(
        <>
            <CategoryIntro/>
            { (mode===MODE.TOPIC_LIST || mode===MODE.TOPIC_REG || mode===MODE.TOPIC_DETAIL) && 
                <TopicIntro/> 
            }
        </>
    )
}

export default Cooperation;