import './styles/general.css';
import fetcher from './controllers/nelios/';
import { generateHotelCard, generateMealPlanRadio, generatePriceRangeRadio, mealPlanAll, minMaxValues } from './utils';
import { filters } from './utils';
import { NeliosResponseItem, NumberFilterField, TextFilterField } from './types';
import { updatePriceRangeRectangles } from './utils/UI/priceRectangles';
import { onSorting } from './utils/events/sort';
import { onFilterFieldChange } from './utils/events/filter';

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

    // form event listeners
    document.querySelector('form#filter-form')?.addEventListener('change', onFilterFieldChange);
    document.querySelector('form#sort-form')?.addEventListener('change', (e: Event) => { onSorting(e)(results); });

    // update results count in UI
    (document.querySelector<HTMLSpanElement>('.results-items-count') as HTMLSpanElement).textContent = String(results.length);

    // meal plans filter UI initilisation
    (filters.fields.mealPlan as TextFilterField).active = true;
    (filters.fields.mealPlan as TextFilterField).value = mealPlanAll;
    const mealPlansRadio = document.querySelector<HTMLFieldSetElement>('.meal-plan-radio');
    mealPlansRadio?.append(...generateMealPlanRadio(mealPlans));
    mealPlansRadio?.querySelector(`input[value="${mealPlanAll}"]`)?.setAttribute('checked', '');
    
    // update price range max, min
    let [minPrice, maxPrice] = minMaxValues(data) as number[];
    [minPrice, maxPrice] = [Math.trunc(minPrice), Math.trunc(maxPrice)];

    // set price range inputs
    (document.querySelector('.price-range input[type=number]#price-range-min') as HTMLInputElement).value = minPrice.toString();
    (document.querySelector('.price-range input[type=number]#price-range-max') as HTMLInputElement).value = maxPrice.toString();

    // set price range slider min and max
    document.querySelector('.price-range-slider > input[type=range]')?.setAttribute('max', maxPrice.toString());
    document.querySelector('.price-range-slider > input[type=range]')?.setAttribute('min', minPrice.toString());
    (document.querySelector('.price-range-slider > input[type=range]') as HTMLInputElement).value = maxPrice.toString();

    // set price range filter values
    (filters.fields.price as NumberFilterField).min = Math.floor(minPrice);
    (filters.fields.price as NumberFilterField).max = Math.ceil(maxPrice);
    filters.fields.price.active = true;

    // append price range rectangles in filter UI
    updatePriceRangeRectangles(results);
    // initialise price range radio
    document.querySelector('.price-range-radio')?.append(...generatePriceRangeRadio(minPrice, maxPrice));
    document.querySelector(`.price-range-radio input[value="${maxPrice}"]`)?.setAttribute('checked', '');
    
});