/*
  Warnings:

  - Made the column `token_qr` on table `Opd` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Opd" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nama" TEXT,
    "token_qr" TEXT NOT NULL,
    "nama_pic" TEXT,
    "kontak_pic" TEXT
);
INSERT INTO "new_Opd" ("id", "kontak_pic", "nama", "nama_pic", "token_qr") SELECT "id", "kontak_pic", "nama", "nama_pic", "token_qr" FROM "Opd";
DROP TABLE "Opd";
ALTER TABLE "new_Opd" RENAME TO "Opd";
CREATE UNIQUE INDEX "Opd_token_qr_key" ON "Opd"("token_qr");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
