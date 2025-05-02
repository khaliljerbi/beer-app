import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSelector } from "@xstate/react";
import { ArrowLeft, ShoppingBag, ShoppingCart, Trash2 } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import { cartActor } from "../actors";

const BeerCartPage: React.FC = () => {
  const cartItems = useSelector(cartActor, (state) => state.context.items);

  const handleRemoveFromCart = (id: number) => {
    cartActor.send({ type: "REMOVE_FROM_CART", id });
  };

  const handleClearCart = () => {
    cartActor.send({ type: "CLEAR_CART" });
  };

  const renderEmptyCart = () => (
    <div className="text-center py-16">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
        <ShoppingCart className="h-8 w-8 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
      <p className="text-muted-foreground mb-6">
        Looks like you haven't added any beers yet
      </p>
      <Link to="/">
        <Button className="bg-amber-600 hover:bg-amber-700">
          <ShoppingBag className="mr-2 h-4 w-4" />
          Browse Beers
        </Button>
      </Link>
    </div>
  );

  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-6">
        <Link
          to="/"
          className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Continue Shopping
        </Link>

        <h1 className="text-3xl font-bold">Your Beer Cart 🍺</h1>

        {cartItems.length > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="text-red-500 border-red-200 hover:text-red-600 hover:bg-red-50"
              >
                <Trash2 className="mr-1 h-4 w-4" />
                Clear Cart
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear your cart?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will remove all items from your cart. This action cannot
                  be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleClearCart}
                  className="bg-red-500 hover:bg-red-600"
                >
                  Clear Cart
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      <Separator className="mb-6" />

      {cartItems.length === 0 ? (
        renderEmptyCart()
      ) : (
        <div className="w-full">
          <Card>
            <CardHeader className="px-6">
              <CardTitle>Shopping Cart</CardTitle>
              <CardDescription>
                {cartItems.length} {cartItems.length === 1 ? "item" : "items"}{" "}
                in your cart
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Beer</TableHead>

                    <TableHead className="w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cartItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="h-16 w-16 flex-shrink-0">
                            <img
                              src={`${import.meta.env.VITE_PUBLIC_API}/images/${item.beer.image}`}
                              alt={item.beer.name}
                              className="h-16 w-full object-contain"
                            />
                          </div>
                          <div>
                            <Link
                              to={`/beer/${item.id}`}
                              className="font-medium hover:underline"
                            >
                              {item.beer.name}
                            </Link>
                            <div className="text-sm text-muted-foreground">
                              {item.beer.volume.value} {item.beer.volume.unit}
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveFromCart(item.id)}
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default BeerCartPage;
