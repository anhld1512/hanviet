// Writing prompts data for Q51-Q54
// Source: TOPIK II past exams + curated practice

export type Blank = {
  key: string
  hint: string
  example: string
  pattern: string
}

export type WritingPrompt = {
  id: number
  question_type: "q51" | "q52" | "q53" | "q54"
  source: string
  context: string
  text_kr: string
  blanks?: Blank[]
  chart_data?: object
  topic?: string
  difficulty: "easy" | "medium" | "hard"
}

// ============================================================
// Q51 - Thuc dung van (practical writing - fill 2 blanks)
// ============================================================
export const Q51_PROMPTS: WritingPrompt[] = [
  {
    id: 101,
    question_type: "q51",
    source: "TOPIK 83",
    context: "Thu cam on gui den giao vien da giup do trong nam hoc",
    difficulty: "easy",
    text_kr: `선생님께

안녕하세요. 저는 선생님 수업을 들은 학생입니다. 이번에 졸업을 하게 되어 선생님께 감사의 편지를 씁니다.

지난 1년 동안 선생님께서 열심히 가르쳐 주신 덕분에 제 한국어 실력이 많이 늘었습니다. 특히 글쓰기 부분에서 (   ㄱ   ).

앞으로도 선생님의 가르침을 잊지 않고 열심히 공부하겠습니다. (   ㄴ   ).

감사합니다.
학생 드림`,
    blanks: [
      {
        key: "ㄱ",
        hint: "Viet ve su tien bo cu the nho thay/co",
        example: "많은 도움을 받았습니다",
        pattern: "[dieu duoc giup] + 아/어 주셔서 감사합니다 / 도움을 받았습니다",
      },
      {
        key: "ㄴ",
        hint: "Loi chuc cuoi thu",
        example: "항상 건강하시기 바랍니다",
        pattern: "[loi chuc] + (으)시기 바랍니다",
      },
    ],
  },
  {
    id: 102,
    question_type: "q51",
    source: "TOPIK 81",
    context: "Thu moi du tiec sinh nhat",
    difficulty: "easy",
    text_kr: `안녕하세요.

저는 한국어 수업에서 함께 공부하는 김민준입니다. 다음 주 토요일이 제 생일이라서 친구들을 집으로 초대하려고 합니다.

날짜는 다음 주 토요일 오후 6시이고 장소는 제 집입니다. (   ㄱ   ).

바쁘시겠지만 꼭 와 주시면 좋겠습니다. (   ㄴ   ).

김민준 드림`,
    blanks: [
      {
        key: "ㄱ",
        hint: "Them thong tin ve tiec (thuc an, chuong trinh)",
        example: "간단한 음식과 음료를 준비하겠습니다",
        pattern: "[noi dung chuan bi] + (으)겠습니다",
      },
      {
        key: "ㄴ",
        hint: "Yeu cau xac nhan tham du",
        example: "참석 여부를 미리 알려 주시면 감사하겠습니다",
        pattern: "참석 여부를 + [hanh dong] + 주시면 감사하겠습니다",
      },
    ],
  },
  {
    id: 103,
    question_type: "q51",
    source: "TOPIK 79",
    context: "Thong bao lich hoc thay doi",
    difficulty: "easy",
    text_kr: `회원 여러분께

안녕하세요. 한국어 교육원입니다.

다음 달부터 수업 시간이 변경될 예정입니다. 기존 월요일 오후 2시 수업이 (   ㄱ   ).

불편을 드려서 죄송합니다. (   ㄴ   ) 궁금한 점이 있으시면 언제든지 연락해 주시기 바랍니다.

감사합니다.
한국어 교육원 드림`,
    blanks: [
      {
        key: "ㄱ",
        hint: "Thong bao lich moi (ngay gio moi)",
        example: "화요일 오후 3시로 변경됩니다",
        pattern: "[ngay/gio moi] + (으)로 변경됩니다",
      },
      {
        key: "ㄴ",
        hint: "Yeu cau xem lich dinh kem hoac huong dan tiep theo",
        example: "자세한 내용은 첨부 파일을 확인해 주시기 바랍니다.",
        pattern: "자세한 내용은 + [nguon thong tin] + 확인해 주시기 바랍니다",
      },
    ],
  },
  {
    id: 104,
    question_type: "q51",
    source: "TOPIK 77",
    context: "Thu xin loi vi khong the den du buoi hop",
    difficulty: "medium",
    text_kr: `팀장님께

안녕하세요. 저는 마케팅팀 이수진입니다. 다음 주 월요일 팀 회의에 참석하지 못하게 되어 이렇게 연락 드립니다.

그날 (   ㄱ   ) 회의에 참석하기 어렵게 되었습니다.

제가 없는 동안 논의된 내용을 나중에 알려 주시면 감사하겠습니다. (   ㄴ   ).

이수진 드림`,
    blanks: [
      {
        key: "ㄱ",
        hint: "Ly do khong the tham du (lich hen, benh, cong tac)",
        example: "병원 예약이 있어서",
        pattern: "[ly do] + (아/어)서 / (으)로 인해",
      },
      {
        key: "ㄴ",
        hint: "Xin loi va hua bom viec sau",
        example: "불편을 드려서 정말 죄송합니다",
        pattern: "불편을 드려서 + 죄송합니다 / 양해 부탁드립니다",
      },
    ],
  },
  {
    id: 105,
    question_type: "q51",
    source: "TOPIK 75",
    context: "Thu gui ban hang xe bom hoc phi",
    difficulty: "medium",
    text_kr: `담당자분께

안녕하세요. 저는 이번 학기 장학금을 신청한 박지훈입니다.

신청 서류를 검토하시다가 혹시 추가 서류가 필요하시면 바로 제출할 수 있습니다. (   ㄱ   ).

장학금 수혜를 받게 된다면 (   ㄴ   ) 열심히 공부하겠습니다.

박지훈 드림`,
    blanks: [
      {
        key: "ㄱ",
        hint: "Neu ten tai lieu da nop va ho so hien co",
        example: "현재 성적 증명서와 재학 증명서를 제출하였습니다",
        pattern: "[ten tai lieu] + 을/를 제출하였습니다",
      },
      {
        key: "ㄴ",
        hint: "Cam on va hua no luc",
        example: "장학금에 보답하기 위해",
        pattern: "장학금에 보답하기 위해 / 기대에 부응하여",
      },
    ],
  },
  {
    id: 106,
    question_type: "q51",
    source: "TOPIK 73",
    context: "Thong bao hoat dong tinh nguyen vien",
    difficulty: "easy",
    text_kr: `자원봉사자 여러분께

안녕하세요. 지역 복지관입니다.

이번 달 어르신 돌봄 봉사 활동을 안내해 드립니다. 활동 일시는 매주 토요일 오전 10시이며 (   ㄱ   ).

처음 참여하시는 분들은 (   ㄴ   ) 미리 담당자에게 연락 주시기 바랍니다.

감사합니다.`,
    blanks: [
      {
        key: "ㄱ",
        hint: "Thong tin ve dia diem hoat dong",
        example: "장소는 복지관 1층 대강당입니다",
        pattern: "장소는 + [dia diem] + 입니다",
      },
      {
        key: "ㄴ",
        hint: "Yeu cau dang ky truoc",
        example: "사전 등록이 필요하오니",
        pattern: "사전 등록이 필요하오니 / [dieu kien] + (으)시면",
      },
    ],
  },
  {
    id: 107,
    question_type: "q51",
    source: "TOPIK 71",
    context: "Thu moi tham gia cau lac bo sach",
    difficulty: "easy",
    text_kr: `안녕하세요.

저는 독서 모임 '책 읽는 사람들'의 대표 최유나입니다. 저희 모임에 함께하실 분들을 모집합니다.

저희 모임은 매월 두 번째 일요일에 모여 책을 함께 읽고 이야기를 나눕니다. (   ㄱ   ).

관심 있으신 분들은 (   ㄴ   ) 연락 주시면 감사하겠습니다.

최유나 드림`,
    blanks: [
      {
        key: "ㄱ",
        hint: "Mo ta them ve cau lac bo (the loai sach, so luong thanh vien)",
        example: "현재 10명의 회원이 활동하고 있으며 주로 소설과 에세이를 읽습니다",
        pattern: "현재 [so luong] + 명이 활동하고 있으며 + [mo ta hoat dong]",
      },
      {
        key: "ㄴ",
        hint: "Cach thuc lien lac de dang ky",
        example: "아래 이메일이나 전화로",
        pattern: "[phuong thuc lien lac] + (으)로 연락 주시면",
      },
    ],
  },
  {
    id: 108,
    question_type: "q51",
    source: "TOPIK 69",
    context: "Thu xin viec lam them sinh vien",
    difficulty: "medium",
    text_kr: `담당자님께

안녕하세요. 저는 한국대학교 경영학과 2학년에 재학 중인 응우옌 반 안입니다. 귀사의 아르바이트 채용 공고를 보고 지원하게 되었습니다.

저는 편의점 아르바이트를 1년간 한 경험이 있으며 (   ㄱ   ).

채용해 주신다면 (   ㄴ   ) 열심히 일하겠습니다.

응우옌 반 안 드림`,
    blanks: [
      {
        key: "ㄱ",
        hint: "Neu kinh nghiem va diem manh ban than",
        example: "고객 서비스와 계산 업무를 능숙하게 처리할 수 있습니다",
        pattern: "[ky nang/kinh nghiem] + 을/를 + 능숙하게 처리할 수 있습니다",
      },
      {
        key: "ㄴ",
        hint: "Cam on va hua no luc",
        example: "기대에 어긋나지 않도록",
        pattern: "기대에 어긋나지 않도록 / 맡겨 주신 일에 최선을 다해",
      },
    ],
  },
  {
    id: 109,
    question_type: "q51",
    source: "TOPIK 67",
    context: "Thu tra loi cam on cua hoc sinh",
    difficulty: "medium",
    text_kr: `민준이에게

편지 잘 받았어요. 졸업을 진심으로 축하해요.

1년 동안 정말 열심히 공부했고, 그 노력이 빛을 발한 것 같아요. 특히 (   ㄱ   ) 정말 기특했어요.

앞으로의 생활에서도 지금처럼 (   ㄴ   ). 언제든지 도움이 필요하면 연락해요.

선생님으로부터`,
    blanks: [
      {
        key: "ㄱ",
        hint: "Khen ngoi diem cu the cua hoc sinh",
        example: "포기하지 않고 끝까지 노력하는 모습이",
        pattern: "[hanh dong dang khen] + 는 모습이 + 기특했어요/대견했어요",
      },
      {
        key: "ㄴ",
        hint: "Loi chuc tuong lai",
        example: "최선을 다하길 바랍니다",
        pattern: "[hanh dong mong muon] + (으)길 바랍니다",
      },
    ],
  },
  {
    id: 110,
    question_type: "q51",
    source: "TOPIK 65",
    context: "Thong bao ket qua tuyen sinh",
    difficulty: "easy",
    text_kr: `지원자 여러분께

한국어 능력 향상 과정에 지원해 주셔서 감사합니다.

서류 심사 결과, 귀하께서는 최종 합격하셨습니다. (   ㄱ   ).

등록을 원하시는 분께서는 이번 주 금요일까지 (   ㄴ   ) 등록을 완료해 주시기 바랍니다.

한국어 교육원 드림`,
    blanks: [
      {
        key: "ㄱ",
        hint: "Chuc mung va thong bao lich hoc bat dau",
        example: "축하드리며 수업은 다음 달 1일부터 시작됩니다",
        pattern: "축하드리며 + 수업은 [thoi gian] + 부터 시작됩니다",
      },
      {
        key: "ㄴ",
        hint: "Huong dan cach nop le phi hoac ho so",
        example: "수강료를 납부하시고",
        pattern: "[hanh dong] + (으)시고 / 후에",
      },
    ],
  },
]

// ============================================================
// Q52 - Nghi luan ngan (argumentative - fill 2 blanks)
// ============================================================
export const Q52_PROMPTS: WritingPrompt[] = [
  {
    id: 201,
    question_type: "q52",
    source: "TOPIK 83",
    context: "Tranh luan ve viec su dung dien thoai cua tre em",
    difficulty: "medium",
    text_kr: `요즘 어린이들이 스마트폰을 많이 사용한다. 이에 대해 찬성하는 입장과 반대하는 입장이 있다.

찬성하는 측에서는 스마트폰이 교육에 도움이 된다고 주장한다. 다양한 학습 앱을 통해 (   ㄱ   ).

반면, 반대하는 측에서는 건강 문제를 우려한다. 장시간 스마트폰을 사용하면 (   ㄴ   ).

따라서 어린이의 스마트폰 사용에 대해서는 균형 잡힌 시각이 필요하다.`,
    blanks: [
      {
        key: "ㄱ",
        hint: "Nen tao hoat dong hoc tap tu dien thoai (loi ich)",
        example: "재미있게 공부할 수 있기 때문이다",
        pattern: "[loi ich cu the] + (으)ㄹ 수 있기 때문이다",
      },
      {
        key: "ㄴ",
        hint: "Tac hai cu the den suc khoe (mat, co, ngu)",
        example: "시력 저하나 수면 장애가 생길 수 있다",
        pattern: "[van de suc khoe] + 이/가 생길 수 있다 / 나타날 수 있다",
      },
    ],
  },
  {
    id: 202,
    question_type: "q52",
    source: "TOPIK 81",
    context: "Tranh luan ve lam viec tu xa",
    difficulty: "medium",
    text_kr: `재택근무에 대한 의견이 나뉘고 있다.

긍정적인 측면에서는 출퇴근 시간이 줄어들어 (   ㄱ   ). 또한 개인 생활과 업무를 균형 있게 유지할 수 있다.

그러나 부정적인 측면도 있다. 집에서 일하면 (   ㄴ   ) 업무 효율이 떨어질 수 있다.

재택근무의 장단점을 잘 파악하여 회사와 직원 모두에게 맞는 방식을 찾아야 한다.`,
    blanks: [
      {
        key: "ㄱ",
        hint: "Loi ich cua viec tiet kiem thoi gian di chuyen",
        example: "그 시간을 자기 계발에 활용할 수 있다",
        pattern: "[thoi gian tiet kiem] + 을/를 + [hoat dong] + 에 활용할 수 있다",
      },
      {
        key: "ㄴ",
        hint: "Van de khi lam viec tai nha (phan tam, giao tiep)",
        example: "동료와의 소통이 어려워지고 집중력이 떨어져",
        pattern: "[van de] + 이/가 어려워지고 / (아/어)져",
      },
    ],
  },
  {
    id: 203,
    question_type: "q52",
    source: "TOPIK 79",
    context: "Tranh luan ve du lich mot minh",
    difficulty: "easy",
    text_kr: `혼자 여행하는 것에 대해 찬반 의견이 있다.

좋아하는 사람들은 자유롭게 일정을 정할 수 있어서 (   ㄱ   )고 말한다. 또한 새로운 사람을 만나고 자신을 돌아보는 기회가 된다.

반면, 불편하다는 의견도 있다. 혼자 여행하면 (   ㄴ   ) 위험할 수 있다.

각자의 여행 스타일에 맞는 방법을 선택하는 것이 중요하다.`,
    blanks: [
      {
        key: "ㄱ",
        hint: "Loi ich cua viec di du lich mot minh (tu do, ke hoach rieng)",
        example: "자신만의 속도로 여행을 즐길 수 있다",
        pattern: "[hanh dong] + (으)ㄹ 수 있다",
      },
      {
        key: "ㄴ",
        hint: "Nhuoc diem khi di mot minh (co don, nguy hiem)",
        example: "도움을 받기 어렵고 안전 문제에 노출되기 쉬워",
        pattern: "[van de] + (으)기 어렵고 / 쉬워",
      },
    ],
  },
  {
    id: 204,
    question_type: "q52",
    source: "TOPIK 77",
    context: "Tranh luan ve giao duc suat som cho tre",
    difficulty: "hard",
    text_kr: `어린 나이부터 조기 교육을 시키는 것에 대한 의견이 다양하다.

찬성론자들은 어린 시절이 학습 능력이 가장 뛰어난 시기라고 주장한다. 이 시기에 다양한 것을 배우면 (   ㄱ   ).

반면 반대론자들은 아이의 정서 발달을 중요시한다. 지나친 조기 교육은 (   ㄴ   ) 오히려 부작용이 생길 수 있다.

적절한 균형을 찾는 것이 무엇보다 중요하다.`,
    blanks: [
      {
        key: "ㄱ",
        hint: "Loi ich hoc som (tao nen tang, phat trien nang khieu)",
        example: "나중에 더 빠르게 발전할 수 있는 기반을 마련할 수 있다",
        pattern: "[kha nang] + (으)ㄹ 수 있는 기반을 마련할 수 있다",
      },
      {
        key: "ㄴ",
        hint: "Tac hai cua viec ep buoc hoc qua som",
        example: "아이에게 스트레스를 주어",
        pattern: "[chu the] + 에게 + [tac hai] + 을/를 주어 / (아/어)서",
      },
    ],
  },
  {
    id: 205,
    question_type: "q52",
    source: "TOPIK 75",
    context: "Tranh luan ve mang xa hoi",
    difficulty: "medium",
    text_kr: `소셜 미디어 사용에 대한 찬반 의견이 있다.

긍정적인 입장에서는 소셜 미디어가 사람들의 연결을 강화한다고 본다. 멀리 떨어진 사람들과도 (   ㄱ   ).

부정적인 입장에서는 개인 정보 노출 문제를 지적한다. 무분별한 개인 정보 공유는 (   ㄴ   ).

소셜 미디어를 현명하게 사용하는 자세가 필요하다.`,
    blanks: [
      {
        key: "ㄱ",
        hint: "Loi ich ket noi (giu lien lac, chia se)",
        example: "쉽게 소통하고 관계를 유지할 수 있기 때문이다",
        pattern: "[hanh dong] + (으)ㄹ 수 있기 때문이다",
      },
      {
        key: "ㄴ",
        hint: "Hau qua lo lo thong tin ca nhan",
        example: "사생활 침해나 범죄로 이어질 수 있다",
        pattern: "[hau qua] + (으)로 이어질 수 있다",
      },
    ],
  },
]

// ============================================================
// Q53 - Phan tich bieu do (chart analysis, 200-300 chars)
// ============================================================
export const Q53_PROMPTS: WritingPrompt[] = [
  {
    id: 301,
    question_type: "q53",
    source: "TOPIK 83",
    context: "Khao sat ly do hoc tieng Han cua nguoi nuoc ngoai",
    difficulty: "medium",
    chart_data: {
      title: "외국인이 한국어를 배우는 이유 (복수 응답)",
      items: [
        { label: "한국 문화(드라마, K-POP) 관심", percent: 68 },
        { label: "취업/진학 목적", percent: 45 },
        { label: "한국인 친구/배우자와 소통", percent: 38 },
        { label: "한국 여행 준비", percent: 29 },
        { label: "기타", percent: 12 },
      ],
      year: 2023,
      respondents: 1500,
    },
    text_kr: `위 그래프는 2023년 외국인 1,500명을 대상으로 한국어를 배우는 이유를 조사한 결과이다.`,
    topic: "Viet bai phan tich bieu do khao sat ly do hoc tieng Han",
  },
  {
    id: 302,
    question_type: "q53",
    source: "TOPIK 81",
    context: "Khao sat thoi gian su dung dien thoai theo do tuoi",
    difficulty: "medium",
    chart_data: {
      title: "연령대별 하루 평균 스마트폰 사용 시간",
      items: [
        { label: "10대", hours: 6.2 },
        { label: "20대", hours: 5.8 },
        { label: "30대", hours: 4.1 },
        { label: "40대", hours: 3.3 },
        { label: "50대 이상", hours: 2.1 },
      ],
      year: 2023,
      respondents: 2000,
    },
    text_kr: `위 그래프는 2023년 연령대별 하루 평균 스마트폰 사용 시간을 조사한 결과이다.`,
    topic: "Viet bai phan tich bieu do su dung dien thoai theo do tuoi",
  },
  {
    id: 303,
    question_type: "q53",
    source: "TOPIK 79",
    context: "Khao sat phuong tien di chuyen ua thich",
    difficulty: "easy",
    chart_data: {
      title: "선호하는 출퇴근 교통수단 (단위: %)",
      items: [
        { label: "대중교통", percent: 42 },
        { label: "자가용", percent: 31 },
        { label: "자전거/킥보드", percent: 15 },
        { label: "도보", percent: 9 },
        { label: "기타", percent: 3 },
      ],
      year: 2022,
      respondents: 1800,
    },
    text_kr: `위 그래프는 2022년 직장인 1,800명을 대상으로 선호하는 출퇴근 교통수단을 조사한 결과이다.`,
    topic: "Viet bai phan tich bieu do phuong tien di chuyen",
  },
  {
    id: 304,
    question_type: "q53",
    source: "TOPIK 77",
    context: "Xu huong ty le khong ket hon o Viet Nam",
    difficulty: "hard",
    chart_data: {
      title: "연도별 미혼율 변화 (20-34세, 단위: %)",
      items: [
        { label: "2000년", percent: 29 },
        { label: "2005년", percent: 35 },
        { label: "2010년", percent: 44 },
        { label: "2015년", percent: 51 },
        { label: "2020년", percent: 61 },
      ],
      year: 2020,
      respondents: null,
    },
    text_kr: `위 그래프는 2000년부터 2020년까지 20~34세 미혼율 변화를 나타낸 것이다.`,
    topic: "Viet bai phan tich xu huong ty le khong ket hon",
  },
  {
    id: 305,
    question_type: "q53",
    source: "TOPIK 75",
    context: "Khao sat hoat dong giai tri ua thich theo gioi tinh",
    difficulty: "medium",
    chart_data: {
      title: "성별 선호 여가 활동 (복수 응답, 단위: %)",
      male: [
        { label: "게임", percent: 52 },
        { label: "운동", percent: 48 },
        { label: "독서", percent: 25 },
        { label: "여행", percent: 35 },
      ],
      female: [
        { label: "쇼핑", percent: 58 },
        { label: "독서", percent: 42 },
        { label: "여행", percent: 45 },
        { label: "요리", percent: 38 },
      ],
      year: 2022,
      respondents: 1200,
    },
    text_kr: `위 그래프는 2022년 성인 1,200명을 대상으로 성별 선호 여가 활동을 조사한 결과이다.`,
    topic: "Viet bai phan tich bieu do hoat dong giai tri theo gioi tinh",
  },
]

// ============================================================
// Q54 - Luan nghi luan (argumentative essay, 600-700 chars)
// ============================================================
export const Q54_PROMPTS: WritingPrompt[] = [
  {
    id: 401,
    question_type: "q54",
    source: "TOPIK 83",
    difficulty: "hard",
    context: "Cong nghe AI va tuong lai nhan loai",
    text_kr: `다음을 주제로 하여 자신의 생각을 600~700자로 쓰시오. (단, 문제를 그대로 옮겨 쓰지 마시오.)`,
    topic: `인공지능 기술이 발전함에 따라 인간의 역할이 어떻게 변화할지 논하고, 이에 대한 사회적 대응 방안을 쓰시오.`,
  },
  {
    id: 402,
    question_type: "q54",
    source: "TOPIK 81",
    difficulty: "hard",
    context: "Moi truong va tang truong kinh te",
    text_kr: `다음을 주제로 하여 자신의 생각을 600~700자로 쓰시오. (단, 문제를 그대로 옮겨 쓰지 마시오.)`,
    topic: `환경 보호와 경제 성장은 서로 충돌한다는 견해가 있다. 이에 대한 자신의 견해를 논리적으로 쓰시오.`,
  },
  {
    id: 403,
    question_type: "q54",
    source: "TOPIK 79",
    difficulty: "medium",
    context: "Van hoa doc sach trong thoi dai so",
    text_kr: `다음을 주제로 하여 자신의 생각을 600~700자로 쓰시오. (단, 문제를 그대로 옮겨 쓰지 마시오.)`,
    topic: `디지털 시대에 독서 문화가 쇠퇴하고 있다는 우려가 있다. 독서의 가치와 독서 문화 활성화 방안에 대해 쓰시오.`,
  },
  {
    id: 404,
    question_type: "q54",
    source: "TOPIK 77",
    difficulty: "hard",
    context: "He thong phuc loi xa hoi va trach nhiem ca nhan",
    text_kr: `다음을 주제로 하여 자신의 생각을 600~700자로 쓰시오. (단, 문제를 그대로 옮겨 쓰지 마시오.)`,
    topic: `복지 사회 실현을 위해 국가와 개인은 각각 어떤 역할을 해야 하는지 논하시오.`,
  },
  {
    id: 405,
    question_type: "q54",
    source: "TOPIK 75",
    difficulty: "medium",
    context: "Lao dong nuoc ngoai va xa hoi Han Quoc",
    text_kr: `다음을 주제로 하여 자신의 생각을 600~700자로 쓰시오. (단, 문제를 그대로 옮겨 쓰지 마시오.)`,
    topic: `외국인 근로자 증가가 한국 사회에 미치는 영향을 긍정적, 부정적 측면에서 분석하고 바람직한 방향을 제시하시오.`,
  },
]

// Helper to get prompts by type
export function getPromptsByType(type: "q51" | "q52" | "q53" | "q54"): WritingPrompt[] {
  switch (type) {
    case "q51": return Q51_PROMPTS
    case "q52": return Q52_PROMPTS
    case "q53": return Q53_PROMPTS
    case "q54": return Q54_PROMPTS
  }
}

// Get random prompt by type
export function getRandomPrompt(type: "q51" | "q52" | "q53" | "q54"): WritingPrompt {
  const prompts = getPromptsByType(type)
  return prompts[Math.floor(Math.random() * prompts.length)]
}
