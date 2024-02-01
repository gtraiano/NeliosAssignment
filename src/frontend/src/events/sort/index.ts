import { NeliosResponseItem } from "../../types";
import { updateResultsUI } from "../../utils/UI/cards";
import { sortFunction } from "../../utils/sort";

export const onSorting = (_e: Event) => (results: NeliosResponseItem[]) => {
    // sorting field and order
    const order = (document.querySelector('#sort-order') as HTMLSelectElement).value;
    const by = (document.querySelector('#order-by') as HTMLSelectElement).value;
    // disable order is field is set to none
    if(by === 'none') (document.querySelector('#sort-order') as HTMLSelectElement).setAttribute('disabled', '');
    else ((document).querySelector('#sort-order') as HTMLSelectElement).removeAttribute('disabled');
    // no need to sort
    if(by === 'none') {
        updateResultsUI()(results);
        return;
    }
    const sorted = [...results].sort((a, b) => sortFunction(a, b)({ by, order }));
    updateResultsUI()(sorted);
}
