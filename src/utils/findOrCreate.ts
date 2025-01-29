import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


export const findOrCreate = async (model: any, whereCondition: any, createData: any) => {
    // Try to find the record
    let record = await model.findUnique({
        where: whereCondition,
    });

    // If the record does not exist, create it
    if (!record) {
        record = await model.create({
            data: createData,
        });
    }

    return record;
};