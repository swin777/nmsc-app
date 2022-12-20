import { useRecoilValue } from "recoil";
import { MODE, mode as modeAtom } from "../state";
import TopicList from "./TopicList";
import TopicReg from "./TopicReg";
import TopicDetail from "./TopicDetail"

const TopicIntro = () => {
    const mode = useRecoilValue(modeAtom);
    return(
        <>
            <div style={{display:mode===MODE.TOPIC_LIST ? 'block' : 'none'}}><TopicList/></div>
            { mode===MODE.TOPIC_REG && <TopicReg/> }
            { mode===MODE.TOPIC_DETAIL && <TopicDetail/> }
        </>
    )
}

export default TopicIntro;