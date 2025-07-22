import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className='md:mx-10'>
        <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>

          {/*----Left section----*/}  
          <div>
            <img src={assets.logo} alt="" />
            <p className='w-full md:w-2/3 text-gray-600 leading-6'>Find trusted doctors and schedule appointments quickly across various specialties. No queues, no stress — just seamless healthcare access at your fingertips. Choose your doctor, select a time, and book instantly. Your well-being starts here. Get the care you need, when you need it.</p>
          </div>

                    {/*----center section----*/}  
                    <div>
                      <p className='text-xl font-medium mb-5'>COMPANY</p>
                      <ul className='flex flex-col gap-2 text-gray-600'>
                        <li>Home</li>
                        <li>About Us</li>
                        <li>Contact Us</li>
                        <li>Privacy Policy</li>
                      </ul>
                    </div>

                      {/*----Right section----*/}  
                      <div>
                        <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
                        <ul className='flex flex-col gap-2 text-gray-600'>
                            <li>+11-22-33-44-55</li>
                            <li>appointment1234@gmail.com</li>
                        </ul>
                          </div>

        </div>
        {/* copyright */}
        <div>
            <hr />
            <p className='py-5 text-sm text-center'>copyright 2025@appointment - All right Reserved</p>
        </div>
    </div>
  )
}

export default Footer