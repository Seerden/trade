import styled from "styled-components";

export default function Header() {
	const columns = "Action Ticker Price Quantity Date Time".split(" ");

	return (
		<StyledHeader>
			{columns.map((col, index) => (
				<label htmlFor={col.toLowerCase()} key={index}>
					{col}
				</label>
			))}
		</StyledHeader>
	);
}

const StyledHeader = styled.div`
	display: grid;
	grid-template-columns: repeat(4, 5rem) 10rem 5.5rem;
	gap: 0;

	label {
		user-select: none;
		text-align: center;
		font-size: 0.82rem;
		border-bottom: 2px solid #eee;
		padding-bottom: 0.25rem;
		margin-bottom: 0.3rem;
	}
`;
