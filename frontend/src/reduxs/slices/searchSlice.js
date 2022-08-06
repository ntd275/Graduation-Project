import { createSlice } from "@reduxjs/toolkit";

export const searchSlice = createSlice({
    name: "search",
    initialState: {
        searchValue: "",
    },
    reducers: {
        updateSearchState: (state, action) => {
            return {
                ...state,
                ...action.payload,
            };
        },
    },
});

export const { updateSearchState } = searchSlice.actions;

export default searchSlice.reducer;
