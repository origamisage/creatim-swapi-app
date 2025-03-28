import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type PaginationProps = {
  page: number;
  onNext: () => void;
  onPrevious: () => void;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export function Pagination({
  page,
  onNext,
  onPrevious,
  hasNextPage,
  hasPreviousPage,
}: PaginationProps) {
  return (
    <div className="mt-8 flex items-center justify-center gap-4">
      <Button
        variant="ghost"
        size="sm"
        onPress={onPrevious}
        isDisabled={!hasPreviousPage}
        className="gap-1 pl-1.5"
      >
        <ChevronLeft className="size-4" />
        <span>Previous</span>
      </Button>
      <p>
        Page: <span className="font-bold">{page}</span>
      </p>
      <Button
        variant="ghost"
        size="sm"
        onPress={onNext}
        isDisabled={!hasNextPage}
        className="gap-1 pr-1.5"
      >
        Next
        <ChevronRight className="size-4" />
      </Button>
    </div>
  );
}
