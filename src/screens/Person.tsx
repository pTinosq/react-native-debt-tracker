import {
	NavigationContext,
	type RouteProp,
	useRoute,
} from "@react-navigation/native";
import { useContext, useMemo } from "react";
import {
	FlatList,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import type { RootStackParamList } from "../App";
import PaymentCard from "../components/PaymentCard";
import Space from "../components/Space";
import { type RootState, store } from "../redux/store";
import { calculateTotal, formatMoney } from "../utils/payment-utils";
import database from "@react-native-firebase/database";
import { syncPeople } from "../redux/slices/peopleSlice";
import { useSelector } from "react-redux";

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		justifyContent: "flex-end",
		padding: 16,
	},
	footer: {
		flexDirection: "row",
		justifyContent: "space-between",
		width: "100%",
	},
	body: {
		flex: 1,
	},
	backButton: {
		flex: 1,
		padding: 12,
		backgroundColor: "#f3f3f3",
		borderRadius: 8,
		borderWidth: 2,
		borderColor: "#ddd",
	},
	backButtonText: {
		textAlign: "center",
		fontSize: 16,
		color: "#333",
	},
	title: {
		fontSize: 24,
		textAlign: "center",
		fontWeight: "bold",
		color: "#333",
	},
	subtitle: {
		fontSize: 16,
		textAlign: "center",
		color: "#666",
		fontWeight: "bold",
	},
	green: {
		color: "#15ad1f",
	},
	red: {
		color: "#ce0c0c",
	},
});

type PersonScreenRouteProp = RouteProp<RootStackParamList, "Person">;

export default function Person() {
	const route = useRoute<PersonScreenRouteProp>();
	const navigation = useContext(NavigationContext);

	const { userId } = route.params;

	const people = useSelector((state: RootState) => state.people.people);

	const data = people[userId];

	const total = calculateTotal(data?.payments);

	if (!data || data === undefined) {
		navigation?.goBack();
		return null;
	}

	function handleCancel() {
		navigation?.goBack();
	}

	// Memoize the sorted payments to avoid recalculating on every render
	const sortedPayments = useMemo(() => {
		return Object.entries(data.payments)
			.map(([key, payment]) => ({ ...payment, key }))
			.sort((a, b) => {
				const dateA = new Date(a.date);
				const dateB = new Date(b.date);
				return dateA.getTime() - dateB.getTime();
			})
			.reverse();
	}, [data.payments]);

	function handlePaymentDelete(paymentId: string) {
		database().ref(`/people/${userId}/payments/${paymentId}`).remove();
		store.dispatch(syncPeople());
	}

	return (
		<View style={styles.container}>
			<View style={styles.body}>
				<Text style={styles.title}>{data.name}</Text>
				<Text style={[styles.subtitle, total > 0 ? styles.green : styles.red]}>
					{total > 0 ? `${data.name} owes you` : `You owe ${data.name}`}{" "}
					{formatMoney(Math.abs(total))}
				</Text>
				<Space size={16} />
				<FlatList
					data={sortedPayments}
					renderItem={({ item }) => (
						<PaymentCard
							paymentData={item}
							onDelete={() => handlePaymentDelete(item.key)}
						/>
					)}
					keyExtractor={(item) => item.key}
					initialNumToRender={10} // Number of items to render initially
					maxToRenderPerBatch={5} // Number of items to render per batch
					windowSize={10} // Number of items to render outside the visible area
					contentContainerStyle={{ gap: 8 }}
				/>
			</View>
			<View style={styles.footer}>
				<TouchableOpacity
					style={styles.backButton}
					onPress={handleCancel}
					activeOpacity={0.8}
				>
					<Text style={styles.backButtonText}>Return to home</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}
