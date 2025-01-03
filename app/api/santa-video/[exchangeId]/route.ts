import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// Route to get the santa video for the user
export async function GET(
	request: NextRequest,
	props: { params: Promise<{ exchangeId: string }> }
) {
	try {
		const params = await props.params;
		const exchange_id = await params.exchangeId;
		const supabase = await createClient();
		const authResponse = await supabase.auth.getUser();

		if (!authResponse.data.user) {
			console.log("No user found in auth");
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		console.log("Fetching video for:", {
			exchange_id,
			user_id: authResponse.data.user.id,
		});

		const { data: videoData, error: videoError } = await supabase
			.from("santa_video")
			.select(
				`
				download_url,
				stream_url,
				is_ready
			`
			)
			.eq("exchange_id", exchange_id)
			.eq("user_id", authResponse.data.user.id)
			.single();

		if (videoError) {
			console.log("Video error details:", {
				message: videoError.message,
				details: videoError.details,
				hint: videoError.hint,
			});
			return NextResponse.json(
				{ error: "Failed to fetch santa video", details: videoError },
				{ status: 500 }
			);
		}

		if (!videoData) {
			console.log("No video data found");
			return NextResponse.json({ error: "No video found" }, { status: 404 });
		}

		return NextResponse.json(videoData);
	} catch (error) {
		console.log("Caught error:", error);
		return NextResponse.json(
			{ error: "Internal server error", details: error },
			{ status: 500 }
		);
	}
}
