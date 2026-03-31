import { Metadata } from "next";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

type Props = {
  params: Promise<{ id: string }>;
};

// SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { id } = await params;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    const res = await fetch(`${apiUrl}/pets/${id}`);
    const pet = await res.json();

    if (!pet || !pet.name || pet.statusCode) {
      return { title: "Pet não encontrado | ConectaPet" };
    }

    return {
      title: `Adote ${pet.name} | ConectaPet`,
      description:
        pet.description ||
        `Conheça o(a) ${pet.name}, um ${pet.species} que precisa de um lar cheio de amor!`,
      openGraph: {
        title: `Adote o(a) ${pet.name}!`,
        description: `O(A) ${pet.name} está esperando por uma família no ConectaPet. Clique para conhecer a história!`,
        images: [
          {
            url:
              pet.photoUrl ||
              "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=1200",
            width: 1200,
            height: 630,
            alt: `Foto do(a) ${pet.name}`,
          },
        ],
      },
    };
  } catch (error) {
    return { title: "Adote um Pet | ConectaPet" };
  }
}

export default function PetProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50/50">
      <SiteHeader page="pet-profile" variant="pessoa-fisica" />

      <main className="flex-1">{children}</main>

      <SiteFooter />
    </div>
  );
}
