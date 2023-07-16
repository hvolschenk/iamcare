import client from '../client';

const deleteItem = (itemID: string) => client.delete(`/items/${itemID}`);

export default deleteItem;
