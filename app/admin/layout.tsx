import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const store = await cookies();
  if (!store.get('admin_session')?.value) redirect('/auth');
  return <>{children}</>;
}
