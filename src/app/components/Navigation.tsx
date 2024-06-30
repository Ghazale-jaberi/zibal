import Image from 'next/image'
import React from 'react'
import logo from '../../../public/logo.svg'
function Navigation() {
  return (
    <div className='gradientAnimation'>
         <div className='wave'></div>
         <div className='wave'></div>
         <Image
        src={logo}
        width={90}
        height={50}
        alt="Picture of the logo"
      />
       
    </div>
  )
}

export default Navigation