"use client";

import { Meteors } from "@/components/ui/meteors";

export default function HomePage() {
	return (
		<section className="relative w-screen h-screen flex flex-col justify-center items-center bg-black text-white">
			<div className="relative w-300 h-200 backdrop-blur-sm rounded-3xl border border-indigo-400 p-3 overflow-hidden">
				{/* Meteors in the background */}
				<div className="absolute inset-0 z-0 pointer-events-none">
					<Meteors number={30} />
				</div>

				{/* Foreground content */}
				<div className="relative z-10 flex h-full flex-col items-start py-8">
					<div className="w-full text-2xl flex justify-center my-2">
						<a
							href="#repo-link"
							className="text-neutral-100 font-medium relative inline-block transition duration-200 after:content-[''] after:block after:h-[2px] after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full"
						>
							REPO NAME
						</a>
					</div>

					{/* Repo languages */}
					<div className="flex w-full justify-center gap-4 items-center">
						<div className="rounded-full border w-10 h-10 flex items-center justify-center  bg-gray-500">
							{/* some language icon from devicon connect with github api */}
						</div>
						<div className="rounded-full border w-10 h-10 flex items-center justify-center  bg-gray-500">
							{/* some language icon from devicon connect with github api */}
						</div>
						<div className="rounded-full border w-10 h-10 flex items-center justify-center  bg-gray-500">
							{/* some language icon from devicon connect with github api */}
						</div>
						<div className="rounded-full border w-10 h-10 flex items-center justify-center  bg-gray-500">
							{/* some language icon from devicon connect with github api */}
						</div>
						<div className="rounded-full border w-10 h-10 flex items-center justify-center  bg-gray-500">
							{/* some language icon from devicon connect with github api */}
						</div>
					</div>
					{/* dates */}
					<div className="w-full px-20 mt-20 mb-2 flex justify-between">
						<h3>Created Date</h3>
						<h3>Updated Date</h3>
					</div>

					{/* ReadMe */}
					<div className="w-full px-20 flex-1">
						<div className="w-full h-full bg-white/10 backdrop-blur-md border border-gray-500/40 rounded-2xl p-6 text-white shadow-lg overflow-y-auto scroll-smooth">
							<h2 className="text-xl font-semibold mb-4">📘 README</h2>
							<p className="mb-4 text-sm text-neutral-200">
								Welcome to this project! Here's a brief overview of what it
								does.
							</p>
							<ul className="list-disc list-inside space-y-2 text-sm text-neutral-300">
								<li>Clean minimalist layout</li>
								<li>React + Tailwind + GitHub integration</li>
								<li>Cool frosted glass README container</li>
								<li>Responsive and aesthetic UI</li>
								<li>Hoverable links and glowing meteors!</li>
							</ul>
							<p className="mt-6 text-sm text-neutral-400">
								To get started, clone the repo and run:
							</p>
							<pre className="bg-white/20 text-white text-sm p-4 mt-2 rounded-xl overflow-x-auto">
								<code>
									{`git clone https://github.com/yourname/yourrepo
cd yourrepo
npm install
npm run dev`}
								</code>
							</pre>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
