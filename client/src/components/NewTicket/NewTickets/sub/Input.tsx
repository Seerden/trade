import React, { InputHTMLAttributes } from "react";
import { StyledInput } from "./sub.style";

type Props = Partial<
	InputHTMLAttributes<HTMLInputElement> & { $size?: string }
>;

export default function Input({ $size, ...inputProps }: Props) {
	return <StyledInput {...{ ...inputProps, $size }} />;
}

/**
 * RequiredInput is exactly the same as Input, except now required=true always
 *
 * @note declare type props: Props, where Props is also used to define Input
 * props. Using Parameters<typeof Input> doesn't work for some reason
 */
export function RequiredInput(props: Props) {
	return <Input {...props} required />;
}
