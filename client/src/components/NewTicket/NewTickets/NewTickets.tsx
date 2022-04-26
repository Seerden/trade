import { useMemo } from "react";
import NewTicket from "./NewTicket";
import * as S from "./NewTickets.style";
import Buttons from "./sub/Buttons";
import Header from "./sub/Header";
import TicketSummary from "./TicketSummary";
import { useNewTickets } from "./useNewTickets";

/** Form that allows for creation of new trade tickets. */
export default function NewTickets() {
	const {
		tickets,
		validTickets,
		savedTickets,
		showSummary,
		setShowSummary,
		setAction,
		setField,
		onSubmit,
		deleteTicket,
		handlePreviewClick,
		handleAddClick,
	} = useNewTickets();

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
				<NewTicket key={`${ticketIndex}+${tickets.length}`} {...options} />
			);
		});
	}, [tickets]);

	return (
		<>
			<S.NewTickets onSubmit={onSubmit}>
				{/* Render TicketSummary inside the form, so that any submit buttons in 
                there trigger this form's onSubmit handler. An alternative would be 
                to give the form an id `formId`, and use form={formId} */}
				{showSummary && validTickets?.length > 0 && (
					<TicketSummary
						tickets={validTickets}
						savedTickets={savedTickets}
						onClose={() => {
							setShowSummary(false);
						}}
					/>
				)}
				<S.NewTicketsTitle>Add new trade tickets</S.NewTicketsTitle>
				<S.NewTicketsSubtitle>
					Each ticket describes one buy or sell transaction.
				</S.NewTicketsSubtitle>
				<S.Tickets>
					<Buttons
						{...{
							handleAddClick,
							handlePreviewClick,
							previewButtonDisabled: !validTickets?.length,
						}}
					/>
					<Header />
					{ticketElements}
				</S.Tickets>
			</S.NewTickets>
		</>
	);
}
