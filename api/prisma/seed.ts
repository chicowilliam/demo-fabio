import { prisma } from "../src/utils/prisma.js";

async function main() {
  const supermarkets = [
    {
      name: "Supermercado Central",
      city: "Sao Paulo",
      state: "SP",
      address: "Av. Paulista, 1000",
      phone: "+55 11 4000-1000",
      distance: 1.2,
      rating: 4.6,
      reviews: 842,
      hours: "08:00 - 22:00",
      hasDelivery: true,
      services: ["Padaria", "Acougue", "Hortifruti"],
    },
    {
      name: "Mercado Bairro Sul",
      city: "Curitiba",
      state: "PR",
      address: "Rua das Flores, 245",
      phone: "+55 41 3000-2200",
      distance: 2.8,
      rating: 4.4,
      reviews: 391,
      hours: "07:30 - 21:30",
      hasDelivery: true,
      services: ["Farmacia", "Adega", "Estacionamento"],
    },
    {
      name: "Hiper Norte",
      city: "Belo Horizonte",
      state: "MG",
      address: "Av. Amazonas, 8890",
      phone: "+55 31 3555-8899",
      distance: 4.1,
      rating: 4.2,
      reviews: 528,
      hours: "08:00 - 23:00",
      hasDelivery: false,
      services: ["Eletronicos", "Atacado", "Laticinios"],
    },
  ];

  await prisma.supermarket.deleteMany();
  await prisma.supermarket.createMany({ data: supermarkets });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
