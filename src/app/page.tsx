import Navbar from "@/components/Navbar";
import Profile from "@/components/sections/Profile";
import Project from "@/components/sections/Project";

export default function Home() {
	return (
		<>
			<Navbar />
			<main className="px-4 py-4 lg:px-8">
				<Profile />
				<Project />
			</main>
		</>
	);
}
