import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { CreateGiftExchangeRequest } from "@/app/types/giftExchange";
import { validateGroupExchangeDates } from "@/lib/utils";

// Get all gift exchanges for the current user
export async function GET() {
	try {
		const supabase = await createClient();
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { data, error } = await supabase.rpc("get_gift_exchanges_for_user", {
			input_user_id: user.id,
		});

		if (error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		return NextResponse.json(data);
	} catch (error) {
		console.log(error);

		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}

export async function POST(req: Request) {
	try {
		const supabase = await createClient();
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body: CreateGiftExchangeRequest = await req.json();

		// Validate dates
		const drawingDate = new Date(body.drawing_date);
		const exchangeDate = new Date(body.exchange_date);
		const dateError = validateGroupExchangeDates(drawingDate, exchangeDate);

		if (dateError) {
			return NextResponse.json({ error: dateError }, { status: 400 });
		}

		const { data, error } = await supabase
			.from("gift_exchanges")
			.insert({
				name: body.name,
				description: body.description,
				group_image: body.group_image,
				budget: body.budget,
				drawing_date: body.drawing_date,
				exchange_date: body.exchange_date,
				owner_id: user.id,
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
			})
			.select()
			.single();

		if (error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}

		return NextResponse.json(data);
	} catch (error) {
		console.log(error);

		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
