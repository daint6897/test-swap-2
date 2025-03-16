export function multiplyLargeNumbers(
  a: string | number,
  b: string | number
): string {
  // Chuyển đổi input thành chuỗi và loại bỏ dấu phẩy
  const strA = typeof a === "string" ? a.replace(/,/g, "") : a.toString();
  const strB = typeof b === "string" ? b.replace(/,/g, "") : b.toString();

  // Xử lý phần thập phân
  const decimalPlacesA = strA.includes(".") ? strA.split(".")[1].length : 0;
  const decimalPlacesB = strB.includes(".") ? strB.split(".")[1].length : 0;

  // Loại bỏ dấu thập phân để làm việc với số nguyên
  const cleanA = strA.replace(".", "");
  const cleanB = strB.replace(".", "");

  // Tính toán tổng số chữ số thập phân cần trong kết quả
  const totalDecimalPlaces = decimalPlacesA + decimalPlacesB;

  // Thuật toán nhân số nguyên lớn
  const len1 = cleanA.length;
  const len2 = cleanB.length;
  const result = new Array(len1 + len2).fill(0);

  // Nhân từng chữ số một
  for (let i = len1 - 1; i >= 0; i--) {
    for (let j = len2 - 1; j >= 0; j--) {
      const product = parseInt(cleanA[i]) * parseInt(cleanB[j]);
      const position = i + j + 1;
      const sum = product + result[position];

      result[position] = sum % 10;
      result[position - 1] += Math.floor(sum / 10);
    }
  }

  // Chuyển đổi kết quả thành chuỗi và loại bỏ các số 0 ở đầu
  let resultStr = result.join("").replace(/^0+/, "");
  if (resultStr === "") resultStr = "0";

  // Chèn dấu thập phân nếu cần
  if (totalDecimalPlaces > 0) {
    // Xác định vị trí dấu thập phân
    let decimalPosition = resultStr.length - totalDecimalPlaces;

    // Nếu vị trí dấu thập phân nhỏ hơn hoặc bằng 0, thêm các số 0 ở đầu
    if (decimalPosition <= 0) {
      resultStr = "0".repeat(1 - decimalPosition) + resultStr;
      decimalPosition = 1;
    }

    // Chèn dấu thập phân
    resultStr =
      resultStr.substring(0, decimalPosition) +
      "." +
      resultStr.substring(decimalPosition);
  }

  // Định dạng kết quả với dấu phẩy phân cách hàng nghìn
  const parts = resultStr.split(".");
  const integerPart = parts[0];
  const decimalPart = parts.length > 1 ? "." + parts[1] : "";

  // Thêm dấu phẩy vào phần nguyên
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return formattedInteger + decimalPart;
}
