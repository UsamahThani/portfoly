"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function NothingHere() {
	const [countdown, setCountdown] = useState(5);
	const [gotcha, setGotcha] = useState(false);
	const [redirectCountdown, setRedirectCountdown] = useState(15);
	const router = useRouter();

	// First countdown (Rickroll countdown)
	useEffect(() => {
		if (!gotcha) {
			const interval = setInterval(() => {
				setCountdown((prev) => {
					if (prev <= 1) {
						clearInterval(interval);
						setGotcha(true);
					}
					return prev - 1;
				});
			}, 1000);
			return () => clearInterval(interval);
		}
	}, [gotcha]);

	// Second countdown (redirect after Gotcha)
	useEffect(() => {
		if (gotcha) {
			const interval = setInterval(() => {
				setRedirectCountdown((prev) => {
					if (prev <= 1) {
						clearInterval(interval);
					}
					return prev - 1;
				});
			}, 1000);
			return () => clearInterval(interval);
		}
	}, [gotcha]);

	// Perform redirect safely after render
	useEffect(() => {
		if (redirectCountdown === 0) {
			router.push("/");
		}
	}, [redirectCountdown, router]);

	return (
		<main className="min-h-screen flex flex-col items-center justify-center bg-black text-white font-mono text-center px-4 py-10">
			<h1 className="text-2xl md:text-4xl font-bold text-pink-400 animate-pulse mb-6">
				Whatever you're looking for... it's not here 😆
			</h1>
			<img
				src="https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif"
				alt="Funny Cat"
				className="w-40 md:w-52 hover:rotate-180 transition-transform duration-500"
			/>

			{!gotcha ? (
				<p className="mt-8 text-cyan-300 text-lg animate-bounce">
					Redirecting in {countdown}...
				</p>
			) : (
				<>
					<p className="mt-8 text-yellow-400 text-lg font-bold animate-pulse">
						Gotcha! 😜
					</p>
					<iframe
						className="mt-6 rounded-xl shadow-lg"
						width="300"
						height="200"
						src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
						title="Rickroll"
						allow="autoplay"
					/>
					<p className="mt-6 text-sm text-neutral-400">
						Redirecting back home in {redirectCountdown}s...
					</p>
				</>
			)}
		</main>
	);
}
