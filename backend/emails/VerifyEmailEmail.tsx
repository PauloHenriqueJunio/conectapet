import { Button, Heading, Section, Text } from "@react-email/components";
import * as React from "react";
import { EmailLayout, emailClasses } from "./components/EmailLayout";

type VerifyEmailEmailProps = {
  name: string;
  verifyUrl: string;
};

export default function VerifyEmailEmail({
  name = "Paulo",
  verifyUrl = "https://conectapet.com/verificar-email?token=exemplo",
}: VerifyEmailEmailProps) {
  return (
    <EmailLayout previewText="Confirme seu e-mail no ConectaPet">
      <Heading className={`m-0 text-xl font-bold ${emailClasses.heading}`}>
        Confirme seu e-mail
      </Heading>

      <Text className={`mt-4 text-sm leading-6 ${emailClasses.text}`}>
        Olá, {name}. Falta só um passo para ativar sua conta no ConectaPet.
        Clique no botão abaixo para confirmar seu endereço de e-mail.
      </Text>

      <Section className="my-6 text-center">
        <Button
          href={verifyUrl}
          className="rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white"
        >
          Confirmar e-mail
        </Button>
      </Section>

      <Text className={`text-sm leading-6 ${emailClasses.text}`}>
        Se você não criou uma conta no ConectaPet, pode ignorar este e-mail.
      </Text>

      <Text className={`mt-4 text-xs leading-5 ${emailClasses.muted}`}>
        Este link expira em 24 horas por motivos de segurança.
      </Text>
    </EmailLayout>
  );
}
