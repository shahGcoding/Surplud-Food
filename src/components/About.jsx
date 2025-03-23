import React from 'react'

function About() {
    return (
        <div className=" p-8 bg-white shadow-lg rounded-lg">
          {/* Heading Section */}
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-6">
            About Us
          </h2>
          
          <p className="text-center text-gray-600 text-lg mb-8">
            Welcome to our Surplus Food Marketplace! We connect restaurants, hotels, 
            and event organizers with buyers looking for quality surplus food at 
            affordable prices. Our mission is to reduce food waste and make a positive 
            impact on the environment.
          </p>
    
          {/* Our Mission Section */}
          <div className="flex flex-col md:flex-row items-center gap-8">
            <img
              src="/public/SavingFood.png"
              alt="Food Saving"
              className="w-full md:w-1/2 rounded-lg shadow-md"
            />
            
            <div className="md:w-1/2">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Our Mission</h3>
              <p className="text-gray-600">
                Every year, tons of food go to waste while millions go hungry. Our platform 
                aims to bridge this gap by allowing food businesses to sell surplus food 
                instead of wasting it. Together, we can make a difference by reducing food 
                waste and promoting sustainability.
              </p>
            </div>
          </div>
    
          {/* Our Vision Section */}
          <div className="mt-12 flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Our Vision</h3>
              <p className="text-gray-600">
                We envision a world where food waste is minimized, and every surplus meal 
                finds a home. Our goal is to expand this initiative globally, making food 
                accessible and affordable for everyone while helping businesses optimize 
                their resources.
              </p>
            </div>
    
            <img
              src="/Sustainable.png"
              alt="Sustainable Future"
              className="w-full md:w-1/2 rounded-lg shadow-md"
            />
          </div>
    
          {/* Call to Action */}
          <div className="mt-12 text-center">
            <h3 className="text-xl font-semibold text-gray-800">Join Us in Making a Difference!</h3>
            <p className="text-gray-600 mt-2">
              Whether you're a restaurant looking to sell surplus food or a buyer looking for affordable meals, 
              we invite you to be a part of this sustainable movement.
            </p>
            <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300">
              Get Started
            </button>
          </div>
        </div>
      );
}

export default About