import ExportUser from "./ExportUser";
import GeneralUser from "./GeneralUser";

const AnalysisTool = () => {
    const params = new URLSearchParams(location.search);
    return(
       <div>
            {params.get('level')==='general' ? <GeneralUser/> : <ExportUser/> }
        </div>
    )
}

export default AnalysisTool;