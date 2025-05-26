'use client';

import { useState, useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/app/components/ui/radio-group';
import { Label } from '@/app/components/ui/label';
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
      className="bg-secondary font-oswald text-primary hover:bg-secondary/90"
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

  const [subscribedLocally, setSubscribedLocally] = useState(false);

  const { data: session } = useSession();
  const userEmail = session?.user?.email;

  const { data: subscriptionData } = useSWR(
    userEmail ? ['subscriptionStatus', userEmail] : null,
    () => getSubscriptionStatus(userEmail),
    { revalidateOnFocus: false }
  );

  useEffect(() => {
    console.log(state, 'STATE');
    if (state.success) {
      toast.success('You have successfully subscribed!');
      setSubscribedLocally(true);
    } else if (state.message && !state.success) {
      toast.error(state.message || 'Subscription failed.');
    }
  }, [state]);

  return (
    <div className="space-y-4">
      <h3 className="font-oswald text-lg font-semibold">
        Subscribe to our newsletter
      </h3>
      <p className="text-sm text-secondary">
        Get updates on new releases, promos and exclusive deals for all new
        Dekato newsletter subscribers
      </p>
      <div>
        {subscribedLocally ? (
          <div className="rounded-lg bg-primary/10 p-6 text-center">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-primary/20 p-2">
                <Check className="h-6 w-6 text-primary" />
              </div>
            </div>
            <h3 className="mb-2 text-lg font-semibold">
              Thank you for subscribing!
            </h3>
            <p className="text-secondary">
              You&apos;ve been added to our mailing list.
            </p>
          </div>
        ) : (
          <form action={formAction}>
            <div className="flex flex-col justify-center gap-4">
              <div className="flex flex-col gap-1">
                <Label className="whitespace-nowrap text-base">
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
                    <RadioGroupItem
                      value="men"
                      id="men"
                      className="border-secondary"
                    />
                    <Label htmlFor="men" className="cursor-pointer">
                      Men
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="women"
                      id="women"
                      className="border-secondary"
                      variant="primary"
                    />
                    <Label htmlFor="women" className="cursor-pointer">
                      Women
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="both"
                      id="both"
                      className="border-secondary"
                      variant="secondary"
                    />
                    <Label htmlFor="both" className="cursor-pointer">
                      Both
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex flex-col gap-1">
                <Label
                  htmlFor="newsletter"
                  className="whitespace-nowrap text-base"
                >
                  E-mail <span className="text-destructive">*</span>
                </Label>
                <div className="mt-2 flex flex-wrap gap-1 sm:mt-0">
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
      </div>
    </div>
  );
}
