import { notFound } from "next/navigation";
import { channels } from "@/data/workspace";
import { ChannelView } from "@/components/chat/ChannelView";

export function generateStaticParams() {
  return channels.map((c) => ({ slug: c.slug }));
}

export default async function ChannelPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const channel = channels.find((c) => c.slug === slug);
  if (!channel) notFound();
  return <ChannelView channel={channel} />;
}
