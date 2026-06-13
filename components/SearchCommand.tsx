'use client';

import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../components/ui/command";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Loader2, Star, TrendingUp } from "lucide-react";
import Link from "next/link";
import { searchStocks } from "@/lib/actions/finnhub.actions";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";


export default function SearchCommand({renderAs = 'button', label = 'Add stock', initialStocks}:SearchCommandProps){
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [stocks,setStocks] = useState<StockWithWatchlistStatus[]>(initialStocks);

    const isSearchMode = !!searchTerm.trim();
    const displayStocks = isSearchMode ? stocks : stocks?.slice(0,10);

    useEffect(()=>{
        const onKeyDown = (e: KeyboardEvent)=>{
            if((e.metaKey || e.ctrlKey) && e.key.toLowerCase()==='k'){
                e.preventDefault()
                setOpen(v=>!v)
            }
        }

        window.addEventListener("keydown", onKeyDown)
        return()=> window.removeEventListener('keydown',onKeyDown)
    },[])

    const handleSearch = async()=>{
        if(!isSearchMode) return setStocks(initialStocks);

        setLoading(true)
        try {
            const results = await searchStocks(searchTerm.trim());
            setStocks(results);
        } catch {
            setStocks([])
        } finally {
            setLoading(false);
        }
    }

    const debouncedSearch = useDebounce(handleSearch,300);

    useEffect(()=>{
        debouncedSearch();
    },[searchTerm])

    const handleSelectStock = ()=>{
        setOpen(false);
        setSearchTerm("");
        setStocks(initialStocks);
    }

    return(
        <>
        {renderAs === 'text' ? (
            <span onClick={()=> setOpen(true)} className="search-text">
                {label}
            </span>
        ) : (
            <Button onClick={()=> setOpen(true)} className="search-btn">
                {label}
            </Button>
        )}
        <CommandDialog
  open={open}
  onOpenChange={setOpen}
  className={cn(
    "top-20 translate-y-0 overflow-hidden rounded-4xl! p-0",
  )}
>
            <Command>
                <div className="border-b border-zinc-800">
                    <CommandInput 
                    
                    value={searchTerm} 
                    onValueChange={setSearchTerm} 
                    placeholder="Search stocks..." 
                    className="
    bg-transparent
    border-none
    focus:outline-none
    text-white
    placeholder:text-gray-500
  "/>
                    {loading && <Loader2 className="search-loader animate-spin"/>}
                    </div>
        
        <CommandList
  className="
    max-h-125
    overflow-y-auto
    scrollbar-thin
    scrollbar-thumb-zinc-700
    scrollbar-track-transparent
  "
>
            {loading ? (
                <CommandEmpty className="search-list-empty">Loading stocks...</CommandEmpty>
            ): displayStocks?.length === 0 ? (
                <div className="search-list-indicator">
                    {isSearchMode ? 'No results found' : 'No stocks available'}
                </div>
            ): (
                <ul>
                    <div className="search-count">
                        {isSearchMode ? 'Search results' : 'Popular stocks'}{` `}
                        ({displayStocks?.length || 0})
                    </div>
                    {displayStocks?.map((stock,i)=>(
                        <li
  key={stock.symbol}
  className="
    group
    rounded-lg
    transition-all
    duration-200
    hover:bg-[#044967]
    hover:shadow-lg
    hover:shadow-yellow-500/5
  "
>
                            <Link
  href={`/stocks/${stock.symbol}`}
  onClick={() => handleSelectStock(stock.symbol)}
  className="
    flex
    items-center
    gap-3
    p-3
    rounded-lg
    transition-all
    duration-200
  "
>
                                <TrendingUp
  className="
    h-4
    w-4
    text-gray-500
    group-hover:text-yellow-400
    transition-colors
  "
/>
                                <div className="flex-1">
                                    <div
  className="
    text-white
    font-medium
    group-hover:text-yellow-400
    transition-colors
  "
>
                                        {stock.name}
                                    </div>
                                    <div className="text-sm text-gray-400">
                                        {stock.symbol} | {stock.exchange} | {stock.type}
                                    </div>
                                </div>
                                <Star/>
                            </Link>

                        </li>
                    ))}
                </ul>
            )}
        </CommandList>
        </Command>
        </CommandDialog>
        </>
    )
}