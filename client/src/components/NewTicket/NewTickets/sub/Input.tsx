import { InputHTMLAttributes } from "react";
import { StyledInput } from "./sub.style";

export default function Input({
	$size,
	...inputProps
}: Partial<InputHTMLAttributes<HTMLInputElement> & { $size?: string }>) {
	return <StyledInput {...{ ...inputProps, $size }} />;
}
