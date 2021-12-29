/* allow user to create/import multiple tickets at once */

import { InputHTMLAttributes, useEffect, useMemo, useState } from "react";
import cs from "./NewTickets.module.scss";

const fields = "ticker action price quantity datetime".split(" ");
const fieldToLabel = {
	datetime: "Date and time",
};

const fieldLabelElements = fields.map((field) => {
	const labelText =
		field in fieldToLabel ? fieldToLabel[field] : field[0].toUpperCase() + field.slice(1);
	return (
		<label className={cs.Label} htmlFor={field} key={field}>
			{labelText}
		</label>
	);
});

const fieldToInputProps: { [k: string]: InputHTMLAttributes<HTMLInputElement> } = {
	ticker: {
		type: "text",
	},
	action: {
		type: "text",
	},
	price: {
		type: "number",
		step: 0.01,
		min: 0,
	},
	quantity: {
		type: "number",
		step: 1,
		min: 1,
	},
	datetime: {
		type: "text",
	},
};

function makeInputElements(ticketIndex: number) {
	/*  
        @todo insert change handlers 
        we need ticketIndex for this, so that each field is properly assigned to the correct ticket
    */
	return fields.map((field) => (
		<input key={field} className={cs.Input} {...fieldToInputProps[field]} name={field} />
	));
}

export function NewTickets() {
	const [ticketCount, setTicketCount] = useState<number>(5);

	useEffect(() => {
		console.log(ticketCount);
	}, [ticketCount]);

	const ticketRows = useMemo(
		() =>
			Object.keys([...Array(ticketCount)]).map((index) => (
				<div className={cs.InputRow} key={index}>
					{makeInputElements(+index)}
				</div>
			)),
		[ticketCount]
	);

	return (
		<div className={cs.Table}>
			<div className={cs.Labels}>{fieldLabelElements}</div>
			{ticketRows}
			<button className={cs.Button} onClick={() => setTicketCount((count) => count + 5)}>
				Add more rows
			</button>
		</div>
	);
}
