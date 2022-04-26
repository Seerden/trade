import { MouseEvent } from "react";
import * as S from "../NewTickets.style";

type ButtonProps = {
	handleAddClick: (e: MouseEvent<HTMLInputElement>, _: number) => void;
	handlePreviewClick: (e: MouseEvent<HTMLInputElement>) => void;
	previewButtonDisabled?: boolean;
};

export default function Buttons({
	handleAddClick,
	handlePreviewClick,
	previewButtonDisabled,
}: ButtonProps) {
	return (
		<S.NewTicketsButtons>
			<S.NewTicketsButtonBar>
				<span>
					{/*   TODO: should become a button with on-hover effect: start as green 
                     button with arrow, slide text into it on hover */}
					<S.NewTicketsButton
						type="button"
						value="Save tickets"
						disabled={previewButtonDisabled}
						onClick={handlePreviewClick}
					/>
				</span>
				<span>
					<S.NewTicketsButton
						round
						type="button"
						onClick={(e) => handleAddClick(e, 3)}
						value="+"
						title="Add 3 rows"
					/>
					{/* TODO: this button is nonfuctional currently. */}
					<S.NewTicketsButton
						round
						type="button"
						value="x"
						title="Delete empty tickets"
					/>
				</span>
			</S.NewTicketsButtonBar>
		</S.NewTicketsButtons>
	);
}
