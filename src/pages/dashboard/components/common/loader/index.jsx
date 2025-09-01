import React from 'react';
import logo from 'assets/images/agro.png';

function Loader() {
  return (
    <div className='flex items-center justify-center bg-gray100 dark:bg-main-dark-bg h-full py-10 my-5'>
      <div className='w-14 border-t-2 rounded-full border-gray-500 dark:border-gray-100 bg-gray-50 dark:bg-main-dark-bg animate-spin aspect-square'></div>
      <img src={logo} alt='Logo' className='w-8 h-8 absolute' />
    </div>
  );
}

export default Loader;
