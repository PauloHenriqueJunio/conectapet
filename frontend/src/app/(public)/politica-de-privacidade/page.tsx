export default function PoliticaDePrivacidadePage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <span className="inline-flex rounded-full bg-emerald-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
        Legal
      </span>
      <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-900">
        Política de Privacidade
      </h1>
      <p className="mt-2 text-sm text-slate-500">
        Última atualização: 30 de agosto de 2026
      </p>

      <div className="mt-8 space-y-8 rounded-[1.75rem] border border-slate-200/80 bg-white p-8 shadow-sm sm:p-10">
        <section>
          <h2 className="text-lg font-semibold text-slate-900">
            1. Quais dados coletamos
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Para viabilizar o cadastro e o uso da plataforma, coletamos dados
            como nome, e-mail, senha (armazenada de forma criptografada),
            CEP e endereço, contato (telefone/WhatsApp) e, quando aplicável,
            CPF ou CNPJ para identificar pessoas físicas e ONGs. Também
            coletamos as informações e fotos enviadas no cadastro de pets e
            de perfil.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">
            2. Para que usamos seus dados
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Usamos seus dados para criar e manter sua conta, exibir pets e
            perfis de ONGs na plataforma, viabilizar o contato entre quem
            deseja adotar e quem disponibiliza o animal, verificar a
            identidade de ONGs cadastradas e cumprir obrigações legais.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">
            3. Com quem compartilhamos dados
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Dados de contato e localização aproximada podem ser exibidos a
            outros usuários da plataforma como parte do funcionamento do
            processo de adoção (por exemplo, para que um adotante entre em
            contato com uma ONG). CPF e CNPJ não são exibidos publicamente e
            são usados apenas para verificação interna. Não vendemos seus
            dados pessoais a terceiros.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">
            4. Armazenamento e segurança
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Adotamos medidas técnicas razoáveis para proteger seus dados,
            como criptografia de senhas e controle de acesso. Nenhum sistema
            é totalmente livre de riscos, mas trabalhamos para manter suas
            informações seguras.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">
            5. Seus direitos (LGPD)
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Nos termos da Lei Geral de Proteção de Dados (Lei nº
            13.709/2018), você pode solicitar a qualquer momento a
            confirmação, o acesso, a correção ou a exclusão dos seus dados
            pessoais. Você também pode excluir sua conta diretamente pelas
            configurações de perfil, o que remove seus dados cadastrais da
            plataforma.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">
            6. Retenção de dados
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Mantemos seus dados enquanto sua conta estiver ativa ou enquanto
            forem necessários para cumprir finalidades legais ou
            regulatórias. Ao excluir sua conta, seus dados cadastrais são
            removidos, ressalvadas obrigações legais de retenção.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">
            7. Alterações desta política
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Esta Política de Privacidade pode ser atualizada periodicamente.
            Mudanças relevantes serão comunicadas na plataforma.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">8. Contato</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Para exercer seus direitos ou tirar dúvidas sobre esta política,
            utilize os canais de contato disponibilizados na plataforma.
          </p>
        </section>
      </div>
    </div>
  );
}
