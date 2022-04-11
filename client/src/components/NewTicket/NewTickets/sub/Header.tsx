import styled from "styled-components";

export default function Header() {
	const columns = "Action Ticker Price Quantity Date Time".split(" ");
	const columnMap = {
		Time: "Market Time",
	};

	return (
		<StyledHeader>
			{columns.map((col, index) => (
				<label htmlFor={col.toLowerCase()} key={index}>
					{columnMap[col] ?? col}
				</label>
			))}
		</StyledHeader>
	);
}

const StyledHeader = styled.div`
	display: grid;
	// TODO: these column widths and gap size follow those from the NewTicket
	// component (specifically, the StyledInput in there). Should combine those
	// styles with these here so that they're always in sync. Would also make it
	// easier to manage a responsive version of this component.
	grid-template-columns: repeat(4, 5rem) 9rem 6.5rem;
	gap: ${({ theme }) => theme.padding.tiny};

	label {
		user-select: none;
		text-align: center;
		font-size: 0.88rem;
		font-weight: 500;
		border-bottom: 2px solid #eee;
		padding-bottom: ${(p) => p.theme.padding.tinier};
		margin-bottom: ${(p) => p.theme.padding.tinier};
	}
`;
