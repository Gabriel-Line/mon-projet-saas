
const MONCASH_URL = process.env.MONCASH_MODE === "sandbox" 
  ? "https://sandbox.moncashbutton.digicelgroup.com/Api"
  : "https://moncashbutton.digicelgroup.com/Api";

async function getMonCashToken() {
  const auth = Buffer.from(`${process.env.MONCASH_CLIENT_ID}:${process.env.MONCASH_SECRET_KEY}`).toString('base64');
  
  const res = await fetch(`${MONCASH_URL}/oauth/token?grant_type=client_credentials`, {
    method: "POST",
    headers: { "Authorization": `Basic ${auth}` },
    cache: 'no-store'
  });

  if (!res.ok) throw new Error("Erreur d'authentification MonCash");
  const data = await res.json();
  return data.access_token;
}

export async function generateMonCashPayment(orderId: number, amount: number) {
  const token = await getMonCashToken();
  
  const res = await fetch(`${MONCASH_URL}/v1/CreatePayment`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      amount: amount,
      orderId: orderId.toString()
    })
  });

  const paymentData = await res.json();
  // Retourne l'URL de redirection Digicel
  return `${MONCASH_URL}/v1/checkout?token=${paymentData.payment_token.token}`;
}