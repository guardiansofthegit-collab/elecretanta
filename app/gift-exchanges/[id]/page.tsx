"use client";

import { GiftExchange } from "@/app/types/giftExchange";
import { useParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { GiftExchangeHeader } from "./GiftExchangeHeader";
import { JourneyCard } from "./JourneyCard";
import { MembersList } from "./MembersList";
import { InviteCard } from "./InviteCard";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { GiftExchangeMember } from "@/app/types/giftExchangeMember";
import { createClient } from "@/lib/supabase/client";
import { Session } from "@supabase/supabase-js";
import WarningModal from "./WarningModal";
import { CompletedExchangeCard } from "./CompletedExchangeCard";
import { Profile } from "@/app/types/profile";
import ProfileCard from "@/components/ProfileCard/ProfileCard";
import GiftSuggestionCard from "@/components/GiftSuggestionCard/GiftSuggestionCard";
import { GiftSuggestion } from "@/app/types/giftSuggestion";

export default function GiftExchangePage() {
	const { id } = useParams();
	const [session, setSession] = useState<Session | null>(null);
	const [isUserAMember, setIsUserAMember] = useState<boolean | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [giftExchangeData, setGiftExchangeData] = useState<GiftExchange>({
		id: "",
		name: "",
		description: "",
		budget: "",
		drawing_date: "",
		group_image: "",
		exchange_date: "",
		owner_id: "",
		status: "pending",
	});
	const [giftExchangeMembers, setGiftExchangeMembers] = useState<
		GiftExchangeMember[]
	>([]);

	const [giftMatch, setGiftMatch] = useState<Profile | null>(null);
	const [giftSuggestions, setGiftSuggestions] = useState<GiftSuggestion[]>([]);
	const [santaVideo, setSantaVideo] = useState({
		status: "",
		download_url: "",
		stream_url: "",
	});

	const handleGiftUpdate = (
		updatedGift: GiftSuggestion,
		originalIndex: number
	) => {
		setGiftSuggestions((prevSuggestions) => {
			const newSuggestions = [...prevSuggestions];
			newSuggestions[originalIndex] = updatedGift;
			return newSuggestions;
		});
	};

	useEffect(() => {
		const fetchSession = async () => {
			try {
				const supabase = createClient();
				const {
					data: { session },
				} = await supabase.auth.getSession();
				setSession(session);
			} catch (error) {
				console.error("Error fetching session:", error);
			}
		};
		fetchSession();
	}, []);

	const fetchGiftExchangeData = useCallback(async () => {
		setIsLoading(true);
		try {
			const [
				giftExchangeResponse,
				membersResponse,
				giftSuggestionsResponse,
				santaVideoResponse,
			] = await Promise.all([
				fetch(`/api/gift-exchanges/${id}`),
				fetch(`/api/gift-exchanges/${id}/members`),
				fetch(`/api/gift-exchanges/${id}/giftSuggestions`),
				fetch(`/api/santa-video/${id}`),
			]);

			const [
				giftExchangeResult,
				membersResult,
				giftSuggestionsResult,
				santaVideoResult,
			] = await Promise.all([
				giftExchangeResponse.json(),
				membersResponse.json(),
				giftSuggestionsResponse.json(),
				santaVideoResponse.json(),
			]);

			setGiftExchangeData(giftExchangeResult);
			setGiftExchangeMembers(membersResult);
			setGiftMatch(giftSuggestionsResult.match);
			setGiftSuggestions(giftSuggestionsResult.suggestions);
			setSantaVideo(santaVideoResult);
			if (session) {
				setIsUserAMember(
					membersResult.some(
						(member: GiftExchangeMember) => member.user_id === session?.user.id
					)
				);
			}
		} catch (error) {
			console.error("Error fetching data:", error);
		} finally {
			setIsLoading(false);
		}
	}, [id, session]);

	useEffect(() => {
		fetchGiftExchangeData();
	}, [fetchGiftExchangeData, session, id]);

	const updateGiftExchangeMembers = async () => {
		try {
			await fetchGiftExchangeData();
		} catch (error) {
			console.error(error);
		}
	};

	if (isLoading) {
		return <LoadingSkeleton statsCount={4} cardItemCount={10} />;
	}

	const renderContent = () => {
		switch (giftExchangeData.status) {
			case "pending":
				return (
					<div className="flex flex-row w-full py-12 gap-8 items-start">
						<JourneyCard
							drawingDate={giftExchangeData.drawing_date}
							exchangeDate={giftExchangeData.exchange_date}
						/>
						<div className="flex flex-col gap-4 w-full max-w-md">
							<MembersList members={giftExchangeMembers} />
							<InviteCard />
						</div>
					</div>
				);
			case "active":
				return (
					<div className="w-full py-4">
						<section className="py-4 mb-12">
							<h1 className="font-bold mb-4">Your Secret Santa Match</h1>
							<ProfileCard profile={giftMatch} />
							{/* <VideoPlayer /> */}
							<p className="text-blue-500">
								{santaVideo && santaVideo.stream_url}
							</p>
						</section>
						<section className="flex flex-col">
							<h1 className="font-bold">Gift Suggestions</h1>
							<div className="flex flex-row flex-wrap">
								{giftSuggestions.map((gift, index) => (
									<GiftSuggestionCard
										allGiftSuggestions={giftSuggestions}
										budget={giftExchangeData.budget}
										gift={gift}
										index={index}
										key={gift.id}
										onGiftUpdate={handleGiftUpdate}
										recipient={giftMatch}
									/>
								))}
							</div>
						</section>
					</div>
				);
			case "completed":
				return (
					<div className="w-full py-12">
						<CompletedExchangeCard members={giftExchangeMembers} />
					</div>
				);
		}
	};

	return (
		<main className="min-h-screen-minus-20">
			{!isUserAMember && giftExchangeData.status === "pending" && (
				<WarningModal
					giftExchangeData={giftExchangeData}
					session={session}
					members={giftExchangeMembers}
					updateGiftExchangeMembers={updateGiftExchangeMembers}
				/>
			)}
			<section className="mx-auto flex flex-col gap-4 px-4 md:px-16 lg:px-32 xl:px-52 pt-12 text-primary-foreground">
				<GiftExchangeHeader
					giftExchangeData={giftExchangeData}
					id={giftExchangeData.id}
					members={giftExchangeMembers}
				/>
				{renderContent()}
			</section>
		</main>
	);
}
