"use client";
import {
    Pagination as PaginationComponent,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@my-project/react-components";
import {cn} from "@my-project/react-components/lib/utils";
import {useRouter} from "next/navigation";
import type React from "react";

export const Pagination: React.FC<{
    className?: string;
    page: number;
    totalPages: number;
}> = (props) => {
    const router = useRouter();

    const {className, page, totalPages} = props;
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    const hasExtraPreviousPages = page - 1 > 1;
    const hasExtraNextPages = page + 1 < totalPages;

    return (
        <div className={cn("my-12", className)}>
            <PaginationComponent>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            disabled={!hasPreviousPage}
                            onClick={() => {
                                router.push(`/posts/page/${page - 1}`);
                            }}
                        />
                    </PaginationItem>

                    {hasExtraPreviousPages && (
                        <PaginationItem>
                            <PaginationEllipsis />
                        </PaginationItem>
                    )}

                    {hasPreviousPage && (
                        <PaginationItem>
                            <PaginationLink
                                onClick={() => {
                                    router.push(`/posts/page/${page - 1}`);
                                }}
                            >
                                {page - 1}
                            </PaginationLink>
                        </PaginationItem>
                    )}

                    <PaginationItem>
                        <PaginationLink
                            isActive
                            onClick={() => {
                                router.push(`/posts/page/${page}`);
                            }}
                        >
                            {page}
                        </PaginationLink>
                    </PaginationItem>

                    {hasNextPage && (
                        <PaginationItem>
                            <PaginationLink
                                onClick={() => {
                                    router.push(`/posts/page/${page + 1}`);
                                }}
                            >
                                {page + 1}
                            </PaginationLink>
                        </PaginationItem>
                    )}

                    {hasExtraNextPages && (
                        <PaginationItem>
                            <PaginationEllipsis />
                        </PaginationItem>
                    )}

                    <PaginationItem>
                        <PaginationNext
                            disabled={!hasNextPage}
                            onClick={() => {
                                router.push(`/posts/page/${page + 1}`);
                            }}
                        />
                    </PaginationItem>
                </PaginationContent>
            </PaginationComponent>
        </div>
    );
};
