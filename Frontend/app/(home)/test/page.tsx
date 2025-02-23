import Image from "next/image";
import React from "react";
import { Timeline } from "@/components/ui/timeline";

export default function TimelineDemo() {
  const data = [
    {
      title: "Helmikuu 2025",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
            Paitojen suunnittelu alkoi. 
          </p>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
            Paitoja alettiin suunnitelemaan Sepen ja Leksan toimesta. Suunnittelu oli yksi työmaa, jota ei auttanut vaativa johtoryhmä ja aivan paska 
            softa, jolla suunnittelu tehtiin.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Image
              src="/logo.svg"
              alt="startup template"
              width={500}
              height={500}
              className="rounded-lg object-cover w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
            <Image
              src="/logo.svg"
              alt="startup template"
              width={500}
              height={500}
              className="rounded-lg object-cover w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
            <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal">
              Havainnoivat kuvat paidoista. 
            </p>
       
          </div>
        </div>
      ),
    },
    {
      title: "Tammikuu 2025",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
            Ensimmäiset versiot Rouhijoiden logosta ja väreistä näkivät päivänvalon.
          </p>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
            Ne eivät ole mitään taidetta, mutta onpa sentään jotain.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Image
              src="/logo.svg"
              alt="Logo"
              width={200}
              height={200}
              className="rounded-lg object-cover  w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
            <Image
              src="/logo.svg"
              alt="feature template"
              width={500}
              height={500}
              className="rounded-lg object-cover w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
            <Image
              src="/logo.svg"
              alt="bento template"
              width={500}
              height={500}
              className="rounded-lg object-cover w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
            <p className="col-span-2">Ensimmäinen versio logosta. Tämä on jotain aivan järkyttävää :D</p>
          </div>
        </div>
      ),
    },
    {
      title: "Joulukuu 2024",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-4">
            Idea Rouhijoiden perustamisesta syntyi Raisiossa sijaitsevassa kodassa.
          </p>
          <div className="mb-8">
            <div className="flex gap-2 items-center text-neutral-700 dark:text-neutral-300 text-xs md:text-sm">
              Tällöin perustajat päättivät, että heidän on aika tehdä jotain suurempaa.
              Ensimmäisiä kiinnityksiä joukkueeseen alettin jo tekemään ja juttu lensi.
            </div>
          </div>
          
        </div>
      ),
    },
  ];
  return (
    <div className="w-full">
      <Timeline data={data} />
    </div>
  );
}
