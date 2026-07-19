import type { Metadata } from "next";
import { OrderResultBody } from "@/components/pages/OrderResultBody";

export const metadata: Metadata = {
  title: "Payment Result",
  robots: { index: false, follow: false },
};

export default async function Page({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  return <OrderResultBody locale="en" status={status} />;
}
