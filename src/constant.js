import { ChatBubbleBottomCenterIcon } from '@heroicons/react/24/outline';

export const authRegex = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
};

export const menuMode = {
  open: 'open',
  partiallyOpen: 'onlyIcon',
  close: 'close',
};

export const userProfileData = [
  {
    icon: <ChatBubbleBottomCenterIcon className='h-6 w-6' />,
    title: 'My Profile',
    desc: 'Account Settings',
    iconColor: '#03C9D7',
    iconBg: '#E5FAFB',
  },
];

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

  accessDenied: {
    code: 13017,
    message: 'Access denied',
  },
};

export const customTableStyles = {
  headRow: {
    style: {
      backgroundColor: '#494d4a',
      color: '#ffffff',
    },
  },
  rows: {
    style: {
      backgroundColor: 'blue',
      '&:nth-child(even)': {
        backgroundColor: '#ffffff',
      },
      '&:nth-child(odd)': {
        backgroundColor: '#dcf3f7',
      },
    },
  },
  cells: {
    style: {
      '&:last-child': {
        width: '50px',
      },
    },
  },
};
