"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import "aos/dist/aos.css";
import HackerText from "../HackerText";
import RepoModal from "@/components/RepoModal";

type GitHubRepo = {
	id: number;
	name: string;
	language: string;
	languages_url: string;
	html_url: string;
	owner: { login: string };
	created_at: string;
	updated_at: string;
};

type Language = {
	name: string;
	icon: string | null;
};

type BubbleData = GitHubRepo & {
	color: string;
	left: number;
	top: number;
	repoUrl: string;
	language: string | null;
	iconClass: string | null;
	spinDuration: number;
	spinDirection: "normal" | "reverse";
	allLanguages?: Language[];
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
	const [bubbles, setBubbles] = useState<BubbleData[]>([]);
	const [selectedRepo, setSelectedRepo] = useState<BubbleData | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const openModal = (repo: BubbleData) => {
		setSelectedRepo(repo);
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
		setSelectedRepo(null);
	};

	useEffect(() => {
		const isMobile = window.innerWidth < 768;
		const repoNum = isMobile ? 6 : 8;

		const fetchRepos = async () => {
			try {
				const res = await fetch("/api/github-repos");

				if (!res.ok) {
					console.error("GitHub API error:", res.status, await res.text());
					return;
				}

				const repos: GitHubRepo[] = await res.json();
				if (!Array.isArray(repos)) {
					console.error("Expected array from GitHub API, got:", repos);
					return;
				}

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

				const bubbleData: BubbleData[] = await Promise.all(
					selected.map(async (repo, index) => {
						let languages: Record<string, number> = {};
						try {
							const langRes = await fetch(repo.languages_url);
							languages = await langRes.json();
						} catch (err) {
							console.warn("Failed to fetch languages for", repo.name, err);
						}

						const allLangIcons = Object.keys(languages)
							.map((lang) => {
								const key = lang.toLowerCase();
								return {
									name: lang,
									icon: languageToDevicon[key] || null,
								};
							})
							.filter((lang) => lang.icon);

						const langKey = repo.language?.toLowerCase();

						return {
							...repo,
							color: shuffledColors[index % shuffledColors.length],
							left: Math.random() * 80,
							top: Math.random() * 80,
							repoUrl: repo.html_url,
							language: repo.language,
							iconClass:
								langKey && languageToDevicon[langKey]
									? languageToDevicon[langKey]
									: null,
							allLanguages: allLangIcons,
							spinDuration: 20 + Math.random() * 10,
							spinDirection: Math.random() > 0.5 ? "normal" : "reverse",
						};
					})
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

		const isDragging = Array(bubbleEls.length).fill(false);
		const dragOffset = Array(bubbleEls.length).fill({ x: 0, y: 0 });
		const lastMousePos = Array(bubbleEls.length).fill({ x: 0, y: 0 });
		const lastMoveTime = Array(bubbleEls.length).fill(0);
		const startPos = Array(bubbleEls.length).fill({ x: 0, y: 0 });

		bubbleEls.forEach((bubble, i) => {
			bubble.style.cursor = "grab";

			bubble.addEventListener("pointerdown", (e) => {
				e.preventDefault();
				isDragging[i] = true;
				const rect = bubble.getBoundingClientRect();
				// const containerRect = container.getBoundingClientRect();
				dragOffset[i] = { x: e.clientX - rect.left, y: e.clientY - rect.top };
				startPos[i] = { x: e.clientX, y: e.clientY };
				lastMousePos[i] = { x: e.clientX, y: e.clientY };
				lastMoveTime[i] = Date.now();
				bubble.setPointerCapture(e.pointerId);
				bubble.style.cursor = "grabbing";
			});

			bubble.addEventListener("pointermove", (e) => {
				if (!isDragging[i]) return;
				const containerRect = container.getBoundingClientRect();
				const x = e.clientX - containerRect.left - dragOffset[i].x;
				const y = e.clientY - containerRect.top - dragOffset[i].y;
				positions[i] = { x, y };
				bubble.style.left = `${x}px`;
				bubble.style.top = `${y}px`;

				const now = Date.now();
				const dt = now - lastMoveTime[i];
				if (dt > 0) {
					velocities[i].x = ((e.clientX - lastMousePos[i].x) / dt) * 10;
					velocities[i].y = ((e.clientY - lastMousePos[i].y) / dt) * 10;
					lastMousePos[i] = { x: e.clientX, y: e.clientY };
					lastMoveTime[i] = now;
				}
			});

			bubble.addEventListener("pointerup", (e) => {
				isDragging[i] = false;
				bubble.releasePointerCapture(e.pointerId);
				bubble.style.cursor = "grab";

				const distX = e.clientX - startPos[i].x;
				const distY = e.clientY - startPos[i].y;
				const dragDistance = Math.sqrt(distX * distX + distY * distY);

				if (dragDistance < 5) {
					openModal(bubbles[i]);
				}
			});
		});

		const animate = () => {
			const maxX = container.clientWidth;
			const maxY = container.clientHeight;
			const maxSpeed = 2;

			for (let i = 0; i < bubbleEls.length; i++) {
				if (isDragging[i]) continue;

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
				if (isDragging[i]) return;
				let newX = positions[i].x + velocities[i].x;
				let newY = positions[i].y + velocities[i].y;
				const maxBubbleX = maxX - bubble.clientWidth;
				const maxBubbleY = maxY - bubble.clientHeight;

				if (newX <= 0 || newX >= maxBubbleX) {
					velocities[i].x *= -0.95;
					newX = Math.max(0, Math.min(maxBubbleX, newX));
				}
				if (newY <= 0 || newY >= maxBubbleY) {
					velocities[i].y *= -0.95;
					newY = Math.max(0, Math.min(maxBubbleY, newY));
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
				{/* Background */}
				<div
					className={cn(
						"absolute inset-0",
						"[background-size:20px_20px]",
						"[background-image:radial-gradient(#d4d4d4_1px,transparent_1px)]",
						"dark:[background-image:radial-gradient(#404040_1px,transparent_1px)]"
					)}
				/>
				<div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_10%,black)] dark:bg-black" />
				<div className="pointer-events-none absolute top-0 left-0 w-full h-24 z-10 bg-gradient-to-b from-[rgba(0,0,0,0.5)] to-transparent dark:from-[rgba(0,0,0,0.7)]" />
				<div className="pointer-events-none absolute bottom-0 left-0 w-full h-24 z-10 bg-gradient-to-t from-[rgba(0,0,0,0.5)] to-transparent dark:from-[rgba(0,0,0,0.7)]" />

				{/* Central Label */}
				<div className="absolute inset-0 flex justify-center items-center -z-10">
					<i className="devicon-github-original text-4xl opacity-10 select-none" />
					&nbsp;
					<HackerText
						text="PROJECTS"
						className="text-4xl opacity-10"
						onHover={false}
						delay={10000}
					/>
					&nbsp;
					<i className="devicon-github-original text-4xl opacity-10 select-none" />
				</div>

				{/* Bubbles */}
				{bubbles.map((bubble, i) => (
					<div
						key={`${bubble.repoUrl}-${i}`}
						className={`bubble group absolute w-12 h-12 rounded-full ${bubble.color} flex items-center justify-center transition-shadow duration-300`}
						style={{
							left: `${bubble.left}%`,
							top: `${bubble.top}%`,
							animation: `spin ${bubble.spinDuration}s linear infinite`,
							animationDirection: bubble.spinDirection,
							touchAction: "none",
							cursor: "grab",
						}}
					>
						{bubble.iconClass && (
							<i className={`${bubble.iconClass} text-[1.8rem]`} />
						)}
					</div>
				))}

				<div
					ref={glowRef}
					className="absolute pointer-events-none bg-purple-400 rounded-full blur-[12px] opacity-0 z-20 transition-opacity duration-150"
					style={{ display: "none" }}
				/>
			</div>

			{isModalOpen && selectedRepo && (
				<RepoModal
					repo={selectedRepo}
					onClose={closeModal}
					colorClass={selectedRepo.color}
				/>
			)}

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
