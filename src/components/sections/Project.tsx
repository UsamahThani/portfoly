"use client";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
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
	// const glowSize = 60;

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

				const baseColors = [
					"bg-red-500/10 border border-red-500 border-opacity-50",
					"bg-blue-500/10 border border-blue-500 border-opacity-70",
					"bg-green-500/10 border border-green-500 border-opacity-70",
					"bg-yellow-400/10 border border-yellow-400 border-opacity-70",
					"bg-pink-500/10 border border-pink-500 border-opacity-70",
					"bg-purple-500/10 border border-purple-500 border-opacity-70",
					"bg-orange-500/10 border border-orange-500 border-opacity-70",
					"bg-cyan-500/10 border border-cyan-500 border-opacity-70",
				];

				const shuffledColors = baseColors.sort(() => 0.5 - Math.random());

				const bubbleData: BubbleData[] = selected.map(
					(repo: any, index: number) => {
						const lang = repo.language;
						const langKey = lang?.toLowerCase();
						return {
							color: shuffledColors[index % shuffledColors.length],
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
					}
				);

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
		// const glow = glowRef.current;
		const bubbleEls = Array.from(
			container.querySelectorAll(".bubble")
		) as HTMLElement[];

		const positions = bubbleEls.map((el) => ({
			x: el.offsetLeft,
			y: el.offsetTop,
		}));

		const velocities: Velocity[] = bubbleEls.map(() => ({
			x: (Math.random() - 0.5) * 2,
			y: (Math.random() - 0.5) * 2,
		}));

		const animate = () => {
			const maxX = container.clientWidth;
			const maxY = container.clientHeight;
			const maxSpeed = 2;

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
				} else if (newX >= maxBubbleX) {
					newX = maxBubbleX;
					velocities[i].x *= -0.95;
				}

				if (newY <= 0) {
					newY = 0;
					velocities[i].y *= -0.95;
				} else if (newY >= maxBubbleY) {
					newY = maxBubbleY;
					velocities[i].y *= -0.95;
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

				{/* Vignette */}
				<div className="pointer-events-none absolute top-0 left-0 w-full h-24 z-10 bg-gradient-to-b from-[rgba(0,0,0,0.5)] to-transparent dark:from-[rgba(0,0,0,0.7)]" />
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
						className={`bubble group absolute w-12 h-12 rounded-full ${bubble.color} flex items-center justify-center transition-shadow duration-300`}
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
					</a>
				))}

				{/* Glow (edge collision) - unused but preserved for structure */}
				<div
					ref={glowRef}
					className="absolute pointer-events-none bg-purple-400 rounded-full blur-[12px] opacity-0 z-20 transition-opacity duration-150"
					style={{ display: "none" }}
				></div>
			</div>

			{/* Styles */}
			<style jsx>{`
				@keyframes spin {
					from {
						transform: rotate(0deg);
					}
					to {
						transform: rotate(360deg);
					}
				}

				.bubble.border-red-500:hover {
					box-shadow: 0 0 12px 4px rgba(239, 68, 68, 0.5);
				}
				.bubble.border-blue-500:hover {
					box-shadow: 0 0 12px 4px rgba(59, 130, 246, 0.5);
				}
				.bubble.border-green-500:hover {
					box-shadow: 0 0 12px 4px rgba(34, 197, 94, 0.5);
				}
				.bubble.border-yellow-400:hover {
					box-shadow: 0 0 12px 4px rgba(250, 204, 21, 0.5);
				}
				.bubble.border-pink-500:hover {
					box-shadow: 0 0 12px 4px rgba(236, 72, 153, 0.5);
				}
				.bubble.border-purple-500:hover {
					box-shadow: 0 0 12px 4px rgba(168, 85, 247, 0.5);
				}
				.bubble.border-orange-500:hover {
					box-shadow: 0 0 12px 4px rgba(249, 115, 22, 0.5);
				}
				.bubble.border-cyan-500:hover {
					box-shadow: 0 0 12px 4px rgba(6, 182, 212, 0.5);
				}
			`}</style>
		</section>
	);
}
