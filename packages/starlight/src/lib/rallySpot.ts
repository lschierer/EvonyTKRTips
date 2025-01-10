import { z } from "zod";

/*
 * Zod only supports String Enums
 * Typescript does not support defining constant numbers with leading zeros.
 * not having the leading zeros makes it hard to see at a glance that I've got
 * all the right digits.
 */
const rallySpotBaseMarch = z.enum([
  "0",
  "000800",
  "001200",
  "002000",
  "003200",
  "004600",
  "006400",
  "008400",
  "010800",
  "013600",
  "016600",
  "020000",
  "023600",
  "027600",
  "032000",
  "036600",
  "041600",
  "046800",
  "052400",
  "058400",
  "064600",
  "071200",
  "078000",
  "085200",
  "092800",
  "100000",
  "110000",
  "125000",
  "145000",
  "170000",
  "200000",
  "225000",
  "250000",
  "285000",
  "315000",
  "350000",
  "385000",
  "420000",
  "460000",
  "500000",
  "550000",
  "600000",
  "660000",
  "720000",
  "790000",
  "860000",
]);
type rallySpotBaseMarch = z.infer<typeof rallySpotBaseMarch>;

export default rallySpotBaseMarch;
