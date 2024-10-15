import React, { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import CreatePaymentCard from "../components/CreatePaymentCard";
import PersonCard from "../components/PersonCard";
import { type RootState, store } from "../redux/store";
import { calculateTotal } from "../utils/payment-utils";
import { syncPeople } from "../redux/slices/peopleSlice";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Icon from "react-native-vector-icons/Feather";
import database from "@react-native-firebase/database";

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
	hideZeroedButton: {
		backgroundColor: "#b7eeff",
		borderRadius: 999,
		padding: 16,
		position: "absolute",
		bottom: 16,
		left: 16,
		width: 64,
		height: 64,
	},
	footer: {
		backgroundColor: "#ffffff",
		paddingVertical: 16,
		paddingHorizontal: 24,
		borderTopColor: "#ddd",
		borderTopWidth: 1,
	},
	footerText: {
		textAlign: "center",
		fontSize: 16,
		fontWeight: "bold",
		color: "black",
	},
	footerAmount: {
		fontSize: 16,
		fontWeight: "bold",
		color: "#ce0c0c", // Red for owed to others
	},
	footerGreenAmount: {
		fontSize: 16,
		fontWeight: "bold",
		color: "#15ad1f", // Green for owed to you
	},
});

export default function Home() {
	const [hideZeroed, setHideZeroed] = useState(false);

	const people = useSelector((state: RootState) => state.people.people);

	useEffect(() => {
		store.dispatch(syncPeople());
	}, []);

	let filteredPeopleData = people;

	if (hideZeroed) {
		filteredPeopleData = Object.keys(people).reduce(
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
	}

	function handlePersonDelete(userId: string) {
		database().ref(`/people/${userId}`).remove();
		store.dispatch(syncPeople());
	}

	// Calculate total money owed to you and to others
	let totalOwedToYou = 0;
	let totalOwedToOthers = 0;

	for (const personId of Object.keys(people)) {
		const total = calculateTotal(people[personId].payments);
		if (total > 0) {
			totalOwedToYou += total;
		} else {
			totalOwedToOthers += Math.abs(total); // Since owed to others is negative
		}
	}

	return (
		<>
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
							<PersonCard
								key={personId}
								person={person}
								personId={personId}
								onDelete={() => handlePersonDelete(personId)}
							/>
						);
					})
				}
			</ScrollView>
			<View style={styles.footer}>
				<Text style={styles.footerText}>
					Money owed to you:{" "}
					<Text style={styles.footerGreenAmount}>
						£{(totalOwedToYou / 100).toFixed(2)}
					</Text>
				</Text>
				<Text style={styles.footerText}>
					Money owed to others:{" "}
					<Text style={styles.footerAmount}>
						£{(totalOwedToOthers / 100).toFixed(2)}
					</Text>
				</Text>
			</View>
			<TouchableOpacity
				onPress={() => {
					setHideZeroed(!hideZeroed);
				}}
				activeOpacity={0.6}
				style={styles.hideZeroedButton}
			>
				<Icon name={hideZeroed ? "eye-off" : "eye"} size={32} color={"black"} />
			</TouchableOpacity>
		</>
	);
}
