"use client";
import Image from "next/image";
import Typewriter from "typewriter-effect";
import HackerText from "@/components/HackerText";

export default function Profile() {
	return (
		<section className="flex flex-col justify-center max-w-full lg:flex-row items-center lg:gap-4 lg:mx-50 lg:justify-between">
			<div>
				<Image
					src={"/images/sam1_fixedbg.png"}
					alt="Profile Picture"
					width={350}
					height={350}
				/>
			</div>
			<div className="w-auto lg:w-[50%] ">
				<div className="flex flex-col items-center mt-2s lg:mt-0">
					<h1 className="futura-med text-5xl lg:text-6xl tracking-wide lg:-ml-37">
						<HackerText text="USAMAH" className="text-[#8f8f8f]" />
					</h1>
					<h1 className="futura-med text-5xl lg:text-6xl tracking-wide lg:ml-37">
						<HackerText text="THANI" className="text-gray-600" />
					</h1>
				</div>

				<div className="futura-med flex justify-center text-3xl w-full mt-5 min-h-[40px] min-w-[251px] text-center bg-gradient-to-r from-red-500 via-purple-600 to-pink-500 bg-[length:200%_200%] bg-clip-text text-transparent animate-gradient">
					<Typewriter
						options={{
							strings: [
								"Software Engineer",
								"Web Developer",
								"Tech Enthusiast",
								"AI Explorer",
								"Anime Enjoyer",
							],
							autoStart: true,
							loop: true,
							delay: 75,
						}}
					/>
				</div>
			</div>
		</section>
	);
}
