import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface ToggleButtonProps {
	text: string;
	active: boolean;
	onPress: () => void;
}

export default function ToggleButton({
	text,
	active,
	onPress,
}: ToggleButtonProps) {
	return (
		<TouchableOpacity
			style={[
				styles.toggleButton,
				active && styles.activeButton, // Apply active style when button is active
			]}
			onPress={onPress}
			activeOpacity={0.8}
		>
			<Text style={styles.toggleButtonText}>{text}</Text>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	toggleButton: {
		flex: 1,
		padding: 12,
		backgroundColor: "#f3f3f3",
		borderWidth: 2,
		borderColor: "#ddd",
		borderRadius: 8,
		marginHorizontal: 8,
	},
	toggleButtonText: {
		textAlign: "center",
		fontSize: 16,
		color: "#333",
	},
	activeButton: {
		backgroundColor: "#ddd", // Change color or style when the button is active
		borderColor: "#999", // Darker border for active state
	},
});
