/**
 * Sync Stripe Products and Prices to Database
 * 
 * This script fetches all active products and prices from Stripe
 * and syncs them to the local database Product and Price tables.
 * 
 * Run with: npx tsx scripts/sync-stripe-products.ts
 */

import { stripe } from '../utils/stripe';
import { prisma } from '../utils/db';

async function syncStripeProducts() {
  console.log('🔄 Starting Stripe product sync...');
  
  try {
    // Fetch all products from Stripe
    const products = await stripe.products.list({
      active: true,
      expand: ['data.default_price'],
    });
    
    console.log(`📦 Found ${products.data.length} active products in Stripe`);
    
    // Fetch all prices (needed for products without default_price)
    const prices = await stripe.prices.list({
      active: true,
      expand: ['data.product'],
    });
    
    console.log(`💰 Found ${prices.data.length} active prices in Stripe`);
    
    // Sync each product
    for (const stripeProduct of products.data) {
      console.log(`\n📝 Syncing product: ${stripeProduct.name} (${stripeProduct.id})`);
      
      // Upsert product
      const product = await prisma.product.upsert({
        where: { stripeId: stripeProduct.id },
        create: {
          stripeId: stripeProduct.id,
          name: stripeProduct.name,
          description: stripeProduct.description || null,
          active: stripeProduct.active,
        },
        update: {
          name: stripeProduct.name,
          description: stripeProduct.description || null,
          active: stripeProduct.active,
          updatedAt: new Date(),
        },
      });
      
      console.log(`  ✅ Product synced to database (${product.id})`);
      
      // Find all prices for this product
      const productPrices = prices.data.filter(
        price => typeof price.product === 'string' 
          ? price.product === stripeProduct.id
          : price.product.id === stripeProduct.id
      );
      
      // Sync each price
      for (const stripePrice of productPrices) {
        const priceType = stripePrice.type; // 'one_time' or 'recurring'
        const interval = stripePrice.recurring?.interval || null;
        const intervalCount = stripePrice.recurring?.interval_count || null;
        
        await prisma.price.upsert({
          where: { stripeId: stripePrice.id },
          create: {
            stripeId: stripePrice.id,
            productId: product.id,
            amount: stripePrice.unit_amount || 0,
            currency: stripePrice.currency,
            interval: interval,
            intervalCount: intervalCount,
            type: priceType,
            active: stripePrice.active,
          },
          update: {
            amount: stripePrice.unit_amount || 0,
            currency: stripePrice.currency,
            interval: interval,
            intervalCount: intervalCount,
            type: priceType,
            active: stripePrice.active,
            updatedAt: new Date(),
          },
        });
        
        const displayInterval = interval ? `/${interval}` : '(one-time)';
        console.log(`  💵 Price synced: ${stripePrice.unit_amount! / 100} ${stripePrice.currency.toUpperCase()} ${displayInterval}`);
      }
    }
    
    // Deactivate products in DB that are no longer active in Stripe
    const allDbProducts = await prisma.product.findMany({
      select: { id: true, stripeId: true },
    });
    
    const activeStripeIds = products.data.map(p => p.id);
    const productsToDeactivate = allDbProducts.filter(
      dbProduct => !activeStripeIds.includes(dbProduct.stripeId)
    );
    
    if (productsToDeactivate.length > 0) {
      console.log(`\n🔕 Deactivating ${productsToDeactivate.length} products no longer active in Stripe`);
      await prisma.product.updateMany({
        where: {
          id: { in: productsToDeactivate.map(p => p.id) },
        },
        data: {
          active: false,
          updatedAt: new Date(),
        },
      });
    }
    
    console.log('\n✅ Stripe product sync complete!');
    
  } catch (error) {
    console.error('❌ Error syncing Stripe products:', error);
    throw error;
  }
}

// Run the sync
syncStripeProducts()
  .then(() => {
    console.log('\n🎉 Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Fatal error:', error);
    process.exit(1);
  });
