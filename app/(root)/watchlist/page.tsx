const WatchlistPage = () => {
  return (
    <main className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">
          My Watchlist
        </h1>

        <p className="text-gray-400 mb-8">
          Track your favorite stocks here.
        </p>

        <div className="rounded-xl border border-gray-800 bg-[#141414] p-6">
          <p className="text-gray-400">
            No stocks added to your watchlist yet.
          </p>
        </div>
      </div>
    </main>
  );
};

export default WatchlistPage;