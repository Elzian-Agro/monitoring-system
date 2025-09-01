import React, { useState, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectTheme } from 'pages/dashboard/slice/dashboardLayoutSlice';
import { DeviceFactors, weatherStationChartTypes } from 'utils/constant';
import useFetch from 'hooks/useFetch';
import Loader from 'pages/dashboard/components/common/loader';

const calculateStartDate = (range) => {
  switch (range) {
    case 'Last 24 hours':
      return 24 * 60 * 60 * 1000;
    case 'Last week':
      return 7 * 24 * 60 * 60 * 1000;
    case 'Last Month':
      return 30 * 7 * 24 * 60 * 60 * 1000;
    default:
      return 24 * 60 * 60 * 1000;
  }
};

const calculateInterval = (interval) => {
  switch (interval) {
    case '5 min':
      return 5 * 60 * 1000;
    case '30 min':
      return 30 * 60 * 1000;
    case '1 hour':
      return 60 * 60 * 1000;
    case '1 day':
      return 24 * 60 * 60 * 1000;
    default:
      return 5 * 60 * 1000;
  }
};

const HistoryWeather = () => {
  const [selectedRange, setSelectedRange] = useState('Last 24 hours');
  const [selectedInterval, setSelectedInterval] = useState('1 min');
  const [chartOptions, setChartOptions] = useState({});

  const currentMode = useSelector(selectTheme);
  const { t } = useTranslation();

  // Update the endpoint dynamically with range and intervel
  const endpoint = `weather-station/history/${calculateStartDate(selectedRange)}/${calculateInterval(
    selectedInterval
  )}`;

  const { response: HistoryWeatherData, isLoading } = useFetch({
    endpoint,
    method: 'GET',
    call: 1,
    requestBody: {},
    dependency: [selectedRange, selectedInterval],
  });

  const getColor = (darkColor, lightColor) => (currentMode === 'Dark' ? darkColor : lightColor);

  // Function to check if the history data is empty
  const isDataEmpty = (data) => {
    return !data || data.every((item) => Object.values(item)[0].length === 0);
  };

  useEffect(() => {
    if (!HistoryWeatherData) return;

    const options = {};
    const now = new Date();
    now.setSeconds(0, 0);
    const lastDate = new Date(now.getTime() - calculateStartDate(selectedRange));
    const interval = calculateInterval(selectedInterval);

    const categories = [];
    let time = new Date(now);
    while (time >= lastDate) {
      categories.unshift(time.toISOString());
      time = new Date(time.getTime() - interval);
    }

    const generateSeriesData = (factor) => {
      const series = {};
      let hasData = false;

      HistoryWeatherData.forEach((device) => {
        const [deviceId, deviceData] = Object.entries(device)[0];

        const seriesData = categories.map((date) => {
          if (Array.isArray(deviceData)) {
            const entry = deviceData.find((data) => data.timestamp === date);
            return entry && factor in entry ? entry[factor] : null;
          }
          return null; // Handle cases where deviceData is not an array
        });

        if (seriesData.some((value) => value !== null)) {
          hasData = true; // Data exists for this factor
        }

        series[deviceId] = seriesData;
      });

      return { series, categories, hasData };
    };

    DeviceFactors['Weather Station']
      .map((factor) => factor.replace(/\s+/g, '_').toLowerCase())
      .forEach((factor) => {
        const { series, categories, hasData } = generateSeriesData(factor);

        if (!hasData) return; // Skip if no data exists for this factor

        options[factor] = {
          chart: {
            type: weatherStationChartTypes[factor],
            backgroundColor: getColor('#414345', '#ffffff'),
          },
          title: {
            text: null,
            style: {
              color: getColor('#ffffff', '#000000'),
            },
          },
          xAxis: {
            categories: categories.map((time) => {
              const dateTime = new Date(time);
              const dateFormat = dateTime.toLocaleDateString('en-US', {
                timeZone: 'Asia/Colombo',
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              });
              const timeFormat = dateTime.toLocaleTimeString('en-US', {
                timeZone: 'Asia/Colombo',
                hour: 'numeric',
                minute: 'numeric',
              });
              return `${dateFormat}<br>${timeFormat}`;
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
            min: categories.length - 5,
            max: categories.length - 1,
            scrollbar: {
              enabled: true,
            },
            tickLength: 0,
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

    // Compare if 'options' and 'chartOptions' have different values
    if (JSON.stringify(options) !== JSON.stringify(chartOptions)) {
      setChartOptions(options);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRange, selectedInterval, currentMode, HistoryWeatherData]);

  return (
    <div>
      <div className='flex flex-col md:flex-row gap-2 md:gap-0 md:justify-between md:items-center mb-4'>
        <h2 className='text-md text-gray-600 dark:text-gray-300'>{t('HISTORY WEATHER')}</h2>

        {/* Filters */}
        <div className='flex flex-col xs:flex-row gap-2 md:justify-end xs:items-center'>
          <select
            className='border border-gray-300 dark:border-gray-500 rounded-md p-2 focus:outline-none dark:bg-secondary-dark-bg dark:text-white'
            value={selectedRange}
            onChange={(e) => setSelectedRange(e.target.value)}>
            <option>Last 24 hours</option>
            <option>Last week</option>
            <option>Last Month</option>
          </select>
          <select
            className='border border-gray-300 dark:border-gray-500 rounded-md p-2 focus:outline-none dark:bg-secondary-dark-bg dark:text-white'
            value={selectedInterval}
            onChange={(e) => setSelectedInterval(e.target.value)}>
            <option>5 min</option>
            <option>30 min</option>
            <option>1 hour</option>
            <option>1 day</option>
          </select>
        </div>
      </div>

      {isLoading && <Loader />}

      {!isLoading && isDataEmpty(HistoryWeatherData) && (
        <div className='flex justify-center bg-white dark:bg-secondary-dark-bg rounded-lg p-8'>
          <p className='text-sm dark:text-white justify-center'>{t('There are no history weather data available!')}</p>
        </div>
      )}

      {!isLoading && HistoryWeatherData && (
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {chartOptions.temperature && (
            <div className='bg-white dark:bg-secondary-dark-bg rounded-md border border-gray-100 dark:border-gray-600 shadow-md shadow-black/5 p-1 w-full'>
              <h1 className='text-center text-sm font-medium text-gray-600 dark:text-gray-100 mb-2'>
                {t('Temperature')} (°C)
              </h1>
              <HighchartsReact highcharts={Highcharts} options={chartOptions.temperature} />
            </div>
          )}

          {chartOptions.humidity && (
            <div className='bg-white dark:bg-secondary-dark-bg rounded-md border border-gray-100 dark:border-gray-600 shadow-md shadow-black/5 p-1 w-full'>
              <h1 className='text-center text-sm font-medium text-gray-600 dark:text-gray-100 mb-2'>
                {t('Humidity')} (%)
              </h1>
              <HighchartsReact highcharts={Highcharts} options={chartOptions.humidity} />
            </div>
          )}

          {chartOptions.soil_moisture && (
            <div className='bg-white dark:bg-secondary-dark-bg rounded-md border border-gray-100 dark:border-gray-600 shadow-md shadow-black/5 p-1 w-full'>
              <h1 className='text-center text-sm font-medium text-gray-600 dark:text-gray-100 mb-2'>
                {t('Soil Moisture')} (%)
              </h1>
              <HighchartsReact highcharts={Highcharts} options={chartOptions.soil_moisture} />
            </div>
          )}

          {chartOptions.rainfall && (
            <div className='bg-white dark:bg-secondary-dark-bg rounded-md border border-gray-100 dark:border-gray-600 shadow-md shadow-black/5 p-1 w-full'>
              <h1 className='text-center text-sm font-medium text-gray-600 dark:text-gray-100 mb-2'>
                {t('Rainfall')} (mm)
              </h1>
              <HighchartsReact highcharts={Highcharts} options={chartOptions.rainfall} />
            </div>
          )}

          {chartOptions.wind_speed && (
            <div className='bg-white dark:bg-secondary-dark-bg rounded-md border border-gray-100 dark:border-gray-600 shadow-md shadow-black/5 p-1 w-full'>
              <h1 className='text-center text-sm font-medium text-gray-600 dark:text-gray-100 mb-2'>
                {t('Wind Speed')} (m/s)
              </h1>
              <HighchartsReact highcharts={Highcharts} options={chartOptions.wind_speed} />
            </div>
          )}

          {chartOptions.instantaneous_wind_speed && (
            <div className='bg-white dark:bg-secondary-dark-bg rounded-md border border-gray-100 dark:border-gray-600 shadow-md shadow-black/5 p-1 w-full'>
              <h1 className='text-center text-sm font-medium text-gray-600 dark:text-gray-100 mb-2'>
                {t('Instantaneous Wind Speed')} (m/s)
              </h1>
              <HighchartsReact highcharts={Highcharts} options={chartOptions.instantaneous_wind_speed} />
            </div>
          )}

          {chartOptions.uv_radiation && (
            <div className='bg-white dark:bg-secondary-dark-bg rounded-md border border-gray-100 dark:border-gray-600 shadow-md shadow-black/5 p-1 w-full'>
              <h1 className='text-center text-sm font-medium text-gray-600 dark:text-gray-100 mb-2'>
                {t('UV Radiation')} (W/m²)
              </h1>
              <HighchartsReact highcharts={Highcharts} options={chartOptions.uv_radiation} />
            </div>
          )}

          {chartOptions.illumination && (
            <div className='bg-white dark:bg-secondary-dark-bg rounded-md border border-gray-100 dark:border-gray-600 shadow-md shadow-black/5 p-1 w-full'>
              <h1 className='text-center text-sm font-medium text-gray-600 dark:text-gray-100 mb-2'>
                {t('Illumination')} (lux)
              </h1>
              <HighchartsReact highcharts={Highcharts} options={chartOptions.illumination} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HistoryWeather;
