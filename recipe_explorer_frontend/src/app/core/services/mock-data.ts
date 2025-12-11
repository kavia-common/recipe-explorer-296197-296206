import { RecipeDetail, RecipeSummary, SearchFilters, SearchResult } from '../models/recipe.models';

/**
 * Small inline SVG data URI used as a local placeholder for thumbnails.
 * Kept tiny and self-contained to avoid external network calls.
 */
const THUMB_PLACEHOLDER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="400" viewBox="0 0 640 400">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stop-color="%232563EB" stop-opacity=".10"/>
          <stop offset="1" stop-color="%23F9FAFB" stop-opacity="1"/>
        </linearGradient>
      </defs>
      <rect width="640" height="400" fill="url(#g)"/>
      <g fill="%23111827" fill-opacity=".7" font-family="Arial, Helvetica, sans-serif">
        <text x="50%" y="48%" text-anchor="middle" font-size="22">Recipe</text>
        <text x="50%" y="60%" text-anchor="middle" font-size="14">Sample image</text>
      </g>
    </svg>`
  );

/**
 * Expanded mock dataset (18 items) with diverse cuisines, diets, and metadata.
 * Note: Model currently only uses fields defined in RecipeDetail/RecipeSummary.
 * Extra descriptive fields (cuisine, diet, prepTime) are included in description/tags.
 */
const MOCK_RECIPES: RecipeDetail[] = [
  {
    id: '1',
    title: 'Lemon Herb Grilled Salmon',
    imageUrl: THUMB_PLACEHOLDER,
    tags: ['seafood', 'grill', 'healthy', 'mediterranean'],
    rating: 4.6,
    description: 'Succulent salmon marinated with lemon and fresh herbs, grilled to perfection. Cuisine: Mediterranean; Diet: Pescatarian; Prep: 15m.',
    ingredients: ['2 salmon fillets','1 lemon','2 tbsp olive oil','1 tsp sea salt','1 tsp black pepper','Fresh dill'],
    steps: ['Whisk lemon juice, olive oil, salt, pepper, and dill.','Marinate salmon for 15 minutes.','Grill skin-side down for 6-8 minutes until flaky.'],
    prepTimeMinutes: 15,
    cookTimeMinutes: 10,
    servings: 2,
    author: 'Chef Marina'
  },
  {
    id: '2',
    title: 'Creamy Mushroom Pasta',
    imageUrl: THUMB_PLACEHOLDER,
    tags: ['vegetarian', 'pasta', 'comfort', 'italian'],
    rating: 4.8,
    description: 'Al dente pasta coated in a rich, creamy mushroom sauce. Cuisine: Italian; Diet: Vegetarian; Prep: 10m.',
    ingredients: ['200g pasta','200g mixed mushrooms','1 cup cream','2 cloves garlic','Parmesan','Butter'],
    steps: ['Cook pasta until al dente.','Sauté mushrooms and garlic in butter.','Add cream and simmer; toss with pasta and parmesan.'],
    prepTimeMinutes: 10,
    cookTimeMinutes: 20,
    servings: 2,
    author: 'Chef Bella'
  },
  {
    id: '3',
    title: 'Citrus Avocado Salad',
    imageUrl: THUMB_PLACEHOLDER,
    tags: ['salad', 'vegan', 'fresh', 'gluten-free'],
    rating: 4.2,
    description: 'A refreshing salad with citrus segments, avocado, and a light vinaigrette. Diet: Vegan/Gluten-free; Prep: 12m.',
    ingredients: ['2 oranges','1 grapefruit','1 avocado','Mixed greens','Olive oil','Salt','Pepper'],
    steps: ['Segment citrus','Slice avocado','Dress greens and assemble'],
    prepTimeMinutes: 12,
    cookTimeMinutes: 0,
    servings: 2,
    author: 'Chef Green'
  },
  {
    id: '4',
    title: 'Spicy Chicken Tacos',
    imageUrl: THUMB_PLACEHOLDER,
    tags: ['chicken', 'spicy', 'mexican', 'street-food'],
    rating: 4.5,
    description: 'Juicy chicken seasoned with spices, served in warm tortillas with fresh toppings. Cuisine: Mexican; Prep: 15m.',
    ingredients: ['Chicken breast','Tortillas','Chili powder','Cumin','Lime','Cilantro'],
    steps: ['Season and cook chicken','Warm tortillas','Assemble with toppings'],
    prepTimeMinutes: 15,
    cookTimeMinutes: 15,
    servings: 3,
    author: 'Chef Rio'
  },
  {
    id: '5',
    title: 'Margherita Pizza',
    imageUrl: THUMB_PLACEHOLDER,
    tags: ['pizza', 'vegetarian', 'italian', 'baked'],
    rating: 4.7,
    description: 'Classic pizza with tomato, fresh mozzarella, and basil. Cuisine: Italian; Diet: Vegetarian; Prep: 20m.',
    ingredients: ['Pizza dough','Tomato sauce','Fresh mozzarella','Basil','Olive oil','Salt'],
    steps: ['Stretch dough','Spread sauce and toppings','Bake at high temp until bubbly'],
    prepTimeMinutes: 20, cookTimeMinutes: 12, servings: 2, author: 'Chef Napoli'
  },
  {
    id: '6',
    title: 'Thai Green Curry',
    imageUrl: THUMB_PLACEHOLDER,
    tags: ['thai', 'curry', 'spicy', 'gluten-free'],
    rating: 4.4,
    description: 'Coconut-based curry with green chilies, veggies, and your choice of protein. Cuisine: Thai; Prep: 15m.',
    ingredients: ['Green curry paste','Coconut milk','Chicken or tofu','Vegetables','Fish sauce','Basil'],
    steps: ['Fry paste','Add coconut milk and simmer','Add protein & veg; finish with basil'],
    prepTimeMinutes: 15, cookTimeMinutes: 20, servings: 3, author: 'Chef Suri'
  },
  {
    id: '7',
    title: 'Beef Stir-Fry with Broccoli',
    imageUrl: THUMB_PLACEHOLDER,
    tags: ['beef', 'stir-fry', 'asian', 'quick'],
    rating: 4.1,
    description: 'Tender beef with crisp broccoli in a savory sauce. Cuisine: Chinese-inspired; Prep: 10m.',
    ingredients: ['Beef strips','Broccoli florets','Soy sauce','Garlic','Ginger','Cornstarch'],
    steps: ['Marinate beef','Stir-fry beef and broccoli','Add sauce and thicken'],
    prepTimeMinutes: 10, cookTimeMinutes: 12, servings: 2, author: 'Chef Wok'
  },
  {
    id: '8',
    title: 'Shakshuka',
    imageUrl: THUMB_PLACEHOLDER,
    tags: ['eggs', 'breakfast', 'middle-eastern', 'vegetarian'],
    rating: 4.3,
    description: 'Poached eggs in a spiced tomato and pepper sauce. Cuisine: Middle Eastern; Diet: Vegetarian.',
    ingredients: ['Eggs','Tomatoes','Bell pepper','Onion','Garlic','Cumin','Paprika'],
    steps: ['Sauté veg & spices','Simmer tomatoes','Crack eggs and poach'],
    prepTimeMinutes: 10, cookTimeMinutes: 18, servings: 2, author: 'Chef Lev'
  },
  {
    id: '9',
    title: 'Quinoa Veggie Bowl',
    imageUrl: THUMB_PLACEHOLDER,
    tags: ['healthy', 'vegan', 'gluten-free', 'bowl'],
    rating: 4.0,
    description: 'Protein-packed quinoa with roasted veggies and tahini dressing. Diet: Vegan/Gluten-free.',
    ingredients: ['Quinoa','Mixed vegetables','Olive oil','Tahini','Lemon','Salt'],
    steps: ['Cook quinoa','Roast vegetables','Assemble and drizzle dressing'],
    prepTimeMinutes: 12, cookTimeMinutes: 20, servings: 2, author: 'Chef Fit'
  },
  {
    id: '10',
    title: 'Butter Chicken',
    imageUrl: THUMB_PLACEHOLDER,
    tags: ['indian', 'chicken', 'curry', 'comfort'],
    rating: 4.9,
    description: 'Creamy tomato-based curry with tender chicken. Cuisine: Indian; Prep: 20m.',
    ingredients: ['Chicken','Tomato puree','Cream','Butter','Garam masala','Garlic','Ginger'],
    steps: ['Marinate and cook chicken','Simmer sauce','Combine and finish with cream'],
    prepTimeMinutes: 20, cookTimeMinutes: 25, servings: 3, author: 'Chef Delhi'
  },
  {
    id: '11',
    title: 'Sushi Bowl',
    imageUrl: THUMB_PLACEHOLDER,
    tags: ['japanese', 'seafood', 'bowl', 'fresh'],
    rating: 4.1,
    description: 'Deconstructed sushi with rice, fish, and toppings. Cuisine: Japanese.',
    ingredients: ['Sushi rice','Salmon or tuna','Cucumber','Avocado','Soy sauce','Nori'],
    steps: ['Cook rice','Prepare toppings','Assemble bowl and season'],
    prepTimeMinutes: 15, cookTimeMinutes: 18, servings: 2, author: 'Chef Maki'
  },
  {
    id: '12',
    title: 'Falafel Wraps',
    imageUrl: THUMB_PLACEHOLDER,
    tags: ['vegan', 'middle-eastern', 'wrap', 'street-food'],
    rating: 4.3,
    description: 'Crispy falafels with tahini sauce wrapped in warm pita. Diet: Vegan.',
    ingredients: ['Chickpeas','Herbs','Spices','Pita','Tahini','Lemon','Garlic'],
    steps: ['Blend mixture','Fry or bake','Assemble wraps with sauce'],
    prepTimeMinutes: 25, cookTimeMinutes: 15, servings: 3, author: 'Chef Nura'
  },
  {
    id: '13',
    title: 'French Onion Soup',
    imageUrl: THUMB_PLACEHOLDER,
    tags: ['soup', 'french', 'comfort', 'vegetarian'],
    rating: 4.2,
    description: 'Deeply caramelized onions in rich broth, topped with cheesy toast. Cuisine: French.',
    ingredients: ['Onions','Butter','Beef or veg broth','Thyme','Baguette','Gruyère'],
    steps: ['Caramelize onions','Deglaze and simmer','Top with toast and broil'],
    prepTimeMinutes: 20, cookTimeMinutes: 40, servings: 3, author: 'Chef Lyon'
  },
  {
    id: '14',
    title: 'Caprese Salad',
    imageUrl: THUMB_PLACEHOLDER,
    tags: ['salad', 'italian', 'vegetarian', 'fresh'],
    rating: 3.9,
    description: 'Tomato, mozzarella, and basil drizzled with balsamic glaze. Cuisine: Italian.',
    ingredients: ['Tomatoes','Fresh mozzarella','Basil','Olive oil','Balsamic glaze','Salt'],
    steps: ['Slice tomatoes and mozzarella','Assemble with basil','Drizzle and season'],
    prepTimeMinutes: 8, cookTimeMinutes: 0, servings: 2, author: 'Chef Capri'
  },
  {
    id: '15',
    title: 'Veggie Fried Rice',
    imageUrl: THUMB_PLACEHOLDER,
    tags: ['rice', 'asian', 'vegetarian', 'quick'],
    rating: 4.0,
    description: 'Wok-tossed rice with mixed veggies and soy sauce. Cuisine: Chinese-inspired.',
    ingredients: ['Cooked rice','Carrots','Peas','Eggs (optional)','Soy sauce','Sesame oil'],
    steps: ['Scramble eggs (optional)','Stir-fry veg','Add rice & sauce, toss well'],
    prepTimeMinutes: 10, cookTimeMinutes: 10, servings: 2, author: 'Chef Pan'
  },
  {
    id: '16',
    title: 'BBQ Pulled Pork Sandwich',
    imageUrl: THUMB_PLACEHOLDER,
    tags: ['pork', 'bbq', 'american', 'sandwich'],
    rating: 4.5,
    description: 'Slow-cooked pork shoulder with tangy BBQ sauce in a soft bun. Cuisine: American.',
    ingredients: ['Pork shoulder','BBQ sauce','Buns','Cole slaw','Spices'],
    steps: ['Slow-cook pork','Shred and sauce','Assemble sandwiches'],
    prepTimeMinutes: 20, cookTimeMinutes: 240, servings: 6, author: 'Pitmaster Joe'
  },
  {
    id: '17',
    title: 'Tofu Stir-Fry with Peanut Sauce',
    imageUrl: THUMB_PLACEHOLDER,
    tags: ['tofu', 'vegan', 'stir-fry', 'protein'],
    rating: 4.1,
    description: 'Crispy tofu tossed in a creamy peanut sauce with veggies. Diet: Vegan.',
    ingredients: ['Firm tofu','Mixed vegetables','Peanut butter','Soy sauce','Lime','Garlic'],
    steps: ['Crisp tofu','Stir-fry veg','Toss with peanut sauce'],
    prepTimeMinutes: 12, cookTimeMinutes: 14, servings: 2, author: 'Chef Plant'
  },
  {
    id: '18',
    title: 'Blueberry Pancakes',
    imageUrl: THUMB_PLACEHOLDER,
    tags: ['breakfast', 'sweet', 'vegetarian', 'american'],
    rating: 4.6,
    description: 'Fluffy pancakes loaded with blueberries and served with maple syrup.',
    ingredients: ['Flour','Baking powder','Milk','Eggs','Blueberries','Butter','Maple syrup'],
    steps: ['Whisk batter','Fold in blueberries','Cook on griddle & serve'],
    prepTimeMinutes: 10, cookTimeMinutes: 12, servings: 3, author: 'Chef Maple'
  }
];

function delay<T>(ms: number, value: T): Promise<T> {
  return new Promise(resolve => (globalThis as any).setTimeout(() => resolve(value), ms));
}

/**
 * PUBLIC_INTERFACE
 * Returns a paginated search over the embedded mock recipes.
 * When query is empty and no filters are given, returns full list to support
 * showing default results on initial load.
 */
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

  // Slight delay to simulate network and show skeletons.
  return delay(300, { items, total, page, pageSize });
}

/**
 * PUBLIC_INTERFACE
 * Returns the full recipe details by id.
 */
export async function mockGetRecipe(id: string): Promise<RecipeDetail | undefined> {
  const found = MOCK_RECIPES.find(r => r.id === id);
  return delay(220, found);
}
