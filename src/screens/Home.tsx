import React, { StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import CreatePaymentCard from "../components/CreatePaymentCard";
import PersonCard from "../components/PersonCard";
import { type RootState, store } from "../redux/store";
import { calculateTotal } from "../utils/payment-utils";
import { syncPeople } from "../redux/slices/peopleSlice";
import { useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import { useEffect } from "react";

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f3f3f3",
	},
	scrollView: {
		alignItems: "center",
		paddingHorizontal: 24,
		paddingVertical: 24,
		gap: 16,
	},
});

export default function Home() {
	const people = useSelector((state: RootState) => state.people.people);

	useEffect(() => {
		store.dispatch(syncPeople());
	}, []);

	const filteredPeopleData = Object.keys(people).reduce(
		(
			acc: { [key: string]: (typeof people)[keyof typeof people] },
			personId,
		) => {
			const person = people[personId];
			const total = calculateTotal(person.payments);

			if (total !== 0) {
				acc[personId] = person;
			}

			return acc;
		},
		{},
	);

	return (
		<ScrollView
			style={styles.container}
			contentContainerStyle={styles.scrollView}
		>
			<CreatePaymentCard />
			{
				// loop through each key and return {person, personid}
				Object.keys(filteredPeopleData).map((personId) => {
					const person = people[personId];
					return (
						<PersonCard key={personId} person={person} personId={personId} />
					);
				})
			}
		</ScrollView>
	);
}
