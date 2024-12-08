import { UpdateGiftExchangeRequest } from "@/app/types/giftExchange";
import { createClient } from "@/lib/supabase/server";
import { validateGroupExchangeDates } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("gift_exchanges")
      .select(
        `
          *,
          owner:owner_id (
            id,
            email,
            user_metadata
          )
        `
      )
      .eq("id", id)
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Gift exchange not found" },
        { status: 404 }
      );
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

export async function PATCH(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: UpdateGiftExchangeRequest = await req.json();

    // Validate dates if both are provided
    if (body.drawing_date && body.exchange_date) {
      const drawingDate = new Date(body.drawing_date);
      const exchangeDate = new Date(body.exchange_date);
      const dateError = validateGroupExchangeDates(drawingDate, exchangeDate);

      if (dateError) {
        return NextResponse.json({ error: dateError }, { status: 400 });
      }
    }

    const { data, error } = await supabase
      .from("gift_exchanges")
      .update({
        ...body,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
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

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { error } = await supabase
      .from("gift_exchanges")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
