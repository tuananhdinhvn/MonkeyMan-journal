import { fetchAlbums, fetchJournalPosts, fetchMovies, fetchMyInfo, fetchVideoUrl } from '@/sanity/queries';
import AnimateSection from '@/components/AnimateSection';
// import HeroSlider from '@/components/HeroSlider';
import DestinationSlider from '@/components/DestinationSlider';
import HomeVideoHero from '@/components/HomeVideoHero';
import MovieSection from '@/components/MovieSection';
import JournalSection from '@/components/JournalSection';
import MyInfoSection from '@/components/MyInfoSection';

type Locale = 'vi' | 'en' | 'ko';

/* ─── Copy strings ─────────────────────────────────── */
const copy = {
  vi: {
    readMore: 'Đọc thêm',
    by: 'bởi',
    /* Section 1 */
    s1Label: 'NHẬT KÝ DU LỊCH',
    s1Title: 'Những chuyến đi của tôi',
    s1Sub: 'Ghi lại từng khoảnh khắc trên con đường mình đã qua.',
    s1All: 'Xem tất cả',
    /* Newsletter */
    nlLabel: 'THEO DÕI HÀNH TRÌNH',
    nlTitle: 'Mỗi chuyến đi là một trang nhật ký mới',
    nlText: 'Kết nối với tôi qua mạng xã hội để không bỏ lỡ bất kỳ chuyến phiêu lưu nào.',
    nlBtn: 'Liên hệ',
    /* Section 2 – 4 col */
    s2Label: 'ĐƯỢC YÊU THÍCH',
    s2Title: 'Từ nhật ký của tôi',
    /* Destination */
    s3Label: 'ĐIỂM ĐẾN',
    s3Title: 'Nơi tôi đã đặt chân',
    /* Recent */
    s4Label: 'BÀI VIẾT GẦN ĐÂY',
    /* Quote */
    quote: '"Không phải điểm đến, mà là hành trình mới là điều đáng nhớ."',
    quoteBy: '— Tuấn Anh, MonkeyMan',
    /* Movies */
    s5Label: '',
    s5Title: 'Bộ sưu tập phim của tôi',
    s5Sub: 'Tôi yêu phim, đặc biệt là những bộ phim dựa trên câu chuyện có thật.',
    s5All: 'Xem toàn bộ',
  },
  en: {
    readMore: 'Read More',
    by: 'by',
    s1Label: 'TRAVEL JOURNAL',
    s1Title: 'Unforgettable Memories',
    s1Sub: 'Capturing every moment along the roads I have traveled.',
    s1All: 'View All',
    nlLabel: 'FOLLOW MY JOURNEY',
    nlTitle: 'Every trip is a brand new diary page',
    nlText: 'Connect with me on social media to never miss any adventure.',
    nlBtn: 'Get in Touch',
    s2Label: 'FEATURED',
    s2Title: 'From My Journal',
    s3Label: 'DESTINATIONS',
    s3Title: 'Places I Have Been',
    s4Label: 'RECENT ENTRIES',
    quote: '"It is not the destination but the journey itself that is worth remembering."',
    quoteBy: '— Tuan Anh, MonkeyMan',
    s5Label: '',
    s5Title: 'My movies collection',
    s5Sub: 'I love movies, especially the movies based on real stories.',
    s5All: 'See all Collection',
  },
  ko: {
    readMore: '더 읽기',
    by: '작성자',
    s1Label: '여행 일기',
    s1Title: '최근 여행들',
    s1Sub: '걸어온 길 위의 모든 순간을 기록합니다.',
    s1All: '전체 보기',
    nlLabel: '여정 팔로우하기',
    nlTitle: '모든 여행은 새로운 일기의 한 페이지입니다',
    nlText: '소셜 미디어에서 저와 연결하여 어떤 모험도 놓치지 마세요.',
    nlBtn: '연락하기',
    s2Label: '추천',
    s2Title: '내 일기에서',
    s3Label: '여행지',
    s3Title: '내가 가본 곳들',
    s4Label: '최근 게시물',
    quote: '"목적지가 아니라 여정 자체가 기억할 만한 것입니다."',
    quoteBy: '— 뚜언 아인, 몽키맨',
    s5Label: '',
    s5Title: '나의 영화 컬렉션',
    s5Sub: '나는 영화를 사랑합니다, 특히 실화를 바탕으로 한 영화들을.',
    s5All: '전체 컬렉션 보기',
  },
} satisfies Record<Locale, Record<string, string>>;

/* ─── Page ──────────────────────────────────────────── */
export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = (rawLocale as Locale) || 'vi';
  const c = copy[locale];

  const [albums, journalPosts, movies, myInfo, videoUrl] = await Promise.all([
    fetchAlbums(),
    fetchJournalPosts(),
    fetchMovies(),
    fetchMyInfo(),
    fetchVideoUrl(),
  ]);

  return (
    <div className="overflow-x-hidden">

      {/* ══════════════════════════════════════════════
          0. FULL-SCREEN VIDEO INTRO
      ══════════════════════════════════════════════ */}
      <HomeVideoHero initialUrl={videoUrl ?? undefined} />

      {/* ══════════════════════════════════════════════
          3. personal intro
      ══════════════════════════════════════════════ */}
      <section id="my-info" className="bg-cream py-[50px]">
        <div className="mx-auto max-w-8xl px-6 sm:px-10">
          <AnimateSection>
            <MyInfoSection locale={locale} initial={myInfo ?? undefined} />
          </AnimateSection>
        </div>
      </section>


 


      {/* ══════════════════════════════════════════════
          1.  SLIDER — temporarily hidden
      ══════════════════════════════════════════════ */}
      {/* <HeroSlider slides={heroSlides} locale={locale} readMore={c.readMore} byLabel={c.by} /> */}

      {/* ══════════════════════════════════════════════
          5. My album
      ══════════════════════════════════════════════ */}
      <section id="my-album" className="bg-cream pt-0">
        <AnimateSection>
          <DestinationSlider albums={albums} locale={locale} />
        </AnimateSection>
      </section>

      {/* ══════════════════════════════════════════════
          2. My JOURNAL
      ══════════════════════════════════════════════ */}
      <section id="my-journal" className="py-20 lg:py-28">
        <div className="mx-auto max-w-8xl px-6 sm:px-10">
          <JournalSection
            posts={journalPosts}
            locale={locale}
            labels={{
              sectionLabel: c.s1Label,
              title: c.s1Title,
              subtitle: c.s1Sub,
              readMore: c.readMore,
              by: c.by,
            }}
          />
        </div>
      </section>

    

    




      {/* ══════════════════════════════════════════════
          8. My movies
      ══════════════════════════════════════════════ */}
      <section id="my-movies" className="py-20 lg:py-24">
        <div className="mx-auto max-w-8xl px-6 sm:px-10">
          <AnimateSection>
            <MovieSection
              movies={movies}
              locale={locale}
              sectionLabel={c.s5Label}
              sectionTitle={c.s5Title}
              subtitle={c.s5Sub}
              seeAll={c.s5All}
            />
          </AnimateSection>
        </div>
      </section>

     

    </div>
  );
}
