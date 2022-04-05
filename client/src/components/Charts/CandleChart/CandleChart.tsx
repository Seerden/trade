import { useEffect, useRef } from "react";

export default function CandleChart(): JSX.Element {
	const canvasRef = useRef<HTMLCanvasElement>();

	/**
	 * On mount, grab data.
	 * This could also be passed from somewhere (as a prop), or be available as
	 * a piece of accessible (global) state.
	 */
	useEffect(() => {
		// fetch data
	}, []);

	useEffect(() => {
		const canvas = canvasRef.current;

		if (canvas) {
			const context = canvas?.getContext("2d");
			context.fillStyle = "#000000";
			context.fillRect(0, 0, context.canvas.width, context.canvas.height);
		}
	}, []);

	return <canvas ref={canvasRef} width={750} height={350} />;
}
