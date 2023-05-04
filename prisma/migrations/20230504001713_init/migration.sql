-- CreateTable
CREATE TABLE "Guild" (
    "id" TEXT NOT NULL,

    CONSTRAINT "Guild_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "objectId" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "Roles" TEXT[],
    "guildId" TEXT NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("objectId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Event_guildId_title_key" ON "Event"("guildId", "title");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
