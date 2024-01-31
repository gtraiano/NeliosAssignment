# Nelios Assignment

Developed using [Vite](https://vitejs.dev), TypeScript, [Express](https://expressjs.com) and [Bootstrap](https://getbootstrap.com).


## Configuration
Requests to the API require authentication. A minimal local backend perform all requests and serves the repsonse to the frontend. Should you run the application locally, you must store the following environment variables in an `.env` file located at the project's root folder.

- `NELIOS_API_KEY`  bearer token

- `BACKEND_PORT`    backend listen port

- `BACKEND_URL`     backend url

## Scripts

`npm install` to install dependencies (run for root and project parts folder separately)

`npm run dev` to start the development server

`npm run build` not implemented yet 

## User Flows
1. _**Filtering**_
   - Filter results by price range and meal plans. Both filters may be active at the same time.
2. _**Sorting**_
   - Sort results by name or price.

Functionality of user flows 1. and 2. can be used simultaneously.

## Implementation
## 1. Backend
The backend uses `Express` framework to handle HTTP requests. It acts merely as a remedy to the lack of `Access-Control-Allow-Origin` header in the API's responses.

## 2. Frontend
The frontend uses `Bootstrap` CSS framework. Functionality is implemented in vanilla TypeScript.

### Functionality
#### Flow
It all begins with a `GET` request at the backend. Having the data fetched, it is consequently stored in an array. This array remains untouched. All filtering and sorting is performed on a copy of the original.

Two distinct UI elements stand out, the functionality tab and the results grid.
The former contains the necessary UI elements to perform user flow 1. and 2., whereas the latter is where the results are displayed.

In slightly more detail, the filter/sort panel includes a `<form>` element and several `<input>` elements. A general `onchange` event handler is attached to the form, while the implementation details of each function are spread in separate places.
On each `onchange` event, the form's event handler runs all required UI operations (i.e. `DOM` manipulation) to present the results in the grid.

#### Filtering
Filtering functionality is implemented via the standard `Array.filter` method.
An object of the following format stores the filtering options.
```typescript
   filters {
        fields: {
            price: {
                type: 'number',                 // filter type
                active: boolean,                // is active
                min: number,                    // lower threshold value
                max: number,                    // upper threshold value
                filterFunc: (item) => boolean   // whether an item passes fitlering criteria
            },
            mealPlan: {
                type: 'string',
                active: boolean,
                value: string,                  // string used for comparison
                filterFunc: (item) => boolean
            }
        },
        apply: (data) => []                     // applies filtering chain on array
    }
```

#### Sorting
Sorting functionality utilises the standard `Array.sort` method. Sorting options are queried directly from the respective `form` elements.

#### UI
Update of the results grid is straightforward. When a new set of items must be rendered, the outdated items are removed followed by the rendering of the updated items.

## TODO
- [x] Filter by price and meal plan
- [x] Sort by hotel name or price
- [x] Desktop version (including breakpoints up to _sm_)
- [ ] Mobile version
