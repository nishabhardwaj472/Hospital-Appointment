import React from 'react'
import { assets } from '../assets/assets'

const About = () => {
  return (
    <div>
        
      <div className='text-center text-2xl pt-10 text-gray-500'>
        <p>ABOUT <span className='text-gray-700 font-medium'>US</span> </p>
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-12'>
        <img className='w-full md:max-w-[360px]' src={assets.about_image} alt="" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600'>
        <p>Welcome to our trusted doctor appointment platform, your one-stop solution for convenient and reliable healthcare access. We connect you with verified, experienced doctors across multiple specialties. Whether you're booking your first visit or following up, our platform ensures a seamless experience that prioritizes your time, comfort, and overall well-being.</p>
        <p>We help you find and book appointments with experienced, verified doctors across various specialties.</p>
        <b className='text-gray-800'>Our Vision</b>
        <p>Our vision is to transform the way people access healthcare by making it simple, reliable, and accessible to all. We aim to bridge the gap between patients and healthcare providers through technology-driven solutions that offer convenience, transparency, and trust. By empowering individuals with tools to book appointments, consult with verified doctors, and manage their health efficiently, we envision a future where quality healthcare is just a click away—anytime, anywhere, for everyone.</p>

        </div>
      </div>

      <div className='text-xl my-4'>
        <p>WHY <span className='text-gray-700 font-semibold'>CHHOSE US</span> </p>
      </div>

      <div className='flex flex-col md:flex-row mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300m text-gray-600 cursor-pointer'>
          <b>EFFICIENCY:</b>
          <p>We prioritize efficiency by enabling quick, seamless appointment bookings. Our platform reduces wait times and enhances convenience for every patient.</p>
          </div>
       
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300m text-gray-600 cursor-pointer'>
        <b>CONVENIENCE:</b>
        <p>Our platform is built for your convenience, allowing you to book appointments anytime, anywhere. Easily access trusted doctors, manage your schedule, and receive care without hassle.</p>
        </div>

        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300m text-gray-600 cursor-pointer'>
        <b>PERSONALIZATION:</b>
        <p>We offer a personalized healthcare experience tailored to your unique needs and preferences. From doctor recommendations to appointment reminders, everything is designed just for you.</p>
        </div>

      </div>

    </div>
  )
}

export default About