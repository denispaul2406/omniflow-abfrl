const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Try to load environment variables from mobile-app
const envPath = path.join(__dirname, '../mobile-app/.env');
let supabaseUrl, supabaseKey;

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const envVars = {};
  envContent.split('\n').forEach(line => {
    // Skip comments and empty lines
    line = line.trim();
    if (!line || line.startsWith('#')) return;
    
    // Handle quoted values
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      let value = match[2].trim();
      // Remove quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      envVars[key] = value;
    }
  });
  supabaseUrl = envVars.VITE_SUPABASE_URL;
  supabaseKey = envVars.VITE_SUPABASE_PUBLISHABLE_KEY;
  
  console.log('📝 Loaded from .env file:');
  console.log(`   URL: ${supabaseUrl ? 'Found' : 'Missing'}`);
  console.log(`   Key: ${supabaseKey ? 'Found (' + supabaseKey.substring(0, 20) + '...)' : 'Missing'}`);
}

// Fallback to environment variables
supabaseUrl = supabaseUrl || process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
supabaseKey = supabaseKey || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials!');
  console.error('Please set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in mobile-app/.env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Read JSON files
const menDataPath = path.join(__dirname, '../data/men/products_database.json');
const womenDataPath = path.join(__dirname, '../data/women/womens_products_database.json');

if (!fs.existsSync(menDataPath) || !fs.existsSync(womenDataPath)) {
  console.error('❌ JSON data files not found!');
  console.error('Expected:', menDataPath);
  console.error('Expected:', womenDataPath);
  process.exit(1);
}

const menData = JSON.parse(fs.readFileSync(menDataPath, 'utf8'));
const womenData = JSON.parse(fs.readFileSync(womenDataPath, 'utf8'));

// Transform product from JSON to Supabase format
function transformProduct(product, brandName, gender) {
  // Extract available sizes
  const sizes = product.sizes
    ? product.sizes.filter(s => s.available !== false).map(s => s.size || s.brand_size || 'M')
    : ['M', 'L']; // Fallback sizes
  
  // Calculate total stock from store inventory
  const stockStore = product.stock_store || {};
  const totalStock = Object.values(stockStore).reduce((sum, stock) => sum + (Number(stock) || 0), 0);
  
  // Get image path
  const imageSource = product.image_source || product.product_url || null;
  const imageUrl = imageSource 
    ? `/data/${gender}/${imageSource}` 
    : null;
  
  return {
    brand: brandName,
    name: product.name,
    price: Number(product.price) || 0,
    discount_price: product.discount_price ? Number(product.discount_price) : null,
    discount_percent: product.discount_percent ? Number(product.discount_percent) : 0,
    description: product.description || '',
    material: product.material || null,
    fit: product.fit || null,
    color: product.color || null,
    occasion: product.occasion || null,
    pattern: product.pattern || null,
    collection: product.collection || null,
    product_type: product.product_type || null,
    subbrand: product.subbrand || null,
    style_code: product.style_code || product.product_code || null,
    product_code: product.product_code || product.style_code || null,
    rating: product.rating ? Number(product.rating) : 0,
    reviews: product.reviews ? Number(product.reviews) : 0,
    aisle: product.aisle || null,
    stock_store: stockStore,
    sizes_data: product.sizes || [],
    coupons_data: product.coupons || [],
    image_source: imageSource,
    image_url: imageUrl,
    category: product.product_type || product.category || 'General',
    size: sizes.length > 0 ? sizes : ['M', 'L'], // Fallback sizes
    stock_count: totalStock || product.stock_online || 50 // Fallback stock
  };
}

// Import products
async function importProducts() {
  const allProducts = [];
  
  // Process men's products
  for (const [brandKey, brandData] of Object.entries(menData.brands)) {
    for (const product of brandData.products) {
      allProducts.push(transformProduct(product, brandData.brand_name, 'men'));
    }
  }
  
  // Process women's products
  for (const [brandKey, brandData] of Object.entries(womenData.brands)) {
    for (const product of brandData.products) {
      allProducts.push(transformProduct(product, brandData.brand_name, 'women'));
    }
  }
  
  console.log(`\n📦 Found ${allProducts.length} products to import\n`);
  
  // Check if products already exist
  const { data: existingProducts } = await supabase
    .from('products')
    .select('id, name, brand')
    .limit(1);
  
  if (existingProducts && existingProducts.length > 0) {
    console.log('⚠️  Products already exist in database.');
    console.log('   Options:');
    console.log('   1. Delete existing products and import fresh');
    console.log('   2. Skip import');
    console.log('\n   For demo purposes, we will INSERT new products (may create duplicates)');
    console.log('   You can manually delete old products from Supabase dashboard if needed.\n');
  }
  
  // Insert products in batches
  const batchSize = 10;
  let successCount = 0;
  let errorCount = 0;
  const errors = [];
  
  for (let i = 0; i < allProducts.length; i += batchSize) {
    const batch = allProducts.slice(i, i + batchSize);
    
    const { data, error } = await supabase
      .from('products')
      .insert(batch)
      .select('id, name');
    
    if (error) {
      console.error(`❌ Error inserting batch ${Math.floor(i / batchSize) + 1}:`, error.message);
      errors.push({ batch: Math.floor(i / batchSize) + 1, error: error.message });
      errorCount += batch.length;
    } else {
      console.log(`✅ Inserted batch ${Math.floor(i / batchSize) + 1} (${batch.length} products)`);
      if (data) {
        data.forEach(p => console.log(`   - ${p.name}`));
      }
      successCount += data ? data.length : batch.length;
    }
  }
  
  console.log(`\n✨ Import complete!`);
  console.log(`   ✅ Success: ${successCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
  
  if (errors.length > 0) {
    console.log(`\n⚠️  Errors encountered:`);
    errors.forEach(e => console.log(`   Batch ${e.batch}: ${e.error}`));
  }
  
  console.log(`\n📝 Next steps:`);
  console.log(`   1. Verify products in Supabase dashboard`);
  console.log(`   2. Copy images from data/ to mobile-app/public/data/`);
  console.log(`   3. Restart your mobile app to see new products\n`);
}

// Run import
importProducts().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

