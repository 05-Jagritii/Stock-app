import { getUserWatchlist } from "@/lib/actions/watchlist.actions";
import { isStockInWatchlist } from "@/lib/actions/watchlist.actions";

const WatchlistPage = async () => {
  const watchlist = await getUserWatchlist();

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">
          My Watchlist
        </h1>

        <p className="text-gray-400 mb-8">
          Track your favorite stocks here.
        </p>

        <div className="rounded-xl border border-gray-800 bg-gray-800 p-6">
          {watchlist.length === 0 ? (
            <p className="text-gray-400">
              No stocks added to your watchlist yet.
            </p>
          ) : (
            <div className="space-y-3">
              {watchlist.map((stock: any) => (
                <div
                  key={stock._id}
                  className="flex items-center justify-between border-b border-gray-800 pb-3"
                >
                  <div>
                    <h3 className="text-white font-semibold">
                      {stock.symbol}
                    </h3>

                    <p className="text-gray-400 text-sm">
                      {stock.company}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default WatchlistPage;