'use client';

import { useState, useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/app/components/ui/radio-group';
import { Label } from '@/app/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/app/components/ui/card';
import { Check, Loader2 } from 'lucide-react';
import { subscribeUser } from '@/app/action/subscriptionAction';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import { getSubscriptionStatus } from '@/app/action/subscriptionAction';
import { toast } from 'sonner';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="bg-primary font-oswald text-white hover:bg-primary/90"
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Subscribing...
        </>
      ) : (
        'SUBSCRIBE'
      )}
    </Button>
  );
}

export default function NewsletterSection() {
  const [preference, setPreference] = useState('');
  const [state, formAction] = useFormState(subscribeUser, {
    success: false,
    message: null,
  });

  const { data: session } = useSession();
  const userEmail = session?.user?.email;

  // Fetch subscription status using SWR to determine initial visibility
  const { data: subscriptionData, isLoading: isLoadingStatus } = useSWR(
    userEmail ? ['subscriptionStatus', userEmail] : null, // Key includes email
    () => getSubscriptionStatus(userEmail),
    { revalidateOnFocus: false } // Avoid unnecessary refetches
  );

  const isAlreadySubscribed =
    subscriptionData?.subscription?.status === 'subscribed';

  // Handle form submission result
  useEffect(() => {
    if (state.success) {
      // Success is handled by UI changes
    } else if (state.message && !state.success) {
      toast.error(state.message || 'Subscription failed.');
    }
  }, [state]);

  return (
    <section className="bg-muted/50 py-16">
      <div className="container px-4 md:px-6">
        <Card className="mx-auto max-w-3xl border-none bg-transparent shadow-none">
          <CardHeader className="text-center">
            <h2 className="font-oswald">
              Join us & save 20% off + free shipping
            </h2>
            <CardDescription className="mx-auto max-w-xl text-center text-sm text-muted-foreground md:text-base">
              Get monthly updates on new releases, promos and exclusive deals
              for all new Dekato newsletter subscribers
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingStatus ? (
              <div className="flex justify-center p-6">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : isAlreadySubscribed ? (
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
            ) : (
              <form action={formAction}>
                <div className="flex flex-col items-center justify-center gap-4">
                  <div className="flex items-center gap-4">
                    <Label className="whitespace-nowrap text-base font-semibold">
                      Preferences <span className="text-destructive">*</span>
                    </Label>
                    <RadioGroup
                      className="mt-2 flex flex-row flex-wrap gap-4 sm:mt-0"
                      defaultValue={preference}
                      onValueChange={setPreference}
                      name="gender"
                      required
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="men" id="men" />
                        <Label htmlFor="men" className="cursor-pointer">
                          Men&apos;s fashion
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="women" id="women" />
                        <Label htmlFor="women" className="cursor-pointer">
                          Women&apos;s fashion
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="both" id="both" />
                        <Label htmlFor="both" className="cursor-pointer">
                          Both
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="flex items-center gap-4">
                    <Label
                      htmlFor="newsletter"
                      className="whitespace-nowrap text-base font-semibold"
                    >
                      E-mail <span className="text-destructive">*</span>
                    </Label>
                    <div className="mt-2 flex flex-1 gap-3 sm:mt-0">
                      <Input
                        type="email"
                        name="newsletter"
                        id="newsletter"
                        placeholder="Enter your e-mail address"
                        className="w-full sm:w-64"
                        required
                      />
                      <SubmitButton />
                    </div>
                  </div>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
