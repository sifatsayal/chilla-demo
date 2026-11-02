import { ChillaHeader } from "@/components/workspace/ChillaHeader";

// Every Chilla app tab (Messages, Directory, …) shares this header.
export default function ChillaAppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ChillaHeader />
      {children}
    </>
  );
}
