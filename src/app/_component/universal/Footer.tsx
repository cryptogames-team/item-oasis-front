"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <>
      <div className="mt-10 w-full bg-slate-100 flex flex-col items-center">
        <div className="h-container flex flex-col">
          <div className="w-full flex justify-between py-2 text-sm">
            <Link href="/" className="flex">
              {/* <Image
                src="/아이템오아시스로고.png"
                width={40}
                height={40}
                alt="로고"
              ></Image> */}
              <button className="ml-3 justify-self-start text-xl">
                푸터
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
