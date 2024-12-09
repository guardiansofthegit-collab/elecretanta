import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { UpdateGiftExchangeMemberRequest } from "@/app/types/giftExchangeMember";

// update a gift exchange member
export async function PATCH(req: Request) {
  const { searchParams } = new URL(req.url);
  const exchangeId = searchParams.get("exchangeId");
  const memberId = searchParams.get("memberId");

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: UpdateGiftExchangeMemberRequest = await req.json();

    const { data, error } = await supabase
      .from("gift_exchange_members")
      .update({
        ...body,
        updated_at: new Date().toISOString(),
      })
      .eq("id", memberId)
      .eq("gift_exchange_id", exchangeId)
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

// delete a gift exchange member
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const exchangeId = searchParams.get("exchangeId");
  const memberId = searchParams.get("memberId");

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { error } = await supabase
      .from("gift_exchange_members")
      .delete()
      .eq("id", memberId)
      .eq("gift_exchange_id", exchangeId);

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
