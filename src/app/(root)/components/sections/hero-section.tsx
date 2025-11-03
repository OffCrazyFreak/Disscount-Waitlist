import Image from "next/image";
import WaitlistCard from "@/app/(root)/components/waitlist-card";

const tagLines: string[] = [
  "Usporedi trgovine i cijene!",
  "Uštedi pri svakoj kupnji!",
  "Nikad ne propusti akciju!",
  "Zaboravi kartice - olakšaj novčanik!",
  "Izradi i podijeli popis za kupnju!",
  "Prati povijest cijena!",
  "Skeniraj barkod i usporedi cijene!",
  "Uživaj u pametnom kupovanju!",
  "Pronađi najbolje ponude u Hrvatskoj!",
  "Kupuj kvalitetno i jeftino!",
  "Kupuj pametno, uštedi više!",
];

function getTagLine(): string {
  const randomIndex = Math.floor(Math.random() * tagLines.length);
  return tagLines[randomIndex];
}

export default function HeroSection() {
  const tagLine: string = getTagLine();

  return (
    <section className="min-h-[80dvh] relative flex items-center">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-10">
          {/* Left side - Logo and text */}
          <div className="flex-1 text-center space-y-6">
            {/* App logo */}
            <Image
              src="/disscount-logo.png"
              alt="Disscount logo"
              width={512}
              height={512}
              className="mx-auto w-32 sm:w-48"
            />

            <h1 className="text-4xl sm:text-6xl text-primary font-bold">
              Disscount
            </h1>

            <p className="uppercase max-w-md mx-auto text-pretty text-md sm:text-lg">
              {tagLine}
            </p>
          </div>

          {/* Right side - Waitlist card */}
          <div className="flex-1">
            <WaitlistCard />
          </div>
        </div>
      </div>
    </section>
  );
}
