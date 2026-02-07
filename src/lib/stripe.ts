
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27' as any, // Utilise la version la plus stable
});

export async function createStripeSession(orderId: number, amount: number) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'htg',
          product_data: {
            name: `Commande #${orderId} sur Operix`,
            description: "Paiement sécurisé par carte",
          },
          unit_amount: Math.round(amount * 100), // Stripe calcule en centimes
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    metadata: { orderId: orderId.toString() },
    success_url: `${process.env.NEXT_PUBLIC_URL}/paiement/success?id=${orderId}`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/cart`,
  });

  if (!session.url) throw new Error("Impossible de générer la session Stripe");
  
  return session.url;
}