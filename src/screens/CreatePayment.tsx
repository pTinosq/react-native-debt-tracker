import { NavigationContext } from "@react-navigation/native";
import { useContext, useEffect, useState } from "react";
import {
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
	Alert,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import Space from "../components/Space";
import { store } from "../redux/store";
import ToggleButton from "../components/ToggleButton";
import uuid from "react-native-uuid";
import CurrencyInput from "react-native-currency-input";
import database from "@react-native-firebase/database";

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f3f3f3",
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
	button: {
		flex: 1,
		padding: 12,
		backgroundColor: "#f3f3f3",
		borderWidth: 2,
		borderColor: "#ddd",
		borderRadius: 8,
		marginHorizontal: 8,
	},
	buttonText: {
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
	},
	toggleContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
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
	dropdown: {
		height: 50,
		borderColor: "#ddd",
		borderWidth: 2,
		borderRadius: 8,
		paddingHorizontal: 8,
		backgroundColor: "#f3f3f3",
	},
	dropdownPlaceholder: {
		fontSize: 16,
		color: "#aaa",
	},
	dropdownSelectedText: {
		fontSize: 16,
		color: "#333",
	},
	textinput: {
		height: 50,
		borderColor: "#ddd",
		borderWidth: 2,
		borderRadius: 8,
		paddingHorizontal: 16,
		backgroundColor: "#f3f3f3",
		fontSize: 16,
		color: "#333",
		paddingVertical: 0,
	},
});

export default function CreatePayment() {
	const navigation = useContext(NavigationContext);
	const [personSelectType, setPersonSelectType] = useState<"new" | "existing">(
		"existing",
	);

	const [paymentType, setPaymentType] = useState<"lent" | "borrowed">("lent");
	const [description, setDescription] = useState<string>("");
	const [selectedPersonName, setSelectedPersonName] = useState<string | null>(
		null,
	);
	const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
	const [value, setValue] = useState(0);

	const people = store.getState().people.people;

	const peopleData = Object.keys(people).map((personId) => ({
		value: personId,
		label: people[personId].name,
	}));

	useEffect(() => {
		setSelectedPersonName(null);
		setSelectedPersonId(null);
	}, []);

	function handleCancel() {
		navigation?.goBack();
	}

	function validateForm() {
		if (!description) {
			Alert.alert("Error", "Please add a description for the payment.");
			return false;
		}

		if (!selectedPersonId) {
			Alert.alert("Error", "Please select or enter a person.");
			return false;
		}

		if (value === 0) {
			Alert.alert("Error", "Payment amount cannot be £0.");
			return false;
		}

		// Check if the person exists (check the lowercase, trimmed version of the name)
		const personExists = Object.values(people).find(
			(person) =>
				person.name.toLowerCase().trim() ===
				selectedPersonName?.toLowerCase().trim(),
		);

		if (personSelectType === "new" && personExists) {
			Alert.alert(
				"Error",
				"A person with this name already exists. Please select the existing person instead.",
			);
			return false;
		}

		return true;
	}

	function handleCreatePayment() {
		if (!validateForm()) {
			return;
		}

		const paymentId = uuid.v4().toString();
		const formattedAmount = value * 100; // converts 0.34 to 34 (example)

		// If existing person, update their payments
		// else use .set to create a new person
		if (personSelectType === "existing") {
			database()
				.ref(`/people/${selectedPersonId}/payments/${paymentId}`)
				.set(
					{
						amount: formattedAmount,
						date: new Date().toISOString(),
						description,
						type: paymentType,
					},
					() => {
						navigation?.goBack();
					},
				);
		} else {
			const personId = uuid.v4().toString();
			const personName = selectedPersonName;

			database()
				.ref(`/people/${personId}`)
				.set(
					{
						name: personName,
						payments: {
							[paymentId]: {
								amount: formattedAmount,
								date: new Date().toISOString(),
								description,
								type: paymentType,
							},
						},
					},
					() => {
						navigation?.goBack();
					},
				);
		}
	}

	function handleOnBlur() {
		const personId = uuid.v4().toString();
		const personName = selectedPersonName?.trim() || "";

		setSelectedPersonId(personId);
		setSelectedPersonName(personName);
	}

	function handleSelectPerson(personId: string, personName: string) {
		setSelectedPersonId(personId);
		setSelectedPersonName(personName);
	}

	return (
		<View style={styles.container}>
			<View style={styles.body}>
				<Text style={styles.title}>Create Payment</Text>
				<Text style={styles.subtitle}>Register a new payment</Text>
				<Space size={16} />
				<View style={styles.toggleContainer}>
					<ToggleButton
						active={personSelectType === "new"}
						onPress={() => setPersonSelectType("new")}
						text="New person"
					/>
					<ToggleButton
						active={personSelectType === "existing"}
						onPress={() => setPersonSelectType("existing")}
						text="Existing person"
					/>
				</View>
				<Space size={16} />
				{personSelectType === "existing" && (
					<Dropdown
						style={styles.dropdown}
						placeholderStyle={styles.dropdownPlaceholder}
						selectedTextStyle={styles.dropdownSelectedText}
						data={peopleData}
						labelField="label"
						valueField="value"
						placeholder="Select person"
						value={selectedPersonId} // Use person ID here to match with valueField
						onChange={(selectedPerson) => {
							handleSelectPerson(selectedPerson.value, selectedPerson.label);
						}}
						itemTextStyle={styles.dropdownSelectedText}
					/>
				)}

				{personSelectType === "new" && (
					<TextInput
						placeholder="Name"
						style={styles.textinput}
						placeholderTextColor={styles.dropdownPlaceholder.color}
						onBlur={handleOnBlur}
						onChangeText={(text) => setSelectedPersonName(text)}
						value={selectedPersonName ?? ""}
					/>
				)}
				<Space size={16} />

				<View style={styles.toggleContainer}>
					<ToggleButton
						active={paymentType === "lent"}
						onPress={() => setPaymentType("lent")}
						text="Lend to"
					/>
					<ToggleButton
						active={paymentType === "borrowed"}
						onPress={() => setPaymentType("borrowed")}
						text="Borrow from"
					/>
				</View>

				<Space size={16} />

				<CurrencyInput
					value={value}
					onChangeValue={(val) => setValue(val ?? 0)}
					style={styles.textinput}
					prefix="£"
					textAlign="center"
					separator="."
					precision={2}
					keyboardType="numeric"
				/>

				<Space size={16} />

				<Text style={styles.subtitle}>Description</Text>
				<Space size={4} />
				<TextInput
					placeholder="For uber..."
					style={styles.textinput}
					placeholderTextColor={styles.dropdownPlaceholder.color}
					onChangeText={(text) => setDescription(text)}
					textAlign="center"
				/>
			</View>
			<View style={styles.footer}>
				<TouchableOpacity
					style={styles.button}
					onPress={handleCancel}
					activeOpacity={0.8}
				>
					<Text style={styles.buttonText}>Cancel</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={styles.button}
					onPress={handleCreatePayment}
					activeOpacity={0.8}
				>
					<Text style={styles.buttonText}>Create Payment</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}
