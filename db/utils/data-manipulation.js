// extract any functions you are using to manipulate your data, into this file

exports.reFormatTimeStamp = (unixNum)=> {
  
const dateObj = new Date(unixNum);
const humanDate = dateObj.toLocaleString()
return humanDate;

}


exports.formatObj(list, keyToChange, funct) {

    const newList = list.map((listItem) => {
        let newItem = { ...listItem };
        newItem[keyToChange] = funct(newItem[keyToChange]);
        
        return newItem;
      });
      return newList;
    };
      
      
      
      
      
      
      

