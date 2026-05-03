"use client";

import { use, useRef, useState } from "react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { useOngDetails } from "@/hooks/useOngDetails";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { LoadingState, ErrorState } from "@/components/ong/OngPageStates";
import { CopyToastNotification } from "@/components/ong/CopyToastNotification";
import { OngHeroSection } from "@/components/ong/OngHeroSection";
import { OngMainContent } from "@/components/ong/OngMainContent";
import { PetsSection } from "@/components/ong/PetsSection";

interface OngDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function OngDetailsPage({ params }: OngDetailsPageProps) {
  const { id } = use(params);

  // Data and loading states
  const { ong, pets, loading, error } = useOngDetails(id);

  // UI states
  const [isFavorited, setIsFavorited] = useState(false);
  const { copiedPhone, toastVisible, toastExiting, handleCopyPhone } =
    useCopyToClipboard();

  // Refs
  const petsSectionRef = useRef<HTMLElement | null>(null);

  // Handlers
  const handleScrollToPets = () => {
    petsSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  // Loading state
  if (loading) {
    return <LoadingState />;
  }

  // Error state
  if (error || !ong) {
    return <ErrorState error={error} />;
  }

  // Success state
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader page="ongs" variant="public" />

      {/* Toast Notification */}
      <CopyToastNotification visible={toastVisible} exiting={toastExiting} />

      <main className="flex-1">
        {/* Hero Section */}
        <OngHeroSection
          ong={ong}
          isFavorited={isFavorited}
          onFavoriteToggle={() => setIsFavorited(!isFavorited)}
        />

        {/* Main Content - Contact & About */}
        <OngMainContent
          ong={ong}
          copiedPhone={copiedPhone}
          onCopyPhone={handleCopyPhone}
          onScrollToPets={handleScrollToPets}
        />

        {/* Pets Section */}
        <PetsSection pets={pets} ong={ong} petsSectionRef={petsSectionRef} />
      </main>

      <SiteFooter />
    </div>
  );
}
