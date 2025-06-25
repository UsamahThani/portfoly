"use client";

import { useRef } from "react";

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

type HackerTextProps = {
	text: string;
	className?: string;
};

export default function HackerText({
	text,
	className = "text-white text-2xl",
}: HackerTextProps) {
	const spanRef = useRef<HTMLSpanElement | null>(null);
	let interval: NodeJS.Timeout;

	const handleMouseOver = () => {
		let iteration = 0;

		const el = spanRef.current;
		if (!el) return;

		clearInterval(interval);

		interval = setInterval(() => {
			const originalText = text;
			const newText = originalText
				.split("")
				.map((_, index) => {
					if (index < iteration) {
						return originalText[index];
					}
					return letters[Math.floor(Math.random() * 26)];
				})
				.join("");

			el.textContent = newText;

			if (iteration >= originalText.length) {
				clearInterval(interval);
			}

			iteration += 1 / 3;
		}, 30);
	};

	return (
		<span ref={spanRef} onMouseOver={handleMouseOver} className={className}>
			{text}
		</span>
	);
}
