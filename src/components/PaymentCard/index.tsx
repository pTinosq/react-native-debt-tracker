import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { Payment } from "../../redux/slices/peopleSlice";
import { formatDate } from "../../utils/date-utils";
import { formatMoney } from "../../utils/payment-utils";

const styles = StyleSheet.create({
	container: {
		borderRadius: 8,
		paddingVertical: 12,
		paddingHorizontal: 16,
		width: "100%",
		borderColor: "#dddddd",
		borderWidth: 2,
	},
	cardHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	cardBody: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "baseline",
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
		color: "#111",
		fontStyle: "italic",
	},
	green: {
		color: "#099412",
	},
	red: {
		color: "#ce0c0c",
	},
	dateText: {
		fontSize: 12,
		color: "#333",
	},
});

interface PaymentCardProps {
	paymentData: Payment;
}

export default function PaymentCard(props: PaymentCardProps) {
	const backgroundColor =
		props.paymentData.type === "lent" ? "#eaffea" : "#ffeaea";

	function handleOnPress() {
		// TODO: Do something?
	}

	return (
		<TouchableOpacity
			style={[styles.container, { backgroundColor }]}
			onPress={handleOnPress}
		>
			<View style={styles.cardHeader}>
				<Text style={styles.dateText}>
					{formatDate(props.paymentData.date)}
				</Text>
				<Text
					style={[
						styles.totalMoney,
						props.paymentData.type === "lent" ? styles.green : styles.red,
					]}
				>
					{formatMoney(props.paymentData.amount)}
				</Text>
			</View>
			<View style={styles.cardBody}>
				<Text style={styles.title}>{props.paymentData.description}</Text>
				<Text style={styles.bodyText}>{props.paymentData.type}</Text>
			</View>
		</TouchableOpacity>
	);
}
