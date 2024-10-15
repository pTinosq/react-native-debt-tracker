import type { Person } from "../redux/slices/peopleSlice";

export function calculateTotal(payments?: Person["payments"]) {
	if (!payments) {
		return 0;
	}

	return Object.values(payments).reduce((total, payment) => {
		switch (payment.type) {
			case "borrowed":
				return total - payment.amount;
			case "lent":
				return total + payment.amount;
			default:
				return total;
		}
	}, 0);
}

export function formatMoney(amount: number) {
	const convertedAmount = amount / 100;

	return convertedAmount.toLocaleString("en-GB", {
		style: "currency",
		currency: "GBP",
	});
}
