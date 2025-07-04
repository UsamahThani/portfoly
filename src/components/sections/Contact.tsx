"use client";

import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { FloatingDock } from "@/components/ui/floating-dock";
import {
	IconBrandFacebook,
	IconBrandGithub,
	IconBrandLinkedin,
	IconBrandX,
	IconHome,
} from "@tabler/icons-react";

export default function Contact() {
	const links = [
		{
			title: "Home",
			icon: (
				<IconHome className="h-full w-full text-neutral-500 dark:text-neutral-300" />
			),
			href: "#home",
		},
		{
			title: "Facebook",
			icon: (
				<IconBrandFacebook className="h-full w-full text-neutral-500 dark:text-neutral-300" />
			),
			href: "/nothing2see",
		},
		{
			title: "GitHub",
			icon: (
				<IconBrandGithub className="h-full w-full text-neutral-500 dark:text-neutral-300" />
			),
			href: "/nothing2see",
		},
		{
			title: "LinkedIn",
			icon: (
				<IconBrandLinkedin className="h-full w-full text-neutral-500 dark:text-neutral-300" />
			),
			href: "/nothing2see",
		},

		{
			title: "Twitter",
			icon: (
				<IconBrandX className="h-full w-full text-neutral-500 dark:text-neutral-300" />
			),
			href: "/nothing2see",
		},
	];
	return (
		<section
			id="contact"
			className="h-screen max-h-full flex justify-center items-center"
		>
			<BackgroundBeamsWithCollision>
				<div className="flex flex-col">
					<h2 className="text-2xl relative z-20 md:text-4xl lg:text-7xl font-bold text-center text-black dark:text-white font-sans tracking-tight mb-12">
						I don't know how to do{" "}
						<div className="relative mx-auto inline-block w-max [filter:drop-shadow(0px_1px_3px_rgba(27,_37,_80,_0.14))]">
							<div className="absolute left-0 top-[1px] bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r py-4 from-purple-500 via-violet-500 to-pink-500 [text-shadow:0_0_rgba(0,0,0,0.1)]">
								<span className="">Portfolio Website.</span>
							</div>
							<div className="relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 py-4">
								<span className="">Portfolio Website.</span>
							</div>
						</div>
					</h2>
					<FloatingDock
						mobileClassName="translate-y-20" // only for demo, remove for production
						items={links}
					/>
				</div>
			</BackgroundBeamsWithCollision>
		</section>
	);
}
