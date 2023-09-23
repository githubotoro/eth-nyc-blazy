export default function CanvasContainer({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`flex w-full flex-col items-center rounded-[12px] border-privy-color-foreground-4 md:overflow-hidden md:border ${className}`}
    >
      {children}
    </div>
  );
}
