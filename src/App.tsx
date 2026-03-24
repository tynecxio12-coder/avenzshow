import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { StoreProvider } from "@/contexts/StoreContext";

import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import WishlistPage from "./pages/WishlistPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import AccountPage from "./pages/AccountPage";
import FAQPage from "./pages/FAQPage";
import TrackOrderPage from "./pages/TrackOrderPage";
import PolicyPage from "./pages/PolicyPage";
import NotFound from "./pages/NotFound";
import TestSupabase from "./pages/TestSupabase";

const privacyContent = [
  {
    heading: "Information We Collect",
    text: "We collect information you provide directly, such as your name, email address, shipping address, and payment information when you place an order. We also collect browsing data and device information to improve your experience.",
  },
  {
    heading: "How We Use Your Information",
    text: "Your information is used to process orders, communicate with you about your purchases, improve our services, and send promotional offers (with your consent). We never sell your personal data to third parties.",
  },
  {
    heading: "Data Security",
    text: "We implement industry-standard security measures including SSL encryption, secure payment processing, and regular security audits to protect your personal information.",
  },
  {
    heading: "Cookies",
    text: "Our website uses cookies to enhance your browsing experience, remember your preferences, and analyze website traffic. You can manage cookie preferences through your browser settings.",
  },
  {
    heading: "Contact Us",
    text: "If you have questions about this privacy policy, contact us at privacy@avenzshoe.com.bd or call +880 1700-123456.",
  },
];

const termsContent = [
  {
    heading: "Acceptance of Terms",
    text: "By using the AvenzShoe website, you agree to these terms and conditions. If you do not agree, please do not use our services.",
  },
  {
    heading: "Products & Pricing",
    text: "All prices are listed in Bangladeshi Taka (BDT/৳). We reserve the right to change prices without prior notice. Product images are for illustration purposes and may vary slightly from the actual product.",
  },
  {
    heading: "Orders & Payment",
    text: "Orders are confirmed upon successful payment or acceptance of cash on delivery. We reserve the right to cancel any order due to stock unavailability, pricing errors, or suspected fraud.",
  },
  {
    heading: "Shipping & Delivery",
    text: "We deliver across Bangladesh. Inside Dhaka: 1-2 business days. Outside Dhaka: 3-5 business days. Delivery charges apply based on location.",
  },
  {
    heading: "Returns & Refunds",
    text: "Unused products in original packaging can be returned within 7 days of delivery. Refunds are processed within 5-7 business days after we receive the returned item.",
  },
  {
    heading: "Limitation of Liability",
    text: "AvenzShoe shall not be liable for any indirect, incidental, or consequential damages arising from the use of our website or products.",
  },
];

const shippingContent = [
  {
    heading: "Delivery Areas",
    text: "We deliver to all districts across Bangladesh. Our primary delivery hub is in Dhaka, ensuring fastest service for customers within the city.",
  },
  {
    heading: "Delivery Timeline",
    text: "Inside Dhaka: 1-2 business days\nOutside Dhaka (divisional cities): 3-4 business days\nRemote areas: 4-5 business days",
  },
  {
    heading: "Delivery Charges",
    text: "Inside Dhaka: ৳60\nOutside Dhaka: ৳120\nFree delivery on orders above ৳5,000 (Inside Dhaka)",
  },
  {
    heading: "Order Tracking",
    text: "Once your order is shipped, you'll receive a tracking number via SMS and email. Track your order on our website or contact customer support.",
  },
  {
    heading: "Delivery Partners",
    text: "We work with trusted courier services including Pathao, RedX, and Steadfast to ensure safe and timely delivery of your orders.",
  },
];

const returnContent = [
  {
    heading: "Return Policy",
    text: "We want you to love your AvenzShoe purchase. If you're not completely satisfied, you may return unused items within 7 days of delivery.",
  },
  {
    heading: "Return Conditions",
    text: "Items must be unworn, undamaged, and in original packaging with all tags attached. Sale items and custom orders are final sale and cannot be returned.",
  },
  {
    heading: "How to Return",
    text: "1. Contact our support team at support@avenzshoe.com.bd or call +880 1700-123456\n2. Receive a return authorization and shipping instructions\n3. Pack the item securely in its original packaging\n4. Ship to our Dhaka warehouse",
  },
  {
    heading: "Refund Process",
    text: "Refunds are processed within 5-7 business days after we receive and inspect the returned item. The refund will be issued to your original payment method.",
  },
  {
    heading: "Exchanges",
    text: "We offer free exchanges for size or color within 7 days. Contact support to arrange an exchange. The replacement will be shipped once we receive your original item.",
  },
];

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <StoreProvider>
        <TooltipProvider>
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route
                path="/order-confirmation/:orderId"
                element={<OrderConfirmationPage />}
              />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/account" element={<AccountPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/track-order" element={<TrackOrderPage />} />
              <Route
                path="/privacy"
                element={
                  <PolicyPage
                    title="Privacy Policy"
                    content={privacyContent}
                  />
                }
              />
              <Route
                path="/terms"
                element={
                  <PolicyPage
                    title="Terms & Conditions"
                    content={termsContent}
                  />
                }
              />
              <Route
                path="/shipping-policy"
                element={
                  <PolicyPage
                    title="Shipping Policy"
                    content={shippingContent}
                  />
                }
              />
              <Route
                path="/return-policy"
                element={
                  <PolicyPage
                    title="Return & Refund Policy"
                    content={returnContent}
                  />
                }
              />
              <Route path="/test-supabase" element={<TestSupabase />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </StoreProvider>
    </QueryClientProvider>
  );
}

export default App;
