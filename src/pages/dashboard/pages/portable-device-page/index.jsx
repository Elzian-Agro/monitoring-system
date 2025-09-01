import React, { useState } from 'react';
import useFetch from 'hooks/useFetch';
import useAxios from 'hooks/useAxios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { IconButton } from '../../components/base/Button';
import { TrashIcon } from '@heroicons/react/24/outline';
import Modal from 'components/common/modal';
import { messages } from 'utils/constant';
import Loader from '../../components/common/loader';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectTheme } from 'pages/dashboard/slice/dashboardLayoutSlice';

// Custom icon using Leaflet's Icon class
const redIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const PortableDevice = () => {
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [selectedPortableData, setSelectedPortableData] = useState(null);
  const currentMode = useSelector(selectTheme);
  const { send } = useAxios();
  const { t } = useTranslation();
  const {
    response: soilData,
    recall,
    isLoading,
  } = useFetch({
    endpoint: 'portable-device',
    method: 'GET',
    call: 1,
    requestBody: {},
    dependency: [],
  });

  // Handle confiation and delete
  const handleConfirmationAndDelete = async (result) => {
    if (result) {
      const response = await send({
        endpoint: `portable-device/${selectedPortableData._id}`,
        method: 'DELETE',
        body: { isDeleted: true },
      });
      setIsConfirmVisible(false);
      if (response) {
        recall();
        setIsAlertVisible(true);
      }
    }
    setSelectedPortableData(null);
    setIsConfirmVisible(false);
  };

  return (
    <div className='mx-5 mt-2'>
      {currentMode === 'Dark' && (
        <style>
          {`
          .leaflet-popup-content-wrapper {
            background: #33373E;
          } 
        `}
        </style>
      )}

      {isLoading && (
        <div className='h-[90vh]'>
          <Loader />
        </div>
      )}

      {!isLoading && (
        <MapContainer center={[7.555494, 80.713784]} zoom={8} maxZoom={20} className='w-full h-[90vh] z-[1]'>
          <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' maxZoom={20} />
          <div>
            {soilData?.map((data, index) => (
              <Marker key={index} position={[data.gpsValues.latitude, data.gpsValues.longitude]} icon={redIcon}>
                <Popup>
                  <div>
                    <p className='text-blue-400'>
                      <span>{data.location}</span>
                      <br />
                      <span>
                        {data.gpsValues.latitude}, {data.gpsValues.longitude}
                      </span>
                    </p>

                    <p>
                      {[
                        { label: 'Nitrogen', value: data.nitrogen, unit: 'mg/kg' },
                        { label: 'Phosphorus', value: data.phosphorus, unit: 'mg/kg' },
                        { label: 'Potassium', value: data.potassium, unit: 'mg/kg' },
                        { label: 'pH', value: data.ph, unit: '' },
                        { label: 'Soil Moisture', value: data.soil_moisture, unit: '%RH' },
                        { label: 'Electric Conductivity', value: data.electric_conductivity, unit: 'us/cm' },
                        { label: 'Soil Temperature', value: data.soil_temperature, unit: '°C' },
                      ].map(
                        (item) =>
                          item.value !== undefined && (
                            <span key={item.label} className='text-black dark:text-gray-200 text-sm'>
                              {t(item.label)} : {item.value} {item.unit}
                              <br />
                            </span>
                          )
                      )}
                    </p>

                    <div className='flex flex-row justify-between items-center'>
                      <p className='text-gray-400' style={{ margin: 0 }}>
                        {data.recordId} &nbsp; {data.deviceId}
                      </p>

                      <IconButton
                        testid='delete-button'
                        color='text-red-600'
                        Icon={TrashIcon}
                        onClick={() => {
                          setSelectedPortableData(data);
                          setIsConfirmVisible(true);
                        }}
                      />
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </div>
        </MapContainer>
      )}

      <Modal
        isOpen={isConfirmVisible}
        message={messages.confirmDelete}
        onClose={(result) => handleConfirmationAndDelete(result)}
        type='confirmation'
      />
      <Modal
        isOpen={isAlertVisible}
        message={messages.portableDeviceDataDeleted}
        onClose={() => {
          setIsAlertVisible(false);
        }}
        type='alert'
      />
    </div>
  );
};

export default PortableDevice;
