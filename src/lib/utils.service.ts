import { IDTR } from "@/model/dtr.model";

export const getTotalHours = (dtrList: IDTR[], key: keyof IDTR) => {
  const totalHours = dtrList.reduce((total, item) => {
    const hours = item[key];

    if (!hours) return 0
    const parseHours = parseFloat(item[key]);
    const hasDecimal = hours % 1 !== 0;
    if (hasDecimal) {
      const [whole] = hours.split('.');
      return total + parseFloat(whole);
    }
    return total + parseHours;
  }, 0);

  return totalHours
}

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