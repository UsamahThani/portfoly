"use client";
import Navbar from "@/components/Navbar";
import Contact from "@/components/sections/Contact";
import HomeSection from "@/components/sections/Home";
import Profile from "@/components/sections/Profile";
import Project from "@/components/sections/Project";
import { useEffect, useState } from "react";

export default function Home() {
	const [showNavbar, setShowNavbar] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			const homeSection = document.getElementById("home");
			const profileSection = document.getElementById("profile");

			if (!homeSection || !profileSection) return;

			const homeRect = homeSection.getBoundingClientRect();
			const profileRect = profileSection.getBoundingClientRect();

			const isInHome =
				homeRect.top <= 0 && homeRect.bottom >= window.innerHeight;
			const isAtTop = window.scrollY === 0;

			if (isInHome || isAtTop) {
				document.body.style.overflow = "hidden";
			} else {
				document.body.style.overflow = "auto";
			}
			setShowNavbar(profileRect.top <= 80); // Show navbar when profile is near top
		};

		window.addEventListener("scroll", handleScroll);
		handleScroll(); // call on load in case already scrolled

		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<>
			{/* Navbar fades in when not in home */}
			<div
				className={`fixed top-0 left-0 w-full transition-opacity duration-700 z-[9999] ${
					showNavbar ? "opacity-100" : "opacity-0 pointer-events-none"
				}`}
			>
				<Navbar />
			</div>
			<main className="px-4 py-4 lg:px-8">
				<HomeSection />
				<Profile />
				<Project />
				<Contact />
			</main>
		</>
	);
}
