// Textos e Constantes - Página de ONG
export const ONG_CONSTANTS = {
  HERO: {
    BADGE: "ONG parceira",
    DESCRIPTION: "Dedicados ao resgate, reabilitação e adoção responsável de animais em situação de vulnerabilidade. Transformando vidas, uma pata da cada vez, na região metropolitana de Belo Horizonte.",
  },

  CONTACT: {
    TITLE: "Entre em contato",
    DESCRIPTION: "Fale diretamente com a ONG usando o canal mais rápido para a sua necessidade.",
    PHONE: {
      LABEL: "Telefone",
      CALL_BTN: "Chamar",
      COPY_BTN: "Copiar",
      COPIED: "Copiado!",
    },
    LOCATION: {
      LABEL: "Localização",
      VIEW_MAPS: "Ver no Maps",
    },
    EMAIL: {
      LABEL: "Email",
      SEND_BTN: "Enviar Email",
      COPY_BTN: "Copiar",
    },
  },

  ABOUT: {
    TITLE: "Sobre a ONG",
    VOLUNTEERS_LABEL: "Equipe de voluntários ativos",
    PARAGRAPHS: {
      ONE: "Fundada em 2015, a ONG {{ONG_NAME}} nasceu de um coletivo de transformar a realidade de cães e gatos abandonados nas ruas de Belo Horizonte. Acreditamos que cada animal merece uma segunda chance: um abrigo e cuidados veterinários adequados.",
      TWO: "Nossa equipe é formada por voluntários apaixonados, veterinários parceiros e educadores caninos que trabalham incansavelmente para reabilitar nossos resgatados, tanto física quanto emocionalmente.",
      THREE: "Não possuímos abrigo próprio de grande porte. Trabalhamos principalmente com um sistema de lares temporários, o que permite uma adaptação mais fluida dos animais ao convívio doméstico e familiar antes de encontrarem suas famílias de acolhimento para sempre.",
    },
  },

  CTA: {
    ADOPT: {
      TITLE: "Quer adotar?",
      DESCRIPTION: "Temos dezenas de cães e gatos esperando por um lar amoroso.",
      BUTTON: "Ver Pets Disponíveis",
    },
    SPONSOR: {
      TITLE: "Seja um Padrinho",
      DESCRIPTION: "Ajude a custear os cuidados dos animais que ainda não foram adotados.",
      BUTTON: "Fazer Doação",
    },
  },

  PETS: {
    SECTION_LABEL: "Pets disponíveis para adoção",
    TOUCH_HINT: "Toque no pet para ver o perfil completo e iniciar a adoção.",
    STATUS_AVAILABLE: "Disponível",
    VIEW_PROFILE: "Ver perfil do pet",
    EMPTY: {
      TITLE: "Nenhum pet disponível no momento",
      DESCRIPTION: "Essa ONG ainda não publicou pets para adoção.",
    },
  },

  ERRORS: {
    NOT_FOUND_TITLE: "ONG não encontrada",
    NOT_FOUND_MESSAGE: "A ONG solicitada não existe.",
    LOAD_ERROR: "Erro ao carregar ONG",
    BACK_TO_ONGS: "Voltar para ONGs",
  },

  TOAST: {
    PHONE_COPIED: "Número copiado para a área de transferência.",
  },

  API: {
    ONGS_ENDPOINT: "/auth/ongs",
    PETS_ENDPOINT: (ongId: string) => `/pets/ong/${ongId}/available`,
  },

  HERO_BG_IMAGE: "https://images.unsplash.com/photo-1639494824163-f6935be23149?q=80&w=1228&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",

  TOAST_TIMING: {
    HIDE_DELAY: 2000,
    EXIT_DURATION: 300,
  },
};

export type ONG = {
  id: string;
  name: string;
  email?: string;
  contact: string | null;
  cep?: string;
  state: string | null;
  city: string | null;
  address?: string | null;
};

export type Pet = {
  id: string;
  name: string;
  species: string;
  age: number;
  photoUrl: string;
  isAdopted: boolean;
};
