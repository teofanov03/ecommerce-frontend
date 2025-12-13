// src/pages/AboutUsPage.jsx

import React from 'react';

const AboutUsPage = () => {
    return (
        <div className="container mx-auto p-6 max-w-4xl pt-12">
            
            <header className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-indigo-600 mb-4">
                    About NovaShop
                </h1>
                <p className="text-lg text-gray-600">
                    Your destination for the best quality products and seamless shopping experience.
                </p>
            </header>

            <section className="bg-white p-8 rounded-lg shadow-xl mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Our Mission</h2>
                <p className="text-gray-700 leading-relaxed">
                    At NovaShop, we believe in providing our customers with exceptional value and service. Our mission is to create a collection of high-quality, innovative products that enhance your everyday life, delivered directly to your door with efficiency and care.
                </p>
            </section>

            <section className="bg-white p-8 rounded-lg shadow-xl mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Why Choose Us?</h2>
                <ul className="space-y-3 text-gray-700 list-disc list-inside">
                    <li>
                        <span className="font-semibold text-indigo-600">Quality Assurance:</span> Every product is rigorously checked for quality and durability.
                    </li>
                    <li>
                        <span className="font-semibold text-indigo-600">Fast Shipping:</span> We prioritize quick processing and reliable shipment tracking.
                    </li>
                    <li>
                        <span className="font-semibold text-indigo-600">Customer Focus:</span> Our dedicated support team is here to ensure your complete satisfaction.
                    </li>
                </ul>
            </section>

            <section className="text-center pt-6">
                <p className="text-lg font-medium text-gray-700">
                    Thank you for choosing NovaShop. Happy Shopping!
                </p>
            </section>
        </div>
    );
};

export default AboutUsPage;