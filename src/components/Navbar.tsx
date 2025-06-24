"use client";
import { useState } from "react";
import Link from "next/link";
import Logo from "./Logo";

export default function Navbar() {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const toggleMobileMenu = () => {
		setIsMobileMenuOpen(!isMobileMenuOpen);
	};

	// Navbar items array
	const navbarItems = [
		{ name: "Home", href: "/" },
		{ name: "About", href: "/about" },
		{ name: "Projects", href: "/projects" },
		{ name: "Contact", href: "/contact" },
	];

	return (
		<>
			<nav className="block w-full max-w-screen px-4 py-4 mx-auto bg-opacity-90 sticky top-3 shadow lg:px-8 backdrop-blur-lg backdrop-saturate-150 z-[9999]">
				<div className="container flex flex-wrap items-center justify-between mx-auto text-slate-800">
					<Logo />
				</div>
				<div className="lg:hidden">
					<button
						className="relative ml-auto h6 max-h-[40px] w-6 max-w-[40px] select-none rounded-lg text-center align-middle text-xs font-medium uppercase text-inherit transition-all hover:bg-transparent focus:bg-transparent active:bg-transparent disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
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

				{/* Mobile menu */}
				<div
					className={`fixed top-0 left-0 min-g-screen w-64 bg-slate-100 shadow-lg transform transition-transform duration-300 ease-in-out ${
						isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
					} lg:hidden z-50 `}
				>
					<div className="flex flex-row items-center border-b pb-4">
						<Logo />
					</div>
				</div>
			</nav>
		</>
	);
}
