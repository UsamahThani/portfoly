"use client";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import AOS from "aos";
import "aos/dist/aos.css";
import HackerText from "../HackerText";

type BubbleData = {
	color: string;
	left: number;
	top: number;
	repoUrl: string;
	language: string | null;
	iconClass: string | null;
	spinDuration: number;
	spinDirection: "normal" | "reverse";
};

type Velocity = {
	x: number;
	y: number;
};

const languageToDevicon: Record<string, string> = {
	javascript: "devicon-javascript-plain colored",
	typescript: "devicon-typescript-plain colored",
	html: "devicon-html5-plain colored",
	css: "devicon-css3-plain colored",
	python: "devicon-python-plain colored",
	java: "devicon-java-plain colored",
	c: "devicon-c-plain colored",
	"c++": "devicon-cplusplus-plain colored",
	php: "devicon-php-plain colored",
	ruby: "devicon-ruby-plain colored",
	go: "devicon-go-plain colored",
	rust: "devicon-rust-plain colored",
	shell: "devicon-bash-plain colored",
	kotlin: "devicon-kotlin-plain colored",
	dart: "devicon-dart-plain colored",
	swift: "devicon-swift-plain colored",
	"jupyter notebook": "devicon-jupyter-plain colored",
};

export default function Project() {
	const containerRef = useRef<HTMLDivElement>(null);
	const glowRef = useRef<HTMLDivElement>(null);
	const bubbleSize = 48;
	const glowSize = 60;

	const [bubbles, setBubbles] = useState<BubbleData[]>([]);

	useEffect(() => {
		const isMobile = window.innerWidth < 768;
		const repoNum = isMobile ? 6 : 8;

		const fetchRepos = async () => {
			try {
				const res = await fetch(
					"https://api.github.com/users/UsamahThani/repos"
				);
				const repos = await res.json();

				const shuffled = repos.sort(() => 0.5 - Math.random());
				const selected = shuffled.slice(0, repoNum);

				const colors = [
					"bg-white/10 backdrop-blur-sm border border-white/20",
					"bg-purple-300/10 backdrop-blur-sm border border-purple-400/30",
					"bg-pink-300/10 backdrop-blur-sm border border-pink-400/30",
					"bg-cyan-300/10 backdrop-blur-sm border border-cyan-400/30",
					"bg-indigo-300/10 backdrop-blur-sm border border-indigo-400/30",
					"bg-sky-300/10 backdrop-blur-sm border border-sky-400/30",
				];

				const bubbleData: BubbleData[] = selected.map((repo: any) => {
					const lang = repo.language;
					const langKey = lang?.toLowerCase();
					return {
						color: colors[Math.floor(Math.random() * colors.length)],
						left: Math.random() * 80,
						top: Math.random() * 80,
						repoUrl: repo.html_url,
						language: lang,
						iconClass:
							langKey && languageToDevicon[langKey]
								? languageToDevicon[langKey]
								: null,
						spinDuration: 20 + Math.random() * 10,
						spinDirection: Math.random() > 0.5 ? "normal" : "reverse",
					};
				});

				setBubbles(bubbleData);
			} catch (err) {
				console.error("Failed to fetch repos", err);
			}
		};

		fetchRepos();
	}, []);

	useEffect(() => {
		if (!containerRef.current || bubbles.length === 0) return;

		const container = containerRef.current;
		const glow = glowRef.current;
		const bubbleEls = Array.from(
			container.querySelectorAll(".bubble")
		) as HTMLElement[];

		let positions = bubbleEls.map((el) => ({
			x: el.offsetLeft,
			y: el.offsetTop,
		}));

		let velocities: Velocity[] = bubbleEls.map(() => ({
			x: (Math.random() - 0.5) * 2,
			y: (Math.random() - 0.5) * 2,
		}));

		const showGlow = (
			side: "top" | "bottom" | "left" | "right",
			x: number,
			y: number
		) => {
			if (!glow) return;
			glow.style.display = "block";
			glow.style.opacity = "1";
			switch (side) {
				case "top":
					glow.style.top = `0px`;
					glow.style.left = `${x - glowSize / 2}px`;
					glow.style.width = `${glowSize}px`;
					glow.style.height = `6px`;
					break;
				case "bottom":
					glow.style.top = `calc(100% - 6px)`;
					glow.style.left = `${x - glowSize / 2}px`;
					glow.style.width = `${glowSize}px`;
					glow.style.height = `6px`;
					break;
				case "left":
					glow.style.left = `0px`;
					glow.style.top = `${y - glowSize / 2}px`;
					glow.style.width = `6px`;
					glow.style.height = `${glowSize}px`;
					break;
				case "right":
					glow.style.left = `calc(100% - 6px)`;
					glow.style.top = `${y - glowSize / 2}px`;
					glow.style.width = `6px`;
					glow.style.height = `${glowSize}px`;
					break;
			}
			setTimeout(() => {
				glow.style.opacity = "0";
				glow.style.display = "none";
			}, 150);
		};

		const animate = () => {
			const maxX = container.clientWidth;
			const maxY = container.clientHeight;
			const maxSpeed = 2.5;

			for (let i = 0; i < bubbleEls.length; i++) {
				for (let j = i + 1; j < bubbleEls.length; j++) {
					const dx = positions[j].x - positions[i].x;
					const dy = positions[j].y - positions[i].y;
					const dist = Math.sqrt(dx * dx + dy * dy);
					if (dist < bubbleSize) {
						const overlap = 0.5 * (bubbleSize - dist);
						const nx = dx / dist;
						const ny = dy / dist;
						positions[i].x -= overlap * nx;
						positions[i].y -= overlap * ny;
						positions[j].x += overlap * nx;
						positions[j].y += overlap * ny;

						const temp = velocities[i];
						velocities[i] = velocities[j];
						velocities[j] = temp;

						[bubbleEls[i], bubbleEls[j]].forEach((el) => {
							el.classList.add("ring-2", "ring-white/30");
							setTimeout(() => {
								el.classList.remove("ring-2", "ring-white/30");
							}, 2000);
						});
					}
				}
			}

			bubbleEls.forEach((bubble, i) => {
				let newX = positions[i].x + velocities[i].x;
				let newY = positions[i].y + velocities[i].y;

				const maxBubbleX = maxX - bubble.clientWidth;
				const maxBubbleY = maxY - bubble.clientHeight;

				if (newX <= 0) {
					newX = 0;
					velocities[i].x *= -0.95;
					showGlow("left", 0, newY + bubbleSize / 2);
				} else if (newX >= maxBubbleX) {
					newX = maxBubbleX;
					velocities[i].x *= -0.95;
					showGlow("right", maxBubbleX, newY + bubbleSize / 2);
				}

				if (newY <= 0) {
					newY = 0;
					velocities[i].y *= -0.95;
					showGlow("top", newX + bubbleSize / 2, 0);
				} else if (newY >= maxBubbleY) {
					newY = maxBubbleY;
					velocities[i].y *= -0.95;
					showGlow("bottom", newX + bubbleSize / 2, maxBubbleY);
				}

				velocities[i].x = Math.max(
					-maxSpeed,
					Math.min(maxSpeed, velocities[i].x)
				);
				velocities[i].y = Math.max(
					-maxSpeed,
					Math.min(maxSpeed, velocities[i].y)
				);

				positions[i].x = newX;
				positions[i].y = newY;

				bubble.style.left = `${newX}px`;
				bubble.style.top = `${newY}px`;
			});

			requestAnimationFrame(animate);
		};

		animate();
	}, [bubbles]);

	return (
		<section id="project" className="h-screen flex justify-center items-center">
			<div
				ref={containerRef}
				className="relative w-[90vw] h-[150vw] lg:w-[75rem] lg:h-[70vh] flex justify-center items-center overflow-hidden transition-shadow duration-150"
				data-aos="zoom-in"
			>
				{/* Dot Background */}
				<div
					className={cn(
						"absolute inset-0",
						"[background-size:20px_20px]",
						"[background-image:radial-gradient(#d4d4d4_1px,transparent_1px)]",
						"dark:[background-image:radial-gradient(#404040_1px,transparent_1px)]"
					)}
				/>
				<div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_10%,black)] dark:bg-black" />
				{/* Vignette Top */}
				<div className="pointer-events-none absolute top-0 left-0 w-full h-24 z-10 bg-gradient-to-b from-[rgba(0,0,0,0.5)] to-transparent dark:from-[rgba(0,0,0,0.7)]" />

				{/* Vignette Bottom */}
				<div className="pointer-events-none absolute bottom-0 left-0 w-full h-24 z-10 bg-gradient-to-t from-[rgba(0,0,0,0.5)] to-transparent dark:from-[rgba(0,0,0,0.7)]" />
				{/* Title */}
				<div className="absolute inset-0 flex justify-center items-center -z-10">
					<i className="devicon-github-original text-4xl opacity-10 select-none"></i>
					&nbsp;
					<HackerText
						text="PROJECTS"
						className="text-4xl opacity-10"
						onHover={false}
						delay={10000}
					/>
					&nbsp;
					<i className="devicon-github-original text-4xl opacity-10 select-none"></i>
				</div>

				{/* Bubbles */}
				{bubbles.map((bubble, i) => (
					<a
						key={i}
						href={bubble.repoUrl}
						target="_blank"
						rel="noopener noreferrer"
						className={`bubble absolute w-12 h-12 rounded-full ${bubble.color} flex items-center justify-center`}
						style={{
							left: `${bubble.left}%`,
							top: `${bubble.top}%`,
							animation: `spin ${bubble.spinDuration}s linear infinite`,
							animationDirection: bubble.spinDirection,
						}}
					>
						{bubble.iconClass && (
							<i className={`${bubble.iconClass} text-[1.8rem]`} />
						)}
						<div className="absolute inset-0 rounded-full bg-white opacity-0 scale-100 blur-xl transition-transform transition-opacity duration-300 ease-out group-hover:opacity-30 group-hover:scale-150 group-hover:ease-in -z-10" />
					</a>
				))}

				{/* Glow */}
				<div
					ref={glowRef}
					className="absolute pointer-events-none bg-purple-400 rounded-full blur-[12px] opacity-0 z-20 transition-opacity duration-150"
					style={{ display: "none" }}
				></div>
			</div>

			<style jsx>{`
				@keyframes spin {
					from {
						transform: rotate(0deg);
					}
					to {
						transform: rotate(360deg);
					}
				}
			`}</style>
		</section>
	);
}
