/*
  Warnings:

  - Added the required column `updatedAt` to the `Opd` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Ticket" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "status" TEXT,
    "opdId" INTEGER NOT NULL,
    CONSTRAINT "Ticket_opdId_fkey" FOREIGN KEY ("opdId") REFERENCES "Opd" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Opd" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nama" TEXT,
    "token_qr" TEXT NOT NULL,
    "nama_pic" TEXT,
    "kontak_pic" TEXT,
    "prioritas" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Opd" ("id", "kontak_pic", "nama", "nama_pic", "token_qr") SELECT "id", "kontak_pic", "nama", "nama_pic", "token_qr" FROM "Opd";
DROP TABLE "Opd";
ALTER TABLE "new_Opd" RENAME TO "Opd";
CREATE UNIQUE INDEX "Opd_token_qr_key" ON "Opd"("token_qr");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
