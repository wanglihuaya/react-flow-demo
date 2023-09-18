import { Outlet } from '@umijs/max';

export default function Page() {
  return (
    <div
      style={{
        minHeight: 'calc(100vh - 175px)',
      }}
    >
      <Outlet />
    </div>
  );
}
