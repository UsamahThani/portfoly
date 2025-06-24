import Image from "next/image";

export default function Profile() {
	return (
		<div className="bg-amber-300 flex flex-col justify-center max-w-full lg:flex-row flex-wrap items-center gap-4 p-4 lg:p-8">
			<Image
				src={"/images/sam1.png"}
				alt="Profile Picture"
				width={400}
				height={400}
			/>
			<h1 className="mt-2 text-gray-600">
				This is the profile section content.
			</h1>
		</div>
	);
}
