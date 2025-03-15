"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";
import { Label } from "@/app/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Check } from "lucide-react";

export default function NewsletterSection() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [formError, setFormError] = useState("");
  const [preference, setPreference] = useState("");

  async function subscribeToNewsletter(formData) {
    setFormError("");
    const email = formData.get("newsletter");
    const gender = formData.get("gender");

    if (!email || !gender) {
      setFormError("Please fill in all required fields");
      return;
    }

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        body: JSON.stringify({ email, gender }),
      });

      const data = await res.json();

      if (data.success) {
        setIsSubscribed(true);
      } else {
        setFormError(data.message || "Something went wrong");
      }
    } catch (error) {
      setFormError("Failed to subscribe. Please try again.");
    }
  }

  return (
    <section className="bg-muted/50 py-16">
      <div className="container px-4 md:px-6">
        <Card className="mx-auto max-w-3xl border-none bg-transparent shadow-none">
          <CardHeader className="text-center">
            <CardTitle className="font-oswald text-3xl font-bold tracking-tight md:text-4xl">
              Join us & save 20% off + free shipping
            </CardTitle>
            <CardDescription className="mx-auto max-w-xl text-center text-sm text-muted-foreground md:text-base">
              Get monthly updates on new releases, promos and exclusive deals
              for all new Dekato newsletter subscribers
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isSubscribed ? (
              <form action={subscribeToNewsletter} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-base font-semibold">
                      Preferences <span className="text-destructive">*</span>
                    </Label>
                    <RadioGroup
                      className="mt-2 flex flex-col gap-3 sm:flex-row sm:justify-center"
                      defaultValue={preference}
                      onValueChange={setPreference}
                      name="gender"
                      required
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="men" id="men" />
                        <Label htmlFor="men">Men&apos;s fashion</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="women" id="women" />
                        <Label htmlFor="women">Women&apos;s fashion</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="both" id="both" />
                        <Label htmlFor="both">Both</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="newsletter"
                      className="text-base font-semibold"
                    >
                      E-mail <span className="text-destructive">*</span>
                    </Label>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Input
                        type="email"
                        name="newsletter"
                        id="newsletter"
                        placeholder="Enter your e-mail address"
                        className="flex-1"
                        required
                      />
                      <Button
                        type="submit"
                        className="bg-primary font-oswald text-white hover:bg-primary/90"
                      >
                        SUBSCRIBE
                      </Button>
                    </div>
                    {formError && (
                      <p className="text-sm text-destructive" role="alert">
                        {formError}
                      </p>
                    )}
                  </div>
                </div>
              </form>
            ) : (
              <div className="rounded-lg bg-primary/10 p-6 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="rounded-full bg-primary/20 p-2">
                    <Check className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <h3 className="mb-2 text-lg font-semibold">
                  Thank you for subscribing!
                </h3>
                <p className="text-muted-foreground">
                  You&apos;ve been added to our mailing list. You&apos;ll now
                  receive updates on new releases, exclusive offers, and a 20%
                  discount code will be sent to your email shortly.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
