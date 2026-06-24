export function ProductSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full">
      <div className="relative h-64 w-full skeleton" />
      <div className="flex flex-col flex-1 p-4 space-y-3">
        <div className="flex justify-between items-start">
          <div className="h-5 w-3/4 skeleton" />
          <div className="h-4 w-16 skeleton" />
        </div>
        <div className="h-4 w-full skeleton" />
        <div className="h-4 w-2/3 skeleton" />
        <div className="flex justify-between items-center pt-2">
          <div className="h-6 w-20 skeleton" />
          <div className="h-5 w-16 skeleton" />
        </div>
        <div className="h-10 w-full skeleton mt-auto" />
        <div className="h-10 w-full skeleton" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
}
