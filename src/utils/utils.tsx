export const makeParameter = (params:any):String => {
  let parameter = Object.keys(params).reduce((acc:any, cur:any, i:number) => {
    if(!params[cur]){
      return acc;
    }
    if(acc.length===0){
      return acc = `?${cur}=${params[cur]}`;
    }else{
      return acc = acc + `&${cur}=${params[cur]}`;
    }
  },"");
  return parameter;
}

export const converter = (csvText:string) => {
  const [columns, ...rows] = csvText.trim().split("\n");
  const keys = columns.split(",");
  const valuesArray = rows.map((row) => row.split(","));
  const jsonText = valuesArray.map((values) => (
    values.reduce((acc:any, v, i) => {
      acc[keys[i]] = v;
      return acc;
    }, {})
  ));

  let columnDefs;
  if(jsonText.length>0){
    columnDefs = Object.keys(jsonText[0]).map(key => {return {field: key}})
  }
  //JSON.stringify(jsonText, null, "  ");
  return {columnDefs:columnDefs, rowData:jsonText}
}