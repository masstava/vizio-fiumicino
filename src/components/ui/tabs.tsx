"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/src/lib/utils";

// Primitiva Tabs in stile shadcn/ui su Radix, pensata per la
// navigazione fra le macro-categorie del menu pubblico.
//
// Aspetto volutamente sobrio: sottolineatura della scheda attiva
// invece del riquadro pieno del default shadcn, per restare in linea
// con il resto del sito.

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      // overflow-y-hidden esplicito, non solo "niente scritto": per
      // spec CSS, se un asse è auto/scroll/hidden e l'altro resta
      // "visible" (il default), il browser computa "visible" come se
      // fosse "auto" — un solo pixel di differenza fra scrollHeight e
      // clientHeight (arrotondamento tipico con un bordo sotto)
      // bastava a far comparire una barra verticale su una barra di
      // sole quattro voci, che non ne ha mai avuto bisogno.
      "flex items-center gap-6 overflow-x-auto overflow-y-hidden border-b border-border",
      className,
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "-mb-px shrink-0 whitespace-nowrap border-b-2 border-transparent pb-3 pt-1",
      "font-sans text-sm text-muted-foreground transition-colors",
      "hover:text-foreground",
      "data-[state=active]:border-primary data-[state=active]:text-foreground",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      className,
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "pt-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      className,
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
