import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
	let supabaseResponse = NextResponse.next({
		request,
	});

	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				getAll() {
					return request.cookies.getAll();
				},
				setAll(cookiesToSet) {
					cookiesToSet.forEach(({ name, value }) =>
						request.cookies.set(name, value)
					);
					supabaseResponse = NextResponse.next({
						request,
					});
					cookiesToSet.forEach(({ name, value, options }) =>
						supabaseResponse.cookies.set(name, value, options)
					);
				},
			},
		}
	);

	// IMPORTANT: Avoid writing any logic between createServerClient and
	// supabase.auth.getUser(). A simple mistake could make it very hard to debug
	// issues with users being randomly logged out.

	const {
		data: { user },
	} = await supabase.auth.getUser();

	// If the user is not authenticated redirect the user to the login page
	if (
		!user &&
		!request.nextUrl.pathname.startsWith("/auth/login") &&
		!request.nextUrl.pathname.startsWith("/auth") &&
		request.nextUrl.pathname !== "/auth/error" &&
		request.nextUrl.pathname !== "/"
	) {
		// no user, potentially respond by redirecting the user to the login page
		const url = request.nextUrl.clone();
		url.pathname = "/auth/login";
		return NextResponse.redirect(url);
		// Todo: Uncomment this to redirect unauthenticated users to the login page
	}

	// if the user is authenticated check if they have already onboarded
	if (user && !request.nextUrl.pathname.startsWith("/api/")) {
		// Get the user's profile
		const { data: profile } = await supabase
			.from("profiles")
			.select("onboarding_complete")
			.eq("id", user.id)
			.single();

		// If user is not onboarded and not already on the onboarding page, redirect to onboarding
		if (
			profile &&
			!profile.onboarding_complete &&
			!request.nextUrl.pathname.startsWith("/onboarding")
		) {
			const url = request.nextUrl.clone();
			url.pathname = "/onboarding";
			return NextResponse.redirect(url);
		}
	}

	// IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
	// creating a new response object with NextResponse.next() make sure to:
	// 1. Pass the request in it, like so:
	//    const myNewResponse = NextResponse.next({ request })
	// 2. Copy over the cookies, like so:
	//    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
	// 3. Change the myNewResponse object to fit your needs, but avoid changing
	//    the cookies!
	// 4. Finally:
	//    return myNewResponse
	// If this is not done, you may be causing the browser and server to go out
	// of sync and terminate the user's session prematurely!

	return supabaseResponse;
}
