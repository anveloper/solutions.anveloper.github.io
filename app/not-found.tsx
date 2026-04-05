import { PageContainer } from "@/components/page-container";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <PageContainer>
      <div className="py-24 flex flex-col items-center text-center">
        <p className="text-6xl font-bold text-muted-foreground/30 mb-6">404</p>
        <h1 className="text-2xl font-bold text-foreground mb-2">페이지를 찾을 수 없습니다</h1>
        <p className="text-muted-foreground mb-8">요청하신 페이지가 존재하지 않거나 삭제되었습니다.</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>홈으로 돌아가기</span>
        </Link>
      </div>
    </PageContainer>
  );
}
