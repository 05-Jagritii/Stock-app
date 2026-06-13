'use server';

import { Watchlist } from "@/app/database/models/watchlist.model";
import { connectToDatabase } from "@/app/database/mongoose";
import { auth } from "../better-auth/auth";
import { headers } from "next/headers";

export async function getWatchlistSymbolsByEmail(email: string): Promise<string[]> { 
    if(!email) return [];
    try {
        const mongoose = await connectToDatabase();
        const db = mongoose.connection.db;
        if(!db) throw new Error('MongoDB connedction not found'); 

        const user = await db.collection('user').findOne<{_id?: unknown, id?: string; email?: string}>(
            {email});

        if(!user) return [];

        const userId = (user.id as string) || String(user._id || '');
        if(!userId) return [];

        const items = await Watchlist.find({userId}, {symbol: 1}).lean();
        return items.map((i)=> String(i.symbol));
    } catch (error) {
        console.error('getWatchlistSymbolsByEmail error:',error);
        return [];
    }
}

export async function addToWatchlist(
  symbol: string,
  company: string
) {
  try {
    await connectToDatabase();

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    await Watchlist.findOneAndUpdate(
      {
        userId: session.user.id,
        symbol,
      },
      {
        userId: session.user.id,
        symbol,
        company,
      },
      {
        upsert: true,
        new: true,
      }
    );

    return { success: true };
  } catch (error) {
    console.error("addToWatchlist error:", error);

    return {
      success: false,
      error: "Failed to add stock",
    };
  }
}

export async function removeFromWatchlist(
  symbol: string
) {
  try {
    await connectToDatabase();

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    await Watchlist.deleteOne({
      userId: session.user.id,
      symbol,
    });

    return { success: true };
  } catch (error) {
    console.error("removeFromWatchlist error:", error);

    return {
      success: false,
      error: "Failed to remove stock",
    };
  }
}

export async function getUserWatchlist() {
  try {
    await connectToDatabase();

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) return [];

    const watchlist = await Watchlist.find({
      userId: session.user.id,
    }).lean();

    return JSON.parse(JSON.stringify(watchlist));
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function isStockInWatchlist(symbol: string) {
  try {
    await connectToDatabase();

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) return false;

    const item = await Watchlist.findOne({
      userId: session.user.id,
      symbol: symbol.toUpperCase(),
    });

    return !!item;
  } catch (error) {
    console.error(error);
    return false;
  }
}