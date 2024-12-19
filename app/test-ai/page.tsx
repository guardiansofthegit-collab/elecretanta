"use client";

import GiftSuggestionCard from "@/components/GiftSuggestionCard/GiftSuggestionCard";
import { useState } from "react";
import { GiftSuggestion } from "../types/giftSuggestion";

const TestAIPage = (): React.JSX.Element => {
  const [gifts, setGifts] = useState<Record<string, GiftSuggestion>>({});
  const fetchGifts = async () => {
    const response = await fetch("/api/giftSuggestions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });
    const data = await response.json();
    const dataObject = JSON.parse(data.message.content);
    console.log(dataObject);
    setGifts(dataObject);
  };

  return (
    <>
      <button onClick={fetchGifts}>Generate Gifts</button>
      {Object.keys(gifts).map((key) => (
        <GiftSuggestionCard key={key} gift={gifts[key]} />
      ))}
    </>
  );
};

export default TestAIPage;
