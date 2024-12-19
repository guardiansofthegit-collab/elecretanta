"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "../Button/button";
import { useState } from "react";
import { LoadingSpinner } from "../LoadingSpinner/LoadingSpinner";
import { redirect, useRouter } from "next/navigation";

export default function LoginButton({ redirectPath = "/onboarding" }) {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const signInWithGoogle = async () => {
		setIsLoading(true);
		try {
			const supabase = createClient();
			const { error } = await supabase.auth.signInWithOAuth({
				provider: "google",
				options: {
					redirectTo: `${window.location.origin}/auth/callback`,
					queryParams: {
						redirect_to: redirectPath,
					},
				},
			});

			if (error) {
				redirect("/auth/error");
			}

			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) return;

			const { data: profile } = await supabase
				.from("profiles")
				.select("onboarding_complete")
				.eq("id", user.id)
				.single();

			if (profile?.onboarding_complete) {
				router.push("/dashboard");
			} else {
				router.push("/onboarding");
			}
		} catch (error) {
			console.error("Error occurred during Google Sign in: ", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Button
			variant="outline"
			className={"w-full"}
			disabled={isLoading}
			onClick={signInWithGoogle}
		>
			{!isLoading ? (
				<>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
						<path
							d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
							fill="currentColor"
						/>
					</svg>
				</>
			) : (
				<LoadingSpinner className="text-logoRed" />
			)}
			<span>Continue with Google</span>
		</Button>
	);
}
