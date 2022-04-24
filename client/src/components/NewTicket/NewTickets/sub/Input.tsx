import React, { InputHTMLAttributes } from "react";
import { StyledInput } from "./sub.style";

type Props = Partial<
	InputHTMLAttributes<HTMLInputElement> & { $size?: string }
>;

export default function Input({ $size, ...inputProps }: Props) {
	return <StyledInput {...{ ...inputProps, $size }} />;
}
