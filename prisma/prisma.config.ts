import { PrismaPg } from "@prisma/adapter-pg";

export default {
  datasources: {
    db: {
      adapter: new PrismaPg(process.env.DATABASE_URL!),
    },
  },
};
