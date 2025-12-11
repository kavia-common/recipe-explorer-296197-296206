export interface RecipeSummary {
  id: string;
  title: string;
  imageUrl: string;
  tags: string[];
  rating: number; // 0 to 5
}

export interface RecipeDetail extends RecipeSummary {
  description: string;
  ingredients: string[];
  steps: string[];
  prepTimeMinutes?: number;
  cookTimeMinutes?: number;
  servings?: number;
  author?: string;
}

export interface SearchFilters {
  tags?: string[];
  minRating?: number;
}

export interface SearchResult {
  items: RecipeSummary[];
  total: number;
  page: number;
  pageSize: number;
}
