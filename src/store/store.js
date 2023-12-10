import { configureStore } from "@reduxjs/toolkit";
import { uiSlice } from "./ui/uiSlide";
import { calendarSlice } from "./calendar/calendarSlide";

export const store = configureStore({
    reducer: {
        ui: uiSlice.reducer,
        calendar: calendarSlice.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
    }),
});