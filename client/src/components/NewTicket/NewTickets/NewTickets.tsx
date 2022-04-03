import { useMemo } from "react";
import styled, { css } from "styled-components";
import NewTicket from "./NewTicket";
import Header from "./sub/Header";
import { useNewTickets } from "./useNewTickets";

const StyledNewTickets = styled.form`
	display: block;
	margin: 0 auto;
	max-width: max-content;
	width: max-content;

	padding: 2rem 4rem;
	border-radius: 5px;
	box-shadow: 0 0 0.2rem 0 #ccc;
`;

const StyledTitle = styled.h1`
	display: block;
	width: max-content;
	font-size: 1.4rem;
	font-weight: 600;
	user-select: none;
	margin-bottom: 0.5rem;
`;

const StyledSubtitle = styled.h3`
	font-size: 0.9rem;
	word-wrap: break-word;
	color: #aaa;
	font-weight: 350;

	margin: 0 auto;

	max-width: 720px;
	margin-bottom: 0.8rem;
`;

const StyledTickets = styled.section`
	margin: 2.1rem 0;
`;

/**
   Form to create new tickets. Acts like one large form, but UX should feel like a Google
   Sheet. Implementation, as it stands, is more like just a form though.
   
   Form fields:
      - action:      buy/sell buttons
      - ticker:      text input
      - quantity:    number input (integers or fractionals)
      - datetime:    date:
                        date input
                     market time:
                        time input
      - price:       number input, 2-4 decimals, depending on current price value
*/
export default function NewTickets() {
	const { tickets, setAction, setField, addTicketRows, onSubmit } = useNewTickets();

	const ticketElements = useMemo(() => {
		return tickets.map((ticket, ticketIndex) => {
			const options = {
				ticketIndex,
				ticket,
				setAction,
				setField
			};
			return <NewTicket key={ticketIndex} {...options} />;
		});
	}, [tickets]);

	return (
		<>
			<StyledNewTickets onSubmit={onSubmit}>
				<StyledTitle>Add new trade tickets</StyledTitle>
				<StyledSubtitle>
					Each ticket describes one buy or sell transaction.
				</StyledSubtitle>
				<StyledTickets>
					<Buttons addTicketRows={addTicketRows} />
					<Header />
					{ticketElements}
				</StyledTickets>
			</StyledNewTickets>
		</>
	);
}

const StyledButtons = styled.span`
	margin-bottom: 0.8rem;
	display: block;
	position: sticky;
	z-index: 500;
	top: 1rem;
	flex-direction: row;

	gap: 0.4rem;
`;

const StyledButton = styled.input<{ round?: boolean }>`
	${p =>
		p.round
			? css`
					width: 25px;
					height: 25px;
					border-radius: 50%;
					justify-content: center;
					text-align: center;
					display: table-cell;
					vertical-align: middle;
			  `
			: css`
					width: max-content;
					padding: 0.3rem 1.6rem;
			  `}
	display: inline-flex;
	background-color: transparent;
	font-size: 0.72rem;

	border: 2px solid ${p => p.theme.colors.grey.light};

	transition: all 75ms ease-out;
	&:hover {
		box-shadow: 0 4px 0 -2px lightgrey;
		transform: translateY(-2px);
	}
`;

const StyledButtonWrapper = styled.span`
	display: flex;
	justify-content: space-between;

	span {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
	}
`;

function Buttons({ addTicketRows }: { addTicketRows: (_: number) => void }) {
	return (
		<StyledButtons>
			<StyledButtonWrapper>
				<span>
					<StyledButton type="submit" value="Save tickets" />
				</span>
				<span>
					<StyledButton
						round
						type="button"
						onClick={() => addTicketRows(3)}
						value="+"
						title="Add 3 rows"
					/>
					<StyledButton round type="button" value="x" title="Delete empty tickets" />
				</span>
			</StyledButtonWrapper>
		</StyledButtons>
	);
}
