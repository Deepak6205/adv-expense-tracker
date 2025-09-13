// src/pages/About.jsx
import React from "react";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      <div className="max-w-5xl w-full bg-white rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row">
        {/* Image Section */}
        <div className="md:w-1/2">
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80"
            alt="About Us"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Text Section */}
        <div className="md:w-1/2 p-6 flex flex-col justify-center">
          <h1 className="text-3xl font-bold text-blue-600 mb-4">About Us</h1>
          <p className="text-gray-700 mb-4">
            Welcome to <span className="font-semibold">Happy Shopping</span>! 
            We are dedicated to providing the best products and an amazing shopping experience for our customers.
          </p>
          <p className="text-gray-600 mb-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
            Pellentesque euismod, nisi eu consectetur consectetur, nisl nisi consectetur nisi, 
            eu consectetur nisl nisi euismod nisi.
          </p>
          <p className="text-gray-600">
            Our team is passionate about delivering quality, convenience, and satisfaction. 
            Join us on our journey to make online shopping enjoyable and hassle-free!
          </p>
          <button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg w-40">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;
