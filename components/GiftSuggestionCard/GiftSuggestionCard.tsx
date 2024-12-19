import { SquareArrowOutUpRight, ThumbsDown } from "lucide-react";
import { Button } from "../Button/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../Card/card";
import { GiftSuggestionCardProps } from "@/app/types/giftSuggestion";

const GiftSuggestionCard: React.FC<GiftSuggestionCardProps> = ({ gift }) => {
  return (
    <Card className="bg-giftSuggestionsCardBackground h-96 w-80 flex flex-col justify-between m-5">
      <div className="flex justify-between m-4">
        <p className="text-xs w-24 h-7 flex items-center justify-center font-semibold bg-giftSuggestionTextBackground text-giftSuggestionTextGreen rounded-md">
          {gift.matchScore}% Match
        </p>
        <p className="text-sm font-semibold text-giftSuggestionDarkGreen">
          {gift.price}
        </p>
      </div>
      <CardHeader className="p-0 mx-4">
        <CardTitle className="text-base font-bold text-giftSuggestionDarkGreen">
          {gift.title}
        </CardTitle>
        <CardDescription className="text-sm text-giftSuggestionTextLightGreen">
          {gift.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 m-4 w-72 h-20 flex items-center bg-GiftSuggestionLightGreenBackground rounded-md">
        <ul className="text-xs list-disc list-inside w-full text-giftSuggestionDarkGreen ml-2 flex flex-col gap-1">
          {gift.matchReasons.map((reason, index) => (
            <li key={index}>{reason}</li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="flex flex-col p-4">
        <div className="flex justify-between w-full">
          <Button className="text-sm w-32 h-9 bg-primaryButtonYelow70 hover:bg-primaryButtonYellow">
            <SquareArrowOutUpRight /> View
          </Button>
          <Button className="text-sm w-32 h-9 text-giftSuggestionDarkGreen bg-gray-100 hover:bg-gray-200">
            <ThumbsDown />
            Not This
          </Button>
        </div>
        <Button className="w-full mt-4 text-sm bg-giftSuggestionDarkGreen hover:bg-GiftSuggestionDarkGreenHover">
          Select Gift
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GiftSuggestionCard;
