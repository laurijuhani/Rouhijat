import Image from "next/image";
import React from "react";
import { Timeline } from "@/components/ui/timeline";

export default function History() {
  const data = [
    {
      title: "Helmikuu 2025",
      content: (
        <div>
          <p className="text-xs md:text-sm font-normal mb-8">
            Paitojen suunnittelu alkoi. 
          </p>
          <p className="text-xs md:text-sm font-normal mb-8">
            Paitoja alettiin suunnitelemaan Sepen ja Leksan toimesta. Suunnittelu oli yksi työmaa, jota ei auttanut vaativa johtoryhmä ja aivan paska 
            softa, jolla suunnittelu tehtiin.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Image
              src="/history/paita_etu.png"
              alt="startup template"
              width={500}
              height={500}
              className="rounded-lg object-cover w-full "
            />
            <Image
              src="/history/paita_taka.png"
              alt="startup template"
              width={500}
              height={500}
              className="rounded-lg object-cover w-full"
            />
            <p className="text-xs md:text-sm font-normal">
              Havainnollistavat kuvat paidoista.
            </p>
       
          </div>
        </div>
      ),
    },
    {
      title: "Tammikuu 2025",
      content: (
        <div>
          <p className="text-xs md:text-sm font-normal mb-8">
            Ensimmäiset versiot Rouhijoiden logosta ja väreistä näkivät päivänvalon.
          </p>
          <p className="text-xs md:text-sm font-normal mb-8">
            Ne eivät ole mitään taidetta, mutta onpa sentään jotain.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Image
              src="/logo.svg"
              alt="Logo"
              width={200}
              height={200}
              className="rounded-lg object-cover  w-full"
            />
            <Image
              src="/logo.svg"
              alt="feature template"
              width={500}
              height={500}
              className="rounded-lg object-cover w-full"
            />
            <Image
              src="/history/shredders.svg"
              alt="bento template"
              width={500}
              height={500}
              className="rounded-lg object-cover w-full"
            />
            <p className="text-neutral-200 text-xs md:text-sm font-normal mb-8 col-span-2">Ensimmäinen versio logosta. Tämä on jotain aivan järkyttävää :D</p>
          </div>
        </div>
      ),
    },
    {
      title: "Joulukuu 2024",
      content: (
        <div>
          <p className="text-xs md:text-sm font-normal mb-4">
            Idea Rouhijoiden perustamisesta syntyi Raisiossa sijaitsevassa kodassa.
          </p>
          <div className="mb-8">
            <div className="flex gap-2 items-center text-xs md:text-sm">
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
