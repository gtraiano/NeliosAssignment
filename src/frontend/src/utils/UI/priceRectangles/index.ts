import { NeliosResponseItem } from "../../../types";

// counts occurences of dataset values
const frequencyCount = (dataset: number[]): Map<number, number> => {
    const bin = new Map();
    dataset.forEach(p => {
        bin.set(p, (bin.get(p) ?? 0) + 1)
    });
    return bin;
}

export const generatePriceRangeRectangles = ( data: NeliosResponseItem[]) => {
    const prices = frequencyCount(data.map(p => Math.trunc(p.price)));
    const pricesCount = data.map(p => p.price).length;
    
    const priceRectangles = document.createElement('div');
    priceRectangles.classList.add('price-range-rectangle-container', 'd-flex', 'align-items-end');
    // should engage a binning algorithm to segregate price ranges
    // the following performs no binning
    [...prices.entries()]
        .sort((a, b) => a[0] - b[0])
        .forEach(([p, c]) => {
        // give price rectangle height equivalent to its relative frequency
        const rect = document.createElement('div');
        rect.classList.add('price-range-rectangle');
        rect.style.height = `${(c / pricesCount) * 100}%`;
        rect.title = `${p}€`;
        rect.setAttribute('price', p.toString());
        rect.setAttribute('count', c.toString());
        priceRectangles.append(rect);
    });
    return priceRectangles;
}

export const updatePriceRangeRectangles = (data: NeliosResponseItem[]) => {
    const ui = document.querySelectorAll<HTMLDivElement>('.price-range-rectangle-container');
    ui.forEach(el => {
        if(el.childElementCount) {
            Array.from(el.children).forEach(c => {
                c.remove();
            })
        }
        el.replaceWith(generatePriceRangeRectangles(data));
    });
}
