import type { Metadata } from "next";
import { OrderBody } from "@/components/pages/OrderBody";
import { getContent } from "@/content";

const c = getContent("fa");

export const metadata: Metadata = {
  title: `${c.order.title} — ${c.nav.brand}`,
  description: c.order.subtitle,
  alternates: { languages: { en: "/order", fa: "/fa/order" } },
};

export default function Page() {
  return <OrderBody locale="fa" />;
}
