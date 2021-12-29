import { InputHTMLAttributes, LabelHTMLAttributes, ReactChild } from "react";
import cs from "./NewTicket.module.scss";

const NewTicket = () => {
	return (
		<>
			<form className={cs.Form}>
				<h2 className={cs.Title}>New trade ticket</h2>
				<div className={cs.Fields}>
					<Field>
						<Label htmlFor="ticker">Ticker</Label>
						<TextInput name="ticker" />
					</Field>

					<Field>
						<Label htmlFor="action">Action</Label>
						<select className={cs.Select} name="action">
							<option value="buy">Buy</option>
							<option value="sell">Sell</option>
						</select>
					</Field>

					<Field>
						<Label htmlFor="price">Price</Label>
						<NumberInput name="price" min={0} step={0.01} />
					</Field>

					<Field>
						<Label htmlFor="quantity">Quantity</Label>
						<NumberInput name="quantity" min={1} step={1} />
					</Field>

					<Field>
						<Label htmlFor="datetime">Date and time</Label>
						<TextInput name="datetime" />
					</Field>
				</div>
			</form>
		</>
	);
};

export default NewTicket;

interface LabelArgs extends LabelHTMLAttributes<HTMLLabelElement> {
	children: ReactChild;
}

function Label({ children, ...labelProps }: LabelArgs) {
	return (
		<label {...labelProps} className={cs.Label}>
			{children}
		</label>
	);
}

function TextInput({ ...inputProps }: Partial<InputHTMLAttributes<HTMLInputElement>>) {
	return <input {...inputProps} type="text" className={cs.Input} />;
}

function NumberInput({ ...inputProps }: Partial<InputHTMLAttributes<HTMLInputElement>>) {
	return <input {...inputProps} type="number" className={cs.Input} />;
}

function Field({ children }) {
	return <div className={cs.Field}>{children}</div>;
}
