"use client";
import Image from "next/image";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function HomePage() {
	useEffect(() => {
		AOS.init({ duration: 800, once: true });
	}, []);

	const navItems = [
		{ name: "Profile", href: "#profile" },
		{ name: "Projects", href: "#projects" },
		{ name: "Contact", href: "#contact" },
	];

	return (
		<section className="w-screen h-screen flex justify-center items-center bg-black">
			<div className="relative w-[500px] h-[500px]" data-aos="zoom-in">
				{/* Static Centered Image */}
				<Image
					src="/fox_white.png"
					alt="Fox"
					width={300}
					height={300}
					className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
					priority
				/>

				{/* Rotating SVG Text */}
				<svg
					viewBox="0 0 500 500"
					className="absolute top-0 left-0 w-full h-full"
				>
					<defs>
						<path
							id="circlePath"
							d="M250,250 m-200,0 a200,200 0 1,1 400,0 a200,200 0 1,1 -400,0"
						/>
					</defs>

					{/* Animated group of textPaths */}
					<svg
						viewBox="0 0 500 500"
						className="absolute top-0 left-0 w-full h-full"
					>
						<defs>
							<path
								id="circlePath"
								d="M250,250 m-200,0 a200,200 0 1,1 400,0 a200,200 0 1,1 -400,0"
							/>
						</defs>

						<g className="spin-group">
							{navItems.map((item, index) => {
								const offset = 10 + (100 / navItems.length) * index;
								const spaced = item.name.toUpperCase().split("").join(" ");

								return (
									<text
										key={item.name}
										fontSize="20"
										className="fill-white hover:fill-red-500 cursor-pointer transition-colors duration-300"
										letterSpacing="2px"
									>
										<textPath
											href="#circlePath"
											startOffset={`${offset}%`}
											dominantBaseline="middle"
											textAnchor="middle"
										>
											{spaced}
										</textPath>
									</text>
								);
							})}
						</g>
					</svg>
				</svg>
			</div>
		</section>
	);
}
