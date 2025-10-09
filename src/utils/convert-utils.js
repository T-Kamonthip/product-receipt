const toCommas = (number, limit) => {
  if (
    number !== null &&
    number !== "" &&
    number !== undefined &&
    typeof number === "number" &&
    limit != null
  ) {
    const strNum = Number(number).toFixed(limit).toString();
    const sepNum = strNum.split(".");
    if (sepNum?.length == 2) {
      return sepNum[0]?.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "." + sepNum[1];
    } else {
      return "0";
    }
  } else {
    return number;
  }
};

export default {
  toCommas,
};

export { toCommas };
