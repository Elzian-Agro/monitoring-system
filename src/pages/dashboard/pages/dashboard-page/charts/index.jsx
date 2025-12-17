import React, { useState, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useSelector } from 'react-redux';
import { selectTheme } from 'pages/dashboard/slice/dashboardLayoutSlice';
import useFetch from 'hooks/useFetch';
import { useTranslation } from 'react-i18next';
import Loader from 'pages/dashboard/components/common/loader';
import { DeviceFactors } from 'utils/constant';

const Charts = () => {
  const [temperatureOptions, setTemperatureOptions] = useState(null);
  const [humidityOptions, setHumidityOptions] = useState(null);
  const [soilMoistureOptions, setSoilMoistureOptions] = useState(null);
  const [gasDetectionOptions, setGasDetectionOptions] = useState(null);
  const currentMode = useSelector(selectTheme);
  const { t } = useTranslation();
  const { response: thisMonthSensorData, isLoading } = useFetch({
    endpoint: 'monitoring',
    method: 'GET',
    call: 1,
    requestBody: {},
    dependency: [],
  });

  const getColor = (darkColor, lightColor) => (currentMode === 'Dark' ? darkColor : lightColor);

  useEffect(() => {
    if (!thisMonthSensorData) return;

    const options = {};

    const generateSeriesData = (factor) => {
      const series = {};
      const categories = [];
      const today = new Date();
      const startDate = new Date(today.getFullYear(), today.getMonth(), 2);
      const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);

      // Generate complete list of dates for the month
      for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
        categories.push(new Date(date).toISOString().split('T')[0]);
      }

      let hasData = false;

      thisMonthSensorData.forEach((device) => {
        const seriesData = categories.map((date) => {
          const entry = device.data?.find((data) => data.timestamp.startsWith(date));
          // Check if the entry contains the factor and return the value, else return null
          return entry && factor in entry ? entry[factor] : null;
        });

        if (seriesData.some((value) => value !== null)) {
          hasData = true; // Data exists for this factor
        }

        series[device.deviceId] = seriesData;
      });


      return { series, categories, hasData };
    };

    DeviceFactors['Monitoring System']
      .map((factor) => factor.replace(/\s+/g, '_').toLowerCase())
      .forEach((factor) => {
        const { series, categories, hasData } = generateSeriesData(factor);

        if (!hasData) return; // Skip if no data exists for this factor

        options[factor] = {
          chart: {
            type: 'line',
            backgroundColor: getColor('#414345', '#ffffff'),
          },
          title: {
            text: null,
            style: {
              color: getColor('#ffffff', '#000000'),
            },
          },
          xAxis: {
            categories: categories.map((date) => {
              const dateTime = new Date(date);
              return dateTime.toLocaleDateString('en-US', {
                timeZone: 'Asia/Colombo',
                month: 'short',
                day: 'numeric',
              });
            }),
            title: {
              text: null,
              style: {
                color: getColor('#ffffff', '#000000'),
              },
            },
            labels: {
              style: {
                color: getColor('#ffffff', '#000000'),
              },
            },
          },
          yAxis: {
            title: {
              text: null,
              style: {
                color: getColor('#ffffff', '#000000'),
              },
            },
            labels: {
              style: {
                color: getColor('#ffffff', '#000000'),
              },
            },
          },
          legend: {
            itemStyle: {
              color: getColor('#ffffff', '#000000'),
            },
          },
          exporting: {
            enabled: false,
          },
          accessibility: {
            enabled: false,
          },
          series: Object.keys(series).map((deviceId) => ({
            name: deviceId,
            data: series[deviceId],
          })),
        };
      });

    setTemperatureOptions(options.temperature);
    setHumidityOptions(options.humidity);
    setSoilMoistureOptions(options.soil_moisture);
    setGasDetectionOptions(options.gas_detection);

    // eslint-disable-next-line
  }, [thisMonthSensorData, currentMode]);

  return isLoading ? (
    <Loader />
  ) : (
    <div className='flex flex-col gap-6 bg-white dark:bg-secondary-dark-bg mb-6'>
      {temperatureOptions && (
        <div className='bg-white dark:bg-secondary-dark-bg rounded-md border border-gray-100 dark:border-gray-600 shadow-md shadow-black/5 p-1 w-full'>
          <h1 className='text-md text-center font-semibold dark:text-white'>{t('Temperature')} (°C)</h1>
          <HighchartsReact highcharts={Highcharts} options={temperatureOptions} />
        </div>
      )}
      {humidityOptions && (
        <div className='bg-white dark:bg-secondary-dark-bg rounded-md border border-gray-100 dark:border-gray-600 shadow-md shadow-black/5 p-1 w-full'>
          <h1 className='text-md text-center font-semibold dark:text-white'>{t('Humidity')} (%)</h1>
          <HighchartsReact highcharts={Highcharts} options={humidityOptions} />
        </div>
      )}
      {soilMoistureOptions && (
        <div className='bg-white dark:bg-secondary-dark-bg rounded-md border border-gray-100 dark:border-gray-600 shadow-md shadow-black/5 p-1 w-full'>
          <h1 className='text-md text-center font-semibold dark:text-white'>{t('Soil Moisture')} (%)</h1>
          <HighchartsReact highcharts={Highcharts} options={soilMoistureOptions} />
        </div>
      )}
      {gasDetectionOptions && (
        <div className='bg-white dark:bg-secondary-dark-bg rounded-md border border-gray-100 dark:border-gray-600 shadow-md shadow-black/5 p-1 w-full'>
          <h1 className='text-md text-center font-semibold dark:text-white'>{t('Gas Detection')} (ppm)</h1>
          <HighchartsReact highcharts={Highcharts} options={gasDetectionOptions} />
        </div>
      )}
    </div>
  );
};

export default Charts;
