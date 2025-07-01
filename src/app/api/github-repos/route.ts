// app/api/github-repos/route.ts
import { NextResponse } from "next/server";

export async function GET() {
	const token = process.env.GITHUB_TOKEN;

	const res = await fetch("https://api.github.com/users/UsamahThani/repos", {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	if (!res.ok) {
		return NextResponse.json({ error: "GitHub API failed" }, { status: 500 });
	}

	const data = await res.json();
	return NextResponse.json(data);
}
