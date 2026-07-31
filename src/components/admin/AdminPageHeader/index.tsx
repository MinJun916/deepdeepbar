import Link from 'next/link';

import AdminLogoutButton from '@/components/admin/AdminLogoutButton';

const actionButtonClassName =
  'rounded-lg border border-[#d7cec2] bg-[#f8f3ec] px-3 py-2 text-sm text-[#4b5563]';

type AdminPageHeaderProps = {
  title: string;
  description?: string;
  eyebrow?: string;
  showLogout?: boolean;
};

const AdminPageHeader = ({
  eyebrow = 'DEEP DEEP BAR',
  title,
  description,
  showLogout = true,
}: AdminPageHeaderProps) => {
  return (
    <header className="mb-8">
      <p className="text-xs font-medium tracking-[0.22em] text-[#876a51]">{eyebrow}</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">{title}</h1>
      {description ? <p className="mt-3 text-sm text-[#4b5563]">{description}</p> : null}
      {showLogout ? (
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/" className={actionButtonClassName}>
            메뉴판으로 이동
          </Link>
          <AdminLogoutButton className={actionButtonClassName} />
        </div>
      ) : null}
    </header>
  );
};

export default AdminPageHeader;
