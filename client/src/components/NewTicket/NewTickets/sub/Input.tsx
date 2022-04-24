import React, { InputHTMLAttributes } from "react";
import { StyledInput } from "./sub.style";

type Props = Partial<
	InputHTMLAttributes<HTMLInputElement> & { $size?: string }
>;

export default function Input({ $size, ...inputProps }: Props) {
	return <StyledInput {...{ ...inputProps, $size }} />;
}

/** RequiredInput is exactly the same as Input, except we set required=true. */
export function RequiredInput(...props: Parameters<typeof Input>) {
	return <Input {...props} required />;
}
