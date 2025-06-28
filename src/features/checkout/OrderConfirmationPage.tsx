import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "../../lib/stripe";
import OrderConfirmationStatus from "./OrderConfirmationStatus";

const OrderConfirmationPage = () => {
    return (
        <div className="container mx-auto p-8 flex justify-center items-center min-h-[60vh]">
            <Elements stripe={stripePromise}>
                <OrderConfirmationStatus />
            </Elements>
        </div>
    )
}

export default OrderConfirmationPage;