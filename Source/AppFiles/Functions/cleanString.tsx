/**
 * Clean not a character item from string
 * 65533 =  
 * 0 =  
 */
const cleanString=(input) => {
    var output="";
    for (var i=0;i<input.length;i++) {
        if (input.charCodeAt(i)!==65533&&input.charCodeAt(i)!==0) {
            output+=input.charAt(i);
        }
    }
    return output;
}

export default cleanString;