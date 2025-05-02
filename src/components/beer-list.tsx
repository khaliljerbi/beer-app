import { Skeleton } from "@/components/ui/skeleton";
import { CartItem } from "@/types/cart";
import React from "react";
import { Beer } from "../types/beer";
import BeerCard from "./beer-card";

interface BeerListProps {
  beers: Beer[];
  cartItems: CartItem[];
  onAddToCart: (beer: Beer) => void;
  onRemoveFromCart: (id: number) => void;
  loading: boolean;
}

const BeerList: React.FC<BeerListProps> = ({
  beers,
  cartItems,
  onAddToCart,
  onRemoveFromCart,
  loading,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="flex flex-col space-y-3">
            <Skeleton className="h-52 w-full rounded-lg" />
            <Skeleton className="h-6 w-3/4 mx-auto" />
            <Skeleton className="h-4 w-2/3 mx-auto" />
            <div className="pt-3 space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (beers.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">
          No beers found. Try a different search.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {beers.map((beer) => {
        const isInCart = cartItems.some((item) => item.id === beer.id);

        return (
          <BeerCard
            key={beer.id}
            beer={beer}
            isInCart={isInCart}
            onAddToCart={() => onAddToCart(beer)}
            onRemoveFromCart={() => onRemoveFromCart(beer.id)}
          />
        );
      })}
    </div>
  );
};

export default BeerList;
