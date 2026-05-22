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
  {
    id: 4,
    title: "Mua sắm quần áo",
    titleKr: "쇼핑하기",
    level: "TOPIK 1",
    category: "Mua sắm",
    duration: "9 phút",
    emoji: "🛍️",
    dialogue: {
      situation: "Tình huống: Bạn vào cửa hàng quần áo ở Myeongdong, Seoul",
      lines: [
        { speaker: "A", kr: "어서 오세요! 뭘 찾으세요?", romanization: "Eoseo oseyo! Mwol chajeuseyo?", vi: "Xin chào! Bạn tìm gì vậy?" },
        { speaker: "B", kr: "이 티셔츠 얼마예요?", romanization: "I tisyeocheu eolmayeyo?", vi: "Cái áo phông này bao nhiêu tiền?" },
        { speaker: "A", kr: "2만 원이에요.", romanization: "I man wonieyeo.", vi: "20.000 won ạ." },
        { speaker: "B", kr: "입어봐도 돼요?", romanization: "Ibeobwado dwaeyo?", vi: "Tôi có thể mặc thử không?" },
        { speaker: "A", kr: "네, 피팅룸은 저쪽이에요.", romanization: "Ne, piting-rum-eun jeojjogieyo.", vi: "Vâng, phòng thử đồ ở phía đó ạ." },
        { speaker: "B", kr: "조금 큰 것 같아요. 작은 사이즈 있어요?", romanization: "Jogeun keun geot gatayo. Jageun saijeu isseoyo?", vi: "Hình như hơi rộng. Có cỡ nhỏ hơn không?" },
        { speaker: "A", kr: "네, 잠깐만요!", romanization: "Ne, jamkkanmanyo!", vi: "Có ạ, chờ chút nhé!" },
      ],
    },
    vocabulary: [
      { hangul: "얼마예요", romanization: "eolmayeyo", meaning: "Bao nhiêu tiền?" },
      { hangul: "입어봐도 돼요", romanization: "ibeobwado dwaeyo", meaning: "Mặc thử được không?" },
      { hangul: "크다", romanization: "keuda", meaning: "To/Lớn/Rộng" },
      { hangul: "작다", romanization: "jakda", meaning: "Nhỏ/Bé" },
      { hangul: "사이즈", romanization: "saijeu", meaning: "Cỡ/Kích thước" },
      { hangul: "피팅룸", romanization: "piting-rum", meaning: "Phòng thử đồ" },
    ],
    grammar: [
      {
        pattern: "-아/어봐도 돼요?",
        meaning: "...được không? / Có thể ... không?",
        explanation: "Cấu trúc xin phép làm gì đó. 입다 (mặc) + 어봐도 돼요 = mặc thử được không? Tương tự: 먹어봐도 돼요? = thử ăn được không?, 써봐도 돼요? = thử dùng được không? Đây là cách hỏi phép lịch sự nhất trong tiếng Hàn.",
        examples: [
          { kr: "이 카메라 써봐도 돼요?", vi: "Tôi có thể thử dùng camera này không?" },
          { kr: "여기 앉아봐도 돼요?", vi: "Tôi có thể ngồi đây không?" },
        ],
      },
    ],
    quiz: [
      { type: "multiple_choice", question: "Hỏi giá một món đồ, bạn nói gì?", options: ["얼마예요?", "어디예요?", "뭐예요?", "언제예요?"], correct: 0, explanation: "얼마예요? = Bao nhiêu tiền? 얼마 = bao nhiêu + -예요 = là (câu hỏi)." },
      { type: "multiple_choice", question: "'입어봐도 돼요?' có nghĩa là?", options: ["Cái này của tôi được không?", "Mặc thử được không?", "Mua được không?", "Trả lại được không?"], correct: 1, explanation: "입다 = mặc, -아/어봐도 돼요 = thử...được không? Cấu trúc xin phép." },
      { type: "multiple_choice", question: "Áo hơi rộng, bạn nói: '조금 ___ 것 같아요'", options: ["작은", "큰", "비싼", "예쁜"], correct: 1, explanation: "크다 = to/rộng. 조금 큰 것 같아요 = hình như hơi rộng. 작다 = nhỏ, 비싸다 = đắt." },
    ],
  },
  {
    id: 5,
    title: "Tại bệnh viện",
    titleKr: "병원에서",
    level: "TOPIK 1",
    category: "Sức khỏe",
    duration: "8 phút",
    emoji: "🏥",
    dialogue: {
      situation: "Tình huống: Bạn bị ốm và đến phòng khám ở Hàn Quốc",
      lines: [
        { speaker: "A", kr: "어디가 불편하세요?", romanization: "Eodiga bulpyeonhaseyo?", vi: "Bạn bị đau chỗ nào?" },
        { speaker: "B", kr: "머리가 너무 아프고 열이 나요.", romanization: "Meoriga neomu apeugo yeori nayo.", vi: "Đầu tôi đau lắm và bị sốt." },
        { speaker: "A", kr: "언제부터요?", romanization: "Eonjebuteoyo?", vi: "Từ khi nào vậy?" },
        { speaker: "B", kr: "어제부터요. 목도 아파요.", romanization: "Eojebuteoyo. Mokdo apayo.", vi: "Từ hôm qua. Họng cũng đau nữa." },
        { speaker: "A", kr: "감기 같네요. 약을 처방해 드릴게요.", romanization: "Gamgi gatneyo. Yageul cheobange deurilgeyo.", vi: "Có vẻ là cảm cúm. Tôi sẽ kê đơn thuốc cho bạn." },
        { speaker: "B", kr: "감사합니다. 며칠이나 먹어야 해요?", romanization: "Gamsahamnida. Myeochilina meogeoyo haeyo?", vi: "Cảm ơn. Tôi phải uống mấy ngày?" },
      ],
    },
    vocabulary: [
      { hangul: "아프다", romanization: "apeuda", meaning: "Đau" },
      { hangul: "열이 나다", romanization: "yeori nada", meaning: "Bị sốt" },
      { hangul: "머리", romanization: "meori", meaning: "Đầu" },
      { hangul: "목", romanization: "mok", meaning: "Cổ họng" },
      { hangul: "감기", romanization: "gamgi", meaning: "Cảm cúm" },
      { hangul: "약", romanization: "yak", meaning: "Thuốc" },
    ],
    grammar: [
      {
        pattern: "[bộ phận cơ thể]이/가 아파요",
        meaning: "[Bộ phận] bị đau",
        explanation: "Cấu trúc diễn tả đau nhức. [Bộ phận] + 이/가 (trợ từ chủ ngữ) + 아파요. Ví dụ: 머리가 아파요 = đau đầu, 배가 아파요 = đau bụng, 다리가 아파요 = đau chân. Trong tiếng Việt ta nói 'đau + bộ phận', tiếng Hàn đặt bộ phận lên trước làm chủ ngữ.",
        examples: [
          { kr: "배가 아파요.", vi: "Tôi bị đau bụng." },
          { kr: "다리가 많이 아파요.", vi: "Chân tôi đau nhiều lắm." },
        ],
      },
    ],
    quiz: [
      { type: "multiple_choice", question: "'열이 나요' có nghĩa là?", options: ["Bị ho", "Bị sốt", "Bị đau đầu", "Bị mệt"], correct: 1, explanation: "열 = nhiệt/sốt, 나다 = xuất hiện/ra. 열이 나다 = bị sốt (nghĩa đen: sốt xuất hiện)." },
      { type: "multiple_choice", question: "Đau bụng, bạn nói?", options: ["머리가 아파요", "배가 아파요", "다리가 아파요", "목이 아파요"], correct: 1, explanation: "배 = bụng. 배가 아파요 = bụng đau. 머리 = đầu, 다리 = chân, 목 = cổ họng." },
      { type: "multiple_choice", question: "Bác sĩ nói '감기 같네요', nghĩa là?", options: ["Bạn bị dị ứng", "Có vẻ là cảm cúm", "Bạn cần phẫu thuật", "Bạn khỏe rồi"], correct: 1, explanation: "감기 = cảm cúm, -같다 = có vẻ như/giống như, -네요 = thán từ ngạc nhiên/nhận thấy." },
    ],
  },
  {
    id: 6,
    title: "Gọi đồ tại cafe",
    titleKr: "카페에서",
    level: "TOPIK 1",
    category: "Ăn uống",
    duration: "7 phút",
    emoji: "☕",
    dialogue: {
      situation: "Tinh huong: Vao mot cafe Starbucks o Han Quoc goi nuoc",
      lines: [
        { speaker: "A", kr: "안녕하세요, 주문하시겠어요?", romanization: "Annyeonghaseyo, jumunhasigeseoyo?", vi: "Xin chào, bạn muốn gọi gì?" },
        { speaker: "B", kr: "아메리카노 한 잔 주세요.", romanization: "Amerikano han jan juseyo.", vi: "Cho tôi một ly americano." },
        { speaker: "A", kr: "따뜻한 거요, 아이스요?", romanization: "Ttatteuthan georyo, aiseuyo?", vi: "Nóng hay đá ạ?" },
        { speaker: "B", kr: "아이스로 주세요. 라지 사이즈로요.", romanization: "Aiseullo juseyo. Laji saijeuloyo.", vi: "Cho đá nhé. Size lớn luôn." },
        { speaker: "A", kr: "포인트 카드 있으세요?", romanization: "Pointeu kadeu isseuseyo?", vi: "Bạn có thẻ tích điểm không?" },
        { speaker: "B", kr: "아니요, 없어요. 카드로 계산할게요.", romanization: "Aniyo, eopseoyo. Kadeuro gyesanhalgeyo.", vi: "Không, tôi không có. Tôi trả bằng thẻ nhé." },
      ],
    },
    vocabulary: [
      { hangul: "아메리카노", romanization: "amerikano", meaning: "Americano" },
      { hangul: "따뜻하다", romanization: "ttatteutada", meaning: "Ấm nóng" },
      { hangul: "아이스", romanization: "aiseu", meaning: "Đá lạnh" },
      { hangul: "사이즈", romanization: "saijeu", meaning: "Kích cỡ" },
      { hangul: "포인트 카드", romanization: "pointeu kadeu", meaning: "Thẻ tích điểm" },
      { hangul: "계산하다", romanization: "gyesanhada", meaning: "Thanh toán/tính tiền" },
    ],
    grammar: [
      {
        pattern: "-(으)로 주세요",
        meaning: "Cho tôi loại/dạng ...",
        explanation: "-(으)로 chỉ phương tiện hoặc lựa chọn. Sau phụ âm dùng 으로, sau nguyên âm dùng 로. 아이스로 주세요 = cho đá (lựa chọn đá), 카드로 계산할게요 = thanh toán bằng thẻ. Trong tiếng Việt tương đương 'bằng' hoặc 'dạng'.",
        examples: [
          { kr: "현금으로 낼게요.", vi: "Tôi trả bằng tiền mặt." },
          { kr: "따뜻한 걸로 주세요.", vi: "Cho tôi loại nóng." },
        ],
      },
    ],
    quiz: [
      { type: "multiple_choice", question: "Goi mot ly americano nong, ban noi?", options: ["아이스 아메리카노 주세요", "따뜻한 아메리카노 주세요", "아메리카노 없어요", "커피 싫어요"], correct: 1, explanation: "따뜻한 = nong + 아메리카노 + 주세요 = cho toi. Day la cach goi do uong nong." },
      { type: "multiple_choice", question: "'계산할게요' co nghia la?", options: ["Toi muon xem menu", "Toi se thanh toan", "Toi can them thoi gian", "Toi muon huy don"], correct: 1, explanation: "계산하다 = tinh tien/thanh toan. -할게요 = toi se lam. Cau nay tuong duong 'Toi thanh toan nhe'." },
      { type: "multiple_choice", question: "Nhan vien hoi '포인트 카드 있으세요?', ho dang hoi gi?", options: ["Ban co the tan hang khong?", "Ban co the tin dung khong?", "Ban co the tich diem khong?", "Ban co so dien thoai khong?"], correct: 2, explanation: "포인트 카드 = the tich diem (loyalty card). 있으세요? = ban co ... khong?" },
    ],
  },
  {
    id: 7,
    title: "Hỏi giờ và lịch hẹn",
    titleKr: "시간 묻기",
    level: "TOPIK 1",
    category: "Thời gian",
    duration: "8 phút",
    emoji: "⏰",
    dialogue: {
      situation: "Tinh huong: Dang o van phong va can biet gio de khong tre cuoc hop",
      lines: [
        { speaker: "B", kr: "지금 몇 시예요?", romanization: "Jigeum myeot sieyeo?", vi: "Bay gio la may gio?" },
        { speaker: "A", kr: "두 시 반이에요.", romanization: "Du si banieyo.", vi: "2 gio ruoi." },
        { speaker: "B", kr: "회의가 몇 시에 시작해요?", romanization: "Hoeuiga myeot sie sijakhaeyo?", vi: "Cuoc hop bat dau luc may gio?" },
        { speaker: "A", kr: "세 시에 시작해요.", romanization: "Se sie sijakhaeyo.", vi: "Bat dau luc 3 gio." },
        { speaker: "B", kr: "그럼 30분 남았네요.", romanization: "Geureom samsip bun namatneyo.", vi: "Vay con 30 phut nua nhi." },
        { speaker: "A", kr: "네, 빨리 준비해요!", romanization: "Ne, ppalli junbihaeyo!", vi: "Ung, nhanh chuan bi di!" },
      ],
    },
    vocabulary: [
      { hangul: "몇 시예요", romanization: "myeot sieyeo", meaning: "Mấy giờ rồi?" },
      { hangul: "시", romanization: "si", meaning: "Giờ (đơn vị thời gian)" },
      { hangul: "분", romanization: "bun", meaning: "Phút" },
      { hangul: "반", romanization: "ban", meaning: "Rưỡi (30 phút)" },
      { hangul: "시작하다", romanization: "sijakhada", meaning: "Bắt đầu" },
      { hangul: "빨리", romanization: "ppalli", meaning: "Nhanh" },
    ],
    grammar: [
      {
        pattern: "Cach doc gio trong tieng Han",
        meaning: "So Han Viet cho gio, so thuan Viet cho phut",
        explanation: "Tieng Han dung 2 he thong so dem: So Han-Viet cho GIO (한 시=1h, 두 시=2h, 세 시=3h, 네 시=4h, 다섯 시=5h...) va so thuan Han cho PHUT (일 분=1ph, 이 분=2ph, 삼십 분=30ph). Vi du: 2 gio 30 phut = 두 시 삼십 분 hoac 두 시 반 (ban = ruoi).",
        examples: [
          { kr: "세 시 십오 분이에요.", vi: "La 3 gio 15 phut." },
          { kr: "여섯 시 반에 만나요.", vi: "Gap nhau luc 6 gio ruoi nhe." },
        ],
      },
    ],
    quiz: [
      { type: "multiple_choice", question: "'두 시 반'co nghia la may gio?", options: ["2 gio 10 phut", "2 gio 15 phut", "2 gio 30 phut", "2 gio 45 phut"], correct: 2, explanation: "반 (半) = nua = 30 phut. Hai gio 반 = 2:30. Tuong tu trong tieng Viet 'hai gio ruoi'." },
      { type: "multiple_choice", question: "Muon hoi may gio roi, ban dung cau?", options: ["몇 살이에요?", "몇 시예요?", "몇 명이에요?", "몇 층이에요?"], correct: 1, explanation: "몇 시예요? = May gio roi? 몇 살 = may tuoi, 몇 명 = may nguoi, 몇 층 = tang may." },
      { type: "multiple_choice", question: "'시작하다'co nghia la?", options: ["Ket thuc", "Bat dau", "Tiep tuc", "Dung lai"], correct: 1, explanation: "시작하다 = bat dau. Trai nghia la 끝나다 = ket thuc. 계속하다 = tiep tuc, 멈추다 = dung lai." },
    ],
  },
  {
    id: 8,
    title: "Nói về thời tiết",
    titleKr: "날씨 이야기",
    level: "TOPIK 1",
    category: "Cuộc sống hàng ngày",
    duration: "8 phút",
    emoji: "🌤️",
    dialogue: {
      situation: "Tinh huong: Noi chuyen voi dong nghiep truoc khi di an trua",
      lines: [
        { speaker: "A", kr: "오늘 날씨가 어때요?", romanization: "Oneul nalssiga eottaeyo?", vi: "Hom nay thoi tiet the nao?" },
        { speaker: "B", kr: "밖이 엄청 더워요. 35도래요.", romanization: "Bakki eomcheong deowoyo. Samsip o dorae yo.", vi: "Ngoai troi nong kinh. Nghe noi 35 do." },
        { speaker: "A", kr: "진짜요? 우산 챙겼어요?", romanization: "Jinjjayo? Usan chaenggyeosseoyo?", vi: "That a? Ban mang o ro chua?" },
        { speaker: "B", kr: "왜요? 비가 올 것 같아요?", romanization: "Waeyo? Biga ol geot gatayo?", vi: "Sao vay? Troi se mua a?" },
        { speaker: "A", kr: "오후에 비가 온다고 했어요.", romanization: "Ohuee biga ondago haesseoyo.", vi: "Ho noi chieu se co mua." },
        { speaker: "B", kr: "그럼 우산 챙길게요. 고마워요!", romanization: "Geureom usan chaenggilgeyo. Gomawoyo!", vi: "Vay thi minh mang o thi. Cam on nha!" },
      ],
    },
    vocabulary: [
      { hangul: "날씨", romanization: "nalssi", meaning: "Thời tiết" },
      { hangul: "덥다", romanization: "deobda", meaning: "Nóng" },
      { hangul: "춥다", romanization: "chupda", meaning: "Lạnh" },
      { hangul: "비가 오다", romanization: "biga oda", meaning: "Trời mưa" },
      { hangul: "우산", romanization: "usan", meaning: "Ô/Dù" },
      { hangul: "흐리다", romanization: "heurida", meaning: "Trời âm u/mây mù" },
    ],
    grammar: [
      {
        pattern: "-(으)ㄹ 것 같아요",
        meaning: "Co ve se ... / Hinh nhu se ...",
        explanation: "Cau truc du doan hoac suy doan. 비가 올 것 같아요 = co ve troi se mua. Cach tao: bo 다 cua dong tu + -(으)ㄹ 것 같다. Neu goc dong tu ket thuc bang nguyen am -> dung ㄹ, ket thuc bang phu am -> dung 을. Trong tieng Viet tuong duong 'hinh nhu se...' hoac 'co ve...'.",
        examples: [
          { kr: "눈이 올 것 같아요.", vi: "Co ve troi se co tuyet." },
          { kr: "오늘 바쁠 것 같아요.", vi: "Hom nay co ve se ban." },
        ],
      },
    ],
    quiz: [
      { type: "multiple_choice", question: "'날씨가 어때요?' co nghia la?", options: ["Hom nay la thu may?", "Thoi tiet the nao?", "Nhiet do la bao nhieu?", "Troi mua chua?"], correct: 1, explanation: "날씨 = thoi tiet, 어때요? = the nao? = Thoi tiet the nao?" },
      { type: "multiple_choice", question: "Troi dang mua, ban noi?", options: ["눈이 와요", "비가 와요", "바람이 불어요", "날씨가 맑아요"], correct: 1, explanation: "비 = mua, 와요 = den/roi. 비가 와요 = troi dang mua. 눈이 와요 = tuyet roi, 바람이 불어요 = gio dang toi, 맑아요 = quang dang." },
      { type: "multiple_choice", question: "'비가 올 것 같아요'co nghia la?", options: ["Troi vua mua xong", "Co ve troi se mua", "Troi dang mua", "Troi khong mua"], correct: 1, explanation: "-(으)ㄹ 것 같다 = co ve se... Du doan tuong lai. 올 = se den/roi (tu 오다)." },
    ],
  },
  {
    id: 9,
    title: "Tại cửa hàng tiện lợi",
    titleKr: "편의점에서",
    level: "TOPIK 1",
    category: "Cuộc sống hàng ngày",
    duration: "7 phút",
    emoji: "🏪",
    dialogue: {
      situation: "Tinh huong: Vao GS25 mua do an nhanh va thanh toan",
      lines: [
        { speaker: "B", kr: "이거 얼마예요?", romanization: "Igeo eolmayeyo?", vi: "Cai nay bao nhieu tien?" },
        { speaker: "A", kr: "1,500원이에요.", romanization: "Cheon obaeк wonieyeo.", vi: "1.500 won a." },
        { speaker: "B", kr: "이것도 같이 계산해 주세요.", romanization: "Igeotdo gachi gyesanhe juseyo.", vi: "Tinh luon cai nay cung nhe." },
        { speaker: "A", kr: "다해서 4,000원이에요. 봉투 필요하세요?", romanization: "Dahaeseo samcheon wonieyeo. Bongtu pilyohaseyo?", vi: "Tong cong 4.000 won. Ban can tui khong?" },
        { speaker: "B", kr: "아니요, 괜찮아요. 카드로 낼게요.", romanization: "Aniyo, gwaenchanacho. Kadeuro naelgeyo.", vi: "Khong, thoi a. Toi tra bang the." },
        { speaker: "A", kr: "여기 영수증이에요.", romanization: "Yeogi yeongsujeungieyeo.", vi: "Day la hoa don a." },
      ],
    },
    vocabulary: [
      { hangul: "편의점", romanization: "pyeonyijeom", meaning: "Cửa hàng tiện lợi" },
      { hangul: "봉투", romanization: "bongtu", meaning: "Túi (plastic)" },
      { hangul: "영수증", romanization: "yeongsujeung", meaning: "Hóa đơn/biên lai" },
      { hangul: "카드", romanization: "kadeu", meaning: "Thẻ (tín dụng/ghi nợ)" },
      { hangul: "현금", romanization: "hyeongeum", meaning: "Tiền mặt" },
      { hangul: "같이", romanization: "gachi", meaning: "Cùng/Luôn" },
    ],
    grammar: [
      {
        pattern: "다해서 [so tien]이에요",
        meaning: "Tong cong la [so tien]",
        explanation: "다 = tat ca, 해서 = lam thanh = tong hop lai. 다해서 = tong cong/cong lai. Day la cau thong dung khi thanh toan tai cua hang. Tuong tu: 전부 다 해서 = tat ca tong cong. Viet so tien: 100 = 백, 1000 = 천, 10000 = 만.",
        examples: [
          { kr: "다해서 만 원이에요.", vi: "Tong cong 10.000 won." },
          { kr: "다해서 오만 원입니다.", vi: "Tong cong 50.000 won." },
        ],
      },
    ],
    quiz: [
      { type: "multiple_choice", question: "Muon hoi gia, ban noi?", options: ["얼마예요?", "어디예요?", "무엇이에요?", "언제예요?"], correct: 0, explanation: "얼마예요? = Bao nhieu tien? La cau hoi gia co ban nhat khi di mua sam." },
      { type: "multiple_choice", question: "'봉투 필요하세요?' co nghia la?", options: ["Ban co the tin dung khong?", "Ban can hoa don khong?", "Ban can tui khong?", "Ban tra bang tien mat khong?"], correct: 2, explanation: "봉투 = tui (nhua), 필요하다 = can thiet/can. 봉투 필요하세요? = Ban can tui khong? (o Han Quoc hay hoi cau nay vi phi tui)." },
      { type: "multiple_choice", question: "Tra bang tien mat, ban noi?", options: ["카드로 낼게요", "현금으로 낼게요", "포인트로 낼게요", "앱으로 낼게요"], correct: 1, explanation: "현금 = tien mat + 으로 (bang) + 낼게요 (toi se tra). 카드로 = bang the, 포인트로 = bang diem tich luy." },
    ],
  },
  {
    id: 10,
    title: "Tự giới thiệu bản thân",
    titleKr: "자기소개",
    level: "TOPIK 1",
    category: "Giao tiếp hàng ngày",
    duration: "10 phút",
    emoji: "🙋",
    dialogue: {
      situation: "Tinh huong: Buoi tieu nganh dau tien, tu gioi thieu voi lop",
      lines: [
        { speaker: "B", kr: "안녕하세요, 자기소개 해주세요.", romanization: "Annyeonghaseyo, jagisogyae haejuseyo.", vi: "Xin chao, hay tu gioi thieu di." },
        { speaker: "A", kr: "안녕하세요! 저는 응우옌 민이에요. 베트남 사람이에요.", romanization: "Annyeonghaseyo! Jeoneun Nguyễn Min ieyo. Beteunam saramieyo.", vi: "Xin chao! Toi la Nguyen Minh. Toi la nguoi Viet Nam." },
        { speaker: "A", kr: "나이는 스물다섯 살이에요. 회사원이에요.", romanization: "Naineun seumul daseot sarieyeo. Hoesawonieyeo.", vi: "Toi 25 tuoi. Toi la nhan vien van phong." },
        { speaker: "A", kr: "취미는 음악 듣기예요. 한국 드라마도 좋아해요.", romanization: "Chwiminun eumak deutgieyeo. Hanguk deuramado johahaeyo.", vi: "So thich cua toi la nghe nhac. Toi cung thich phim Han Quoc." },
        { speaker: "B", kr: "반가워요! 한국어 잘 하시네요.", romanization: "Bangawoyo! Hangugeo jal hasineyeo.", vi: "Vui duoc gap! Ban noi tieng Han gioi qua." },
        { speaker: "A", kr: "아니에요, 아직 배우고 있어요. 잘 부탁드려요!", romanization: "Anieyo, ajik baeugo isseoyo. Jal butakdeuryeoyo!", vi: "Khong dau, toi van dang hoc. Mong duoc moi nguoi giup do!" },
      ],
    },
    vocabulary: [
      { hangul: "자기소개", romanization: "jagisogyae", meaning: "Tự giới thiệu" },
      { hangul: "나이", romanization: "nai", meaning: "Tuổi" },
      { hangul: "취미", romanization: "chwimi", meaning: "Sở thích/Hobby" },
      { hangul: "회사원", romanization: "hoesawon", meaning: "Nhân viên công ty" },
      { hangul: "아직", romanization: "ajik", meaning: "Vẫn/Còn (chưa)" },
      { hangul: "배우다", romanization: "baeuda", meaning: "Học/Học hỏi" },
    ],
    grammar: [
      {
        pattern: "저는 [nghe nghiep]이에요/예요",
        meaning: "Toi la [nghe nghiep]",
        explanation: "Cach gioi thieu nghe nghiep. Sau phu am dung 이에요, sau nguyen am dung 예요. Vi du: 학생이에요 (hoc sinh - ket thuc bang ng), 선생님이에요 (giao vien), 회사원이에요 (nhan vien), 의사예요 (bac si - ket thuc bang nguyen am). Ngoai ra tu gioi thieu thuong gom: ten (이름), tuoi (나이), nghe nghiep (직업), que quan (출신), so thich (취미).",
        examples: [
          { kr: "저는 학생이에요.", vi: "Toi la hoc sinh." },
          { kr: "저는 의사예요.", vi: "Toi la bac si." },
        ],
      },
    ],
    quiz: [
      { type: "multiple_choice", question: "'취미'co nghia la gi?", options: ["Nghe nghiep", "Ten", "So thich", "Tuoi"], correct: 2, explanation: "취미 = so thich/hobby. Khi tu gioi thieu thuong noi 취미는 ... 이에요/예요 = so thich cua toi la..." },
      { type: "multiple_choice", question: "Noi tuoi trong tieng Han: '25 tuoi' la?", options: ["이십오 살이에요", "스물다섯 살이에요", "스물오 살이에요", "이십다섯 살이에요"], correct: 1, explanation: "Tuoi dung so thuan Han: 스물다섯 = 25, 살 = tuoi. Khong dung so Han-Viet (이십오) cho tuoi trong giao tiep thuong ngay." },
      { type: "multiple_choice", question: "'잘 부탁드려요' dung trong tinh huong nao?", options: ["Khi tam biet", "Khi cap nhat moi nguoi cham soc/giup do", "Khi xin loi", "Khi cam on"], correct: 1, explanation: "잘 부탁드려요 = Mong duoc moi nguoi giup do / Mong chung ta hop tac tot. Dung khi lan dau gap, mang y nghia mo cau hop tac va nho nhuong." },
    ],
  },
]

export function getLessonById(id: number): Lesson | undefined {
  return lessons.find((l) => l.id === id)
}
