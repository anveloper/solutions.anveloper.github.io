import { cn } from "@/lib/utils";

type PageContainerProps = {
  children: React.ReactNode;
  className?: string;
  /** 홈페이지처럼 전체 화면을 채우는 경우 true */
  fullHeight?: boolean;
};

export const PageContainer = ({ children, className, fullHeight = false }: PageContainerProps) => {
  return (
    <div
      className={cn(
        // 기본 패딩: NavBar 공간 확보
        "pt-28 pb-8 px-6",
        // 반응형 패딩
        "sm:px-8 md:px-12 lg:px-16 md:pt-20",
        // 높이 설정
        fullHeight ? "min-h-screen flex flex-col" : "min-h-screen",
        className
      )}
    >
      <div className={cn("w-full max-w-4xl mx-auto", fullHeight && "flex-1 flex flex-col")}>{children}</div>
    </div>
  );
};
