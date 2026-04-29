import Image from "next/image";

export default function BrandedLoader() {
  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-background/95 backdrop-blur-sm"
      aria-busy="true"
      aria-label="Loading"
    >
      <div className="perspective-[900px]">
        <Image
          src="/images/logo.svg"
          alt="Shweta Foods logo"
          width={120}
          height={120}
          className="animate-logo-3d drop-shadow-[0_14px_24px_rgba(0,0,0,0.2)]"
          priority
        />
      </div>
    </div>
  );
}
