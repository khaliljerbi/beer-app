import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Beer } from "@/types/beer";
import { Info, MinusCircle, PlusCircle } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

interface BeerCardProps {
  beer: Beer;
  isInCart: boolean;
  onAddToCart: () => void;
  onRemoveFromCart: () => void;
}

const BeerCard: React.FC<BeerCardProps> = ({
  beer,
  isInCart,
  onAddToCart,
  onRemoveFromCart,
}) => {
  return (
    <Card className="h-full flex flex-col justify-between overflow-hidden transition-all hover:shadow-lg">
      <div className="flex flex-col flex-1">
        <CardHeader className="pt-6 pb-0 px-4 text-center">
          <div className="aspect-[2/3] flex justify-center mb-2">
            <img
              src={`${import.meta.env.VITE_PUBLIC_API}/images/${beer.image}`}
              alt={beer.name}
              className="h-96 object-cover transition-transform hover:scale-105 duration-300 md:h-80"
            />
          </div>
          <h3 className="font-semibold text-lg leading-tight min-h-[3rem]">
            {beer.name}
          </h3>
          <p className="text-muted-foreground text-sm italic min-h-[2rem]">
            {beer.tagline}
          </p>
        </CardHeader>

        <CardContent className="p-4 mt-auto">
          <div className="flex items-center justify-center gap-2">
            <Badge variant="outline" className="bg-amber-50">
              {beer.abv}% ABV
            </Badge>
            <Badge variant="outline" className="bg-amber-50">
              {beer.volume.value} {beer.volume.unit}
            </Badge>
          </div>
        </CardContent>
      </div>

      <CardFooter className="flex flex-col space-y-2 p-4 pt-0">
        <Link to={`/beer/${beer.id}`} className="w-full">
          <Button
            variant="outline"
            className="w-full flex items-center justify-center cursor-pointer"
          >
            <Info className="mr-1 h-4 w-4" />
            View Details
          </Button>
        </Link>

        {isInCart ? (
          <Button
            onClick={onRemoveFromCart}
            variant="destructive"
            className="w-full cursor-pointer"
          >
            <MinusCircle className="mr-1 h-4 w-4" />
            Remove from Cart
          </Button>
        ) : (
          <Button
            onClick={onAddToCart}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white cursor-pointer"
          >
            <PlusCircle className="mr-1 h-4 w-4" />
            Add to Cart
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default BeerCard;
