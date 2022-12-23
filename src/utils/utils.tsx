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