import { createSlice } from "@reduxjs/toolkit";

// Initial state
let initialState = {
    toasts: {},
};

// Actual Slice
export const appSlice = createSlice({
    name: "alert",
    initialState,
    reducers: {
        ADD_TOAST: (state, action) => {
            state.toasts[action.payload.toastId] = action.payload.toast;
        },
        REMOVE_TOAST: (state, action) => {
            delete state.toasts[action.payload];
        },
        UPDATE_TOAST: (state, action) => {
            const { toastId, ...newToast } = action.payload;
            const toast = state.toasts[toastId];
            state.toasts[toastId] = {
                ...toast,
                ...newToast
            };
        },
        CLEAR_TOAST: (state, action) => {
            state.toasts = {}
        }
    },
});

export const {
    ADD_TOAST,
    REMOVE_TOAST,
    UPDATE_TOAST,
    CLEAR_TOAST
} = appSlice.actions
export default appSlice.reducer;