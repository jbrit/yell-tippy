import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <div
      className={`${geistSans.className} ${geistMono.className} dflex min-h-screen sitems-center sjustify-center bg-zinc-50 font-sans dark:bg-black`}
    >
      <nav className="px-20 py-8 flex flex-row justify-between items-baseline">
        <span className="text-lg font-bold">tippy.</span>
        <ConnectButton />
      </nav>
    </div>
  );
}
