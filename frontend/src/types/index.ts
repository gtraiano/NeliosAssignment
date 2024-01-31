// API response types
export interface NeliosResponse {
    status: number,
    data: NeliosResponseItem[]
}

export interface NeliosResponseItem {
    name: string,
    rating: number,
    meal_plan: string,
    city: string,
    price: number,
    photo: string
}

// filter object types
// single filter field
export interface FilterField {
    type: 'number' | 'string',  // numeric or text
    active: boolean,            // filter is active
    filterFunc: (input: NeliosResponseItem) => boolean  // filtering function
}

// text type field
export interface TextFilterField extends FilterField {
    value: string,
    strictCase: boolean
}
// numeric type field
export interface NumberFilterField extends FilterField {
    min: number,    // lower threshold
    max: number     // upper threshold
}

// object containing filter fields
export interface FilterFields {
    [field: string]: TextFilterField | NumberFilterField
}

// filter object
export interface Filter {
    fields: FilterFields,
    apply: (data: NeliosResponseItem[]) => NeliosResponseItem[] // chain of all fields filtering functions
}