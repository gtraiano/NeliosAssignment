import { NeliosResponseItem } from "../../types";
import { updateResultsUI } from "../../utils/UI/cards";
import { sortFunction } from "../../utils/sort";

export const onSorting = (e: Event) => (results: NeliosResponseItem[]) => {
    const target = e.currentTarget as HTMLFormElement;
    // sorting field and order
    const order = (target.querySelector('#sort-order') as HTMLSelectElement).value;
    const by = (target.querySelector('#order-by') as HTMLSelectElement).value;
    syncForms(by, order);
    // no need to sort
    if(by === 'none') {
        updateResultsUI()(results);
        return;
    }
    const sorted = [...results].sort((a, b) => sortFunction(a, b)({ by, order }));
    updateResultsUI()(sorted);
}

const syncForms = (by: string, order: string) => {
    // targeted select elements
    const sortBys = document.querySelectorAll<HTMLSelectElement>('#order-by');
    const sortOrders = document.querySelectorAll<HTMLSelectElement>('#sort-order');

    // disable order if field is set to none
    if(by === 'none') {
        document.querySelectorAll('#sort-order').forEach(s => { s.setAttribute('disabled', ''); });
    }
    else {
        document.querySelectorAll('#sort-order').forEach(s => { s.removeAttribute('disabled') });
    }

    // sync values for respective select's
    sortBys.forEach(s => {
        s.value = by;
    });

    sortOrders.forEach(s => {
        s.value = order;
    });
}