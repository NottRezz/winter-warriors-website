"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { PointerEvent } from "react";
import { tournament } from "@/data/tournament";
import { asset } from "@/lib/asset";
import { Countdown } from "./countdown";
import { IceBackdrop } from "./ice-backdrop";
import { Snow } from "./snow";

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
});

export function Hero() {
  const reduceMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const rotateY = useSpring(useTransform(pointerX, [-0.5, 0.5], [-5, 5]), {
    stiffness: 110,
    damping: 18,
  });
  const rotateX = useSpring(useTransform(pointerY, [-0.5, 0.5], [4, -4]), {
    stiffness: 110,
    damping: 18,
  });

  const tilt = (event: PointerEvent<HTMLElement>) => {
    if (reduceMotion || event.pointerType !== "mouse") return;
    const box = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - box.left) / box.width - 0.5);
    pointerY.set((event.clientY - box.top) / box.height - 0.5);
  };

  return (
    <section
      onPointerMove={tilt}
      className="relative isolate overflow-hidden bg-[radial-gradient(70%_70%_at_74%_38%,var(--color-plum-700),var(--color-plum-900)_55%,var(--color-plum-950)_100%)]"
    >
      <IceBackdrop rink={false} className="text-ice-100/[0.07]" />
      <Snow />

      <div className="section relative grid items-center gap-3 pt-4 pb-5 sm:gap-6 sm:pt-8 sm:pb-8 lg:min-h-[calc(100svh-9.5rem)] lg:grid-cols-[1.05fr_1fr] lg:gap-8 lg:py-16">
        <div className="text-center lg:text-left">
          <motion.p {...rise(0.05)} className="eyebrow">
            Raiders {tournament.division} hockey tournament
          </motion.p>

          <motion.h1
            {...rise(0.12)}
            className="display mt-2 text-[clamp(2.375rem,9.5vw,6.25rem)] lg:mt-4 text-white"
          >
            Winter Warriors
          </motion.h1>

          <motion.p {...rise(0.2)} className="mt-2 text-ice-200 sm:text-xl lg:mt-6">
            {tournament.dateLabel}
            <span aria-hidden className="mx-2.5 hidden text-ice-300 sm:inline">
              ·
            </span>
            <br className="sm:hidden" />
            {tournament.venue.name}, Calgary
          </motion.p>

          <motion.div
            {...rise(0.28)}
            className="mt-9 hidden flex-wrap items-center justify-center gap-x-7 gap-y-4 lg:flex lg:justify-start"
          >
            <Link href="/schedule" className="btn">
              View schedule
            </Link>
            <Link href="/teams" className="text-link">
              Meet the teams
              <ArrowRight aria-hidden className="size-4" />
            </Link>
          </motion.div>
        </div>

        <motion.div
          // No fade-in: it is the first thing to see on a slow arena connection.
          style={{ rotateX, rotateY, transformPerspective: 1100 }}
          className="order-first mx-auto w-full max-w-[11rem] sm:max-w-[18rem] lg:order-none lg:max-w-none"
        >
          <Image
            src={asset("/logos/crest.webp")}
            alt="Raiders Winter Warriors crest: a bearded pirate over crossed hockey sticks, dated November 28 to 29, 2026"
            width={1330}
            height={907}
            loading="eager"
            fetchPriority="high"
            decoding="sync"
            className="h-auto w-full"
          />
        </motion.div>
      </div>

      <div className="relative border-t border-white/10 bg-ink/40 backdrop-blur-sm">
        <div className="section py-2.5 lg:py-4">
          <Countdown />
        </div>
      </div>
    </section>
  );
}
