import { API_KEYS, OPENAI_MODELS, API_ENDPOINTS } from '../config/apiKeys';
import imageManifest from '../config/imageManifest.json';

// Static mapping for local WebP images (all exercise categories)
const localImages = {
  // Chest exercises (ex-049, ex-050, ex-051) - Updated with new images
  'ex-049': require('../../assets/chest/arm swings.webp'), // Using first exercise as overview
  'ex-049-1': require('../../assets/chest/arm swings.webp'),
  'ex-049-2': require('../../assets/chest/chest opener.webp'),
  'ex-049-3': require('../../assets/chest/overhead tricep.webp'),
  'ex-049-4': require('../../assets/chest/one arm hug.webp'),
  'ex-049-5': require('../../assets/chest/wall arms.webp'),
  'ex-049-6': require('../../assets/chest/wall arms.webp'), // Wall Pecs - using wall arms as closest match
  'ex-050': require('../../assets/chest/arm swings.webp'), // Using first exercise as overview
  'ex-050-1': require('../../assets/chest/arm swings.webp'),
  'ex-050-2': require('../../assets/chest/chest opener.webp'),
  'ex-050-3': require('../../assets/chest/overhead tricep.webp'),
  'ex-050-4': require('../../assets/chest/one arm hug.webp'),
  'ex-050-5': require('../../assets/chest/wall arms.webp'),
  'ex-050-6': require('../../assets/chest/wall arms.webp'), // Wall Pecs - using wall arms as closest match
  'ex-050-7': require('../../assets/chest/reverse shoulder.webp'),
  'ex-050-8': require('../../assets/chest/wall dog.webp'),
  'ex-050-9': require('../../assets/chest/cat cow.webp'),
  'ex-051': require('../../assets/chest/wall dog.webp'), // Using first exercise as overview
  'ex-051-1': require('../../assets/chest/wall dog.webp'),
  'ex-051-2': require('../../assets/chest/cat cow.webp'),
  'ex-051-3': require('../../assets/chest/thread the needle.webp'),
  'ex-051-4': require('../../assets/chest/cobra stretch.webp'),
  'ex-051-5': require('../../assets/chest/puppy pose.webp'),
  'ex-051-6': require('../../assets/chest/camel pose.webp'),
  'ex-051-7': require('../../assets/chest/seated chest.webp'),
  'ex-051-8': require('../../assets/chest/spinal twist.webp'),
  
  // Feet and ankles exercises - Updated with new images
  'ex-052': require('../../assets/feet and ankles/single leg stand.webp'), // Using first exercise as overview
  'ex-052-1': require('../../assets/feet and ankles/single leg stand.webp'),
  'ex-052-2': require('../../assets/feet and ankles/angle circles.webp'),
  'ex-052-3': require('../../assets/feet and ankles/heel to toe rocks.webp'),
  'ex-052-4': require('../../assets/feet and ankles/heel to toe rocks.webp'), // Lateral Foot Rocks - using heel to toe rocks as closest match
  'ex-052-5': require('../../assets/feet and ankles/knee circles.webp'),
  'ex-052-6': require('../../assets/feet and ankles/soleous stretch.webp'),
  'ex-052-7': require('../../assets/feet and ankles/standing quad.webp'),
  'ex-053': require('../../assets/feet and ankles/single leg stand.webp'), // Using first exercise as overview
  'ex-053-1': require('../../assets/feet and ankles/single leg stand.webp'),
  'ex-053-2': require('../../assets/feet and ankles/angle circles.webp'),
  'ex-053-3': require('../../assets/feet and ankles/heel to toe rocks.webp'),
  'ex-053-4': require('../../assets/feet and ankles/heel to toe rocks.webp'), // Lateral Foot Rocks - using heel to toe rocks as closest match
  'ex-053-5': require('../../assets/feet and ankles/knee circles.webp'),
  'ex-053-6': require('../../assets/feet and ankles/soleous stretch.webp'),
  'ex-053-7': require('../../assets/feet and ankles/leaning calf.webp'),
  'ex-053-8': require('../../assets/feet and ankles/leaning calf.webp'), // Toe-to-Wall - using leaning calf as closest match
  'ex-053-9': require('../../assets/feet and ankles/standing quad.webp'),
  'ex-053-10': require('../../assets/feet and ankles/toe squat.webp'), // Toe Stretch - using toe squat as closest match
  'ex-053-11': require('../../assets/feet and ankles/thunderbolt.webp'),
  'ex-053-12': require('../../assets/feet and ankles/toe squat.webp'),
  
  // Neck exercises (ex-008, ex-021, ex-026) using new WEBP assets
  'ex-008': require('../../assets/Neck 1000x1000/diver.webp'),
  'ex-008-1': require('../../assets/Neck 1000x1000/diver.webp'),
  'ex-008-2': require('../../assets/Neck 1000x1000/cactus arms.webp'),
  'ex-008-3': require('../../assets/Neck 1000x1000/neck extension.webp'),
  'ex-008-4': require('../../assets/Neck 1000x1000/neck flexion.webp'),
  'ex-008-5': require('../../assets/Neck 1000x1000/ear to shoulder.webp'),
  // scalene/scapula removed via filter
  'ex-008-8': require('../../assets/Neck 1000x1000/neck rotations.webp'),
  'ex-021': require('../../assets/Neck 1000x1000/neck rotations.webp'),
  'ex-021-1': require('../../assets/Neck 1000x1000/neck flexion.webp'),
  'ex-021-2': require('../../assets/Neck 1000x1000/ear to shoulder.webp'),
  'ex-021-5': require('../../assets/Neck 1000x1000/neck rotations.webp'),
  'ex-021-6': require('../../assets/Neck 1000x1000/wall arms.webp'),
  'ex-021-7': require('../../assets/Neck 1000x1000/reverse shoulder.webp'),
  'ex-021-8': require('../../assets/Neck 1000x1000/bear hug.webp'),
  'ex-026': require('../../assets/Neck 1000x1000/neck rotations.webp'),
  'ex-026-1': require('../../assets/Neck 1000x1000/cactus arms.webp'),
  'ex-026-2': require('../../assets/Neck 1000x1000/neck extension.webp'),
  'ex-026-3': require('../../assets/Neck 1000x1000/neck flexion.webp'),
  'ex-026-4': require('../../assets/Neck 1000x1000/ear to shoulder.webp'),
  'ex-026-7': require('../../assets/Neck 1000x1000/neck rotations.webp'),
  'ex-026-8': require('../../assets/Neck 1000x1000/wall arms.webp'),
  'ex-026-9': require('../../assets/Neck 1000x1000/one arm hug.webp'),
  
  // Hanging stretch exercises (ex-001) - Updated with new images
  'ex-001': require('../../assets/hanging stretch/basic-hang-stretch-69014bc144aca.webp'),
  'ex-001-1': require('../../assets/hanging stretch/basic-hang-stretch-69014bc144aca.webp'), // Basic Hang
  'ex-001-2': require('../../assets/hanging stretch/active-hang-stretch-69014bbfdb5e5.webp'), // Active Hang
  'ex-001-3': require('../../assets/hanging stretch/baby-cobra-stretch-69014bc0598ef.webp'), // Hanging Flow
  // Cobra stretch exercises (ex-002) using new WEBP assets
  'ex-002': require('../../assets/Cobra 1000x1000/full cobra.webp'),
  'ex-002-1': require('../../assets/Cobra 1000x1000/Baby Cobra.webp'),
  'ex-002-2': require('../../assets/Cobra 1000x1000/full cobra.webp'),
  'ex-002-3': require('../../assets/Cobra 1000x1000/dynamic cobra.webp'),
  'ex-003': require('../../assets/posture/squat hold.webp'), // Posture Power - using squat hold as overview
  // Posture Power subs - Updated with new images
  'ex-003-1': require('../../assets/posture/squat hold.webp'),
  'ex-003-2': require('../../assets/posture/split lunge hold.webp'),
  'ex-003-3': require('../../assets/posture/side lunge hold.webp'),
  'ex-003-4': require('../../assets/posture/wall sit.webp'),
  'ex-003-5': require('../../assets/posture/squat hold.webp'), // Using squat hold for remaining sub-exercises
  'ex-003-6': require('../../assets/posture/squat hold.webp'),
  'ex-004': require('../../assets/posture/bridge leg lift.webp'), // Posture Stabilizer - using bridge leg lift as overview
  // Posture Stabilizer subs - Updated with new images
  'ex-004-1': require('../../assets/posture/bridge leg lift.webp'),
  'ex-004-2': require('../../assets/posture/bicycle crunch hold.webp'),
  'ex-004-3': require('../../assets/posture/bird dog.webp'),
  'ex-004-4': require('../../assets/posture/airplane.webp'),
  'ex-004-5': require('../../assets/posture/lying side leg raise.webp'),
  'ex-004-6': require('../../assets/posture/side plank.webp'),
  'ex-005': require('../../assets/posture/pelvic tilt.webp'), // Pelvic Tilt is posture exercise
  'ex-005-1': require('../../assets/posture/pelvic tilt.webp'),
  'ex-005-4': require('../../assets/posture/pelvic tilt.webp'), // Using pelvic tilt for remaining sub-exercises
  'ex-005-5': require('../../assets/posture/pelvic tilt.webp'),
  'ex-005-6': require('../../assets/posture/pelvic tilt.webp'),
  // Lower Body exercises - Updated with new images
  'ex-006': require('../../assets/lower body/wide leg bend.webp'), // Using first exercise as overview
  'ex-006-1': require('../../assets/lower body/wide leg bend.webp'),
  'ex-006-2': require('../../assets/lower body/lunge.webp'),
  'ex-006-3': require('../../assets/lower body/lunge.webp'), // Reverse Lunge - using lunge as closest match
  'ex-006-4': require('../../assets/lower body/butterfly.webp'),
  'ex-006-5': require('../../assets/lower body/quad stretch.webp'),
  'ex-006-6': require('../../assets/lower body/lying figure four.webp'),
  'ex-014': require('../../assets/lower body/kneeling quad.webp'), // Using first exercise as overview
  'ex-014-1': require('../../assets/lower body/kneeling quad.webp'),
  'ex-014-2': require('../../assets/lower body/downward dog.webp'),
  'ex-014-3': require('../../assets/lower body/pigeon.webp'),
  'ex-014-4': require('../../assets/lower body/thunderbolt.webp'),
  'ex-014-5': require('../../assets/lower body/butterfly.webp'),
  'ex-014-6': require('../../assets/lower body/hurdler.webp'),
  'ex-014-7': require('../../assets/lower body/quad stretch.webp'),
  'ex-014-8': require('../../assets/lower body/lying figure four.webp'),
  'ex-015': require('../../assets/lower body/pigeon.webp'), // Using first exercise as overview
  'ex-015-1': require('../../assets/lower body/pigeon.webp'),
  'ex-015-2': require('../../assets/lower body/thunderbolt.webp'),
  'ex-015-3': require('../../assets/lower body/toe squat.webp'),
  'ex-015-4': require('../../assets/lower body/butterfly.webp'),
  'ex-015-5': require('../../assets/lower body/double pigeon.webp'),
  'ex-015-6': require('../../assets/lower body/seated twist.webp'),
  'ex-015-7': require('../../assets/lower body/leaning 90_90.webp'),
  'ex-015-8': require('../../assets/lower body/hurdler.webp'),
  'ex-015-9': require('../../assets/lower body/quad stretch.webp'),
  'ex-015-10': require('../../assets/lower body/lying figure four.webp'),
  'ex-015-11': require('../../assets/lower body/wide leg bend.webp'),
  'ex-015-12': require('../../assets/lower body/lunge.webp'), // Side Lunge - using lunge as closest match
  'ex-015-13': require('../../assets/lower body/lunge.webp'),
  'ex-015-14': require('../../assets/lower body/lunge.webp'), // Reverse Lunge - using lunge as closest match
  'ex-015-15': require('../../assets/lower body/kneeling quad.webp'),
  'ex-015-16': require('../../assets/lower body/downward dog.webp'),
  'ex-015-17': require('../../assets/lower body/quad stretch.webp'), // Standing Quad - using quad stretch as closest match
  'ex-015-18': require('../../assets/lower body/standing hamstring.webp'),
  'ex-015-19': require('../../assets/lower body/standing calf.webp'),
  
  // Hamstrings exercises (ex-044, ex-045, ex-046) - Updated with new images
  'ex-044': require('../../assets/hamstrings/toe touch.webp'), // Using first exercise as overview
  'ex-044-1': require('../../assets/hamstrings/toe touch.webp'),
  'ex-044-2': require('../../assets/hamstrings/cross leg fold.webp'),
  'ex-044-3': require('../../assets/hamstrings/wide leg bend.webp'),
  'ex-044-4': require('../../assets/hamstrings/side lunge.webp'),
  'ex-044-5': require('../../assets/hamstrings/side lunge.webp'), // Reverse Lunge - using side lunge as closest match
  'ex-044-6': require('../../assets/hamstrings/cross leg fold.webp'), // Seated Fold - using cross leg fold as closest match
  'ex-044-7': require('../../assets/hamstrings/hurdler.webp'),
  'ex-045': require('../../assets/hamstrings/toe touch.webp'), // Using first exercise as overview
  'ex-045-1': require('../../assets/hamstrings/toe touch.webp'),
  'ex-045-2': require('../../assets/hamstrings/cross leg fold.webp'),
  'ex-045-3': require('../../assets/hamstrings/wide leg bend.webp'),
  'ex-045-4': require('../../assets/hamstrings/side lunge.webp'),
  'ex-045-5': require('../../assets/hamstrings/side lunge.webp'), // Reverse Lunge - using side lunge as closest match
  'ex-045-6': require('../../assets/hamstrings/downward dog.webp'),
  'ex-045-7': require('../../assets/hamstrings/pigeon.webp'),
  'ex-045-8': require('../../assets/hamstrings/cross leg fold.webp'), // Seated Fold - using cross leg fold as closest match
  'ex-045-9': require('../../assets/hamstrings/hurdler.webp'),
  'ex-045-10': require('../../assets/hamstrings/seated straddle.webp'),
  'ex-045-11': require('../../assets/hamstrings/lying figure four.webp'),
  'ex-045-12': require('../../assets/hamstrings/lying hamstring.webp'),
  'ex-046': require('../../assets/hamstrings/rag doll.webp'), // Using first exercise as overview
  'ex-046-1': require('../../assets/hamstrings/rag doll.webp'),
  'ex-046-2': require('../../assets/hamstrings/toe touch.webp'),
  'ex-046-3': require('../../assets/hamstrings/cross leg fold.webp'),
  'ex-046-4': require('../../assets/hamstrings/quad stretch.webp'), // Standing Quad - using quad stretch as closest match
  'ex-046-5': require('../../assets/hamstrings/wide leg bend.webp'),
  'ex-046-6': require('../../assets/hamstrings/squat stretch.webp'),
  'ex-046-7': require('../../assets/hamstrings/side lunge.webp'), // Reverse Lunge - using side lunge as closest match
  'ex-046-8': require('../../assets/hamstrings/side lunge.webp'),
  'ex-046-9': require('../../assets/hamstrings/kneeling quad.webp'),
  'ex-046-10': require('../../assets/hamstrings/cobra stretch.webp'),
  'ex-046-11': require('../../assets/hamstrings/downward dog.webp'),
  'ex-046-12': require('../../assets/hamstrings/lizard pose.webp'),
  'ex-046-13': require('../../assets/hamstrings/pigeon.webp'),
  'ex-046-14': require('../../assets/hamstrings/cross leg fold.webp'), // Seated Fold - using cross leg fold as closest match
  'ex-046-15': require('../../assets/hamstrings/hurdler.webp'),
  'ex-046-16': require('../../assets/hamstrings/quad stretch.webp'),
  'ex-046-17': require('../../assets/hamstrings/seated straddle.webp'),
  'ex-046-18': require('../../assets/hamstrings/lying figure four.webp'),
  'ex-046-19': require('../../assets/hamstrings/lying hamstring.webp'),
  
  // Shoulder exercises (ex-047, ex-048) - Updated with new images
  'ex-047': require('../../assets/shoulders/one arm hug.webp'), // Using first exercise as overview
  'ex-047-1': require('../../assets/shoulders/one arm hug.webp'),
  'ex-047-2': require('../../assets/shoulders/reverse shoulder.webp'),
  'ex-047-3': require('../../assets/shoulders/overhead tricep.webp'),
  'ex-047-4': require('../../assets/shoulders/wall arms.webp'),
  'ex-047-5': require('../../assets/shoulders/forward fold.webp'),
  'ex-047-6': require('../../assets/shoulders/wall arms.webp'), // Wall Pecs - using wall arms as closest match
  'ex-047-7': require('../../assets/shoulders/diver.webp'),
  'ex-047-8': require('../../assets/shoulders/wall dog.webp'),
  'ex-048': require('../../assets/shoulders/shoulder rolls.webp'), // Using first exercise as overview
  'ex-048-1': require('../../assets/shoulders/wall arms.webp'), // Wall Pecs - using wall arms as closest match
  'ex-048-2': require('../../assets/shoulders/diver.webp'),
  'ex-048-3': require('../../assets/shoulders/wall dog.webp'),
  'ex-048-4': require('../../assets/shoulders/shoulder rolls.webp'),
  'ex-048-5': require('../../assets/shoulders/neck rolls.webp'),
  'ex-048-6': require('../../assets/shoulders/ear to shoulder.webp'),
  'ex-048-7': require('../../assets/shoulders/cactus arms.webp'),
  'ex-048-8': require('../../assets/shoulders/bear hug.webp'),
  'ex-048-9': require('../../assets/shoulders/cobra stretch.webp'),
  
  // Posture exercises - Updated with new images
  'ex-011': require('../../assets/posture/cat cow.webp'),
  'ex-011-1': require('../../assets/posture/cat cow.webp'),
  'ex-011-2': require('../../assets/posture/cat cow.webp'),
  'ex-011-3': require('../../assets/posture/cat cow.webp'),
  'ex-011-4': require('../../assets/posture/cat cow.webp'),
  'ex-011-5': require('../../assets/posture/cat cow.webp'),
  'ex-011-6': require('../../assets/posture/cat cow.webp'),
  'ex-019': require('../../assets/posture/hand plank.webp'), // Wrist extension - using hand plank as closest match
  'ex-020': require('../../assets/posture/hand plank.webp'), // Using hand plank as general posture exercise
  'ex-023': require('../../assets/posture/t spine rotation.webp'),
  'ex-023-1': require('../../assets/posture/t spine rotation.webp'),
  'ex-023-2': require('../../assets/posture/t spine rotation.webp'),
  'ex-023-3': require('../../assets/posture/t spine rotation.webp'),
  'ex-023-4': require('../../assets/posture/t spine rotation.webp'),
  'ex-023-5': require('../../assets/posture/t spine rotation.webp'),
  'ex-023-6': require('../../assets/posture/t spine rotation.webp'),
  'ex-024': require('../../assets/posture/dead bug.webp'),
  'ex-024-1': require('../../assets/posture/dead bug.webp'),
  'ex-024-2': require('../../assets/posture/pelvic tilt.webp'),
  'ex-024-3': require('../../assets/posture/t spine rotation.webp'),
  'ex-024-4': require('../../assets/posture/cat cow.webp'),
  'ex-024-5': require('../../assets/posture/side plank.webp'),
  'ex-024-6': require('../../assets/posture/bird dog.webp'), // Posture stabilizer - using bird dog as closest match
  'ex-029': require('../../assets/posture/hand plank.webp'), // Using hand plank as general posture exercise
  'ex-034': require('../../assets/posture/side plank.webp'),
  'ex-034-1': require('../../assets/posture/side plank.webp'),
  'ex-034-2': require('../../assets/posture/bird dog.webp'), // Posture stabilizer - using bird dog as closest match
  'ex-034-3': require('../../assets/posture/squat hold.webp'), // Posture power - using squat hold as closest match
  'ex-034-4': require('../../assets/posture/t spine rotation.webp'),
  'ex-034-5': require('../../assets/posture/dead bug.webp'),
  'ex-034-6': require('../../assets/posture/cat cow.webp'),
  'ex-036': require('../../assets/posture/side plank.webp'), // Using side plank as general posture exercise
  'ex-038': require('../../assets/posture/bird dog.webp'), // Using bird dog as general posture exercise
  
  // Masai jump exercises (ex-041, ex-042) - Updated with new images
  'ex-041': require('../../assets/masai jumps/calf pulses.webp'), // Using first exercise as overview
  'ex-041-1': require('../../assets/masai jumps/calf pulses.webp'),
  'ex-041-2': require('../../assets/masai jumps/knee circles.webp'),
  'ex-041-3': require('../../assets/masai jumps/masai jump.webp'),
  'ex-041-4': require('../../assets/masai jumps/rest.webp'),
  'ex-041-5': require('../../assets/masai jumps/masai jump.webp'),
  'ex-041-6': require('../../assets/masai jumps/rest.webp'),
  'ex-041-7': require('../../assets/masai jumps/masai jump.webp'),
  'ex-042': require('../../assets/masai jumps/knee circles.webp'), // Using first exercise as overview
  'ex-042-1': require('../../assets/masai jumps/knee circles.webp'),
  'ex-042-2': require('../../assets/masai jumps/masai jump.webp'),
  'ex-042-3': require('../../assets/masai jumps/rest.webp'),
  'ex-042-4': require('../../assets/masai jumps/masai jump.webp'),
  'ex-042-5': require('../../assets/masai jumps/rest.webp'),
  'ex-042-6': require('../../assets/masai jumps/masai jump.webp'),
  'ex-042-7': require('../../assets/masai jumps/rest.webp'),
  'ex-042-8': require('../../assets/masai jumps/masai jump.webp'),
  
  // Upper body exercises - Updated with new images
  'ex-017': require('../../assets/upper body/chest opener.webp'), // Using first exercise as overview
  'ex-017-1': require('../../assets/upper body/chest opener.webp'),
  'ex-017-2': require('../../assets/upper body/overhead tricep.webp'),
  'ex-017-3': require('../../assets/upper body/one arm hug.webp'),
  'ex-017-4': require('../../assets/upper body/reverse shoulder.webp'),
  'ex-017-5': require('../../assets/upper body/diver.webp'),
  'ex-017-6': require('../../assets/upper body/wall arm stretch.webp'),
  'ex-017-7': require('../../assets/upper body/chin retractions.webp'),
  'ex-017-8': require('../../assets/upper body/ear to shoulder.webp'),
  'ex-017-9': require('../../assets/upper body/ear to shoulder.webp'), // Scalene Stretch - using ear to shoulder as closest match
  'ex-018': require('../../assets/upper body/diver.webp'), // Using first exercise as overview
  'ex-018-1': require('../../assets/upper body/diver.webp'),
  'ex-018-2': require('../../assets/upper body/wall arm stretch.webp'),
  'ex-018-3': require('../../assets/upper body/neck roll.webp'),
  'ex-018-4': require('../../assets/upper body/chin retractions.webp'),
  'ex-018-5': require('../../assets/upper body/ear to shoulder.webp'),
  'ex-018-6': require('../../assets/upper body/neck roll.webp'), // Neck Rotation - using neck roll as closest match
  'ex-018-7': require('../../assets/upper body/reverse shoulder.webp'), // Scapula Stretch - using reverse shoulder as closest match
  'ex-018-8': require('../../assets/upper body/ear to shoulder.webp'), // Scalene Stretch - using ear to shoulder as closest match
  'ex-028': require('../../assets/upper body/shoulder rolls.webp'), // Using first exercise as overview
  'ex-028-1': require('../../assets/upper body/shoulder rolls.webp'),
  'ex-028-2': require('../../assets/upper body/upward salute.webp'),
  'ex-028-3': require('../../assets/upper body/rag doll.webp'),
  'ex-028-4': require('../../assets/upper body/chest opener.webp'),
  'ex-028-5': require('../../assets/upper body/overhead tricep.webp'),
  'ex-028-6': require('../../assets/upper body/one arm hug.webp'),
  'ex-028-7': require('../../assets/upper body/forward fold.webp'),
  'ex-028-8': require('../../assets/upper body/cactus arms.webp'),
  'ex-032': require('../../assets/upper body/chest supported row (band).webp'),
  'ex-039': require('../../assets/upper body/push ups.webp'), // Scap Push-Ups - using push ups as closest match
  // Highest Impact HGH Exercises (ex-054 to ex-057) - Using WebP images
  'ex-054': require('../../assets/martial arts.webp'),
  'ex-054-1': require('../../assets/martial arts.webp'),
  'ex-054-2': require('../../assets/martial arts.webp'),
  'ex-054-3': require('../../assets/martial arts.webp'),
  'ex-055': require('../../assets/sprinting.webp'),
  'ex-055-1': require('../../assets/sprinting.webp'),
  'ex-055-2': require('../../assets/sprinting.webp'),
  'ex-055-3': require('../../assets/sprinting.webp'),
  'ex-056': require('../../assets/swimming.webp'),
  'ex-056-1': require('../../assets/swimming.webp'),
  'ex-056-2': require('../../assets/swimming.webp'),
  'ex-056-3': require('../../assets/swimming.webp'),
  'ex-057': require('../../assets/wood cutting.webp'),
  'ex-057-1': require('../../assets/wood cutting.webp'),
  'ex-057-2': require('../../assets/wood cutting.webp'),
  'ex-057-3': require('../../assets/wood cutting.webp'),
};

// Return an illustrative image for an exercise based on its name/category
export const getExerciseImageUrl = (exercise) => {
  if (!exercise) {
    return require('../../assets/peakheight-logo.jpg');
  }

  // Normalize IDs like 'ex-5' or 'ex-5-1' to 'ex-005' / 'ex-005-1'
  const rawId = String(exercise.id || '').trim();
  const exerciseId = rawId.replace(/^ex-(\d{1,2})(?:-(\d+))?$/i, (_m, main, sub) => {
    const mainPadded = `ex-${String(main).padStart(3, '0')}`;
    return sub ? `${mainPadded}-${sub}` : mainPadded;
  });
  const exerciseName = (exercise.name || '').toLowerCase();

  // Prefer local WEBP images when available (overrides manifest)
  if (localImages[exerciseId]) {
    const isCobraNeck = /^ex-(002|008|021|026)(?:-|$)/.test(exerciseId);
    return { image: localImages[exerciseId], zoom: isCobraNeck ? 1.0 : 1.25 };
  }

  // Otherwise check manifest for remote URL or local flag
  if (imageManifest[exerciseId]) {
    const imageUrl = imageManifest[exerciseId];
    const isCobraNeck = /^ex-(002|008|021|026)(?:-|$)/.test(exerciseId);

    // Handle local WebP images (feet and ankles exercises)
    if (imageUrl === 'LOCAL' && localImages[exerciseId]) {
      return localImages[exerciseId];
    }

    // Convert Google Drive sharing link to optimized direct image URL
    if (imageUrl.includes('drive.google.com/file/d/')) {
      const fileId = imageUrl.split('/d/')[1].split('/view')[0];
      // Use optimized parameters for faster loading
      const directUrl = `https://drive.google.com/uc?export=view&id=${fileId}&sz=w400-h400`; // Reduced size
      return isCobraNeck ? { uri: directUrl } : { image: { uri: directUrl }, zoom: 1.25 };
    }

    return isCobraNeck ? { uri: imageUrl } : { image: { uri: imageUrl }, zoom: 1.25 };
  }

  // Fallback: if a sub-exercise ID like ex-005-1 isn't present,
  // try the parent exercise ID (e.g., ex-005)
  if (typeof exerciseId === 'string' && exerciseId.includes('-')) {
    const parentId = exerciseId.split('-').slice(0, 2).join('-');
    // Prefer local parent image if present
    if (localImages[parentId]) {
      const isCobraNeck = /^ex-(002|008|021|026)(?:-|$)/.test(parentId);
      return { image: localImages[parentId], zoom: isCobraNeck ? 1.0 : 1.25 };
    }
    if (imageManifest[parentId]) {
      const parentUrl = imageManifest[parentId];
      const isCobraNeck = /^ex-(002|008|021|026)(?:-|$)/.test(parentId);

      // Handle local WebP images for parent exercise
      if (parentUrl === 'LOCAL' && localImages[parentId]) {
        return localImages[parentId];
      }

      if (parentUrl.includes('drive.google.com/file/d/')) {
        const fileId = parentUrl.split('/d/')[1].split('/view')[0];
        // Use optimized parameters for faster loading
        const directUrl = `https://drive.google.com/uc?export=view&id=${fileId}&sz=w400-h400`; // Reduced size
        return isCobraNeck ? { uri: directUrl } : { image: { uri: directUrl }, zoom: 1.25 };
      }
      return isCobraNeck ? { uri: parentUrl } : { image: { uri: parentUrl }, zoom: 1.25 };
    }
  }

  // Fallback to app logo if no manifest entry found
  return require('../../assets/peakheight-logo.jpg');
};

export const lookupBarcode = async (barcode) => {
  try {
    const response = await fetch(`${API_KEYS.OPEN_FOOD_FACTS_API}${barcode}.json`);
    const data = await response.json();

    if (data.status === 1) {
      return {
        success: true,
        product: {
          name: data.product.product_name || 'Unknown Product',
          brand: data.product.brands || '',
          ingredients: data.product.ingredients_text || '',
          nutrition: data.product.nutriments || {},
          image: data.product.image_url || null
        }
      };
    } else {
      return { success: false, error: 'Product not found' };
    }
  } catch (error) {
    return { success: false, error: 'Network error' };
  }
};

export const convertImageToBase64 = async (imageUri) => {
  try {
    const response = await fetch(imageUri);
    const blob = await response.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    throw new Error('Failed to convert image to base64');
  }
};

export const recognizeFoodWithGoogleVision = async (imageUri) => {
  try {
    const base64Image = await convertImageToBase64(imageUri);
    const response = await fetch(`${API_ENDPOINTS.GOOGLE_VISION_API}?key=${API_KEYS.GOOGLE_VISION_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [{
          image: {
            content: base64Image.split(',')[1]
          },
          features: [{
            type: 'LABEL_DETECTION',
            maxResults: 10
          }]
        }]
      })
    });

    const data = await response.json();

    if (data.responses && data.responses[0] && data.responses[0].labelAnnotations) {
      const labels = data.responses[0].labelAnnotations;
      const foodItems = labels
        .filter(label => label.score > 0.7)
        .map(label => ({
          name: label.description,
          confidence: label.score
        }));

      return { success: true, foodItems, confidence: 0.8 };
    }

    return { success: false, error: 'No food items detected' };
  } catch (error) {
    return { success: false, error: 'Google Vision API failed' };
  }
};

export const recognizeFoodWithGoogleVisionBase64 = async (base64Image) => {
  try {
    const response = await fetch(`${API_ENDPOINTS.GOOGLE_VISION_API}?key=${API_KEYS.GOOGLE_VISION_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [{
          image: {
            content: base64Image.split(',')[1]
          },
          features: [{
            type: 'LABEL_DETECTION',
            maxResults: 10
          }]
        }]
      })
    });

    const data = await response.json();

    if (data.responses && data.responses[0] && data.responses[0].labelAnnotations) {
      const labels = data.responses[0].labelAnnotations;
      const foodItems = labels
        .filter(label => label.score > 0.7)
        .map(label => ({
          name: label.description,
          confidence: label.score
        }));

      return { success: true, foodItems, confidence: 0.8 };
    }

    return { success: false, error: 'No food items detected' };
  } catch (error) {
    return { success: false, error: 'Google Vision API failed' };
  }
};

export const recognizeFoodWithOpenAI = async (imageUri) => {
  try {
    const base64Image = await convertImageToBase64(imageUri);

    const response = await fetch(`${API_ENDPOINTS.OPENAI}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEYS.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: OPENAI_MODELS.VISION,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Identify the food items in this image. Return only the names of food items, separated by commas. Be specific about the type of food (e.g., 'apple', 'banana', 'bread', 'chicken breast')."
              },
              {
                type: "image_url",
                image_url: {
                  url: base64Image
                }
              }
            ]
          }
        ],
        max_tokens: 300
      })
    });

    const data = await response.json();

    if (data.choices && data.choices[0] && data.choices[0].message) {
      const foodText = data.choices[0].message.content;
      const foodItems = foodText.split(',').map(item => ({
        name: item.trim(),
        confidence: 0.9
      }));

      return { success: true, foodItems, confidence: 0.9 };
    }

    return { success: false, error: 'OpenAI recognition failed' };
  } catch (error) {
    return { success: false, error: 'OpenAI recognition failed.' };
  }
};

export const recognizeFoodWithOpenAIBase64 = async (base64Image) => {
  try {
    // Check if API key is configured
    if (!API_KEYS.OPENAI_API_KEY || API_KEYS.OPENAI_API_KEY === 'sk-proj-your-openai-api-key-here') {
      console.error('OpenAI API key not configured');
      return { success: false, error: 'OpenAI API key not configured. Please add your API key to the environment variables.' };
    }

    // Ensure base64 image has proper format
    const imageUrl = base64Image.startsWith('data:') ? base64Image : `data:image/jpeg;base64,${base64Image}`;
    
    console.log('Making OpenAI API request...');
    console.log('API Key configured:', API_KEYS.OPENAI_API_KEY.substring(0, 10) + '...');
    console.log('Model:', OPENAI_MODELS.VISION);
    console.log('Full URL:', `${API_ENDPOINTS.OPENAI}/v1/chat/completions`);
    
    const systemPrompt = `Food recognition for HEIGHT GROWTH. Identify visible food/drinks and analyze growth impact.

Return JSON: {"best":{"name":string,"confidence":0-1,"impact":"excellent/good/moderate/poor/negative","nutrients":string,"rating":"beneficial/neutral/avoid"},"candidates":[...]}

For each item:
- name: Generic food name
- confidence: Recognition confidence 
- impact: Height growth effect
- nutrients: Key growth nutrients (protein, calcium, vitamin D, zinc)
- rating: Growth recommendation

Focus on growth nutrients: protein, calcium, vitamin D, zinc, vitamin C, magnesium.
Example: {"best":{"name":"milk","confidence":0.9,"impact":"excellent","nutrients":"calcium 300mg, protein 8g, vitamin D","rating":"beneficial"}}`;

    const response = await fetch(`${API_ENDPOINTS.OPENAI}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEYS.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: OPENAI_MODELS.VISION,
        messages: [
          { role: 'system', content: systemPrompt },
          {
            role: 'user',
            content: [
              { type: 'text', text: 'Identify food/drinks and analyze height growth impact. JSON only.' },
              { type: 'image_url', image_url: { url: imageUrl } },
            ]
          }
        ],
        max_tokens: 300,
        temperature: 0.2,
      })
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);

    // Check if response is OK
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      return { success: false, error: `API Error ${response.status}: ${errorText.substring(0, 200)}` };
    }

    const responseText = await response.text();
    console.log('Raw response:', responseText.substring(0, 500));

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.error('Response was:', responseText.substring(0, 200));
      return { success: false, error: 'Invalid API response format' };
    }

    // Debug logging
    console.log('OpenAI API Response:', JSON.stringify(data, null, 2));

    if (data.error) {
      console.error('OpenAI API Error:', data.error);
      return { success: false, error: `OpenAI API Error: ${data.error.message || data.error.type || 'Unknown error'}` };
    }

    if (data.choices && data.choices[0] && data.choices[0].message) {
      const content = data.choices[0].message.content || '';
      console.log('Raw AI response content:', content);
      
      let parsed;
      try {
        parsed = JSON.parse(content.trim());
        console.log('Successfully parsed JSON:', parsed);
      } catch (parseError) {
        console.log('Initial JSON parse failed:', parseError.message);
        // Fallback: try to extract JSON from text
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            parsed = JSON.parse(jsonMatch[0]);
            console.log('Successfully parsed JSON from match:', parsed);
          } catch (matchError) {
            console.log('JSON match parse also failed:', matchError.message);
          }
        } else {
          console.log('No JSON pattern found in content');
        }
      }
      if (parsed && parsed.best) {
        const bestName = String(parsed.best.name || 'Unknown Food');
        const bestConfidence = typeof parsed.best.confidence === 'number' ? parsed.best.confidence : 0.5;
        const impact = parsed.best.impact || 'moderate';
        const nutrients = parsed.best.nutrients || 'Nutritional information not available';
        const rating = parsed.best.rating || 'neutral';
        
        const candidates = Array.isArray(parsed.candidates) ? parsed.candidates.map(c => ({
          name: String(c.name || ''),
          confidence: typeof c.confidence === 'number' ? c.confidence : 0.0,
        })).filter(c => c.name) : [];
        
        return { 
          success: true, 
          foodItems: [bestName], 
          confidence: bestConfidence, 
          candidates,
          heightGrowthInfo: {
            impact,
            nutrients,
            rating
          }
        };
      }

      // Legacy fallback: comma-separated text or raw JSON display
      console.log('Falling back to legacy parsing');
      
      // If content looks like JSON but failed to parse, try to extract food name
      if (content.includes('"name"') || content.includes('"best"')) {
        // Try to extract food name from malformed JSON
        const nameMatch = content.match(/"name"\s*:\s*"([^"]+)"/);
        if (nameMatch) {
          const foodName = nameMatch[1];
          return { 
            success: true, 
            foodItems: [foodName], 
            confidence: 0.7,
            heightGrowthInfo: {
              impact: 'moderate',
              nutrients: 'Nutritional analysis not available',
              rating: 'neutral'
            }
          };
        }
      }
      
      // Final fallback: comma-separated text
      const foodText = content;
      const items = foodText.split(',').map(s => s.trim()).filter(Boolean);
      if (items.length > 0) {
        return { 
          success: true, 
          foodItems: [items[0]], 
          confidence: 0.6, 
          candidates: items.map(n => ({ name: n, confidence: 0.5 })),
          heightGrowthInfo: {
            impact: 'moderate',
            nutrients: 'Basic nutritional information',
            rating: 'neutral'
          }
        };
      }
    }

    return { success: false, error: 'OpenAI recognition failed - no valid response' };
  } catch (error) {
    console.error('OpenAI API Error Details:', error);
    return { success: false, error: `OpenAI recognition failed: ${error.message || error}` };
  }
};
