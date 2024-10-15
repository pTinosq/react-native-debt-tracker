import React, { useState } from "react";
import {
	StyleSheet,
	Text,
	TouchableOpacity,
	Vibration,
	View,
} from "react-native";
import type { Payment } from "../../redux/slices/peopleSlice";
import { formatDate } from "../../utils/date-utils";
import { formatMoney } from "../../utils/payment-utils";
import database from "@react-native-firebase/database";

const styles = StyleSheet.create({
	container: {
		borderRadius: 8,
		width: "100%",
		position: "relative", // Add relative position to the container
	},
	contentContainer: {
		paddingVertical: 12,
		paddingHorizontal: 16,
		borderColor: "#dddddd",
		borderWidth: 2,
		borderRadius: 8,
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
	deleteOverlay: {
		position: "absolute",
		top: 0,
		left: 0,
		width: "100%",
		height: "100%",
		backgroundColor: "rgba(255, 0, 0, 0.7)",
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 8,
		zIndex: 1,
	},
	deleteOverlayText: {
		fontSize: 16,
		color: "#fff",
		fontWeight: "bold",
	},
});

interface PaymentCardProps {
	paymentData: Payment;
	onDelete: () => void;
}

export default function PaymentCard(props: PaymentCardProps) {
	const backgroundColor =
		props.paymentData.type === "lent" ? "#eaffea" : "#ffeaea";

	const [isDeleteMode, setIsDeleteMode] = useState(false);

	function handleOnPress() {
		if (isDeleteMode) {
			setIsDeleteMode(false);
		}
	}

	function handleOnHold() {
		Vibration.vibrate(30);

		if (isDeleteMode) {
			props.onDelete();
			setIsDeleteMode(false);
			return;
		}

		setIsDeleteMode(true);
	}

	return (
		<TouchableOpacity
			style={[styles.container]}
			onPress={handleOnPress}
			onLongPress={handleOnHold}
		>
			<View style={[styles.contentContainer, { backgroundColor }]}>
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
			</View>
			{isDeleteMode && (
				<View style={styles.deleteOverlay}>
					<Text style={styles.deleteOverlayText}>
						Tap to cancel | Hold to delete
					</Text>
				</View>
			)}
		</TouchableOpacity>
	);
}
