import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import database from "@react-native-firebase/database";

export interface Payment {
	id: string;
	amount: number;
	date: string;
	description: string;
	type: string;
}

export interface Person {
	id: string;
	name: string;
	payments: { [key: string]: Payment };
}

interface PeopleState {
	people: {
		[key: string]: Person;
	};
}

const initialState: PeopleState = {
	people: {},
};

export const syncPeople = createAsyncThunk(
	"people/syncPeople",
	async (_, { rejectWithValue }) => {
		try {
			const snapshot = await database().ref("/people").once("value");
			const data = snapshot.val();

			if (!data) {
				return rejectWithValue("Failed to fetch people");
			}

			return data;
		} catch (error) {
			return rejectWithValue("Error fetching people");
		}
	},
);

const peopleSlice = createSlice({
	name: "people",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(syncPeople.fulfilled, (state, action) => {
			const fetchedPeople = action.payload;

			// create a new state object to build from scratch
			const newState = { people: {} as PeopleState["people"] };

			for (const personId in fetchedPeople) {
				const fetchedPerson = fetchedPeople[personId];

				newState.people[personId] = {
					...fetchedPerson,
					payments: { ...fetchedPerson.payments },
				};
			}

			// replace the current state with the new state
			state.people = newState.people;
		});
	},
});

export default peopleSlice.reducer;
