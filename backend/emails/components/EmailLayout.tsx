import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import * as React from "react";

type EmailLayoutProps = {
  previewText: string;
  children: React.ReactNode;
};

export const emailClasses = {
  heading: "text-slate-100",
  text: "text-slate-400",
  muted: "text-slate-500",
};

const APP_URL = process.env.APP_URL ?? "https://conectapet.com";
const LOGO_URL =
  "https://res.cloudinary.com/du0yit3co/image/upload/v1788133452/conectapet/email-assets/logo-header-dark.png";

export function EmailLayout({ previewText, children }: EmailLayoutProps) {
  return (
    <Html lang="pt-BR">
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                brand: {
                  50: "#effbf3",
                  100: "#d9f5e2",
                  600: "#1f7f46",
                  700: "#1a6539",
                },
                slate: {
                  100: "#f0f2f7",
                  400: "#9ba3bb",
                  500: "#5e6680",
                  700: "#2e3447",
                  800: "#1a1f2e",
                  900: "#0f1117",
                },
              },
            },
          },
        }}
      >
        <Body className="bg-slate-900 py-10 font-sans">
          <Container className="mx-auto max-w-[480px] rounded-2xl border border-slate-700 bg-slate-800 p-8">
            <Section className="mb-6 text-center">
              <Img
                src={LOGO_URL}
                alt="ConectaPet"
                width="217"
                height="37"
                className="mx-auto"
              />
            </Section>

            {children}

            <Hr className="my-8 border-slate-700" />

            <Text className="m-0 text-center text-xs text-slate-500">
              © {new Date().getFullYear()} ConectaPet. Adoção responsável
              começa com informação.
            </Text>
            <Text className="m-0 mt-2 text-center text-xs text-slate-500">
              <Link href={`${APP_URL}/termos-de-uso`} className="text-slate-500 underline">
                Termos de Uso
              </Link>
              {" · "}
              <Link
                href={`${APP_URL}/politica-de-privacidade`}
                className="text-slate-500 underline"
              >
                Política de Privacidade
              </Link>
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
