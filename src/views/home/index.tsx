'use client';

import { useMemo, useState } from 'react';

import MenuCard, { type CocktailMenu } from '@/components/menu/menuCard';

const categories = ['전체', '칵테일', '위스키', '논알콜', '하이볼', '사이드'] as const;
type MenuCategory = (typeof categories)[number];

const menuData: CocktailMenu[] = [
  {
    id: 'dd-01',
    category: '칵테일',
    name: '미드나잇 오차드',
    nameEn: 'Midnight Orchard',
    description:
      '진, 시나몬, 사과 콜드브루를 부드럽게 레이어링한 시그니처 칵테일. 잔잔하고 깊은 여운이 남는 미디엄 바디.',
    price: 19000,
    tasteNote: '드라이 & 스파이시, 은은한 사과 향',
    abv: '14%',
    tags: ['Signature', 'Gin Base', 'Low Sweet'],
    isSignature: true,
  },
  {
    id: 'dd-02',
    category: '칵테일',
    name: '화이트 네그로니',
    nameEn: 'White Negroni',
    description:
      '클래식 네그로니를 밝은 톤으로 재해석. 비터 오렌지와 허브의 밸런스가 깔끔한 피니시를 만듭니다.',
    price: 18000,
    tasteNote: '비터 & 허벌, 깔끔한 끝맛',
    abv: '22%',
    tags: ['Classic Twist', 'Aperitif'],
  },
  {
    id: 'dd-03',
    category: '하이볼',
    name: '시트러스 하이볼',
    nameEn: 'Citrus Highball',
    description:
      '유자와 자몽 껍질의 산뜻함에 탄산감을 더해 가볍게 즐기기 좋은 스타일. 첫 잔으로 추천합니다.',
    price: 16000,
    tasteNote: '상큼함 중심, 산뜻한 탄산',
    abv: '9%',
    tags: ['Refreshing', 'Beginner Friendly'],
  },
  {
    id: 'dd-04',
    category: '위스키',
    name: '글렌리벳 12년',
    nameEn: 'The Glenlivet 12Y',
    description:
      '부드러운 바닐라와 사과 향이 균형 잡힌 스페이사이드 싱글몰트. 스트레이트 또는 온더락 추천.',
    price: 21000,
    tasteNote: '라이트 오크, 과일향, 매끈한 피니시',
    abv: '40%',
    tags: ['Single Malt', 'Speyside'],
  },
  {
    id: 'dd-05',
    category: '위스키',
    name: '와일드 터키 101',
    nameEn: 'Wild Turkey 101',
    description: '묵직한 바닐라와 캐러멜 노트가 특징인 버번. 풍부한 향을 선호하는 분께 추천합니다.',
    price: 18000,
    tasteNote: '스파이시, 캐러멜, 묵직한 바디',
    abv: '50.5%',
    tags: ['Bourbon', 'Bold'],
  },
  {
    id: 'dd-06',
    category: '논알콜',
    name: '가든 토닉 제로',
    nameEn: 'Garden Tonic Zero',
    description: '허브 인퓨전과 토닉워터를 조합한 논알콜 시그니처. 깔끔하면서 향긋한 스타일입니다.',
    price: 12000,
    tasteNote: '허브, 청량감, 드라이',
    abv: '0%',
    tags: ['Non Alcohol', 'Herbal'],
  },
  {
    id: 'dd-07',
    category: '논알콜',
    name: '유자 스파클링',
    nameEn: 'Yuzu Sparkling',
    description: '신선한 유자와 레몬 제스트를 더한 스파클링 목테일. 식사 전후 모두 잘 어울립니다.',
    price: 11000,
    tasteNote: '상큼함, 은은한 단맛',
    abv: '0%',
    tags: ['Mocktail', 'Citrus'],
  },
  {
    id: 'dd-08',
    category: '하이볼',
    name: '클래식 진저 하이볼',
    nameEn: 'Classic Ginger Highball',
    description: '위스키와 진저에일의 균형이 좋은 하우스 하이볼. 부담 없이 즐기기 좋습니다.',
    price: 15000,
    tasteNote: '진저 스파이스, 시원한 탄산',
    abv: '10%',
    tags: ['House Favorite', 'Easy Drinking'],
  },
  {
    id: 'dd-09',
    category: '사이드',
    name: '트러플 감자튀김',
    nameEn: 'Truffle Fries',
    description:
      '가벼운 트러플 향과 파마산을 더한 사이드. 칵테일과 가장 잘 어울리는 스테디셀러입니다.',
    price: 13000,
    tasteNote: '고소함, 짭짤함',
    abv: '-',
    tags: ['Side Menu', 'Best Pairing'],
  },
  {
    id: 'dd-10',
    category: '사이드',
    name: '치즈 플래터',
    nameEn: 'Cheese Platter',
    description:
      '3가지 치즈와 견과, 크래커로 구성된 플래터. 위스키 또는 드라이 칵테일과 잘 맞습니다.',
    price: 22000,
    tasteNote: '짭짤함, 고소함, 크리미',
    abv: '-',
    tags: ['Sharing', 'Pairing'],
  },
];

const currency = new Intl.NumberFormat('ko-KR');

const HomePageView = () => {
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory>('전체');

  const filteredMenuData = useMemo(() => {
    if (selectedCategory === '전체') {
      return menuData;
    }

    return menuData.filter((menu) => menu.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <main className="min-h-screen bg-[radial-gradient(120%_90%_at_50%_0%,#fcf8f2_0%,#f3ece2_56%,#ece2d6_100%)] text-[#1f2937]">
      <div className="mx-auto w-full max-w-3xl px-4 pt-8 pb-16 sm:px-6 sm:pt-10">
        <header className="mb-7 sm:mb-9">
          <p className="text-xs font-medium tracking-[0.24em] text-[#876a51]">DEEP DEEP BAR</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#1f2937] sm:text-3xl">
            Menu
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 break-keep text-[#4b5563] sm:text-[15px]">
            혼자와도 함께하는, 밤이 깊어질수록 더 좋아지는 공간. 혼술바 딥딥
          </p>
        </header>

        <section className="-mx-1 mb-5 overflow-x-auto px-1 sm:mb-6">
          <div className="flex min-w-max gap-2">
            {categories.map((category) => {
              const isActive = selectedCategory === category;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full border px-3.5 py-2 text-sm font-medium transition ${
                    isActive
                      ? 'border-[#c29a74] bg-[#f0dfcf] text-[#4a3322] shadow-[0_8px_18px_rgba(120,84,52,0.14)]'
                      : 'border-[#d7cec2] bg-[#f8f3ec] text-[#374151]'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </section>

        <section className="space-y-3.5 sm:space-y-4">
          {filteredMenuData.map((menu) => (
            <MenuCard key={menu.id} menu={menu} currency={currency} />
          ))}
        </section>
      </div>
    </main>
  );
};

export default HomePageView;
