export default {
    datasource: {
        url: process.env.DATABASE_URL,
    },
    migrations: {
        seed: 'tsx ./prisma/seed.ts',
    },
}
