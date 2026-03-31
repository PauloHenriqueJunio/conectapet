import { AdoptionStatus, PrismaClient, Role } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("123456", 12);

  await prisma.adoptionRequest.deleteMany();
  await prisma.pet.deleteMany();
  await prisma.user.deleteMany();

  const ongAmorAnimal = await prisma.user.create({
    data: {
      name: "ONG Amor Animal",
      email: "ong@conectapet.dev",
      passwordHash,
      cep: "01310100",
      state: "SP",
      city: "Sao Paulo",
      contact: "(11) 98888-1111",
      address: "Av. Paulista, 1000 - Bela Vista",
      cnpj: "12345678000190",
      role: Role.ONG,
    },
  });

  const ongPatasUnidas = await prisma.user.create({
    data: {
      name: "ONG Patas Unidas",
      email: "ong2@conectapet.dev",
      passwordHash,
      cep: "30130010",
      state: "MG",
      city: "Belo Horizonte",
      contact: "(31) 97777-2222",
      address: "Rua dos Animais, 250 - Funcionarios",
      cnpj: "55443322000166",
      role: Role.ONG,
    },
  });

  const ongLarDosBichos = await prisma.user.create({
    data: {
      name: "ONG Lar dos Bichos",
      email: "ong3@conectapet.dev",
      passwordHash,
      cep: "80010000",
      state: "PR",
      city: "Curitiba",
      contact: "(41) 96666-3333",
      address: "Rua das Flores, 88 - Centro",
      cnpj: "66778899000155",
      role: Role.ONG,
    },
  });

  const ongVidaAnimal = await prisma.user.create({
    data: {
      name: "ONG Vida Animal",
      email: "ong4@conectapet.dev",
      passwordHash,
      cep: "40010000",
      state: "BA",
      city: "Salvador",
      contact: "(71) 95555-4444",
      address: "Avenida do Porto, 420 - Comercio",
      cnpj: "11223344000177",
      role: Role.ONG,
    },
  });

  const adopterOne = await prisma.user.create({
    data: {
      name: "Paula Costa",
      email: "adotante1@conectapet.dev",
      passwordHash,
      cep: "30130010",
      cpf: "12345678901",
      role: Role.PESSOA_FISICA,
    },
  });

  const adopterTwo = await prisma.user.create({
    data: {
      name: "Lucas Silva",
      email: "adotante2@conectapet.dev",
      passwordHash,
      cep: "20040002",
      cpf: "98765432100",
      role: Role.PESSOA_FISICA,
    },
  });

  const petsData = [
    {
      name: "Luna",
      species: "Gato",
      sex: "Fêmea",
      size: "Pequeno",
      age: 2,
      description: "Brincalhona e carinhosa, adora colo e janelas ensolaradas.",
      isCastrated: true,
      hasVaccineFeline: true,
      hasVaccineFelv: false,
      isDewormed: true,
      ongId: ongAmorAnimal.id,
      photoUrl:
        "https://res.cloudinary.com/du0yit3co/image/upload/v1774626180/7-racas-de-gato-com-filhotes-muito-fofos-1024x683_gmycfo.jpg",
    },
    {
      name: "Thor",
      species: "Cão",
      sex: "Macho",
      size: "Grande",
      age: 4,
      description: "Companheiro fiel, excelente para familias com criancas.",
      hasVaccineV8: true,
      hasVaccineGiardia: false,
      hasVaccineFlu: true,
      hasVaccineRabies: true,
      ongId: ongPatasUnidas.id,
      photoUrl:
        "https://res.cloudinary.com/du0yit3co/image/upload/v1774626180/si_cachorroinstagram_home_nleqiz.webp",
    },
    {
      name: "Mia",
      species: "Gato",
      sex: "Fêmea",
      size: "Pequeno",
      age: 1,
      description: "Filhote curiosa, sociavel com outros pets.",
      hasHistoryOfIllness: true,
      illnessDescription:
        "Teve rinotraqueíte filhote, já 100% curada e saudável.",
      ongId: ongLarDosBichos.id,
      photoUrl:
        "https://res.cloudinary.com/du0yit3co/image/upload/v1774626179/images_hvoalt.jpg",
    },
    {
      name: "Bob",
      species: "Cão",
      sex: "Macho",
      size: "Médio",
      age: 3,
      description: "Muito amigavel, ama passeios e brinquedos de corda.",
      ongId: ongVidaAnimal.id,
      photoUrl:
        "https://res.cloudinary.com/du0yit3co/image/upload/v1774626367/foto-inusitada-cachorro-vieler-18_z5wchg.webp",
    },
    {
      name: "Nina",
      species: "Cão",
      sex: "Fêmea",
      size: "Pequeno",
      age: 5,
      description: "Calma e obediente, ideal para apartamento.",
      hasOtherHealthInfo: true,
      otherHealthInfoDescription:
        "Alergia a carne bovina, deve comer apenas ração de frango ou salmão.",
      ongId: adopterOne.id,
      photoUrl:
        "https://res.cloudinary.com/du0yit3co/image/upload/v1774626179/_image_rsid7p.webp",
    },
    {
      name: "Simba",
      species: "Gato",
      sex: "Macho",
      size: "Médio",
      age: 2,
      description: "Gato tranquilo, se adapta bem a novos ambientes.",
      isCastrated: true,
      ongId: adopterTwo.id,
      photoUrl:
        "https://res.cloudinary.com/du0yit3co/image/upload/v1774626280/1704202114_65940f822b648_hd_krzt8l.jpg",
    },
    {
      name: "Mel",
      species: "Cão",
      sex: "Fêmea",
      size: "Médio",
      age: 1,
      description: "Energica e alegre, perfeita para quem gosta de atividade.",
      ongId: ongAmorAnimal.id,
      photoUrl:
        "https://res.cloudinary.com/du0yit3co/image/upload/v1774626279/golden-retriever-1_qd1ihh.webp",
    },
    {
      name: "Pingo",
      species: "Gato",
      sex: "Macho",
      size: "Grande",
      age: 6,
      description: "Adulto docil, prefere ambientes silenciosos.",
      isDewormed: true,
      ongId: ongPatasUnidas.id,
      photoUrl:
        "https://res.cloudinary.com/du0yit3co/image/upload/v1774626280/cat-pictures-sdue47hg2msymih2_qjxbti.jpg",
    },
  ];

  const pets = [];
  for (const petData of petsData) {
    const pet = await prisma.pet.create({
      data: petData,
    });
    pets.push(pet);
  }

  await prisma.adoptionRequest.create({
    data: {
      petId: pets[0].id,
      adopterId: adopterOne.id,
      message: "Tenho experiencia com gatos e moro em apartamento telado.",
      status: AdoptionStatus.PENDING,
    },
  });

  await prisma.adoptionRequest.create({
    data: {
      petId: pets[1].id,
      adopterId: adopterTwo.id,
      message: "Tenho quintal e rotina ideal para passeios diarios.",
      status: AdoptionStatus.PENDING,
    },
  });

  await prisma.adoptionRequest.create({
    data: {
      petId: pets[2].id,
      adopterId: adopterTwo.id,
      message: "Ja tenho um gato sociavel e gostaria de adotar a Mia.",
      status: AdoptionStatus.REJECTED,
    },
  });

  await prisma.adoptionRequest.create({
    data: {
      petId: pets[3].id,
      adopterId: adopterOne.id,
      message: "Posso oferecer lar com espaco e tempo para adaptacao.",
      status: AdoptionStatus.APPROVED,
    },
  });

  await prisma.pet.update({
    where: { id: pets[3].id },
    data: { isAdopted: true },
  });

  console.log("Seed finalizado com sucesso.");
  console.log("Usuarios de teste (senha: 123456):");
  console.log("- ONG: ong@conectapet.dev");
  console.log("- ONG: ong2@conectapet.dev");
  console.log("- ONG: ong3@conectapet.dev");
  console.log("- ONG: ong4@conectapet.dev");
  console.log("- ADOTANTE: adotante1@conectapet.dev");
  console.log("- ADOTANTE: adotante2@conectapet.dev");
}

main()
  .catch((error) => {
    console.error("Erro no seed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
