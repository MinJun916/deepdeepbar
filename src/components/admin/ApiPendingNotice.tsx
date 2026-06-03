type ApiPendingNoticeProps = {
  title: string;
  description?: string;
};

const ApiPendingNotice = ({ title, description }: ApiPendingNoticeProps) => {
  return (
    <section className="rounded-2xl border border-[#e2d8cb] bg-[#f8f3ec] p-5 text-sm text-[#4b5563]">
      <h2 className="text-base font-semibold text-[#1f2937]">{title}</h2>
      <p className="mt-2 leading-6">
        {description ??
          '이 화면은 Supabase 연동을 제거했습니다. 백엔드 API 연동 후 다시 사용할 수 있어요.'}
      </p>
    </section>
  );
};

export default ApiPendingNotice;
