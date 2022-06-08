-- CreateTable
CREATE TABLE "Guild" (
    "id" TEXT NOT NULL,
    "lang" TEXT NOT NULL DEFAULT E'en',

    CONSTRAINT "Guild_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Member" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "xp" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "guildId" TEXT NOT NULL,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Queue" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(32) NOT NULL,
    "descriptrion" VARCHAR(128) NOT NULL,
    "tracks" TEXT[],
    "guildId" TEXT NOT NULL,
    "authorId" INTEGER NOT NULL,

    CONSTRAINT "Queue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Member_userId_guildId_key" ON "Member"("userId", "guildId");

-- CreateIndex
CREATE UNIQUE INDEX "Queue_title_guildId_key" ON "Queue"("title", "guildId");

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Queue" ADD CONSTRAINT "Queue_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Queue" ADD CONSTRAINT "Queue_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
