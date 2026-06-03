type AdminLogoutButtonProps = {
  className?: string;
};

const AdminLogoutButton = ({ className }: AdminLogoutButtonProps) => {
  return (
    <button
      type="button"
      className={
        className ??
        'rounded-lg border border-[#d7cec2] bg-[#f8f3ec] px-3 py-2 text-sm text-[#4b5563]'
      }
    >
      로그아웃
    </button>
  );
};

export default AdminLogoutButton;
