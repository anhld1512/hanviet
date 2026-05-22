export type DialogueLine = {
  speaker: "A" | "B"
  kr: string
  romanization: string
  vi: string
}

export type VocabWord = {
  hangul: string
  romanization: string
  meaning: string
}

export type GrammarPoint = {
  pattern: string
  meaning: string
  explanation: string
  examples: { kr: string; vi: string }[]
}

export type QuizQuestion =
  | {
      type: "multiple_choice"
      question: string
      options: string[]
      correct: number
      explanation: string
    }
  | {
      type: "fill_blank"
      question: string
      answer: string
      hint: string
    }

export type Lesson = {
  id: number
  title: string
  titleKr: string
  level: string
  category: string
  duration: string
  emoji: string
  dialogue: {
    situation: string
    lines: DialogueLine[]
  }
  vocabulary: VocabWord[]
  grammar: GrammarPoint[]
  quiz: QuizQuestion[]
}

export const lessons: Lesson[] = [
  {
    id: 1,
    title: "Chào hỏi cơ bản",
    titleKr: "기본 인사",
    level: "TOPIK 1",
    category: "Giao tiếp hàng ngày",
    duration: "8 phút",
    emoji: "👋",
    dialogue: {
      situation: "Tình huống: Gặp đồng nghiệp người Hàn lần đầu tại công ty",
      lines: [
        {
          speaker: "A",
          kr: "안녕하세요. 저는 김민수입니다.",
          romanization: "Annyeonghaseyo. Jeoneun Gim Minsu imnida.",
          vi: "Xin chào. Tôi là Kim Minsu.",
        },
        {
          speaker: "B",
          kr: "안녕하세요. 저는 응우옌 민입니다.",
          romanization: "Annyeonghaseyo. Jeoneun Nguyễn Min imnida.",
          vi: "Xin chào. Tôi là Nguyễn Minh.",
        },
        {
          speaker: "A",
          kr: "만나서 반갑습니다!",
          romanization: "Mannaseo bangapseumnida!",
          vi: "Rất vui được gặp bạn!",
        },
        {
          speaker: "B",
          kr: "저도 반갑습니다. 잘 부탁드립니다.",
          romanization: "Jeodo bangapseumnida. Jal butakdeurimnida.",
          vi: "Tôi cũng vậy. Mong được hợp tác tốt.",
        },
      ],
    },
    vocabulary: [
      { hangul: "안녕하세요", romanization: "annyeonghaseyo", meaning: "Xin chào (trang trọng)" },
      { hangul: "저", romanization: "jeo", meaning: "Tôi (khiêm nhường)" },
      { hangul: "만나다", romanization: "mannada", meaning: "Gặp gỡ" },
      { hangul: "반갑습니다", romanization: "bangapseumnida", meaning: "Rất vui được gặp" },
      { hangul: "잘 부탁드립니다", romanization: "jal butakdeurimnida", meaning: "Mong được nhờ cậy / Rất mong hợp tác" },
    ],
    grammar: [
      {
        pattern: "저는 [tên]입니다",
        meaning: "Tôi là [tên]",
        explanation:
          "Cấu trúc tự giới thiệu trang trọng. 저 = tôi (khiêm nhường), 는 = trợ từ chủ đề (giống 'thì' trong tiếng Việt), 입니다 = là (dạng lịch sự). Trong tiếng Việt ta nói 'Tôi là...', tiếng Hàn cũng có cấu trúc tương tự nhưng động từ 'là' đặt ở cuối câu.",
        examples: [
          { kr: "저는 학생입니다.", vi: "Tôi là học sinh." },
          { kr: "저는 베트남 사람입니다.", vi: "Tôi là người Việt Nam." },
        ],
      },
    ],
    quiz: [
      {
        type: "multiple_choice",
        question: "'Xin chào' trong tiếng Hàn (trang trọng) là gì?",
        options: ["안녕하세요", "감사합니다", "미안합니다", "안녕"],
        correct: 0,
        explanation: "안녕하세요 là cách chào trang trọng, dùng với người lớn tuổi hoặc mới gặp. 안녕 là cách chào thân mật với bạn bè.",
      },
      {
        type: "multiple_choice",
        question: "'Rất vui được gặp bạn' trong tiếng Hàn là?",
        options: ["감사합니다", "만나서 반갑습니다", "잘 부탁드립니다", "죄송합니다"],
        correct: 1,
        explanation: "만나서 반갑습니다 = gặp (만나서) + vui mừng (반갑습니다). Câu này dùng khi lần đầu gặp mặt.",
      },
      {
        type: "multiple_choice",
        question: "Điền vào chỗ trống: 저___ 김민수입니다.",
        options: ["이", "는", "을", "가"],
        correct: 1,
        explanation: "저는 = tôi + trợ từ chủ đề 는. Dùng 는 sau nguyên âm, dùng 은 sau phụ âm.",
      },
    ],
  },
  {
    id: 2,
    title: "Gọi đồ ăn tại nhà hàng",
    titleKr: "식당에서 주문하기",
    level: "TOPIK 1",
    category: "Ăn uống",
    duration: "10 phút",
    emoji: "🍜",
    dialogue: {
      situation: "Tình huống: Bạn vào nhà hàng Hàn Quốc và gọi món ăn",
      lines: [
        {
          speaker: "A",
          kr: "어서 오세요! 몇 분이세요?",
          romanization: "Eoseo oseyo! Myeot buniseyo?",
          vi: "Xin chào quý khách! Có mấy người?",
        },
        {
          speaker: "B",
          kr: "두 명이요.",
          romanization: "Du myeongiyo.",
          vi: "Hai người.",
        },
        {
          speaker: "A",
          kr: "주문하시겠어요?",
          romanization: "Jumunhasigeseoyo?",
          vi: "Quý khách dùng gì ạ?",
        },
        {
          speaker: "B",
          kr: "비빔밥 하나하고 된장찌개 하나 주세요.",
          romanization: "Bibimbap hanahago doenjangjjigae hana juseyo.",
          vi: "Cho tôi một cơm trộn và một canh tương đậu.",
        },
        {
          speaker: "A",
          kr: "네, 잠시만요.",
          romanization: "Ne, jamsimanyo.",
          vi: "Vâng, xin chờ một chút.",
        },
      ],
    },
    vocabulary: [
      { hangul: "식당", romanization: "sikdang", meaning: "Nhà hàng, quán ăn" },
      { hangul: "주문하다", romanization: "jumunhada", meaning: "Đặt món, gọi món" },
      { hangul: "비빔밥", romanization: "bibimbap", meaning: "Cơm trộn" },
      { hangul: "된장찌개", romanization: "doenjangjjigae", meaning: "Canh tương đậu" },
      { hangul: "주세요", romanization: "juseyo", meaning: "Cho tôi / Làm ơn cho" },
      { hangul: "잠시만요", romanization: "jamsimanyo", meaning: "Xin chờ một chút" },
    ],
    grammar: [
      {
        pattern: "[món ăn] 주세요",
        meaning: "Cho tôi [món ăn]",
        explanation:
          "주세요 = 주다 (cho/đưa) + 세요 (dạng lịch sự khi nhờ). Đây là cách gọi món cơ bản nhất. Trong tiếng Việt ta nói 'Cho tôi...', tiếng Hàn cũng đặt động từ sau tân ngữ: [thứ muốn] + 주세요.",
        examples: [
          { kr: "물 주세요.", vi: "Cho tôi nước." },
          { kr: "메뉴판 주세요.", vi: "Cho tôi xem thực đơn." },
        ],
      },
    ],
    quiz: [
      {
        type: "multiple_choice",
        question: "'Cho tôi cơm trộn' trong tiếng Hàn là?",
        options: ["비빔밥 주세요", "된장찌개 주세요", "물 주세요", "메뉴판 주세요"],
        correct: 0,
        explanation: "비빔밥 = cơm trộn, 주세요 = cho tôi. Ghép lại: 비빔밥 주세요.",
      },
      {
        type: "multiple_choice",
        question: "Nhân viên hỏi 'Có mấy người?' bằng tiếng Hàn như thế nào?",
        options: ["주문하시겠어요?", "몇 분이세요?", "잠시만요.", "어서 오세요!"],
        correct: 1,
        explanation: "몇 = mấy/bao nhiêu, 분 = người (trang trọng), 이세요 = là. Câu hỏi lịch sự dùng 분 thay vì 명.",
      },
      {
        type: "multiple_choice",
        question: "'Xin chờ một chút' trong tiếng Hàn là?",
        options: ["감사합니다", "잠시만요", "괜찮아요", "네"],
        correct: 1,
        explanation: "잠시 = một lúc/chốc lát, 만요 = chỉ/thôi. 잠시만요 dùng khi muốn ai đó chờ.",
      },
    ],
  },
  {
    id: 3,
    title: "Đi taxi và hỏi đường",
    titleKr: "택시 타기",
    level: "TOPIK 1",
    category: "Di chuyển",
    duration: "9 phút",
    emoji: "🚕",
    dialogue: {
      situation: "Tình huống: Bạn bắt taxi tại Seoul và muốn đến khách sạn",
      lines: [
        {
          speaker: "B",
          kr: "어디 가세요?",
          romanization: "Eodi gaseyo?",
          vi: "Bạn muốn đi đâu?",
        },
        {
          speaker: "A",
          kr: "명동 호텔로 가 주세요.",
          romanization: "Myeongdong hotelro ga juseyo.",
          vi: "Cho tôi đến khách sạn Myeongdong.",
        },
        {
          speaker: "B",
          kr: "네, 알겠습니다. 시간이 좀 걸릴 거예요.",
          romanization: "Ne, algesseumnida. Sigani jom geollil geoyeyo.",
          vi: "Vâng, tôi hiểu rồi. Sẽ mất một ít thời gian.",
        },
        {
          speaker: "A",
          kr: "얼마나 걸려요?",
          romanization: "Eolmana geollyeoyo?",
          vi: "Mất bao lâu?",
        },
        {
          speaker: "B",
          kr: "약 20분 걸려요.",
          romanization: "Yak isibun geollyeoyo.",
          vi: "Khoảng 20 phút.",
        },
      ],
    },
    vocabulary: [
      { hangul: "택시", romanization: "taeksi", meaning: "Taxi" },
      { hangul: "어디", romanization: "eodi", meaning: "Ở đâu / Đâu" },
      { hangul: "가다", romanization: "gada", meaning: "Đi" },
      { hangul: "얼마나", romanization: "eolmana", meaning: "Bao nhiêu / Bao lâu" },
      { hangul: "걸리다", romanization: "geollida", meaning: "Mất (thời gian)" },
      { hangul: "약", romanization: "yak", meaning: "Khoảng (chừng)" },
    ],
    grammar: [
      {
        pattern: "[địa điểm]로 가 주세요",
        meaning: "Cho tôi đến [địa điểm]",
        explanation:
          "로/으로 = trợ từ chỉ hướng (đến, về phía). 가 주세요 = đi + cho tôi (nhờ lịch sự). Giống tiếng Việt: 'đến [chỗ] giúp tôi với'. Dùng 로 sau nguyên âm hoặc ㄹ, dùng 으로 sau phụ âm khác.",
        examples: [
          { kr: "공항으로 가 주세요.", vi: "Cho tôi đến sân bay." },
          { kr: "호텔로 가 주세요.", vi: "Cho tôi đến khách sạn." },
        ],
      },
    ],
    quiz: [
      {
        type: "multiple_choice",
        question: "'Cho tôi đến sân bay' trong tiếng Hàn là?",
        options: ["공항으로 가 주세요", "호텔로 가 주세요", "어디 가세요?", "얼마나 걸려요?"],
        correct: 0,
        explanation: "공항 = sân bay, 으로 = trợ từ hướng đến, 가 주세요 = đi cho tôi.",
      },
      {
        type: "multiple_choice",
        question: "'Mất bao lâu?' trong tiếng Hàn là?",
        options: ["얼마예요?", "어디예요?", "얼마나 걸려요?", "몇 시예요?"],
        correct: 2,
        explanation: "얼마나 = bao nhiêu/bao lâu, 걸려요 = mất (thời gian). 얼마예요 = bao nhiêu tiền, khác với câu hỏi về thời gian.",
      },
      {
        type: "multiple_choice",
        question: "Tài xế nói '약 20분 걸려요', nghĩa là?",
        options: ["Khoảng 20 phút", "Đúng 20 phút", "Hơn 20 phút", "Chưa đến 20 phút"],
        correct: 0,
        explanation: "약 = khoảng/chừng, 20분 = 20 phút, 걸려요 = mất. Ghép lại: khoảng 20 phút.",
      },
    ],
  },
]

export function getLessonById(id: number): Lesson | undefined {
  return lessons.find((l) => l.id === id)
}
