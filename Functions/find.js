const find = async(params,Table)=> {
    let scan = Table.scan();
  
    for (const key in params) {
      if (params[key]) {
        scan = scan.where(key).contains(params[key]);
      }
    }
  
    const result = await scan.exec();
    return result;
  }

  module.exports = find