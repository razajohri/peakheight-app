// Nutrition items data for supplements and other categories

export const NUTRITION_ITEMS = [
  // SUPPLEMENTS
  {
    id: 'supp-001',
    name: 'Vitamin D3',
    categoryId: 'supplements',
    type: 'Vitamin',
    dosage: '1000-2000 IU daily',
    benefits: ['Bone health', 'Calcium absorption', 'Immune support'],
    description: 'Essential for calcium absorption and bone mineralization. Crucial for height growth during development.',
    growthScore: 95,
    bestTime: 'Morning with food',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop'
  },
  {
    id: 'supp-002',
    name: 'Calcium Citrate',
    categoryId: 'supplements',
    type: 'Mineral',
    dosage: '500-1000mg daily',
    benefits: ['Bone strength', 'Muscle function', 'Nerve transmission'],
    description: 'Highly absorbable form of calcium essential for bone development and growth.',
    growthScore: 92,
    bestTime: 'Evening with food',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=300&fit=crop'
  },
  {
    id: 'supp-003',
    name: 'Magnesium Glycinate',
    categoryId: 'supplements',
    type: 'Mineral',
    dosage: '200-400mg daily',
    benefits: ['Bone health', 'Sleep quality', 'Muscle relaxation'],
    description: 'Supports bone mineralization and improves sleep quality for optimal growth hormone release.',
    growthScore: 88,
    bestTime: 'Evening before bed',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop'
  },
  {
    id: 'supp-004',
    name: 'Zinc Picolinate',
    categoryId: 'supplements',
    type: 'Mineral',
    dosage: '15-30mg daily',
    benefits: ['Growth hormone', 'Immune function', 'Protein synthesis'],
    description: 'Essential for growth hormone production and protein synthesis during development.',
    growthScore: 90,
    bestTime: 'Morning with food',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=300&fit=crop'
  },
  {
    id: 'supp-005',
    name: 'Omega-3 Fish Oil',
    categoryId: 'supplements',
    type: 'Fatty Acid',
    dosage: '1000-2000mg daily',
    benefits: ['Brain health', 'Anti-inflammatory', 'Bone density'],
    description: 'Supports brain development and reduces inflammation that can hinder growth.',
    growthScore: 85,
    bestTime: 'With meals',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop'
  },
  {
    id: 'supp-006',
    name: 'Collagen Peptides',
    categoryId: 'supplements',
    type: 'Protein',
    dosage: '10-20g daily',
    benefits: ['Bone strength', 'Joint health', 'Skin elasticity'],
    description: 'Provides building blocks for bone and connective tissue development.',
    growthScore: 87,
    bestTime: 'Morning or evening',
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=300&h=300&fit=crop'
  },
  {
    id: 'supp-007',
    name: 'Vitamin K2',
    categoryId: 'supplements',
    type: 'Vitamin',
    dosage: '100-200mcg daily',
    benefits: ['Bone mineralization', 'Calcium utilization', 'Heart health'],
    description: 'Directs calcium to bones and teeth, preventing calcification in soft tissues.',
    growthScore: 89,
    bestTime: 'With calcium supplements',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=300&fit=crop'
  },
  {
    id: 'supp-008',
    name: 'B-Complex',
    categoryId: 'supplements',
    type: 'Vitamin',
    dosage: '1 capsule daily',
    benefits: ['Energy metabolism', 'Nerve function', 'Protein synthesis'],
    description: 'Essential for energy production and protein metabolism during growth.',
    growthScore: 82,
    bestTime: 'Morning with food',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop'
  },

  // GROWTH FOODS
  {
    id: 'food-001',
    name: 'Leafy Greens',
    categoryId: 'growth-foods',
    type: 'Vegetable',
    serving: '2-3 cups daily',
    benefits: ['Vitamin K', 'Folate', 'Iron', 'Calcium'],
    description: 'Rich in bone-building nutrients like vitamin K, folate, and calcium.',
    growthScore: 95,
    bestTime: 'Any meal',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&h=300&fit=crop'
  },
  {
    id: 'food-002',
    name: 'Sweet Potatoes',
    categoryId: 'growth-foods',
    type: 'Carbohydrate',
    serving: '1 medium daily',
    benefits: ['Beta-carotene', 'Potassium', 'Fiber', 'Vitamin C'],
    description: 'High in beta-carotene and potassium, supporting overall growth and development.',
    growthScore: 88,
    bestTime: 'Lunch or dinner',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=300&fit=crop'
  },
  {
    id: 'food-003',
    name: 'Berries',
    categoryId: 'growth-foods',
    type: 'Fruit',
    serving: '1 cup daily',
    benefits: ['Antioxidants', 'Vitamin C', 'Fiber', 'Manganese'],
    description: 'Antioxidant-rich fruits that support immune function and reduce inflammation.',
    growthScore: 85,
    bestTime: 'Snacks or breakfast',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=300&h=300&fit=crop'
  },
  {
    id: 'food-004',
    name: 'Nuts & Seeds',
    categoryId: 'growth-foods',
    type: 'Healthy Fat',
    serving: '1-2 oz daily',
    benefits: ['Magnesium', 'Zinc', 'Healthy fats', 'Protein'],
    description: 'Rich in growth-supporting minerals like magnesium and zinc.',
    growthScore: 90,
    bestTime: 'Snacks or meals',
    image: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=300&h=300&fit=crop'
  },
  {
    id: 'food-005',
    name: 'Avocados',
    categoryId: 'growth-foods',
    type: 'Healthy Fat',
    serving: '1/2 to 1 whole daily',
    benefits: ['Healthy fats', 'Folate', 'Potassium', 'Vitamin K'],
    description: 'Nutrient-dense fruit with healthy fats and folate for growth support.',
    growthScore: 87,
    bestTime: 'Any meal',
    image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=300&h=300&fit=crop'
  },
  {
    id: 'food-006',
    name: 'Quinoa',
    categoryId: 'growth-foods',
    type: 'Grain',
    serving: '1/2 to 1 cup daily',
    benefits: ['Complete protein', 'Magnesium', 'Iron', 'Fiber'],
    description: 'Complete protein grain with all essential amino acids for growth.',
    growthScore: 92,
    bestTime: 'Lunch or dinner',
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=300&h=300&fit=crop'
  },

  // PROTEIN SOURCES
  {
    id: 'protein-001',
    name: 'Grass-Fed Beef',
    categoryId: 'protein-sources',
    type: 'Animal Protein',
    serving: '3-4 oz daily',
    benefits: ['Complete protein', 'Iron', 'Zinc', 'B12'],
    description: 'High-quality complete protein with iron and zinc for growth.',
    growthScore: 94,
    bestTime: 'Lunch or dinner',
    image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=300&h=300&fit=crop'
  },
  {
    id: 'protein-002',
    name: 'Wild Salmon',
    categoryId: 'protein-sources',
    type: 'Fish',
    serving: '3-4 oz daily',
    benefits: ['Omega-3', 'Complete protein', 'Vitamin D', 'Selenium'],
    description: 'Rich in omega-3 fatty acids and complete protein for brain and bone health.',
    growthScore: 96,
    bestTime: 'Lunch or dinner',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=300&fit=crop'
  },
  {
    id: 'protein-003',
    name: 'Free-Range Eggs',
    categoryId: 'protein-sources',
    type: 'Animal Protein',
    serving: '2-3 eggs daily',
    benefits: ['Complete protein', 'Choline', 'Vitamin D', 'B12'],
    description: 'Perfect protein source with all essential amino acids and choline.',
    growthScore: 93,
    bestTime: 'Breakfast',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=300&h=300&fit=crop'
  },
  {
    id: 'protein-004',
    name: 'Greek Yogurt',
    categoryId: 'protein-sources',
    type: 'Dairy',
    serving: '1 cup daily',
    benefits: ['Probiotics', 'Calcium', 'Complete protein', 'B12'],
    description: 'High-protein dairy with probiotics and calcium for bone health.',
    growthScore: 91,
    bestTime: 'Breakfast or snacks',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=300&h=300&fit=crop'
  },
  {
    id: 'protein-005',
    name: 'Chicken Breast',
    categoryId: 'protein-sources',
    type: 'Poultry',
    serving: '3-4 oz daily',
    benefits: ['Lean protein', 'Niacin', 'Selenium', 'B6'],
    description: 'Lean, complete protein source with B vitamins for energy metabolism.',
    growthScore: 89,
    bestTime: 'Lunch or dinner',
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300&h=300&fit=crop'
  },
  {
    id: 'protein-006',
    name: 'Lentils',
    categoryId: 'protein-sources',
    type: 'Legume',
    serving: '1/2 to 1 cup daily',
    benefits: ['Plant protein', 'Folate', 'Iron', 'Fiber'],
    description: 'High-protein legume with folate and iron for growth support.',
    growthScore: 86,
    bestTime: 'Lunch or dinner',
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=300&h=300&fit=crop'
  },

  // CALCIUM RICH
  {
    id: 'calcium-001',
    name: 'Raw Milk',
    categoryId: 'calcium-rich',
    type: 'Dairy',
    serving: '1-2 cups daily',
    benefits: ['Bioavailable calcium', 'Vitamin D', 'Protein', 'B12'],
    description: 'Most bioavailable source of calcium with natural vitamin D.',
    growthScore: 97,
    bestTime: 'Any time',
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=300&h=300&fit=crop'
  },
  {
    id: 'calcium-002',
    name: 'Sardines',
    categoryId: 'calcium-rich',
    type: 'Fish',
    serving: '3-4 oz daily',
    benefits: ['Calcium', 'Omega-3', 'Vitamin D', 'Protein'],
    description: 'Small fish with edible bones providing highly absorbable calcium.',
    growthScore: 95,
    bestTime: 'Lunch or dinner',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=300&fit=crop'
  },
  {
    id: 'calcium-003',
    name: 'Cheese',
    categoryId: 'calcium-rich',
    type: 'Dairy',
    serving: '1-2 oz daily',
    benefits: ['Concentrated calcium', 'Protein', 'Vitamin K2', 'B12'],
    description: 'Concentrated source of calcium with vitamin K2 for bone health.',
    growthScore: 92,
    bestTime: 'Snacks or meals',
    image: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=300&h=300&fit=crop'
  },
  {
    id: 'calcium-004',
    name: 'Kale',
    categoryId: 'calcium-rich',
    type: 'Vegetable',
    serving: '2-3 cups daily',
    benefits: ['Plant calcium', 'Vitamin K', 'Iron', 'Antioxidants'],
    description: 'Leafy green with bioavailable plant calcium and vitamin K.',
    growthScore: 88,
    bestTime: 'Any meal',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&h=300&fit=crop'
  },
  {
    id: 'calcium-005',
    name: 'Almonds',
    categoryId: 'calcium-rich',
    type: 'Nuts',
    serving: '1-2 oz daily',
    benefits: ['Plant calcium', 'Magnesium', 'Healthy fats', 'Protein'],
    description: 'Nut with good calcium content plus magnesium for bone health.',
    growthScore: 85,
    bestTime: 'Snacks',
    image: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=300&h=300&fit=crop'
  },
  {
    id: 'calcium-006',
    name: 'Bone Broth',
    categoryId: 'calcium-rich',
    type: 'Beverage',
    serving: '1-2 cups daily',
    benefits: ['Minerals', 'Collagen', 'Gelatin', 'Amino acids'],
    description: 'Mineral-rich broth with collagen and gelatin for bone support.',
    growthScore: 90,
    bestTime: 'Any time',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=300&h=300&fit=crop'
  }
];

export default NUTRITION_ITEMS;
