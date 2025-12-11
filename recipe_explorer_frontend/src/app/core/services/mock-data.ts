import { RecipeDetail, RecipeSummary, SearchFilters, SearchResult } from '../models/recipe.models';

const MOCK_RECIPES: RecipeDetail[] = [
  {
    id: '1',
    title: 'Lemon Herb Grilled Salmon',
    imageUrl: 'https://images.unsplash.com/photo-1604908554049-1e4d9b87b84d?q=80&w=1600&auto=format&fit=crop',
    tags: ['seafood', 'grill', 'healthy'],
    rating: 4.6,
    description: 'Succulent salmon marinated with lemon and fresh herbs, grilled to perfection.',
    ingredients: [
      '2 salmon fillets', '1 lemon', '2 tbsp olive oil', '1 tsp sea salt', '1 tsp black pepper', 'Fresh dill'
    ],
    steps: [
      'Whisk lemon juice, olive oil, salt, pepper, and dill.',
      'Marinate salmon for 15 minutes.',
      'Grill skin-side down for 6-8 minutes until flaky.'
    ],
    prepTimeMinutes: 15,
    cookTimeMinutes: 10,
    servings: 2,
    author: 'Chef Marina'
  },
  {
    id: '2',
    title: 'Creamy Mushroom Pasta',
    imageUrl: 'https://images.unsplash.com/photo-1525054098605-8e762c017741?q=80&w=1600&auto=format&fit=crop',
    tags: ['vegetarian', 'pasta', 'comfort'],
    rating: 4.8,
    description: 'Al dente pasta coated in a rich, creamy mushroom sauce.',
    ingredients: [
      '200g pasta', '200g mixed mushrooms', '1 cup cream', '2 cloves garlic', 'Parmesan', 'Butter'
    ],
    steps: [
      'Cook pasta until al dente.',
      'Sauté mushrooms and garlic in butter.',
      'Add cream and simmer; toss with pasta and parmesan.'
    ],
    prepTimeMinutes: 10,
    cookTimeMinutes: 20,
    servings: 2,
    author: 'Chef Bella'
  },
  {
    id: '3',
    title: 'Citrus Avocado Salad',
    imageUrl: 'https://images.unsplash.com/photo-1604908177221-bb6a42199d9b?q=80&w=1600&auto=format&fit=crop',
    tags: ['salad', 'vegan', 'fresh'],
    rating: 4.2,
    description: 'A refreshing salad with citrus segments, avocado, and a light vinaigrette.',
    ingredients: ['2 oranges', '1 grapefruit', '1 avocado', 'Mixed greens', 'Olive oil', 'Salt', 'Pepper'],
    steps: ['Segment citrus', 'Slice avocado', 'Dress greens and assemble'],
    prepTimeMinutes: 12,
    cookTimeMinutes: 0,
    servings: 2,
    author: 'Chef Green'
  },
  {
    id: '4',
    title: 'Spicy Chicken Tacos',
    imageUrl: 'https://images.unsplash.com/photo-1617195737497-5b818b0a68ef?q=80&w=1600&auto=format&fit=crop',
    tags: ['chicken', 'spicy', 'mexican'],
    rating: 4.5,
    description: 'Juicy chicken seasoned with spices, served in warm tortillas with fresh toppings.',
    ingredients: ['Chicken breast', 'Tortillas', 'Chili powder', 'Cumin', 'Lime', 'Cilantro'],
    steps: ['Season and cook chicken', 'Warm tortillas', 'Assemble with toppings'],
    prepTimeMinutes: 15,
    cookTimeMinutes: 15,
    servings: 3,
    author: 'Chef Rio'
  }
];

function delay<T>(ms: number, value: T): Promise<T> {
  return new Promise(resolve => (globalThis as any).setTimeout(() => resolve(value), ms));
}

export async function mockSearchRecipes(
  query: string,
  filters: SearchFilters | undefined,
  page: number,
  pageSize: number
): Promise<SearchResult> {
  const q = (query || '').toLowerCase().trim();
  let filtered: RecipeDetail[] = MOCK_RECIPES.slice();

  if (q) {
    filtered = filtered.filter(r =>
      r.title.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.tags.some(t => t.toLowerCase().includes(q))
    );
  }
  if (filters?.tags?.length) {
    filtered = filtered.filter(r => filters.tags!.every(t => r.tags.includes(t)));
  }
  if (typeof filters?.minRating === 'number') {
    filtered = filtered.filter(r => r.rating >= (filters!.minRating as number));
  }

  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const items = filtered.slice(start, start + pageSize).map<RecipeSummary>(r => ({
    id: r.id, title: r.title, imageUrl: r.imageUrl, tags: r.tags, rating: r.rating
  }));

  return delay(450, { items, total, page, pageSize });
}

export async function mockGetRecipe(id: string): Promise<RecipeDetail | undefined> {
  const found = MOCK_RECIPES.find(r => r.id === id);
  return delay(350, found);
}
