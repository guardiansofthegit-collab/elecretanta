import { UnprocessedVideoResult } from "@/app/types/tavusSanta";
import { createClient } from "./supabase/server";

export async function generateSantaVideo(userId: string, recipientId: string) {
	try {
		const supabase = await createClient();

		const { data: recipientData } = await supabase
			.from("profiles")
			.select("display_name")
			.eq("id", recipientId)
			.single();

		const recipientName = recipientData?.display_name;

		const script = `Ho ho ho!
    
    Well, well, well! What do we have here? Looks like someone's been especially good this year, and they're about to find out who their special Secret Santa is!
    You know, I've been checking my list twice, making sure all the matches are just right. And for you... I've found someone quite wonderful!
    Your Secret Santa this year is... ${recipientName}!
    I have a feeling ${recipientName} will be absolutely perfect as your Secret Santa. Remember, the magic of Secret Santa isn't just in receiving a gift – 
    it's in the joy of surprise and the warmth of knowing someone is thinking about you!

    Now, keep this between us – we wouldn't want to spoil the surprise! And don't forget, the gift exchange is coming up soon!
    Ho ho ho! Merry Christmas, and let the festive fun begin!`;

		const webhookId = crypto.randomUUID();

		const response = await fetch("https://tavusapi.com/v2/videos", {
			method: "POST",
			headers: {
				"x-api-key": process.env.TAVUS_API_KEY as string,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/tavus-webhook/${webhookId}`,
				script,
				replica_id: "r3fbe3834a3e",
			}),
		});
		const videoResult = (await response.json()) as UnprocessedVideoResult;

		const { error } = await supabase
			.from("santa_video")
			.insert([
				{
					id: videoResult.video_id,
					webhook_id: webhookId,
					hosted_url: videoResult.hosted_url,
					user_id: userId,
				},
			])
			.select();

		if (error) {
			throw new Error("Error inserting santa video");
		}
	} catch (error) {
		console.error(error);
	}
}
