import { NavigationContext } from "@react-navigation/native";
import React, { useContext, useState } from "react";
import {
	StyleSheet,
	Text,
	TouchableOpacity,
	Vibration,
	View,
} from "react-native";
import type { Person } from "../../redux/slices/peopleSlice";
import { calculateTotal, formatMoney } from "../../utils/payment-utils";

const styles = StyleSheet.create({
	card: {
		borderRadius: 8,
		width: "100%",
		position: "relative", // Add relative position for delete overlay
	},
	contentContainer: {
		backgroundColor: "#ffffff",
		borderRadius: 8,
		padding: 12,
		borderColor: "#dddddd",
		borderWidth: 1,
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

interface PersonCardProps {
	person: Person;
	personId: string;
	onDelete: () => void; // Add onDelete prop to handle deletion
}

export default function PersonCard(props: PersonCardProps) {
	const navigation = useContext(NavigationContext);
	const total = calculateTotal(props.person.payments);
	const totalFormatted = formatMoney(total);

	const totalStyle = total > 0 ? styles.green : styles.red;
	const [isDeleteMode, setIsDeleteMode] = useState(false); // State for delete mode

	function handleOnPress() {
		if (isDeleteMode) {
			setIsDeleteMode(false);
			return;
		}
		navigation?.navigate("Person", {
			userId: props.personId,
		});
	}

	function handleOnHold() {
		Vibration.vibrate(30);
		if (isDeleteMode) {
			props.onDelete(); // Call onDelete if delete mode is active
			setIsDeleteMode(false);
			return;
		}
		setIsDeleteMode(true);
	}

	return (
		<TouchableOpacity
			style={styles.card}
			activeOpacity={0.8}
			onPress={handleOnPress}
			onLongPress={handleOnHold}
		>
			<View style={styles.contentContainer}>
				<View style={styles.cardHeader}>
					<Text style={styles.title}>{props.person.name}</Text>
					<Text style={[styles.totalMoney, totalStyle]}>{totalFormatted}</Text>
				</View>
				<View style={styles.cardBody}>
					<Text style={styles.bodyText}>
						From {Object.keys(props.person.payments).length} payments
					</Text>
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
