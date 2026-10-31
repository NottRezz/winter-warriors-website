import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { ScheduleBoard } from "@/components/schedule-board";
import { tournament } from "@/data/tournament";

export const metadata: Metadata = { title: "Schedule & Scores" };

export default function SchedulePage() {
  return (
    <>
      <PageHeader eyebrow={tournament.dateLabel} title="Schedule & Scores">
        Game times, final scores and live standings for the weekend.
      </PageHeader>
      <div className="section py-12 sm:py-16">
        <ScheduleBoard />
      </div>
    </>
  );
}
