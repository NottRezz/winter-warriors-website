import type { Metadata } from "next";
import { AdminPanel } from "@/components/admin-panel";

export const metadata: Metadata = {
  title: "Scorekeeper",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <section className="section max-w-3xl py-6 sm:py-12">
      <AdminPanel />
    </section>
  );
}
