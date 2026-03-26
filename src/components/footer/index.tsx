import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="mt-10 flex items-center justify-between gap-3 px-1 pb-2">
      <p className="text-[11px] text-[#8f8f8f]">© 2026 MinJun Shin. All rights reserved.</p>
      <Link
        href="/admin"
        prefetch={false}
        className="text-[11px] text-[#b7b7b7] underline-offset-2 transition hover:text-[#8a8a8a] hover:underline"
      >
        관리자 페이지로 가기
      </Link>
    </footer>
  );
};

export default Footer;
