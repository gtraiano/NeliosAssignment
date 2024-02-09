import './styles/general.css';
import fetcher from './controllers/nelios/';
import { generateHotelCard, generateMealPlanRadio, generatePriceRangeRadio, mealPlanAll, minMaxValues } from './utils';
import { filters } from './utils';
import { NeliosResponseItem, NumberFilterField, TextFilterField } from './types';
import { updatePriceRangeRectangles } from './utils/UI/priceRectangles';
import { onSorting } from './events/sort';
import { onFilterFieldChange } from './events/filter';
import { importTemplate } from './utils/DOM';

export let data: NeliosResponseItem[] = [];     // data from API
export let results: NeliosResponseItem[] = [];  // filtered + sorted results
export let mealPlans: string[] = [];            // meal plan titles

document.addEventListener('DOMContentLoaded', async () => {
    //display spinner while fetching data
    document.querySelector('.loading')?.setAttribute('active', '');
    data = await fetcher();
    document.querySelector('.loading')?.removeAttribute('active');

    // preparations
    results = [...data];
    // extract available meal plans from data and add option for "all plans"
    mealPlans = [mealPlanAll, ...new Set(data.map(item => item.meal_plan))];
    
    // append hotel cards to UI
    const target = document.querySelector('.results-cards') as HTMLElement;
    results.forEach(item => {
        target?.append(generateHotelCard(item));
    });

    const formTemplate = await importTemplate('/src/templates/form.html');
    (document.querySelector('section#control-panel') as HTMLElement).append(formTemplate.cloneNode(true));
    (document.querySelector('#filter-modal .modal-body') as HTMLElement).append(formTemplate.cloneNode(true));
    (document.querySelector('#filter-modal .modal-body .filter') as HTMLElement).classList.add('d-flex', 'flex-column');
    // form event listeners
    document.querySelectorAll('form#filter-form').forEach(f => {
        f.addEventListener('change', onFilterFieldChange);
    });
    document.querySelectorAll('form#sort-form').forEach(f => {
        f.addEventListener('change', (e: Event) => { onSorting(e)(results); });
    });

    // update results count in UI
    (document.querySelector<HTMLSpanElement>('.results-items-count') as HTMLSpanElement).textContent = String(results.length);

    // meal plans filter UI initilisation
    (filters.fields.mealPlan as TextFilterField).active = true;
    (filters.fields.mealPlan as TextFilterField).value = mealPlanAll;
    const mealPlansRadio = document.querySelectorAll<HTMLFieldSetElement>('.meal-plan-radio');
    mealPlansRadio.forEach(r => {
        r.append(...generateMealPlanRadio(mealPlans))
    });
    mealPlansRadio.forEach(r => {
        r.querySelector(`input[value="${mealPlanAll}"]`)?.setAttribute('checked', '');
    });
    
    // update price range max, min
    let [minPrice, maxPrice] = minMaxValues(data) as number[];
    [minPrice, maxPrice] = [Math.trunc(minPrice), Math.trunc(maxPrice)];

    // set price range inputs
    document.querySelectorAll<HTMLInputElement>('.price-range input[type=number]#price-range-min').forEach(i => {
        i.value = minPrice.toString();
    });
    document.querySelectorAll<HTMLInputElement>('.price-range input[type=number]#price-range-max').forEach(i => {
        i.value = maxPrice.toString();
    });

    // set price range slider min and max
    document.querySelectorAll('.price-range-slider > input[type=range]').forEach(i => {
        i.setAttribute('max', maxPrice.toString())
    });
    document.querySelectorAll('.price-range-slider > input[type=range]').forEach(i => {
        i.setAttribute('min', minPrice.toString())
    });
    document.querySelectorAll<HTMLInputElement>('.price-range-slider > input[type=range]').forEach(i => {
        i.value = maxPrice.toString();
    });

    // set price range filter values
    (filters.fields.price as NumberFilterField).min = Math.floor(minPrice);
    (filters.fields.price as NumberFilterField).max = Math.ceil(maxPrice);
    filters.fields.price.active = true;

    // append price range rectangles in filter UI
    updatePriceRangeRectangles(results);
    // initialise price range radio
    document.querySelectorAll('.price-range-radio').forEach((i, idx) => {
        i.append(...generatePriceRangeRadio({ min: minPrice, max: maxPrice, step: 50, idPrefix: `form-${idx}`}));
    });
    document.querySelectorAll(`.price-range-radio input[value="${maxPrice}"]`).forEach(i => {
        i.setAttribute('checked', '');
    });
});
