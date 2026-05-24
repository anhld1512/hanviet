// Claude AI grading prompts for TOPIK II Writing Q51-Q54
// Based on NIIED official rubric

export type GradeResult = {
  question_type: "q51" | "q52" | "q53" | "q54"
  scores: {
    content: number
    organization: number
    language: number
    style: number
    total: number
  }
  max_scores: {
    content: number
    organization: number
    language: number
    style: number
    total: number
  }
  feedback: {
    overall: string
    content: string
    organization: string
    language: string
    style: string
  }
  corrections: Array<{
    original: string
    corrected: string
    explanation: string
  }>
  better_example?: string
}

// ============================================================
// Q51 grading prompt
// ============================================================
export function buildQ51Prompt(
  promptText: string,
  blankKey: string,
  studentAnswer: string,
  contextHint: string
): string {
  return `Ban la giam khao TOPIK II chuyen nghiep. Hay cham diem cau tra loi sau theo tieu chi NIIED.

DE BAI:
${promptText}

CHO TRONG: (${blankKey})
NGHI CAN DIEN: ${contextHint}
BAI VIET CUA HOC SINH: "${studentAnswer}"

TIEU CHI CHAM (tong 5 diem):
- Noi dung (2d): Cau co phu hop voi ngu canh va chu de khong? Thong tin day du khong?
- Ngu phap & tu vung (2d): Cau truc ngu phap dung khong? Tu vung phu hop khong?
- The van (1d): Co dung 합쇼체 (-ㅂ니다/습니다) khong?

Hay tra loi bang JSON chinh xac theo dinh dang nay:
{
  "scores": {
    "content": <0-2>,
    "language": <0-2>,
    "style": <0-1>,
    "total": <0-5>
  },
  "feedback": {
    "overall": "<nhan xet tong quat bang tieng Viet, 1-2 cau>",
    "content": "<nhan xet noi dung bang tieng Viet>",
    "language": "<nhan xet ngu phap tu vung bang tieng Viet>",
    "style": "<nhan xet the van bang tieng Viet>"
  },
  "corrections": [
    {
      "original": "<phan sai neu co>",
      "corrected": "<sua lai>",
      "explanation": "<giai thich bang tieng Viet>"
    }
  ],
  "better_example": "<cau mau tot hon neu can, bang tieng Han>"
}

CHU Y: Chi tra loi JSON, khong them gi khac.`
}

// ============================================================
// Q52 grading prompt
// ============================================================
export function buildQ52Prompt(
  promptText: string,
  blankKey: string,
  studentAnswer: string,
  contextHint: string
): string {
  return `Ban la giam khao TOPIK II chuyen nghiep. Cham diem cau dien vao doan van nghi luan.

VAN BAN GOC:
${promptText}

CHO TRONG: (${blankKey})
YEU CAU: ${contextHint}
BAI VIET CUA HOC SINH: "${studentAnswer}"

TIEU CHI CHAM (tong 5 diem):
- Noi dung logic (2d): Cau co phu hop voi y truoc va sau? Co the hien quan diem doi lap/bo sung khong?
- Ngu phap & tu vung hoc thuat (2d): Dung ngu phap van viet? Tu vung co phu hop voi van phong nghi luan khong?
- The van (1d): Co dung 다/ㄴ다체 (van viet hoc thuat) khong? TUYET DOI KHONG dung 습니다 hay 해요체.

Tra loi bang JSON:
{
  "scores": {
    "content": <0-2>,
    "language": <0-2>,
    "style": <0-1>,
    "total": <0-5>
  },
  "feedback": {
    "overall": "<nhan xet tong quat tieng Viet>",
    "content": "<nhan xet tinh logic va noi dung>",
    "language": "<nhan xet ngu phap van hoc thuat>",
    "style": "<nhan xet the van 다체>"
  },
  "corrections": [
    {
      "original": "<phan sai neu co>",
      "corrected": "<sua lai>",
      "explanation": "<giai thich tieng Viet>"
    }
  ],
  "better_example": "<cau mau tot hon neu can>"
}

Chi tra loi JSON.`
}

// ============================================================
// Q53 grading prompt
// ============================================================
export function buildQ53Prompt(
  chartDescription: string,
  studentEssay: string,
  charCount: number
): string {
  return `Ban la giam khao TOPIK II. Cham bai phan tich bieu do Q53.

DU LIEU BIEU DO:
${chartDescription}

BAI VIET HOC SINH (${charCount} chu):
${studentEssay}

TIEU CHI NIIED Q53 (tong 30 diem):
1. Noi dung (12d): Co mo ta day du so lieu? Co phan tich nguyen nhan/y nghia khong? Co sai lenh so lieu khong?
2. Cu truc (9d): Co cau truc ro rang (mo dau, than bai, phan tich)? Mach van mach lac khong?
3. Ngu phap & tu vung (9d): Ngu phap chinh xac? Tu vung da dang, phu hop van phong hoc thuat?

LUU Y:
- Do dai yeu cau 200-300 chu. Sai qua 10% bi tru diem.
- The van: 다/ㄴ다체. Dung 습니다 bi tru diem phong cach.
- Khong chep lai nguyen van de bai.

Tra loi bang JSON:
{
  "scores": {
    "content": <0-12>,
    "organization": <0-9>,
    "language": <0-9>,
    "total": <0-30>
  },
  "max_scores": {
    "content": 12,
    "organization": 9,
    "language": 9,
    "total": 30
  },
  "char_count_feedback": "<nhan xet ve do dai: du/thieu/qua bao nhieu chu>",
  "feedback": {
    "overall": "<nhan xet tong quat tieng Viet, 2-3 cau>",
    "content": "<nhan xet noi dung va so lieu>",
    "organization": "<nhan xet cu truc va mach van>",
    "language": "<nhan xet ngu phap tu vung>"
  },
  "corrections": [
    {
      "original": "<doan van sai neu co>",
      "corrected": "<sua lai>",
      "explanation": "<giai thich tieng Viet>"
    }
  ],
  "better_example": "<1-2 cau mau tot hon cho phan yeu nhat>"
}

Chi tra loi JSON.`
}

// ============================================================
// Q54 grading prompt
// ============================================================
export function buildQ54Prompt(
  topic: string,
  studentEssay: string,
  charCount: number
): string {
  return `Ban la giam khao TOPIK II chuyen nghiep voi nhieu nam kinh nghiem cham Q54. Hay cham bai luan nay theo rubric NIIED chinh thuc.

CHU DE:
${topic}

BAI VIET HOC SINH (${charCount} chu):
${studentEssay}

RUBRIC NIIED Q54 (tong 50 diem):
1. Noi dung (12d): Luan diem co ro rang, co su, co dan chung khong? Phat trien y tuong day du khong?
2. Cu truc (12d): Co du 3 phan (mo-than-ket)? Moi doan co chu de rieng khong? Lien ket giua cac doan tot khong?
3. Ngu phap & tu vung (14d): Ngu phap da dang va chinh xac? Tu vung co phong phu, phu hop van phong hoc thuat khong?
4. The van (12d): PHAI dung 합쇼체 (-ㅂ니다/습니다 hoac -ㄴ/는다, -다 cho van ban hoc thuat). TUYET DOI KHONG dung 해요체 (-아/어요). Vi pham the van bi giam toi 30% diem muc 4.

LUU Y QUAN TRONG:
- Do dai yeu cau CHINH XAC 600-700 chu. Moi sai 50 chu bi tru 2-3 diem.
- Khong chep lai de bai.
- Phai co luan diem ro rang, khong chi ke chuyen.
- Van phong hoc thuat, tranh dung tu thong thuong.

Tra loi JSON chi tiet:
{
  "scores": {
    "content": <0-12>,
    "organization": <0-12>,
    "language": <0-14>,
    "style": <0-12>,
    "total": <0-50>
  },
  "max_scores": {
    "content": 12,
    "organization": 12,
    "language": 14,
    "style": 12,
    "total": 50
  },
  "char_count_feedback": "<nhan xet do dai: du hay thieu bao nhieu chu>",
  "feedback": {
    "overall": "<nhan xet tong quat, diem manh va diem yeu chinh, 3-4 cau tieng Viet>",
    "content": "<nhan xet noi dung luan diem>",
    "organization": "<nhan xet cu truc 3 phan, mach van>",
    "language": "<nhan xet ngu phap tu vung cu the>",
    "style": "<nhan xet the van, co pham loi 해요체 khong>"
  },
  "corrections": [
    {
      "original": "<cau/doan co loi quan trong>",
      "corrected": "<sua lai hoan chinh>",
      "explanation": "<giai thich ly do sua tieng Viet>"
    }
  ],
  "thesis_feedback": "<phan tich de xuat luan diem (thesis): co ro rang va dac sac khong?>",
  "better_opening": "<goi y cau mo bai tot hon neu can>"
}

Chi tra loi JSON.`
}
