import { SideNav } from './_components/side-nav';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="flex-grow pt-0 md:pt-6 p-6 md:overflow-y-auto md:p-12">
        {children}
      </div>
    </div>
  );
}
