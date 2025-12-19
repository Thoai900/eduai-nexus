
import { AIModelInfo, PromptTemplate, UserRole } from './types';

export const AI_MODELS: AIModelInfo[] = [
  {
    name: 'Gemini',
    provider: 'Google',
    description: 'Mô hình đa phương thức mạnh mẽ, có khả năng xử lý văn bản, hình ảnh, video và code vượt trội.',
    strengths: ['Đa phương thức', 'Cửa sổ ngữ cảnh lớn', 'Tốc độ nhanh (Flash)', 'Reasoning mạnh (Pro)'],
    icon: '✨'
  },
  {
    name: 'ChatGPT',
    provider: 'OpenAI',
    description: 'Chatbot phổ biến nhất, nổi tiếng với khả năng hội thoại tự nhiên và viết sáng tạo.',
    strengths: ['Hội thoại tự nhiên', 'Viết sáng tạo', 'Hệ sinh thái plugin'],
    icon: '🟢'
  },
  {
    name: 'Claude',
    provider: 'Anthropic',
    description: 'Tập trung vào sự an toàn và khả năng viết văn phong tự nhiên, ít "AI-like".',
    strengths: ['An toàn & Đạo đức', 'Viết lách sắc sảo', 'Xử lý văn bản dài'],
    icon: '🟠'
  }
];

export const SAMPLE_PROMPTS: PromptTemplate[] = [
  // =================================================================
  // 1. TOÁN HỌC (MATHEMATICS)
  // =================================================================
  {
    id: 'math-gen-01',
    title: 'Giải thích khái niệm Toán học',
    description: 'Hiểu bản chất của bất kỳ định lý hay khái niệm nào.',
    content: 'Hãy giải thích khái niệm toán học: "[Tên khái niệm, ví dụ: Đạo hàm / Tích phân / Xác suất]" cho một học sinh lớp [Lớp mấy].\n1. Định nghĩa đơn giản dễ hiểu.\n2. Ý nghĩa thực tiễn/Tại sao cần học nó?\n3. Một ví dụ minh họa cụ thể.',
    tags: ['Lý thuyết', 'Tư duy', 'Toán học'],
    role: UserRole.STUDENT,
    category: 'Toán học',
    isPublic: true,
    createdAt: Date.now()
  },
  {
    id: 'math-gen-02',
    title: 'Hướng dẫn giải bài tập (Từng bước)',
    description: 'Gia sư hướng dẫn giải toán chi tiết, không làm tắt.',
    content: 'Đóng vai gia sư Toán kiên nhẫn. Hãy hướng dẫn tôi giải bài toán sau từng bước một (Step-by-step). Giải thích logic tại sao lại thực hiện bước đó. \nBài toán: [Dán đề bài vào đây]',
    tags: ['Giải bài tập', 'Gia sư', 'Toán học'],
    role: UserRole.STUDENT,
    category: 'Toán học',
    isPublic: true,
    createdAt: Date.now()
  },
  {
    id: 'math-gen-03',
    title: 'Tìm lỗi sai trong lời giải',
    description: 'Phân tích và sửa lỗi sai của học sinh.',
    content: 'Dưới đây là lời giải của tôi cho một bài toán. Hãy đóng vai người chấm bài:\n1. Kiểm tra xem tôi có làm sai ở bước nào không?\n2. Giải thích nguyên nhân sai (lỗi tính toán hay lỗi tư duy).\n3. Đưa ra gợi ý sửa lại cho đúng.\n\nLời giải của tôi: [Dán lời giải vào đây]',
    tags: ['Chấm bài', 'Sửa lỗi', 'Toán học'],
    role: UserRole.STUDENT,
    category: 'Toán học',
    isPublic: true,
    createdAt: Date.now()
  },
  {
    id: 'math-gen-04',
    title: 'Tổng hợp công thức chương',
    description: 'Hệ thống hóa kiến thức để ôn tập.',
    content: 'Tôi đang ôn tập chương "[Tên chương, ví dụ: Hình học không gian / Số phức]". Hãy lập bảng tổng hợp các công thức quan trọng nhất cần nhớ trong chương này, kèm theo chú thích cho các đại lượng trong công thức.',
    tags: ['Ôn tập', 'Tổng hợp', 'Toán học'],
    role: UserRole.STUDENT,
    category: 'Toán học',
    isPublic: true,
    createdAt: Date.now()
  },
  {
    id: 'math-gen-05',
    title: 'Ứng dụng thực tế của Toán',
    description: 'Liên hệ toán học với đời sống.',
    content: 'Tôi đang học về "[Chủ đề toán học]". Hãy cho tôi 3 ví dụ cụ thể về việc kiến thức này được ứng dụng như thế nào trong đời sống thực tế hoặc các ngành nghề khác (Kinh tế, Kỹ thuật, Y tế...).',
    tags: ['Thực tế', 'Mở rộng', 'Toán học'],
    role: UserRole.STUDENT,
    category: 'Toán học',
    isPublic: true,
    createdAt: Date.now()
  },
  {
    id: 'math-gen-06',
    title: 'Tạo đề bài tương tự',
    description: 'Luyện tập thêm với các dạng bài tương tự.',
    content: 'Dựa trên bài toán mẫu này: "[Dán đề bài mẫu]".\nHãy tạo ra 3 bài toán mới có cấu trúc và độ khó tương đương nhưng thay đổi số liệu hoặc ngữ cảnh để tôi tự luyện tập. Cung cấp đáp án (nhưng ẩn đi) ở cuối.',
    tags: ['Luyện tập', 'Đề thi', 'Toán học'],
    role: UserRole.STUDENT,
    category: 'Toán học',
    isPublic: true,
    createdAt: Date.now()
  },
  {
    id: 'math-gen-07',
    title: 'Trực quan hóa đồ thị',
    description: 'Mô tả hình dạng đồ thị hàm số.',
    content: 'Hãy mô tả chi tiết hình dạng đồ thị của hàm số: "[Nhập hàm số, VD: y = x^3 - 3x + 1]".\n1. Tập xác định và tính chẵn lẻ.\n2. Các điểm cực trị, điểm uốn.\n3. Hành vi ở vô cực.\n4. Mô tả đường đi của nét vẽ đồ thị từ trái sang phải.',
    tags: ['Đồ thị', 'Hàm số', 'Toán học'],
    role: UserRole.STUDENT,
    category: 'Toán học',
    isPublic: true,
    createdAt: Date.now()
  },
  {
    id: 'math-gen-08',
    title: 'Tư duy chứng minh',
    description: 'Gợi ý hướng đi cho bài toán chứng minh.',
    content: 'Tôi đang gặp khó khăn khi chứng minh định lý/bài toán: "[Nhập yêu cầu chứng minh]".\nĐừng giải ngay. Hãy gợi ý cho tôi:\n1. Phương pháp chứng minh nào khả thi nhất (Phản chứng, Quy nạp, Trực tiếp...)?\n2. Các định lý bổ trợ nào nên dùng?\n3. Gợi ý bước đầu tiên để khai thác giả thiết.',
    tags: ['Chứng minh', 'Hình học', 'Toán học'],
    role: UserRole.STUDENT,
    category: 'Toán học',
    isPublic: true,
    createdAt: Date.now()
  },
  {
    id: 'math-gen-09',
    title: 'Mẹo tính nhẩm & Kiểm tra',
    description: 'Kỹ thuật tính nhanh và soát lỗi.',
    content: 'Hãy chỉ cho tôi các mẹo tính nhẩm nhanh hoặc phương pháp kiểm tra lại kết quả (như thay số đặc biệt, kiểm tra đơn vị...) cho dạng bài toán: "[Dạng bài, VD: Tính nguyên hàm / Nhân đa thức]".',
    tags: ['Mẹo', 'Kỹ năng', 'Toán học'],
    role: UserRole.STUDENT,
    category: 'Toán học',
    isPublic: true,
    createdAt: Date.now()
  },
  {
    id: 'math-gen-10',
    title: 'Toán học liên môn',
    description: 'Kết nối Toán với Lý/Hóa/Sinh.',
    content: 'Kiến thức toán học về "[Chủ đề Toán, VD: Vi phân / Vectơ]" được sử dụng như thế nào trong môn "[Môn khác, VD: Vật lý]"? Hãy cho một ví dụ bài tập tích hợp liên môn.',
    tags: ['Liên môn', 'Ứng dụng', 'Toán học'],
    role: UserRole.STUDENT,
    category: 'Toán học',
    isPublic: true,
    createdAt: Date.now()
  },

  // =================================================================
  // 2. VẬT LÝ (PHYSICS)
  // =================================================================
  {
    id: 'phys-gen-01',
    title: 'Giải thích hiện tượng Vật lý',
    description: 'Hiểu nguyên lý đằng sau các sự việc.',
    content: 'Dựa trên kiến thức Vật lý, hãy giải thích nguyên nhân gây ra hiện tượng: "[Tên hiện tượng, ví dụ: Cầu vồng / Sấm sét / Sự nổi]". Hãy giải thích đơn giản, tránh dùng quá nhiều thuật ngữ chuyên sâu nếu không cần thiết.',
    tags: ['Hiện tượng', 'Lý thuyết', 'Vật lý'],
    role: UserRole.STUDENT,
    category: 'Vật lý',
    isPublic: true,
    createdAt: Date.now()
  },
  {
    id: 'phys-gen-02',
    title: 'Phân tích bài toán Vật lý',
    description: 'Tóm tắt và định hướng giải.',
    content: 'Tôi có bài toán Vật lý sau: "[Dán đề bài]".\nHãy giúp tôi:\n1. Tóm tắt đề bài (Các đại lượng đã biết, cần tìm).\n2. Xác định các quy luật/định luật Vật lý liên quan.\n3. Viết công thức tổng quát để giải (chưa cần thay số).',
    tags: ['Phương pháp', 'Bài tập', 'Vật lý'],
    role: UserRole.STUDENT,
    category: 'Vật lý',
    isPublic: true,
    createdAt: Date.now()
  },
  {
    id: 'phys-gen-03',
    title: 'So sánh khái niệm',
    description: 'Phân biệt các khái niệm dễ nhầm lẫn.',
    content: 'Hãy phân biệt sự khác nhau giữa "[Khái niệm A]" và "[Khái niệm B]" (Ví dụ: Trọng lượng và Khối lượng / Tốc độ và Vận tốc). Lập bảng so sánh và đưa ra ví dụ minh họa.',
    tags: ['So sánh', 'Lý thuyết', 'Vật lý'],
    role: UserRole.STUDENT,
    category: 'Vật lý',
    isPublic: true,
    createdAt: Date.now()
  },
  {
    id: 'phys-gen-04',
    title: 'Thí nghiệm tư duy',
    description: 'Mô phỏng thí nghiệm trong đầu.',
    content: 'Hãy mô tả một thí nghiệm đơn giản (có thể làm tại nhà hoặc phòng thí nghiệm trường học) để kiểm chứng định luật/nguyên lý: "[Tên định luật]". Liệt kê dụng cụ cần thiết và các bước tiến hành.',
    tags: ['Thí nghiệm', 'Thực hành', 'Vật lý'],
    role: UserRole.STUDENT,
    category: 'Vật lý',
    isPublic: true,
    createdAt: Date.now()
  },
  {
    id: 'phys-gen-05',
    title: 'Suy luận logic Vật lý',
    description: 'Câu hỏi "Điều gì sẽ xảy ra nếu...?"',
    content: 'Theo các định luật Vật lý, điều gì sẽ xảy ra nếu: "[Giả định, ví dụ: Trái Đất ngừng quay / Không có lực ma sát]". Hãy phân tích các hệ quả có thể xảy ra.',
    tags: ['Tư duy', 'Giả định', 'Vật lý'],
    role: UserRole.STUDENT,
    category: 'Vật lý',
    isPublic: true,
    createdAt: Date.now()
  },
  {
    id: 'phys-gen-06',
    title: 'Chứng minh công thức',
    description: 'Hiểu nguồn gốc công thức.',
    content: 'Hãy giúp tôi thiết lập/chứng minh công thức: "[Công thức, VD: S = v0t + 1/2at^2]". Giải thích ý nghĩa vật lý của từng biến số trong công thức đó.',
    tags: ['Công thức', 'Lý thuyết', 'Vật lý'],
    role: UserRole.STUDENT,
    category: 'Vật lý',
    isPublic: true,
    createdAt: Date.now()
  },
  {
    id: 'phys-gen-07',
    title: 'Phân tích thứ nguyên (Đơn vị)',
    description: 'Kiểm tra tính đúng đắn qua đơn vị.',
    content: 'Hãy hướng dẫn tôi cách sử dụng phương pháp phân tích thứ nguyên (đơn vị) để kiểm tra xem kết quả của bài toán "[Chủ đề, VD: Dao động điều hòa]" có hợp lý không.',
    tags: ['Kỹ năng', 'Mẹo', 'Vật lý'],
    role: UserRole.STUDENT,
    category: 'Vật lý',
    isPublic: true,
    createdAt: Date.now()
  },
  {
    id: 'phys-gen-08',
    title: 'Cơ chế hoạt động máy móc',
    description: 'Vật lý trong kỹ thuật.',
    content: 'Giải thích nguyên lý hoạt động vật lý của thiết bị: "[Tên thiết bị, VD: Tủ lạnh / Động cơ đốt trong / Cáp quang]". Vẽ sơ đồ tư duy mô tả quá trình chuyển hóa năng lượng.',
    tags: ['Ứng dụng', 'Kỹ thuật', 'Vật lý'],
    role: UserRole.STUDENT,
    category: 'Vật lý',
    isPublic: true,
    createdAt: Date.now()
  },
  {
    id: 'phys-gen-09',
    title: 'Lịch sử khám phá Vật lý',
    description: 'Câu chuyện về các nhà khoa học.',
    content: 'Kể lại câu chuyện lịch sử về cách mà nhà bác học "[Tên nhà bác học]" đã phát hiện ra "[Định luật/Hiện tượng]". Bài học về tư duy khoa học rút ra là gì?',
    tags: ['Lịch sử', 'Khoa học', 'Vật lý'],
    role: UserRole.STUDENT,
    category: 'Vật lý',
    isPublic: true,
    createdAt: Date.now()
  },
  {
    id: 'phys-gen-10',
    title: 'Thần chú ghi nhớ (Mnemonic)',
    description: 'Mẹo nhớ công thức/quy tắc.',
    content: 'Hãy sáng tạo một câu thần chú, bài thơ hoặc phương pháp Mnemonic vui nhộn để giúp tôi ghi nhớ: "[Quy tắc/Công thức, VD: Quy tắc bàn tay trái / Dãy điện hóa]".',
    tags: ['Ghi nhớ', 'Mẹo', 'Vật lý'],
    role: UserRole.STUDENT,
    category: 'Vật lý',
    isPublic: true,
    createdAt: Date.now()
  },

  // =================================================================
  // 3. HÓA HỌC (CHEMISTRY)
  // =================================================================
  {
    id: 'chem-gen-01',
    title: 'Cân bằng & Giải thích phản ứng',
    description: 'Hiểu rõ bản chất phản ứng hóa học.',
    content: 'Cho sơ đồ phản ứng sau: "[Các chất tham gia -> Các chất sản phẩm]".\n1. Cân bằng phương trình hóa học.\n2. Cho biết điều kiện phản ứng (nếu có).\n3. Giải thích hiện tượng quan sát được (màu sắc, kết tủa, khí bay ra...).',
    tags: ['Phản ứng', 'Cân bằng', 'Hóa học'],
    role: UserRole.STUDENT,
    category: 'Hóa học',
    isPublic: true,
    createdAt: Date.now()
  },
  {
    id: 'chem-gen-02',
    title: 'Nhận biết hóa chất',
    description: 'Phương pháp nhận biết các chất.',
    content: 'Tôi có các lọ mất nhãn đựng các dung dịch: "[Danh sách chất]". Hãy trình bày sơ đồ/phương pháp hóa học để nhận biết từng chất. Chỉ dùng tối thiểu hóa chất thuốc thử.',
    tags: ['Nhận biết', 'Thí nghiệm', 'Hóa học'],
    role: UserRole.STUDENT,
    category: 'Hóa học',
    isPublic: true,
    createdAt: Date.now()
  },
  {
    id: 'chem-gen-03',
    title: 'Chuỗi biến hóa (Sơ đồ phản ứng)',
    description: 'Viết phương trình cho chuỗi phản ứng.',
    content: 'Hãy viết các phương trình hóa học cho dãy chuyển hóa sau: "[Chất A -> Chất B -> Chất C...]". Ghi rõ điều kiện xúc tác, nhiệt độ cho từng phản ứng.',
    tags: ['Chuỗi phản ứng', 'Hóa học'],
    role: UserRole.STUDENT,
    category: 'Hóa học',
    isPublic: true,
    createdAt: Date.now()
  },
  {
    id: 'chem-gen-04',
    title: 'Tính toán theo phương trình',
    description: 'Giải bài toán Mol, nồng độ.',
    content: 'Hướng dẫn giải bài toán hóa học sau: "[Dán đề bài]". Hãy tính số mol các chất, xác định chất dư/hết và tính toán kết quả cuối cùng.',
    tags: ['Tính toán', 'Mol', 'Hóa học'],
    role: UserRole.STUDENT,
    category: 'Hóa học',
    isPublic: true,
    createdAt: Date.now()
  },
  {
    id: 'chem-gen-05',
    title: 'Hồ sơ nguyên tố',
    description: 'Tra cứu thông tin nguyên tố.',
    content: 'Cung cấp thông tin chi tiết về nguyên tố "[Tên nguyên tố]".\n- Vị trí trong bảng tuần hoàn.\n- Cấu hình electron.\n- Tính chất hóa học đặc trưng.\n- Ứng dụng quan trọng trong đời sống.',
    tags: ['Nguyên tố', 'Bảng tuần hoàn', 'Hóa học'],
    role: UserRole.STUDENT,
    category: 'Hóa học',
    isPublic: true,
    createdAt: Date.now()
  },
  {
    id: 'chem-gen-06',
    title: 'Gọi tên hợp chất (IUPAC)',
    description: 'Quy tắc gọi tên Hóa hữu cơ/vô cơ.',
    content: 'Hãy hướng dẫn tôi cách gọi tên theo danh pháp IUPAC cho hợp chất có công thức: "[Công thức cấu tạo/phân tử]". Giải thích chi tiết các quy tắc đánh số mạch và ưu tiên nhóm chức.',
    tags: ['Danh pháp', 'Hữu cơ', 'Hóa học'],
    role: UserRole.STUDENT,
    category: 'Hóa học',
    isPublic: true,
    createdAt: Date.now()
  },
  {
    id: 'chem-gen-07',
    title: 'An toàn phòng thí nghiệm',
    description: 'Quy tắc an toàn khi thực hành.',
    content: 'Tôi chuẩn bị làm thí nghiệm với các hóa chất: "[Danh sách hóa chất]".\nHãy liệt kê các nguy cơ tiềm ẩn (cháy nổ, ăn mòn, độc hại) và các biện pháp an toàn/sơ cứu cần thiết.',
    tags: ['An toàn', 'Thí nghiệm', 'Hóa học'],
    role: UserRole.STUDENT,
    category: 'Hóa học',
    isPublic: true,
    createdAt: Date.now()
  },
  {
    id: 'chem-gen-08',
    title: 'Cơ chế phản ứng hữu cơ',
    description: 'Mô tả sự dịch chuyển electron.',
    content: 'Hãy giải thích cơ chế của phản ứng: "[Tên phản ứng, VD: Thế halogen vào ankan / Cộng HBr vào anken]". Mô tả từng bước (khơi mào, phát triển mạch...) và sự dịch chuyển của electron.',
    tags: ['Cơ chế', 'Hữu cơ', 'Hóa học'],
    role: UserRole.STUDENT,
    category: 'Hóa học',
    isPublic: true,
    createdAt: Date.now()
  },
  {
    id: 'chem-gen-09',
    title: 'Hóa học đời sống',
    description: 'Giải thích hiện tượng thường ngày.',
    content: 'Giải thích bản chất hóa học của hiện tượng đời sống: "[Hiện tượng, VD: Tại sao cắt hành bị cay mắt? / Bột nở làm bánh phồng lên như thế nào?]". Viết phương trình minh họa nếu có.',
    tags: ['Đời sống', 'Thực tế', 'Hóa học'],
    role: UserRole.STUDENT,
    category: 'Hóa học',
    isPublic: true,
    createdAt: Date.now()
  },
  {
    id: 'chem-gen-10',
    title: 'Hình học phân tử (VSEPR)',
    description: 'Dự đoán cấu trúc không gian.',
    content: 'Sử dụng mô hình VSEPR, hãy dự đoán và mô tả hình học phân tử của chất: "[Công thức, VD: NH3 / H2O / CO2]". Xác định góc liên kết và trạng thái lai hóa của nguyên tử trung tâm.',
    tags: ['Cấu trúc', 'Lý thuyết', 'Hóa học'],
    role: UserRole.STUDENT,
    category: 'Hóa học',
    isPublic: true,
    createdAt: Date.now()
  },

  // =================================================================
  // 4. NGỮ VĂN (LITERATURE)
  // =================================================================
  {
    id: 'lit-gen-01',
    title: 'Lập dàn ý bài văn',
    description: 'Xây dựng khung sườn cho bài viết.',
    content: 'Hãy lập dàn ý chi tiết (Mở bài, Thân bài - các luận điểm chính, Kết bài) cho đề bài: "[Nhập đề bài văn học hoặc nghị luận xã hội]". Đưa ra các dẫn chứng gợi ý cho mỗi luận điểm.',
    tags: ['Dàn ý', 'Làm văn', 'Ngữ văn'],
    role: UserRole.STUDENT,
    category: 'Ngữ văn',
    isPublic: true,
    createdAt: Date.now()
  },
  {
    id: 'lit-gen-02',
    title: 'Phân tích nhân vật/Chi tiết',
    description: 'Đào sâu tâm lý và nghệ thuật.',
    content: 'Phân tích nhân vật/chi tiết "[Tên nhân vật/chi tiết]" trong tác phẩm "[Tên tác phẩm]". Tập trung vào: Đặc điểm ngoại hình, tính cách, diễn biến tâm trạng và ý nghĩa nghệ thuật mà tác giả gửi gắm.',
    tags: ['Phân tích', 'Văn học', 'Ngữ văn'],
    role: UserRole.STUDENT,
    category: 'Ngữ văn',
    isPublic: true,
    createdAt: Date.now()
  },
  {
    id: 'lit-gen-03',
    title: 'Tìm ý tưởng Nghị luận xã hội',
    description: 'Brainstorming cho bài viết.',
    content: 'Với chủ đề nghị luận xã hội: "[Chủ đề, ví dụ: Bạo lực học đường / Sống xanh]", hãy gợi ý cho tôi:\n1. Giải thích từ khóa.\n2. Thực trạng hiện nay.\n3. Nguyên nhân & Hậu quả.\n4. Giải pháp thiết thực.\n5. Dẫn chứng thực tế.',
    tags: ['Nghị luận', 'Ý tưởng', 'Ngữ văn'],
    role: UserRole.STUDENT,
    category: 'Ngữ văn',
    isPublic: true,
    createdAt: Date.now()
  },
  {
    id: 'lit-gen-04',
    title: 'Nâng cấp diễn đạt',
    description: 'Sửa lỗi và làm hay hơn.',
    content: 'Dưới đây là một đoạn văn tôi viết: "[Dán đoạn văn]".\nHãy giúp tôi:\n1. Chỉ ra các lỗi diễn đạt, lặp từ (nếu có).\n2. Viết lại đoạn văn đó sao cho văn phong mượt mà, giàu hình ảnh và cảm xúc hơn, nhưng vẫn giữ nguyên ý chính.',
    tags: ['Biên tập', 'Viết lách', 'Ngữ văn'],
    role: UserRole.STUDENT,
    category: 'Ngữ văn',
    isPublic: true,
    createdAt: Date.now()
  },
  {
    id: 'lit-gen-05',
    title: 'So sánh văn học',
    description: 'Liên hệ giữa các tác phẩm.',
    content: 'So sánh điểm giống và khác nhau giữa hai tác phẩm/nhân vật: "[A]" và "[B]" về mặt nội dung (tư tưởng, chủ đề) và nghệ thuật (phong cách, bút pháp).',
    tags: ['So sánh', 'Nâng cao', 'Ngữ văn'],
    role: UserRole.STUDENT,
    category: 'Ngữ văn',
    isPublic: true,
    createdAt: Date.now()
  },
  {
    id: 'lit-gen-06',
    title: 'Viết sáng tạo (Kết thúc khác)',
    description: 'Phát huy trí tưởng tượng.',
    content: 'Hãy tưởng tượng và viết lại một cái kết khác cho tác phẩm "[Tên tác phẩm]" theo hướng "[Hướng thay đổi, VD: bi kịch hơn / hạnh phúc hơn]". Đảm bảo vẫn giữ được tính cách nhân vật cốt lõi.',
    tags: ['Sáng tạo', 'Viết lách', 'Ngữ văn'],
    role: UserRole.STUDENT,
    category: 'Ngữ văn',
    isPublic: true,
    createdAt: Date.now()
  },
  {
    id: 'lit-gen-07',
    title: 'Phân tích Thơ ca',
    description: 'Cảm thụ vẻ đẹp ngôn từ.',
    content: 'Phân tích đoạn thơ sau: "[Dán đoạn thơ]".\nChú ý đến: Thể thơ, nhịp điệu, các biện pháp tu từ (ẩn dụ, hoán dụ...), hình ảnh thơ và cảm xúc chủ đạo của tác giả.',
    tags: ['Thơ', 'Cảm thụ', 'Ngữ văn'],
    role: UserRole.STUDENT,
    category: 'Ngữ văn',
    isPublic: true,
    createdAt: Date.now()
  },
  {
    id: 'lit-gen-08',
    title: 'Bối cảnh sáng tác & Tác giả',
    description: 'Hiểu rõ xuất xứ tác phẩm.',
    content: 'Cung cấp thông tin về tác giả "[Tên tác giả]" và hoàn cảnh ra đời của tác phẩm "[Tên tác phẩm]". Những yếu tố lịch sử/xã hội lúc đó đã ảnh hưởng như thế nào đến nội dung tác phẩm?',
    tags: ['Kiến thức', 'Tiểu sử', 'Ngữ văn'],
    role: UserRole.STUDENT,
    category: 'Ngữ văn',
    isPublic: true,
    createdAt: Date.now()
  },
  {
    id: 'lit-gen-09',
    title: 'Lập luận phản biện',
    description: 'Rèn luyện tư duy tranh biện.',
    content: 'Với quan điểm: "[Quan điểm, VD: Hạnh phúc nằm ở đích đến chứ không phải hành trình]", hãy giúp tôi xây dựng các luận điểm để PHẢN BÁC lại quan điểm này một cách thuyết phục.',
    tags: ['Phản biện', 'Tư duy', 'Ngữ văn'],
    role: UserRole.STUDENT,
    category: 'Ngữ văn',
    isPublic: true,
    createdAt: Date.now()
  },
  {
    id: 'lit-gen-10',
    title: 'Phân tích Giọng điệu (Tone)',
    description: 'Nhận diện thái độ tác giả.',
    content: 'Đọc đoạn văn sau: "[Dán đoạn văn]".\nHãy xác định giọng điệu chủ đạo (mỉa mai, bi thương, trang trọng, hài hước...) và chỉ ra những từ ngữ/câu văn tạo nên giọng điệu đó.',
    tags: ['Phân tích', 'Kỹ năng', 'Ngữ văn'],
    role: UserRole.STUDENT,
    category: 'Ngữ văn',
    isPublic: true,
    createdAt: Date.now()
  },

  // =================================================================
  // 5. LỊCH SỬ (HISTORY)
  // =================================================================
  {
    id: 'hist-gen-01',
    title: 'Tóm tắt sự kiện (5W1H)',
    description: 'Nắm bắt cốt lõi sự kiện lịch sử.',
    content: 'Hãy tóm tắt sự kiện lịch sử: "[Tên sự kiện]" theo mô hình 5W1H:\n- What (Sự kiện gì?)\n- When (Khi nào?)\n- Where (Ở đâu?)\n- Who (Ai tham gia/Lãnh đạo?)\n- Why (Tại sao xảy ra?)\n- How (Diễn biến chính và Kết quả).',
    tags: ['Tóm tắt', 'Sự kiện', 'Lịch sử'],
    role: UserRole.STUDENT,
    category: 'Lịch sử',
    isPublic: true,
    createdAt: Date.now()
  },
  {
    id: 'hist-gen-02',
    title: 'Phân tích Nguyên nhân - Hệ quả',
    description: 'Tư duy biện chứng lịch sử.',
    content: 'Phân tích nguyên nhân sâu xa và nguyên nhân trực tiếp dẫn đến "[Sự kiện/Cuộc chiến]". Sự kiện này đã để lại hệ quả/ý nghĩa lịch sử gì đối với quốc gia và thế giới?',
    tags: ['Phân tích', 'Tư duy', 'Lịch sử'],
    role: UserRole.STUDENT,
    category: 'Lịch sử',
    isPublic: true,
    createdAt: Date.now()
  },
  {
    id: 'hist-gen-03',
    title: 'Đánh giá nhân vật lịch sử',
    description: 'Góc nhìn đa chiều.',
    content: 'Đưa ra đánh giá khách quan về nhân vật "[Tên nhân vật]".\n- Vai trò của họ trong giai đoạn lịch sử đó.\n- Công lao chính.\n- Những hạn chế hoặc sai lầm (nếu có).\n- Bài học rút ra.',
    tags: ['Nhân vật', 'Đánh giá', 'Lịch sử'],
    role: UserRole.STUDENT,
    category: 'Lịch sử',
    isPublic: true,
    createdAt: Date.now()
  },
  {
    id: 'hist-gen-04',
    title: 'Lập trục thời gian (Timeline)',
    description: 'Hệ thống hóa tiến trình lịch sử.',
    content: 'Hãy lập trục thời gian (Timeline) liệt kê các mốc sự kiện quan trọng nhất trong giai đoạn "[Giai đoạn lịch sử, ví dụ: 1945 - 1975]". Với mỗi mốc, hãy ghi chú ngắn gọn sự kiện chính.',
    tags: ['Niên biểu', 'Tổng hợp', 'Lịch sử'],
    role: UserRole.STUDENT,
    category: 'Lịch sử',
    isPublic: true,
    createdAt: Date.now()
  },
  {
    id: 'hist-gen-05',
    title: 'So sánh lịch sử',
    description: 'Đối chiếu các sự kiện/phong trào.',
    content: 'Lập bảng so sánh giữa "[Sự kiện/Phong trào A]" và "[Sự kiện/Phong trào B]" về các tiêu chí: Hoàn cảnh lịch sử, Mục tiêu, Lãnh đạo, Hình thức đấu tranh, và Kết quả.',
    tags: ['So sánh', 'Lịch sử'],
    role: UserRole.STUDENT,
    category: 'Lịch sử',
    isPublic: true,
    createdAt: Date.now()
  },
  {
    id: 'hist-gen-06',
    title: 'Giả định lịch sử (What If)',
    description: 'Phát triển tư duy phản biện.',
    content: 'Hãy đặt giả thuyết: Điều gì sẽ xảy ra nếu sự kiện "[Sự kiện, VD: Nhật Bản không đầu hàng năm 1945]" diễn ra khác đi? Phân tích các kịch bản có thể thay đổi cục diện thế giới.',
    tags: ['Giả định', 'Tư duy', 'Lịch sử'],
    role: UserRole.STUDENT,
    category: 'Lịch sử',
    isPublic: true,
    createdAt: Date.now()
  },
  {
    id: 'hist-gen-07',
    title: 'Phân tích Tư liệu gốc',
    description: 'Đọc hiểu văn bản lịch sử.',
    content: 'Dưới đây là một đoạn trích từ văn bản lịch sử (Tuyên ngôn/Hiệp định...): "[Dán đoạn trích]".\nHãy phân tích ý nghĩa của đoạn này trong bối cảnh lịch sử lúc đó. Tác giả muốn gửi gắm thông điệp gì?',
    tags: ['Tư liệu', 'Phân tích', 'Lịch sử'],
    role: UserRole.STUDENT,
    category: 'Lịch sử',
    isPublic: true,
    createdAt: Date.now()
  },
  {
    id: 'hist-gen-08',
    title: 'Đời sống văn hóa',
    description: 'Lịch sử văn hóa xã hội.',
    content: 'Mô tả đời sống hàng ngày (trang phục, ẩm thực, nhà ở, phong tục) của người dân [Quốc gia/Vùng] trong thời kỳ [Giai đoạn lịch sử].',
    tags: ['Văn hóa', 'Đời sống', 'Lịch sử'],
    role: UserRole.STUDENT,
    category: 'Lịch sử',
    isPublic: true,
    createdAt: Date.now()
  },
  {
    id: 'hist-gen-09',
    title: 'Bài học từ quá khứ',
    description: 'Liên hệ thực tiễn.',
    content: 'Từ sự kiện "[Sự kiện lịch sử]", chúng ta có thể rút ra những bài học kinh nghiệm gì cho việc giải quyết các vấn đề hiện nay (như xung đột, ngoại giao, phát triển kinh tế)?',
    tags: ['Bài học', 'Liên hệ', 'Lịch sử'],
    role: UserRole.STUDENT,
    category: 'Lịch sử',
    isPublic: true,
    createdAt: Date.now()
  },
  {
    id: 'hist-gen-10',
    title: 'Tranh biện lịch sử',
    description: 'Góc nhìn đa chiều về vấn đề tranh cãi.',
    content: 'Về vấn đề "[Vấn đề tranh cãi, VD: Công và tội của nhân vật X]", hãy trình bày các luồng quan điểm khác nhau của các nhà sử học và đưa ra lập luận cho từng quan điểm.',
    tags: ['Tranh biện', 'Đa chiều', 'Lịch sử'],
    role: UserRole.STUDENT,
    category: 'Lịch sử',
    isPublic: true,
    createdAt: Date.now()
  },

  // =================================================================
  // 6. ĐỊA LÝ (GEOGRAPHY)
  // =================================================================
  {
    id: 'geo-gen-01',
    title: 'Giải thích hiện tượng Địa lý',
    description: 'Tại sao Trái đất lại như vậy?',
    content: 'Giải thích nguyên nhân hình thành hiện tượng/đặc điểm địa lý: "[Ví dụ: Gió mùa / Địa hình Karst / Đô thị hóa]". Nêu tác động của nó đến đời sống và sản xuất.',
    tags: ['Tự nhiên', 'Hiện tượng', 'Địa lý'],
    role: UserRole.STUDENT,
    category: 'Địa lý',
    isPublic: true,
    createdAt: Date.now()
  },
  {
    id: 'geo-gen-02',
    title: 'Phân tích thế mạnh vùng',
    description: 'Địa lý kinh tế xã hội.',
    content: 'Phân tích các điều kiện phát triển kinh tế của vùng "[Tên vùng/Quốc gia]".\n- Điều kiện tự nhiên (Vị trí, tài nguyên...)\n- Điều kiện kinh tế - xã hội (Dân cư, hạ tầng...)\n- Các ngành kinh tế mũi nhọn.',
    tags: ['Kinh tế', 'Vùng miền', 'Địa lý'],
    role: UserRole.STUDENT,
    category: 'Địa lý',
    isPublic: true,
    createdAt: Date.now()
  },
  {
    id: 'geo-gen-03',
    title: 'Kỹ năng biểu đồ',
    description: 'Nhận xét và phân tích số liệu.',
    content: 'Dựa vào bảng số liệu sau: "[Dán số liệu/Mô tả biểu đồ]".\n1. Hãy nhận xét về xu hướng thay đổi/cơ cấu.\n2. Giải thích nguyên nhân của sự thay đổi đó.',
    tags: ['Biểu đồ', 'Kỹ năng', 'Địa lý'],
    role: UserRole.STUDENT,
    category: 'Địa lý',
    isPublic: true,
    createdAt: Date.now()
  },
  {
    id: 'geo-gen-04',
    title: 'Mối quan hệ Nhân - Quả',
    description: 'Tác động qua lại giữa các yếu tố.',
    content: 'Phân tích mối quan hệ giữa nhân tố "[Nhân tố A, ví dụ: Khí hậu]" và "[Nhân tố B, ví dụ: Sông ngòi / Nông nghiệp]" tại khu vực [Địa điểm].',
    tags: ['Phân tích', 'Tư duy', 'Địa lý'],
    role: UserRole.STUDENT,
    category: 'Địa lý',
    isPublic: true,
    createdAt: Date.now()
  },
  {
    id: 'geo-gen-05',
    title: 'So sánh địa lý',
    description: 'So sánh các vùng miền/quốc gia.',
    content: 'So sánh đặc điểm [Tự nhiên/Kinh tế] của hai khu vực "[Vùng A]" and "[Vùng B]". Chỉ ra những điểm giống nhau cơ bản và những sự khác biệt nổi bật.',
    tags: ['So sánh', 'Địa lý'],
    role: UserRole.STUDENT,
    category: 'Địa lý',
    isPublic: true,
    createdAt: Date.now()
  },
  {
    id: 'geo-gen-06',
    title: 'Biến đổi khí hậu',
    description: 'Tác động môi trường.',
    content: 'Phân tích các biểu hiện và tác động cụ thể của biến đổi khí hậu đối với khu vực "[Tên khu vực, VD: Đồng bằng sông Cửu Long]". Đề xuất các giải pháp thích ứng phù hợp.',
    tags: ['Môi trường', 'Thời sự', 'Địa lý'],
    role: UserRole.STUDENT,
    category: 'Địa lý',
    isPublic: true,
    createdAt: Date.now()
  },
  {
    id: 'geo-gen-07',
    title: 'Quy hoạch đô thị',
    description: 'Tư duy không gian.',
    content: 'Nếu bạn là nhà quy hoạch, hãy đề xuất phương án phát triển cho đô thị "[Tên thành phố]". Cân nhắc các yếu tố: Giao thông, Môi trường, Khu dân cư và Khu công nghiệp.',
    tags: ['Quy hoạch', 'Sáng tạo', 'Địa lý'],
    role: UserRole.STUDENT,
    category: 'Địa lý',
    isPublic: true,
    createdAt: Date.now()
  },
  {
    id: 'geo-gen-08',
    title: 'Tháp dân số',
    description: 'Phân tích dân cư.',
    content: 'Dựa vào mô tả tháp dân số của [Quốc gia] năm [Năm]: "[Mô tả hình dạng tháp]". Hãy phân tích cơ cấu dân số (già/trẻ), tỷ lệ phụ thuộc và dự đoán xu hướng nguồn lao động trong tương lai.',
    tags: ['Dân số', 'Phân tích', 'Địa lý'],
    role: UserRole.STUDENT,
    category: 'Địa lý',
    isPublic: true,
    createdAt: Date.now()
  },
  {
    id: 'geo-gen-09',
    title: 'Địa lý văn hóa du lịch',
    description: 'Khám phá vùng đất.',
    content: 'Hãy thiết kế một tour du lịch 3 ngày 2 đêm tại "[Địa điểm]". Giới thiệu các địa danh nổi bật về địa chất, sinh thái và văn hóa bản địa độc đáo cần trải nghiệm.',
    tags: ['Du lịch', 'Văn hóa', 'Địa lý'],
    role: UserRole.STUDENT,
    category: 'Địa lý',
    isPublic: true,
    createdAt: Date.now()
  },
  {
    id: 'geo-gen-10',
    title: 'Phát triển bền vững',
    description: 'Giải pháp kinh tế xanh.',
    content: 'Đề xuất các mô hình kinh tế (nông nghiệp/công nghiệp) phù hợp với điều kiện tự nhiên của vùng "[Tên vùng]" để đảm bảo phát triển bền vững và bảo vệ môi trường.',
    tags: ['Kinh tế', 'Bền vững', 'Địa lý'],
    role: UserRole.STUDENT,
    category: 'Địa lý',
    isPublic: true,
    createdAt: Date.now()
  },

  // =================================================================
  // 7. TIẾNG ANH (ENGLISH)
  // =================================================================
  {
    id: 'eng-gen-01',
    title: 'Kiểm tra & Giải thích ngữ pháp',
    description: 'Grammar checker.',
    content: 'Hãy kiểm tra lỗi ngữ pháp cho câu/đoạn văn sau: "[Paste text]".\n1. Chỉ ra lỗi sai.\n2. Sửa lại cho đúng.\n3. Giải thích quy tắc ngữ pháp liên quan để tôi ghi nhớ.',
    tags: ['Grammar', 'Sửa lỗi', 'Tiếng Anh'],
    role: UserRole.STUDENT,
    category: 'Tiếng Anh',
    isPublic: true,
    createdAt: Date.now()
  },
  {
    id: 'eng-gen-02',
    title: 'Nâng cấp từ vựng (Paraphrasing)',
    description: 'Viết lại câu hay hơn.',
    content: 'Tôi muốn diễn đạt ý: "[Câu tiếng Việt hoặc tiếng Anh đơn giản]" một cách tự nhiên và nâng cao hơn (Academic/Formal). Hãy gợi ý 3 cách diễn đạt khác nhau (Paraphrase) và giải thích sắc thái của từng cách.',
    tags: ['Vocabulary', 'Writing', 'Tiếng Anh'],
    role: UserRole.STUDENT,
    category: 'Tiếng Anh',
    isPublic: true,
    createdAt: Date.now()
  },
  {
    id: 'eng-gen-03',
    title: 'Luyện hội thoại (Roleplay)',
    description: 'Đối thoại theo tình huống.',
    content: 'Hãy đóng vai [Nhân vật A] và tôi là [Nhân vật B]. Chúng ta hãy thực hành hội thoại về chủ đề "[Chủ đề]". Bạn hãy bắt đầu trước bằng một câu hỏi.',
    tags: ['Speaking', 'Giao tiếp', 'Tiếng Anh'],
    role: UserRole.STUDENT,
    category: 'Tiếng Anh',
    isPublic: true,
    createdAt: Date.now()
  },
  {
    id: 'eng-gen-04',
    title: 'Chấm bài viết (Writing Feedback)',
    description: 'Đánh giá bài luận.',
    content: 'Đóng vai giám khảo IELTS/TOEFL. Hãy chấm điểm và nhận xét chi tiết cho bài viết sau của tôi về chủ đề "[Topic]". Đưa ra gợi ý cụ thể về từ vựng (Lexical Resource) và ngữ pháp (Grammar) để nâng cao điểm số.\n\nBài viết: [Dán bài viết]',
    tags: ['Writing', 'Chấm bài', 'Tiếng Anh'],
    role: UserRole.STUDENT,
    category: 'Tiếng Anh',
    isPublic: true,
    createdAt: Date.now()
  },
  {
    id: 'eng-gen-05',
    title: 'Giải thích từ vựng/Thành ngữ',
    description: 'Học từ sâu sắc.',
    content: 'Giải thích nghĩa của từ/thành ngữ: "[Word/Idiom]".\n1. Định nghĩa tiếng Anh & tiếng Việt.\n2. Phiên âm & Cách phát âm.\n3. Ba ví dụ đặt câu trong các ngữ cảnh khác nhau.',
    tags: ['Vocabulary', 'Học từ', 'Tiếng Anh'],
    role: UserRole.STUDENT,
    category: 'Tiếng Anh',
    isPublic: true,
    createdAt: Date.now()
  },
  {
    id: 'eng-gen-06',
    title: 'Thành ngữ & Cụm từ (Collocations)',
    description: 'Sử dụng từ tự nhiên.',
    content: 'Hãy liệt kê 5-10 collocations (cụm từ cố định) và Idioms (thành ngữ) thông dụng liên quan đến chủ đề "[Chủ đề, VD: Environment / Technology]". Đặt câu ví dụ cho mỗi cụm từ.',
    tags: ['Collocations', 'Idioms', 'Tiếng Anh'],
    role: UserRole.STUDENT,
    category: 'Tiếng Anh',
    isPublic: true,
    createdAt: Date.now()
  },
  {
    id: 'eng-gen-07',
    title: 'Luyện Đọc hiểu (Reading)',
    description: 'Tạo bài tập đọc.',
    content: 'Hãy tạo một đoạn văn ngắn (khoảng 150-200 từ) về chủ đề "[Chủ đề]" ở trình độ [CEFR Level, VD: B1/B2]. Sau đó, tạo 3 câu hỏi đọc hiểu trắc nghiệm (Multiple choice) và 1 câu hỏi suy luận.',
    tags: ['Reading', 'Luyện tập', 'Tiếng Anh'],
    role: UserRole.STUDENT,
    category: 'Tiếng Anh',
    isPublic: true,
    createdAt: Date.now()
  },
  {
    id: 'eng-gen-08',
    title: 'Tiếng Anh Công sở/Email',
    description: 'Giao tiếp trang trọng.',
    content: 'Hãy giúp tôi viết một email trang trọng (Formal) gửi cho [Đối tượng, VD: Giáo sư / Khách hàng] để [Mục đích, VD: Xin gia hạn nộp bài / Chào hàng]. Sử dụng ngôn ngữ chuyên nghiệp và lịch sự.',
    tags: ['Business', 'Email', 'Tiếng Anh'],
    role: UserRole.STUDENT,
    category: 'Tiếng Anh',
    isPublic: true,
    createdAt: Date.now()
  },
  {
    id: 'eng-gen-09',
    title: 'Hướng dẫn Phát âm (IPA)',
    description: 'Chuẩn hóa phát âm.',
    content: 'Hãy cung cấp phiên âm IPA và hướng dẫn chi tiết cách đặt lưỡi/môi để phát âm đúng từ: "[Từ khó]". Chỉ ra trọng âm và các lỗi phát âm người Việt thường gặp với từ này.',
    tags: ['Speaking', 'Phát âm', 'Tiếng Anh'],
    role: UserRole.STUDENT,
    category: 'Tiếng Anh',
    isPublic: true,
    createdAt: Date.now()
  },
  {
    id: 'eng-gen-10',
    title: 'Sắc thái dịch thuật',
    description: 'Hiểu sâu sự khác biệt ngôn ngữ.',
    content: 'Hãy dịch câu sau sang tiếng Anh theo 2 cách: (1) Dịch sát nghĩa (Literal) và (2) Dịch thoát ý tự nhiên (Natural). Giải thích sự khác biệt về sắc thái ý nghĩa.\nCâu: "[Câu tiếng Việt]"',
    tags: ['Dịch thuật', 'Kỹ năng', 'Tiếng Anh'],
    role: UserRole.STUDENT,
    category: 'Tiếng Anh',
    isPublic: true,
    createdAt: Date.now()
  },

  // =================================================================
  // 8. LẬP TRÌNH (PROGRAMMING / IT)
  // =================================================================
  {
    id: 'it-gen-01',
    title: 'Tìm lỗi (Debug) Code',
    description: 'Sửa lỗi chương trình.',
    content: 'Đoạn code sau của tôi đang bị lỗi hoặc chạy không đúng mong muốn. Hãy giúp tôi:\n1. Chỉ ra dòng bị lỗi.\n2. Giải thích nguyên nhân.\n3. Cung cấp đoạn code đã sửa.\n\nCode: [Dán code vào đây]',
    tags: ['Debug', 'Sửa lỗi', 'Lập trình'],
    role: UserRole.STUDENT,
    category: 'Lập trình',
    isPublic: true,
    createdAt: Date.now()
  },
  {
    id: 'it-gen-02',
    title: 'Giải thích Code',
    description: 'Hiểu logic từng dòng lệnh.',
    content: 'Hãy giải thích chức năng của đoạn code sau theo từng dòng (line-by-line). Giải thích logic tổng thể của thuật toán này là gì?\n\nCode: [Dán code vào đây]',
    tags: ['Giải thích', 'Học code', 'Lập trình'],
    role: UserRole.STUDENT,
    category: 'Lập trình',
    isPublic: true,
    createdAt: Date.now()
  },
  {
    id: 'it-gen-03',
    title: 'Tối ưu hóa (Refactor)',
    description: 'Viết code sạch và nhanh hơn.',
    content: 'Hãy xem xét đoạn code sau và tối ưu hóa nó (Refactor) để:\n- Chạy nhanh hơn (Hiệu năng).\n- Dễ đọc hơn (Clean Code).\n- Tuân thủ các nguyên tắc như DRY hoặc SOLID.\n\nCode: [Dán code]',
    tags: ['Clean Code', 'Tối ưu', 'Lập trình'],
    role: UserRole.STUDENT,
    category: 'Lập trình',
    isPublic: true,
    createdAt: Date.now()
  },
  {
    id: 'it-gen-04',
    title: 'Viết Test Case',
    description: 'Kiểm thử phần mềm.',
    content: 'Hãy viết các trường hợp kiểm thử (Unit Test Cases) cho hàm/chức năng sau: "[Mô tả chức năng]". Bao gồm cả các trường hợp bình thường (Happy path) và các trường hợp biên/ngoại lệ (Edge cases).',
    tags: ['Testing', 'QA', 'Lập trình'],
    role: UserRole.STUDENT,
    category: 'Lập trình',
    isPublic: true,
    createdAt: Date.now()
  },
  {
    id: 'it-gen-05',
    title: 'Truy vấn SQL',
    description: 'Làm việc với cơ sở dữ liệu.',
    content: 'Tôi có các bảng dữ liệu: [Mô tả bảng: Users(id, name), Orders(id, user_id, amount)...].\nHãy viết câu lệnh SQL để thực hiện yêu cầu: "[Yêu cầu, VD: Lấy top 5 khách hàng chi tiêu nhiều nhất]".',
    tags: ['SQL', 'Database', 'Lập trình'],
    role: UserRole.STUDENT,
    category: 'Lập trình',
    isPublic: true,
    createdAt: Date.now()
  },
  {
    id: 'it-gen-06',
    title: 'Giải thích Thuật toán',
    description: 'Hiểu sâu về cấu trúc dữ liệu.',
    content: 'Hãy giải thích cách hoạt động của thuật toán "[Tên thuật toán, VD: Quick Sort / Dijkstra]". Sử dụng ví dụ minh họa từng bước và phân tích độ phức tạp thời gian (Big O).',
    tags: ['Thuật toán', 'CS', 'Lập trình'],
    role: UserRole.STUDENT,
    category: 'Lập trình',
    isPublic: true,
    createdAt: Date.now()
  },

  // =================================================================
  // 9. DÀNH CHO GIÁO VIÊN (FOR TEACHERS)
  // =================================================================
  {
    id: 'teach-gen-01',
    title: 'Soạn giáo án 5E',
    description: 'Thiết kế bài giảng khoa học, lôi cuốn.',
    content: 'Hãy giúp tôi soạn một giáo án cho môn [Môn học], lớp [Lớp], bài "[Tên bài học]" theo mô hình 5E (Gắn kết, Khám phá, Giải thích, Áp dụng, Đánh giá). Mục tiêu là giúp học sinh hiểu sâu về [Khái niệm cốt lõi].',
    tags: ['Giáo án', '5E', 'Giáo viên'],
    role: UserRole.TEACHER,
    category: 'Tổng hợp',
    isPublic: true,
    createdAt: Date.now()
  },
  {
    id: 'teach-gen-02',
    title: 'Xây dựng Rubric chấm điểm',
    description: 'Tiêu chí đánh giá minh bạch.',
    content: 'Hãy tạo một bảng Rubric chấm điểm chi tiết cho bài tập/dự án: "[Tên bài tập]". Bao gồm 4 mức độ đánh giá (Giỏi, Khá, Trung bình, Yếu) với các tiêu chí cụ thể về: Nội dung, Hình thức, Sáng tạo và Thuyết trình.',
    tags: ['Đánh giá', 'Rubric', 'Giáo viên'],
    role: UserRole.TEACHER,
    category: 'Tổng hợp',
    isPublic: true,
    createdAt: Date.now()
  },
  {
    id: 'teach-gen-03',
    title: 'Tạo đề kiểm tra trắc nghiệm',
    description: 'Ngân hàng câu hỏi tự động.',
    content: 'Hãy tạo [Số lượng] câu hỏi trắc nghiệm khách quan (4 lựa chọn A,B,C,D) về chủ đề "[Chủ đề]" cho học sinh lớp [Lớp]. Bao gồm đáp án và giải thích ngắn gọn cho từng câu. Đảm bảo có cả câu hỏi nhận biết, thông hiểu và vận dụng.',
    tags: ['Đề thi', 'Kiểm tra', 'Giáo viên'],
    role: UserRole.TEACHER,
    category: 'Tổng hợp',
    isPublic: true,
    createdAt: Date.now()
  },
  {
    id: 'teach-gen-04',
    title: 'Viết nhận xét học bạ',
    description: 'Nhận xét cá nhân hóa.',
    content: 'Hãy viết 3 mẫu nhận xét học bạ cuối kỳ cho học sinh có đặc điểm: "[Đặc điểm HS, VD: Học giỏi nhưng trầm tính / Năng động nhưng hay mất tập trung]". Nhận xét cần mang tính khích lệ, tích cực và gợi mở hướng cải thiện.',
    tags: ['Nhận xét', 'Học bạ', 'Giáo viên'],
    role: UserRole.TEACHER,
    category: 'Tổng hợp',
    isPublic: true,
    createdAt: Date.now()
  },
  {
    id: 'teach-gen-05',
    title: 'Hoạt động khởi động (Ice Breaker)',
    description: 'Khuấy động không khí lớp học.',
    content: 'Đề xuất 3 hoạt động khởi động (Ice Breaker) vui nhộn, ngắn gọn (5-10 phút) để bắt đầu tiết học về chủ đề "[Chủ đề bài học]". Hoạt động cần dễ tổ chức và thu hút sự tham gia của cả lớp.',
    tags: ['Hoạt động', 'Ice Breaker', 'Giáo viên'],
    role: UserRole.TEACHER,
    category: 'Tổng hợp',
    isPublic: true,
    createdAt: Date.now()
  },
  {
    id: 'teach-gen-06',
    title: 'Dạy học phân hóa',
    description: 'Hỗ trợ học sinh đa trình độ.',
    content: 'Trong lớp có các nhóm học sinh với trình độ khác nhau (Giỏi, Trung bình, Yếu). Hãy gợi ý cách điều chỉnh bài giảng/bài tập về "[Tên bài học]" sao cho phù hợp với từng nhóm đối tượng mà vẫn đảm bảo mục tiêu chung.',
    tags: ['Phân hóa', 'Phương pháp', 'Giáo viên'],
    role: UserRole.TEACHER,
    category: 'Tổng hợp',
    isPublic: true,
    createdAt: Date.now()
  },
  {
    id: 'teach-gen-07',
    title: 'Xử lý tình huống sư phạm',
    description: 'Kỹ năng quản lý lớp học.',
    content: 'Tôi đang gặp tình huống: "[Mô tả tình huống, VD: Học sinh A thường xuyên làm việc riêng / Hai học sinh xung đột trong lớp]". Hãy gợi ý các bước xử lý sư phạm khéo léo, tôn trọng học sinh và hiệu quả.',
    tags: ['Tình huống', 'Kỹ năng mềm', 'Giáo viên'],
    role: UserRole.TEACHER,
    category: 'Tổng hợp',
    isPublic: true,
    createdAt: Date.now()
  },
  {
    id: 'teach-gen-08',
    title: 'Email trao đổi với phụ huynh',
    description: 'Giao tiếp chuyên nghiệp.',
    content: 'Hãy viết một email lịch sự, chuyên nghiệp gửi phụ huynh em [Tên HS] để trao đổi về vấn đề "[Vấn đề, VD: Kết quả học tập sa sút / Vi phạm kỷ luật]". Cần thể hiện sự quan tâm và đề xuất phối hợp giữa gia đình và nhà trường.',
    tags: ['Giao tiếp', 'Phụ huynh', 'Giáo viên'],
    role: UserRole.TEACHER,
    category: 'Tổng hợp',
    isPublic: true,
    createdAt: Date.now()
  },
  {
    id: 'teach-gen-09',
    title: 'Ý tưởng dạy học dự án (PBL)',
    description: 'Học tập qua trải nghiệm.',
    content: 'Hãy thiết kế ý tưởng cho một dự án học tập (Project Based Learning) liên môn [Các môn học] về chủ đề "[Chủ đề thực tế, VD: Bảo vệ môi trường / Văn hóa dân gian]". Nêu rõ: Nhiệm vụ, Sản phẩm dự kiến và Các bước thực hiện.',
    tags: ['Dự án', 'PBL', 'Giáo viên'],
    role: UserRole.TEACHER,
    category: 'Tổng hợp',
    isPublic: true,
    createdAt: Date.now()
  },
  {
    id: 'teach-gen-10',
    title: 'Giải thích sai lầm thường gặp',
    description: 'Dự đoán và khắc phục lỗi.',
    content: 'Liệt kê 5 sai lầm hoặc hiểu lầm phổ biến (Misconceptions) mà học sinh thường gặp khi học về chủ đề "[Chủ đề]". Với mỗi sai lầm, hãy gợi ý cách giải thích hoặc ví dụ minh họa để giúp học sinh hiểu đúng.',
    tags: ['Lỗi sai', 'Sư phạm', 'Giáo viên'],
    role: UserRole.TEACHER,
    category: 'Tổng hợp',
    isPublic: true,
    createdAt: Date.now()
  },

  // =================================================================
  // 10. LẬP TRÌNH WEB (WEB DEVELOPMENT)
  // =================================================================
  {
    id: 'web-gen-01',
    title: 'Layout Responsive với CSS Grid/Flexbox',
    description: 'Xây dựng giao diện thích ứng.',
    content: 'Hãy viết code HTML và CSS (sử dụng Flexbox hoặc Grid) để tạo một layout cho thành phần: "[Tên thành phần, VD: Card sản phẩm / Thanh điều hướng / Dashboard]". Yêu cầu: Responsive tốt trên Mobile và Desktop, code sạch và dễ bảo trì.',
    tags: ['CSS', 'Frontend', 'Lập trình'],
    role: UserRole.STUDENT,
    category: 'Lập trình',
    isPublic: true,
    createdAt: Date.now()
  },
  {
    id: 'web-gen-02',
    title: 'React Component Functional',
    description: 'Viết component React hiện đại.',
    content: 'Hãy viết một React Functional Component để thực hiện chức năng: "[Chức năng, VD: Bộ đếm / Form đăng nhập / Danh sách công việc]". Sử dụng Hooks (useState, useEffect) và xử lý các sự kiện cơ bản.',
    tags: ['React', 'Frontend', 'Lập trình'],
    role: UserRole.STUDENT,
    category: 'Lập trình',
    isPublic: true,
    createdAt: Date.now()
  },
  {
    id: 'web-gen-03',
    title: 'Call API với Fetch/Axios',
    description: 'Xử lý dữ liệu bất đồng bộ.',
    content: 'Hướng dẫn cách gọi API lấy dữ liệu từ URL: "[URL API]" trong Javascript/React. Hãy viết code sử dụng Async/Await, bao gồm cả phần xử lý lỗi (try/catch) và hiển thị trạng thái loading.',
    tags: ['API', 'Javascript', 'Lập trình'],
    role: UserRole.STUDENT,
    category: 'Lập trình',
    isPublic: true,
    createdAt: Date.now()
  },
  {
    id: 'web-gen-04',
    title: 'Validate Form',
    description: 'Kiểm tra dữ liệu đầu vào.',
    content: 'Viết logic kiểm tra dữ liệu (Validation) cho một form đăng ký gồm các trường: [Danh sách trường, VD: Email, Mật khẩu, Số điện thoại]. Yêu cầu: Email phải đúng định dạng, mật khẩu tối thiểu 8 ký tự. Gợi ý dùng Regex hoặc thư viện (như Zod/Yup).',
    tags: ['Form', 'Validation', 'Lập trình'],
    role: UserRole.STUDENT,
    category: 'Lập trình',
    isPublic: true,
    createdAt: Date.now()
  },
  {
    id: 'web-gen-05',
    title: 'CSS Animation/Transition',
    description: 'Hiệu ứng chuyển động mượt mà.',
    content: 'Hãy viết CSS để tạo hiệu ứng chuyển động (Animation/Transition) cho: "[Mô tả hiệu ứng, VD: Button hover nổi lên / Menu trượt từ trái sang / Loading spinner]". Đảm bảo hiệu ứng mượt mà (60fps).',
    tags: ['CSS', 'Animation', 'Lập trình'],
    role: UserRole.STUDENT,
    category: 'Lập trình',
    isPublic: true,
    createdAt: Date.now()
  },
  {
    id: 'web-gen-06',
    title: 'Tailwind CSS Styling',
    description: 'Styling nhanh với Utility classes.',
    content: 'Sử dụng Tailwind CSS, hãy viết code cho một [Thành phần, VD: Card profile] có hình ảnh tròn, tên, mô tả và nút bấm. Hỗ trợ Dark mode và Responsive.',
    tags: ['Tailwind', 'CSS', 'Lập trình'],
    role: UserRole.STUDENT,
    category: 'Lập trình',
    isPublic: true,
    createdAt: Date.now()
  },
  {
    id: 'web-gen-07',
    title: 'Quản lý State (Context/Redux)',
    description: 'Quản lý dữ liệu ứng dụng.',
    content: 'Giải thích và viết code mẫu về cách quản lý trạng thái toàn cục (Global State) cho "[Tính năng, VD: Giỏ hàng / Theme sáng tối]" sử dụng [Công nghệ, VD: React Context API / Redux Toolkit].',
    tags: ['State Management', 'React', 'Lập trình'],
    role: UserRole.STUDENT,
    category: 'Lập trình',
    isPublic: true,
    createdAt: Date.now()
  },
  {
    id: 'web-gen-08',
    title: 'Backend API Endpoint (NodeJS)',
    description: 'Viết API Server-side.',
    content: 'Sử dụng Node.js và Express, hãy viết một API endpoint (Route) để [Hành động, VD: Thêm mới sản phẩm / Lấy danh sách user]. Bao gồm nhận dữ liệu từ Body/Query và trả về JSON response chuẩn.',
    tags: ['Backend', 'NodeJS', 'Lập trình'],
    role: UserRole.STUDENT,
    category: 'Lập trình',
    isPublic: true,
    createdAt: Date.now()
  },
  {
    id: 'web-gen-09',
    title: 'Thiết kế Database Schema',
    description: 'Cấu trúc cơ sở dữ liệu.',
    content: 'Hãy thiết kế sơ đồ cơ sở dữ liệu (Schema) cho một ứng dụng [Tên ứng dụng, VD: Blog cá nhân / Todo List]. Liệt kê các bảng (Tables/Collections), các trường dữ liệu (Fields) và mối quan hệ giữa chúng.',
    tags: ['Database', 'SQL', 'Lập trình'],
    role: UserRole.STUDENT,
    category: 'Lập trình',
    isPublic: true,
    createdAt: Date.now()
  },
  {
    id: 'web-gen-10',
    title: 'Xác thực người dùng (Auth Flow)',
    description: 'Bảo mật đăng nhập.',
    content: 'Giải thích quy trình xác thực người dùng sử dụng JWT (JSON Web Token). Mô tả các bước: Client gửi creds -> Server xác thực -> Server trả Token -> Client lưu Token -> Client gửi kèm Token trong các request sau.',
    tags: ['Security', 'Auth', 'Lập trình'],
    role: UserRole.STUDENT,
    category: 'Lập trình',
    isPublic: true,
    createdAt: Date.now()
  },
  {
    id: 'web-gen-11',
    title: 'Tối ưu hiệu năng React',
    description: 'Giúp ứng dụng chạy nhanh hơn.',
    content: 'Component React của tôi bị render lại (re-render) quá nhiều lần không cần thiết. Hãy gợi ý các kỹ thuật tối ưu hóa (như React.memo, useMemo, useCallback) và cách áp dụng chúng trong trường hợp cụ thể.',
    tags: ['Performance', 'React', 'Lập trình'],
    role: UserRole.STUDENT,
    category: 'Lập trình',
    isPublic: true,
    createdAt: Date.now()
  },
  {
    id: 'web-gen-12',
    title: 'Web Accessibility (ARIA)',
    description: 'Web cho mọi người.',
    content: 'Làm thế nào để cải thiện khả năng tiếp cận (Accessibility) cho thành phần: "[Thành phần, VD: Modal dialog / Custom dropdown]"? Hãy chỉ ra các thuộc tính ARIA cần thiết và cách quản lý focus bàn phím.',
    tags: ['A11y', 'Frontend', 'Lập trình'],
    role: UserRole.STUDENT,
    category: 'Lập trình',
    isPublic: true,
    createdAt: Date.now()
  },
  {
    id: 'web-gen-13',
    title: 'TypeScript Interfaces',
    description: 'Định nghĩa kiểu dữ liệu.',
    content: 'Hãy viết các Interface hoặc Type trong TypeScript để mô tả cấu trúc dữ liệu cho đối tượng: "[Đối tượng, VD: User Profile / E-commerce Product]". Bao gồm các trường bắt buộc, tùy chọn và các kiểu dữ liệu lồng nhau.',
    tags: ['TypeScript', 'Lập trình'],
    role: UserRole.STUDENT,
    category: 'Lập trình',
    isPublic: true,
    createdAt: Date.now()
  },
  {
    id: 'web-gen-14',
    title: 'Deploy ứng dụng Web',
    description: 'Đưa web lên Internet.',
    content: 'Hãy hướng dẫn các bước cơ bản để deploy một ứng dụng [Loại app, VD: React Frontend / Node.js Backend] lên nền tảng [Nền tảng, VD: Vercel / Render / Netlify]. Cần lưu ý gì về biến môi trường (Environment Variables)?',
    tags: ['DevOps', 'Deploy', 'Lập trình'],
    role: UserRole.STUDENT,
    category: 'Lập trình',
    isPublic: true,
    createdAt: Date.now()
  },
  {
    id: 'web-gen-15',
    title: 'Bảo mật Web (Security)',
    description: 'Phòng chống lỗ hổng phổ biến.',
    content: 'Làm thế nào để ngăn chặn lỗi bảo mật [Loại lỗi, VD: XSS (Cross-Site Scripting) / CSRF] trong ứng dụng web? Hãy giải thích cơ chế tấn công và đưa ra giải pháp phòng chống cụ thể trong code.',
    tags: ['Security', 'Lập trình'],
    role: UserRole.STUDENT,
    category: 'Lập trình',
    isPublic: true,
    createdAt: Date.now()
  },
];

export const ETHICS_GUIDE = [
  {
    title: 'Kiểm chứng thông tin',
    content: 'AI có thể tạo ra thông tin sai lệch ("ảo giác"). Luôn đối chiếu với sách giáo khoa và nguồn tin cậy.'
  },
  {
    title: 'Chống đạo văn',
    content: 'Sử dụng AI để lấy ý tưởng và dàn ý, KHÔNG sao chép nguyên văn để nộp bài. Hãy biến kiến thức thành của bạn.'
  },
  {
    title: 'Bảo mật dữ liệu',
    content: 'Không chia sẻ thông tin cá nhân, hình ảnh nhạy cảm hoặc mật khẩu với các công cụ AI.'
  },
  {
    title: 'Tư duy phản biện',
    content: 'Đừng để AI suy nghĩ thay bạn. Hãy dùng nó để thách thức các giả định và mở rộng góc nhìn của bản thân.'
  }
];
