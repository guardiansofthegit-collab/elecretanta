import { SupabaseClient } from "@supabase/supabase-js";
import { generateAndStoreSuggestions } from "./generateAndStoreSuggestion";
import { generateSantaVideo } from "./generateSantaVideo";

// util function to draw gift exchange names
// this function can be called from an API route
// or from a scheduled job
export async function drawGiftExchange(
	supabase: SupabaseClient,
	exchangeId: string
) {
	// Get exchange and verify ownership
	const { data: exchange, error: exchangeError } = await supabase
		.from("gift_exchanges")
		.select("*")
		.eq("id", exchangeId)
		.single();

	if (exchangeError || !exchange) {
		throw new Error("Gift exchange not found");
	}

	// Check exchange status
	if (exchange.status !== "pending") {
		throw new Error("Names have already been drawn");
	}

	// Get all members
	const { data: members, error: membersError } = await supabase
		.from("gift_exchange_members")
		.select("id, user_id")
		.eq("gift_exchange_id", exchangeId);

	if (membersError || !members) {
		throw new Error("Failed to fetch members");
	}

	//Validate minimum members
	if (members.length < 3) {
		throw new Error("At least 3 members are required");
	}

	// Shuffle members to assign
	const shuffledMembers = [...members].sort(() => Math.random() - 0.5);

	// Update assignments
	for (let i = 0; i < shuffledMembers.length; i++) {
		const giver = shuffledMembers[i];
		// Last person gives to first person, closing the circle
		const recipient = shuffledMembers[(i + 1) % shuffledMembers.length];

		const { error: updateError } = await supabase
			.from("gift_exchange_members")
			.update({
				recipient_id: recipient.user_id,
				has_drawn: true,
			})
			.eq("id", giver.id);

		if (updateError) {
			throw new Error("Failed to assign recipients");
		}

		// Fire and forget suggestions with error handling
		// hacky way to avoid waiting for all suggestions to be generated
		// avoids timeout issues
		generateAndStoreSuggestions(
			supabase,
			exchangeId,
			giver.user_id,
			recipient.user_id,
			exchange.budget
		).catch((error) => console.error("Failed to generate suggestions:", error));

		generateSantaVideo(giver.user_id, recipient.user_id);
	}

	// Update exchange status to active
	const { error: statusError } = await supabase
		.from("gift_exchanges")
		.update({ status: "active" })
		.eq("id", exchangeId);

	if (statusError) {
		throw new Error("Failed to update exchange status");
	}

	return { success: true };
}
