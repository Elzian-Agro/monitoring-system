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
  invalidCredentials: {
    code: 13005,
    message: 'Invalid email or password',
  },

  timeOut: {
    code: 13004,
    message: 'Time Out',
  },

  serverError: {
    code: 17001,
    message: 'Oops! an error occured. Please try again later',
  },

  userNotFound: {
    code: 15001,
    message: 'User Not Found!',
  },

  userBlocked: {
    code: 13001,
    message: 'User is blocked! Contact admin',
  },

  incorrectTempPassword: {
    code: 13003,
    message: 'Incorrect Temporary Password',
  },
};
