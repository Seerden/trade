import { StyledNewTicketHeader } from "./sub.style";

export default function Header() {
	const columns = "Action Ticker Price Quantity Date Time".split(" ");
	const columnMap = {
		Time: "Market Time",
	};

	return (
		<StyledNewTicketHeader>
			{columns.map((col, index) => (
				<label htmlFor={col.toLowerCase()} key={index}>
					{columnMap[col] ?? col}
				</label>
			))}
		</StyledNewTicketHeader>
	);
}
