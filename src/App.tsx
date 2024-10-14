import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import type React from "react";
import "react-native-gesture-handler";
import CreatePayment from "./screens/CreatePayment";
import Home from "./screens/Home";
import Person from "./screens/Person";
import { store } from "./redux/store";
import { Provider } from "react-redux";

const Stack = createStackNavigator();

export type RootStackParamList = {
	Home: undefined;
	Person: { userId: string };
};

function App(): React.JSX.Element {
	return (
		<Provider store={store}>
			<NavigationContainer>
				<Stack.Navigator
					initialRouteName="Home"
					screenOptions={{
						headerShown: false,
					}}
				>
					<Stack.Screen name="Home" component={Home} />
					<Stack.Screen name="Person" component={Person} />
					<Stack.Screen name="CreatePayment" component={CreatePayment} />
				</Stack.Navigator>
			</NavigationContainer>
		</Provider>
	);
}

export default App;
