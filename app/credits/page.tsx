import Image from "next/image";
import type { Metadata } from "next";
import Eyebrow from "@/components/Eyebrow";
import { getImageCredits, IMAGE_LICENSE } from "@/data/imageCredits";

export const metadata: Metadata = {
  title: "Image Credits — Hike Scotland",
  description:
    "Photography credits and licensing for the images used across Hike Scotland.",
};

export default function CreditsPage() {
  const credits = getImageCredits();

  return (
    <>
      <header className="bg-forest-gradient text-fog">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
          <Eyebrow tone="mint" dash>Attribution</Eyebrow>
          <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">
            Image Credits
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-fog/85">
            All photography on Hike Scotland is licensed via {IMAGE_LICENSE}. We
            gratefully credit the photographers behind each image below.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        {credits.length > 0 ? (
          <ul className="space-y-4">
            {credits.map((credit) => (
              <li
                key={credit.file}
                className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-card"
              >
                <div className="relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-fog">
                  <Image
                    src={credit.file}
                    alt=""
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-forest-darkest">{credit.label}</p>
                  <p className="text-sm text-neutralgray">
                    Photo by{" "}
                    <span className="font-medium text-forest-dark">{credit.author}</span>{" "}
                    · {IMAGE_LICENSE}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-neutralgray">Image credits will be listed here.</p>
        )}

        <p className="mt-10 text-sm leading-relaxed text-neutralgray">
          Photography is used under the Envato Elements license and remains the
          property of the respective photographers. If you believe an image is
          credited incorrectly, please get in touch and we&apos;ll put it right.
        </p>
      </div>
    </>
  );
}
