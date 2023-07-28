import { toast } from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";
import Rating from "src/components/Rating";
import { useShoppingCart, formatCurrencyString } from "use-shopping-cart";
import products from "../../products";

export default function ProductCard({ product, index }) {
    const { addItem } = useShoppingCart();

    function onAddToCart(event) {
        event.preventDefault();
        const id = toast.loading("Adding 1 item...");
        addItem(product);
        toast.success( product.name, { id });
    }

    return (
        <Link 
            href={product.id} 
            className="border-2 rounded-md group overflow-hiden">
            <div className="relative w-full h-64">
                <Image priority={index === 0} src={product.image} alt={product.name} fill sizes="100%" style={{objectFit: "contain",}} />
            </div>

            <div className="p-6 bg-white">
                <p className="font-semibold text-lg">{product.name}</p>
                <Rating />
                <div className="mt-4 flex items-center justify-between space-x-2">
                    <div>
                        <p className="text-gray-500">Berries</p>
                        <p className="text-lg font-semibold">{formatCurrencyString({
                            currency: product.currency, 
                            value: product.price,
                        })}
                        </p>
                    </div>
                    <button onClick={onAddToCart} className="border rounded-lg py-1 px-4">Add to Cart</button>
                </div>
            </div>
        </Link>
    );
}