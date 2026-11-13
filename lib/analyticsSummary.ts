import { prisma } from "@/lib/prisma";

type JsonRecord = Record<string, unknown>;

type ProductMetric = {
  name: string;
  quantity: number;
  revenue: number;
  category: string;
};

type CategoryMetric = {
  category: string;
  revenue: number;
};

type CashierMetric = {
  id: string;
  orders: number;
  revenue: number;
};

type PaidOrderForSummary = {
  id: string;
  userId: string;
  posId: string;
  cashierId: string | null;
  items: unknown;
  total: number;
  createdAt: Date;
};

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getUtcDay(date: Date): Date {
  return new Date(Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
  ));
}

function getItems(items: unknown): Array<{
  name: string;
  price: number;
  quantity: number;
  category: string;
}> {
  if (!Array.isArray(items)) {
    return [];
  }

  return items.flatMap((item) => {
    if (!isRecord(item) || !isRecord(item.product)) {
      return [];
    }

    const product = item.product;
    const name = typeof product.name === "string" ? product.name : null;
    const price = typeof product.price === "number" ? product.price : null;
    const quantity = typeof item.quantity === "number" ? item.quantity : null;

    if (name === null || price === null || quantity === null || quantity <= 0) {
      return [];
    }

    return [{
      name,
      price,
      quantity,
      category: typeof product.category === "string"
        ? product.category
        : "Uncategorized",
    }];
  });
}

function asMetricRecord<T>(value: unknown): Record<string, T> {
  return isRecord(value) ? value as Record<string, T> : {};
}

function asProcessedOrderIds(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((id): id is string => typeof id === "string")
    : [];
}

export async function recordPaidOrder(order: PaidOrderForSummary): Promise<void> {
  const date = getUtcDay(order.createdAt);
  const existing = await prisma.analyticsSummary.findUnique({
    where: {
      posId_date: {
        posId: order.posId,
        date,
      },
    },
  });

  const processedOrderIds = asProcessedOrderIds(existing?.processedOrderIds);
  if (processedOrderIds.includes(order.id)) {
    return;
  }

  const productStats = asMetricRecord<ProductMetric>(existing?.productStats);
  const categoryStats = asMetricRecord<CategoryMetric>(existing?.categoryStats);
  const hourlyStats = asMetricRecord<number>(existing?.hourlyStats);
  const cashierStats = asMetricRecord<CashierMetric>(existing?.cashierStats);
  const items = getItems(order.items);

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const discountFactor = subtotal > 0 ? order.total / subtotal : 1;

  for (const item of items) {
    const itemRevenue = item.price * item.quantity * discountFactor;
    const product = productStats[item.name] ?? {
      name: item.name,
      quantity: 0,
      revenue: 0,
      category: item.category,
    };
    product.quantity += item.quantity;
    product.revenue += itemRevenue;
    productStats[item.name] = product;

    const category = categoryStats[item.category] ?? {
      category: item.category,
      revenue: 0,
    };
    category.revenue += itemRevenue;
    categoryStats[item.category] = category;
  }

  const hour = String(order.createdAt.getUTCHours());
  hourlyStats[hour] = (hourlyStats[hour] ?? 0) + 1;

  if (order.cashierId) {
    const cashier = cashierStats[order.cashierId] ?? {
      id: order.cashierId,
      orders: 0,
      revenue: 0,
    };
    cashier.orders += 1;
    cashier.revenue += order.total;
    cashierStats[order.cashierId] = cashier;
  }

  const nextProcessedOrderIds = [...processedOrderIds, order.id];
  const data = {
    revenue: { increment: order.total },
    orderCount: { increment: 1 },
    productStats,
    categoryStats,
    hourlyStats,
    cashierStats,
    processedOrderIds: nextProcessedOrderIds,
  };

  if (existing) {
    await prisma.analyticsSummary.update({
      where: { id: existing.id },
      data,
    });
    return;
  }

  await prisma.analyticsSummary.create({
    data: {
      userId: order.userId,
      posId: order.posId,
      date,
      revenue: order.total,
      orderCount: 1,
      productStats,
      categoryStats,
      hourlyStats,
      cashierStats,
      processedOrderIds: nextProcessedOrderIds,
    },
  });
}
