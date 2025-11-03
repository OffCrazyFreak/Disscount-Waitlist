"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import NextImage from "next/image";

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
  waitlistSubmissionSchema,
} from "@/lib/api/schemas/waitlist";

export default function WaitlistCard() {
  const [showQR, setShowQR] = useState(false);

  // Get waitlist count
  const { data: stats, isLoading: statsLoading } =
    waitlistService.useGetWaitlistCount();

  // Setup form with React Hook Form
  const form = useForm<WaitlistSubmission>({
    resolver: zodResolver(waitlistSubmissionSchema),
    defaultValues: {
      email: "",
    },
  });

  // Submit mutation
  const submitMutation = waitlistService.useSubmitToWaitlist();

  const onSubmit = async (data: WaitlistSubmission) => {
    try {
      await submitMutation.mutateAsync(data);
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

  return (
    <div className="max-w-xl mx-auto px-4">
      <Card className="shadow-lg">
        <CardHeader className="text-center space-y-4">
          <CardTitle className="text-lg font-medium">
            {showQR && (
              <div className="mb-6">
                <NextImage
                  src="/get-disscount-qr.png"
                  alt="QR Code to join Disscount waitlist"
                  width={256}
                  height={256}
                  className="mx-auto w-48 sm:w-64"
                />
              </div>
            )}
            Join{" "}
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

          <CardDescription>
            Enter your email to be notified as soon as the app becomes
            available!
          </CardDescription>
        </CardHeader>

        <Separator className="max-w-sm mx-auto my-4" />

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                className="w-full"
                size="lg"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <BlocksLoader size={20} color="white" />
                ) : (
                  "NOTIFY ME"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
