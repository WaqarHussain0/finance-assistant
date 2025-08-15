"use client";

import { useRouter } from "next/navigation";
import { PAGE_LINK } from "../constant/page-link.constant";

const Page = () => {
  const router = useRouter();

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <button
        onClick={() => router.push(PAGE_LINK.dashboard)}
        className="bg-indigo-400 p-3 rounded-md text-white cursor-pointer"
      >
        Continue to dashboard page
      </button>
    </div>
  );
};

export default Page;
