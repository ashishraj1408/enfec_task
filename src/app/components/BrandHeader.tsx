import Image from 'next/image';

type BrandHeaderProps = {
  title?: string;
  action?: React.ReactNode;
  maxWidthClassName?: string;
};

export function BrandHeader({ title, action, maxWidthClassName = 'app-container' }: BrandHeaderProps) {
  return (
    <header className="app-header">
      <div className={`${maxWidthClassName} flex items-center justify-between gap-4 py-4`}>
        <div className="flex min-w-0 items-center gap-3">
          <span className="brand-logo" aria-hidden="true">
            <Image src="/enfeclogo.png" alt="" width={44} height={44} sizes="44px" />
          </span>
          <span className="truncate text-xl font-semibold tracking-normal text-gray-950">{title || 'InterviewAI'}</span>
        </div>
        {action}
      </div>
    </header>
  );
}
