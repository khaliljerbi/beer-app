import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useSelector } from "@xstate/react";
import { ArrowLeft, FlaskRound, Info, ShoppingCart } from "lucide-react";
import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { beerActor, cartActor } from "../actors";

const BeerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const selectedBeer = useSelector(
    beerActor,
    (state) => state.context.selectedBeer
  );
  const loading = useSelector(beerActor, (state) => state.context.loading);
  const cartItems = useSelector(cartActor, (state) => state.context.items);

  const isInCart = selectedBeer
    ? cartItems.some((item) => item.id === selectedBeer.id)
    : false;

  useEffect(() => {
    if (id) {
      beerActor.send({ type: "SELECT_BEER", id: parseInt(id, 10) });
    }
  }, [id]);

  const handleAddToCart = () => {
    if (selectedBeer) {
      cartActor.send({ type: "ADD_TO_CART", beer: selectedBeer });
    }
  };

  const handleRemoveFromCart = () => {
    if (selectedBeer) {
      cartActor.send({ type: "REMOVE_FROM_CART", id: selectedBeer.id });
    }
  };

  // Loading skeleton
  const renderLoading = () => (
    <div className="container py-8">
      <div className="flex items-center space-x-2 mb-6">
        <Skeleton className="h-8 w-24" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex justify-center">
          <Skeleton className="h-64 w-36 rounded-lg" />
        </div>

        <div className="md:col-span-2 space-y-4">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-4 w-1/2" />

          <div className="flex flex-wrap gap-2 mt-4">
            <Skeleton className="h-8 w-16 rounded-full" />
            <Skeleton className="h-8 w-20 rounded-full" />
            <Skeleton className="h-8 w-24 rounded-full" />
          </div>

          <Skeleton className="h-24 w-full mt-6" />
          <Skeleton className="h-10 w-36 rounded" />
        </div>
      </div>
    </div>
  );

  if (loading || !selectedBeer) {
    return renderLoading();
  }

  return (
    <div className="container py-8">
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Beer List
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex justify-center">
          <div className="relative">
            <img
              src={`${import.meta.env.VITE_PUBLIC_API}/images/${selectedBeer.image}`}
              alt={selectedBeer.name}
              className="h-64 object-contain transition-all duration-500 hover:scale-105"
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold mb-2">{selectedBeer.name}</h1>
          <p className="text-muted-foreground italic mb-4">
            {selectedBeer.tagline}
          </p>

          <div className="flex flex-wrap gap-2 mb-6">
            <Badge variant="outline" className="bg-amber-50">
              ABV: {selectedBeer.abv}%
            </Badge>
            <Badge variant="outline" className="bg-amber-50">
              IBU: {selectedBeer.ibu}
            </Badge>
            <Badge variant="outline" className="bg-amber-50">
              First Brewed: {selectedBeer.first_brewed}
            </Badge>
            <Badge variant="outline" className="bg-amber-50">
              Volume: {selectedBeer.volume.value} {selectedBeer.volume.unit}
            </Badge>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2 flex items-center">
              <Info className="mr-2 h-5 w-5" />
              Description
            </h2>
            <p className="text-muted-foreground">{selectedBeer.description}</p>
          </div>

          {isInCart ? (
            <Button
              onClick={handleRemoveFromCart}
              variant="destructive"
              className="mb-4"
            >
              Remove from Cart
            </Button>
          ) : (
            <Button
              onClick={handleAddToCart}
              className="mb-4 bg-amber-600 hover:bg-amber-700"
            >
              <ShoppingCart className="mr-1 h-4 w-4" />
              Add to Cart
            </Button>
          )}
        </div>
      </div>

      <Separator className="my-8" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FlaskRound className="mr-2 h-5 w-5" />
              Ingredients
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Malt</h3>
              <ul className="list-disc pl-5 text-muted-foreground">
                {selectedBeer.ingredients.malt.map((malt, index) => (
                  <li key={index} className="mb-1">
                    {malt.name} - {malt.amount.value} {malt.amount.unit}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Hops</h3>
              <ul className="list-disc pl-5 text-muted-foreground">
                {selectedBeer.ingredients.hops.map((hop, index) => (
                  <li key={index} className="mb-1">
                    {hop.name} - {hop.amount.value} {hop.amount.unit}({hop.add},{" "}
                    {hop.attribute})
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Yeast</h3>
              <p className="text-muted-foreground">
                {selectedBeer.ingredients.yeast}
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="bg-amber-50">
            <CardHeader className="pb-3">
              <CardTitle>Brewer's Tips</CardTitle>
              <CardDescription>
                Expert advice from our master brewers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="italic text-muted-foreground">
                "{selectedBeer.brewers_tips}"
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Food Pairing</CardTitle>
              <CardDescription>
                Perfect companions for this beer
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 text-muted-foreground">
                {selectedBeer.food_pairing.map((food, index) => (
                  <li key={index} className="mb-1">
                    {food}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BeerDetailPage;
