import { ProcessedVideoResult } from "@/app/types/tavusSanta";
import { createClient } from "@/lib/supabase/server";

// Route that tavus will hit to notify that the santa video has been processed
export async function POST(
	req: Request,
	props: { params: Promise<{ webhookId: string }> }
) {
	try {
		console.log("webhook hit");
		const params = await props.params;
		const webhook_id = await params.webhookId;

		const supabase = await createClient();

		const response = await fetch(
			`https://tavusapi.com/v2/videos/${webhook_id}`,
			{
				method: "GET",
				headers: {
					"x-api-key": process.env.TAVUS_API_KEY as string,
				},
			}
		);

		const processedVideoResult =
			(await response.json()) as ProcessedVideoResult;

		console.log("processed video result", processedVideoResult);

		const { stream_url, download_url } = processedVideoResult;

		const { data: videoData, error } = await supabase
			.from("santa_video")
			.update({ stream_url, download_url, is_ready: true })
			.eq("webhook_id", webhook_id)
			.single();

		if (error) throw error;
		return Response.json({ success: true }, videoData);
	} catch (error) {
		console.error("Webhook error:", error);
		return Response.json({ success: false }, { status: 500 });
	}
}
