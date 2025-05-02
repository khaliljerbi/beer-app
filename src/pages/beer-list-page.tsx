import BeerList from "@/components/beer-list";
import PageSizeSelector from "@/components/page-size-selector";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSelector } from "@xstate/react";
import { Loader2 } from "lucide-react";
import React, { useEffect } from "react";
import { beerActor, cartActor } from "../actors";
import SearchBar from "../components/search-bar";
import { Beer } from "../types/beer";

const BeerListPage: React.FC = () => {
  const beers = useSelector(beerActor, (state) => state.context.beers);
  const perPage = useSelector(beerActor, (state) => state.context.perPage);
  const searchTerm = useSelector(
    beerActor,
    (state) => state.context.searchTerm
  );
  const loading = useSelector(beerActor, (state) => state.context.loading);
  const hasMore = useSelector(beerActor, (state) => state.context.hasMore);
  const cartItems = useSelector(cartActor, (state) => state.context.items);

  useEffect(() => {
    if (beers.length === 0) {
      beerActor.send({ type: "FETCH_BEERS" });
    }
  }, [beers.length]);

  const handleLoadMore = () => {
    beerActor.send({ type: "LOAD_MORE" });
  };

  const handleSearch = (term: string) => {
    beerActor.send({ type: "SEARCH", term });
  };

  const handlePageSizeChange = (size: number) => {
    beerActor.send({ type: "SET_PAGE_SIZE", size });
  };

  const handleAddToCart = (beer: Beer) => {
    cartActor.send({ type: "ADD_TO_CART", beer });
  };

  const handleRemoveFromCart = (id: number) => {
    cartActor.send({ type: "REMOVE_FROM_CART", id });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="space-y-2 text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Explore Our Beer Collection 🍺
        </h1>
        <p className="text-muted-foreground">
          Browse our selection of fine craft beers from around the world
        </p>
      </div>

      <SearchBar onSearch={handleSearch} initialValue={searchTerm} />

      <Separator className="my-6" />

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          {searchTerm ? `Search Results for "${searchTerm}"` : "All Beers"}
        </h2>
        <PageSizeSelector
          currentSize={perPage}
          onSizeChange={handlePageSizeChange}
        />
      </div>

      <BeerList
        beers={beers}
        cartItems={cartItems}
        onAddToCart={handleAddToCart}
        onRemoveFromCart={handleRemoveFromCart}
        loading={loading && beers.length === 0}
      />

      {beers.length === 0 && !loading && (
        <div className="text-center py-8">
          <p className="text-lg text-muted-foreground">
            No beers found. Try a different search.
          </p>
        </div>
      )}

      {beers.length > 0 && (
        <div className="flex flex-col items-center mt-8">
          <div className="text-sm text-muted-foreground mb-4">
            Showing {beers.length} beers
          </div>

          {hasMore && (
            <Button
              variant="outline"
              onClick={handleLoadMore}
              disabled={loading}
              className="min-w-[150px]"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                "Load More"
              )}
            </Button>
          )}

          {!hasMore && beers.length > 5 && (
            <p className="text-sm text-muted-foreground mt-2">
              You've reached the end of the list!
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default BeerListPage;
