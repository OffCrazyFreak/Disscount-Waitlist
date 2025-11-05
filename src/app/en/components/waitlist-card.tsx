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
  waitlistSubmissionSchemaEn,
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

  // Detect language based on domain or pathname
  const isEnglish =
    typeof window !== "undefined" &&
    (window.location.hostname === "get.disscount.me" ||
      window.location.pathname.startsWith("/en"));

  // Setup form with React Hook Form
  const form = useForm<WaitlistSubmission>({
    resolver: zodResolver(waitlistSubmissionSchemaEn),
    defaultValues: {
      name: "",
      surname: "",
      email: "",
      lang: "en",
    },
  });

  // Submit mutation
  const submitMutation = waitlistService.useSubmitToWaitlist();

  const onSubmit = async (data: WaitlistSubmission) => {
    try {
      // Set language to "en" for English page or get.disscount.me domain
      await submitMutation.mutateAsync({
        ...data,
        lang: isEnglish ? "en" : "cro",
      });
      toast.success("Successfully joined the waitlist!");
      form.reset();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || "An error occurred during registration");
      } else {
        toast.error("An error occurred during registration");
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
                src="/qr/get-disscount-qr.png"
                alt="QR Code to join Disscount waitlist"
                width={256}
                height={256}
                className="mx-auto w-48 sm:w-64"
                preload={true}
              />
            </div>
          )}
          Join over{" "}
          {statsLoading ? (
            <span className="inline-flex items-center gap-1">
              <BlocksLoader size={16} />
            </span>
          ) : (
            <span className="text-primary font-bold">{displayCount}+</span>
          )}{" "}
          other people patiently awaiting
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
            Be among the first to save{" "}
            <span className="text-primary">up to 50%</span> on your next grocery
            shopping trip!
          </div>

          <Separator className="my-4" />

          <div className="text-pretty">
            Enter your email to be notified as soon as the app becomes
            available!
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
                        placeholder="Name"
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
                        placeholder="Surname"
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
                      placeholder="your@email.com"
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
                  <span>NOTIFY ME</span>
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
              <span className="relative w-4 h-4 flex items-center justify-center">
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
                  className={`h-4 w-4 absolute transition-all duration-300 ${
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
                  Link copied
                </span>
                <span
                  className={`inline-block transition-all duration-300 ${
                    copied
                      ? "-translate-y-full opacity-0 absolute"
                      : "translate-y-0 opacity-100"
                  }`}
                >
                  Share with friends
                </span>
              </span>
            </span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
