-- CreateTable
CREATE TABLE "Store" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,

    CONSTRAINT "Store_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SKUs" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "class" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "cost" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "SKUs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Calendar" (
    "id" SERIAL NOT NULL,
    "week" INTEGER NOT NULL,
    "week_label" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "month_label" TEXT NOT NULL,

    CONSTRAINT "Calendar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Planning" (
    "id" SERIAL NOT NULL,
    "store" INTEGER NOT NULL,
    "sku" INTEGER NOT NULL,
    "week" INTEGER NOT NULL,
    "salesUnits" INTEGER NOT NULL,

    CONSTRAINT "Planning_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Calculation" (
    "id" SERIAL NOT NULL,
    "store" INTEGER NOT NULL,
    "sku" INTEGER NOT NULL,
    "week" INTEGER NOT NULL,
    "salesUnits" INTEGER NOT NULL,
    "salesDollars" DOUBLE PRECISION NOT NULL,
    "costDollars" DOUBLE PRECISION NOT NULL,
    "gmDollars" DOUBLE PRECISION NOT NULL,
    "gmPercent" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Calculation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chart" (
    "id" SERIAL NOT NULL,
    "week" INTEGER NOT NULL,
    "gmDollars" DOUBLE PRECISION NOT NULL,
    "salesDollars" DOUBLE PRECISION NOT NULL,
    "gmPercent" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Chart_pkey" PRIMARY KEY ("id")
);
