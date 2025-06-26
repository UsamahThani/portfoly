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
		<div className="w-screen h-screen flex justify-center items-center bg-black">
			<div className="relative w-[500px] h-[500px]" data-aos="zoom-in">
				<Image
					src="/fox_white.png"
					alt="Fox"
					width={300}
					height={300}
					className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
					priority
				/>

				<svg
					viewBox="0 0 500 500"
					className="absolute top-0 left-0 w-full h-full animate-spin-slow"
				>
					<defs>
						<path
							id="circlePath"
							d="M250,250 m-200,0 a200,200 0 1,1 400,0 a200,200 0 1,1 -400,0"
						/>
					</defs>

					{navItems.map((item, index) => {
						const count = navItems.length;
						const spacing = 100 / count;
						const padding = 5; // add 5% spacing from the start
						const offset = padding + spacing * index;
						const spaced = item.name.toUpperCase().split("").join(" ");

						return (
							<a href={item.href} key={item.name}>
								<text fontSize="20" fill="white" letterSpacing="2px">
									<textPath
										href="#circlePath"
										startOffset={`${offset}%`}
										dominantBaseline="middle"
										textAnchor="middle"
									>
										{spaced}
									</textPath>
								</text>
							</a>
						);
					})}
				</svg>
			</div>
		</div>
	);
}
