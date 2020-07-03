import getItem from './getItem';

const getList = async (name: string) => {
    return await getItem(name);
};

export default getList;