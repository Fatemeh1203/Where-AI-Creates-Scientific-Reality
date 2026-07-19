import type { Metadata } from "next";
import { OrderResultBody } from "@/components/pages/OrderResultBody";

export const metadata: Metadata = {
  title: "نتیجه پرداخت",
  robots: { index: false, follow: false },
};

export default async function Page({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  return <OrderResultBody locale="fa" status={status} />;
}
