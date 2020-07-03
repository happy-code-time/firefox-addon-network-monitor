import setItemRemote from "./storage/setItemRemote";

const synchronizeListToTheDb = (listname: string, lokalList: string[]) => {
    // @ts-ignore
    return browser.runtime.sendMessage({
        action: 'get-default-list',
        listname
    })
    .then( defaultList => {
        const difference = [];

        if(defaultList && defaultList.length && lokalList && lokalList.length){
            lokalList.map( entry => {
                if(!defaultList.includes(entry)){
                    difference.push(entry);
                }
            });
        }

        if(difference && difference.length){
            difference.map( async (value) => {
                await setItemRemote(listname, value, 'add');
            });
        }
    });
};

export default synchronizeListToTheDb;