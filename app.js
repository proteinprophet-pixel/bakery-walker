/**
 * 빵지순례 & 도보 다이어트 (모바일 최적화 웹 앱)
 * Kakao JavaScript SDK API Key: 50063a8e157ba699f0b650abe0496c3b
 */

// 1. 상태 관리
const state = {
  apiKey: '50063a8e157ba699f0b650abe0496c3b',
  currentRegion: '성수동',
  currentLat: 37.5446,
  currentLng: 127.0560,
  selectedTheme: 'saltbread',
  selectedItems: ['소금빵'], // 기본 선택
  kakaoMapLoaded: false,
  mapInstance: null,
  currentSpots: []
};

// 2. 디저트 메뉴 및 칼로리 DB
const MENU_DB = [
  { id: 'item-1', name: '버터 소금빵', kcal: 330, emoji: '🥐', theme: 'saltbread' },
  { id: 'item-2', name: '시오 앙버터', kcal: 450, emoji: '🧈', theme: 'saltbread' },
  { id: 'item-3', name: '트러플 소금빵', kcal: 360, emoji: '🍞', theme: 'saltbread' },
  { id: 'item-4', name: '딸기 생크림 케이크', kcal: 480, emoji: '🍰', theme: 'cake' },
  { id: 'item-5', name: '바스크 치즈케이크', kcal: 520, emoji: '🧀', theme: 'cake' },
  { id: 'item-6', name: '몽블랑 타르트', kcal: 430, emoji: '🌰', theme: 'cake' },
  { id: 'item-7', name: '플레인 베이글 & 크림치즈', kcal: 460, emoji: '🥯', theme: 'bagel' },
  { id: 'item-8', name: '대파 크림치즈 베이글', kcal: 540, emoji: '🥯', theme: 'bagel' },
  { id: 'item-9', name: '프렌치 크루아상', kcal: 410, emoji: '🥐', theme: 'croissant' },
  { id: 'item-10', name: '카라멜 퀸아망', kcal: 470, emoji: '🍯', theme: 'croissant' },
  { id: 'item-11', name: '뺑 오 쇼콜라', kcal: 440, emoji: '🍫', theme: 'croissant' },
  { id: 'item-12', name: '아메리카노 (소화촉진)', kcal: 10, emoji: '☕', theme: 'all' }
];

// 3. 지역 및 테마별 엄선 명소 DB (카카오맵 연동 좌표)
const SPOTS_DB = {
  '성수동': {
    saltbread: [
      { name: '자연도소금빵 성수점', category: '베이커리/소금빵 명가', desc: '하루 7천개 완판되는 갓 구운 버터소금빵 성지', lat: 37.5442, lng: 127.0568 },
      { name: '서울숲 은행나무 산책길', category: '도심 속 녹지 산책', desc: '은행나무길을 따라 걷는 힐링 유산소 소화 코스', lat: 37.5444, lng: 127.0374 },
      { name: '밀도 성수본점', category: '식빵/베이커리', desc: '촉촉한 리치식빵과 러스크로 유명한 골목 빵집', lat: 37.5478, lng: 127.0441 }
    ],
    cake: [
      { name: '어니언 성수', category: '인더스트리얼 베이커리', desc: '팡도르와 당근케이크로 유명한 성수 랜드마크', lat: 37.5435, lng: 127.0573 },
      { name: '성수동 수제화거리 골목 산책', category: '골목 투어', desc: '붉은 벽돌과 감성 갤러리가 이어지는 걷기 좋은 길', lat: 37.5420, lng: 127.0540 },
      { name: '대림창고 갤러리 카페', category: '복합문화 디저트', desc: '예술 작품 감상과 함께하는 딸기 타르트 마무리', lat: 37.5422, lng: 127.0561 }
    ],
    bagel: [
      { name: '코끼리베이글 성수점', category: '화덕 베이커리', desc: '참나무 장작 화덕에서 구워내는 쫄깃한 베이글', lat: 37.5411, lng: 127.0592 },
      { name: '성수 구두테마공원 산책', category: '도보 휴식지', desc: '베이글 브런치 후 가볍게 거닐기 좋은 소공원', lat: 37.5401, lng: 127.0558 },
      { name: '텅 성수 스페이스', category: '감성 카페', desc: '독특한 오브제와 커피로 칼로리 마무리', lat: 37.5452, lng: 127.0545 }
    ],
    croissant: [
      { name: '뵈르뵈르 성수본점', category: '버터 디저트', desc: '프랑스 버터 풍미 가득한 바삭한 페이스트리', lat: 37.5438, lng: 127.0548 },
      { name: '뚝섬역-서울숲 산책로', category: '경치 좋은 보행로', desc: '칼로리 태우기에 제격인 평탄한 산책로', lat: 37.5460, lng: 127.0460 },
      { name: '하루앤원데이 성수', category: '스페셜티 카페', desc: '단백한 라떼와 함께하는 투어 완주 스팟', lat: 37.5448, lng: 127.0528 }
    ]
  },
  '연남동': {
    saltbread: [
      { name: '만동제과', category: '마늘바게트 & 소금빵', desc: '줄 서서 먹는 마늘바게트와 겉바속촉 소금빵', lat: 37.5615, lng: 126.9272 },
      { name: '경의선 숲길 (연트럴파크)', category: '선형 도심 공원', desc: '홍대입구역부터 가좌역까지 쭉 뻗은 최고의 뚜벅이 코스', lat: 37.5630, lng: 126.9240 },
      { name: '베이커스 포레스트', category: '프리미엄 브런치', desc: '정원 뷰를 보며 여유를 즐기는 베이커리 카페', lat: 37.5645, lng: 126.9228 }
    ],
    cake: [
      { name: '레이어드 연남점', category: '영국식 스콘 & 케이크', desc: '빈티지 감성의 당근케이크와 크림 스콘', lat: 37.5642, lng: 126.9238 },
      { name: '연남동 동진시장 골목길', category: '레트로 골목 산책', desc: '공방과 독립서점이 아기자기하게 모여있는 힐링길', lat: 37.5628, lng: 126.9255 },
      { name: '앤티크커피 연남점', category: '비주얼 크로와상 케이크', desc: '화려한 크림 케이크와 엔틱 인테리어', lat: 37.5612, lng: 126.9215 }
    ],
    bagel: [
      { name: 'SF베이글', category: '천연효모 사워도우', desc: '샌프란시스코 정통 방식으로 발효한 담백한 베이글', lat: 37.5635, lng: 126.9245 },
      { name: '경의선 책거리 산책로', category: '테마 산책길', desc: '책 조형물과 벤치가 있어 쉬어가기 좋은 보행길', lat: 37.5562, lng: 126.9301 },
      { name: '수상한 베이글', category: '테라스 베이글 카페', desc: '동화 속 집 같은 정원에서 즐기는 베이글', lat: 37.5524, lng: 126.9218 }
    ],
    croissant: [
      { name: '폴앤폴리나 홍대점', category: '천연 발효빵', desc: '버터 결이 살아 숨 쉬는 정통 크루아상 맛집', lat: 37.5558, lng: 126.9275 },
      { name: '와우산 생태공원 오르막길', category: '고강도 유산소 코스', desc: '빵 1개 칼로리를 순식간에 태우는 피톤치드 언덕길', lat: 37.5515, lng: 126.9320 },
      { name: '콜마인 (Coalmine)', category: '미니멀 카페', desc: '조용하고 감각적인 공간에서 즐기는 커피 한 잔', lat: 37.5505, lng: 126.9185 }
    ]
  },
  '익선동': {
    saltbread: [
      { name: '소하염전 익선본점', category: '소금빵 전문점', desc: '실제 염전 인테리어에서 즐기는 시그니처 소금빵', lat: 37.5746, lng: 126.9902 },
      { name: '종묘 돌담길 & 익선 한옥골목', category: '고즈넉한 돌담 산책', desc: '한옥 처마를 따라 걷는 운치 있는 도보 다이어트 코스', lat: 37.5755, lng: 126.9935 },
      { name: '서울커피 익선점', category: '한옥 디저트', desc: '앙버터 식빵과 큐브 아이스크림이 맛있는 한옥 카페', lat: 37.5741, lng: 126.9895 }
    ],
    cake: [
      { name: '청수당 익선', category: '수플레 카스테라', desc: '대나무 숲과 물길 정원이 펼쳐진 힐링 카페', lat: 37.5739, lng: 126.9898 },
      { name: '운현궁 고궁 둘레길', category: '문화재 산책 코스', desc: '역사의 숨결을 느끼며 칼로리를 태우는 평지 코스', lat: 37.5760, lng: 126.9875 },
      { name: '익동다다방', category: '전통 퓨전 티하우스', desc: '달콤한 디저트 후 깔끔한 차로 정미하는 스팟', lat: 37.5745, lng: 126.9912 }
    ],
    bagel: [
      { name: '런던베이글뮤지엄 안국점', category: '웨이팅 성지 베이글', desc: '국내 베이글 열풍의 주역, 브릭레인 & 감자치즈', lat: 37.5792, lng: 126.9862 },
      { name: '북촌 한옥마을 오르막 산책', category: '유산소 계단 코스', desc: '베이글 칼로리를 완벽히 태울 수 있는 전망 산책로', lat: 37.5828, lng: 126.9835 },
      { name: '어니언 안국점', category: '한옥 베이커리', desc: '대청마루에서 즐기는 디저트 쉼터', lat: 37.5785, lng: 126.9868 }
    ],
    croissant: [
      { name: '아티장크로아상 북촌점', category: '정통 크루아상', desc: '결 하나하나 바삭함이 살아있는 크루아상 전문점', lat: 37.5815, lng: 126.9845 },
      { name: '창덕궁 돈화문로 보행전용길', category: '탁 트인 보행로', desc: '도심 속에서 여유롭게 걷기 좋은 아름다운 길', lat: 37.5765, lng: 126.9918 },
      { name: '온화 익선점', category: '핸드드립 & 수플레', desc: '부드러운 팬케이크 향기가 가득한 카페', lat: 37.5743, lng: 126.9889 }
    ]
  },
  '망원동': {
    saltbread: [
      { name: '어글리베이커리 망원본점', category: '대파빵 & 소금빵 명가', desc: '줄 서서 기다리는 크림빵과 짭조름한 소금빵 성지', lat: 37.5562, lng: 126.9045 },
      { name: '망원한강공원 수변 산책로', category: '시원한 한강 워킹', desc: '빵 먹고 한강 바람 쐬며 칼로리 태우는 최적의 코스', lat: 37.5528, lng: 126.8970 },
      { name: '투드커피 망원점', category: '감성 디저트 카페', desc: '커스터드 푸딩과 핸드드립 커피로 완주', lat: 37.5575, lng: 126.9015 }
    ],
    cake: [
      { name: '망원동 티라미수 본점', category: '컵 티라미수', desc: '달콤 쌉싸름한 오리지널 티라미수', lat: 37.5555, lng: 126.9032 },
      { name: '망리단길 아기자기 골목길', category: '골목 편집숍 투어', desc: '소품샵들을 구경하며 지루하지 않게 걷는 길', lat: 37.5568, lng: 126.9050 },
      { name: '앤트러사이트 서교점', category: '조용한 정원 쉼터', desc: '넓은 정원에서 고요하게 즐기는 커피', lat: 37.5540, lng: 126.9125 }
    ],
    bagel: [
      { name: '브릭베이글 망원', category: '큐브 베이글 샌드', desc: '네모난 베이글 안에 과일과 치즈가 듬뿍', lat: 37.5578, lng: 126.9062 },
      { name: '망원시장 둘레 산책', category: '활기찬 전통시장 코스', desc: '구경거리 가득한 시장 안팎을 걸으며 유산소', lat: 37.5560, lng: 126.9055 },
      { name: '딥블루레이크 망원', category: '블루 리본 스페셜티', desc: '파란 외관이 돋보이는 커피 맛집', lat: 37.5565, lng: 126.9038 }
    ],
    croissant: [
      { name: '밀머피 망원', category: '페이스트리 & 크루아상', desc: '바삭하고 풍미 깊은 크루아상 샌드위치', lat: 37.5582, lng: 126.9022 },
      { name: '성산천 산책길', category: '도심 속 하천길', desc: '자연과 풀내음을 맡으며 걷는 도보 코스', lat: 37.5610, lng: 126.9010 },
      { name: '라바즈 (La Base)', category: '프렌치 파티세리', desc: '정통 프랑스 제과 기술로 빚어낸 명품 디저트', lat: 37.5590, lng: 126.9048 }
    ]
  },
  '송리단길': {
    saltbread: [
      { name: '베이커리 르빵 송파본점', category: '밤식빵 & 소금빵', desc: '재료를 아끼지 않는 송리단길 대표 베이커리', lat: 37.5110, lng: 127.1095 },
      { name: '석촌호수 둘레길 (동호·서호)', category: '서울 최고의 수변 산책로', desc: '롯데타워를 바라보며 2.5km 완벽한 칼로리 버닝', lat: 37.5090, lng: 127.1030 },
      { name: '프레드릭 베이커리', category: '디저트 & 하드계열 빵', desc: '바게트와 말차 크러핀이 일품인 곳', lat: 37.5125, lng: 127.1120 }
    ],
    cake: [
      { name: '진저베어 파이샵', category: '미트파이 & 과일 케이크', desc: '웨이팅 열풍을 몰고 온 감성 파이 하우스', lat: 37.5105, lng: 127.1088 },
      { name: '백제고분군 역사공원 산책', category: '구릉지 산책 코스', desc: '고대 고분 사이 잔디밭을 거니는 평화로운 코스', lat: 37.5045, lng: 127.1070 },
      { name: '뷰클런즈 (Vrewklynz)', category: '스웨덴 힐링 카페', desc: '조용히 생각을 정리하며 차를 음미하는 공간', lat: 37.5118, lng: 127.1098 }
    ],
    bagel: [
      { name: '런던베이글뮤지엄 잠실점', category: '베이글 성지', desc: '롯데월드몰 1층에서 즐기는 브릭레인 베이글', lat: 37.5135, lng: 127.1025 },
      { name: '올림픽공원 몽촌토성길', category: '광활한 숲길 유산소', desc: '나홀로나무를 보며 1만 보를 달성할 수 있는 코스', lat: 37.5195, lng: 127.1210 },
      { name: '앤티크커피 잠실점', category: '비주얼 디저트 카페', desc: '풍성한 크림과 커피로 기분 좋은 마무리', lat: 37.5112, lng: 127.1075 }
    ],
    croissant: [
      { name: '비엔블랑 (Bien Blanc)', category: '크루아상 전문 베이커리', desc: '최상급 프랑스산 고메버터로 구워낸 빵', lat: 37.5098, lng: 127.1110 },
      { name: '송리단길 카페거리 골목 걷기', category: '트렌디 골목 투어', desc: '아기자기한 골목 감성을 즐기며 소화시키기', lat: 37.5115, lng: 127.1085 },
      { name: '라라브레드 송파점', category: '토스트 & 크로플', desc: '물감 잼과 브런치로 가득 찬 쉼터', lat: 37.5108, lng: 127.1102 }
    ]
  },
  '강남역': {
    saltbread: [
      { name: '아우어베이커리 강남점', category: '더티초코 & 소금빵', desc: '트렌디한 베이커리와 진한 버터 향의 만남', lat: 37.5012, lng: 127.0265 },
      { name: '역삼동 국기원 언덕길 산책', category: '도시 속 숲 언덕길', desc: '가파른 오르막으로 단시간에 칼로리를 전소시키는 코스', lat: 37.5018, lng: 127.0312 },
      { name: '가배도 강남점', category: '일본 감성 디저트', desc: '말차 티라미수와 드립 커피로 여유로운 완주', lat: 37.5028, lng: 127.0255 }
    ],
    cake: [
      { name: '빌리엔젤 강남역점', category: '크레이프 케이크 명가', desc: '밀크 크레이프와 당근케이크의 달콤한 조화', lat: 37.4995, lng: 127.0280 },
      { name: '강남대로 미디어폴 보행길', category: '활기찬 도심 워킹', desc: '신논현역까지 직선으로 뻗은 도보 코스', lat: 37.5020, lng: 127.0250 },
      { name: '알베르 (Alver)', category: '도심 속 대형 정원 카페', desc: '자연 채광과 나무가 가득한 강남 대표 쉼터', lat: 37.5035, lng: 127.0278 }
    ],
    bagel: [
      { name: '뉴욕베이글 강남', category: '뉴욕식 정통 베이글', desc: '갓 튀겨낸 듯 바삭하고 쫀득한 베이글 샌드위치', lat: 37.4985, lng: 127.0295 },
      { name: '서리풀공원 몽마르뜨 산책길', category: '자연 숲길 유산소', desc: '도심에서 즐기는 피톤치드 가득한 등산로', lat: 37.4965, lng: 127.0125 },
      { name: '정월 (Jungwol)', category: '달빛 감성 한옥 카페', desc: '따뜻한 감성 조명과 디저트가 있는 휴식처', lat: 37.5032, lng: 127.0270 }
    ],
    croissant: [
      { name: '베이커스필드 강남', category: '유기농 정통 크루아상', desc: '유기농 밀가루와 프랑스 버터로 구운 빵', lat: 37.5005, lng: 127.0272 },
      { name: '신사 가로수길 은행나무길', category: '트렌디 패션 거리', desc: '패션 샵들을 둘러보며 기분 좋게 걷는 산책로', lat: 37.5190, lng: 127.0230 },
      { name: '테일러커피 신사점', category: '아인슈페너 명가', desc: '크림 모카와 드립 커피의 깊은 풍미', lat: 37.5175, lng: 127.0242 }
    ]
  },
  '한남동': {
    saltbread: [
      { name: '사운즈한남 콰르텟', category: '복합 베이커리', desc: '트렌디한 버터 소금빵과 스페셜티 베이커리', lat: 37.5342, lng: 127.0018 },
      { name: '한남동 카페거리 계단길', category: '유산소 도보길', desc: '골목 편집숍들을 둘러보며 칼로리를 태우는 워킹 코스', lat: 37.5358, lng: 127.0035 },
      { name: '오월의종 본점', category: '호밀/바게트 건강빵', desc: '담백한 천연효모 건강 빵으로 유명한 빵지순례 필수지', lat: 37.5365, lng: 126.9992 }
    ],
    cake: [
      { name: '패션5 (Passion 5)', category: '디저트 백화점', desc: '화려한 조각 케이크와 타르트가 가득한 디저트 성지', lat: 37.5385, lng: 127.0022 },
      { name: '매봉산공원 숲속 둘레길', category: '서울 전망 워킹', desc: '한강 전망을 바라보며 걸을 수 있는 힐링 코스', lat: 37.5445, lng: 127.0102 },
      { name: '아러바우트 한남', category: '빈티지 감성 카페', desc: '옛 가옥을 개조한 아늑한 커피 쉼터', lat: 37.5352, lng: 127.0005 }
    ],
    bagel: [
      { name: 'BREADYPOST 한남점', category: '소프트 프레첼/베이글', desc: '빈티지 신문 감성의 트렌디한 프레첼 베이커리', lat: 37.5362, lng: 127.0028 },
      { name: '용산가족공원 호숫가 산책', category: '수변 산책길', desc: '넓은 잔디밭과 연못을 돌며 칼로리 소모하기', lat: 37.5218, lng: 126.9815 },
      { name: '마일스톤 커피 한남점', category: '호주식 커피 & 디저트', desc: '플랫화이트와 비엔나커피가 일품인 곳', lat: 37.5359, lng: 127.0019 }
    ],
    croissant: [
      { name: '라라브레드 한남점', category: '토스트 & 크루아상', desc: '다채로운 토핑 크루아상과 물감 잼', lat: 37.5338, lng: 127.0025 },
      { name: '이태원 앤틱가구거리', category: '이국적 골목길', desc: '이색적인 소품들을 구경하며 걷는 산책길', lat: 37.5325, lng: 126.9955 },
      { name: '챔프커피 제1작업실', category: '로스터리 명가', desc: '진한 챔프커피와 쿠키로 투어 마무리', lat: 37.5340, lng: 126.9935 }
    ]
  },
  '판교': {
    saltbread: [
      { name: '롤링핀 판교점', category: '버터 식빵 & 소금빵', desc: '진한 버터 풍미의 프리미엄 베이커리', lat: 37.3955, lng: 127.1125 },
      { name: '탄천 수변 자전거·도보길', category: '평탄한 강변 산책로', desc: '물소리 들으며 속보로 걷기 최적화된 직선 코스', lat: 37.3980, lng: 127.1145 },
      { name: '베키아에누보 판교점', category: '유러피언 델리', desc: '진한 치즈케이크와 브런치로 투어 완주', lat: 37.3925, lng: 127.1118 }
    ],
    cake: [
      { name: '키친205 판교점', category: '딸기밭 케이크', desc: '생딸기가 가득 채워진 딸기 생크림 케이크 성지', lat: 37.3932, lng: 127.1112 },
      { name: '화랑공원 메타세쿼이아길', category: '도심 속 숲길', desc: '키 큰 나무 사이를 걸으며 피톤치드 흡수', lat: 37.4015, lng: 127.1035 },
      { name: '알레그리아 판교테크노밸리', category: '스페셜티 로스터리', desc: '카페라떼와 플랫화이트가 일품인 쉼터', lat: 37.4022, lng: 127.1058 }
    ],
    bagel: [
      { name: '포비 판교점 (FOURB)', category: '아이언 베이글', desc: '다양한 스프레드와 깔끔한 인테리어의 베이글 샵', lat: 37.3968, lng: 127.1120 },
      { name: '운중천 징검다리 산책로', category: '자연 친화 산책로', desc: '판교 주민들의 최애 유산소 운동 코스', lat: 37.3912, lng: 127.1082 },
      { name: '사송커피', category: '한옥 고즈넉 카페', desc: '자연 속에 자리 잡은 감성 가득한 휴식처', lat: 37.4125, lng: 127.1245 }
    ],
    croissant: [
      { name: '곤트란쉐리에 판교점', category: '프랑스 정통 베이커리', desc: '파리 현지 레시피로 구워낸 명품 크루아상', lat: 37.3945, lng: 127.1132 },
      { name: '낙생대공원 숲길 코스', category: '구릉지 힐링 걷기', desc: '적당한 오르막으로 칼로리 버닝 극대화', lat: 37.3885, lng: 127.1042 },
      { name: '펠트커피 판교점', category: '미니멀 감성 카페', desc: '깔끔한 드립 커피로 깔끔한 피날레', lat: 37.3942, lng: 127.1121 }
    ]
  }
};

// 4. 앱 초기화
document.addEventListener('DOMContentLoaded', () => {
  renderMenuTags();
  updateCalorieDashboard();
  initEventListeners();
  tryLoadKakaoMapSDK();
  // 기본 성수동 기준 출발점 & 도착점 자동 프리뷰
  refreshRegionSpots(state.currentRegion);
});

// 메뉴 태그 렌더링
function renderMenuTags() {
  const container = document.getElementById('menuTags');
  container.innerHTML = '';

  MENU_DB.forEach(item => {
    const isSelected = state.selectedItems.includes(item.name);
    const tag = document.createElement('div');
    tag.className = `menu-item-tag ${isSelected ? 'selected' : ''}`;
    tag.innerHTML = `<span>${item.emoji} ${item.name}</span> <span class="kcal">+${item.kcal}kcal</span>`;
    tag.addEventListener('click', () => toggleMenuItem(item.name));
    container.appendChild(tag);
  });
}

function toggleMenuItem(name) {
  const idx = state.selectedItems.indexOf(name);
  if (idx > -1) {
    if (state.selectedItems.length > 1) {
      state.selectedItems.splice(idx, 1);
    }
  } else {
    state.selectedItems.push(name);
  }
  document.getElementById('cartCount').textContent = `${state.selectedItems.length}개 선택됨`;
  renderMenuTags();
  updateCalorieDashboard();
}

// 칼로리 계산 대시보드 업데이트
function updateCalorieDashboard(burnedKcal = 0) {
  let totalIntake = 0;
  state.selectedItems.forEach(itemName => {
    const found = MENU_DB.find(m => m.name === itemName);
    if (found) totalIntake += found.kcal;
  });

  document.getElementById('intakeKcal').textContent = totalIntake;
  
  const targetMin = Math.round(totalIntake / 4.4);
  const targetKm = (targetMin * (4 / 60)).toFixed(1);

  document.getElementById('targetWalkMin').textContent = targetMin;
  document.getElementById('targetDistanceKm').textContent = `약 ${targetKm} km 걷기`;

  if (burnedKcal > 0) {
    const ratio = Math.min(100, Math.round((burnedKcal / totalIntake) * 100));
    document.getElementById('burnRatio').textContent = `${ratio}%`;
    document.getElementById('progressFill').style.width = `${ratio}%`;
    
    if (ratio >= 100) {
      document.getElementById('burnTip').innerHTML = `🎉 <strong>대성공!</strong> 오늘 먹은 빵 칼로리를 도보로 100% 소모했습니다! 👏`;
      document.getElementById('burnTip').style.color = '#059669';
    } else {
      const remain = totalIntake - burnedKcal;
      document.getElementById('burnTip').innerHTML = `🏃‍♂️ 생성된 코스로 <strong>${burnedKcal} kcal</strong> 소모! (잔여 ${remain} kcal)`;
      document.getElementById('burnTip').style.color = '#D97706';
    }
  } else {
    document.getElementById('burnRatio').textContent = '0%';
    document.getElementById('progressFill').style.width = '0%';
    document.getElementById('burnTip').textContent = '코스를 생성하면 도보 소모 칼로리와 최적 동선이 계산됩니다!';
    document.getElementById('burnTip').style.color = '#6B7280';
  }
}

// 5. 검색 및 선택 시 스팟 동적 생성/매칭 및 출발/도착점 자동 갱신
function refreshRegionSpots(regionName) {
  state.currentRegion = regionName;

  // DB에 직접 있거나, 키워드가 포함된 지역 찾기
  let matchedKey = Object.keys(SPOTS_DB).find(k => regionName.includes(k) || k.includes(regionName));
  let spotList = [];

  if (matchedKey && SPOTS_DB[matchedKey]) {
    const themeSpots = SPOTS_DB[matchedKey][state.selectedTheme] || SPOTS_DB[matchedKey]['saltbread'];
    spotList = themeSpots;
  } else {
    // 동적 생성 (미등록 지역인 경우 사용자의 검색어를 출발점으로 지능적 자동 구성)
    spotList = generateDynamicSpots(regionName, state.selectedTheme);
  }

  state.currentSpots = spotList;

  // 출발점과 도착점 프리뷰 카드 자동 업데이트!
  updateAutoRoutePreview(regionName, spotList);
}

// 등록되지 않은 지역 검색 시 스마트 생성
function generateDynamicSpots(region, theme) {
  let themeName = '버터 소금빵 성지';
  if (theme === 'cake') themeName = '감성 케이크 & 디저트 카페';
  if (theme === 'bagel') themeName = '정통 화덕 베이글 하우스';
  if (theme === 'croissant') themeName = '프렌치 크루아상 베이커리';

  const baseLat = state.currentLat || 37.5500;
  const baseLng = state.currentLng || 127.0000;

  return [
    {
      name: `${region} 대표 ${themeName}`,
      category: '1차 출발 베이커리',
      desc: `${region}에서 가장 핫한 빵지순례 명소에서 출발합니다.`,
      lat: baseLat + 0.0015,
      lng: baseLng - 0.0020
    },
    {
      name: `${region} 둘레 산책로 (소화 코스)`,
      category: '2차 중간 유산소 걷기',
      desc: `빵을 즐긴 후 칼로리를 태우며 여유롭게 걷는 힐링 산책길`,
      lat: baseLat - 0.0010,
      lng: baseLng + 0.0010
    },
    {
      name: `${region} 감성 티하우스 & 커피`,
      category: '3차 도착 완주 쉼터',
      desc: `투어를 마무리하며 깔끔한 차와 커피로 쉬어가는 최종 목적지`,
      lat: baseLat + 0.0035,
      lng: baseLng + 0.0025
    }
  ];
}

// 실시간 출발점 & 도착점 자동 뷰 업데이트
function updateAutoRoutePreview(regionName, spots) {
  if (!spots || spots.length < 2) return;

  const startSpot = spots[0];
  const endSpot = spots[spots.length - 1];

  document.getElementById('previewRegionName').textContent = `${regionName} 기준`;
  document.getElementById('previewStartName').textContent = startSpot.name;
  document.getElementById('previewStartDesc').textContent = startSpot.category;

  document.getElementById('previewEndName').textContent = endSpot.name;
  document.getElementById('previewEndDesc').textContent = endSpot.category;
}

// 이벤트 리스너 등록
function initEventListeners() {
  // 핫스팟 칩 클릭
  document.querySelectorAll('#hotspotChips .chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('#hotspotChips .chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      state.currentLat = parseFloat(chip.dataset.lat);
      state.currentLng = parseFloat(chip.dataset.lng);
      document.getElementById('customLocationInput').value = '';
      
      // 검색/선택 즉시 출발점과 도착점 자동 갱신!
      refreshRegionSpots(chip.dataset.region);
    });
  });

  // 검색 함수
  const executeSearch = () => {
    const query = document.getElementById('customLocationInput').value.trim();
    if (!query) {
      alert('지역명이나 지하철역 이름을 입력해 주세요.');
      return;
    }

    // 칩 비활성화
    document.querySelectorAll('#hotspotChips .chip').forEach(c => c.classList.remove('active'));
    
    // 검색 시 출발점과 도착점 자동으로 즉시 계산 & 표시!
    refreshRegionSpots(query);

    // 바로 코스 생성까지 자동으로 이어서 실행하여 시각화!
    generateBakeryCourse();
  };

  // 검색 버튼 클릭
  document.getElementById('btnSearchLocation').addEventListener('click', executeSearch);

  // 검색창 Enter 키 이벤트 지원
  document.getElementById('customLocationInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      executeSearch();
    }
  });

  // 테마 선택
  document.querySelectorAll('.theme-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.theme-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      state.selectedTheme = card.dataset.theme;
      // 테마 변경 시에도 출발점과 도착점 자동 갱신
      refreshRegionSpots(state.currentRegion);
    });
  });

  // 내 GPS 위치 버튼
  document.getElementById('btnGps').addEventListener('click', () => {
    if (!navigator.geolocation) {
      alert('이 브라우저는 위치 정보(GPS)를 지원하지 않습니다.');
      return;
    }
    const btn = document.getElementById('btnGps');
    btn.innerHTML = `<span class="icon">⏳</span><span class="text">탐색중</span>`;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        state.currentLat = pos.coords.latitude;
        state.currentLng = pos.coords.longitude;
        btn.innerHTML = `<span class="icon">✅</span><span class="text">내 위치 완료</span>`;
        document.getElementById('customLocationInput').value = '내 주변';
        
        refreshRegionSpots('내 위치 주변');
        generateBakeryCourse();

        setTimeout(() => {
          btn.innerHTML = `<span class="icon">📍</span><span class="text">내 위치</span>`;
        }, 2500);
      },
      (err) => {
        btn.innerHTML = `<span class="icon">📍</span><span class="text">내 위치</span>`;
        alert('위치 정보를 가져올 수 없습니다. 브라우저 위치 권한을 확인해주세요.');
      },
      { timeout: 7000 }
    );
  });

  // 코스 생성 버튼
  document.getElementById('btnGenerateCourse').addEventListener('click', generateBakeryCourse);

  // 모달 제어
  document.getElementById('btnOpenSetting').addEventListener('click', () => {
    document.getElementById('settingModal').classList.add('active');
  });
  document.getElementById('btnCloseModal').addEventListener('click', () => {
    document.getElementById('settingModal').classList.remove('active');
  });
  document.getElementById('btnConfirmModal').addEventListener('click', () => {
    document.getElementById('settingModal').classList.remove('active');
  });
  document.getElementById('btnCopyUrl').addEventListener('click', () => {
    const text = 'https://1103001-sepia.vercel.app';
    navigator.clipboard.writeText(text).then(() => {
      alert('모바일 배포 URL이 클립보드에 복사되었습니다!\n스마트폰 브라우저에 붙여넣어 보세요.');
    });
  });
}

// 6. 카카오 지도 SDK 동적 로딩 시도
function tryLoadKakaoMapSDK() {
  const script = document.createElement('script');
  script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${state.apiKey}&autoload=false&libraries=services`;
  script.onload = () => {
    if (window.kakao && window.kakao.maps) {
      window.kakao.maps.load(() => {
        state.kakaoMapLoaded = true;
        console.log('Kakao Map SDK successfully loaded!');
      });
    }
  };
  script.onerror = () => {
    console.warn('Kakao Map SDK load failed. Fallback to Leaflet interactive map.');
    state.kakaoMapLoaded = false;
  };
  document.head.appendChild(script);
}

// 7. 코스 생성 핵심 로직
function generateBakeryCourse() {
  const resultSec = document.getElementById('resultSection');
  resultSec.style.display = 'block';

  const spotList = state.currentSpots.length > 0 ? state.currentSpots : (SPOTS_DB['성수동']['saltbread']);
  const startSpot = spotList[0];
  const endSpot = spotList[spotList.length - 1];

  // 상단 출발-도착 하이라이트 배너 채우기
  document.getElementById('hlStartName').textContent = startSpot.name;
  document.getElementById('hlEndName').textContent = endSpot.name;

  // 카카오맵 전체 도보 길찾기 링크 (출발지 ➡️ 도착지)
  const totalRouteUrl = `https://map.kakao.com/?sName=${encodeURIComponent(startSpot.name)}&eName=${encodeURIComponent(endSpot.name)}`;
  document.getElementById('btnKakaoTotalRoute').href = totalRouteUrl;

  // 도보 거리 & 시간 & 칼로리 계산
  let totalDistanceM = 0;
  for (let i = 0; i < spotList.length - 1; i++) {
    const dist = calculateDistance(
      spotList[i].lat, spotList[i].lng,
      spotList[i + 1].lat, spotList[i + 1].lng
    );
    totalDistanceM += dist;
  }
  totalDistanceM = Math.round(totalDistanceM * 1.3); // 실제 골목길 우회 계수
  
  const totalKm = (totalDistanceM / 1000).toFixed(1);
  const totalMinutes = Math.round(totalDistanceM / 70);
  const burnKcal = Math.round(totalMinutes * 4.4);

  // 요약 배너 업데이트
  document.getElementById('totalWalkDist').textContent = `${totalKm} km`;
  document.getElementById('totalWalkTime').textContent = `약 ${totalMinutes} 분`;
  document.getElementById('totalBurnKcal').textContent = `-${burnKcal} kcal`;

  updateCalorieDashboard(burnKcal);

  // 타임라인 동선 UI 렌더링
  renderTimeline(spotList);

  // 지도 렌더링
  renderMap(spotList);

  // 스크롤 이동
  resultSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// 두 좌표 간 거리 계산 (Haversine 공식)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const rad = Math.PI / 180;
  const dLat = (lat2 - lat1) * rad;
  const dLon = (lon2 - lon1) * rad;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * rad) * Math.cos(lat2 * rad) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return Math.round(R * c);
}

// 타임라인 동선 카드 렌더링
function renderTimeline(spots) {
  const container = document.getElementById('timelineRoute');
  container.innerHTML = '';

  spots.forEach((spot, index) => {
    const kakaoMapUrl = `https://map.kakao.com/link/to/${encodeURIComponent(spot.name)},${spot.lat},${spot.lng}`;

    const card = document.createElement('div');
    card.className = `timeline-card spot-${index + 1}`;
    
    let stepTitle = `🚩 [출발점] 1차 베이커리 🥐`;
    if (index === 1) stepTitle = `🌿 [경유지] 2차 소화 산책길`;
    if (index === spots.length - 1) stepTitle = `🏁 [도착점] 3차 완주 쉼터 🍰`;

    card.innerHTML = `
      <div class="timeline-header">
        <div>
          <span class="badge-step">${stepTitle}</span>
          <h3 class="place-name">${spot.name}</h3>
        </div>
        <span class="place-category">${spot.category}</span>
      </div>
      <div class="timeline-body">
        <p>${spot.desc}</p>
        <a href="${kakaoMapUrl}" target="_blank" class="btn-kakaomap">
          <span>🟡</span> 카카오맵에서 길찾기 열기
        </a>
      </div>
    `;

    container.appendChild(card);

    if (index < spots.length - 1) {
      const nextSpot = spots[index + 1];
      const distM = Math.round(calculateDistance(spot.lat, spot.lng, nextSpot.lat, nextSpot.lng) * 1.3);
      const min = Math.round(distM / 70);
      const burn = Math.round(min * 4.4);

      const interBar = document.createElement('div');
      interBar.className = 'walk-inter-bar';
      interBar.innerHTML = `<span>👣 다음 스팟까지 도보 약 ${min}분 (${distM}m, -${burn}kcal)</span>`;
      container.appendChild(interBar);
    }
  });
}

// 인터랙티브 지도 렌더링
function renderMap(spots) {
  const mapContainer = document.getElementById('kakaoMap');
  const centerLat = spots[1] ? spots[1].lat : spots[0].lat;
  const centerLng = spots[1] ? spots[1].lng : spots[0].lng;

  // 카카오 SDK 활성화 상태인 경우
  if (state.kakaoMapLoaded && window.kakao && window.kakao.maps) {
    try {
      mapContainer.innerHTML = '';
      const options = {
        center: new kakao.maps.LatLng(centerLat, centerLng),
        level: 4
      };
      const map = new kakao.maps.Map(mapContainer, options);
      
      const linePath = [];
      spots.forEach((spot, idx) => {
        const pos = new kakao.maps.LatLng(spot.lat, spot.lng);
        linePath.push(pos);
        
        const marker = new kakao.maps.Marker({
          position: pos,
          map: map
        });
        
        const label = idx === 0 ? '🚩 출발: ' : (idx === spots.length - 1 ? '🏁 도착: ' : `${idx+1}. `);
        const infowindow = new kakao.maps.InfoWindow({
          content: `<div style="padding:5px 8px;font-size:12px;font-weight:700;">${label}${spot.name}</div>`
        });
        infowindow.open(map, marker);
      });

      const polyline = new kakao.maps.Polyline({
        path: linePath,
        strokeWeight: 5,
        strokeColor: '#D97706',
        strokeOpacity: 0.8,
        strokeStyle: 'solid'
      });
      polyline.setMap(map);

      document.getElementById('mapNotice').style.display = 'block';
      document.getElementById('mapNotice').innerHTML = `<span>🟡 카카오맵 SDK 연동 활성화</span>`;
      return;
    } catch (e) {
      console.warn('Kakao map instance error:', e);
    }
  }

  // 폴백: Leaflet 인터랙티브 지도
  if (state.mapInstance) {
    state.mapInstance.remove();
  }
  mapContainer.innerHTML = '';

  const map = L.map('kakaoMap').setView([centerLat, centerLng], 14);
  state.mapInstance = map;

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
  }).addTo(map);

  const latlngs = [];
  spots.forEach((spot, idx) => {
    latlngs.push([spot.lat, spot.lng]);
    const marker = L.marker([spot.lat, spot.lng]).addTo(map);
    const label = idx === 0 ? '🚩 [출발점]' : (idx === spots.length - 1 ? '🏁 [도착점]' : `🌿 [경유지]`);
    marker.bindPopup(`<b>${label} ${spot.name}</b><br><span style="font-size:11px;">${spot.category}</span>`).openPopup();
  });

  const polyline = L.polyline(latlngs, {
    color: '#D97706',
    weight: 5,
    opacity: 0.8,
    dashArray: '8, 8'
  }).addTo(map);

  map.fitBounds(polyline.getBounds(), { padding: [30, 30] });

  document.getElementById('mapNotice').style.display = 'block';
  document.getElementById('mapNotice').innerHTML = `<span>📍 실시간 인터랙티브 동선 지도</span>`;
}
