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
// Q51 - Thực dụng văn (practical writing - fill 2 blanks)
// ============================================================
export const Q51_PROMPTS: WritingPrompt[] = [
  {
    id: 101,
    question_type: "q51",
    source: "TOPIK 83",
    context: "Thư cảm ơn gửi đến giáo viên đã giúp đỡ trong năm học",
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
        hint: "Viết về sự tiến bộ cụ thể nhờ thay/cô",
        example: "많은 도움을 받았습니다",
        pattern: "[điều được giúp] + 아/어 주셔서 감사합니다 / 도움을 받았습니다",
      },
      {
        key: "ㄴ",
        hint: "Lời chúc cuối thư",
        example: "항상 건강하시기 바랍니다",
        pattern: "[lời chúc] + (으)시기 바랍니다",
      },
    ],
  },
  {
    id: 102,
    question_type: "q51",
    source: "TOPIK 81",
    context: "Thư mời dự tiệc sinh nhật",
    difficulty: "easy",
    text_kr: `안녕하세요.

저는 한국어 수업에서 함께 공부하는 김민준입니다. 다음 주 토요일이 제 생일이라서 친구들을 집으로 초대하려고 합니다.

날짜는 다음 주 토요일 오후 6시이고 장소는 제 집입니다. (   ㄱ   ).

바쁘시겠지만 꼭 와 주시면 좋겠습니다. (   ㄴ   ).

김민준 드림`,
    blanks: [
      {
        key: "ㄱ",
        hint: "Thêm thông tin về tiệc (thức ăn, chương trình)",
        example: "간단한 음식과 음료를 준비하겠습니다",
        pattern: "[nội dung chuẩn bị] + (으)겠습니다",
      },
      {
        key: "ㄴ",
        hint: "Yêu cầu xác nhận tham dự",
        example: "참석 여부를 미리 알려 주시면 감사하겠습니다",
        pattern: "참석 여부를 + [hành động] + 주시면 감사하겠습니다",
      },
    ],
  },
  {
    id: 103,
    question_type: "q51",
    source: "TOPIK 79",
    context: "Thông báo lịch học thay đổi",
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
        hint: "Thông báo lịch mới (ngày giờ mới)",
        example: "화요일 오후 3시로 변경됩니다",
        pattern: "[ngày/giờ mới] + (으)로 변경됩니다",
      },
      {
        key: "ㄴ",
        hint: "Yêu cầu xem lịch đính kèm hoặc hướng dẫn tiếp theo",
        example: "자세한 내용은 첨부 파일을 확인해 주시기 바랍니다.",
        pattern: "자세한 내용은 + [nguồn thông tin] + 확인해 주시기 바랍니다",
      },
    ],
  },
  {
    id: 104,
    question_type: "q51",
    source: "TOPIK 77",
    context: "Thư xin lỗi vì không thể đến dự buổi họp",
    difficulty: "medium",
    text_kr: `팀장님께

안녕하세요. 저는 마케팅팀 이수진입니다. 다음 주 월요일 팀 회의에 참석하지 못하게 되어 이렇게 연락 드립니다.

그날 (   ㄱ   ) 회의에 참석하기 어렵게 되었습니다.

제가 없는 동안 논의된 내용을 나중에 알려 주시면 감사하겠습니다. (   ㄴ   ).

이수진 드림`,
    blanks: [
      {
        key: "ㄱ",
        hint: "Lý do không thể tham dự (lịch hẹn, bệnh, công tác)",
        example: "병원 예약이 있어서",
        pattern: "[lý do] + (아/어)서 / (으)로 인해",
      },
      {
        key: "ㄴ",
        hint: "Xin lỗi và hứa bồi việc sau",
        example: "불편을 드려서 정말 죄송합니다",
        pattern: "불편을 드려서 + 죄송합니다 / 양해 부탁드립니다",
      },
    ],
  },
  {
    id: 105,
    question_type: "q51",
    source: "TOPIK 75",
    context: "Thư gửi bạn hàng xóm bơm học phí",
    difficulty: "medium",
    text_kr: `담당자분께

안녕하세요. 저는 이번 학기 장학금을 신청한 박지훈입니다.

신청 서류를 검토하시다가 혹시 추가 서류가 필요하시면 바로 제출할 수 있습니다. (   ㄱ   ).

장학금 수혜를 받게 된다면 (   ㄴ   ) 열심히 공부하겠습니다.

박지훈 드림`,
    blanks: [
      {
        key: "ㄱ",
        hint: "Nêu tên tài liệu đã nộp và hồ sơ hiện có",
        example: "현재 성적 증명서와 재학 증명서를 제출하였습니다",
        pattern: "[tên tài liệu] + 을/를 제출하였습니다",
      },
      {
        key: "ㄴ",
        hint: "Cảm ơn và hứa nỗ lực",
        example: "장학금에 보답하기 위해",
        pattern: "장학금에 보답하기 위해 / 기대에 부응하여",
      },
    ],
  },
  {
    id: 106,
    question_type: "q51",
    source: "TOPIK 73",
    context: "Thông báo hoạt động tình nguyện viên",
    difficulty: "easy",
    text_kr: `자원봉사자 여러분께

안녕하세요. 지역 복지관입니다.

이번 달 어르신 돌봄 봉사 활동을 안내해 드립니다. 활동 일시는 매주 토요일 오전 10시이며 (   ㄱ   ).

처음 참여하시는 분들은 (   ㄴ   ) 미리 담당자에게 연락 주시기 바랍니다.

감사합니다.`,
    blanks: [
      {
        key: "ㄱ",
        hint: "Thông tin về địa điểm hoạt động",
        example: "장소는 복지관 1층 대강당입니다",
        pattern: "장소는 + [địa điểm] + 입니다",
      },
      {
        key: "ㄴ",
        hint: "Yêu cầu đăng ký trước",
        example: "사전 등록이 필요하오니",
        pattern: "사전 등록이 필요하오니 / [điều kiện] + (으)시면",
      },
    ],
  },
  {
    id: 107,
    question_type: "q51",
    source: "TOPIK 71",
    context: "Thư mời tham gia câu lạc bộ sách",
    difficulty: "easy",
    text_kr: `안녕하세요.

저는 독서 모임 '책 읽는 사람들'의 대표 최유나입니다. 저희 모임에 함께하실 분들을 모집합니다.

저희 모임은 매월 두 번째 일요일에 모여 책을 함께 읽고 이야기를 나눕니다. (   ㄱ   ).

관심 있으신 분들은 (   ㄴ   ) 연락 주시면 감사하겠습니다.

최유나 드림`,
    blanks: [
      {
        key: "ㄱ",
        hint: "Mô tả thêm về câu lạc bộ (thể loại sách, số lượng thành viên)",
        example: "현재 10명의 회원이 활동하고 있으며 주로 소설과 에세이를 읽습니다",
        pattern: "현재 [số lượng] + 명이 활동하고 있으며 + [mô tả hoạt động]",
      },
      {
        key: "ㄴ",
        hint: "Cách thức liên lạc để đăng ký",
        example: "아래 이메일이나 전화로",
        pattern: "[phương thức liên lạc] + (으)로 연락 주시면",
      },
    ],
  },
  {
    id: 108,
    question_type: "q51",
    source: "TOPIK 69",
    context: "Thư xin việc làm thêm sinh viên",
    difficulty: "medium",
    text_kr: `담당자님께

안녕하세요. 저는 한국대학교 경영학과 2학년에 재학 중인 응우옌 반 안입니다. 귀사의 아르바이트 채용 공고를 보고 지원하게 되었습니다.

저는 편의점 아르바이트를 1년간 한 경험이 있으며 (   ㄱ   ).

채용해 주신다면 (   ㄴ   ) 열심히 일하겠습니다.

응우옌 반 안 드림`,
    blanks: [
      {
        key: "ㄱ",
        hint: "Nêu kinh nghiệm và điểm mạnh bản thân",
        example: "고객 서비스와 계산 업무를 능숙하게 처리할 수 있습니다",
        pattern: "[kỹ năng/kinh nghiệm] + 을/를 + 능숙하게 처리할 수 있습니다",
      },
      {
        key: "ㄴ",
        hint: "Cảm ơn và hứa nỗ lực",
        example: "기대에 어긋나지 않도록",
        pattern: "기대에 어긋나지 않도록 / 맡겨 주신 일에 최선을 다해",
      },
    ],
  },
  {
    id: 109,
    question_type: "q51",
    source: "TOPIK 67",
    context: "Thư trả lời cảm ơn của học sinh",
    difficulty: "medium",
    text_kr: `민준이에게

편지 잘 받았어요. 졸업을 진심으로 축하해요.

1년 동안 정말 열심히 공부했고, 그 노력이 빛을 발한 것 같아요. 특히 (   ㄱ   ) 정말 기특했어요.

앞으로의 생활에서도 지금처럼 (   ㄴ   ). 언제든지 도움이 필요하면 연락해요.

선생님으로부터`,
    blanks: [
      {
        key: "ㄱ",
        hint: "Khen ngợi điểm cụ thể của học sinh",
        example: "포기하지 않고 끝까지 노력하는 모습이",
        pattern: "[hành động đáng khen] + 는 모습이 + 기특했어요/대견했어요",
      },
      {
        key: "ㄴ",
        hint: "Lời chúc tương lai",
        example: "최선을 다하길 바랍니다",
        pattern: "[hành động mong muốn] + (으)길 바랍니다",
      },
    ],
  },
  {
    id: 110,
    question_type: "q51",
    source: "TOPIK 65",
    context: "Thông báo kết quả tuyển sinh",
    difficulty: "easy",
    text_kr: `지원자 여러분께

한국어 능력 향상 과정에 지원해 주셔서 감사합니다.

서류 심사 결과, 귀하께서는 최종 합격하셨습니다. (   ㄱ   ).

등록을 원하시는 분께서는 이번 주 금요일까지 (   ㄴ   ) 등록을 완료해 주시기 바랍니다.

한국어 교육원 드림`,
    blanks: [
      {
        key: "ㄱ",
        hint: "Chúc mừng và thông báo lịch học bắt đầu",
        example: "축하드리며 수업은 다음 달 1일부터 시작됩니다",
        pattern: "축하드리며 + 수업은 [thời gian] + 부터 시작됩니다",
      },
      {
        key: "ㄴ",
        hint: "Hướng dẫn cách nộp lệ phí hoặc hồ sơ",
        example: "수강료를 납부하시고",
        pattern: "[hành động] + (으)시고 / 후에",
      },
    ],
  },
  {
    id: 111,
    question_type: "q51",
    source: "TOPIK 76",
    context: "Thư kiến nghị thư viện mở buổi hướng dẫn cho du học sinh",
    difficulty: "easy",
    text_kr: `도서관에 부탁드립니다.

한국에 온 지 1년이 된 유학생입니다. 작년에 제가 처음 한국에 (   ㄱ   ) 도서관 이용 방법을 잘 몰랐습니다. 그래서 첫 학기에는 도서관을 이용하기 어려웠습니다. 다른 학교에는 유학생을 위한 도서관 이용 설명회가 있다고 합니다. 우리 학교에도 설명회가 (   ㄴ   ).`,
    blanks: [
      {
        key: "ㄱ",
        hint: "Khi vừa mới đến (dùng ~았/었을 때)",
        example: "왔을 때",
        pattern: "[động từ] + 았/었을 때",
      },
      {
        key: "ㄴ",
        hint: "Đề xuất/mong muốn có buổi hướng dẫn",
        example: "있으면 좋겠습니다",
        pattern: "[điều mong muốn] + (으)면 좋겠습니다",
      },
    ],
  },
  {
    id: 112,
    question_type: "q51",
    source: "TOPIK 84",
    context: "Yêu cầu đổi phòng khách sạn từ 2 người sang 3 người",
    difficulty: "easy",
    text_kr: `예약 변경 문의
예약자: 로사 / 숙박: 2022.10.18~10.19 / 방 종류: 2인실(1개)

안녕하세요.

2인실을 예약했는데 3명이 가게 되었습니다. 혹시 방을 3인실로 (   ㄱ   )? 안 되면 추가로 방을 하나 더 예약하고 싶습니다. 둘 중 무엇이 가능한지 (   ㄴ   ) 감사하겠습니다.`,
    blanks: [
      {
        key: "ㄱ",
        hint: "Hỏi về khả năng đổi phòng (thể nghi vấn 습니다)",
        example: "변경할 수 있을까요",
        pattern: "[hành động] + (으)ㄹ 수 있을까요 / 가능할까요",
      },
      {
        key: "ㄴ",
        hint: "Nhờ trả lời, cho biết",
        example: "알려 주시면",
        pattern: "알려 주시면 / 연락해 주시면",
      },
    ],
  },
  {
    id: 113,
    question_type: "q51",
    source: "TOPIK 88",
    context: "Thư khen ngợi kỹ thuật viên sửa laptop tận tình",
    difficulty: "easy",
    text_kr: `요즘 제 노트북이 계속 이상했습니다.

화면이 자꾸 어두워지고 가끔은 소리가 전혀 (   ㄱ   ).

그래서 오늘 서비스 센터에 갔는데 김민철 기사님께서 노트북을 금방 고쳐 주시고 친절하게 설명도 해 주셨습니다.

사실 제 노트북은 좀 오래된 것입니다. 노트북을 (   ㄴ   ) 5년 정도 된 것 같습니다. 이렇게 오래된 노트북을 고쳐 주신 김민철 기사님, 감사합니다.`,
    blanks: [
      {
        key: "ㄱ",
        hint: "Âm thanh không ra — dùng thể phủ định quá khứ",
        example: "나지 않았습니다",
        pattern: "[động từ] + 지 않았습니다",
      },
      {
        key: "ㄴ",
        hint: "Tính từ khoảng thời gian kể từ khi mua (V + ㄴ 지)",
        example: "산 지",
        pattern: "[động từ mua] + (으)ㄴ 지",
      },
    ],
  },
  {
    id: 114,
    question_type: "q51",
    source: "TOPIK 92",
    context: "Thư cảm ơn đàn anh/chị đã đến dự đám cưới",
    difficulty: "easy",
    text_kr: `선배님, 안녕하십니까? 마이클입니다. 제 결혼식에 와 주셔서 감사합니다. 사실 선배님께 축하를 받고 싶었지만 결혼식에 오시라는 말씀을 (   ㄱ   ). 그런데 직접 오셔서 결혼을 (   ㄴ   ), 선물까지 주셔서 정말 기뻤습니다.`,
    blanks: [
      {
        key: "ㄱ",
        hint: "Không dám thưa/trình (겸nhường + phủ định)",
        example: "드리지 못했습니다",
        pattern: "[hành động kính ngữ] + 드리지 못했습니다",
      },
      {
        key: "ㄴ",
        hint: "Chúc mừng và tặng quà (hành động liên tiếp)",
        example: "축하해 주시고",
        pattern: "[hành động] + 아/어 주시고",
      },
    ],
  },
  {
    id: 115,
    question_type: "q51",
    source: "TOPIK 93",
    context: "Hỏi về mật khẩu tạm thời cho dịch vụ đặt sách",
    difficulty: "easy",
    text_kr: `안녕하세요?

저는 도서 예약 서비스를 (   ㄱ   ) 비밀번호를 잃어버렸습니다.

그래서 제 이메일로 임시 비밀번호를 신청하였습니다. 그런데 비밀번호가 아직 저한테 (   ㄴ   ).

확인해 주시기 바랍니다.`,
    blanks: [
      {
        key: "ㄱ",
        hint: "Đang sử dụng dịch vụ (thể tiến hành)",
        example: "이용하던 중",
        pattern: "[động từ] + 던 중에",
      },
      {
        key: "ㄴ",
        hint: "Chưa gửi đến / chưa nhận được",
        example: "오지 않았습니다",
        pattern: "[động từ] + 지 않았습니다",
      },
    ],
  },
  {
    id: 116,
    question_type: "q51",
    source: "TOPIK 94",
    context: "Xin giáo sư cho phép đến muộn và đổi thứ tự thuyết trình",
    difficulty: "medium",
    text_kr: `교수님, 안녕하세요. 한국어학과 4학년 미나입니다.

제가 다음 주 '한국문화' 수업에서 첫 번째 발표를 하기로 했습니다. 그런데 그날 병원에 갔다 와야 해서 30분쯤 (   ㄱ   ).

괜찮다고 하시면 좀 늦게 발표하고 싶습니다. 또한, 제가 다른 친구와 발표 순서를 (   ㄴ   )?

정말 죄송합니다.`,
    blanks: [
      {
        key: "ㄱ",
        hint: "Đến muộn ~30 phút (thể chắc chắn nhẹ)",
        example: "늦을 것 같습니다",
        pattern: "[động từ] + (으)ㄹ 것 같습니다",
      },
      {
        key: "ㄴ",
        hint: "Xin phép đổi thứ tự (hỏi lịch sự)",
        example: "바꿔도 될까요",
        pattern: "[động từ] + 아/어도 될까요",
      },
    ],
  },
  {
    id: 117,
    question_type: "q51",
    source: "TOPIK 95",
    context: "Hỏi cách tra cứu bưu kiện gửi sang Nhật chưa đến",
    difficulty: "easy",
    text_kr: `안녕하십니까?

저는 일본으로 물건을 보냈습니다. 우체국 직원이 10일 내에 물건이 (   ㄱ   ).

그런데 물건이 아직 도착하지 않았습니다. 저의 물건이 어디에 있는지 확인하려면 (   ㄴ   )?

확인 방법을 알려 주시면 감사하겠습니다.`,
    blanks: [
      {
        key: "ㄱ",
        hint: "Nhân viên nói sẽ đến trong 10 ngày (lời nói gián tiếp quá khứ)",
        example: "도착할 거라고 했습니다",
        pattern: "[động từ] + (으)ㄹ 거라고 했습니다",
      },
      {
        key: "ㄴ",
        hint: "Hỏi phải làm gì để tra cứu",
        example: "어떻게 해야 합니까",
        pattern: "어떻게 해야 합니까 / 어떻게 하면 됩니까",
      },
    ],
  },
  {
    id: 118,
    question_type: "q51",
    source: "TOPIK 96",
    context: "Hỏi gợi ý nhà thuê sau khi chuyển khỏi ký túc xá",
    difficulty: "easy",
    text_kr: `안녕하세요. 유학생입니다.

기숙사 생활이 불편해서 이번 방학에 이사를 (   ㄱ   ).

집값이 싸고 깨끗한 동네면 좋겠습니다. 그런데 어느 (   ㄴ   ) 모르겠습니다.

좋은 곳을 아시면 추천 부탁드립니다.`,
    blanks: [
      {
        key: "ㄱ",
        hint: "Dự định chuyển nhà trong kỳ nghỉ",
        example: "하려고 합니다",
        pattern: "[동작] + (으)려고 합니다",
      },
      {
        key: "ㄴ",
        hint: "Không biết chọn khu vực nào",
        example: "동네가 좋을지",
        pattern: "[danh từ] + 이/가 좋을지",
      },
    ],
  },
  {
    id: 119,
    question_type: "q51",
    source: "TOPIK 97",
    context: "Bình luận giới thiệu sách về văn hóa Hàn Quốc",
    difficulty: "easy",
    text_kr: `이 책은 한국 문화에 대해 쉽게 설명되어 있습니다. 어휘와 문법이 어렵지 않습니다. 그래서 한국어를 (   ㄱ   ) 얼마 안 된 외국인들도 읽을 수 있습니다.

저는 한국어를 잘 못하지만 재미있게 읽었습니다. 이 책을 꼭 한번 (   ㄴ   ).`,
    blanks: [
      {
        key: "ㄱ",
        hint: "Người mới bắt đầu học tiếng Hàn",
        example: "배우기 시작한 지",
        pattern: "[động từ] + 기 시작한 지",
      },
      {
        key: "ㄴ",
        hint: "Khuyến khích đọc thử",
        example: "읽어 보시기 바랍니다",
        pattern: "[동사] + 아/어 보시기 바랍니다",
      },
    ],
  },
  {
    id: 120,
    question_type: "q51",
    source: "TOPIK 98",
    context: "Email nhờ khảo sát menu ăn trưa cho buổi họp mặt du học sinh",
    difficulty: "easy",
    text_kr: `안녕하십니까? 마리아입니다. 이번 유학생 모임에서 먹을 점심 메뉴를 (   ㄱ   ). 갑자기 조사를 부탁드려 죄송합니다. 저번에 조사할 때 빠뜨렸습니다. 아래 사이트에서 원하는 메뉴를 고르신 후, 이 이메일로 (   ㄴ   ) 감사하겠습니다.`,
    blanks: [
      {
        key: "ㄱ",
        hint: "Đang cần khảo sát (muốn nhờ ai đó làm)",
        example: "조사하고 싶습니다",
        pattern: "[hành động] + 고 싶습니다 / (으)려고 합니다",
      },
      {
        key: "ㄴ",
        hint: "Nhờ trả lời/gửi email lại",
        example: "답장해 주시면",
        pattern: "답장해 주시면 / 회신해 주시면",
      },
    ],
  },
  {
    id: 121,
    question_type: "q51",
    source: "TOPIK 100",
    context: "Nhờ trung tâm hỗ trợ việc làm tư vấn trước buổi phỏng vấn",
    difficulty: "medium",
    text_kr: `안녕하세요?

취업을 준비 중인 취준생입니다. 이번에 회사에서 면접 시험에 오라는 연락이 왔습니다.

하지만 저는 채용 면접을 (   ㄱ   ) 없습니다. 2주 후에 면접이 있는데 이번 주 안에 꼭 센터 선생님한테서 도움을 (   ㄴ   ).`,
    blanks: [
      {
        key: "ㄱ",
        hint: "Chưa từng đi phỏng vấn bao giờ (~아/어 본 적이)",
        example: "본 적이",
        pattern: "[동사] + 아/어 본 적이",
      },
      {
        key: "ㄴ",
        hint: "Muốn/cần nhận được sự giúp đỡ",
        example: "받고 싶습니다",
        pattern: "받고 싶습니다 / 받고자 합니다",
      },
    ],
  },
  {
    id: 122,
    question_type: "q51",
    source: "TOPIK 101",
    context: "Thông báo trận bóng đá và kêu gọi cổ động viên",
    difficulty: "easy",
    text_kr: `이번 주 토요일에 축구 경기가 있습니다. 응원해야 하니까 많은 학생이 (   ㄱ   ). 참여할 학생은 학교 경기장에 오시기 바랍니다. 경기장에서 우리 팀을 (   ㄴ   ) 학교 티셔츠를 입으려고 합니다.`,
    blanks: [
      {
        key: "ㄱ",
        hint: "Mong nhiều sinh viên tham gia (lời kêu gọi)",
        example: "참여했으면 합니다",
        pattern: "[động từ] + 았/었으면 합니다",
      },
      {
        key: "ㄴ",
        hint: "Cùng nhau cổ vũ đội, mặc áo thống nhất",
        example: "응원할 때",
        pattern: "[동사] + (으)ㄹ 때",
      },
    ],
  },
  {
    id: 123,
    question_type: "q51",
    source: "TOPIK 102",
    context: "Yêu cầu thành viên CLB lấy đồ dùng cá nhân trước khi chuyển phòng",
    difficulty: "easy",
    text_kr: `안녕하세요.
동아리 회장 김민아입니다.
학생회관 공사 때문에 동아리 방을 옮기게 되었습니다.
그런데 현재 개인 물건들이 너무 많습니다.
동아리 방을 옮기려면 이 물건들부터 먼저 (   ㄱ   ).
방학을 하자마자 공사가 시작됩니다.
방학이 (   ㄴ   ) 개인 물건을 모두 가져가 주십시오.`,
    blanks: [
      {
        key: "ㄱ",
        hint: "Cần phải giải quyết/dọn dẹp đồ trước",
        example: "정리해야 합니다",
        pattern: "[동작] + 아/어야 합니다",
      },
      {
        key: "ㄴ",
        hint: "Trước khi kỳ nghỉ bắt đầu",
        example: "시작되기 전에",
        pattern: "[sự kiện] + 기 전에",
      },
    ],
  },
  {
    id: 124,
    question_type: "q51",
    source: "TOPIK 103",
    context: "Hỏi đặt hàng bánh hamburger số lượng lớn",
    difficulty: "easy",
    text_kr: `햄버거 단체 주문 문의

안녕하세요.

햄버거를 단체로 (   ㄱ   ).

다음 주 화요일 5시까지 학생회관으로 햄버거 50개를 (   ㄴ   )?

가능한지 연락해 주시면 바로 주문하겠습니다.`,
    blanks: [
      {
        key: "ㄱ",
        hint: "Muốn đặt hàng số lượng lớn",
        example: "주문하고 싶습니다",
        pattern: "[동작] + 고 싶습니다",
      },
      {
        key: "ㄴ",
        hint: "Hỏi có thể giao đến địa điểm cụ thể không",
        example: "배달해 주실 수 있습니까",
        pattern: "[동작] + 아/어 주실 수 있습니까",
      },
    ],
  },
  {
    id: 125,
    question_type: "q51",
    source: "TOPIK 104",
    context: "Xin đổi phòng ký túc xá vì chân bị thương sau phẫu thuật",
    difficulty: "medium",
    text_kr: `안녕하세요?
기숙사 403호에 사는 안나입니다.
저는 다리를 다쳐서 수술을 받았습니다.
수술을 (   ㄱ   ) 얼마 안 되어서 걸을 때 힘듭니다.
그래서 1층으로 방을 (   ㄴ   ).
답변 부탁드립니다.`,
    blanks: [
      {
        key: "ㄱ",
        hint: "Sau khi phẫu thuật chưa được bao lâu (~은 지)",
        example: "받은 지",
        pattern: "[동사 quá khứ] + (으)ㄴ 지",
      },
      {
        key: "ㄴ",
        hint: "Muốn/xin đổi phòng",
        example: "바꾸고 싶습니다",
        pattern: "바꾸고 싶습니다 / 변경하고 싶습니다",
      },
    ],
  },
  {
    id: 126,
    question_type: "q51",
    source: "TOPIK 105",
    context: "Email xin tư vấn với giáo sư về môn học khó",
    difficulty: "easy",
    text_kr: `교수님, 안녕하십니까? 경영학과 1학년 쿠이입니다.

이번 학기에 들은 '경영학의 이해' 수업이 너무 어려웠습니다.

앞으로 공부를 어떻게 (   ㄱ   ) 잘 모르겠습니다.

교수님께 상담을 받으면 저에게 큰 도움이 (   ㄴ   ).

가능하시다면 상담 시간을 알려 주시면 감사하겠습니다.`,
    blanks: [
      {
        key: "ㄱ",
        hint: "Không biết phải học như thế nào tiếp theo",
        example: "해야 할지",
        pattern: "[동사] + 아/어야 할지",
      },
      {
        key: "ㄴ",
        hint: "Sẽ là một sự giúp đỡ lớn",
        example: "될 것 같습니다",
        pattern: "(으)ㄹ 것 같습니다",
      },
    ],
  },
  {
    id: 127,
    question_type: "q51",
    source: "TOPIK 106",
    context: "Thông báo cho tặng miễn phí dụng cụ thể dục (cần 2 người mang)",
    difficulty: "easy",
    text_kr: `무료 나눔
작성자: 타이

안녕하세요. 경영학과 4학년 타이입니다. 운동 기구를 무료로 드리려고 합니다. 운동 기구는 (   ㄱ   ) 한 달밖에 안 됐습니다. 기구가 무거워서 옮기려면 두 사람이 같이 (   ㄴ   ). 필요하신 분은 댓글을 남겨 주십시오.`,
    blanks: [
      {
        key: "ㄱ",
        hint: "Mua được/sắm được từ một tháng trước (~은 지)",
        example: "산 지",
        pattern: "[동사 mua] + (으)ㄴ 지",
      },
      {
        key: "ㄴ",
        hint: "Cần hai người cùng vác",
        example: "와야 합니다",
        pattern: "[동사] + 아/어야 합니다",
      },
    ],
  },
]

// ============================================================
// Q52 - Nghị luận ngắn (argumentative - fill 2 blanks)
// ============================================================
export const Q52_PROMPTS: WritingPrompt[] = [
  {
    id: 201,
    question_type: "q52",
    source: "TOPIK 83",
    context: "Tranh luận về việc sử dụng điện thoại của trẻ em",
    difficulty: "medium",
    text_kr: `요즘 어린이들이 스마트폰을 많이 사용한다. 이에 대해 찬성하는 입장과 반대하는 입장이 있다.

찬성하는 측에서는 스마트폰이 교육에 도움이 된다고 주장한다. 다양한 학습 앱을 통해 (   ㄱ   ).

반면, 반대하는 측에서는 건강 문제를 우려한다. 장시간 스마트폰을 사용하면 (   ㄴ   ).

따라서 어린이의 스마트폰 사용에 대해서는 균형 잡힌 시각이 필요하다.`,
    blanks: [
      {
        key: "ㄱ",
        hint: "Nên tạo hoạt động học tập từ điện thoại (lợi ích)",
        example: "재미있게 공부할 수 있기 때문이다",
        pattern: "[loi ich cu the] + (으)ㄹ 수 있기 때문이다",
      },
      {
        key: "ㄴ",
        hint: "Tác hại cụ thể đến sức khỏe (mắt, cổ, ngủ)",
        example: "시력 저하나 수면 장애가 생길 수 있다",
        pattern: "[van de suc khoe] + 이/가 생길 수 있다 / 나타날 수 있다",
      },
    ],
  },
  {
    id: 202,
    question_type: "q52",
    source: "TOPIK 81",
    context: "Tranh luận về làm việc từ xa",
    difficulty: "medium",
    text_kr: `재택근무에 대한 의견이 나뉘고 있다.

긍정적인 측면에서는 출퇴근 시간이 줄어들어 (   ㄱ   ). 또한 개인 생활과 업무를 균형 있게 유지할 수 있다.

그러나 부정적인 측면도 있다. 집에서 일하면 (   ㄴ   ) 업무 효율이 떨어질 수 있다.

재택근무의 장단점을 잘 파악하여 회사와 직원 모두에게 맞는 방식을 찾아야 한다.`,
    blanks: [
      {
        key: "ㄱ",
        hint: "Lợi ích của việc tiết kiệm thời gian di chuyển",
        example: "그 시간을 자기 계발에 활용할 수 있다",
        pattern: "[thoi gian tiet kiem] + 을/를 + [hoat dong] + 에 활용할 수 있다",
      },
      {
        key: "ㄴ",
        hint: "Vấn đề khi làm việc tại nhà (phân tâm, giao tiếp)",
        example: "동료와의 소통이 어려워지고 집중력이 떨어져",
        pattern: "[van de] + 이/가 어려워지고 / (아/어)져",
      },
    ],
  },
  {
    id: 203,
    question_type: "q52",
    source: "TOPIK 79",
    context: "Tranh luận về du lịch một mình",
    difficulty: "easy",
    text_kr: `혼자 여행하는 것에 대해 찬반 의견이 있다.

좋아하는 사람들은 자유롭게 일정을 정할 수 있어서 (   ㄱ   )고 말한다. 또한 새로운 사람을 만나고 자신을 돌아보는 기회가 된다.

반면, 불편하다는 의견도 있다. 혼자 여행하면 (   ㄴ   ) 위험할 수 있다.

각자의 여행 스타일에 맞는 방법을 선택하는 것이 중요하다.`,
    blanks: [
      {
        key: "ㄱ",
        hint: "Lợi ích của việc đi du lịch một mình (tự do, kế hoạch riêng)",
        example: "자신만의 속도로 여행을 즐길 수 있다",
        pattern: "[hành động] + (으)ㄹ 수 있다",
      },
      {
        key: "ㄴ",
        hint: "Nhược điểm khi đi một mình (cô đơn, nguy hiểm)",
        example: "도움을 받기 어렵고 안전 문제에 노출되기 쉬워",
        pattern: "[van de] + (으)기 어렵고 / 쉬워",
      },
    ],
  },
  {
    id: 204,
    question_type: "q52",
    source: "TOPIK 77",
    context: "Tranh luận về giáo dục sớm cho trẻ",
    difficulty: "hard",
    text_kr: `어린 나이부터 조기 교육을 시키는 것에 대한 의견이 다양하다.

찬성론자들은 어린 시절이 학습 능력이 가장 뛰어난 시기라고 주장한다. 이 시기에 다양한 것을 배우면 (   ㄱ   ).

반면 반대론자들은 아이의 정서 발달을 중요시한다. 지나친 조기 교육은 (   ㄴ   ) 오히려 부작용이 생길 수 있다.

적절한 균형을 찾는 것이 무엇보다 중요하다.`,
    blanks: [
      {
        key: "ㄱ",
        hint: "Lợi ích học sớm (tạo nền tảng, phát triển năng khiếu)",
        example: "나중에 더 빠르게 발전할 수 있는 기반을 마련할 수 있다",
        pattern: "[kha nang] + (으)ㄹ 수 있는 기반을 마련할 수 있다",
      },
      {
        key: "ㄴ",
        hint: "Tác hại của việc ép buộc học quá sớm",
        example: "아이에게 스트레스를 주어",
        pattern: "[chu the] + 에게 + [tac hai] + 을/를 주어 / (아/어)서",
      },
    ],
  },
  {
    id: 205,
    question_type: "q52",
    source: "TOPIK 75",
    context: "Tranh luận về mạng xã hội",
    difficulty: "medium",
    text_kr: `소셜 미디어 사용에 대한 찬반 의견이 있다.

긍정적인 입장에서는 소셜 미디어가 사람들의 연결을 강화한다고 본다. 멀리 떨어진 사람들과도 (   ㄱ   ).

부정적인 입장에서는 개인 정보 노출 문제를 지적한다. 무분별한 개인 정보 공유는 (   ㄴ   ).

소셜 미디어를 현명하게 사용하는 자세가 필요하다.`,
    blanks: [
      {
        key: "ㄱ",
        hint: "Lợi ích kết nối (giữ liên lạc, chia sẻ)",
        example: "쉽게 소통하고 관계를 유지할 수 있기 때문이다",
        pattern: "[hành động] + (으)ㄹ 수 있기 때문이다",
      },
      {
        key: "ㄴ",
        hint: "Hậu quả lộ lọt thông tin cá nhân",
        example: "사생활 침해나 범죄로 이어질 수 있다",
        pattern: "[hau qua] + (으)로 이어질 수 있다",
      },
    ],
  },
  {
    id: 206,
    question_type: "q52",
    source: "TOPIK 76",
    context: "Mỏi mắt khi nhìn chằm chằm lâu — cơ chế nháy mắt và khắc phục",
    difficulty: "medium",
    text_kr: `무언가를 집중해서 오래 보다 보면 점점 눈이 불편함을 (   ㄱ   ). 불편함이 느껴지는 것은 평소보다 눈을 감는 횟수가 줄어 눈이 건조해지기 때문이다. 눈이 건조함을 해소하기 위해서 눈 운동을 하는 것이 좋다. 먼저 눈을 감고 셋을 센 후 눈을 크게 뜬다. 이를 반복하면 눈물이 나와서 눈이 건조함을 (   ㄴ   ) 도움이 된다.`,
    blanks: [
      {
        key: "ㄱ",
        hint: "Bắt đầu cảm thấy khó chịu (dùng ~게 된다)",
        example: "느끼게 된다",
        pattern: "[동사] + 게 된다",
      },
      {
        key: "ㄴ",
        hint: "Giải quyết/làm giảm sự khô mắt",
        example: "해소하는 데",
        pattern: "[동작] + 는 데",
      },
    ],
  },
  {
    id: 207,
    question_type: "q52",
    source: "TOPIK 83",
    context: "Cây leo dừa cộng sinh với kiến để tự bảo vệ",
    difficulty: "hard",
    text_kr: `식물은 다양한 방법으로 자신을 보호한다. 덩굴성 야자나무는 빈 줄기를 개미에게 집으로 제공한다. 이 나무에 다른 동물이 다가오면 줄기 속에 있던 개미들은 밖으로 나온다. 이때 개미들의 움직임으로 소리가 생긴다. 이 소리는 동물을 깜짝 (   ㄱ   ). 결국 놀란 동물은 나뭇잎을 먹지 못하고 달아나 버린다. 식물학자들은 이것이 바로 이 나무가 자신을 보호하는 (   ㄴ   ).`,
    blanks: [
      {
        key: "ㄱ",
        hint: "Khiến con vật giật mình sợ hãi (사동 ~게 하다)",
        example: "놀라게 한다",
        pattern: "[형용사/동사] + 게 한다",
      },
      {
        key: "ㄴ",
        hint: "Đây là phương pháp bảo vệ (danh từ hóa + 이라고 한다)",
        example: "방법이라고 한다",
        pattern: "[명사] + 이라고 한다",
      },
    ],
  },
  {
    id: 208,
    question_type: "q52",
    source: "TOPIK 84",
    context: "Cà phê buổi sáng không giúp tỉnh táo — lý do hormone",
    difficulty: "medium",
    text_kr: `사람들은 보통 커피가 잠을 깨는 데에 도움이 된다고 생각한다. 실제로 오후에 마시는 커피는 잠을 깨는 데 (   ㄱ   ) 아침에 마시는 커피는 오히려 잠을 깨는 데 도움이 되지 않는다. 왜냐하면 우리 몸에서는 아침이 되면 잠을 깨는 호르몬이 나오는데, 커피는 이 호르몬이 나오는 것을 (   ㄴ   ). 따라서 잠을 깨는 호르몬을 방해하지 않으려면 아침에 커피를 마시지 않는 것이 좋다.`,
    blanks: [
      {
        key: "ㄱ",
        hint: "Có hiệu quả nhưng (buổi sáng thì không) — tương phản",
        example: "효과가 있지만",
        pattern: "[kết quả] + 지만",
      },
      {
        key: "ㄴ",
        hint: "Cản trở hormone tiết ra",
        example: "방해하기 때문이다",
        pattern: "[동작] + 기 때문이다",
      },
    ],
  },
  {
    id: 209,
    question_type: "q52",
    source: "TOPIK 88",
    context: "Lạc đà chịu được khô hạn — mất nước và điều tiết thân nhiệt",
    difficulty: "hard",
    text_kr: `낙타는 건조하고 더운 기후에서도 살 수 있는 특성을 가졌다. 사람은 체중의 12% 정도에 해당하는 수분을 잃으면 생명이 위험하지만, 낙타는 30%에 해당하는 (   ㄱ   ) 생명에 지장이 없다. 그리고 인간은 더울 때 체온 유지를 위해 땀을 많이 흘리지만 낙타는 적게 흘린다. 왜냐하면 낙타는 기온의 변화에 따라 체온이 (   ㄴ   ).`,
    blanks: [
      {
        key: "ㄱ",
        hint: "Mất đến 30% lượng nước mà (vẫn sống) — ~아/어도",
        example: "물을 잃어도",
        pattern: "[동사] + 아/어도",
      },
      {
        key: "ㄴ",
        hint: "Thân nhiệt thay đổi theo nhiệt độ bên ngoài",
        example: "변하기 때문이다",
        pattern: "[động từ] + 기 때문이다",
      },
    ],
  },
  {
    id: 210,
    question_type: "q52",
    source: "TOPIK 92",
    context: "Phân loại giấy tái chế — các loại giấy cần xử lý khác nhau",
    difficulty: "medium",
    text_kr: `종이를 재활용 쓰레기로 버릴 때 종류에 상관없이 다 같이 모아서 버리는 사람들이 있다. 그러나 이것은 올바른 재활용 방법이 아니다. 왜냐하면 종이는 종류에 따라 재활용 과정과 방법이 (   ㄱ   ). 예를 들어, 영수증 종이는 일반 종이와 재활용 방법이 다르기 때문에 따로 분리해야 한다. 따라서 종이를 버릴 때 비슷한 종이끼리 모아서 (   ㄴ   ).`,
    blanks: [
      {
        key: "ㄱ",
        hint: "Các loại giấy có quy trình tái chế khác nhau",
        example: "다르기 때문이다",
        pattern: "[형용사] + 기 때문이다",
      },
      {
        key: "ㄴ",
        hint: "Nên bỏ từng loại riêng biệt",
        example: "버리는 것이 좋다",
        pattern: "[동사] + 는 것이 좋다",
      },
    ],
  },
  {
    id: 211,
    question_type: "q52",
    source: "TOPIK 93",
    context: "Cửa quay ngăn thất thoát năng lượng — cơ chế hoạt động",
    difficulty: "medium",
    text_kr: `온도 차이가 심한 계절에서는 문을 열어 놓으면 바깥 공기가 안으로 들어와 에너지가 낭비될 수 있다. 이런 에너지의 낭비를 (   ㄱ   ) 회전문을 설치하는 경우가 많다. 회전문을 설치하면 바깥 공기가 안으로 (   ㄴ   ) 빠르게 막아 주고 들어온 공기를 밖으로 내보낸다.`,
    blanks: [
      {
        key: "ㄱ",
        hint: "Để ngăn chặn lãng phí năng lượng (~기 위해)",
        example: "막기 위해",
        pattern: "[동사] + 기 위해",
      },
      {
        key: "ㄴ",
        hint: "Ngăn không cho khí bên ngoài vào (~는 것을)",
        example: "들어오는 것을",
        pattern: "[동사] + 는 것을",
      },
    ],
  },
  {
    id: 212,
    question_type: "q52",
    source: "TOPIK 94",
    context: "Tưới quá nhiều nước cho cây trồng khiến rễ thối",
    difficulty: "medium",
    text_kr: `화분에 식물을 기를 때 물을 너무 많이 주면 식물은 잘 자라지 못한다. 왜냐하면 흙에 물이 너무 많으면 식물의 뿌리가 (   ㄱ   ). 뿌리가 썩지 않게 하려면 물을 주기 전에 흙의 상태가 어떤지를 살펴봐야 한다. 흙이 젖어 있는 경우에는 물을 더 이상 (   ㄴ   ) 흙이 마를 때까지 기다렸다가 줘야 한다.`,
    blanks: [
      {
        key: "ㄱ",
        hint: "Rễ sẽ thối (~기 때문이다)",
        example: "썩기 때문이다",
        pattern: "[동사] + 기 때문이다",
      },
      {
        key: "ㄴ",
        hint: "Không nên tưới nữa mà nên...",
        example: "주지 말고",
        pattern: "[동사] + 지 말고",
      },
    ],
  },
  {
    id: 213,
    question_type: "q52",
    source: "TOPIK 95",
    context: "Tại sao buồn ngủ trên xe — dao động đều đặn ức chế não xử lý",
    difficulty: "medium",
    text_kr: `차를 오래 타면 왜 잠이 올까요? 차가 일정한 속도로 가면 작고 규칙적인 진동이 생기는데 이 진동이 잠이 (   ㄱ   ). 우리 뇌는 새로운 정보가 생길 때 이를 처리하려고 노력한다. 그런데 작고 규칙적인 진동을 새로운 정보로 생각하지 않아 더 이상 정보를 (   ㄴ   ) 된다고 느낀다. 그래서 잠이 오는 것이다.`,
    blanks: [
      {
        key: "ㄱ",
        hint: "Gây ra buồn ngủ (사동 ~게 하다 / 원인)",
        example: "오게 한다",
        pattern: "[동사] + 게 한다",
      },
      {
        key: "ㄴ",
        hint: "Không cần xử lý thêm nữa",
        example: "처리할 필요가 없게",
        pattern: "[동사] + (으)ㄹ 필요가 없게",
      },
    ],
  },
  {
    id: 214,
    question_type: "q52",
    source: "TOPIK 96",
    context: "Ếch không chỉ ngủ đông mà còn ngủ hè — không tự điều tiết thân nhiệt",
    difficulty: "medium",
    text_kr: `개구리는 겨울에 추위를 피하기 위해 겨울 내에 긴 잠을 잔다고 알려져 있다. 그런데 개구리는 무조건 겨울에만 잠을 (   ㄱ   ). 날씨가 더운 지역에 사는 개구리는 기온이 매우 높은 기간에 긴 잠을 자기도 한다. 왜냐하면 개구리는 사람과 달리 체내에서 체온 조절을 (   ㄴ   ). 개구리처럼 체온 조절을 못하는 동물들에게 추위뿐만 아니라 더위도 생존에 위협이 되는 것이다.`,
    blanks: [
      {
        key: "ㄱ",
        hint: "Không phải chỉ ngủ vào mùa đông (~는 것은 아니다)",
        example: "자는 것은 아니다",
        pattern: "[동사] + 는 것은 아니다",
      },
      {
        key: "ㄴ",
        hint: "Không thể tự điều tiết thân nhiệt",
        example: "할 수 없기 때문이다",
        pattern: "[동사] + (으)ㄹ 수 없기 때문이다",
      },
    ],
  },
  {
    id: 215,
    question_type: "q52",
    source: "TOPIK 97",
    context: "Vết capsaicin trên quần áo — không tan trong nước, phơi nắng",
    difficulty: "hard",
    text_kr: `옷에 고추 가루가 묻을 때 세탁해도 얼룩이 남는다. 고추 가루에 포함된 캡사이신 성분 때문이다. 이 성분은 기름에 녹지만 물에는 (   ㄱ   ). 물로만 세탁하면 지우기 어렵다. 따라서 얼룩을 잘 (   ㄴ   ) 세탁한 후에 햇빛이 있는 곳에 걸어 두면 이 성분이 사라지게 된다.`,
    blanks: [
      {
        key: "ㄱ",
        hint: "Không tan trong nước (tương phản ~지만)",
        example: "녹지 않는다",
        pattern: "[동사] + 지 않는다",
      },
      {
        key: "ㄴ",
        hint: "Để xóa vết bẩn hiệu quả (mục đích ~기 위해서는)",
        example: "지우기 위해서는",
        pattern: "[동사] + 기 위해서는",
      },
    ],
  },
  {
    id: 216,
    question_type: "q52",
    source: "TOPIK 98",
    context: "Mây trắng — hiện tượng tán xạ Mie trộn lẫn mọi màu ánh sáng",
    difficulty: "hard",
    text_kr: `구름이 하얗게 보이는 이유는 미 산란(Mie scattering)이라는 현상 때문이다. 미 산란은 빛이 퍼지고 퍼진 모든 빛이 섞이면서 흰색으로 보이는 현상을 말한다. 구름은 여러 크기의 물방울로 구성되어 있는데 이 물방울이 빛을 (   ㄱ   ). 또한 이 물방울들이 다른 색깔의 모든 빛을 섞이게 한다. 따라서 구름이 하얗게 보이는 이유는 구름 속의 물방울에서 퍼진 빛들이 모두 (   ㄴ   ).`,
    blanks: [
      {
        key: "ㄱ",
        hint: "Khuếch tán ánh sáng (~게 한다)",
        example: "퍼지게 한다",
        pattern: "[동사] + 게 한다",
      },
      {
        key: "ㄴ",
        hint: "Tất cả trộn lẫn tạo thành màu trắng",
        example: "섞이기 때문이다",
        pattern: "[동사] + 기 때문이다",
      },
    ],
  },
  {
    id: 217,
    question_type: "q52",
    source: "TOPIK 100",
    context: "Hoa anh đào nở trước khi có lá — chiến lược thu hút ong",
    difficulty: "medium",
    text_kr: `벚꽃은 봄에 피는 꽃 중에서 가장 일찍 피는 꽃으로 유명하다. 보통 식물들은 잎이 난 후에 꽃이 피는데 벚꽃은 잎이 (   ㄱ   ) 꽃이 핀다. 화려하고 큰 꽃이 많은 5월에는 벚꽃이 상대적으로 벌을 (   ㄴ   ). 이와 같이 벚꽃이 이른 봄에 빨리 꽃이 피는 것은 벌을 더 많이 유혹하려는 벚꽃의 생존 전략이라 할 수 있다.`,
    blanks: [
      {
        key: "ㄱ",
        hint: "Trước khi lá mọc ra (~기 전에)",
        example: "나기 전에",
        pattern: "[동사] + 기 전에",
      },
      {
        key: "ㄴ",
        hint: "Khó thu hút ong hơn (so sánh ~기 어렵다)",
        example: "유혹하기 어렵다",
        pattern: "[동사] + 기 어렵다",
      },
    ],
  },
  {
    id: 218,
    question_type: "q52",
    source: "TOPIK 101",
    context: "Đau đầu mãn tính — không chỉ uống thuốc mà cần tìm nguyên nhân",
    difficulty: "medium",
    text_kr: `두통이 낫지 않고 계속되면 진통제를 먹게 된다. 그러나 만성 두통을 치료하려면 약을 계속 (   ㄱ   ) 어디가 어떻게 아픈지 살펴봐야 한다. 왜냐하면 아픈 위치나 특징에 따라 원인이 (   ㄴ   ).`,
    blanks: [
      {
        key: "ㄱ",
        hint: "Không phải chỉ uống thuốc mà còn (tương phản ~는 것이 아니라)",
        example: "먹는 것이 아니라",
        pattern: "[동사] + 는 것이 아니라",
      },
      {
        key: "ㄴ",
        hint: "Nguyên nhân khác nhau tùy vị trí",
        example: "다르기 때문이다",
        pattern: "[형용사] + 기 때문이다",
      },
    ],
  },
  {
    id: 219,
    question_type: "q52",
    source: "TOPIK 102",
    context: "Máy bay lớn bay cao để tránh thời tiết — máy bay nhỏ không bay được cao",
    difficulty: "hard",
    text_kr: `큰 항공기는 주로 높은 하늘에서 비행을 한다. 높이 올라가면 날씨의 영향을 별로 (   ㄱ   ) 흔들림이 적다. 반면 작은 항공기는 날씨의 영향을 받더라도 낮은 고도에서 비행을 해야 한다. 왜냐하면 높은 고도에서 (   ㄴ   ) 항공기의 엔진이 크고 중량이 많으며 연료도 많이 필요하기 때문이다.`,
    blanks: [
      {
        key: "ㄱ",
        hint: "Không bị ảnh hưởng nhiều bởi thời tiết",
        example: "받지 않아",
        pattern: "[동사] + 지 않아",
      },
      {
        key: "ㄴ",
        hint: "Để bay ở độ cao lớn cần điều kiện (~려면)",
        example: "비행하려면",
        pattern: "[동사] + (으)려면",
      },
    ],
  },
  {
    id: 220,
    question_type: "q52",
    source: "TOPIK 103",
    context: "Muối làm dưa hấu ngọt hơn — não xử lý vị mặn ưu tiên hơn vị ngọt",
    difficulty: "medium",
    text_kr: `수박을 먹을 때 소금을 뿌리면 단맛이 더 강하게 느껴진다. 이는 우리 뇌가 짠맛보다 단맛을 강하게 (   ㄱ   ) 때문이다. 우리 뇌에는 짠맛이 빨리 전달되어 단맛을 더 강하게 강화한다. 단맛이 약한 토마토를 먹을 때 소금을 적당히 뿌려야 효과가 있으므로 소금을 너무 많이 (   ㄴ   ) 주의해야 한다.`,
    blanks: [
      {
        key: "ㄱ",
        hint: "Nhận biết / cảm nhận mạnh hơn",
        example: "인식하기",
        pattern: "[동사] + 기",
      },
      {
        key: "ㄴ",
        hint: "Cần chú ý không nên rắc quá nhiều muối",
        example: "뿌리지 않도록",
        pattern: "[동사] + 지 않도록",
      },
    ],
  },
  {
    id: 221,
    question_type: "q52",
    source: "TOPIK 104",
    context: "Tắm nước ấm sau tập thể dục tốt hơn nước lạnh — giảm mệt mỏi",
    difficulty: "medium",
    text_kr: `운동을 한 후에 차가운 물로 샤워하는 사람들이 많다. 하지만 차가운 물보다 미지근한 물로 (   ㄱ   ). 차가운 물로 샤워하면 혈압이 갑자기 높아져서 심장에 부담을 주기 때문이다. 또한 미지근한 물로 샤워하면 피로를 (   ㄴ   ) 도움이 된다. 미지근한 물이 운동할 때 긴장했던 근육을 편안하게 해 줘서 피로가 빨리 풀리는 것이다.`,
    blanks: [
      {
        key: "ㄱ",
        hint: "Nên tắm bằng nước ấm hơn (~는 것이 좋다)",
        example: "샤워하는 것이 좋다",
        pattern: "[동사] + 는 것이 좋다",
      },
      {
        key: "ㄴ",
        hint: "Giúp phục hồi mệt mỏi nhanh hơn",
        example: "푸는 데",
        pattern: "[동사] + 는 데",
      },
    ],
  },
  {
    id: 222,
    question_type: "q52",
    source: "TOPIK 105",
    context: "Ghế tốt nhất trên xe buýt — ít rung nhất ở giữa xe",
    difficulty: "medium",
    text_kr: `달리는 버스에 앉을 때 승차감이 좋은 자리는 어디일까? 버스가 회전하면 승객의 몸은 회전하는 방향의 반대쪽으로 기울어진다. 이때 몸이 많이 기울어지는 곳은 버스의 앞자리이다. 이는 버스는 뒤바퀴를 중심으로 (   ㄱ   ). 또한 울퉁불퉁한 도로에서는 바퀴의 위쪽에 앉으면 지면의 진동을 크게 느낄 수 있다. 따라서 버스에서 흔들림을 적게 (   ㄴ   ) 앞바퀴와 뒤바퀴의 중간에 앉으면 된다.`,
    blanks: [
      {
        key: "ㄱ",
        hint: "Xoay/quay quanh bánh sau (lý do ~기 때문이다)",
        example: "회전하기 때문이다",
        pattern: "[동사] + 기 때문이다",
      },
      {
        key: "ㄴ",
        hint: "Muốn bị rung ít hơn (mục đích ~려면)",
        example: "느끼려면",
        pattern: "[동사] + (으)려면",
      },
    ],
  },
  {
    id: 223,
    question_type: "q52",
    source: "TOPIK 106",
    context: "Dùng điện thoại trước khi ngủ cản hormone melatonin — ánh sáng xanh",
    difficulty: "medium",
    text_kr: `자기 전에 스마트폰을 보는 것은 잠이 (   ㄱ   ) 부정적인 영향을 미친다. 해가 지면 빛이 약해져 수면 호르몬이 자연스럽게 나와 잠이 들게 한다. 그러나 스마트폰을 보면 푸른 빛이 수면 호르몬이 나오는 것을 방해한다. 그래서 잠들기 최소 한 시간 전부터는 스마트폰을 (   ㄴ   ) 음악을 듣거나 책을 읽는 것이 좋다.`,
    blanks: [
      {
        key: "ㄱ",
        hint: "Ảnh hưởng xấu đến giấc ngủ (danh từ hóa ~는 데에)",
        example: "드는 데에",
        pattern: "[동사] + 는 데에",
      },
      {
        key: "ㄴ",
        hint: "Nên đặt điện thoại xuống / không dùng nữa",
        example: "보지 말고",
        pattern: "[동사] + 지 말고",
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
    context: "Khảo sát lý do học tiếng Hàn của người nước ngoài",
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
    topic: "Viết bài phân tích biểu đồ khảo sát lý do học tiếng Hàn",
  },
  {
    id: 302,
    question_type: "q53",
    source: "TOPIK 81",
    context: "Khảo sát thời gian sử dụng điện thoại theo độ tuổi",
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
    topic: "Viết bài phân tích biểu đồ sử dụng điện thoại theo độ tuổi",
  },
  {
    id: 303,
    question_type: "q53",
    source: "TOPIK 79",
    context: "Khảo sát phương tiện di chuyển ưa thích",
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
    topic: "Viết bài phân tích biểu đồ phương tiện di chuyển",
  },
  {
    id: 304,
    question_type: "q53",
    source: "TOPIK 77",
    context: "Xu hướng tỷ lệ không kết hôn ở Việt Nam",
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
    topic: "Viết bài phân tích xu hướng tỷ lệ không kết hôn",
  },
  {
    id: 305,
    question_type: "q53",
    source: "TOPIK 75",
    context: "Khảo sát hoạt động giải trí ưa thích theo giới tính",
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
    topic: "Viết bài phân tích biểu đồ hoạt động giải trí theo giới tính",
  },
  {
    id: 306,
    question_type: "q53",
    source: "TOPIK 76",
    context: "Xu hướng tăng trưởng nền tảng giao dịch đồ cũ trực tuyến",
    difficulty: "medium",
    chart_data: {
      title: "중고 물품 거래 앱 현황 (단위: 개/억 원)",
      items: [
        { label: "2015년 앱 수", percent: 3 },
        { label: "2020년 앱 수", percent: 6500 },
        { label: "2015년 매출", percent: 2 },
        { label: "2020년 매출", percent: 7500 },
      ],
    },
    text_kr: `다음을 참고하여 '중고 물품 거래 앱 현황'에 대한 조사 결과이다. 이 내용을 바탕으로 200~300자로 쓰십시오. 단, 글의 제목을 쓰지 마십시오.

조사 기관: 한국소비자원
- 중고 물품 거래 앱 수: 2015년 3개 → 2020년 6,500개
- 중고 물품 거래 앱 매출액: 2015년 2억 원 → 2020년 7,500억 원`,
    topic: "Viết bài phân tích sự tăng trưởng của ứng dụng mua bán đồ cũ",
  },
  {
    id: 307,
    question_type: "q53",
    source: "TOPIK 83",
    context: "Biến động doanh thu cửa hàng tiện lợi theo số hộ gia đình",
    difficulty: "medium",
    chart_data: {
      title: "인주시 가구 수 및 편의점 매출액 변화",
      items: [
        { label: "2001년 가구", percent: 150 },
        { label: "2021년 가구", percent: 210 },
        { label: "1인가구 2001", percent: 15 },
        { label: "1인가구 2021", percent: 30 },
      ],
    },
    text_kr: `다음을 참고하여 '인주시 편의점 매출액 변화'에 대한 조사 결과이다. 이 내용을 바탕으로 200~300자로 쓰십시오. 단, 글의 제목을 쓰지 마십시오.

조사 기관: 인주시 유통연구소
- 인주시 가구 수: 2001년 15만 → 2021년 21만 가구
- 1인 가구 비율: 2001년 15% → 2021년 30%
- 2040년 1인 가구 43% 초과 전망`,
    topic: "Viết bài phân tích biến động doanh thu cửa hàng tiện lợi theo hộ gia đình",
  },
  {
    id: 308,
    question_type: "q53",
    source: "TOPIK 84",
    context: "Dân số trẻ chuyển về nông thôn tăng mạnh 12 lần trong 8 năm",
    difficulty: "medium",
    chart_data: {
      title: "농촌 이주 인구 현황 (단위: 만 명)",
      items: [
        { label: "2013년", percent: 3 },
        { label: "2021년", percent: 37 },
        { label: "20~30대", percent: 15 },
        { label: "40~50대", percent: 12 },
        { label: "60~70대", percent: 7 },
      ],
    },
    text_kr: `다음을 참고하여 '농촌 이주 인구 현황'에 대한 조사 결과이다. 이 내용을 바탕으로 200~300자로 쓰십시오. 단, 글의 제목을 쓰지 마십시오.

조사 기관: 농업 경제 연구소
- 농촌 이주 인구 수: 2013년 3만 2천 명 → 2021년 37만 명 (약 12배 증가)
- 연령대별 증가 현황: 20~30대 15만 명 / 40~50대 12만 명 / 60~70대 7만 명 증가
- 원인: 청년층 농촌 생활 선호도 상승 + 청년 농부에 대한 정부 지원 확대`,
    topic: "Viết bài phân tích xu hướng dân số trẻ chuyển về nông thôn",
  },
  {
    id: 309,
    question_type: "q53",
    source: "TOPIK 88",
    context: "Sự biến đổi số lượng và loại hình hiệu sách tại thành phố Inju",
    difficulty: "medium",
    chart_data: {
      title: "인주시 서점 수 변화 (단위: 개)",
      items: [
        { label: "전체 2016", percent: 81 },
        { label: "전체 2022", percent: 115 },
        { label: "중·대형 감소", percent: 34 },
        { label: "소형 증가", percent: 100 },
      ],
    },
    text_kr: `다음을 참고하여 '인주시의 서점 현황'에 대한 조사 결과이다. 이 내용을 바탕으로 200~300자로 쓰십시오. 단, 글의 제목을 쓰지 마십시오.

조사 기관: 인주시 도서유통협회
- 인주시 서점 수: 2016년 81개 → 2022년 115개
- 중·대형 서점: 약 34% 감소 (매장 관리비 상승, 방문 고객 수 감소)
- 소형 서점: 약 100% 증가 (카페형 등 개성 있는 서점 인기)`,
    topic: "Viết bài phân tích biến động số lượng và loại hình hiệu sách",
  },
  {
    id: 310,
    question_type: "q53",
    source: "TOPIK 92",
    context: "Lượng tiêu thụ trái cây trong nước — trái cây nhập khẩu tăng",
    difficulty: "medium",
    chart_data: {
      title: "국내 과일 소비량 변화 (단위: kg/1인)",
      items: [
        { label: "국내산 2010", percent: 46 },
        { label: "국내산 2022", percent: 41 },
        { label: "수입산 2010", percent: 12 },
        { label: "수입산 2022", percent: 16 },
      ],
    },
    text_kr: `다음을 참고하여 '국내 과일 소비량 변화'에 대한 조사 결과이다. 이 내용을 바탕으로 200~300자로 쓰십시오. 단, 글의 제목을 쓰지 마십시오.

조사 기관: 한국농수산식품유통공사
- 1인당 연간 과일 소비량: 2010년 57.7kg → 2022년 57.1kg (전체 유사)
- 국내산: 45.6kg → 41.4kg (감소)
- 수입산: 12.1kg → 15.7kg (증가)`,
    topic: "Viết bài phân tích biến động lượng tiêu thụ trái cây trong nước",
  },
  {
    id: 311,
    question_type: "q53",
    source: "TOPIK 93",
    context: "Doanh thu quần áo thể thao tăng — xu hướng mặc thường ngày",
    difficulty: "medium",
    chart_data: {
      title: "스포츠 의류 매출액 변화 (단위: 조 원)",
      items: [
        { label: "전체 2021", percent: 50 },
        { label: "전체 2023", percent: 70 },
        { label: "전문용 2021", percent: 40 },
        { label: "전문용 2023", percent: 39 },
        { label: "생활형 2021", percent: 10 },
        { label: "생활형 2023", percent: 31 },
      ],
    },
    text_kr: `다음을 참고하여 '스포츠 의류 매출액의 변화'에 대한 조사 결과이다. 이 내용을 바탕으로 200~300자로 쓰십시오. 단, 글의 제목을 쓰지 마십시오.

조사 기관: 스포츠의류연구소
- 스포츠 의류 전체 매출액: 2021년 5조 → 2023년 7조 원 (40% 증가)
- 전문 스포츠 의류: 4조 → 3.9조 (소폭 감소)
- 생활형 스포츠 의류: 1조 → 3.1조 (3배 증가)
- 원인: 디자인 개선 + 직장 내 편한 옷차림 문화 확산`,
    topic: "Viết bài phân tích xu hướng doanh thu quần áo thể thao",
  },
  {
    id: 312,
    question_type: "q53",
    source: "TOPIK 94",
    context: "Số lượng chi nhánh ngân hàng giảm, tỷ lệ sử dụng quầy giao dịch giảm mạnh",
    difficulty: "hard",
    chart_data: {
      title: "은행 지점 수 및 창구 이용률 변화",
      items: [
        { label: "지점 수 2015", percent: 73 },
        { label: "지점 수 2023", percent: 58 },
        { label: "20~30대 감소", percent: 22 },
        { label: "40~50대 감소", percent: 38 },
        { label: "60대+ 감소", percent: 4 },
      ],
    },
    text_kr: `다음을 참고하여 '전국의 은행 지점 수 및 연령별 은행 창구 이용률 변화'에 대한 조사 결과이다. 이 내용을 바탕으로 200~300자로 쓰십시오. 단, 글의 제목을 쓰지 마십시오.

조사 기관: 한국금융협회
- 은행 지점 수: 2015년 7,300개 → 2023년 5,800개 (감소)
- 창구 이용률 감소: 20·30대 22% 감소 / 40·50대 38% 감소 / 60대 이상 4% 감소`,
    topic: "Viết bài phân tích sự sụt giảm chi nhánh ngân hàng và tỷ lệ giao dịch quầy",
  },
  {
    id: 313,
    question_type: "q53",
    source: "TOPIK 95",
    context: "Doanh thu biểu diễn K-pop tăng 750 lần nhờ làn sóng Hallyu",
    difficulty: "hard",
    chart_data: {
      title: "인주시 공연 매출액 변화 (단위: 억 원)",
      items: [
        { label: "전체 2015", percent: 340 },
        { label: "전체 2023", percent: 13000 },
        { label: "대중공연 2015", percent: 8 },
        { label: "대중공연 2023", percent: 6000 },
      ],
    },
    text_kr: `다음을 참고하여 '인주시 공연 매출액 변화'에 대한 조사 결과이다. 이 내용을 바탕으로 200~300자로 쓰십시오. 단, 글의 제목을 쓰지 마십시오.

조사 기관: 인주시예술연구소
- 전체 공연 매출액: 2015년 340억 → 2023년 1조 3,000억 (약 3.8배 증가)
- 대중공연: 2015년 8억 → 2023년 6,000억 (약 750배 증가)
- 그 외 공연: 21배 증가
- 원인: 케이팝 인기 확산 → 공연 횟수 증가 / 공연장 수 확대 → 접근성 향상`,
    topic: "Viết bài phân tích biến động doanh thu biểu diễn và ảnh hưởng K-pop",
  },
  {
    id: 314,
    question_type: "q53",
    source: "TOPIK 96",
    context: "Người tham gia marathon tại Inju tăng 2.5 lần, thanh niên tăng mạnh nhất",
    difficulty: "medium",
    chart_data: {
      title: "인주시 마라톤 대회 참가자 수 변화 (단위: 명)",
      items: [
        { label: "전체 2013", percent: 40 },
        { label: "전체 2023", percent: 100 },
        { label: "20~30대↑", percent: 40 },
        { label: "40~50대↑", percent: 13 },
      ],
    },
    text_kr: `다음을 참고하여 '인주시 마라톤 스포츠 대회 참가자 수 변화'에 대한 조사 결과이다. 이 내용을 바탕으로 200~300자로 쓰십시오. 단, 글의 제목을 쓰지 마십시오.

조사 기관: 한국스포츠연구소
- 전체 참가자 수: 2013년 40명 → 2023년 100명 (2.5배 증가)
- 20~30대: 4배 증가 / 40~50대: 1.3배 증가
- 원인: 건강 관리 관심 증가 → 달리기 모임 확산 / SNS 통한 마라톤 모임 활성화 → 20~30대 참가 증가`,
    topic: "Viết bài phân tích biến động số người tham gia marathon và lý do",
  },
  {
    id: 315,
    question_type: "q53",
    source: "TOPIK 97",
    context: "Nhiệt độ trái đất tăng từ 1900 đến 2100 — xu hướng nóng lên toàn cầu",
    difficulty: "medium",
    chart_data: {
      title: "지구 평균 기온 변화 예측 (단위: ℃)",
      items: [
        { label: "1900년", percent: 138 },
        { label: "2023년", percent: 149 },
        { label: "2100년(예측)", percent: 175 },
      ],
    },
    text_kr: `다음을 참고하여 '지구 평균 기온 변화'에 대한 내용을 200~300자로 쓰십시오. 단, 글의 제목을 쓰지 마십시오.

조사 기관: 세계기상기구
- 지구 평균 기온: 1900년 13.8℃ → 2023년 14.9℃ → 2100년 17.5℃ 예측
- 120년간 1.1℃ 상승 / 2100년까지 추가 2.6℃ 상승 전망`,
    topic: "Viết bài phân tích xu hướng nhiệt độ trái đất tăng và dự báo tương lai",
  },
  {
    id: 316,
    question_type: "q53",
    source: "TOPIK 98",
    context: "Xuất bản tác phẩm văn học Hàn Quốc ra nước ngoài tăng 4 lần",
    difficulty: "medium",
    chart_data: {
      title: "한국 문학 작품 해외 출판 현황 (단위: 편)",
      items: [
        { label: "전체 2014", percent: 53 },
        { label: "전체 2024", percent: 205 },
        { label: "소설 2014", percent: 40 },
        { label: "소설 2024", percent: 155 },
      ],
    },
    text_kr: `다음을 참고하여 '한국 문학 작품의 해외 출판 현황 및 변화'에 대한 조사 결과이다. 이 내용을 바탕으로 200~300자로 쓰십시오. 단, 글의 제목을 쓰지 마십시오.

조사 기관: 한국문학번역원
- 해외 출판 작품 수: 2014년 53편 → 2024년 205편 (약 4배 증가)
- 소설: 40편 → 155편 (가장 큰 증가 / 시·희곡은 소폭 증가)
- 원인: 한국 소설의 국제 문학상 수상 + 번역 지원 확대`,
    topic: "Viết bài phân tích sự tăng trưởng xuất bản văn học Hàn ra nước ngoài",
  },
  {
    id: 317,
    question_type: "q53",
    source: "TOPIK 100",
    context: "Doanh thu phim truyền hình Hàn tăng 9 lần ra thị trường quốc tế",
    difficulty: "hard",
    chart_data: {
      title: "한국 드라마 해외 매출 변화 (단위: 억 원)",
      items: [
        { label: "전체 2014", percent: 6000 },
        { label: "전체 2024", percent: 53000 },
        { label: "드라마 비중 2014", percent: 35 },
        { label: "드라마 비중 2024", percent: 85 },
      ],
    },
    text_kr: `다음을 참고하여 '한국 드라마 해외 매출 변화'에 대한 조사 결과이다. 이 내용을 바탕으로 200~300자로 쓰십시오. 단, 글의 제목을 쓰지 마십시오.

조사 기관: 한국콘텐츠진흥원
- 전체 매출액: 2014년 6,000억 → 2024년 5조 3,000억 원 (약 9배 증가)
- 드라마 비중: 35% → 85% (3배 증가 / 예능·기타 감소)
- 원인: 글로벌 드라마 플랫폼 확산 + 한류 드라마 해외 수요 증가`,
    topic: "Viết bài phân tích sự bùng nổ doanh thu phim truyền hình Hàn Quốc ở nước ngoài",
  },
  {
    id: 318,
    question_type: "q53",
    source: "TOPIK 101",
    context: "Doanh thu quà lưu niệm bảo tàng Inju tăng 3 lần, khách nước ngoài tăng mạnh nhất",
    difficulty: "medium",
    chart_data: {
      title: "인주시 박물관 기념품 매출액 (단위: 억 원)",
      items: [
        { label: "전체 2020", percent: 72 },
        { label: "전체 2024", percent: 223 },
        { label: "한국인 2020", percent: 54 },
        { label: "한국인 2024", percent: 162 },
        { label: "외국인 2020", percent: 18 },
        { label: "외국인 2024", percent: 72 },
      ],
    },
    text_kr: `다음을 참고하여 '인주시 박물관 기념품 매출액 변화'에 대한 조사 결과이다. 이 내용을 바탕으로 200~300자로 쓰십시오. 단, 글의 제목을 쓰지 마십시오.

조사 기관: 인주시 박물관
- 전체 기념품 매출액: 2020년 72억 → 2024년 223억 (약 3배 증가)
- 한국인: 약 3배 증가 / 외국인: 약 4배 증가`,
    topic: "Viết bài phân tích biến động doanh thu quà lưu niệm bảo tàng",
  },
  {
    id: 319,
    question_type: "q53",
    source: "TOPIK 102",
    context: "Người cắm trại tại Inju tăng 2 lần, nhóm tuổi 40-50 vượt lên dẫn đầu",
    difficulty: "medium",
    chart_data: {
      title: "인주시 캠핑객 수 변화 (단위: 만 명)",
      items: [
        { label: "전체 2019", percent: 340 },
        { label: "전체 2024", percent: 650 },
        { label: "20~30대 (2019→1위)", percent: 60 },
        { label: "40~50대 (2024→1위)", percent: 70 },
      ],
    },
    text_kr: `다음을 참고하여 '인주시 캠핑 변화'에 대한 조사 결과이다. 이 내용을 바탕으로 200~300자로 쓰십시오. 단, 글의 제목을 쓰지 마십시오.

조사 기관: 인주시 관광 공사
- 캠핑객 수: 2019년 340만 → 2024년 650만 명 (약 2배 증가)
- 연령별 순위: 2019년 1위 20~30대 / 2024년 1위 40~50대로 역전
- 원인: 고급화·캠핑장 대여 증가(경제력 요구) + 가족 단위 캠핑 증가`,
    topic: "Viết bài phân tích xu hướng cắm trại và sự thay đổi nhóm tuổi dẫn đầu",
  },
  {
    id: 320,
    question_type: "q53",
    source: "TOPIK 103",
    context: "Tỷ lệ sinh tại Inju phục hồi sau đáy năm 2019 — lên 7600 ca năm 2024",
    difficulty: "medium",
    chart_data: {
      title: "인주시 출생아 수 변화 (단위: 명)",
      items: [
        { label: "2014년", percent: 51 },
        { label: "2019년", percent: 49 },
        { label: "2024년", percent: 76 },
      ],
    },
    text_kr: `다음을 참고하여 '인주시 출생아 수 변화'에 대해 200~300자로 쓰십시오. 단, 글의 제목을 쓰지 마십시오.

조사 기관: 인주시 보건연구원
- 출생아 수: 2014년 5,100명 → 2019년 4,900명 → 2024년 7,600명
- 2014~2019년 소폭 감소 후 2024년 큰 폭으로 반등`,
    topic: "Viết bài phân tích biến động tỷ lệ sinh và xu hướng phục hồi",
  },
  {
    id: 321,
    question_type: "q53",
    source: "TOPIK 104",
    context: "Doanh thu đồ chơi người lớn tăng 5 lần — xu hướng mua đồ chơi cao cấp",
    difficulty: "hard",
    chart_data: {
      title: "국내 장난감 매출액 변화 (단위: 조 원)",
      items: [
        { label: "전체 2015", percent: 22 },
        { label: "전체 2025", percent: 32 },
        { label: "어린이용 증가", percent: 11 },
        { label: "어른용 증가", percent: 50 },
      ],
    },
    text_kr: `다음을 참고하여 '국내 장난감 매출액의 변화'에 대해 200~300자로 쓰십시오. 단, 글의 제목을 쓰지 마십시오.

조사 기관: 인주경제연구소
- 전체 매출액: 2015년 2조 2천억 → 2025년 3조 2천억 (약 1.5배 증가)
- 어린이용 장난감: 1.1배 증가 / 어른용 장난감: 5배 증가
- 원인: 어른들의 장난감 관심 상승 + 기업의 다양한 고가 장난감 출시`,
    topic: "Viết bài phân tích sự tăng trưởng của thị trường đồ chơi người lớn",
  },
  {
    id: 322,
    question_type: "q53",
    source: "TOPIK 105",
    context: "Tỷ lệ sử dụng AI tạo sinh tăng 3 lần — sản xuất nội dung video/hình ảnh tăng mạnh nhất",
    difficulty: "hard",
    chart_data: {
      title: "생성형 AI 서비스 이용률 (단위: %)",
      items: [
        { label: "전체 2023", percent: 18 },
        { label: "전체 2025", percent: 55 },
        { label: "정보검색 증가", percent: 10 },
        { label: "문서작업 증가", percent: 60 },
        { label: "영상·이미지 증가", percent: 230 },
      ],
    },
    text_kr: `다음을 참고하여 '인주시 생성형 AI 서비스 이용 변화'에 대해 200~300자로 쓰십시오. 단, 글의 제목을 쓰지 마십시오.

조사 기관: 인주시정보연구소
- 생성형 AI 이용률: 2023년 17.6% → 2025년 55.2% (약 3배 증가)
- 목적별: 정보검색 1.1배 / 문서작업 1.6배 / 영상·이미지 생성 3.3배 증가
- 원인: 개인 콘텐츠 제작 증가 + 생성형 AI 창작품 수준 향상`,
    topic: "Viết bài phân tích biến động tỷ lệ sử dụng AI tạo sinh và mục đích sử dụng",
  },
  {
    id: 323,
    question_type: "q53",
    source: "TOPIK 106",
    context: "Sản lượng đánh bắt thủy sản tại Geosan giảm 40% — mực giảm mạnh do nước biển ấm hơn",
    difficulty: "hard",
    chart_data: {
      title: "거산시 어업 생산량 변화 (단위: 천 톤)",
      items: [
        { label: "전체 2014", percent: 100 },
        { label: "전체 2024", percent: 60 },
        { label: "오징어 감소", percent: 70 },
        { label: "멸치·고등어 증가", percent: 15 },
      ],
    },
    text_kr: `다음을 참고하여 '거산시 어업 생산량 변화'에 대해 200~300자로 쓰십시오. 단, 글의 제목을 쓰지 마십시오.

조사 기관: 거산수산연구원
- 전체 어업 생산량: 2014년 1만 톤 → 2024년 6천 톤 (약 40% 감소)
- 오징어: 대폭 감소 / 멸치·고등어: 소폭 증가
- 원인: 인구 감소 → 어업 종사자 감소 / 지구 온난화 → 바다 온도 상승 → 차가운 바다 어종(오징어) 감소`,
    topic: "Viết bài phân tích sự sụt giảm sản lượng đánh bắt thủy sản và nguyên nhân",
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
    context: "Công nghệ AI và tương lai nhân loại",
    text_kr: `다음을 주제로 하여 자신의 생각을 600~700자로 쓰시오. (단, 문제를 그대로 옮겨 쓰지 마시오.)`,
    topic: `인공지능 기술이 발전함에 따라 인간의 역할이 어떻게 변화할지 논하고, 이에 대한 사회적 대응 방안을 쓰시오.`,
  },
  {
    id: 402,
    question_type: "q54",
    source: "TOPIK 81",
    difficulty: "hard",
    context: "Môi trường và tăng trưởng kinh tế",
    text_kr: `다음을 주제로 하여 자신의 생각을 600~700자로 쓰시오. (단, 문제를 그대로 옮겨 쓰지 마시오.)`,
    topic: `환경 보호와 경제 성장은 서로 충돌한다는 견해가 있다. 이에 대한 자신의 견해를 논리적으로 쓰시오.`,
  },
  {
    id: 403,
    question_type: "q54",
    source: "TOPIK 79",
    difficulty: "medium",
    context: "Văn hóa đọc sách trong thời đại số",
    text_kr: `다음을 주제로 하여 자신의 생각을 600~700자로 쓰시오. (단, 문제를 그대로 옮겨 쓰지 마시오.)`,
    topic: `디지털 시대에 독서 문화가 쇠퇴하고 있다는 우려가 있다. 독서의 가치와 독서 문화 활성화 방안에 대해 쓰시오.`,
  },
  {
    id: 404,
    question_type: "q54",
    source: "TOPIK 77",
    difficulty: "hard",
    context: "Hệ thống phúc lợi xã hội và trách nhiệm cá nhân",
    text_kr: `다음을 주제로 하여 자신의 생각을 600~700자로 쓰시오. (단, 문제를 그대로 옮겨 쓰지 마시오.)`,
    topic: `복지 사회 실현을 위해 국가와 개인은 각각 어떤 역할을 해야 하는지 논하시오.`,
  },
  {
    id: 405,
    question_type: "q54",
    source: "TOPIK 75",
    difficulty: "medium",
    context: "Lao động nước ngoài và xã hội Hàn Quốc",
    text_kr: `다음을 주제로 하여 자신의 생각을 600~700자로 쓰시오. (단, 문제를 그대로 옮겨 쓰지 마시오.)`,
    topic: `외국인 근로자 증가가 한국 사회에 미치는 영향을 긍정적, 부정적 측면에서 분석하고 바람직한 방향을 제시하시오.`,
  },
  {
    id: 406,
    question_type: "q54",
    source: "TOPIK 76",
    difficulty: "medium",
    context: "Sự cần thiết của từ thiện và cách thúc đẩy văn hóa quyên góp",
    text_kr: `다음을 주제로 하여 자신의 생각을 600~700자로 쓰시오. (단, 문제를 그대로 옮겨 쓰지 마시오.)`,
    topic: `기부의 필요성과 기부 문화 활성화 방안에 대해 쓰시오.

1. 기부가 왜 필요한가?
2. 기부를 통해 어떤 효과를 얻을 수 있는가?
3. 기부 문화를 활성화하기 위한 방안은 무엇인가?`,
  },
  {
    id: 407,
    question_type: "q54",
    source: "TOPIK 83",
    difficulty: "hard",
    context: "Sự cần thiết của sáng tạo và phương pháp phát triển năng lực sáng tạo",
    text_kr: `다음을 주제로 하여 자신의 생각을 600~700자로 쓰시오. (단, 문제를 그대로 옮겨 쓰지 마시오.)`,
    topic: `창의력의 필요성과 이를 기르기 위한 노력에 대해 쓰시오.

1. 창의력이 왜 필요한가?
2. 창의력을 통해 이룰 수 있는 결과는 무엇인가?
3. 창의력을 기르기 위해 어떤 노력을 해야 하는가?`,
  },
  {
    id: 408,
    question_type: "q54",
    source: "TOPIK 84",
    difficulty: "medium",
    context: "Nghỉ ngơi thực sự là gì và cần làm gì để có được sự nghỉ ngơi đích thực",
    text_kr: `다음을 주제로 하여 자신의 생각을 600~700자로 쓰시오. (단, 문제를 그대로 옮겨 쓰지 마시오.)`,
    topic: `누구나 휴식이 필요하다. 휴식 시간에 잠을 자는 사람도 있고 취미 생활을 하는 사람도 있다. 그러나 휴식 후에도 진정한 휴식을 취하지 못하거나 만족하지 않을 때가 있다. '진정한 휴식'에 대한 글을 쓰시오.

1. 휴식이 필요한 이유는 무엇인가?
2. 진정한 휴식이란 무엇인가?
3. 진정한 휴식을 위해 어떤 노력이 필요한가?`,
  },
  {
    id: 409,
    question_type: "q54",
    source: "TOPIK 88",
    difficulty: "medium",
    context: "Sự cần thiết của camera giám sát và những tác dụng phụ",
    text_kr: `다음을 주제로 하여 자신의 생각을 600~700자로 쓰시오. (단, 문제를 그대로 옮겨 쓰지 마시오.)`,
    topic: `우리 사회 곳곳에는 안전상의 이유로 CCTV가 설치되어 있다. CCTV 설치가 필요하다고 보는 사람도 있지만 이로 인해 생기는 부작용을 걱정하는 사람도 있다. 'CCTV 설치의 필요성과 부작용'에 대한 자신의 생각을 쓰시오.

1. CCTV 설치가 필요하다고 주장하는 사람들의 근거는 무엇인가?
2. CCTV 설치로 인해 일어날 수 있는 부작용은 무엇인가?
3. 이에 대한 자신의 생각은 어떠한가?`,
  },
  {
    id: 410,
    question_type: "q54",
    source: "TOPIK 92",
    difficulty: "hard",
    context: "Biến đổi cơ cấu dân số — nguyên nhân, vấn đề và giải pháp",
    text_kr: `다음을 주제로 하여 자신의 생각을 600~700자로 쓰시오. (단, 문제를 그대로 옮겨 쓰지 마시오.)`,
    topic: `인구 구조 변화에 대해 쓰시오.

1. 어린이나 노인의 인구 비율이 변화하는 원인은 무엇인가?
2. 인구 구조 변화로 인해 어떤 문제가 발생하는가?
3. 이런 문제에 대응하기 위해 어떤 노력이 필요한가?`,
  },
  {
    id: 411,
    question_type: "q54",
    source: "TOPIK 93",
    difficulty: "medium",
    context: "Sự phụ thuộc vào thiết bị kỹ thuật số — tiện ích và tác hại",
    text_kr: `다음을 주제로 하여 자신의 생각을 600~700자로 쓰시오. (단, 문제를 그대로 옮겨 쓰지 마시오.)`,
    topic: `우리는 노트북, 태블릿 등 디지털 기기를 통해 언제 어디에서든 업무를 볼 수 있고 여가 생활에서도 이런 기기를 활용한다. 디지털 기기는 우리 생활에 편리함을 주지만 이에 대한 의존도가 커지면 부작용이 나타날 수 있다.

1. 디지털 기기가 우리에게 주는 편리함은 어떤 것이 있는가?
2. 디지털 기기에 대한 의존으로 인해 발생하는 부작용은 무엇인가?
3. 이러한 부작용을 줄이려면 어떻게 해야 하는가?`,
  },
  {
    id: 412,
    question_type: "q54",
    source: "TOPIK 94",
    difficulty: "medium",
    context: "Giá trị của văn hóa và chính sách hỗ trợ để nhiều người được tiếp cận",
    text_kr: `다음을 주제로 하여 자신의 생각을 600~700자로 쓰시오. (단, 문제를 그대로 옮겨 쓰지 마시오.)`,
    topic: `문화생활을 하다 보면 전시회를 보거나 작품을 감상하는 경우가 많지만, 작품을 감상하는 것이 쉽지 않다. 아래의 내용을 중심으로 '문화생활의 가치'에 대한 자신의 생각을 쓰시오.

1. 문화생활을 하면 어떤 점이 좋은가?
2. 문화생활을 하는 것이 쉽지 않은 이유는 무엇인가?
3. 더 많은 문화생활을 할 수 있도록 정부는 어떤 정책 지원을 해야 하는가?`,
  },
  {
    id: 413,
    question_type: "q54",
    source: "TOPIK 95",
    difficulty: "hard",
    context: "Trách nhiệm xã hội của doanh nghiệp — tầm quan trọng và cách thực hiện",
    text_kr: `다음을 주제로 하여 자신의 생각을 600~700자로 쓰시오. (단, 문제를 그대로 옮겨 쓰지 마시오.)`,
    topic: `요즘 기업이 기업의 이익을 넘어서 환경 보호, 사회 구성원의 행복, 사회 발전을 위해 사회적인 책임이 있다. 아래의 내용을 중심으로 '기업의 사회적 책임'에 대한 자신의 생각을 쓰시오.

1. 기업의 사회적 책임이 왜 중요한가?
2. 기업의 사회적 책임을 실천하는 구체적인 예로는 무엇이 있는가?
3. 기업이 사회적인 책임을 다하도록 하려면 사회 구성원이 어떤 노력이 필요한가?`,
  },
  {
    id: 414,
    question_type: "q54",
    source: "TOPIK 96",
    difficulty: "medium",
    context: "Quyền tự chủ cá nhân tại nơi làm việc — lợi ích và rủi ro",
    text_kr: `다음을 주제로 하여 자신의 생각을 600~700자로 쓰시오. (단, 문제를 그대로 옮겨 쓰지 마시오.)`,
    topic: `직장 내에서 복장, 출퇴근 시간, 업무 방식 등에 대한 개인의 자율성을 원하는 사람들이 많다. 회사에서 이런 자율성이 보장될 때 생기는 장점이 있다. 그런데 개인의 자율성만 중시할 때 문제가 발생할 우려도 있다. '직장 자율성'에 대해 쓰시오.

1. 직장에서 개인의 자율성이 보장될 때 장점은 무엇인가?
2. 사람들이 개인의 자율성만 중시할 때 어떤 문제가 발생하는가?
3. 이런 문제를 해결하기 위해 어떤 노력을 해야 하는가?`,
  },
  {
    id: 415,
    question_type: "q54",
    source: "TOPIK 97",
    difficulty: "hard",
    context: "Phân biệt đối xử trong xã hội — loại hình, hệ lụy và giải pháp",
    text_kr: `다음을 주제로 하여 자신의 생각을 600~700자로 쓰시오. (단, 문제를 그대로 옮겨 쓰지 마시오.)`,
    topic: `차별이란 둘 이상의 대상에 차이를 두고 불평등하게 대하는 것을 말한다. 아래의 내용을 중심으로 '차별의 문제점과 해결 방안'에 대한 자신의 생각을 쓰시오.

1. 차별의 종류에는 어떤 것들이 있는가?
2. 차별로 인해 발생하는 사회적 문제는 무엇인가?
3. 차별로 인한 문제점을 극복하기 위해 어떻게 해야 하는가?`,
  },
  {
    id: 416,
    question_type: "q54",
    source: "TOPIK 98",
    difficulty: "medium",
    context: "Cổ vũ và khích lệ đúng cách — khi nào có ích, khi nào phản tác dụng",
    text_kr: `다음을 주제로 하여 자신의 생각을 600~700자로 쓰시오. (단, 문제를 그대로 옮겨 쓰지 마시오.)`,
    topic: `우리는 주위의 사람들에게 주어진 목표 달성을 위해 격려와 응원을 주고받는다. 그러나 이러한 격려와 응원은 때로는 도움이 되지만 때로는 방해가 되기도 한다. 아래의 내용을 중심으로 '올바른 격려와 응원'에 대한 글을 쓰시오.

1. 어떤 경우에 격려와 응원이 필요한가?
2. 도움이 되지 않는 격려와 응원의 표현은 무엇인가?
3. 효과적으로 격려하고 응원하기 위한 방법은 무엇인가?`,
  },
  {
    id: 417,
    question_type: "q54",
    source: "TOPIK 100",
    difficulty: "hard",
    context: "Tác động của trí tuệ nhân tạo lên xã hội — tích cực, tiêu cực và giải pháp",
    text_kr: `다음을 주제로 하여 자신의 생각을 600~700자로 쓰시오. (단, 문제를 그대로 옮겨 쓰지 마시오.)`,
    topic: `현대 사회에서 인공지능(AI)은 다양한 분야에서 큰 영향을 미치고 있다. 인공지능 기술의 발전 속도는 매우 빠르며 이는 사회 전반에 걸쳐 많은 변화를 가져오고 있다. 아래의 내용을 중심으로 '인공지능의 영향'에 대한 자신의 생각을 쓰시오.

1. 인공지능의 발전이 사회에 미치는 긍정적인 영향은 무엇인가?
2. 인공지능 기술의 발전으로 인해 발생할 수 있는 부정적인 영향은 무엇인가?
3. 인공지능의 부정적인 영향을 최소화하기 위한 해결책은 무엇인가?`,
  },
  {
    id: 418,
    question_type: "q54",
    source: "TOPIK 101",
    difficulty: "medium",
    context: "Làm việc từ xa (remote work) — ưu điểm, nhược điểm và giải pháp",
    text_kr: `다음을 주제로 하여 자신의 생각을 600~700자로 쓰시오. (단, 문제를 그대로 옮겨 쓰지 마시오.)`,
    topic: `최근에 재택근무에 관심을 가지는 회사와 직원들이 점점 늘어나고 있다. 아래의 내용을 중심으로 재택근무에 대한 자신의 생각을 쓰시오.

1. 재택근무의 장점은 무엇인가?
2. 재택근무의 문제점은 무엇인가?
3. 재택근무의 문제를 해결하기 위한 방법에는 어떤 것이 있는가?`,
  },
  {
    id: 419,
    question_type: "q54",
    source: "TOPIK 102",
    difficulty: "hard",
    context: "Loại trừ kỹ thuật số (digital divide) — ai bị ảnh hưởng và cách giải quyết",
    text_kr: `다음을 주제로 하여 자신의 생각을 600~700자로 쓰시오. (단, 문제를 그대로 옮겨 쓰지 마시오.)`,
    topic: `최근 식당이나 병원, 은행에서도 디지털 기기를 사용하고 있습니다. 그런데 디지털 기기에서 소외되는 사람이 있습니다. 아래의 내용을 중심으로 '디지털 소외 문제와 해결 방안'에 대해 자신의 생각을 쓰시오.

1. 디지털 기기를 어떻게 활용하고 있는가?
2. 디지털 소외되는 사람은 누구인가? 왜 소외되는가?
3. 디지털 소외 문제를 해결하기 위해 개인과 사회는 어떻게 해야 하는가?`,
  },
  {
    id: 420,
    question_type: "q54",
    source: "TOPIK 103",
    difficulty: "hard",
    context: "Vệ sinh công cộng — tầm quan trọng, hậu quả khi thiếu và giải pháp cải thiện",
    text_kr: `다음을 주제로 하여 자신의 생각을 600~700자로 쓰시오. (단, 문제를 그대로 옮겨 쓰지 마시오.)`,
    topic: `현대 사회에서는 인구 밀집 증가와 생활환경 변화로 공공위생의 중요성이 더욱 강조된다. 공공위생은 국민 건강과 사회 안전을 유지하는 핵심 요소이다.

1. 공공위생이 왜 중요한가?
2. 공공위생 관리를 잘하지 않으면 어떤 문제가 발생하는가?
3. 공공위생을 개선하기 위해 우리는 어떤 노력과 해결책을 모색할 수 있는가?`,
  },
  {
    id: 421,
    question_type: "q54",
    source: "TOPIK 104",
    difficulty: "hard",
    context: "Chế độ thưởng hiệu quả — ưu điểm, vấn đề và cách cải thiện",
    text_kr: `다음을 주제로 하여 자신의 생각을 600~700자로 쓰시오. (단, 문제를 그대로 옮겨 쓰지 마시오.)`,
    topic: `기업이 직원의 업무 성과에 따라 보너스나 휴가 등으로 보상하는 것을 '성과 보상 제도'라고 한다. 이 제도는 긍정적인 면도 있지만 문제점도 적지 않다. 아래 내용을 중심으로 '성과 보상 제도의 문제점과 해결 방안'에 대한 자신의 생각을 쓰시오.

1. 성과 보상 제도의 긍정적인 면은 무엇인가?
2. 성과 보상 제도로 인해 나타날 수 있는 문제점은 무엇인가?
3. 이러한 문제를 해결하기 위해서는 어떻게 해야 하는가?`,
  },
  {
    id: 422,
    question_type: "q54",
    source: "TOPIK 105",
    difficulty: "medium",
    context: "Trải nghiệm trực tiếp và gián tiếp — tầm quan trọng trong thời đại số",
    text_kr: `다음을 주제로 하여 자신의 생각을 600~700자로 쓰시오. (단, 문제를 그대로 옮겨 쓰지 마시오.)`,
    topic: `경험에는 직접 경험과 간접 경험이 있다. 이전에는 사람들이 독서를 통해 직접 경험보다 더 많은 경험을 쌓았다. 최근에는 다양한 경험을 할 수 있는 방법이 늘어나고 있다. 이러한 변화 속에서 자기 계발을 위한 경험의 중요성에 대해 쓰시오.

1. 직접 경험보다 간접 경험이 많아진 이유는 무엇인가?
2. 직접 경험을 통해 얻을 수 있는 장점은 무엇인가?
3. 자기 성장을 위해 경험을 어떻게 쌓아야 하는가?`,
  },
  {
    id: 423,
    question_type: "q54",
    source: "TOPIK 106",
    difficulty: "hard",
    context: "Truyền thông đại chúng và hình thành giá trị của thanh thiếu niên",
    text_kr: `다음을 주제로 하여 자신의 생각을 600~700자로 쓰시오. (단, 문제를 그대로 옮겨 쓰지 마시오.)`,
    topic: `대중 매체와 청소년 가치관 형성에 대해 쓰시오.

1. 청소년이 대중 매체를 통해 얻을 수 있는 것은 무엇인가?
2. 대중 매체가 청소년의 가치관에 미치는 부정적인 영향은 무엇인가?
3. 청소년이 대중 매체를 대할 때 가져야 할 바람직한 태도는 무엇인가?`,
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
