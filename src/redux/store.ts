import { configureStore } from "@reduxjs/toolkit";
import peopleSlice from "./slices/peopleSlice";

export const store = configureStore({
	reducer: {
		people: peopleSlice,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			immutableCheck: false,
			serializableCheck: false,
		}),
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;
