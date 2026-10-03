import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

interface ProductsPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolved = searchParams ? await searchParams : {};
  const params = new URLSearchParams();

  Object.entries(resolved).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => params.append(key, v));
    } else if (value !== undefined) {
      params.set(key, value);
    }
  });

  const qs = params.toString();
  redirect(qs ? `/shop?${qs}` : "/shop");
}
