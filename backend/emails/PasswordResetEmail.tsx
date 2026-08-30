import { Button, Heading, Section, Text } from "@react-email/components";
import * as React from "react";
import { EmailLayout, emailClasses } from "./components/EmailLayout";

type PasswordResetEmailProps = {
  name: string;
  resetUrl: string;
};

export default function PasswordResetEmail({
  name = "Paulo",
  resetUrl = "https://conectapet.com/redefinir-senha?token=exemplo",
}: PasswordResetEmailProps) {
  return (
    <EmailLayout previewText="Redefina sua senha do ConectaPet">
      <Heading className={`m-0 text-xl font-bold ${emailClasses.heading}`}>
        Redefinir senha
      </Heading>

      <Text className={`mt-4 text-sm leading-6 ${emailClasses.text}`}>
        Olá, {name}. Recebemos uma solicitação para redefinir a senha da sua
        conta no ConectaPet. Clique no botão abaixo para escolher uma nova
        senha.
      </Text>

      <Section className="my-6 text-center">
        <Button
          href={resetUrl}
          className="rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white"
        >
          Redefinir senha
        </Button>
      </Section>

      <Text className={`text-sm leading-6 ${emailClasses.text}`}>
        Se você não solicitou essa alteração, pode ignorar este e-mail, sua
        senha continuará a mesma.
      </Text>

      <Text className={`mt-4 text-xs leading-5 ${emailClasses.muted}`}>
        Este link expira em 1 hora por motivos de segurança.
      </Text>
    </EmailLayout>
  );
}
