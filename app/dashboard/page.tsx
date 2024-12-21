"use client";

import { Button } from "@/components/Button/button";
import GroupCard from "@/components/GroupCard/GroupCard";
import Link from "next/link";
import { useEffect, useState } from "react";
import { GiftExchangeWithMemberCount } from "../types/giftExchange";

export default function Dashboard() {
	const [giftExchanges, setGiftExchanges] = useState<
		GiftExchangeWithMemberCount[]
	>([]);

	useEffect(() => {
		async function fetchGiftExchanges() {
			try {
				const response = await fetch(`/api/gift-exchanges`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
				});

				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}

				const data = await response.json();
				setGiftExchanges(data);
			} catch (error) {
				console.error("Failed to fetch gift exchanges:", error);
			}
		}
		fetchGiftExchanges();
	}, []);

	return (
		<section className="min-h-screen flex flex-col">
			<div className="flex items-center justify-between px-4 md:px-16 lg:px-32 xl:px-52 h-40 pt-16">
				<h1 className="text-2xl font-semibold text-white">Dashboard</h1>
				<Button
					className="bg-primaryButtonYellow h-10 w-36 font-semibold text-sm"
					asChild
				>
					<Link href="/create-group-page">Create Group</Link>
				</Button>
			</div>
			<div className="flex flex-col flex-grow px-4 md:px-16 lg:px-32 xl:px-52">
				<h2 className="font-semibold text-lg text-white mb-2 ">My Groups</h2>
				<div className="grid xl:grid-cols-2 gap-4">
					{giftExchanges.map((exchange) => (
						<GroupCard
							giftExchange={exchange}
							key={exchange.gift_exchange_id}
						/>
					))}
				</div>
			</div>
		</section>
	);
}
