import { useMemo, useState } from "react";
import NewTicket from "./NewTicket";
import {
	StyledButton,
	StyledButtons,
	StyledButtonWrapper,
	StyledNewTickets,
	StyledSubtitle,
	StyledTickets,
	StyledTitle,
} from "./NewTickets.style";
import SavedTickets from "./SavedTickets";
import Header from "./sub/Header";
import TicketsPreview from "./TicketsPreview";
import { useNewTickets } from "./useNewTickets";

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
	const {
		tickets,
		setAction,
		setField,
		addTicketRows,
		onSubmit,
		validTickets,
		deleteTicket,
		savedTickets,
	} = useNewTickets();

	// TODO: ticket preview step - state should be moved to useNewTickets once
	// done
	const [showPreview, setShowPreview] = useState<boolean>(false);

	const ticketElements = useMemo(() => {
		return tickets.map((ticket, ticketIndex) => {
			const options = {
				ticketIndex,
				ticket,
				setAction,
				setField,
				deleteTicket,
			};
			return (
				<NewTicket key={`${ticketIndex}+${tickets?.length}`} {...options} />
			);
		});
	}, [tickets]);

	if (savedTickets?.length) {
		return <SavedTickets tickets={savedTickets} />;
	}

	/**
	 * @todo: instead of displaying either TicketsPreview or StyledNewTickets,
	 * display TicketsPreview as a modal on top of StyledNewTickets.
	 *
	 * @todo: do not write functionality inside onSubmit. Instead, the submit
	 * should be part of the TicketsPreview, and the 'save tickets' button should
	 * have type='button' instead of 'submit' in the case that we want to pull up
	 * the TicketPreview. Making this change also fixes bug "form submission canceled, form not
	 * connected" bug.
	 */
	return (
		<>
			{showPreview ? (
				<TicketsPreview tickets={validTickets} />
			) : (
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
			)}
		</>
	);
}

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
					<StyledButton
						round
						type="button"
						value="x"
						title="Delete empty tickets"
					/>
				</span>
			</StyledButtonWrapper>
		</StyledButtons>
	);
}
