import { useState } from "react";

const PopLoading = (props:any) => {
    const [visible, setVisible] = useState(false);
    setTimeout(() => setVisible((v)=>v=true), 2000);

    return(
        <div style={{
            zIndex:1000, position:'absolute', display:visible?"flex":"none", justifyContent:'center',
            backgroundColor:'rgba(0, 0, 0, 0)', top:'50%', left:'50%',  transform:'translate(-50%, -50%)'
        }}>
            <div className="loading"/>
        </div>
    )
} 

export default PopLoading;