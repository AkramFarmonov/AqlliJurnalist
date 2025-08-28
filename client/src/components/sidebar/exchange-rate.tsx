import { useQuery } from "@tanstack/react-query";
import { DollarSign } from "lucide-react";

interface FxResp {
  rates?: { UZS?: number };
  success?: boolean;
}

export function ExchangeRate() {
  const { data, isLoading, error } = useQuery<FxResp>({
    queryKey: ["fx", "usd-uzs"],
    queryFn: async () => {
      const res = await fetch("https://api.exchangerate.host/latest?base=USD&symbols=UZS", { cache: "no-store" });
      if (!res.ok) throw new Error("FX fetch failed");
      return res.json();
    },
    refetchInterval: 10 * 60 * 1000, // 10 min
  });

  const rate = data?.rates?.UZS ?? 0;
  const formatted = rate ? new Intl.NumberFormat("uz-UZ").format(rate) : "-";

  return (
    <section className="bg-card border border-border rounded-xl p-4" data-testid="widget-exchange-rate">
      <div className="flex items-center gap-2 mb-2">
        <DollarSign className="text-primary" />
        <h3 className="text-sm font-semibold">Valyuta kursi</h3>
      </div>
      {isLoading ? (
        <div className="h-6 rounded bg-muted animate-pulse w-48" />
      ) : error ? (
        <p className="text-sm text-muted-foreground">Ma'lumot yuklanmadi</p>
      ) : (
        <p className="text-sm">
          1$ = <span className="font-semibold">{formatted}</span> so'm
        </p>
      )}
    </section>
  );
}
