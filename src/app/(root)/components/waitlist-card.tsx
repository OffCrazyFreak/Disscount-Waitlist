"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import NextImage from "next/image";

import {
  BellRingIcon,
  type BellRingIconHandle,
} from "@/components/ui/BellRingIcon";
import { LinkIcon, type LinkIconHandle } from "@/components/ui/LinkIcon";
import { ShareIcon, type ShareIconHandle } from "@/components/ui/ShareIcon";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import BlocksLoader from "@/components/custom/blocks-loader";
import waitlistService from "@/lib/api/waitlist/index";
import {
  WaitlistSubmission,
  waitlistSubmissionSchemaCro,
} from "@/lib/api/schemas/waitlist";

export default function WaitlistCard() {
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);
  const bellIconRef = useRef<BellRingIconHandle>(null);
  const linkIconRef = useRef<LinkIconHandle>(null);
  const shareIconRef = useRef<ShareIconHandle>(null);

  // Get waitlist count
  const { data: stats, isLoading: statsLoading } =
    waitlistService.useGetWaitlistCount();

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => {
        setCopied(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  // Setup form with React Hook Form
  const form = useForm<WaitlistSubmission>({
    resolver: zodResolver(waitlistSubmissionSchemaCro),
    defaultValues: {
      name: "",
      surname: "",
      email: "",
      lang: "cro",
    },
  });

  // Submit mutation
  const submitMutation = waitlistService.useSubmitToWaitlist();

  const onSubmit = async (data: WaitlistSubmission) => {
    try {
      // Set language to "cro" for Croatian page
      await submitMutation.mutateAsync({ ...data, lang: "cro" });
      toast.success("Uspješno ste se prijavili na listu za čekanje!");
      form.reset();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || "Došlo je do greške pri prijavi");
      } else {
        toast.error("Došlo je do greške pri prijavi");
      }
    }
  };

  const waitlistCount = stats?.totalCount ?? 0;
  // Round to nearest multiple of 50, minimum 100
  const displayCount = Math.max(100, Math.ceil(waitlistCount / 50) * 50);

  const handleCopyLink = () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    navigator.clipboard.writeText(url);
    setCopied(true);
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="text-center space-y-4">
        <CardTitle className="text-lg font-medium">
          {showQR && (
            <div className="mb-6">
              <NextImage
                src="/qr/zelim-disscount-qr.png"
                alt="QR Code to join Disscount waitlist"
                width={256}
                height={256}
                className="mx-auto w-48 sm:w-64"
              />
            </div>
          )}
          Priključi se{" "}
          {statsLoading ? (
            <span className="inline-flex items-center gap-1">
              <BlocksLoader size={16} />
            </span>
          ) : (
            <span className="text-primary font-bold">{displayCount}+</span>
          )}{" "}
          drugih ljudi koji željno iščekuju
          <Button
            variant="ghost"
            className="flex items-center justify-center gap-2 mt-2 mx-auto hover:bg-transparent cursor-pointer"
            onClick={() => setShowQR(!showQR)}
          >
            <NextImage
              src="/disscount-logo.png"
              alt="Disscount logo"
              width={128}
              height={128}
              className="size-8"
            />
            <span className="text-primary text-xl font-bold">Disscount</span>
          </Button>
        </CardTitle>

        <CardDescription className="space-y-2">
          <div className="text-pretty">
            Budi među prvima koji će uštediti i{" "}
            <span className="text-primary">do 50%</span> na idućoj kupovini!
          </div>

          <Separator className="my-4" />

          <div className="text-pretty">
            Upiši svoj email kako bi te obavijestili čim aplikacija postane
            dostupna!
          </div>
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Ime"
                        {...field}
                        disabled={form.formState.isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="surname"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Prezime"
                        {...field}
                        disabled={form.formState.isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="tvoj@email.com"
                      {...field}
                      disabled={form.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full transition-all duration-150 ease-in-out hover:scale-98"
              size="lg"
              disabled={form.formState.isSubmitting}
              effect="shineHover"
              onMouseEnter={() => bellIconRef.current?.startAnimation()}
              onMouseLeave={() => bellIconRef.current?.stopAnimation()}
            >
              {form.formState.isSubmitting ? (
                <BlocksLoader size={20} color="white" />
              ) : (
                <>
                  <BellRingIcon ref={bellIconRef} size={16} />
                  <span>OBAVIJESTI ME</span>
                </>
              )}
            </Button>
          </form>
        </Form>

        <div className="mx-auto w-fit mt-8">
          <Button
            variant="outline"
            size="lg"
            effect="ringHover"
            onClick={handleCopyLink}
            onMouseEnter={() => {
              if (copied) {
                linkIconRef.current?.startAnimation();
              } else {
                shareIconRef.current?.startAnimation();
              }
            }}
            onMouseLeave={() => {
              linkIconRef.current?.stopAnimation();
              shareIconRef.current?.stopAnimation();
            }}
            className="w-xs transition-all duration-150 ease-in-out hover:scale-98"
          >
            <span className="flex items-center gap-2 relative">
              <span className="relative size-4 flex items-center justify-center">
                <LinkIcon
                  ref={linkIconRef}
                  size={16}
                  className={`absolute transition-all duration-300 ${
                    copied ? "scale-100 opacity-100" : "scale-0 opacity-0"
                  }`}
                />
                <ShareIcon
                  ref={shareIconRef}
                  size={16}
                  className={`size-4 absolute transition-all duration-300 ${
                    copied ? "scale-0 opacity-0" : "scale-100 opacity-100"
                  }`}
                />
              </span>
              <span className="relative overflow-hidden">
                <span
                  className={`inline-block transition-all duration-300 ${
                    copied
                      ? "translate-y-0 opacity-100"
                      : "translate-y-full opacity-0 absolute"
                  }`}
                >
                  Link kopiran
                </span>
                <span
                  className={`inline-block transition-all duration-300 ${
                    copied
                      ? "-translate-y-full opacity-0 absolute"
                      : "translate-y-0 opacity-100"
                  }`}
                >
                  Podijeli s prijateljima
                </span>
              </span>
            </span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
