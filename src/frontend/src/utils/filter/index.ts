import { NeliosResponseItem, Filter, NumberFilterField, TextFilterField } from "../../types";

// extra all meal plans category
export const mealPlanAll = 'Όλες οι κατηγορίες';

// filter fields
// price
const price: NumberFilterField = {
    type: 'number',
    min: 0,
    max: 0,
    active: false,
    filterFunc: function(item) {
        if(!this.active) return true;
        const itemValue = Math.trunc(item.price);
        return itemValue >= Math.trunc(this.min) && itemValue <= Math.trunc(this.max);
    }
};

// meal plan
const mealPlan: TextFilterField = {
    type: 'string',
    value: '',
    active: false,
    strictCase: false,
    filterFunc: function(item) {
        if(!this.active) return true;
        if(this.value === mealPlanAll) return true;
        const re = new RegExp(`^${(this as TextFilterField).value}$`, `g${this.strictCase ? '' : 'i'}`);
        return re.test(item.meal_plan);
    }
}

// filter object
export const filters: Filter = {
    fields: {
        price,
        mealPlan
    },
    apply: function(data: NeliosResponseItem[]) {
        /*
        // filter functions chain
        const chain = Object.values(this.fields).map(f => f.filterFunc.bind(f));
        // apply succesive filtering to original dataset for each chain callback
        return chain.reduce<NeliosResponseItem[]>((passed, cb) => passed.filter(cb), data);
        */
        // filter functions chain
        const chain = (item: NeliosResponseItem) => Object.values(this.fields).map(f => f.filterFunc.bind(f)).reduce((pass, f) => pass && f(item), true);
        return data.filter(chain);
    }
};

/**
 * find the closest multiple of k for a number n
 * @param n n
 * @param k k
 * @returns return the closest multiple of k for n
 */
const closestMultiple = (n: number, k: number = 10) => n + (k - n % k);

/**
 * generates price range options for filter UI
 * @param min min price value (will be rounded to closest multiple of 10)
 * @param max max price value
 * @param step price range between options
 * @returns 
 */
export const generatePriceRangeRadio = (min: number, max: number, step: number = 50) => {
    const generateRadio = (p: number, i: number) => {
        const div = document.createElement('div');
        div.classList.add('form-check', 'h-auto', 'mb-2');
        div.innerHTML = `
            <input class="form-check-input" type="radio" name="price-range-radio" id="price-range-radio-${i}" value="${p}" data-filter-field="price.max">
            <label class="form-check-label" for="price-range-radio-${i}">έως ${p} €</label>
        `;
        return div;
    }
    
    let prices = [];
    for(let i = closestMultiple(min, 10); i + step < max; i += step) {
        prices.push(i);
    }

    prices.push(max);
    
    const radios: HTMLDivElement[] = [];
    prices.forEach((p, i) => {
        radios.push(generateRadio(Math.floor(p), i));
    });
    prices[prices.length - 1] < max && radios.push(generateRadio(max, prices.length));
    return radios;
}

/**
 * generates meal plan options for filter UI
 * @param plans array containing meal plans
 * @returns 
 */
export const generateMealPlanRadio = (plans: string[]) => {
    const generateRadio = (p: string, i: number) => {
        const div = document.createElement('div');
        div.classList.add('form-check', 'h-auto', 'mb-2');
        div.innerHTML = `
            <input class="form-check-input" type="radio" name="meal-plan-radio" id="meal-plan-radio-${i}" value="${p}" data-filter-field="meal-plan">
            <label class="form-check-label" for="meal-plan-radio-${i}">${p}</label>
        `;
        return div;
    }

    const radios: HTMLDivElement[] = [];
    plans.forEach((p, i: number) => {
        radios.push(generateRadio(p, i));
    })
    return radios;
}

export const minMaxValues = (data: NeliosResponseItem[], field: keyof NeliosResponseItem = 'price') => {
    let min: number | string | undefined = undefined,
        max: number | string | undefined = undefined;
    const values = data.map(d => d[field]);
    
    if(typeof data[0][field] === 'number') {
        min = Math.min(...values as number[]);
        max = Math.max(...values as number[]);
    }
    else if(typeof data[0][field] === 'string') {
        const sorted = [...values].sort();
        min = sorted[0] as string;
        max = sorted[sorted.length - 1] as string;
    }

    return [min, max];
}
