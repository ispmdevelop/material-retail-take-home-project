import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 12);

  await prisma.$transaction(async (tx) => {
    // ── Aquarius Cosmetics (Nevada) ──
    const aquariusOrg = await tx.organization.create({
      data: {
        name: 'Aquarius Cosmetics',
        owner: {
          create: {
            email: 'ashley@gmail.com',
            name: 'Ashley',
            password: hashedPassword,
          },
        },
      },
    });

    const aquariusProducts = [
      {
        name: 'Forest Green',
        description:
          'A rich, deep green nail polish inspired by Pacific Northwest forests.',
        variants: [
          {
            name: 'Forest Green 5ml',
            price: 8.99,
            variants: { size: '5ml' },
            stock: 3,
            stockAlertBelow: 5,
          },
          {
            name: 'Forest Green 15ml',
            price: 18.99,
            variants: { size: '15ml' },
            stock: 12,
            stockAlertBelow: 5,
          },
          {
            name: 'Forest Green 18ml',
            price: 22.99,
            variants: { size: '18ml' },
            stock: 2,
            stockAlertBelow: 5,
          },
        ],
      },
      {
        name: 'Ruby Red',
        description: 'A classic bold red, perfect for any occasion.',
        variants: [
          {
            name: 'Ruby Red 5ml',
            price: 7.99,
            variants: { size: '5ml' },
            stock: 45,
            stockAlertBelow: 10,
          },
          {
            name: 'Ruby Red 15ml',
            price: 16.99,
            variants: { size: '15ml' },
            stock: 28,
            stockAlertBelow: 10,
          },
          {
            name: 'Ruby Red 18ml',
            price: 19.99,
            variants: { size: '18ml' },
            stock: 8,
            stockAlertBelow: 10,
          },
        ],
      },
      {
        name: 'Midnight Violet',
        description: 'A mysterious dark purple with subtle shimmer.',
        variants: [
          {
            name: 'Midnight Violet 5ml',
            price: 8.49,
            variants: { size: '5ml' },
            stock: 1,
            stockAlertBelow: 5,
          },
          {
            name: 'Midnight Violet 15ml',
            price: 17.49,
            variants: { size: '15ml' },
            stock: 0,
            stockAlertBelow: 5,
          },
        ],
      },
      {
        name: 'Blushing Rose',
        description: 'A soft, feminine pink ideal for spring collections.',
        variants: [
          {
            name: 'Blushing Rose 5ml',
            price: 7.99,
            variants: { size: '5ml' },
            stock: 20,
            stockAlertBelow: 8,
          },
          {
            name: 'Blushing Rose 15ml',
            price: 15.99,
            variants: { size: '15ml' },
            stock: 15,
            stockAlertBelow: 8,
          },
          {
            name: 'Blushing Rose 18ml',
            price: 19.49,
            variants: { size: '18ml' },
            stock: 6,
            stockAlertBelow: 8,
          },
        ],
      },
      {
        name: 'Ocean Blue',
        description: 'A vibrant cerulean that captures the essence of the sea.',
        variants: [
          {
            name: 'Ocean Blue 5ml',
            price: 8.99,
            variants: { size: '5ml' },
            stock: 30,
            stockAlertBelow: 10,
          },
          {
            name: 'Ocean Blue 15ml',
            price: 18.49,
            variants: { size: '15ml' },
            stock: 3,
            stockAlertBelow: 10,
          },
          {
            name: 'Ocean Blue 18ml',
            price: 21.99,
            variants: { size: '18ml' },
            stock: 7,
            stockAlertBelow: 10,
          },
        ],
      },
    ];

    for (const product of aquariusProducts) {
      await tx.product.create({
        data: {
          name: product.name,
          description: product.description,
          organization: { connect: { id: aquariusOrg.id } },
          items: {
            create: product.variants.map((v) => ({
              ...v,
              organization: { connect: { id: aquariusOrg.id } },
            })),
          },
        },
      });
    }

    // ── Mountain House (West Virginia) ──
    const mountainOrg = await tx.organization.create({
      data: {
        name: 'Mountain House',
        owner: {
          create: {
            email: 'david@gmail.com',
            name: 'David',
            password: hashedPassword,
          },
        },
      },
    });

    const mountainProducts = [
      {
        name: 'Brooklyn Tripod Lamp',
        description:
          'A stylish mid-century modern tripod floor lamp with brass accents.',
        variants: [
          {
            name: 'Brooklyn Tripod Lamp',
            price: 89.99,
            variants: { style: 'Brass' },
            stock: 1,
            stockAlertBelow: 2,
          },
        ],
      },
      {
        name: 'Rustic Pine Coffee Table',
        description: 'Handmade from reclaimed pine with a live-edge finish.',
        variants: [
          {
            name: 'Rustic Pine Coffee Table (Small)',
            price: 299.99,
            variants: { size: 'Small' },
            stock: 5,
            stockAlertBelow: 3,
          },
          {
            name: 'Rustic Pine Coffee Table (Large)',
            price: 449.99,
            variants: { size: 'Large' },
            stock: 2,
            stockAlertBelow: 3,
          },
        ],
      },
      {
        name: 'Woven Jute Throw Pillow',
        description: 'Handwoven jute pillow with a neutral earth color.',
        variants: [
          {
            name: 'Woven Jute Throw Pillow 16x16',
            price: 34.99,
            variants: { size: '16x16' },
            stock: 18,
            stockAlertBelow: 5,
          },
          {
            name: 'Woven Jute Throw Pillow 20x20',
            price: 44.99,
            variants: { size: '20x20' },
            stock: 12,
            stockAlertBelow: 5,
          },
        ],
      },
      {
        name: 'Ceramic Vase Collection',
        description: 'Matte-finish ceramic vases in earth tones.',
        variants: [
          {
            name: 'Ceramic Vase - Sage',
            price: 29.99,
            variants: { color: 'Sage' },
            stock: 8,
            stockAlertBelow: 4,
          },
          {
            name: 'Ceramic Vase - Terracotta',
            price: 29.99,
            variants: { color: 'Terracotta' },
            stock: 1,
            stockAlertBelow: 4,
          },
          {
            name: 'Ceramic Vase - Sand',
            price: 29.99,
            variants: { color: 'Sand' },
            stock: 6,
            stockAlertBelow: 4,
          },
        ],
      },
      {
        name: 'Oak Accent Chair',
        description:
          'Comfortable accent chair with solid oak frame and linen upholstery.',
        variants: [
          {
            name: 'Oak Accent Chair - Natural',
            price: 349.99,
            variants: { finish: 'Natural' },
            stock: 3,
            stockAlertBelow: 2,
          },
          {
            name: 'Oak Accent Chair - Walnut',
            price: 379.99,
            variants: { finish: 'Walnut' },
            stock: 1,
            stockAlertBelow: 2,
          },
        ],
      },
    ];

    for (const product of mountainProducts) {
      await tx.product.create({
        data: {
          name: product.name,
          description: product.description,
          organization: { connect: { id: mountainOrg.id } },
          items: {
            create: product.variants.map((v) => ({
              ...v,
              organization: { connect: { id: mountainOrg.id } },
            })),
          },
        },
      });
    }

    // ── Notifications (across both orgs) ──
    const allItems = await tx.productItem.findMany({
      where: {
        OR: [
          { organizationId: aquariusOrg.id },
          { organizationId: mountainOrg.id },
        ],
      },
    });

    const notifications = allItems
      .filter((item) => item.stock <= item.stockAlertBelow)
      .map((item) => ({
        title: 'Low stock alert',
        description: `"${item.name}" stock is at ${item.stock} (threshold: ${item.stockAlertBelow}). Time to reorder from supplier.`,
        action: 'restock',
        isSeenOnApp: false,
        isEmailSent: false,
        organizationId: item.organizationId,
      }));

    await tx.notification.createMany({
      data: notifications,
    });

    console.log(
      `Created ${aquariusProducts.length + mountainProducts.length} products`,
    );
    console.log(`Created ${allItems.length} product items`);
    console.log(`Created ${notifications.length} notifications`);
    console.log('Seed data complete.');
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
