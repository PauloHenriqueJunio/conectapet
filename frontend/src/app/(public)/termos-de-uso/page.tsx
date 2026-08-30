export default function TermosDeUsoPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <span className="inline-flex rounded-full bg-brand-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-brand-700">
        Legal
      </span>
      <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-900">
        Termos de Uso
      </h1>
      <p className="mt-2 text-sm text-slate-500">
        Última atualização: 30 de agosto de 2026
      </p>

      <div className="mt-8 space-y-8 rounded-[1.75rem] border border-slate-200/80 bg-white p-8 shadow-sm sm:p-10">
        <section>
          <h2 className="text-lg font-semibold text-slate-900">
            1. Aceitação dos termos
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Ao criar uma conta ou utilizar o ConectaPet, você concorda com
            estes Termos de Uso e com a nossa{" "}
            <a
              href="/politica-de-privacidade"
              className="font-semibold text-brand-700 hover:underline"
            >
              Política de Privacidade
            </a>
            . Caso não concorde com alguma condição, não utilize a
            plataforma.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">
            2. Sobre a plataforma
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            O ConectaPet é uma plataforma que conecta ONGs, protetores
            independentes e pessoas interessadas em adoção responsável de
            animais. A plataforma atua como intermediária de divulgação e
            contato, não sendo parte da relação de adoção estabelecida
            diretamente entre quem disponibiliza o animal e quem deseja
            adotar.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">
            3. Cadastro e responsabilidade pelas informações
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Para utilizar determinadas funcionalidades, é necessário criar
            uma conta informando dados como nome, e-mail, senha, CEP,
            contato e, quando aplicável, CPF ou CNPJ e endereço. Você é
            responsável por manter esses dados atualizados e verdadeiros, e
            por preservar a confidencialidade da sua senha.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">
            4. Regras de conduta
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Ao usar o ConectaPet, você concorda em não publicar informações
            falsas ou enganosas sobre animais ou sobre si mesmo, não usar a
            plataforma para fins comerciais de venda de animais, e em tratar
            outros usuários, ONGs e animais com respeito e responsabilidade.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">
            5. Conteúdo enviado pelo usuário
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Fotos, descrições e demais conteúdos enviados para cadastrar um
            pet ou perfil são de responsabilidade de quem os publica. O
            ConectaPet pode remover conteúdos que violem estes termos ou a
            legislação vigente.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">
            6. Limitação de responsabilidade
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            O ConectaPet não garante a veracidade das informações fornecidas
            por ONGs ou usuários, nem se responsabiliza por eventuais danos
            decorrentes de contatos ou adoções realizadas a partir da
            plataforma. A adoção é uma decisão e responsabilidade das partes
            envolvidas.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">
            7. Encerramento de conta
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Você pode excluir sua conta a qualquer momento pelas
            configurações de perfil. O ConectaPet também pode suspender ou
            encerrar contas que violem estes Termos de Uso.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">
            8. Alterações destes termos
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Estes Termos de Uso podem ser atualizados periodicamente. Mudanças
            relevantes serão comunicadas na plataforma, e o uso continuado do
            ConectaPet após a atualização representa concordância com os
            novos termos.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">9. Contato</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Dúvidas sobre estes Termos de Uso podem ser enviadas pelos canais
            de contato disponibilizados na plataforma.
          </p>
        </section>
      </div>
    </div>
  );
}
