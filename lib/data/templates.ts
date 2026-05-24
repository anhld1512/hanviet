// Writing templates for Q51-Q54
// Phan loai: structure templates, sentence frames, useful expressions

export type Template = {
  id: number
  question_type: "q51" | "q52" | "q53" | "q54"
  title: string
  category: string
  content: string
  note?: string
}

// ============================================================
// Q51 Templates - Thu tu / Thong bao chinh thuc
// ============================================================
export const Q51_TEMPLATES: Template[] = [
  {
    id: 1001,
    question_type: "q51",
    title: "Thu cam on (thay/co, cap tren)",
    category: "감사 편지",
    content: `[인사] 안녕하세요. 저는 [관계]입니다.
[목적] 이번에 [상황]이/가 되어 감사의 편지를 씁니다.
[감사 이유] [기간] 동안 [도움 내용] 덕분에 [긍정적 결과].
[blank ㄱ] 특히 [분야]에서 [구체적 성과/도움받은 내용]습니다.
[다짐] 앞으로도 [가르침/도움]을 잊지 않고 열심히 [활동]하겠습니다.
[blank ㄴ] [loi chuc] (으)시기 바랍니다.
[마무리] 감사합니다.`,
    note: "blank ㄱ: su tien bo cu the / blank ㄴ: loi chuc suc khoe hoac thanh cong",
  },
  {
    id: 1002,
    question_type: "q51",
    title: "Thu moi (sinh nhat, su kien, hop)",
    category: "초대 편지",
    content: `[인사] 안녕하세요. 저는 [이름]입니다.
[목적] [날짜]에 [행사]이/가 있어 초대드리고 싶어 편지를 씁니다.
[일시/장소] 날짜는 [날짜] [시간]이고 장소는 [장소]입니다.
[blank ㄱ] [them thong tin ve su kien hoac chuan bi].
[초청] 바쁘시겠지만 꼭 와 주시면 좋겠습니다.
[blank ㄴ] 참석 여부를 [기한]까지 알려 주시면 감사하겠습니다.
[마무리] [이름] 드림`,
    note: "blank ㄱ: noi dung su kien / blank ㄴ: yeu cau xac nhan hoac loi cam on",
  },
  {
    id: 1003,
    question_type: "q51",
    title: "Thu xin loi (khong du hop, tre deadline)",
    category: "사과 편지",
    content: `[인사] 안녕하세요. 저는 [부서/이름]입니다.
[목적] [일시]에 있을 [행사]에 참석하지 못하게 되어 이렇게 연락 드립니다.
[이유] 그날 [blank ㄱ] [행사]에 참석하기 어렵게 되었습니다.
[요청] 제가 없는 동안 논의된 내용을 나중에 알려 주시면 감사하겠습니다.
[blank ㄴ] [xin loi] 불편을 드려서 정말 죄송합니다.
[마무리] [이름] 드림`,
    note: "blank ㄱ: ly do (lich hen, benh, cong tac) / blank ㄴ: xin loi + hua sau",
  },
  {
    id: 1004,
    question_type: "q51",
    title: "Thong bao chinh thuc (thay doi lich, su kien)",
    category: "공지문",
    content: `[수신] [대상자] 여러분께
[발신] 안녕하세요. [기관명]입니다.
[목적] [내용]에 대해 안내드립니다.
[상세] [blank ㄱ] [구체적 변경/안내 사항].
[사과/당부] [blank ㄴ] 궁금한 점이 있으시면 언제든지 연락해 주시기 바랍니다.
[마무리] 감사합니다.
[서명] [기관명] 드림`,
    note: "blank ㄱ: noi dung thay doi cu the / blank ㄴ: cach nhan them thong tin hoac xin loi",
  },
  {
    id: 1005,
    question_type: "q51",
    title: "Thu xin viec / xin hoc bong",
    category: "지원 편지",
    content: `[수신] 담당자님께
[자기소개] 안녕하세요. 저는 [학교/학과/학년] [이름]입니다. [채용/장학금] 공고를 보고 지원하게 되었습니다.
[경력/장점] 저는 [경험]이/가 있으며 [blank ㄱ] [구체적 역량/장점].
[다짐] [선발/수혜]해 주신다면 [blank ㄴ] 열심히 [활동/공부]하겠습니다.
[마무리] [이름] 드림`,
    note: "blank ㄱ: ky nang va diem manh / blank ㄴ: cam on hoac hua no luc",
  },
]

// ============================================================
// Q52 Templates - Nghi luan ngan voi 2 quan diem doi lap
// ============================================================
export const Q52_TEMPLATES: Template[] = [
  {
    id: 2001,
    question_type: "q52",
    title: "Cau truc co ban: 2 quan diem doi lap",
    category: "기본 구조",
    content: `[주제 소개] [주제]에 대해 찬반 의견이 있다.

[찬성/긍정] [찬성하는] 측에서는 [주장]고 주장한다. [근거로] [blank ㄱ] [구체적 이유/결과].

[반대/부정] 반면, [반대하는] 측에서는 [반대 주장]고 우려한다. [이유로] [blank ㄴ] [부정적 결과/문제].

[결론] 따라서 [주제]에 대한 균형 잡힌 시각이 필요하다.`,
    note: "blank ㄱ: loi ich / bang chung cu the / blank ㄴ: tac hai / van de cu the",
  },
  {
    id: 2002,
    question_type: "q52",
    title: "Cau truc: Uu - Nhuoc diem",
    category: "장단점 구조",
    content: `[주제 소개] [주제]에 대한 긍정적, 부정적 측면이 있다.

[장점] 긍정적인 측면에서는 [blank ㄱ] [구체적 장점/효과]. 또한 [추가 장점].

[단점] 그러나 부정적인 측면도 있다. [부정적 상황이 되면] [blank ㄴ] [문제점].

[결론] [주제]의 장단점을 잘 파악하여 [바람직한 방향]을 찾는 것이 중요하다.`,
    note: "blank ㄱ: loi ich tien ich cu the / blank ㄴ: van de phat sinh",
  },
  {
    id: 2003,
    question_type: "q52",
    title: "Cau truc: Quan diem A va quan diem B",
    category: "관점 비교",
    content: `[화제] [주제]에 대해 A와 B의 시각이 다르다.

A의 입장에서는 [주장]고 본다. [이러한 이유로] [blank ㄱ] [결과/근거].

반면 B는 다른 시각을 가지고 있다. [다른 측면에서 보면] [blank ㄴ] [반대 결과/근거].

[결론] [주제]에 대해서는 다양한 관점을 고려하는 자세가 필요하다.`,
    note: "blank ㄱ: ket qua theo quan diem A / blank ㄴ: ket qua theo quan diem B (doi lap)",
  },
]

// ============================================================
// Q53 Templates - Phan tich bieu do
// ============================================================
export const Q53_TEMPLATES: Template[] = [
  {
    id: 3001,
    question_type: "q53",
    title: "Cau truc co ban phan tich bieu do",
    category: "기본 구조",
    content: `[도입] 위 그래프는 [연도]년 [대상] [인원]명을 대상으로 [주제]을/를 조사한 결과이다.

[1위 항목] [1위 항목]이/가 [수치]%로 가장 높게 나타났다.

[2위 항목] 그 다음으로 [2위 항목]이/가 [수치]%, [3위 항목]이/가 [수치]% 순으로 나타났다.

[분석/원인] 이처럼 [1위 항목]이 높은 것은 [원인]기 때문인 것으로 보인다.

[마무리/시사점] 이러한 결과는 [의미/시사점]을/를 보여 준다.`,
    note: "200-300 chu. Khong can ket luan sau. Tap trung mo ta va phan tich nguyen nhan.",
  },
  {
    id: 3002,
    question_type: "q53",
    title: "Xu huong tang giam theo thoi gian",
    category: "추이 분석",
    content: `[도입] 위 그래프는 [기간] 동안의 [주제] 변화를 나타낸 것이다.

[전반적 추이] 전반적으로 [증가/감소]하는 추세를 보이고 있다. [시작연도]에는 [수치]%였으나 [끝연도]에는 [수치]%로 [증가/감소]하였다.

[특이점] 특히 [연도]에서 [연도] 사이에 가장 큰 [폭으로 증가/급격한 감소]가 나타났다.

[원인 분석] 이러한 변화는 [원인 1]과/와 [원인 2] 등의 영향을 받은 것으로 보인다.`,
    note: "So sanh so lieu dau va cuoi. Neu diem dac biet. Giai thich nguyen nhan 1-2 cau.",
  },
  {
    id: 3003,
    question_type: "q53",
    title: "So sanh 2 nhom (gioi tinh, do tuoi)",
    category: "비교 분석",
    content: `[도입] 위 그래프는 [구분 기준]에 따른 [주제] 차이를 조사한 결과이다.

[공통점] 두 그룹 모두 [공통 특징]이/가 높게 나타났다.

[차이점] 차이를 살펴보면, [A 그룹]은 [항목]이/가 [수치]%로 높은 반면, [B 그룹]은 [다른 항목]이/가 [수치]%로 높게 나타났다.

[원인] 이는 [A그룹]의 [특성]과 [B그룹]의 [특성] 차이에서 비롯된 것으로 분석된다.`,
    note: "Phan tich diem giong va khac biet giua 2 nhom. Giai thich nguyen nhan cuoi.",
  },
]

// ============================================================
// Q54 Templates - Luan nghi luan hoan chinh
// ============================================================
export const Q54_TEMPLATES: Template[] = [
  {
    id: 4001,
    question_type: "q54",
    title: "Cau truc luan van 3 phan chuan",
    category: "기본 구조",
    content: `[서론 - Mo bai ~80-100 chu]
현대 사회에서 [주제]은/는 중요한 문제로 떠오르고 있다. [배경/현황 설명]. 이 글에서는 [주제]에 대한 [긍정/부정/다양한] 측면을 살펴보고 [방향성]을 제시하고자 한다.

[본론 1 - Luan diem 1 ~150-170 chu]
먼저, [첫 번째 주장]이다. [근거 1]기 때문이다. 예를 들어, [구체적 예시]. 이처럼 [소결론].

[본론 2 - Luan diem 2 ~150-170 chu]
다음으로, [두 번째 주장]이다. [근거 2]. 실제로 [사례/데이터]. 따라서 [소결론].

[본론 3 - Giai phap hoac phan phuc ~150 chu] (tuy chon)
그러나 [문제점/반론]도 있다. 이를 해결하기 위해서는 [방안 1]과/와 [방안 2]이/가 필요하다.

[결론 - Ket luan ~80-100 chu]
이상에서 살펴본 바와 같이, [주제]은/는 [핵심 요약]. [사회/개인]이/가 [방향 제시] 노력을 기울여야 할 것이다.`,
    note: "Tong 600-700 chu. PHAI dung 합쇼체 (-ㅂ니다/습니다). Khong dung -아/어요.",
  },
  {
    id: 4002,
    question_type: "q54",
    title: "Cau truc: Van de + Nguyen nhan + Giai phap",
    category: "문제-원인-해결",
    content: `[서론] 오늘날 [문제 현상]이/가 심각한 문제로 대두되고 있다. [현황 수치/사례]. 이에 본고에서는 이 문제의 원인을 분석하고 해결 방안을 모색하고자 한다.

[본론 1 - 원인 분석] 이 문제가 발생하는 원인은 크게 두 가지로 볼 수 있다. 첫째, [원인 1]이다. [설명]. 둘째, [원인 2]이다. [설명].

[본론 2 - 해결 방안] 이러한 문제를 해결하기 위한 방안으로는 다음을 제안할 수 있다. 먼저, [방안 1]이/가 필요하다. [근거]. 또한, [방안 2]을/를 통해 [효과]을/를 기대할 수 있다.

[결론] 결론적으로, [문제]을/를 해결하기 위해서는 [핵심 방안]이 무엇보다 중요하다. [사회/정부/개인]의 적극적인 노력이 필요한 시점이다.`,
    note: "Dang bai nay pho bien nhat TOPIK II. Nen nam vung.",
  },
  {
    id: 4003,
    question_type: "q54",
    title: "Cau truc: Uu diem va Nhuoc diem",
    category: "장단점 분석",
    content: `[서론] [주제]은/는 현대인의 삶에 큰 영향을 미치고 있다. [현황 설명]. [주제]의 긍정적, 부정적 측면을 균형 있게 살펴볼 필요가 있다.

[본론 1 - 장점] 우선 [주제]의 긍정적인 면을 살펴보면, [장점 1]을/를 들 수 있다. [근거/예시]. 또한 [장점 2]이라는 점에서도 의미가 있다.

[본론 2 - 단점/문제] 반면, 부정적인 측면도 존재한다. [단점 1]이/가 우려된다. [근거]. 이 외에도 [단점 2]이라는 문제가 있다.

[결론] [주제]은/는 적절히 활용한다면 [긍정 효과]을/를 기대할 수 있다. 그러나 [부정적 측면]에 대한 대비도 소홀히 해서는 안 된다. 균형 잡힌 접근이 요구된다.`,
    note: "Phan tich ca 2 phia. Ket luan nen trung dung hoac nghieng ve phia co loi cho xa hoi.",
  },
]

// ============================================================
// Writing Expressions - Mau cau hoc thuat
// ============================================================
export type Expression = {
  id: number
  category: string
  korean: string
  usage: string
  example: string
  question_types: Array<"q51" | "q52" | "q53" | "q54">
}

export const WRITING_EXPRESSIONS: Expression[] = [
  // Mo dau / Dan nhap
  {
    id: 5001,
    category: "Mo dau",
    korean: "~에 대한 관심이 높아지고 있다",
    usage: "Noi ve su quan tam tang len voi chu de",
    example: "환경 문제에 대한 관심이 높아지고 있다",
    question_types: ["q53", "q54"],
  },
  {
    id: 5002,
    category: "Mo dau",
    korean: "~이/가 중요한 문제로 대두되고 있다",
    usage: "Neu van de quan trong dang noi len",
    example: "청년 실업이 중요한 문제로 대두되고 있다",
    question_types: ["q54"],
  },
  {
    id: 5003,
    category: "Mo dau",
    korean: "최근 ~하는 추세이다",
    usage: "Mo ta xu huong gan day",
    example: "최근 1인 가구가 증가하는 추세이다",
    question_types: ["q53", "q54"],
  },
  // Neu dan chung
  {
    id: 5004,
    category: "Dan chung",
    korean: "실제로 / 실제 조사에 따르면",
    usage: "Dan chung so lieu hoac nghien cuu",
    example: "실제 조사에 따르면 응답자의 68%가 찬성하였다",
    question_types: ["q52", "q53", "q54"],
  },
  {
    id: 5005,
    category: "Dan chung",
    korean: "예를 들어 / 예를 들면",
    usage: "Neu vi du cu the",
    example: "예를 들어 핀란드는 교육 복지 선진국으로 알려져 있다",
    question_types: ["q52", "q54"],
  },
  {
    id: 5006,
    category: "Dan chung",
    korean: "이와 관련하여",
    usage: "Lien quan den dieu da neu",
    example: "이와 관련하여 전문가들은 다양한 해결책을 제시하고 있다",
    question_types: ["q54"],
  },
  // Lien ket y
  {
    id: 5007,
    category: "Lien ket",
    korean: "반면(에) / 반면에",
    usage: "Trai lai, mat khac",
    example: "반면에 반대 입장에서는 비용 문제를 지적한다",
    question_types: ["q52", "q53", "q54"],
  },
  {
    id: 5008,
    category: "Lien ket",
    korean: "이에 따라 / 이로 인해",
    usage: "Nguyen nhan dan den ket qua",
    example: "이에 따라 사회적 불평등이 심화되고 있다",
    question_types: ["q53", "q54"],
  },
  {
    id: 5009,
    category: "Lien ket",
    korean: "뿐만 아니라 / 또한",
    usage: "Bo sung them y kien",
    example: "뿐만 아니라 경제적 효율도 높아진다",
    question_types: ["q52", "q53", "q54"],
  },
  {
    id: 5010,
    category: "Lien ket",
    korean: "이처럼 / 이와 같이",
    usage: "Tom tat y truoc do",
    example: "이처럼 소통의 중요성은 아무리 강조해도 지나치지 않는다",
    question_types: ["q52", "q53", "q54"],
  },
  // Giai phap / Kien nghi
  {
    id: 5011,
    category: "Giai phap",
    korean: "~을/를 위한 노력이 필요하다",
    usage: "Keu goi no luc de giai quyet",
    example: "환경 보호를 위한 노력이 필요하다",
    question_types: ["q54"],
  },
  {
    id: 5012,
    category: "Giai phap",
    korean: "~하는 방안을 마련해야 한다",
    usage: "Nen thiet lap bien phap",
    example: "청년 고용을 지원하는 방안을 마련해야 한다",
    question_types: ["q54"],
  },
  {
    id: 5013,
    category: "Giai phap",
    korean: "적극적인 대책이 요구된다",
    usage: "Yeu cau bien phap tich cuc",
    example: "정부와 기업의 적극적인 대책이 요구된다",
    question_types: ["q54"],
  },
  // Ket luan
  {
    id: 5014,
    category: "Ket luan",
    korean: "이상에서 살펴본 바와 같이",
    usage: "Mo dau cau ket luan (tom tat tren)",
    example: "이상에서 살펴본 바와 같이 교육의 질 향상이 중요하다",
    question_types: ["q54"],
  },
  {
    id: 5015,
    category: "Ket luan",
    korean: "결론적으로",
    usage: "Neu ket luan cuoi cung",
    example: "결론적으로 개인과 사회 모두의 노력이 필요하다",
    question_types: ["q52", "q54"],
  },
  // Q53 bieu do
  {
    id: 5016,
    category: "Phan tich bieu do",
    korean: "~이/가 [수치]%로 가장 높게 나타났다",
    usage: "Neu gia tri cao nhat",
    example: "대중교통이 42%로 가장 높게 나타났다",
    question_types: ["q53"],
  },
  {
    id: 5017,
    category: "Phan tich bieu do",
    korean: "~한 것은 ~기 때문인 것으로 보인다",
    usage: "Giai thich nguyen nhan so lieu",
    example: "대중교통 선호가 높은 것은 교통 혼잡 때문인 것으로 보인다",
    question_types: ["q53"],
  },
  {
    id: 5018,
    category: "Phan tich bieu do",
    korean: "전반적으로 ~하는 추세를 보이고 있다",
    usage: "Mo ta xu huong tong the",
    example: "전반적으로 증가하는 추세를 보이고 있다",
    question_types: ["q53"],
  },
  // Q51 - Thu tu
  {
    id: 5019,
    category: "Thu tu",
    korean: "~덕분에 ~이/가 많이 늘었습니다",
    usage: "Cam on su giup do giup ban tien bo",
    example: "선생님 덕분에 실력이 많이 늘었습니다",
    question_types: ["q51"],
  },
  {
    id: 5020,
    category: "Thu tu",
    korean: "~(으)시기 바랍니다",
    usage: "Loi chuc cuoi thu trang trong",
    example: "항상 건강하시기 바랍니다",
    question_types: ["q51"],
  },
  {
    id: 5021,
    category: "Thu tu",
    korean: "불편을 드려서 죄송합니다",
    usage: "Xin loi vi gay bat tien",
    example: "갑자기 연락드려서 불편을 드려서 죄송합니다",
    question_types: ["q51"],
  },
]

// Helper
export function getTemplatesByType(type: "q51" | "q52" | "q53" | "q54"): Template[] {
  switch (type) {
    case "q51": return Q51_TEMPLATES
    case "q52": return Q52_TEMPLATES
    case "q53": return Q53_TEMPLATES
    case "q54": return Q54_TEMPLATES
  }
}

export function getExpressionsByType(type: "q51" | "q52" | "q53" | "q54"): Expression[] {
  return WRITING_EXPRESSIONS.filter((e) => e.question_types.includes(type))
}
