import styled from "styled-components";

export default function Header() {
	const columns = "Action Ticker Price Quantity Date Time".split(" ");
	const columnMap = {
		Time: "Market Time"
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
	grid-template-columns: repeat(4, 5rem) 10rem 5.5rem;
	gap: 0.45rem;

	label {
		user-select: none;
		text-align: center;
		font-size: 0.88rem;
		font-weight: 500;
		border-bottom: 2px solid #eee;
		padding-bottom: 0.25rem;
		margin-bottom: 0.3rem;
	}
`;
