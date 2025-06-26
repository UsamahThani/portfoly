"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import Logo from "./Logo";
import Image from "next/image";

export default function Navbar() {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const toggleMobileMenu = () => {
		setIsMobileMenuOpen((prev) => {
			const newState = !prev;
			if (typeof window !== "undefined") {
				document.body.style.overflow = newState ? "hidden" : "auto";
			}
			return newState;
		});
	};

	useEffect(() => {
		return () => {
			if (typeof window !== "undefined") {
				document.body.style.overflow = "auto";
			}
		};
	}, []);

	// Navigation items array
	const navItems = [
		{ name: "Home", href: "#home" },
		{ name: "Profile", href: "#profile" },
		{ name: "Projects", href: "#project" },
		{ name: "Contact", href: "#contact" },
	];

	return (
		<div>
			{/* bg-[#272932] */}
			<nav className="block w-full max-w-screen px-4 py-4 mx-auto  bg-opacity-90 shadow lg:px-8 backdrop-blur-lg backdrop-saturate-150 z-[9999] futura-bk">
				<div className="container flex flex-wrap items-center justify-between mx-auto text-slate-200">
					{/* <Logo /> */}
					<Image src={"/fox_white.png"} alt="foxico" width={50} height={50} />
					<div className="lg:hidden">
						{/* hamburger btn */}
						<button
							className="relative ml-auto h-6 max-h-[40px] w-6 max-w-[40px] select-none rounded-lg text-center align-middle text-xs font-medium uppercase text-inherit transition-all hover:bg-transparent focus:bg-transparent active:bg-transparent disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
							onClick={toggleMobileMenu}
							type="button"
						>
							<span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="w-8 h-8"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M4 6h16M4 12h16M4 18h16"
									></path>
								</svg>
							</span>
						</button>
					</div>

					{/* Mobile Menu */}
					<div
						className={`fixed top-0 left-0 min-h-screen w-64 bg-[#272932] shadow-lg transform transition-transform duration-300 ease-in-out ${
							isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
						} lg:hidden z-50`}
					>
						<div className="flex flex-row border-b p-4 justify-between items-center">
							<Logo />
							{/* close button */}
							<button
								onClick={toggleMobileMenu}
								className="absolute top-7 right-0 text-slate-200 hover:text-red-500"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="w-8 h-8"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</button>
						</div>
						<ul className="flex flex-col h-full gap-4 p-4">
							{navItems.map((item, index) => (
								<li
									key={index}
									className="flex items-center p-1 text-lg gap-x-2 text-slate-200 hover:text-red-500 duration-300 ease-in-out"
								>
									<Link
										onClick={() => {
											setIsMobileMenuOpen(false);
										}}
										href={item.href}
										className="flex items-center"
									>
										{item.name}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Desktop Menu */}
					<div className="hidden lg:block">
						<ul className="flex flex-col gap-2 mt-2 mb-4 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
							{navItems.map((item, index) => (
								<li
									key={index}
									className="flex items-center p-1 text-lg gap-x-2 text-slate-200 hover:text-red-500 duration-300 ease-in-out"
								>
									<Link href={item.href} className="flex items-center">
										{item.name}
									</Link>
								</li>
							))}
						</ul>
					</div>
				</div>
			</nav>
		</div>
	);
}
