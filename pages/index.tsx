import { Geist, Geist_Mono } from "next/font/google";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";
import { normalize } from "viem/ens";

const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const [amount, setAmount] = useState<string>("");
  const [ens, setEns] = useState<string>("");
  return (
    <div
      className={`${geistSans.className} ${geistMono.className} dflex min-h-screen sitems-center sjustify-center oldbg-zinc-50 font-sans dark:bg-black`}
    >
      <nav className="px-20 py-8 flex flex-row justify-between items-baseline mb-20">
        <span className="text-lg font-bold">tippy.</span>
        <ConnectButton />
      </nav>
      <main className="mx-auto max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Issue Tips</CardTitle>
            <CardDescription>
              Resolves ens tipping criteria and sends funds instantly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                console.log(e);
                alert("submitted");
              }}
            >
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="ens-rtl">ENS</Label>
                  <Input
                    id="ens-rtl"
                    type="text"
                    placeholder="jibola.eth"
                    value={ens}
                    onChange={(e) => setEns(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="tip-amount-rtl">Amount</Label>
                  </div>
                  <Input
                    id="tip-amount-rtl"
                    type="text"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button
              type="submit"
              className="w-full"
              onClick={async (e) => {
                e.preventDefault();

                if (!ens.endsWith(".eth") || ens.length < 5) {
                  return alert("invalid ens");
                }

                const amount_as_number = Number(amount);
                if (isNaN(amount_as_number)) {
                  return alert("invalid amount");
                }

                if (amount_as_number < 0.001) {
                  return alert(
                    "amount too low, you must send at least 0.001 eth in tips",
                  );
                }

                const normalized_ens = normalize(ens);
                const ensAddress = await publicClient.getEnsAddress({
                  name: normalized_ens,
                });

                if (ensAddress == null) {
                  return alert("ens not found");
                }

                const tippy_notification_platform = await publicClient.getEnsText({
                  name: normalized_ens,
                  key: "tippy.notification.platform",
                });

                if (tippy_notification_platform == null) {
                  return alert(`Sending entire tip to ${ens} [${ensAddress}]`);
                }
                const tippy_notification_id = await publicClient.getEnsText({
                  name: normalized_ens,
                  key: "tippy.notification.id",
                });
                const tippy_charity = await publicClient.getEnsText({
                  name: normalized_ens,
                  key: "tippy.charity",
                });
                const tippy_charity_bps = await publicClient.getEnsText({
                  name: normalized_ens,
                  key: "tippy.charity.bps",
                });

                const notes = `ens: ${ens} [${ensAddress}]\nnotification: ${tippy_notification_id} (${tippy_notification_platform})\ncharity: ${tippy_charity_bps} percent to ${tippy_charity}`;
                console.log(notes)

                alert(notes)
              }}
            >
              TIP
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
