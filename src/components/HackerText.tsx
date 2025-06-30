"use client";

import { useEffect, useRef } from "react";

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

type HackerTextProps = {
	text: string;
	className?: string;
	onHover?: boolean;
	delay?: number; // time between loops in ms
};

export default function HackerText({
	text,
	className = "text-white text-2xl",
	onHover = true,
	delay = 1000,
}: HackerTextProps) {
	const spanRef = useRef<HTMLSpanElement | null>(null);
	const intervalRef = useRef<NodeJS.Timeout | null>(null);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	const startEffect = () => {
		let iteration = 0;
		const el = spanRef.current;
		if (!el) return;

		const originalText = text;
		clearInterval(intervalRef.current!);

		intervalRef.current = setInterval(() => {
			const newText = originalText
				.split("")
				.map((char, index) => {
					if (index < iteration) {
						return originalText[index];
					}
					return letters[Math.floor(Math.random() * 26)];
				})
				.join("");

			el.textContent = newText;

			if (iteration >= originalText.length) {
				clearInterval(intervalRef.current!);

				// Wait for `delay` ms before starting again
				if (!onHover) {
					timeoutRef.current = setTimeout(() => {
						startEffect();
					}, delay);
				}
			}

			iteration += 1 / 3;
		}, 30);
	};

	useEffect(() => {
		if (!onHover) {
			// Start immediately
			startEffect();

			return () => {
				clearTimeout(timeoutRef.current!);
				clearInterval(intervalRef.current!);
			};
		}
	}, [onHover, delay, text]);

	return (
		<span
			ref={spanRef}
			onMouseOver={onHover ? startEffect : undefined}
			className={className}
		>
			{text}
		</span>
	);
}
