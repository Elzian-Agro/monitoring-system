export const authRegex = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])(?!.*\s)[A-Za-z\d\W_]{8,}$/,
};

export const patterns = {
  email: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
  nicNum: '^(\\d{9}[vV]|\\d{12})$',
  phoneNum: '^(0\\d{9}|[1-9]\\d{8})$',
};

export const characterSets = {
  lowercaseLetters: 'abcdefghijklmnopqrstuvwxyz',
  uppercaseLetters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numbers: '0123456789',
  symbols: '!@#$%&*+-=<>?',
};

export const DeviceFactors = {
  'Monitoring System': ['Temperature', 'Humidity', 'Soil Moisture', 'Gas Detection'],
  'Portable Device': [
    'Nitrogen',
    'Phosphorus',
    'Potassium',
    'pH',
    'Soil Moisture',
    'Electric Conductivity',
    'Soil Temperature',
  ],
  'Weather Station': [
    'Temperature',
    'Humidity',
    'Soil Moisture',
    'Wind Speed',
    'Wind Direction',
    'Instantaneous Wind Speed',
    'Rainfall',
    'UV Radiation',
    'illumination',
  ],
};

export const menuMode = {
  open: 'open',
  partiallyOpen: 'onlyIcon',
  close: 'close',
};

export const weatherStationChartTypes = {
  temperature: 'column',
  humidity: 'line',
  soil_moisture: 'line',
  wind_speed: 'line',
  instantaneous_wind_speed: 'line',
  rainfall: 'column',
  uv_radiation: 'line',
  illumination: 'line',
};

export const errorType = {
  userBlocked: {
    code: 13001,
    message: 'User is blocked! Contact admin',
  },

  authenticationFailed: {
    code: 13002,
    message: 'Authentication failed! Please log in again',
  },

  incorrectTempPassword: {
    code: 13003,
    message: 'Incorrect Temporary Password',
  },

  timeOut: {
    code: 13004,
    message: 'Time Out',
  },

  invalidCredentials: {
    code: 13005,
    message: 'Invalid email or password',
  },

  userNotFound: {
    code: 13007,
    message: 'User Not Found!',
  },

  userAlreadyExist: {
    code: 13008,
    message: 'NIC or Email Address already exists',
  },

  serverError: {
    code: 13009,
    message: 'Oops! an error occured. Please try again later',
  },

  connectionError: {
    code: 13010,
    message: 'Oops! an error occured. Please try again later',
  },

  emailNotVerified: {
    code: 13011,
    message: 'Email address not verified',
  },

  userNotLogin: {
    code: 13012,
    message: 'You are not logged in. Please login to access this page!',
  },

  noRecords: {
    code: 13015,
    message: 'No records found',
  },

  notificationNotFound: {
    code: 13016,
    message: 'Notification is not found',
  },

  notificationDeletedFailure: {
    code: 13017,
    message: 'Notification is deleted failure. Please try again!',
  },

  accessDenied: {
    code: 13019,
    message: 'Access denied',
  },

  fileNotUploaded: {
    code: 13020,
    message: 'No file uploaded. Please try again!',
  },

  userDisabled: {
    code: 13021,
    message: 'The account has been disabled',
  },

  deviceNotFound: {
    code: 13023,
    message: 'Device not found',
  },

  deviceCreatedFailure: {
    code: 13024,
    message: 'Device is already exist!',
  },

  userDoesNotExistOrIsDisabled: {
    code: 13025,
    message: 'User does not exist or is disabled',
  },

  widgetNotFound: {
    code: 13027,
    message: 'Widgets not found',
  },

  widgetCreatedFailure: {
    code: 13026,
    message: 'Widget creation failure',
  },

  portableDeviceDataNotFound: {
    code: 13029,
    message: 'Portable device data not found',
  },

  currentWeatherNotFound: {
    code: 13031,
    message: 'Curent weather data not found',
  },

  historyWeatherNotFound: {
    code: 13032,
    message: 'History weather data not found',
  },
};

export const messages = {
  userCreated: 'User registered successfully',
  userUpdated: 'User details updated successfully',
  userDeleted: 'User deleted successfully',
  accountConfirmDisable: 'Are you sure you want to disable this account?',
  accountDisabled: 'Account disabled successfully',
  accountUpdated: 'Account details updated successfully',
  deviceCreated: 'Device created successfully',
  deviceUpdated: 'Device updated successfully',
  deviceDeleted: 'Device deleted successfully',
  deviceDisabled: 'Device disabled successfully',
  widgetCreated: 'Widget created successfully',
  widgetUpdated: 'Widget updated successfully',
  widgetDeleted: 'Widget deleted successfully',
  confirmDelete: 'Are you sure want to delete?',
  confirmDisable: 'Are you sure you want to disable?',
  confirmResetPassword: 'Do you want to reset the password?',
  failedFetchWeathering: 'Failed to fetch weather data',
  provideValidLocation: 'Please provide a valid location',
  portableDeviceDataDeleted: 'Portable device data deleted successfully',
};

export const customTableStyles = {
  table: {
    style: {
      width: '100%',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  headRow: {
    style: {
      backgroundColor: '#414345',
      color: '#ffffff',
    },
  },
  headCells: {
    style: {
      '&:last-child': {
        display: 'flex',
        justifyContent: 'center',
        minWidth: '300px',
      },
    },
  },
  rows: {
    style: {
      borderBottom: '1px solid #e3e5e8',
    },
  },
  cells: {
    style: {
      '&:last-child': {
        minWidth: '300px',
      },
    },
  },
};

export const weatherIcons = {
  '01d': 'https://cdn-icons-png.flaticon.com/128/869/869869.png',
  '01n': 'https://cdn-icons-png.flaticon.com/128/869/869869.png',
  '02d': 'https://cdn-icons-png.flaticon.com/128/2698/2698213.png',
  '02n': 'https://cdn-icons-png.flaticon.com/128/2698/2698213.png',
  '03d': 'https://cdn-icons-png.flaticon.com/128/1163/1163624.png',
  '03n': 'https://cdn-icons-png.flaticon.com/128/1163/1163624.png',
  '04d': 'https://cdn-icons-png.flaticon.com/128/414/414927.png',
  '04n': 'https://cdn-icons-png.flaticon.com/128/414/414927.png',
  '09d': 'https://cdn-icons-png.flaticon.com/128/3217/3217172.png',
  '10d': 'https://cdn-icons-png.flaticon.com/128/1163/1163657.png',
  '10n': 'https://cdn-icons-png.flaticon.com/128/1163/1163657.png',
  '11d': 'https://cdn-icons-png.flaticon.com/128/1959/1959321.png',
  '13d': 'https://cdn-icons-png.flaticon.com/128/13882/13882500.png',
  '50d': 'https://cdn-icons-png.flaticon.com/128/1779/1779931.png',
};

export const deviceCsvHeaders = [
  'Device ID',
  'User Name',
  'Device Type',
  'Monitoring Factors',
  'Device Status',
  'Disable',
  'Created At',
  'Updated At',
];

export const userCsvHeaders = [
  'User Name',
  'Organization Name',
  'NIC',
  'Phone Number',
  'Email Address',
  'Address',
  'GPS',
  'Disable',
];
