import styled from "styled-components";

export default function Header() {
	const columns = "action ticker price quantity date time".split(" ");

	return (
		<StyledHeader>
			{columns.map((col, index) => (
				<div key={index}>{col}</div>
			))}
		</StyledHeader>
	);
}

const StyledHeader = styled.div`
	display: grid;
	grid-template-columns: repeat(4, 5rem) 10rem 5.5rem;
	gap: 0;

	div {
		text-align: center;
		font-size: 0.82rem;
		border-bottom: 2px solid #eee;
		padding-bottom: 0.25rem;
		margin-bottom: 0.3rem;
	}
`;
