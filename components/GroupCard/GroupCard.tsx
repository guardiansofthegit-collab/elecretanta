import { ChevronRight } from "lucide-react";
import Link from "next/link";

const GroupCard = () => {
  return (
    <Link href="">
      <div className="h-28 lg:w-1/2 flex items-center p-4 rounded-xl bg-groupCardGreen">
        <img
          className="h-16 w-16 lg:h-20 lg:w-20 rounded-xl"
          src="https://img.freepik.com/free-vector/santa-claus-elements-red-background_1057-2152.jpg"
          alt="Group logo"
        />
        <div className="flex flex-col flex-grow justify-center h-full ml-4 gap-2">
          <h2 className="font-semibold text-white text-base lg:text-lg">
            Office Secret Santa 2024
          </h2>
          <div className="flex gap-4">
            <p className="text-white text-xs lg:text-sm">5 members</p>
            <p className="text-white text-xs lg:text-sm">
              Draw: November 27, 2024
            </p>
          </div>
        </div>
        <ChevronRight className="text-groupCardArrow" />
      </div>
    </Link>
  );
};

export default GroupCard;
