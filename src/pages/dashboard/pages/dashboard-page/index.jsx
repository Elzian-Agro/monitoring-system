import React from 'react';
import { useTranslation } from 'react-i18next';
import Charts from './charts';

const DashboardPage = () => {
  const { t } = useTranslation();

  return (
    <div className='bg-white dark:bg-secondary-dark-bg border border-gray-100 dark:border-gray-700 rounded-xl shadow-md mx-6 mt-3'>
      <div className=' px-6 py-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 w-full'>
          {/* Card 1 */}
          <div className='bg-opacity-20 p-6 bg-gradient-to-br from-green-500 to-lime-500 rounded-xl shadow-md'>
            <h2 className='text-xl font-semibold text-white mb-4'>{t('Weather Monitoring')}</h2>
            <p className='text-white'>{t('Enable')}</p>
          </div>
          {/* Card 2 */}
          <div className='bg-gradient-to-br from-green-500 to-lime-500 bg-opacity-20 p-6 rounded-xl shadow-md'>
            <h2 className='text-xl font-semibold text-white mb-4'>{t('Weather Prediction')}</h2>
            <p className='text-white'>{t('Enable')}</p>
          </div>
          {/* Card 3 */}
          <div className='bg-gradient-to-br from-green-500 to-lime-500 bg-opacity-20 p-6 rounded-xl shadow-md'>
            <h2 className='text-xl font-semibold text-white mb-4'>{t('Soil Monitoring')}</h2>
            <p className='text-white'>{t('Enable')}</p>
          </div>
          {/* Card 4 */}
          <div className='bg-gradient-to-br from-green-500 to-lime-500 bg-opacity-20 p-6 rounded-xl shadow-md'>
            <h2 className='text-xl font-semibold text-white mb-4'>{t('Smart Agro Assistant')}</h2>
            <p className='text-white'>{t('Enable')}</p>
          </div>
        </div>
      </div>

      <div className='p-6'>
        <Charts />

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6'>
          <div className='bg-white dark:bg-secondary-dark-bg rounded-md border border-gray-100 dark:border-gray-600 p-6 shadow-md shadow-black/5'>
            <div className='flex justify-between mb-6'>
              <div>
                <div className='flex items-center mb-1'>
                  <div className='text-2xl font-semibold dark:text-white'>2</div>
                </div>
                <div className='text-sm font-medium text-gray-400'>{t('Devices')}</div>
              </div>
              <div className='dropdown'>
                <button type='button' className='dropdown-toggle text-gray-400 hover:text-gray-600'>
                  <i className='ri-more-fill'></i>
                </button>
              </div>
            </div>

            <p className='text-[#f84525] font-medium text-sm hover:text-red-800'>{t('View')}</p>
          </div>
          <div className='bg-white dark:bg-secondary-dark-bg rounded-md border border-gray-100 dark:border-gray-600 p-6 shadow-md shadow-black/5'>
            <div className='flex justify-between mb-4'>
              <div>
                <div className='flex items-center mb-1'>
                  <div className='text-2xl font-semibold dark:text-white'>100</div>
                  <div className='p-1 rounded bg-emerald-500/10 text-emerald-500 text-[12px] font-semibold leading-none ml-2'>
                    +30%
                  </div>
                </div>
                <div className='text-sm font-medium text-gray-400'>{t('Ratings')}</div>
              </div>
              <div className='dropdown'>
                <button type='button' className='dropdown-toggle text-gray-400 hover:text-gray-600'>
                  <i className='ri-more-fill'></i>
                </button>
              </div>
            </div>
            <p className='text-[#f84525] font-medium text-sm hover:text-red-800'>{t('View')}</p>
          </div>
          <div className='bg-white dark:bg-secondary-dark-bg rounded-md border border-gray-100 dark:border-gray-600 p-6 shadow-md shadow-black/5'>
            <div className='flex justify-between mb-6'>
              <div>
                <div className='text-2xl font-semibold dark:text-white'>100</div>
                <div className='text-sm font-medium text-gray-400'>{t('Blogs')}</div>
              </div>
              <div className='dropdown'>
                <button type='button' className='dropdown-toggle text-gray-400 hover:text-gray-600'>
                  <i className='ri-more-fill'></i>
                </button>
              </div>
            </div>
            <p className='text-[#f84525] font-medium text-sm hover:text-red-800'>{t('View')}</p>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6'>
          <div className='p-6 relative flex flex-col min-w-0 mb-4 lg:mb-0 break-words bg-white dark:bg-secondary-dark-bg border border-gray-100 dark:border-gray-600 shadow-md shadow-black/5 rounded-md w-full'>
            <div className='rounded-t mb-0 px-0 border-0'>
              <div className='flex flex-wrap items-center px-4 py-2'>
                <div className='relative w-full max-w-full flex-grow flex-1'>
                  <h3 className='font-semibold text-base text-gray-900 dark:text-gray-50'>{t('Payments')}</h3>
                </div>
              </div>
              <div className='overflow-x-auto' style={{ scrollbarWidth: 'thin', scrollbarColor: '#888 #f1f1f1' }}>
                <table className='items-center w-full bg-transparent border-collapse'>
                  <thead>
                    <tr>
                      <th className='px-4 bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-100 align-middle border border-solid border-gray-200 dark:border-gray-500 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left'>
                        {t('Role')}
                      </th>
                      <th className='px-4 bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-100 align-middle border border-solid border-gray-200 dark:border-gray-500 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left'>
                        {t('Amount')}
                      </th>
                      <th className='px-4 bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-100 align-middle border border-solid border-gray-200 dark:border-gray-500 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left min-w-140-px'></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className='text-gray-700 dark:text-gray-100'>
                      <th className='border-t-0 px-4 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left'>
                        {t('January')}
                      </th>
                      <td className='border-t-0 px-4 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4'>
                        10$
                      </td>
                      <td className='border-t-0 px-4 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4'>
                        <div className='flex items-center'>
                          <span className='mr-2'>70%</span>
                          <div className='relative w-full'>
                            <div className='overflow-hidden h-2 text-xs flex rounded bg-blue-200'>
                              <div className='shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600'></div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr className='text-gray-700 dark:text-gray-100'>
                      <th className='border-t-0 px-4 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left'>
                        {t('February')}
                      </th>
                      <td className='border-t-0 px-4 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4'>
                        60$
                      </td>
                      <td className='border-t-0 px-4 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4'>
                        <div className='flex items-center'>
                          <span className='mr-2'>40%</span>
                          <div className='relative w-full'>
                            <div className='overflow-hidden h-2 text-xs flex rounded bg-blue-200'>
                              <div className='shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500'></div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className='bg-white dark:bg-secondary-dark-bg border border-gray-100 dark:border-gray-600 shadow-md shadow-black/5 p-6 rounded-md'>
            <div className='flex justify-between mb-4 items-start'>
              <div className='font-medium dark:text-white'>{t('Activities')}</div>
              <div className='dropdown'>
                <button type='button' className='dropdown-toggle text-gray-400 hover:text-gray-600'>
                  <i className='ri-more-fill'></i>
                </button>
              </div>
            </div>
            <div className='overflow-hidden'>
              <table className='w-full min-w-[540px]'>
                <tbody>
                  <tr>
                    <td className='py-2 px-4 border-b border-b-gray-50'>
                      <div className='flex items-center'>
                        <p className='text-gray-400 text-sm font-medium hover:text-blue-500 ml-2 truncate'>
                          {t('User Login')}
                        </p>
                      </div>
                    </td>
                    <td className='py-2 px-4 border-b border-b-gray-50'>
                      <span className='text-[13px] font-medium text-gray-400'>02-02-2024</span>
                    </td>
                    <td className='py-2 px-4 border-b border-b-gray-50'>
                      <span className='text-[13px] font-medium text-gray-400'>17.45</span>
                    </td>
                    <td className='py-2 px-4 border-b border-b-gray-50'>
                      <div className='dropdown'>
                        <button
                          type='button'
                          className='dropdown-toggle text-gray-400 hover:text-gray-600 text-sm w-6 h-6 rounded flex items-center justify-center bg-gray-50'>
                          <i className='ri-more-2-fill'></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className='py-2 px-4 border-b border-b-gray-50'>
                      <div className='flex items-center'>
                        <p className='text-gray-400 text-sm font-medium hover:text-blue-500 ml-2 truncate'>
                          {t('User Profile Update')}
                        </p>
                      </div>
                    </td>
                    <td className='py-2 px-4 border-b border-b-gray-50'>
                      <span className='text-[13px] font-medium text-gray-400'>02-02-2024</span>
                    </td>
                    <td className='py-2 px-4 border-b border-b-gray-50'>
                      <span className='text-[13px] font-medium text-gray-400'>17.45</span>
                    </td>
                    <td className='py-2 px-4 border-b border-b-gray-50'>
                      <div className='dropdown'>
                        <button
                          type='button'
                          className='dropdown-toggle text-gray-400 hover:text-gray-600 text-sm w-6 h-6 rounded flex items-center justify-center bg-gray-50'>
                          <i className='ri-more-2-fill'></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6'>
          <div className='bg-white dark:bg-secondary-dark-bg border border-gray-100 dark:border-gray-600 shadow-md shadow-black/5 p-6 rounded-md lg:col-span-2'>
            <div className='flex justify-between mb-4 items-start'>
              <div className='font-medium dark:text-white'>{t('Device Statistics')}</div>
              <div className='dropdown'>
                <button type='button' className='dropdown-toggle text-gray-400 hover:text-gray-600'>
                  <i className='ri-more-fill'></i>
                </button>
              </div>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4'>
              <div className='rounded-md border border-dashed border-gray-200 p-4'>
                <div className='flex items-center mb-0.5'>
                  <div className='text-xl font-semibold dark:text-white'>10</div>
                  <span className='p-1 rounded text-[12px] font-semibold bg-blue-500/10 text-blue-500 leading-none ml-1'>
                    $80
                  </span>
                </div>
                <span className='text-gray-400 text-sm'>{t('Active')}</span>
              </div>
              <div className='rounded-md border border-dashed border-gray-200 p-4'>
                <div className='flex items-center mb-0.5'>
                  <div className='text-xl font-semibold dark:text-white'>50</div>
                  <span className='p-1 rounded text-[12px] font-semibold bg-emerald-500/10 text-emerald-500 leading-none ml-1'>
                    +$469
                  </span>
                </div>
                <span className='text-gray-400 text-sm'>{t('Inactive')}</span>
              </div>
              <div className='rounded-md border border-dashed border-gray-200 p-4'>
                <div className='flex items-center mb-0.5'>
                  <div className='text-xl font-semibold dark:text-white'>4</div>
                  <span className='p-1 rounded text-[12px] font-semibold bg-rose-500/10 text-rose-500 leading-none ml-1'>
                    -$130
                  </span>
                </div>
                <span className='text-gray-400 text-sm'>{t('Disabled')}</span>
              </div>
            </div>
          </div>
          <div className='bg-white dark:bg-secondary-dark-bg border border-gray-100 dark:border-gray-600 shadow-md shadow-black/5 p-6 rounded-md lg:col-span-2'>
            <div className='flex justify-between mb-4 items-start'>
              <div className='font-medium dark:text-white'>{t('Earnings')}</div>
              <div className='dropdown'>
                <button type='button' className='dropdown-toggle text-gray-400 hover:text-gray-600'>
                  <i className='ri-more-fill'></i>
                </button>
              </div>
            </div>
            <div className='overflow-x-auto' style={{ scrollbarWidth: 'thin', scrollbarColor: '#888 #f1f1f1' }}>
              <table className='w-full min-w-[460px]'>
                <thead>
                  <tr>
                    <th className='text-[12px] uppercase tracking-wide font-medium text-gray-400 dark:text-white py-2 px-4 bg-gray-50 dark:bg-gray-600 text-left rounded-tl-md rounded-bl-md'>
                      {t('Service')}
                    </th>
                    <th className='text-[12px] tracking-wide font-medium text-gray-400 dark:text-white py-2 px-4 bg-gray-50 dark:bg-gray-600 text-left'>
                      {t('EARNING')}
                    </th>
                    <th className='text-[12px] uppercase tracking-wide font-medium text-gray-400 dark:text-white py-2 px-4 bg-gray-50 dark:bg-gray-600 text-left rounded-tr-md rounded-br-md'>
                      {t('Status')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className='py-2 px-4 border-b border-b-gray-50'>
                      <div className='flex items-center'>
                        <img
                          src='https://placehold.co/32x32'
                          alt=''
                          className='w-8 h-8 rounded object-cover block'></img>
                        <p className='text-gray-400 text-sm font-medium hover:text-blue-500 ml-2 truncate'>
                          {t('Research Contribution')}
                        </p>
                      </div>
                    </td>
                    <td className='py-2 px-4 border-b border-b-gray-50'>
                      <span className='text-[13px] font-medium text-emerald-500'>+$235</span>
                    </td>
                    <td className='py-2 px-4 border-b border-b-gray-50'>
                      <span className='inline-block p-1 rounded bg-emerald-500/10 text-emerald-500 font-medium text-[12px] leading-none'>
                        {t('Pending')}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className='py-2 px-4 border-b border-b-gray-50'>
                      <div className='flex items-center'>
                        <img
                          src='https://placehold.co/32x32'
                          alt=''
                          className='w-8 h-8 rounded object-cover block'></img>
                        <p className='text-gray-400 text-sm font-medium hover:text-blue-500 ml-2 truncate'>
                          {t('Technology Development')}
                        </p>
                      </div>
                    </td>
                    <td className='py-2 px-4 border-b border-b-gray-50'>
                      <span className='text-[13px] font-medium text-rose-500'>-$235</span>
                    </td>
                    <td className='py-2 px-4 border-b border-b-gray-50'>
                      <span className='inline-block p-1 rounded bg-rose-500/10 text-rose-500 font-medium text-[12px] leading-none'>
                        {t('Withdrawn')}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
