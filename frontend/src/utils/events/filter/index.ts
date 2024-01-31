import { filters, updateResultsUI } from "../..";
import { TextFilterField, NumberFilterField } from "../../../types";
import { updatePriceRangeRectangles } from "../../UI/priceRectangles";
import { onSorting } from "../sort";

import { results, data } from "../../../main";

// actions to perform after filtering
export const generalChangeHandler = (e: Event) => {
    // empty array
    //results.length = 0;
    results.splice(0, results.length);
    results.push(...filters.apply(data));
    (document.querySelector<HTMLSpanElement>('.results-items-count') as HTMLSpanElement).textContent = String(results.length);
    updateResultsUI()(results);
    updatePriceRangeRectangles(results);
    onSorting(e)(results);
}

// filter UI event handler for onchange events
export const onFilterFieldChange = (e: Event) => {
    const extractParts = (s: string): string[] => {
        //const [, field, property] = /([^.]*)(?:\.(.*))?/gm.exec(s) as string[]; // [1] is field name, [2] is property
        const [field, property] = s.split('.')
        const hyphenToCamelCase = (s: string) => {
            if(!s) return s;
            const re = /(-)(\w)/g;
            return s.replaceAll(re, (...args: string[]) => args[2].toUpperCase());
        };
        return [hyphenToCamelCase(field), hyphenToCamelCase(property)];
    };

    const target = e.target as HTMLInputElement;
    if(!target.hasAttribute('data-filter-field')) return;
    const [field, property] = extractParts(target.getAttribute('data-filter-field') as string);
    if(!filters.fields[field]) return;
    
    if(filters.fields[field].type === 'number') {
        let value = Number.parseFloat(target.value);
        value = Number.isNaN(value)
            ? property === 'min' ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY
            : value;
        // @ts-ignore
        (filters.fields[field] as NumberFilterField)[property] = value;
    }
    else if(filters.fields[field].type === 'string') {
        // @ts-ignore
        (filters.fields[field] as TextFilterField).value = target.value;
    }
    generalChangeHandler(e);
}