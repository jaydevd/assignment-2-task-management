const VALIDATION_RULES = {
    USER: {
        id: "required|max:60",
        name: "required|max:64",
        email: "required|email|max:60",
        password: "required|max:60",
        country: "required|max:64",
        city: "required|max:64",
        gender: "required",
        age: "required",
        token: "max:128"
    },
    ADMIN: {
        id: "required|string",
        name: "required|string",
        email: "required|email|max:60",
        password: "required|max:60",
        gender: "required",
        token: "max:128"
    },
    CATEGORY: {
        id: "required|max:60",
        name: "required|max:60",
        sub_categories: "required|jsonb"
    },
    COUNTRY: {
        id: "required|max:60",
        name: "required|max:60",
        cities: "required|jsonb"
    },
    ACCOUNT: {
        id: "required|max:60",
        name: "required|max:64",
        category: "required|max:60",
        subCategory: "required|max:60",
        description: "max:500"
    }
}

module.exports = { VALIDATION_RULES }