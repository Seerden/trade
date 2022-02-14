import { StyledField, StyledInput, StyledLabel } from "./NewTicket.style";

type FieldProps = {
    htmlFor: string;
    label: string;
    inputProps?: Partial<React.InputHTMLAttributes<HTMLInputElement>>;
};

export function Field({ htmlFor, label, inputProps }: FieldProps) {
    return (
        <StyledField>
            <StyledLabel htmlFor={htmlFor}>{label}</StyledLabel>
            <StyledInput {...{ ...inputProps, name: htmlFor }} />
        </StyledField>
    );
}
