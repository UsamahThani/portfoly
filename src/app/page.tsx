import Navbar from "@/components/Navbar";
import Profile from "@/components/sections/Profile";

export default function Home() {
	return (
		<>
			<Navbar />
			<main className="px-4 py-4 lg:px-8">
				<Profile />
			</main>
		</>
	);
}
