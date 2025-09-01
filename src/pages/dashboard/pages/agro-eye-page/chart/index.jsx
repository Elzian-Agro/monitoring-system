import React, { useState, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import highchartsStock from 'highcharts/modules/stock';
import highchartsAccessibility from 'highcharts/modules/accessibility';
import exportingInit from 'highcharts/modules/exporting';
import offlineExportingInit from 'highcharts/modules/offline-exporting';
import { useSelector } from 'react-redux';
import { selectTheme } from 'pages/dashboard/slice/dashboardLayoutSlice';
import { useSortable } from '@dnd-kit/sortable';
import { ArrowsPointingOutIcon } from '@heroicons/react/24/outline';
import PropTypes from 'prop-types';

highchartsStock(Highcharts);
highchartsAccessibility(Highcharts);
exportingInit(Highcharts);
offlineExportingInit(Highcharts);

const Chart = ({ id, widget }) => {
  const [chartOptions, setChartOptions] = useState(null);
  const currentMode = useSelector(selectTheme);
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const getColor = (darkColor, lightColor) => (currentMode === 'Dark' ? darkColor : lightColor);

  useEffect(() => {
    const startDateTime = new Date(widget?.startDateTime);
    const endDateTime = new Date(widget?.endDateTime);
    const timeGap = widget?.timeGap;
    const axisTime = [];
    let currentDateTime = new Date(startDateTime);

    while (currentDateTime <= endDateTime) {
      axisTime.push(new Date(currentDateTime).toISOString());
      currentDateTime = new Date(currentDateTime.getTime() + timeGap);
    }

    const sensorSeries = widget?.devices.flatMap((device) => {
      const deviceId = device.deviceId;

      return device.factors?.map((factor) => {
        const timeSeriesData = [];
        const deviceData = widget.sensorData.find((sensorData) => sensorData[deviceId]);

        axisTime.forEach((time) => {
          const entry = deviceData?.[deviceId].find((data) => new Date(data.timestamp).toISOString() === time);
          timeSeriesData.push(entry ? entry[factor] : null);
        });

        return {
          name: deviceId + ' ' + factor,
          data: timeSeriesData,
        };
      });
    });

    const chartConfig = {
      chart: {
        type: widget?.chartType,
        backgroundColor: getColor('#414345', '#ffffff'),
      },
      title: {
        text: widget?.name,
        style: {
          color: getColor('#ffffff', '#00000'),
        },
      },
      xAxis: {
        categories: axisTime.map((time) => {
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
            color: getColor('#ffffff', '#00000'),
          },
        },
        labels: {
          style: {
            color: getColor('#ffffff', '#00000'),
          },
        },
        min: axisTime.length - 5,
        max: axisTime.length - 1,
        scrollbar: {
          enabled: true,
        },
        tickLength: 0,
      },
      yAxis: {
        title: {
          text: null,
          style: {
            color: getColor('#ffffff', '#00000'),
          },
        },
        labels: {
          style: {
            color: getColor('#ffffff', '#00000'),
          },
        },
      },
      legend: {
        itemStyle: {
          color: getColor('#ffffff', '#00000'),
        },
      },
      series: sensorSeries,
    };

    setChartOptions(chartConfig);
    // eslint-disable-next-line
  }, [widget, currentMode]);

  return (
    <div
      ref={setNodeRef}
      className='bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-800 relative'
      style={{
        transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : '',
        transition: transition ?? '',
      }}
      {...attributes}>
      <div className='relative'>
        {chartOptions && <HighchartsReact highcharts={Highcharts} options={chartOptions} />}
        <div {...listeners} className='absolute -top-8 left-3 cursor-move'>
          <ArrowsPointingOutIcon className='h-5 w-5 dark:text-white' />
        </div>
      </div>
    </div>
  );
};

Chart.propTypes = {
  id: PropTypes.number.isRequired,
  widget: PropTypes.object,
};

export default Chart;
