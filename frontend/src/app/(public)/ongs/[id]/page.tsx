interface OngDetailsPageProps {
  params: {
    id: string;
  };
}

export default function OngDetailsPage({ params }: OngDetailsPageProps) {
  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-16 text-center">
      <h1 className="text-2xl font-bold text-slate-900">
        Pagina em construcao
      </h1>
      <p className="mt-3 text-sm text-slate-600">
        A pagina de detalhes da ONG {params.id} ainda nao foi implementada.
      </p>
    </main>
  );
}
