import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	const token = process.env.GITHUB_TOKEN;
	const owner = req.nextUrl.searchParams.get("owner");
	const repo = req.nextUrl.searchParams.get("repo");

	if (!owner || !repo) {
		return NextResponse.json(
			{ error: "Missing owner or repo" },
			{ status: 400 }
		);
	}

	const res = await fetch(
		`https://api.github.com/repos/${owner}/${repo}/readme`,
		{
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}
	);

	if (!res.ok) {
		return NextResponse.json(
			{ error: "Failed to fetch README" },
			{ status: 500 }
		);
	}

	const data = await res.json();
	return NextResponse.json(data);
}
