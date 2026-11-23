import { useEffect, useState } from "react";
import { api, type ApiCategory } from "./api";
import { CATEGORIES } from "../data/categories";

const STATIC: ApiCategory[] = CATEGORIES.map((c) => ({ id: c.id, label: c.label, description: c.description, count: 0 }));

/** Categories with counts. Starts from the bundled list so the UI renders at once, then refreshes. */
export function useCategories(): ApiCategory[] {
  const [categories, setCategories] = useState<ApiCategory[]>(STATIC);
  useEffect(() => {
    let live = true;
    api.getCategories().then((list) => {
      if (live) setCategories(list);
    });
    return () => {
      live = false;
    };
  }, []);
  return categories;
}
