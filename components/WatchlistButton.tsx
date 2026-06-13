'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import {
  addToWatchlist,
  removeFromWatchlist,
} from "@/lib/actions/watchlist.actions";

interface WatchlistButtonProps {
  symbol: string;
  company: string;
  isInWatchlist?: boolean;
}

export default function WatchlistButton({
  symbol,
  company,
  isInWatchlist = false,
}: WatchlistButtonProps) {
  const [inWatchlist, setInWatchlist] = useState(isInWatchlist);
  const [loading, setLoading] = useState(false);

  const handleWatchlist = async () => {
  try {
    setLoading(true);

    if (inWatchlist) {
      const result = await removeFromWatchlist(symbol);

      if (result.success) {
        setInWatchlist(false);
      }
    } else {
      const result = await addToWatchlist(
        symbol,
        company
      );

      if (result.success) {
        setInWatchlist(true);
      }
    }
  } catch (error) {
    console.error("Watchlist error:", error);
  } finally {
    setLoading(false);
  }
};

  return (
    <Button
  onClick={handleWatchlist}
  disabled={loading}
  className="flex items-center gap-2"
>
  {inWatchlist ? (
    <>
      <BookmarkCheck className="h-4 w-4" />
      Remove from Watchlist
    </>
  ) : (
    <>
      <Bookmark className="h-4 w-4" />
      Add to Watchlist
    </>
  )}
</Button>
  );
}