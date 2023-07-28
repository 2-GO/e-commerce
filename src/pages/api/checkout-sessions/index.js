import { stripe } from "src/utils/stripe";
import { validateCartItems } from 'use-shopping-cart/utilities';
 
export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const cartDetails = req.body;
            const inventory = await stripe.products.list({
                expand: ['data.default_price'],
            });
            const products = inventory.data.map((product) => {
                const price = product.default_price;
                return {
                    currency: price.currency, 
                    id: product.id, 
                    name: product.name,
                    price: price.unit_amount,
                    image: product.image,
                };
            });
            const lineItems = validateCartItems(products, cartDetails);
            const session = await stripe.checkout.sessions.create({
                mode: 'payment',
                payment_method_types: ['card'],
                line_items: lineItems,
                success_url: 'http://localhost:3000/success.html',
                cancel_url: 'http://localhost:3000/cancel.html',
            })
            res.status(200).json(session);
        } catch (error) {
            console.log(error);
            res.status(500).json({ statusCode: 500, message: error.message });
        }
    } else {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method Not Allowed');
    }
}