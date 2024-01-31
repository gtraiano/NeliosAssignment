import { NeliosResponseItem } from "../../../types";

/**
 * 
 * @param item a single hotel item
 * @returns a bootstrap card element
 */
export const generateHotelCard = (item: NeliosResponseItem) => {
    // card
    const card = document.createElement('div');
    card.classList.add('card', 'rounded', 'p-0');
    
    // hotel image
    const img = document.createElement('img');
    img.src = item.photo;
    img.classList.add('card-img-top', 'h-30');
    img.alt = `image of ${item.name}`;

    // card body
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body', 'd-flex', 'flex-column', 'justify-content-between');

    // 1st row of body
    const titleRow = document.createElement('div');
    //titleRow.classList.add('d-flex', 'flex-row', 'justify-content-between', 'align-items-center');
    // city name header
    const h = document.createElement('h3');
    h.classList.add('card-title');
    h.textContent = `${item.name} στο ${item.city}`;
    
    // hotel star rating
    const rating = document.createElement('span');
    rating.classList.add('star-rating', 'mb-2');
    rating.textContent = `${'★'.repeat(item.rating)}${'\☆'.repeat(5 - item.rating)}`;
    rating.title = `${item.rating} αστέρων`;
    titleRow.append(h);

    const mealRow = document.createElement('div');
    mealRow.classList.add('d-flex', 'flex-row', 'justify-content-between', 'align-items-baseline');
    const meal = document.createElement('p');
    meal.textContent = item.meal_plan;
    meal.classList.add('meal-plan');
    mealRow.append(meal, rating);
    
    // reservation price text
    const p = document.createElement('p');
    p.classList.add('card-text', 'p-0', 'm-0', 'price');
    p.textContent = `${Math.trunc(item.price)}`;
    

    // reservation button
    const a = document.createElement('a');
    a.href='';
    a.addEventListener('click', e => { e.preventDefault() });
    a.classList.add('btn', 'btn-success');
    a.textContent = 'Κράτηση';

    const reservationRow = document.createElement('div');
    reservationRow.classList.add('d-flex', 'flex-row', 'justify-content-between', 'align-items-center');
    reservationRow.append(p, a);

    cardBody.append(titleRow, mealRow, reservationRow);
    card.append(img, cardBody);
    
    return card;
}

/**
 * clears UI and and appends generated cards from data
 * @returns void
 */
export const updateResultsUI = () => (data: NeliosResponseItem[]) => {
    // clear all cards
    Array.from((document.querySelector('.results-cards') as HTMLElement)?.children).forEach(c => {
        c.remove();
    });
    // append fresh dataset
    document.querySelector('.results-cards')?.append(...data.map(generateHotelCard));
}