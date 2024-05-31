"use client";
import React from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

// Define the type of the children prop
type Props = {
  children: React.ReactNode;
};

const queryClient = new QueryClient();

const Providers = ({ children }: Props) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default Providers;