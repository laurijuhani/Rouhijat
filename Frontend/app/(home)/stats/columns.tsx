"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Player } from "@/types/database_types";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import "@/css/columns.css";
import Link from "next/link";

export const columns: ColumnDef<Player>[] = [
  {
    accessorKey: "number",
    cell : ({ row }) => { return row.original.number || "-"; },
    header: ({ column }) => {      
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}      
        >
          #
          {column.getIsSorted() ? (
            column.getIsSorted() === "asc" ? (
              <ArrowDown />
            ) : (
              <ArrowUp />
            )
          ) : (
            <ArrowUpDown className="arrow-icon" />
          )}
        </Button>
      );
    }
  },
  {
    accessorKey: "name",
    header: "Pelaaja",
    cell: ({ row }) => {
      return (
        <Link
          href={`/players/${row.original.id}`}
          className="hover:text-accent"
        >
          {row.original.name}
        </Link>   
      );
  },
  },
  {
    accessorKey: "games",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Ottelut 
          {column.getIsSorted() ? (
            column.getIsSorted() === "asc" ? (
              <ArrowDown />
            ) : (
              <ArrowUp />
            )
          ) : (
            <ArrowUpDown className="arrow-icon" />
          )}
        </Button>
      );
    }
  },
  {
    accessorKey: "points",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Pisteet
          {column.getIsSorted() ? (
            column.getIsSorted() === "asc" ? (
              <ArrowUp />
            ) : (
              <ArrowDown />
            )
          ) : (
            <ArrowUpDown className="arrow-icon" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => `${row.original.points.goals} + ${row.original.points.assists} = ${row.original.points.goals + row.original.points.assists}`,      
    sortingFn: (a, b) => {
      const totalPointsA = a.original.points.goals + a.original.points.assists;
      const totalPointsB = b.original.points.goals + b.original.points.assists;

      if (totalPointsA === totalPointsB) {
        return b.original.points.goals - a.original.points.goals;
      }

      return totalPointsB - totalPointsA; 
    },
  },
];
