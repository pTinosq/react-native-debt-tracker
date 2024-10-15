import { NavigationContext } from "@react-navigation/native";
import { useContext } from "react";
import React, { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { Person } from "../../redux/slices/peopleSlice";
import { calculateTotal, formatMoney } from "../../utils/payment-utils";

const styles = StyleSheet.create({
	card: {
		backgroundColor: "#ffffff",
		borderRadius: 8,
		padding: 16,
		width: "100%",
	},
	cardHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	cardBody: {
		paddingTop: 8,
	},
	title: {
		fontSize: 16,
		color: "black",
	},
	totalMoney: {
		fontSize: 16,
		color: "black",
		fontWeight: "bold",
	},
	bodyText: {
		fontSize: 12,
		color: "#999",
	},
	green: {
		color: "#15ad1f",
	},
	red: {
		color: "#ce0c0c",
	},
});

interface PersonCardProps {
	person: Person;
	personId: string;
}

export default function index(props: PersonCardProps) {
	const navigation = useContext(NavigationContext);

	const total = calculateTotal(props.person.payments);
	const totalFormatted = formatMoney(total);

	const totalStyle = total > 0 ? styles.green : styles.red;
	return (
		<TouchableOpacity
			style={styles.card}
			activeOpacity={0.5}
			onPress={() => {
				navigation?.navigate("Person", {
					userId: props.personId,
				});
			}}
		>
			<View style={styles.cardHeader}>
				<Text style={styles.title}>{props.person.name}</Text>
				<Text style={[styles.totalMoney, totalStyle]}>{totalFormatted}</Text>
			</View>
			<View style={styles.cardBody}>
				<Text style={styles.bodyText}>
					From {Object.keys(props.person.payments).length} payments
				</Text>
			</View>
		</TouchableOpacity>
	);
}
