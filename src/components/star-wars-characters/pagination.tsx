import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";

type PaginationProps = {
  page: number;
  setPage: (page: number) => void;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export function Pagination({
  page,
  setPage,
  hasNextPage,
  hasPreviousPage,
}: PaginationProps) {
  function incrementPage() {
    setPage(page + 1);
  }
  function decrementPage() {
    setPage(page - 1);
  }
  return (
    <div className="mx-auto mt-6 flex w-fit items-center gap-4">
      <Button
        variant="ghost"
        size="sm"
        onPress={decrementPage}
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
        onPress={incrementPage}
        isDisabled={!hasNextPage}
        className="gap-1 pr-1.5"
      >
        Next
        <ChevronRight className="size-4" />
      </Button>
    </div>
  );
}
