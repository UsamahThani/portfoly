"use client";

import { Meteors } from "@/components/ui/meteors";

export default function HomePage() {
	return (
		<section className="w-screen h-screen flex justify-center items-center bg-black">
			<h1>Test</h1>
			<div className="absolute w-300 h-200 backdrop-blur-sm rounded-3xl border-1 border-indigo-400 p-3">
				<div className="relative flex h-full flex-col items-start justify-end overflow-hidden rounded-2xl  py-8 shadow-xl">
					<div className="title w-full text-3xl flex justify-center mt-2">
						<a href="#repo-link">REPO NAME</a>
					</div>

					{/* Meaty part - Meteor effect */}
					<Meteors number={20} />
				</div>
			</div>
		</section>
	);
}
