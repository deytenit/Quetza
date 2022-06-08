import { PrismaClient } from "@prisma/client";

interface CustomNodeJsGlobal extends Global {
  prisma: PrismaClient
}

declare const global: CustomNodeJsGlobal;

export class Storage {
    private prisma = global.prisma || new PrismaClient();

    public readonly member = {
        get: async (userId: string, guildId: string) => {
            return await this.prisma.member.findUnique({
                where: {
                    userId_guildId: {
                        userId: userId,
                        guildId: guildId
                    }
                }
            }) || await this.prisma.member.create({
                data: {
                    userId: userId,
                    guild: {
                        connectOrCreate: {
                            where: {
                                id: guildId
                            },
                            create: {
                                id: guildId
                            }
                        }
                    }
                }
            });
        }
    };

    public queue = {
        set: async (data: {title: string, description: string, tracks: string[], userId: string, guildId: string}) => {
            const member = await this.member.get(data.userId, data.guildId);

            if ((await this.queue.get({ userId: data.userId, guildId: data.guildId })).length === 5) {
                throw new Error("Exceeded amount of tracks.");   
            }

            await this.prisma.queue.create({
                data: {
                    title: data.title,
                    descriptrion: data.description,
                    tracks: data.tracks,
                    guildId: member.guildId,
                    authorId: member.id
                }
            });
        },
        get: async (where: { title?: string, userId?: string, guildId: string }) => {
            return await this.prisma.queue.findMany({
                where: {
                    title: where.title,
                    guildId: where.guildId,
                    authorId: where.userId ? (await this.member.get(where.userId, where.guildId)).id : undefined
                }
            });
        },
        del: async (where: {title: string, guildId: string, userId: string}) => {
            if ((await this.queue.get(where)).length === 0) return;

            await this.prisma.queue.delete({
                where: {
                    title_guildId: {
                        title: where.title,
                        guildId: where.guildId
                    }
                }
            });
        }
    };

    public constructor() {
        if (process.env.NODE_ENV === "development") global.prisma = this.prisma;
    }
}