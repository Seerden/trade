export const colors = {
	grey: {
		light: "#eee",
		regular: "#c0c0c0",
	},
	blue: {
		deep: "deepskyblue",
		regular: "#99daff",
	},
	text: {
		secondary: "#e3e3e3",
	},
	green: {
		primary: "forestgreen",
	},
};

export const size = {
	tiniest: "1px",
	tiny: "2px",
	small: "4px",
	large: "6px",
};

export const widePadding = {
	tiny: "0.2rem 0.5rem",
	small: "0.35rem 0.8rem",
	medium: "0.45rem 1.1rem",
	large: "0.7rem 1.45rem",
	larger: "1rem 1.9rem",
	huge: "1.5rem 2.5rem",
	section: "2rem 4rem",
	page: "2.5rem 5.5rem",
	button: {
		tiny: null,
		small: null,
	},
};

export const padding = {
	tiniest: "3px",
	tinier: "0.3rem",
	tiny: "0.5rem",
	small: "0.8rem",
	medium: "1.5rem",
	large: "2.5rem",
	wide: widePadding,
};

// Snippets that don't quite fall within existing definitions
widePadding.button.small = `${padding.tiny} ${padding.medium}`;
widePadding.button.tiny = `${padding.tinier} ${padding.medium}`;

export const font = {
	tiny: "0.75rem",
	smaller: "0.82rem",
	small: "0.88rem",
	medium: "0.92rem",
	regular: "0.95rem",
	large: "1.3rem",
	larger: "1.55rem",
	huge: "1.85rem",
};

export const theme = {
	colors,
	padding,
	size,
	font,
};
