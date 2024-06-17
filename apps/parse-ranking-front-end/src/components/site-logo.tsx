import Image from 'next/image';

export function SiteLogo() {
  return (
    <div className="w-10 h-10 relative">
      <Image
        src="/images/wow-token.png"
        fill={true}
        sizes="(max-width: 768px) 2rem, 2.5rem"
        alt="Logo"
      />
    </div>
  );
}
