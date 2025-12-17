-- Update Priya Sharma's profile to reflect ethnic/traditional wear use case
-- Based on the use case: searches for "traditional wear" or "ethnic wear"
-- Products: W White Floral Printed Round Neck Cotton Top
-- Cross-brand recommendations: Forever Glam (bag), Aurelia (kurta)

UPDATE public.users
SET 
  style_preference = 'Ethnic & Traditional',
  favorite_brands = ARRAY['W', 'Aurelia', 'Forever Glam', 'Pantaloons'],
  avatar_url = NULL  -- Set to NULL so the code uses the local /priya.png image
WHERE name = 'Priya Sharma';

-- Also update Aarav and Rohan to use local avatar images
UPDATE public.users
SET avatar_url = NULL
WHERE name IN ('Aarav Kumar', 'Rohan Mehta');

