import { ButtonPrimary } from "@/app/ui/button";
import { oswald } from "@/style/font";

export default function Newsletter() {
  return (
    <div className="space-y-12">
      <div className="space-y-6">
        <h2 className={`${oswald.className} text-2xl`}>Subscription Options</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="relative flex gap-x-3">
            <div className="flex h-6 items-center">
              <input
                id="newsletter"
                name="newsletter"
                type="checkbox"
                className="h-4 w-4 text-primary focus:ring-primary"
              />
            </div>
            <label htmlFor="newsletter">General Subscription</label>
          </div>
        </div>
      </div>
      <ButtonPrimary>Save</ButtonPrimary>
    </div>
  );
}
