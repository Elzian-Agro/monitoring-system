import React, { useState, useEffect, useMemo } from 'react';
import '../index.css';
import Navbar from 'components/common/navbar';
import Sidebar from 'components/common/sidebar';
import { useSelector } from 'react-redux';
import { selectActiveMenu, selectTheme } from '../slice/dashboardLayoutSlice';
import DataTable from 'react-data-table-component';
import Button from '../components/base/Button';
import { customTableStyles } from 'constant';
import axios from 'axios';

const getSidebarWidth = (activeMenu) => {
  switch (activeMenu) {
    case 'open':
      return 'w-56 md:w-60 fixed';
    case 'onlyIcon':
      return 'w-30';
    default:
      return 'w-0';
  }
};

const getMainContentMargin = (activeMenu) => {
  switch (activeMenu) {
    case 'open':
      return 'ml-56 md:ml-60';
    case 'onlyIcon':
      return 'md:ml-2';
    default:
      return 'flex-2';
  }
};

// Table columns
const columns = [
  {
    name: 'First Name',
    selector: (row) => row.firstName,
    sortable: true,
  },
  {
    name: 'Last Name',
    selector: (row) => row.lastName,
    sortable: true,
  },
  {
    name: 'Email',
    selector: (row) => row.email,
  },
  {
    name: 'Organization Name',
    selector: (row) => row.orgName,
  },
  {
    name: 'User Type',
    selector: (row) => row.userType,
  },
  {
    name: 'Action',
    cell: () => (
      <div>
        <button
          className='bg-blue-600 hover:bg-blue-500 text-white py-2 px-2 mx-1 rounded-lg w-16'
          onClick={() => handleEdit()}>
          Edit
        </button>
        <button
          className='bg-red-600 hover:bg-red-500 text-white py-2 px-2 mx-1 rounded-lg w-16'
          onClick={() => handleDelete()}>
          Delete
        </button>
      </div>
    ),
  },
];

const handleCreate = () => {
  // TO DO: handle create
};

const handleEdit = () => {
  // TO DO: handle edit
};

const handleDelete = () => {
  // TO DO: handle delete
};

const handleDownload = () => {
  // TO DO: handle download
};

const ManageUsers = () => {
  const activeMenu = useSelector(selectActiveMenu);
  const sidebarWidth = getSidebarWidth(activeMenu);
  const mainContentMargin = getMainContentMargin(activeMenu);
  const currentMode = useSelector(selectTheme);
  const [users, setUsers] = useState([]);
  const [pending, setPending] = useState(true);
  const [filterText, setFilterText] = useState('');

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/user/users`)
      .then((response) => {
        setPending(false);
        setUsers(response.data);
      })
      .catch((error) => {
        //TO DO: handle errors
      });
  }, []);

  // Function to filter the data based on the search text
  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.firstName.toLowerCase().includes(filterText.toLowerCase()) ||
        user.lastName.toLowerCase().includes(filterText.toLowerCase()) ||
        user.email.toLowerCase().includes(filterText.toLowerCase()) ||
        user.orgName.toLowerCase().includes(filterText.toLowerCase()) ||
        user.userType.toLowerCase().includes(filterText.toLowerCase())
    );
  }, [users, filterText]);

  return (
    <div className={currentMode === 'Dark' ? 'dark' : ''}>
      <div className='flex relative dark:bg-main-dark-bg bg-gray-100'>
        <div className={`${sidebarWidth} z-20 md:z-0 dark:bg-secondary-dark-bg shadow-2xl dark:shadow-none bg-white`}>
          <Sidebar />
        </div>
        <div className={`${mainContentMargin} dark:bg-main-dark-bg bg-main-bg min-h-screen w-full`}>
          <div className='z-10 bg-main-bg  dark:bg-main-dark-bg w-full'>
            <Navbar />
          </div>
          <div className='mx-5 mt-2'>
            <div className='flex items-center justify-between mb-4'>
              <div>
                <Button bgColor='bg-green-500' text='Add+' onClick={() => handleCreate()} />
                <Button bgColor='bg-green-500' text='Download' onClick={() => handleDownload()} />
              </div>
              <div className='relative mr-2'>
                <input
                  type='text'
                  placeholder='Search...'
                  className='p-2 rounded-lg dark:bg-secondary-dark-bg dark:text-white border border-solid border-black dark:border-white w-32 sm:w-48 md:w-56'
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                />
                <button
                  className='absolute top-0 right-0 p-2 cursor-pointer bg-red-500 rounded-r-lg text-white'
                  onClick={() => {
                    setFilterText('');
                  }}>
                  X
                </button>
              </div>
            </div>
            <div className='pr-2 rounded-t-lg'>
              <DataTable
                columns={columns}
                data={filteredUsers}
                customStyles={customTableStyles}
                theme={currentMode === 'Dark' ? 'dark' : 'defalt'}
                pagination
                fixedHeader
                fixedHeaderScrollHeight='70vh'
                progressPending={pending}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
