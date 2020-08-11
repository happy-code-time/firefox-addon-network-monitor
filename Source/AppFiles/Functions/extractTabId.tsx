const extractTabId = (href) => {
    try {
        if ('string' == typeof href && 10 < href.length) {
            let string = href.split('?tab=');

            if (string[1] && 'string' == typeof string[1] && string[1].length) {
                return string[1];
            } else {
                return false;
            }
        }
    } catch (error) {
        return false;
    }  
}

export default extractTabId;