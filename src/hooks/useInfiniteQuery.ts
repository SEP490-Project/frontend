import { useEffect, useState, useCallback, useMemo } from "react";

interface InfiniteQueryOptions<T, Q = any> {
  fetchFn: (params: Q) => Promise<{ data: T[]; pagination: any }>;
  queryParams?: Q;
  pageSize?: number;
  searchKey?: string;
}

export function useInfiniteQuery<T, Q = any>({
  fetchFn,
  queryParams,
  pageSize = 10,
  searchKey = "",
}: InfiniteQueryOptions<T, Q>) {
  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(searchKey);

  const queryParamsString = useMemo(() => JSON.stringify(queryParams), [queryParams]);

  // Reset when search changes
  useEffect(() => {
    setItems([]);
    setPage(1);
    setHasMore(true);
  }, [search, queryParamsString]);

  // Fetch data
  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = {
          ...(queryParams as any),
          page,
          limit: pageSize,
          ...(search ? { keywords: search } : {}),
        };
        const res = await fetchFn(params);
        if (!cancelled) {
          setItems((prev) => (page === 1 ? res.data : [...prev, ...res.data]));
          setHasMore(res.pagination?.has_next ?? false);
        }
      } catch {
        if (!cancelled) setHasMore(false);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchData();
    return () => {
      cancelled = true;
    };
  }, [fetchFn, page, pageSize, search, queryParamsString]);

  const loadMore = useCallback(() => {
    if (hasMore && !loading) setPage((p) => p + 1);
  }, [hasMore, loading]);

  return {
    items,
    loading,
    hasMore,
    setSearch,
    search,
    loadMore,
    setPage,
    page,
  };
}
