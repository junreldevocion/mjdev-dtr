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