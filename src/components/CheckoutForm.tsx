"use client";

import { useStripe, useElements, PaymentElement, ExpressCheckoutElement } from "@stripe/react-stripe-js";
import { useState } from "react";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isExpressAvailable, setIsExpressAvailable] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Return URL where the customer should be redirected after the payment
        return_url: `${window.location.origin}/app?upgrade=success`,
      },
    });

    if (error) {
      setErrorMessage(error.message ?? "An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  const handleDisplayError = (error: Error) => {
    setErrorMessage(error.message ?? "An unexpected error occurred.");
    setIsLoading(false);
  };

  const onConfirmExpressCheckout = async () => {
    if (!stripe || !elements) return;
    setIsLoading(true);
    
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/app?upgrade=success`,
      }
    });

    if (error) {
      handleDisplayError(error as any);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
      <div className="express-checkout-wrapper">
        <ExpressCheckoutElement 
          options={{
            buttonType: {
              applePay: 'subscribe',
              googlePay: 'subscribe',
            },
            paymentMethods: {
              link: 'auto',
              googlePay: 'always',
              applePay: 'always'
            }
          }}
          onReady={({ availablePaymentMethods }) => {
            // availablePaymentMethods will show what's actually rendered
            setIsExpressAvailable(!!availablePaymentMethods);
          }}
          onConfirm={onConfirmExpressCheckout} 
        />
      </div>
      
      {isExpressAvailable && (
        <div className="divider text-base-content/40 text-sm">OR PAY WITH CARD</div>
      )}

      <PaymentElement options={{ 
        layout: "tabs",
        wallets: {
          applePay: 'never',
          googlePay: 'never',
          link: 'never'
        }
      }} />
      
      {errorMessage && (
        <div className="alert alert-error">
          <span>{errorMessage}</span>
        </div>
      )}

      <button
        disabled={isLoading || !stripe || !elements}
        className="btn btn-primary w-full shadow-md"
      >
        {isLoading ? <span className="loading loading-spinner"></span> : "Subscribe to Pro"}
      </button>
    </form>
  );
}
