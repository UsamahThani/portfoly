import Link from "next/link";

export default function Logo() {
	return (
		<Link
			href="/"
			className="mr-4 block cursor-pointer py-1.5 text-gray-100 font-bold text-2xl"
		>
			Usamah<span className="text-gray-600">Thani</span>
		</Link>
	);
}
