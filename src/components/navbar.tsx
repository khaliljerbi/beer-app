import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { useSelector } from "@xstate/react";
import { ShoppingCart } from "lucide-react";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cartActor } from "../actors";

const Navbar: React.FC = () => {
  const location = useLocation();
  const cartItems = useSelector(cartActor, (state) => state.context.items);
  const cartItemCount = cartItems.length;

  return (
    <div className="sticky top-0 z-10 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="p-4 flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center">
          <span className="mr-2 text-2xl">🍺</span>
          <span className="font-bold text-xl">Beer Lover</span>
        </Link>

        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link to="/">
                <NavigationMenuLink
                  className={`px-4 py-2 ${
                    location.pathname === "/"
                      ? "font-medium text-primary"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  Beer List
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link to="/cart">
                <Button variant="ghost" className="relative">
                  <ShoppingCart className="h-5 w-5 mr-1" />
                  Cart
                  {cartItemCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-2 -right-2 px-2 py-1 text-xs"
                    >
                      {cartItemCount}
                    </Badge>
                  )}
                </Button>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
};

export default Navbar;
