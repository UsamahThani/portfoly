"use client";

import { Meteors } from "@/components/ui/meteors";
import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";

// Define proper types
type Language = {
	name: string;
	icon: string;
};

type RepoData = {
	name: string;
	repoUrl: string;
	owner: { login: string };
	created_at: string;
	updated_at: string;
	allLanguages?: { name: string; icon: string | null }[];
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

	// Lock scroll
	useEffect(() => {
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = "auto";
		};
	}, []);

	// Fetch README
	useEffect(() => {
		if (!repo?.owner?.login || !repo.name) return;

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
				const decoded = atob(data.content || "").trim();
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

	// Prevent render if repo is null
	if (!repo) return null;

	return (
		<AnimatePresence>
			<motion.div
				className="fixed inset-0 z-50 flex justify-center items-center bg-black/60 backdrop-blur-sm"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
				onClick={onClose}
			>
				<motion.div
					className={cn(
						"relative w-[90vw] max-w-3xl max-h-[90vh] bg-black rounded-3xl p-6 overflow-hidden",
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
					{/* Meteors */}
					<div className="absolute inset-0 z-0 pointer-events-none">
						<Meteors number={30} />
					</div>

					{/* Foreground */}
					<div className="relative z-10 flex flex-col h-full text-white">
						{/* Title */}
						<div className="text-2xl font-semibold text-center my-4">
							<a
								href={repo.repoUrl}
								target="_blank"
								rel="noopener noreferrer"
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
						<div className="w-full px-4 flex justify-between text-sm text-neutral-400">
							<h3>Created: {new Date(repo.created_at).toLocaleDateString()}</h3>
							<h3>Updated: {new Date(repo.updated_at).toLocaleDateString()}</h3>
						</div>

						{/* README Section */}
						<div className="flex-1 mt-4 overflow-y-auto px-4">
							<div className="bg-white/10 backdrop-blur-md border border-gray-500/40 rounded-2xl p-6 max-h-[50vh] overflow-y-auto">
								<h2 className="text-xl font-semibold mb-4">📘 README</h2>
								{loading ? (
									<p className="text-sm text-neutral-300">Loading README...</p>
								) : error || !readme ? (
									<div className="text-neutral-400 text-sm text-center space-y-2">
										<div className="text-3xl">🤔</div>
										<p>Hrm... weird, there is nothing here.</p>
									</div>
								) : (
									<div className="prose prose-invert max-w-none text-sm text-neutral-200 animate-fade-in">
										<ReactMarkdown>{readme}</ReactMarkdown>
									</div>
								)}
							</div>
						</div>

						{/* Close */}
						<button
							onClick={onClose}
							className="absolute top-4 right-4 text-white hover:text-red-400 transition-colors duration-200"
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
