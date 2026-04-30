-- CreateTable
CREATE TABLE "InstagramPost" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "postUrl" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InstagramPost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "InstagramPost_order_idx" ON "InstagramPost"("order");
