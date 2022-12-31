import { useState } from "react";

const Loading = (props:any) => {
    const [visible, setVisible] = useState(false);
    setTimeout(() => setVisible((v)=>v=true), 2000);

    return(
        <div style={{zIndex:1000, display:visible?"flex":"none", justifyContent:'center', backgroundColor:props.backgroundColor}}>
            <div className="loading"/>
        </div>
    )
} 

export default Loading;