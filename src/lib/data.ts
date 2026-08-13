export type Trip = {
  slug: string;
  title: { vi: string; en: string; ko: string };
  location: string;
  duration: string;
  bestTime: { vi: string; en: string; ko: string };
  summary: { vi: string; en: string; ko: string };
  content: { vi: string; en: string; ko: string };
  coverImage: string;
  gallery: string[];
  date: string;
  tags: string[];
};

export type Experience = {
  id: string;
  name: string;
  country: string;
  avatar: string;
  rating: number;
  text: { vi: string; en: string; ko: string };
  trip: string;
};

export type Movie = {
  id: string;
  title: string;
  year: number;
  genre: { vi: string; en: string; ko: string };
  rating: number;
  poster: string;
  banner: string;    // landscape 16:9 banner image
  trailer: string;   // YouTube URL
  impression: { vi: string; en: string; ko: string };
  related: {
    image: string;
    caption: { vi: string; en: string; ko: string };
  }[];
};

export const trips: Trip[] = [
  {
    slug: 'ha-long-bay',
    title: {
      vi: 'Vịnh Hạ Long — Kỳ quan thiên nhiên thế giới',
      en: 'Ha Long Bay — A World Natural Wonder',
      ko: '하롱베이 — 세계 자연 유산',
    },
    location: 'Quảng Ninh, Việt Nam',
    duration: '2-3 ngày / 2-3 days / 2-3일',
    bestTime: {
      vi: 'Tháng 10 – Tháng 4',
      en: 'October – April',
      ko: '10월 – 4월',
    },
    summary: {
      vi: 'Khám phá hàng nghìn đảo đá vôi hùng vĩ và hang động tuyệt đẹp trên vùng biển ngọc bích của Vịnh Hạ Long.',
      en: 'Explore thousands of majestic limestone islands and breathtaking caves over the emerald waters of Ha Long Bay.',
      ko: '에메랄드빛 바다 위로 솟은 수천 개의 석회암 섬과 아름다운 동굴을 탐험해 보세요.',
    },
    content: {
      vi: 'Vịnh Hạ Long là một trong những kỳ quan thiên nhiên đẹp nhất thế giới, với hàng nghìn hòn đảo đá vôi nhô lên khỏi mặt biển xanh ngọc bích. Nơi đây đã được UNESCO công nhận là Di sản thiên nhiên thế giới hai lần vào năm 1994 và 2000.\n\nTrong chuyến đi này, chúng tôi đã có cơ hội khám phá hang Thiên Cung, một trong những hang động lớn và đẹp nhất vịnh. Màn đêm xuống, ngồi trên boong tàu ngắm bầu trời sao rực rỡ phản chiếu trên mặt biển phẳng lặng — đây là khoảnh khắc không thể quên trong cuộc đời.',
      en: 'Ha Long Bay is one of the most beautiful natural wonders in the world, with thousands of limestone islands rising from the emerald sea. It has been recognized twice by UNESCO as a World Natural Heritage site in 1994 and 2000.\n\nDuring this trip, we had the opportunity to explore Thien Cung Cave, one of the largest and most beautiful caves in the bay. As night fell, sitting on the deck watching the brilliant starry sky reflected in the calm sea was an unforgettable moment in life.',
      ko: '하롱베이는 에메랄드 바다에서 솟아오른 수천 개의 석회암 섬들로 이루어진 세계에서 가장 아름다운 자연 경관 중 하나입니다. 1994년과 2000년 두 차례 유네스코 세계자연유산으로 등재되었습니다.\n\n이번 여행에서 우리는 만에서 가장 크고 아름다운 동굴 중 하나인 티엔꿍 동굴을 탐험할 기회를 가졌습니다. 밤이 되어 갑판에 앉아 잔잔한 바다에 반사되는 찬란한 별빛을 바라보는 것은 인생에서 잊을 수 없는 순간이었습니다.',
    },
    coverImage: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1528181304800-259b08848526?w=800&q=80',
      'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&q=80',
      'https://images.unsplash.com/photo-1578469645742-46b8f6f32916?w=800&q=80',
    ],
    date: '2024-11-15',
    tags: ['biển', 'hang động', 'du thuyền'],
  },
  {
    slug: 'hoi-an',
    title: {
      vi: 'Hội An — Phố Cổ Đèn Lồng',
      en: 'Hoi An — The Ancient Lantern Town',
      ko: '호이안 — 등불의 고대 도시',
    },
    location: 'Quảng Nam, Việt Nam',
    duration: '2-4 ngày / 2-4 days / 2-4일',
    bestTime: {
      vi: 'Tháng 2 – Tháng 7',
      en: 'February – July',
      ko: '2월 – 7월',
    },
    summary: {
      vi: 'Dạo bước qua những con phố đèn lồng lung linh, thưởng thức Cao Lầu và khám phá kiến trúc cổ xưa ở phố Hội.',
      en: 'Stroll through lantern-lit streets, savor Cao Lau noodles, and discover ancient architecture in the charming old town.',
      ko: '등불이 반짝이는 거리를 거닐고 까오러우 국수를 맛보며 매력적인 구시가지의 고대 건축물을 발견해 보세요.',
    },
    content: {
      vi: 'Hội An là một trong những điểm đến đẹp nhất Đông Nam Á, nổi tiếng với phố cổ được bảo tồn nguyên vẹn. Mỗi tối, hàng nghìn chiếc đèn lồng rực rỡ thắp sáng các con phố nhỏ, tạo nên một khung cảnh thơ mộng không nơi nào có được.\n\nĐặc biệt vào đêm rằm hàng tháng, toàn bộ điện năng được tắt và người dân thắp nến — phố Hội trở thành một thế giới cổ tích lung linh.',
      en: "Hoi An is one of the most beautiful destinations in Southeast Asia, famous for its well-preserved ancient town. Every evening, thousands of colorful lanterns light up the narrow streets, creating a romantic atmosphere found nowhere else.\n\nEspecially on the monthly full moon night, all electricity is turned off and people light candles — Hoi An becomes a magical fairy-tale world.",
      ko: '호이안은 잘 보존된 구시가지로 유명한 동남아시아에서 가장 아름다운 여행지 중 하나입니다. 매일 저녁 수천 개의 알록달록한 등불이 좁은 거리를 밝혀 다른 어느 곳에서도 볼 수 없는 낭만적인 분위기를 만들어냅니다.\n\n특히 매월 보름달 밤에는 모든 전기가 꺼지고 사람들이 촛불을 밝히면 호이안은 마법 같은 동화의 세계가 됩니다.',
    },
    coverImage: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&q=80',
      'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&q=80',
      'https://images.unsplash.com/photo-1578469645742-46b8f6f32916?w=800&q=80',
    ],
    date: '2024-09-20',
    tags: ['phố cổ', 'ẩm thực', 'văn hóa'],
  },
  {
    slug: 'sapa',
    title: {
      vi: 'Sa Pa — Mây Trời Và Ruộng Bậc Thang',
      en: 'Sapa — Clouds and Terraced Rice Fields',
      ko: '사파 — 구름과 계단식 논',
    },
    location: 'Lào Cai, Việt Nam',
    duration: '3-4 ngày / 3-4 days / 3-4일',
    bestTime: {
      vi: 'Tháng 9 – Tháng 11',
      en: 'September – November',
      ko: '9월 – 11월',
    },
    summary: {
      vi: 'Chinh phục đỉnh Fansipan, khám phá bản làng người H\'Mông và ngắm nhìn ruộng bậc thang vàng óng mùa lúa chín.',
      en: "Conquer Fansipan peak, explore H'Mong villages, and admire golden terraced rice fields during harvest season.",
      ko: '판시팡 봉우리를 정복하고 흐몽족 마을을 탐험하며 수확철 황금빛 계단식 논을 감상해 보세요.',
    },
    content: {
      vi: 'Sa Pa là thiên đường của những người yêu thiên nhiên và đi bộ đường dài. Nằm ở độ cao 1.500m so với mực nước biển, Sa Pa được bao phủ bởi những đám mây trắng bồng bềnh và khí hậu mát mẻ quanh năm.\n\nRuộng bậc thang Mù Cang Chải — cách Sa Pa chưa đầy 2 giờ xe — vào mùa lúa chín tháng 9-10 là một trong những cảnh đẹp nhất Việt Nam. Những thửa ruộng vàng óng xếp tầng tầng lớp lớp trên sườn núi là hình ảnh không thể nào quên.',
      en: "Sapa is a paradise for nature lovers and trekkers. Situated at an altitude of 1,500m above sea level, Sapa is covered by fluffy white clouds and enjoys cool weather year-round.\n\nMu Cang Chai terraced rice fields — less than 2 hours from Sapa — during the September-October harvest season are one of Vietnam's most beautiful sights. The golden fields layered in tiers on the mountainside are an unforgettable image.",
      ko: '사파는 자연 애호가와 트레킹 애호가들의 천국입니다. 해발 1,500m에 위치한 사파는 포근한 흰 구름으로 뒤덮여 있으며 연중 시원한 날씨를 즐깁니다.\n\n사파에서 2시간도 채 안 되는 거리에 있는 무깡짜이 계단식 논은 9월-10월 수확철에 베트남에서 가장 아름다운 풍경 중 하나입니다. 산비탈을 층층이 뒤덮은 황금빛 논은 잊을 수 없는 풍경입니다.',
    },
    coverImage: 'https://images.unsplash.com/photo-1596804710485-96de88a70e7f?w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1596804710485-96de88a70e7f?w=800&q=80',
      'https://images.unsplash.com/photo-1528181304800-259b08848526?w=800&q=80',
      'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&q=80',
    ],
    date: '2024-10-05',
    tags: ['núi', 'văn hóa dân tộc', 'trekking'],
  },
  {
    slug: 'ninh-binh',
    title: {
      vi: 'Ninh Bình — Hạ Long Trên Cạn',
      en: 'Ninh Binh — Ha Long Bay on Land',
      ko: '닌빈 — 육지의 하롱베이',
    },
    location: 'Ninh Bình, Việt Nam',
    duration: '1-2 ngày / 1-2 days / 1-2일',
    bestTime: {
      vi: 'Tháng 3 – Tháng 5, Tháng 9 – Tháng 11',
      en: 'March – May, September – November',
      ko: '3월 – 5월, 9월 – 11월',
    },
    summary: {
      vi: 'Chèo thuyền qua những vách núi đá vôi hùng vĩ, khám phá cố đô Hoa Lư và ngắm hoàng hôn trên đỉnh Hang Múa.',
      en: 'Row through majestic limestone cliffs, explore the ancient capital Hoa Lu, and watch the sunset from Hang Mua peak.',
      ko: '웅장한 석회암 절벽을 노 저어 지나가고 고대 수도 호아르를 탐험하며 항무아 봉우리에서 일몰을 감상해 보세요.',
    },
    content: {
      vi: 'Ninh Bình hay còn gọi là "Vịnh Hạ Long trên cạn" vì sự tương đồng kỳ lạ với kỳ quan biển nổi tiếng này. Tràng An — Di sản Thế giới hỗn hợp duy nhất của Việt Nam — là điểm nhấn không thể bỏ qua.\n\nChèo thuyền qua Tràng An, bạn sẽ len lỏi qua những hang động thấp, ngắm những vách núi dựng đứng phản chiếu xuống mặt hồ tĩnh lặng. Đây là trải nghiệm khó quên cho bất kỳ ai.',
      en: "Ninh Binh is often called 'Ha Long Bay on Land' due to its striking resemblance to this famous marine wonder. Trang An — Vietnam's only mixed World Heritage Site — is a highlight not to be missed.\n\nRowing through Trang An, you'll weave through low caves, admiring towering cliffs reflected in the still lake waters. This is an unforgettable experience for anyone.",
      ko: '닌빈은 유명한 해양 절경과 놀라운 유사성으로 인해 종종 \'육지의 하롱베이\'라고 불립니다. 베트남의 유일한 복합 세계유산인 짱안은 놓칠 수 없는 하이라이트입니다.\n\n짱안을 노 저어 지나가며 낮은 동굴을 누비고 고요한 호수 수면에 반사된 우뚝 솟은 절벽을 감상하게 됩니다. 이는 누구에게나 잊을 수 없는 경험입니다.',
    },
    coverImage: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=800&q=80',
      'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&q=80',
    ],
    date: '2024-08-12',
    tags: ['sông nước', 'di sản', 'chèo thuyền'],
  },
  {
    slug: 'da-nang',
    title: {
      vi: 'Đà Nẵng — Thành Phố Đáng Sống',
      en: 'Da Nang — The Most Livable City',
      ko: '다낭 — 살기 좋은 도시',
    },
    location: 'Đà Nẵng, Việt Nam',
    duration: '3-5 ngày / 3-5 days / 3-5일',
    bestTime: {
      vi: 'Tháng 5 – Tháng 9',
      en: 'May – September',
      ko: '5월 – 9월',
    },
    summary: {
      vi: 'Tắm biển Mỹ Khê, chinh phục núi Bà Nà với cây Cầu Vàng nổi tiếng và khám phá Ngũ Hành Sơn huyền bí.',
      en: 'Swim at My Khe beach, conquer Ba Na Hills with the iconic Golden Bridge, and explore the mystical Marble Mountains.',
      ko: '미케 해변에서 수영하고 상징적인 황금 다리가 있는 바나힐을 정복하며 신비로운 마블 마운틴을 탐험해 보세요.',
    },
    content: {
      vi: 'Đà Nẵng là thành phố năng động và hiện đại nhất miền Trung Việt Nam. Nơi đây sở hữu bãi biển Mỹ Khê đẹp nằm trong top những bãi biển đẹp nhất châu Á.\n\nCầu Vàng ở Bà Nà Hills — đôi bàn tay khổng lồ nâng đỡ cây cầu vàng rực rỡ — đã trở thành biểu tượng du lịch viral nhất của Việt Nam trong những năm gần đây.',
      en: "Da Nang is the most dynamic and modern city in central Vietnam. It boasts My Khe Beach, ranked among the most beautiful beaches in Asia.\n\nThe Golden Bridge at Ba Na Hills — giant hands supporting the golden bridge — has become Vietnam's most viral tourism icon in recent years.",
      ko: '다낭은 베트남 중부에서 가장 역동적이고 현대적인 도시입니다. 아시아 최고의 해변 중 하나로 꼽히는 미케 해변을 자랑합니다.\n\n바나힐의 황금 다리 — 황금빛 다리를 받치고 있는 거대한 손 — 는 최근 몇 년간 베트남 최고의 바이럴 관광 아이콘이 되었습니다.',
    },
    coverImage: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&q=80',
      'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&q=80',
    ],
    date: '2024-07-08',
    tags: ['biển', 'thành phố', 'cầu vàng'],
  },
  {
    slug: 'phu-quoc',
    title: {
      vi: 'Phú Quốc — Đảo Ngọc Thiên Đường',
      en: 'Phu Quoc — The Pearl Island Paradise',
      ko: '푸꾸옥 — 진주 섬 낙원',
    },
    location: 'Kiên Giang, Việt Nam',
    duration: '4-7 ngày / 4-7 days / 4-7일',
    bestTime: {
      vi: 'Tháng 11 – Tháng 4',
      en: 'November – April',
      ko: '11월 – 4월',
    },
    summary: {
      vi: 'Nghỉ dưỡng trên đảo ngọc với những bãi biển cát trắng tuyệt đẹp, lặn ngắm san hô và thưởng thức hải sản tươi ngon.',
      en: 'Relax on the pearl island with stunning white sandy beaches, snorkeling among coral reefs, and savoring fresh seafood.',
      ko: '아름다운 백사장, 산호초 스노클링, 신선한 해산물을 즐기며 진주 섬에서 휴식을 취해 보세요.',
    },
    content: {
      vi: 'Phú Quốc là hòn đảo lớn nhất Việt Nam, nổi tiếng với những bãi biển trắng mịn, nước biển trong xanh như pha lê và những khu resort đẳng cấp thế giới.\n\nBãi Sao ở phía Nam đảo là một trong những bãi biển đẹp nhất châu Á. Nơi đây đặc biệt lý tưởng để lặn ngắm san hô với hệ sinh thái biển phong phú và đa dạng.',
      en: "Phu Quoc is Vietnam's largest island, famous for its fine white beaches, crystal-clear blue waters, and world-class resorts.\n\nBai Sao in the south of the island is one of the most beautiful beaches in Asia. This place is especially ideal for snorkeling with its rich and diverse marine ecosystem.",
      ko: '푸꾸옥은 베트남에서 가장 큰 섬으로, 고운 흰 모래사장, 수정처럼 맑은 파란 바다, 세계적 수준의 리조트로 유명합니다.\n\n섬 남쪽의 바이사오는 아시아에서 가장 아름다운 해변 중 하나입니다. 이곳은 풍부하고 다양한 해양 생태계로 스노클링하기에 특히 이상적입니다.',
    },
    coverImage: 'https://images.unsplash.com/photo-1546412414-e1885259563a?w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1546412414-e1885259563a?w=800&q=80',
      'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&q=80',
    ],
    date: '2024-12-20',
    tags: ['đảo', 'biển', 'lặn biển'],
  },
];

export const experiences: Experience[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    country: 'USA 🇺🇸',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
    rating: 5,
    text: {
      vi: 'Chuyến đi đến Hạ Long với Tuấn Anh là trải nghiệm tuyệt vời nhất trong cuộc đời tôi! Anh ấy biết mọi ngóc ngách đẹp nhất và luôn hết lòng vì khách.',
      en: "The trip to Ha Long with Tuan Anh was the best experience of my life! He knows every beautiful corner and is always dedicated to his guests.",
      ko: '뚜언 아인과 함께한 하롱베이 여행은 내 인생 최고의 경험이었어요! 그는 모든 아름다운 구석을 알고 있으며 항상 손님에게 헌신적입니다.',
    },
    trip: 'Ha Long Bay',
  },
  {
    id: '2',
    name: 'Kim Min-jun',
    country: 'South Korea 🇰🇷',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
    rating: 5,
    text: {
      vi: 'Hội An về đêm thực sự là một trải nghiệm ma thuật. Tuấn Anh dẫn chúng tôi đến những quán ăn địa phương mà không có trong bất kỳ cuốn hướng dẫn du lịch nào!',
      en: "Hoi An at night is truly a magical experience. Tuan Anh took us to local restaurants not found in any travel guide!",
      ko: '밤의 호이안은 정말 마법 같은 경험입니다. 뚜언 아인이 어떤 여행 가이드북에도 없는 현지 식당으로 우리를 안내해 주었어요!',
    },
    trip: 'Hoi An',
  },
  {
    id: '3',
    name: 'Emma Clarke',
    country: 'Australia 🇦🇺',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
    rating: 5,
    text: {
      vi: 'Trek ở Sa Pa 3 ngày với Tuấn Anh thật tuyệt vời. Anh ấy nói cả tiếng Anh và biết cách kết nối với người dân địa phương — điều tôi không thể tự làm được.',
      en: "3-day trekking in Sapa with Tuan Anh was amazing. He speaks English and knows how to connect with locals — something I couldn't do on my own.",
      ko: '뚜언 아인과 함께한 사파 3일 트레킹은 정말 멋졌어요. 그는 영어를 잘하고 현지인들과 소통하는 방법을 알고 있어요 — 혼자서는 할 수 없는 일이죠.',
    },
    trip: 'Sapa',
  },
  {
    id: '4',
    name: 'Marco Ferrari',
    country: 'Italy 🇮🇹',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80',
    rating: 5,
    text: {
      vi: 'Phú Quốc tuyệt đẹp! Tuấn Anh giúp chúng tôi tìm được những bãi biển vắng nhất và nhà hàng hải sản ngon nhất. Chắc chắn sẽ quay lại!',
      en: 'Phu Quoc is stunning! Tuan Anh helped us find the most secluded beaches and the best seafood restaurants. Will definitely come back!',
      ko: '푸꾸옥은 정말 아름다워요! 뚜언 아인이 가장 한적한 해변과 최고의 해산물 식당을 찾는 데 도움을 주었어요. 꼭 다시 올 거예요!',
    },
    trip: 'Phu Quoc',
  },
];

export const movies: Movie[] = [
  {
    id: '1',
    title: 'The Motorcycle Diaries',
    year: 2004,
    genre: { vi: 'Chính kịch / Du lịch', en: 'Drama / Travel', ko: '드라마 / 여행' },
    rating: 9,
    poster: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&q=80',
    banner: 'https://images.unsplash.com/photo-1519583272095-6433daf26b6e?w=800&q=80',
    trailer: 'https://www.youtube.com/watch?v=RwcJm3Y5F8I',
    impression: {
      vi: 'Câu chuyện về hành trình xuyên Nam Mỹ của Che Guevara trẻ tuổi — bộ phim làm thay đổi cách nhìn của tôi về việc khám phá thế giới.',
      en: "The story of young Che Guevara's journey across South America — the film that changed how I see exploring the world.",
      ko: '젊은 체 게바라의 남아메리카 여행 이야기 — 세상을 탐험하는 나의 시각을 바꾼 영화.',
    },
    related: [
      { image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', caption: { vi: 'Thêm ảnh sau', en: 'Add photo later', ko: '사진 추가 예정' } },
      { image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', caption: { vi: 'Thêm ảnh sau', en: 'Add photo later', ko: '사진 추가 예정' } },
      { image: 'https://images.unsplash.com/photo-1519583272095-6433daf26b6e?w=800&q=80', caption: { vi: 'Thêm ảnh sau', en: 'Add photo later', ko: '사진 추가 예정' } },
      { image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&q=80', caption: { vi: 'Thêm ảnh sau', en: 'Add photo later', ko: '사진 추가 예정' } },
    ],
  },
  {
    id: '2',
    title: 'Into the Wild',
    year: 2007,
    genre: { vi: 'Phiêu lưu / Tiểu sử', en: 'Adventure / Biography', ko: '모험 / 전기' },
    rating: 9,
    poster: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80',
    banner: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80',
    trailer: 'https://www.youtube.com/watch?v=67fHQBFtzPE',
    impression: {
      vi: 'Câu chuyện có thật về Christopher McCandless từ bỏ tất cả để lang thang vào hoang dã. Phim nhắc nhở tôi rằng tự do thật sự nằm ở hành trình.',
      en: 'The true story of Christopher McCandless who gave up everything to wander into the wilderness. The film reminds me that true freedom lies in the journey.',
      ko: '모든 것을 버리고 황야로 떠난 크리스토퍼 매캔들리스의 실화. 진정한 자유는 여정 속에 있다는 것을 이 영화가 상기시켜 줍니다.',
    },
    related: [
      { image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80', caption: { vi: 'Thêm ảnh sau', en: 'Add photo later', ko: '사진 추가 예정' } },
      { image: 'https://images.unsplash.com/photo-1443632864897-14973fa006cf?w=800&q=80', caption: { vi: 'Thêm ảnh sau', en: 'Add photo later', ko: '사진 추가 예정' } },
      { image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80', caption: { vi: 'Thêm ảnh sau', en: 'Add photo later', ko: '사진 추가 예정' } },
      { image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80', caption: { vi: 'Thêm ảnh sau', en: 'Add photo later', ko: '사진 추가 예정' } },
    ],
  },
  {
    id: '3',
    title: 'Parasite',
    year: 2019,
    genre: { vi: 'Chính kịch / Kinh dị', en: 'Drama / Thriller', ko: '드라마 / 스릴러' },
    rating: 10,
    poster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&q=80',
    banner: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800&q=80',
    trailer: 'https://www.youtube.com/watch?v=5xH0HfJHsaY',
    impression: {
      vi: 'Bộ phim Hàn Quốc xuất sắc nhất mọi thời đại theo tôi. Bong Joon-ho là thiên tài — phim vừa hài hước vừa đáng sợ, phê phán xã hội sắc bén.',
      en: 'The greatest Korean film of all time in my opinion. Bong Joon-ho is a genius — the film is both funny and terrifying, with sharp social criticism.',
      ko: '내가 생각하는 역대 최고의 한국 영화. 봉준호는 천재입니다 — 영화는 재미있으면서도 무섭고 날카로운 사회 비판을 담고 있습니다.',
    },
    related: [
      { image: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800&q=80', caption: { vi: 'Thêm ảnh sau', en: 'Add photo later', ko: '사진 추가 예정' } },
      { image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80', caption: { vi: 'Thêm ảnh sau', en: 'Add photo later', ko: '사진 추가 예정' } },
      { image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80', caption: { vi: 'Thêm ảnh sau', en: 'Add photo later', ko: '사진 추가 예정' } },
      { image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&q=80', caption: { vi: 'Thêm ảnh sau', en: 'Add photo later', ko: '사진 추가 예정' } },
    ],
  },
  {
    id: '4',
    title: 'Past Lives',
    year: 2023,
    genre: { vi: 'Tình cảm / Chính kịch', en: 'Romance / Drama', ko: '로맨스 / 드라마' },
    rating: 9,
    poster: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&q=80',
    banner: 'https://images.unsplash.com/photo-1518391846015-55a9cc003b25?w=800&q=80',
    trailer: 'https://www.youtube.com/watch?v=kA244xewjcI',
    impression: {
      vi: 'Bộ phim Hàn-Mỹ đẹp đến nao lòng về tình yêu, ký ức và những con đường đời không chọn. Tôi đã khóc suốt cả bộ phim.',
      en: 'A heartbreakingly beautiful Korean-American film about love, memory, and the paths not taken in life. I cried throughout the entire film.',
      ko: '사랑, 기억, 선택하지 않은 인생의 길에 관한 마음 아프도록 아름다운 한국계 미국 영화. 영화 내내 울었습니다.',
    },
    related: [
      { image: 'https://images.unsplash.com/photo-1518391846015-55a9cc003b25?w=800&q=80', caption: { vi: 'Thêm ảnh sau', en: 'Add photo later', ko: '사진 추가 예정' } },
      { image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&q=80', caption: { vi: 'Thêm ảnh sau', en: 'Add photo later', ko: '사진 추가 예정' } },
      { image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80', caption: { vi: 'Thêm ảnh sau', en: 'Add photo later', ko: '사진 추가 예정' } },
      { image: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&q=80', caption: { vi: 'Thêm ảnh sau', en: 'Add photo later', ko: '사진 추가 예정' } },
    ],
  },
  {
    id: '5',
    title: 'Lost in Translation',
    year: 2003,
    genre: { vi: 'Tình cảm / Chính kịch', en: 'Romance / Drama', ko: '로맨스 / 드라마' },
    rating: 8,
    poster: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&q=80',
    banner: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80',
    trailer: 'https://www.youtube.com/watch?v=sU0oZsqDGaM',
    impression: {
      vi: 'Cảm giác lạc lõng ở một thành phố xa lạ — Sofia Coppola chụp lại hoàn hảo những khoảnh khắc cô đơn và kết nối không mong đợi khi du lịch.',
      en: 'The feeling of being lost in a foreign city — Sofia Coppola perfectly captures the lonely moments and unexpected connections when traveling.',
      ko: '낯선 도시에서 길을 잃은 느낌 — Sofia Coppola는 여행 중 외로운 순간과 예상치 못한 연결을 완벽하게 포착했습니다.',
    },
    related: [
      { image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80', caption: { vi: 'Thêm ảnh sau', en: 'Add photo later', ko: '사진 추가 예정' } },
      { image: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=800&q=80', caption: { vi: 'Thêm ảnh sau', en: 'Add photo later', ko: '사진 추가 예정' } },
      { image: 'https://images.unsplash.com/photo-1551641506-ee5bf4cb45f1?w=800&q=80', caption: { vi: 'Thêm ảnh sau', en: 'Add photo later', ko: '사진 추가 예정' } },
      { image: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80', caption: { vi: 'Thêm ảnh sau', en: 'Add photo later', ko: '사진 추가 예정' } },
    ],
  },
  {
    id: '6',
    title: 'Eat Pray Love',
    year: 2010,
    genre: { vi: 'Chính kịch / Du lịch', en: 'Drama / Travel', ko: '드라마 / 여행' },
    rating: 7,
    poster: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80',
    banner: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80',
    trailer: 'https://www.youtube.com/watch?v=yZqBSL6rXxE',
    impression: {
      vi: 'Hành trình tự tìm lại bản thân qua du lịch — Italia, Ấn Độ, Bali. Bộ phim là lý do nhiều người bắt đầu hành trình khám phá Đông Nam Á.',
      en: 'A journey of self-discovery through travel — Italy, India, Bali. The film is the reason many people begin their Southeast Asia exploration journey.',
      ko: '여행을 통한 자기 발견의 여정 — 이탈리아, 인도, 발리. 이 영화는 많은 사람들이 동남아시아 탐험을 시작하게 된 이유입니다.',
    },
    related: [
      { image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80', caption: { vi: 'Thêm ảnh sau', en: 'Add photo later', ko: '사진 추가 예정' } },
      { image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80', caption: { vi: 'Thêm ảnh sau', en: 'Add photo later', ko: '사진 추가 예정' } },
      { image: 'https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?w=800&q=80', caption: { vi: 'Thêm ảnh sau', en: 'Add photo later', ko: '사진 추가 예정' } },
      { image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80', caption: { vi: 'Thêm ảnh sau', en: 'Add photo later', ko: '사진 추가 예정' } },
    ],
  },
];
