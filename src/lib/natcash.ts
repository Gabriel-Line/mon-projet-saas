
const NATCASH_URL = "https://api.natcash.com/v1/payment"; // URL à adapter selon ton prestataire

export async function generateNatCashPayment(orderId: number, amount: number) {
  // Les APIs NatCash demandent souvent une signature numérique (HMAC)
  const res = await fetch(NATCASH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": process.env.NATCASH_API_KEY!
    },
    body: JSON.stringify({
      order_id: orderId,
      amount: amount,
      currency: "HTG",
      return_url: `${process.env.NEXT_PUBLIC_URL}/paiement/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/cart`
    })
  });

  if (!res.ok) throw new Error("Erreur lors de la liaison avec NatCash");
  
  const data = await res.json();
  return data.redirect_url; 
}