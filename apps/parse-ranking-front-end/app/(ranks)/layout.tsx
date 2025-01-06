import { Header } from '../../src/components/header';
import { SidebarNav } from './_components/sidebar-nav';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="max-w-screen-xl py-2 mx-auto px-4 sm:px-6 lg:px-8">
        <aside className="w-[18rem] hidden lg:block flex-shrink-0 fixed overflow-y-auto bottom-0 right-auto top-16 stable-scrollbar-gutter">
          <SidebarNav />
        </aside>
        <div className="lg:pl-[20rem] h-full">{children}</div>
      </main>
    </>
  );
}
