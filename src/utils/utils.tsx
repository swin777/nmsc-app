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

export const csvToJSON = (csvText:string) => {
  let gubun = '\r\n';
  if(csvText.indexOf(gubun)<0){
    if(csvText.indexOf('\n')>0){
      gubun = '\n';
    }
  }
  const [columns, ...rows] = csvText.trim().split(gubun);
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
    columnDefs = Object.keys(jsonText[0]).map(key => {return {field: key, filter: 'agTextColumnFilter'}})
  }
  //JSON.stringify(jsonText, null, "  ");
  return {columnDefs:columnDefs, rowData:jsonText}
}

export const convertToCSV = (objArray:any) =>  {
  var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
  var str = '';

  for (var i = 0; i < array.length; i++) {
      var line = '';
      for (var index in array[i]) {
          if (line != '') line += ','

          line += array[i][index];
      }

      str += line + '\r\n';
  }

  return str;
}

export const exportCSVFile = (headers:any, items:any, fileTitle:string) => {
  if (headers) {
      items = [headers, ...items];
  }

  // Convert Object to JSON
  var jsonObject = JSON.stringify(items);

  var csv = convertToCSV(jsonObject);

  var exportedFilenmae = fileTitle + '.csv' || 'export.csv';

  var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  var link = document.createElement("a");
  if (link.download !== undefined) { // feature detection
      // Browsers that support HTML5 download attribute
      var url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", exportedFilenmae);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  }
}