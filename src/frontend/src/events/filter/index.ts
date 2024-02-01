import { filters, updateResultsUI } from "../../utils";
import { TextFilterField, NumberFilterField } from "../../types";
import { updatePriceRangeRectangles } from "../../utils/UI/priceRectangles";
import { onSorting } from "../sort";

import { results, data } from "../../main";

// actions to perform after filtering
export const generalChangeHandler = (e: Event) => {
    // empty array
    //results.length = 0;
    results.splice(0, results.length);
    results.push(...filters.apply(data));
    (document.querySelector<HTMLSpanElement>('.results-items-count') as HTMLSpanElement).textContent = String(results.length);
    updateResultsUI()(results);
    updateFiltersUI(e);
    onSorting(e)(results);
}

// update filter UI elements values
const updateFiltersUI = (e: Event) => {
    if(!((e.currentTarget as HTMLElement).id === 'filter-form')) return;
    updatePriceRangeRectangles(results);
    updatePriceRangeSliderValue();
    updatePriceRangeRadioOption();
    updatePriceRangeMaxInputValue();
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

// select radio with value as close to price slider value
const updatePriceRangeRadioOption = () => {
    const radios = Array.from(document.querySelectorAll<HTMLInputElement>('.price-range-radio input'));
    //const value = Number.parseFloat((e.target as HTMLInputElement).value);
    const value = (filters.fields.price as NumberFilterField).max;
    // radios are sorted by value, so 1st matching element is correct
    (radios.find(r => Number.parseFloat(r.value) >= value) as HTMLInputElement).checked = true;
}

// update max price range input value on price slider change
const updatePriceRangeMaxInputValue = () => {
    (document.querySelector('#price-range-max') as HTMLInputElement).value = (filters.fields.price as NumberFilterField).max.toString();
}

// update price range slider value
const updatePriceRangeSliderValue = () => {
    (document.querySelector('#price-range-slider') as HTMLInputElement).value = (filters.fields.price as NumberFilterField).max.toString();
}