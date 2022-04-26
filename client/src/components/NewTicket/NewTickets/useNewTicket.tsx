import { useCallback, useEffect, useMemo, useState } from "react";
import { RawNewTicket } from "./NewTicket";

export function useNewTicket(ticket: Partial<RawNewTicket>) {
	const [isHovering, setIsHovering] = useState<boolean>(false);
	const [isFocused, setIsFocused] = useState<boolean>(false);
	const [shouldShowDelete, setShouldShowDelete] = useState<boolean>(false);

	useEffect(() => {
		console.log({ shouldShowDelete });
	}, [shouldShowDelete]);

	// TODO: combine showDelete and hideDelete into one function
	const showDelete = () => setShouldShowDelete(true);
	const hideDelete = () => setShouldShowDelete(false);

	const hasFilledInFields = useMemo(() => {
		return "price ticker quantity action"
			.split(" ")
			.some(
				(field) =>
					field in ticket &&
					ticket[field] !== undefined &&
					ticket[field]?.length
			);
	}, [ticket]);

	const isRequired = useMemo(() => {
		return !!(hasFilledInFields || isHovering || isFocused);
	}, [hasFilledInFields, isHovering, isFocused]);

	/**
	 * Returns placeholder value if the field is `required` (a field becomes required
	 * when either the ticket has at least one filled-in field, or when it or one
	 * of its containing fields is active or being hovered.)
	 */
	const getPlaceholder = useCallback(
		(placeholder: string) => {
			return isRequired ? placeholder : null;
		},
		[isRequired]
	);

	const handleMouseEnter = () => {
		showDelete();
		setIsHovering(true);
	};

	const handleFocus = (e) => {
		showDelete();
		setIsFocused(true);
	};

	const handleBlur = (e) => {
		hideDelete();
		setIsFocused(false);
	};

	const handleMouseLeave = () => {
		setIsHovering(false);
		if (!isFocused) {
			hideDelete();
		}
	};

	const eventHandlers = {
		onBlur: handleBlur,
		onMouseEnter: handleMouseEnter,
		onMouseLeave: handleMouseLeave,
		onFocus: handleFocus,
	};

	return {
		isRequired,
		getPlaceholder,
		showDelete,
		hideDelete,
		eventHandlers,
		shouldShowDelete,
	} as const;
}
