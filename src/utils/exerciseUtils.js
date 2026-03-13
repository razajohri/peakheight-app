import { CATEGORIES, EXERCISES } from './exercisesData';

// Hide specific exercises across the app by name (case-insensitive)
const HIDDEN_EXERCISE_NAMES = new Set([
  'pelvic tilt flow',
  'pelvic tilt pulses',
  'scalene stretch',
  'neck rotation',
  'scapula stretch',
  'lateral foot rocks',
  'toe stretch',
  'wall pecs',
  'reverse lunge',
  'seated fold',
].map(n => n.toLowerCase()));

// Apply filtering at the source to ensure both top-level and sub-exercises are removed
const SOURCE_EXERCISES = EXERCISES
  .map(e => ({
    ...e,
    subExercises: Array.isArray(e.subExercises)
      ? e.subExercises.filter(se => !HIDDEN_EXERCISE_NAMES.has(String(se?.name || '').toLowerCase()))
      : e.subExercises,
  }))
  .filter(e => !HIDDEN_EXERCISE_NAMES.has(String(e?.name || '').toLowerCase()));

export const categories = [{ id: 'all', name: 'All' }, ...CATEGORIES];

export const exercises = SOURCE_EXERCISES.map(e => {
  // Create a new object to avoid property configuration issues
  const exerciseObj = {
    id: e.id,
    name: e.name,
    category: e.categoryId,
    duration: typeof e.duration === 'number' ? e.duration : (typeof e.durationMin === 'number' ? e.durationMin * 60 : 0),
    durationMin: e.durationMin,
    difficulty: e.difficulty,
    highImpact: e.impact === 'High',
    impact: e.impact === 'High' ? 'High impact' : e.impact === 'Medium' ? 'Medium impact' : 'Low impact',
    isHighestImpact: Boolean(e.isHighestImpact),
    _full: e,
  };
  return exerciseObj;
});

export const filterExercises = (selectedCategory, search, sort) => {
  let data;

  if (selectedCategory === 'all') {
    data = exercises;
  } else if (selectedCategory === 'stretches') {
    // Filter exercises with categoryId === 'stretching'
    data = exercises.filter(e => e.category === 'stretching');
  } else if (selectedCategory === 'exercises') {
    // Filter exercises that are NOT stretching (all other exercises)
    data = exercises.filter(e => e.category !== 'stretching');
  } else if (selectedCategory === 'high-hgh-impact') {
    // Filter exercises with high impact OR highest impact flag
    data = exercises.filter(e => {
      const impact = e._full?.impact || e.impact;
      return impact === 'High' || impact === 'High impact' || e.highImpact === true || e.isHighestImpact === true;
    });
    // Sort to put highest impact exercises (ex-054 to ex-057) at the top
    // Only apply this custom sort if no other sort option is selected
    if (!sort || (sort !== 'duration' && sort !== 'difficulty')) {
      data = [...data].sort((a, b) => {
        // Check if exercise is one of the 4 new highest impact exercises (ex-054 to ex-057)
        const aIsNewHighest = ['ex-054', 'ex-055', 'ex-056', 'ex-057'].includes(a.id);
        const bIsNewHighest = ['ex-054', 'ex-055', 'ex-056', 'ex-057'].includes(b.id);
        
        // If both are new highest impact, maintain their order (ex-054, ex-055, ex-056, ex-057)
        if (aIsNewHighest && bIsNewHighest) {
          const order = { 'ex-054': 1, 'ex-055': 2, 'ex-056': 3, 'ex-057': 4 };
          return (order[a.id] || 0) - (order[b.id] || 0);
        }
        
        // New highest impact exercises come first
        if (aIsNewHighest && !bIsNewHighest) return -1;
        if (!aIsNewHighest && bIsNewHighest) return 1;
        
        // For other exercises, check isHighestImpact flag
        if (a.isHighestImpact && !b.isHighestImpact) return -1;
        if (!a.isHighestImpact && b.isHighestImpact) return 1;
        
        // Otherwise maintain original order
        return 0;
      });
    }
  } else if (selectedCategory === 'beginner' || selectedCategory === 'intermediate' || selectedCategory === 'advanced') {
    const want = String(selectedCategory).toLowerCase();
    data = exercises.filter(e => {
      const diff = (e.difficulty || e.level || '').toLowerCase();
      if (!diff) return false;
      // allow partials like "inter", "adv", etc.
      return diff === want || diff.startsWith(want.slice(0, 3));
    });
    // Fallback: if nothing matched due to inconsistent labels, include items whose difficulty contains the target
    if (data.length === 0) {
      data = exercises.filter(e => ((e.difficulty || e.level || '').toLowerCase()).includes(want.slice(0, 3)));
    }
  } else if (selectedCategory === 'quick') {
    data = exercises.filter(e => {
      const mins = parseInt(e.duration, 10);
      return !isNaN(mins) && mins <= 10;
    });
  } else if (selectedCategory === 'favorites') {
    // Placeholder: show all until favorites are implemented
    data = exercises;
  } else {
    // Treat as regular exercise category id
    data = exercises.filter(e => e.category === selectedCategory);
  }

  // Optional body-part filter (used by list chips)
  const bodyPartFilters = new Set(['upper-body', 'chest', 'neck', 'shoulders', 'lower-body', 'hamstrings']);
  if (bodyPartFilters.has(sort)) {
    data = data.filter(e => {
      const catId = e._full?.categoryId || e.category;
      return catId === sort;
    });
  }

  // Text search
  if (search.trim()) {
    const q = search.toLowerCase();
    data = data.filter(e => e.name.toLowerCase().includes(q));
  }

  // Sorting
  if (sort === 'duration') {
    data = [...data].sort((a, b) => (a.duration || 0) - (b.duration || 0));
  } else if (sort === 'difficulty') {
    const order = { 'beginner': 1, 'intermediate': 2, 'advanced': 3 };
    data = [...data].sort((a, b) => (order[(a.difficulty || '').toLowerCase()] || 0) - (order[(b.difficulty || '').toLowerCase()] || 0));
  }

  return data;
};
