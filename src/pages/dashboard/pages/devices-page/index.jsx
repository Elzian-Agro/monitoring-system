import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectTheme } from '../../slice/dashboardLayoutSlice';
import { PrimaryButton, VariantButton } from '../../components/base/Button';
import { customTableStyles } from 'constant';
import DataTable from 'react-data-table-component';
import { downloadCSV } from '../../utils/download';
import Form from './device-form';
import { ArrowDownTrayIcon, PlusIcon } from '@heroicons/react/24/outline';
import SearchBox from '../../components/base/SearchBox';
import Loader from '../../components/common/loader';
import { useTranslation } from 'react-i18next';
import Modal from 'components/common/modal';
import useAxios from 'hooks/useAxios';

const DeviceManagement = () => {
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [filterText, setFilterText] = useState('');
  const [message, setMessage] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [actionType, setActionType] = useState('');
  const userType = useSelector((state) => state.user.userType);

  const currentMode = useSelector(selectTheme);
  const { t } = useTranslation();
  const { loading, send } = useAxios();

  const getDevices = async () => {
    const response = await send({ endpoint: 'device', method: 'GET' });
    setDevices(response?.result);
  };

  useEffect(() => {
    getDevices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Define columns array
  let columns = [
    {
      name: t('DEVICE ID'),
      selector: (row) => row.deviceId,
      sortable: true,
      cell: (row) => (
        <div className='flex flex-row gap-2 items-center'>
          <div className={`${row.isDisabled ? 'bg-red-500' : 'bg-green-500'} rounded-full h-3 w-3`}></div>
          {row.deviceId}
        </div>
      ),
    },
    {
      name: t('USER NAME'),
      selector: (row) => (row.userId ? `${row.userId.firstName || ''} ${row.userId.lastName || ''}` : 'Not Allocated'),
      sortable: true,
    },
    {
      name: t('DEVICE TYPE'),
      selector: (row) => row.deviceType,
      sortable: true,
    },
    {
      name: t('DEVICE STATUS'),
      selector: (row) => row.deviceStatus,
      sortable: true,
    },
  ];

  // Conditionally add 'ACTION' columns if user is admin
  if (userType === 'admin') {
    columns.push({
      name: t('ACTION'),
      cell: (row) => (
        <div className='flex flex-row justify-center gap-2 items-center w-full'>
          <PrimaryButton
            color='bg-blue-500 border-blue-600'
            text='Edit'
            onClick={() => {
              setSelectedDevice(row);
              setIsFormVisible(true);
            }}
          />
          <PrimaryButton
            color='bg-red-500 border-red-600'
            text='Disable'
            onClick={() => {
              setSelectedDevice(row);
              setActionType('Disable');
              setMessage('Are you sure you want to disable this device?');
              setIsConfirmVisible(true);
            }}
          />
          <PrimaryButton
            color='bg-red-500 border-red-600'
            text='Delete'
            onClick={() => {
              setSelectedDevice(row);
              setActionType('Delete');
              setMessage('Are you sure you want to delete this device?');
              setIsConfirmVisible(true);
            }}
          />
        </div>
      ),
    });
  }

  // Function to filter the user based on the search text
  const filterDevices = useMemo(() => {
    if (!devices) {
      return [];
    }
    return devices.filter((device) => {
      const deviceId = device.deviceId?.toLowerCase() || '';
      const firstName = (device.userId?.firstName || '').toLowerCase();
      const lastName = (device.userId?.lastName || '').toLowerCase();
      const deviceType = device.deviceType?.toLowerCase() || '';
      const deviceStatus = device.deviceStatus?.toLowerCase() || '';

      return (
        deviceId.includes(filterText.toLowerCase()) ||
        firstName.includes(filterText.toLowerCase()) ||
        lastName.includes(filterText.toLowerCase()) ||
        deviceType.includes(filterText.toLowerCase()) ||
        deviceStatus.includes(filterText.toLowerCase())
      );
    });
  }, [devices, filterText]);

  // Handle confiation and desable or delete device
  const handleConfirmation = async (result) => {
    if (result) {
      if (actionType === 'Delete') {
        await handleAction(`device/delete/${selectedDevice?._id}`, { isDeleted: true }, 'Device deleted successfully');
      } else if (actionType === 'Disable') {
        await handleAction(
          `device/disable/${selectedDevice?._id}`,
          { isDisabled: true },
          'Device disabled successfully'
        );
      }
    }
    setIsConfirmVisible(false);
  };

  const handleAction = async (endpoint, body, successMessage) => {
    const response = await send({
      endpoint: endpoint,
      method: 'PUT',
      body: body,
    });

    if (response) {
      setMessage(successMessage);
      setIsAlertVisible(true);
      getDevices();
    }
  };

  return (
    <div className='mx-5 mt-2 min-h-screen'>
      {isFormVisible && (
        <Form
          onClose={() => {
            setIsFormVisible(false);
            setSelectedDevice(null);
          }}
          visible={isFormVisible}
          device={selectedDevice}
          formSubmission={async (message) => {
            setMessage(message);
            setIsAlertVisible(true);
            getDevices();
          }}
        />
      )}

      {loading && <Loader />}

      {!devices && (
        <div className='flex justify-center bg-white dark:bg-secondary-dark-bg rounded-lg p-8'>
          <p className='text-sm dark:text-white justify-center'>
            There are no devices allocated. Please contact{' '}
            <a className='text-blue-500' href='mailto:support@elzian.com'>
              support@elzian.com
            </a>
          </p>
        </div>
      )}

      {!isFormVisible && !loading && devices && (
        <div className='flex flex-col shadow-lg bg-white dark:bg-secondary-dark-bg rounded-lg p-4'>
          <div className='flex flex-col md:flex-row mb-4 md:items-center md:justify-between'>
            <div className='flex gap-2 mb-2 md:mb-0'>
              {userType === 'admin' && (
                <VariantButton
                  text='Add Device'
                  Icon={PlusIcon}
                  onClick={() => {
                    setIsFormVisible(true);
                    setSelectedDevice(null);
                  }}
                />
              )}
              {filterDevices.length > 0 && (
                <VariantButton
                  text='Download'
                  Icon={ArrowDownTrayIcon}
                  onClick={() => downloadCSV(filterDevices, 'devices.csv')}
                />
              )}
            </div>
            {userType === 'admin' && (
              <SearchBox
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                onClick={() => {
                  setFilterText('');
                }}
              />
            )}
          </div>
          <div className='rounded-t-lg'>
            <DataTable
              columns={columns}
              data={filterDevices}
              customStyles={customTableStyles}
              theme={currentMode === 'Dark' ? 'dark' : 'default'}
              pagination
              fixedHeader
              fixedHeaderScrollHeight='65vh'
            />
          </div>
        </div>
      )}
      <Modal
        isOpen={isConfirmVisible}
        message={`${message}`}
        onClose={(result) => handleConfirmation(result)}
        type='confirmation'
      />
      <Modal
        isOpen={isAlertVisible}
        message={`${message}`}
        onClose={() => {
          setIsAlertVisible(false);
        }}
        type='alert'
      />
    </div>
  );
};

export default DeviceManagement;
