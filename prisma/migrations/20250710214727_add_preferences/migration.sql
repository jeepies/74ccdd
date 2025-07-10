-- CreateEnum
CREATE TYPE "Timezone" AS ENUM ('GMT', 'EST', 'PST', 'CET');

-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('GBP', 'USD', 'EUR');

-- CreateTable
CREATE TABLE "Preferences" (
    "id" TEXT NOT NULL,
    "currency" "Currency" NOT NULL,
    "timezone" "Timezone" NOT NULL,
    "milliseconds" BOOLEAN NOT NULL DEFAULT false,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "Preferences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Preferences_user_id_key" ON "Preferences"("user_id");

-- AddForeignKey
ALTER TABLE "Preferences" ADD CONSTRAINT "Preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
