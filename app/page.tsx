import { getAllSolutions } from "@/_solutions";
import { SolutionItems } from "@/app/solutions/solution-items";
import { PageContainer } from "@/components/page-container";
import { Pagination } from "@/components/pagination";

const PAGE_SIZE = 30;

export default async function HomePage() {
  const solutions = await getAllSolutions();
  const totalPages = Math.ceil(solutions.length / PAGE_SIZE);
  const paged = solutions.slice(0, PAGE_SIZE);

  return (
    <PageContainer>
      <header className="mb-10">
        <h1 className="text-xl font-semibold text-foreground tracking-tight">Solutions</h1>
        <p className="text-sm text-muted-foreground mt-1">알고리즘 문제 풀이</p>
      </header>

      <SolutionItems solutions={paged} />
      <Pagination currentPage={1} totalPages={totalPages} basePath="" />
    </PageContainer>
  );
}
