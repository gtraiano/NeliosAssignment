import { NeliosResponseItem } from "../../types";

export const sortFunction = (a: NeliosResponseItem, b: NeliosResponseItem) =>
    ({ by, order }: { by: string, order: string}): number => 
{
    if(by === 'name') {
        return a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }) * (order === 'asc' ? 1 : -1);
    }
    else if(by === 'price') {
        return (a.price - b.price) * (order === 'asc' ? 1 : -1);
    }
    else return 0;
}