/** 다음 우편번호 서비스 (https://postcode.map.daum.net/guide) 중 쓰는 부분만 */
interface DaumPostcodeData {
  zonecode: string;
  roadAddress: string;
  jibunAddress: string;
  /** R: 도로명, J: 지번 */
  userSelectedType: "R" | "J";
  bname: string;
  buildingName: string;
  apartment: "Y" | "N";
}

interface DaumPostcode {
  open(): void;
}

interface Window {
  daum?: {
    Postcode: new (options: { oncomplete: (data: DaumPostcodeData) => void }) => DaumPostcode;
  };
}
