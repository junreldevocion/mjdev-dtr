import { IDTR } from "@/model/dtr.model";

export const getTotaMinutes = (dtrList: IDTR[], key: keyof IDTR) => {
  const totalMinutes = dtrList.reduce((total, item) => {
    const minutes = item[key];
    if (!minutes) {
      return 0
    }
    const hasDecimal = minutes % 1 !== 0;
    if (hasDecimal) {
      const [, decimal] = minutes.split('.');
      return total + parseFloat(decimal);
    }
    return total;
  }, 0);

  return totalMinutes
}