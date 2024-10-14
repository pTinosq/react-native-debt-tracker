export function formatDate(dateString: string): string {
	const months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];

	const date = new Date(dateString);
	const day = date.getDate();
	const month = months[date.getMonth()];
	const year = date.getFullYear();

	const getDayWithSuffix = (day: number) => {
		if (day > 3 && day < 21) return `${day}th`;
		switch (day % 10) {
			case 1:
				return `${day}st`;
			case 2:
				return `${day}nd`;
			case 3:
				return `${day}rd`;
			default:
				return `${day}th`;
		}
	};

	const formattedDay = getDayWithSuffix(day);
	return `${formattedDay} ${month} ${year}`;
}
