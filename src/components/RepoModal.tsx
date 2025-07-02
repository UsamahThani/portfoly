"use client";

import { Meteors } from "@/components/ui/meteors";
import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import rehypeExternalLinks from "rehype-external-links";
import "highlight.js/styles/atom-one-dark.css";

type RepoData = {
	name: string;
	repoUrl: string;
	owner: { login: string };
	created_at: string;
	updated_at: string;
	allLanguages?: { name: string; icon: string | null }[];
	readme?: string; // NEW: Custom README string
};

type RepoModalProps = {
	repo: RepoData | null;
	onClose: () => void;
	colorClass?: string;
};

export default function RepoModal({
	repo,
	onClose,
	colorClass,
}: RepoModalProps) {
	const [readme, setReadme] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<boolean>(false);
	const [showCreatedDate, setShowCreatedDate] = useState(false);
	const [showUpdatedDate, setShowUpdatedDate] = useState(false);

	useEffect(() => {
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = "auto";
		};
	}, []);

	useEffect(() => {
		if (!repo) return;

		// ✅ If direct README string exists (custom inline)
		if (repo.readme) {
			setReadme(repo.readme);
			return;
		}

		// ✅ If local file path is provided (custom file-based)
		if ((repo as any).readmePath) {
			const loadMarkdown = async () => {
				setLoading(true);
				try {
					const res = await fetch((repo as any).readmePath);
					if (!res.ok) throw new Error("Failed to load markdown");
					const md = await res.text();
					setReadme(md);
				} catch (err) {
					console.error("Error loading local markdown:", err);
					setError(true);
					setReadme(null);
				} finally {
					setLoading(false);
				}
			};
			loadMarkdown();
			return;
		}

		// ✅ Fallback: fetch README from GitHub (default behavior)
		if (!repo.owner?.login || !repo.name) return;

		const fetchReadme = async () => {
			setLoading(true);
			setError(false);
			try {
				const url = `/api/github-readme?owner=${repo.owner.login}&repo=${repo.name}`;
				const res = await fetch(url);

				if (res.status === 404) {
					setReadme(null);
					setLoading(false);
					return;
				}
				if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);

				const data = await res.json();
				const decoded = new TextDecoder("utf-8")
					.decode(
						Uint8Array.from(atob(data.content || ""), (c) => c.charCodeAt(0))
					)
					.trim();

				setReadme(decoded || null);
			} catch (err) {
				console.error("Error fetching README:", err);
				setError(true);
				setReadme(null);
			} finally {
				setLoading(false);
			}
		};

		fetchReadme();
	}, [repo]);

	if (!repo) return null;

	const formatDate = (iso: string) =>
		new Date(iso).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});

	const isTouchDevice = () =>
		typeof window !== "undefined" && "ontouchstart" in window;

	return (
		<AnimatePresence>
			<motion.div
				className="fixed inset-0 z-50 flex justify-center items-center bg-black/60 backdrop-blur-sm p-4 sm:p-0"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
				onClick={onClose}
			>
				<motion.div
					className={cn(
						"relative w-full sm:w-[90vw] max-w-3xl bg-black rounded-3xl p-4 sm:p-6 overflow-hidden flex flex-col max-h-screen",
						colorClass
					)}
					initial={{ opacity: 0, y: 60, scale: 0.9 }}
					animate={{ opacity: 1, y: 0, scale: 1 }}
					exit={{
						opacity: 0,
						y: 60,
						scale: 0.9,
						transition: {
							duration: 0.35,
							ease: [0.22, 1, 0.36, 1],
						},
					}}
					transition={{ type: "spring", stiffness: 300, damping: 24 }}
					onClick={(e) => e.stopPropagation()}
				>
					{/* Background meteors */}
					<div className="absolute inset-0 z-0 pointer-events-none">
						<Meteors number={30} />
					</div>

					{/* Foreground content */}
					<div className="relative z-10 flex flex-col h-full text-white overflow-hidden">
						{/* Title */}
						<div className="text-2xl font-semibold text-center my-4">
							<a
								href={repo.repoUrl || "#"}
								rel="noopener noreferrer"
								target="_blank"
								className="text-neutral-100 relative inline-block after:content-[''] after:block after:h-[2px] after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full"
							>
								{repo.name || "Repository"}
							</a>
						</div>

						{/* Language icons */}
						{repo.allLanguages && repo.allLanguages.length > 0 && (
							<div className="flex flex-wrap justify-center gap-3 mb-4 px-4">
								{repo.allLanguages.map((lang, index) => (
									<div
										key={`${lang.name}-${index}`}
										title={lang.name}
										className="rounded-full w-10 h-10 border border-white/20 flex items-center justify-center"
									>
										<i className={`${lang.icon} text-lg`} />
									</div>
								))}
							</div>
						)}

						{/* Dates */}
						<div className="w-full px-4 flex justify-between text-sm text-neutral-400 select-none">
							<h3
								onClick={() =>
									isTouchDevice() && setShowCreatedDate((prev) => !prev)
								}
								onMouseEnter={() =>
									!isTouchDevice() && setShowCreatedDate(true)
								}
								onMouseLeave={() =>
									!isTouchDevice() && setShowCreatedDate(false)
								}
								className={cn(
									"transition-colors duration-300",
									isTouchDevice() ? "cursor-pointer" : "cursor-default"
								)}
							>
								<motion.span
									key={showCreatedDate ? "created-date" : "created-label"}
									initial={{ opacity: 0, y: 4 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -4 }}
									transition={{ duration: 0.3 }}
								>
									{showCreatedDate ? formatDate(repo.created_at) : "Created"}
								</motion.span>
							</h3>

							<h3
								onClick={() =>
									isTouchDevice() && setShowUpdatedDate((prev) => !prev)
								}
								onMouseEnter={() =>
									!isTouchDevice() && setShowUpdatedDate(true)
								}
								onMouseLeave={() =>
									!isTouchDevice() && setShowUpdatedDate(false)
								}
								className={cn(
									"transition-colors duration-300",
									isTouchDevice() ? "cursor-pointer" : "cursor-default"
								)}
							>
								<motion.span
									key={showUpdatedDate ? "updated-date" : "updated-label"}
									initial={{ opacity: 0, y: 4 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -4 }}
									transition={{ duration: 0.3 }}
								>
									{showUpdatedDate ? formatDate(repo.updated_at) : "Updated"}
								</motion.span>
							</h3>
						</div>

						{/* README */}
						<div className="flex-1 mt-4 overflow-y-auto px-4">
							<div className="bg-white/10 backdrop-blur-md border border-gray-500/40 rounded-2xl p-6 max-h-[50vh] sm:max-h-[60vh] overflow-y-auto scroll-smooth">
								<h2 className="text-xl font-semibold mb-4">📘 README</h2>
								{loading ? (
									<p className="text-sm text-neutral-300">Loading README...</p>
								) : error || !readme ? (
									<div className="text-neutral-400 text-sm text-center space-y-2">
										<div className="text-3xl">🤔</div>
										<p>Hrm... weird, there is nothing here.</p>
									</div>
								) : (
									<div className="prose prose-invert prose-pre:bg-[#1e1e1e] max-w-none animate-fade-in [&_p]:my-4">
										<ReactMarkdown
											remarkPlugins={[remarkGfm]}
											rehypePlugins={[
												rehypeRaw,
												rehypeHighlight,
												[
													rehypeExternalLinks,
													{ target: "_blank", rel: ["noopener", "noreferrer"] },
												],
											]}
										>
											{readme}
										</ReactMarkdown>
									</div>
								)}
							</div>
						</div>

						{/* Close button */}
						<button
							onClick={onClose}
							className="absolute top-4 right-4 text-white hover:text-red-400 transition-colors duration-200 z-20"
						>
							✕
						</button>
					</div>
				</motion.div>

				<style jsx>{`
					@keyframes fade-in {
						from {
							opacity: 0;
							transform: translateY(4px);
						}
						to {
							opacity: 1;
							transform: translateY(0);
						}
					}
					.animate-fade-in {
						animation: fade-in 0.3s ease-out;
					}
				`}</style>
			</motion.div>
		</AnimatePresence>
	);
}
