import React from 'react'
import { assets } from '../../assets/assets'
import { useState } from 'react'
import { useContext } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const AddDoctor = () => {

    const [docImg,setDocImg] = useState(false)
    const [name,setName] = useState('')
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [experience,setExperience] = useState('')
    const [fees,setFees] = useState('')
    const [about,setAbout] = useState('')
    const [speciality,setSpeciality] = useState('')
    const [degree,setDegree] = useState('')
    const [address1,setAddress1] = useState('')
    const [address2,setAddress2] = useState('')

    const { backendUrl, aToken } = useContext(AdminContext) 

    const onSubmitHandler = async (event) => {
        event.preventDefault()

        try {

            if (!docImg) {
                return toast.error('Image not selected')
            }

            const formData = new FormData()

            formData.append('image', docImg)
            formData.append('name', name)
            formData.append('email', email)
            formData.append('password', password)
            formData.append('experience', experience)
            formData.append('fees', Number(fees))
            formData.append('about', about)
            formData.append('speciality', speciality)
            formData.append('degree', degree)
            formData.append('address', JSON.stringify({ line1: address1, line2: address2 }))


            //console log formdata
            formData.forEach((value,key)=> {
                console.log(`${key} : ${value}`);
            } )

            const {data} = await axios.post(backendUrl + '/api/admin/add-doctor', formData, {headers : {aToken}});

            if (data.success) {
                toast.success(data.message)
                setDocImg(false)
                setName('')
                setPassword('')
                setEmail('')
                setAddress1('')
                setAddress2('')
                setDegree('')
                setAbout('')
                setFees('')     
            } else {
                toast.error(data.message)
            }
            
        } catch (error) {
  toast.error(error.message)
    console.error(error);
}

    } 

  return (
    <form onSubmit={onSubmitHandler} className='m-5 w-full'>
      <p className='mb-3 text-2xl font-semibold text-gray-700'>Add Doctor</p>

      <div className='bg-white px-8 py-8 border rounded w-full max-w-6xl max-h-[80vh] overflow-y-scroll'>
        
        {/* Upload Area */}
        <div className='flex items-center gap-4 mb-8 text-gray-500'>
          <label htmlFor="doc-img">
            <img className='w-16 bg-gray-100 rounded-full cursor-pointer' src={docImg ? URL.createObjectURL(docImg) : assets.upload_area} alt="upload" />
          </label>
          <input onChange={(e) => setDocImg(e.target.files[0])} type="file" id="doc-img" hidden />
          <p>Upload Doctor <br />picture</p>
        </div>

        {/* Form Fields - 2 Columns */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 text-gray-700'>

          <div>
            <p className='flex-1 flex flex-col gap-1'>Doctor Name</p>
            <input onChange={(e)=> setName(e.target.value)} value={name} className='border rounded px-3 py-2' type="text" placeholder='Name' required />
          </div>

          <div>
            <p className='mb-1'>Doctor Email</p>
            <input onChange={(e)=> setEmail(e.target.value)} value={email} className='border rounded px-3 py-2' type="email" placeholder='Email' required  />
          </div>

          <div>
            <p className='mb-1'>Password</p>
            <input onChange={(e)=> setPassword(e.target.value)} value={password} className='border rounded px-3 py-2' type="password" placeholder='Password' required  />
          </div>

          <div>
            <p className='mb-1'>Experience</p>
            <select onChange={(e)=> setExperience(e.target.value)} value={experience} className='border rounded px-3 py-2' required >
              {Array.from({ length: 10 }, (_, i) => (
                <option key={i} value={`${i + 1} Year`}>{i + 1} Year</option>
              ))}
            </select>
          </div>

          <div>
            <p className='mb-1'>Fees</p>
            <input onChange={(e)=> setFees(e.target.value)} value={fees} className='border rounded px-3 py-2' type="number" placeholder='Fees' required  />
          </div>

          <div>
            <p className='mb-1'>Speciality</p>
            <select onChange={(e)=> setSpeciality(e.target.value)} value={speciality} required className='border rounded px-3 py-2'>
              <option value="General Physician">General Physician</option>
              <option value="Gynecologist">Gynecologist</option>
              <option value="Dermatologist">Dermatologist</option>
              <option value="Pediatricians">Pediatricians</option>
              <option value="Neurologist">Neurologist</option>
              <option value="Gastroentrologist">Gastroentrologist</option>
            </select>
          </div>

          <div>
            <p className='mb-1'>Education</p>
            <input onChange={(e)=> setDegree(e.target.value)} value={degree} className='border rounded px-3 py-2' type="text" placeholder='Education' required  />
          </div>

          <div>
            <p className='mb-1'>Address Line 1</p>
            <input onChange={(e)=> setAddress1(e.target.value)} value={address1} className='border rounded px-3 py-2' type="text" placeholder='Address Line 1' required  />
            <p className='mt-3 mb-1'>Address Line 2</p>
            <input onChange={(e)=> setAddress2(e.target.value)} value={address2} className='border rounded px-3 py-2' type="text" placeholder='Address Line 2' required  />
          </div>

        </div>

        {/* About Section */}
        <div >
          <p className='mb-2 mt-4'>About Doctor</p>
          <textarea onChange={(e)=> setAbout(e.target.value)} value={about} className='w-full px-4 pt-2 border rounded' placeholder='Write about doctor...' rows={4} required />
        </div>

        {/* Submit Button */}
        <div className='mt-6'>
          <button type="submit" className='px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'>Add Doctor</button>
        </div>

      </div>
    </form>
  )
}

export default AddDoctor

