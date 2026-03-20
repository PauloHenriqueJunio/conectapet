import { AdoptionStatus, PrismaClient, Role } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("123456", 12);

  await prisma.adoptionRequest.deleteMany();
  await prisma.pet.deleteMany();
  await prisma.user.deleteMany();

  const ong = await prisma.user.create({
    data: {
      name: "ONG Amor Animal",
      email: "ong@conectapet.dev",
      passwordHash,
      cnpj: "12345678000190",
      role: Role.ONG,
    },
  });

  const adopterOne = await prisma.user.create({
    data: {
      name: "Paula Costa",
      email: "adotante1@conectapet.dev",
      passwordHash,
      cpf: "12345678901",
      role: Role.ADOTANTE,
    },
  });

  const adopterTwo = await prisma.user.create({
    data: {
      name: "Lucas Silva",
      email: "adotante2@conectapet.dev",
      passwordHash,
      cpf: "98765432100",
      role: Role.ADOTANTE,
    },
  });

  const petsData = [
    {
      name: "Luna",
      species: "Gato",
      age: 2,
      description: "Brincalhona e carinhosa, adora colo e janelas ensolaradas.",
      photoUrl: "",
    },
    {
      name: "Thor",
      species: "Cao",
      age: 4,
      description: "Companheiro fiel, excelente para familias com criancas.",
      photoUrl: "",
    },
    {
      name: "Mia",
      species: "Gato",
      age: 1,
      description: "Filhote curiosa, sociavel com outros pets.",
      photoUrl: "",
    },
    {
      name: "Bob",
      species: "Cao",
      age: 3,
      description: "Muito amigavel, ama passeios e brinquedos de corda.",
      photoUrl: "",
    },
    {
      name: "Nina",
      species: "Cao",
      age: 5,
      description: "Calma e obediente, ideal para apartamento.",
      photoUrl: "",
    },
    {
      name: "Simba",
      species: "Gato",
      age: 2,
      description: "Gato tranquilo, se adapta bem a novos ambientes.",
      photoUrl: "",
    },
    {
      name: "Mel",
      species: "Cao",
      age: 1,
      description: "Energica e alegre, perfeita para quem gosta de atividade.",
      photoUrl: "",
    },
    {
      name: "Pingo",
      species: "Gato",
      age: 6,
      description: "Adulto docil, prefere ambientes silenciosos.",
      photoUrl: "",
    },
  ];

  const pets = [];
  for (const petData of petsData) {
    const pet = await prisma.pet.create({
      data: {
        ...petData,
        ongId: ong.id,
      },
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
