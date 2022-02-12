import { StyledButton, StyledInput } from "./NewTicket.style";
import { useNewTicket } from "./useNewTicket";

export function Button({
    children,
    hasBorder = false,
    ...buttonProps
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    hasBorder?: boolean;
}): JSX.Element {
    const { name, onClick } = buttonProps;
    return (
        <StyledButton
            hasBorder={hasBorder}
            onClick={(e) => {
                e.preventDefault();
                onClick?.(e);
            }}
            name={name}
        >
            {children}
        </StyledButton>
    );
}

export function Input({
    children,
    ...inputProps
}: React.InputHTMLAttributes<HTMLInputElement>) {
    const [handleChange] = useNewTicket();
    return (
        <StyledInput
            {...inputProps}
            onChange={(e) => {
                inputProps.onChange?.(e);
                handleChange(e);
            }}
        />
    );
}
