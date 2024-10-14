import { NavigationContext } from "@react-navigation/native";
import { useContext } from "react";
import React, { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const styles = StyleSheet.create({
	card: {
		backgroundColor: "#ffffff",
		borderRadius: 8,
		padding: 16,
		width: "100%",
	},
	cardBody: {},
	title: {
		textAlign: "center",
		fontSize: 16,
		color: "#36990c",
		fontWeight: "bold",
	},
});

export default function index() {
	const navigation = useContext(NavigationContext);
	function handleCreatePaymentPress() {
		navigation?.navigate("CreatePayment");
	}

	return (
		<TouchableOpacity
			style={styles.card}
			activeOpacity={0.8}
			onPress={handleCreatePaymentPress}
		>
			<View style={styles.cardBody}>
				<Text style={styles.title}>Add payment</Text>
			</View>
		</TouchableOpacity>
	);
}
