# theranch
The Ranch Golf Course Royalty App

# Loyalty App 

setup instructions for each loyalty customer

### Add a env.js file to each customers /admin folder
make sure they hae a unique customer id
```bash
(function (window) {
  window.__env = window.__env || {};

  // APP Settings
  window.__env.API_URL = 'https://loyaltyapp.org/api/1/';
  window.__env.UPLOAD_FOLDER = 'https://loyaltyapp.org/uploads/1/';
  window.__env.CUSTOMER_ID = 1;
  window.__env.PRODUCTION = true;
  window.__env.LOGIN_METHOD = 'server';
  window.__env.SERVER_URL = '/';
  window.__env.REDIRECT_URL = '/start';

  // Base url
  window.__env.baseUrl = '/';

  // Whether or not to enable debug mode
  // Setting this to false will disable console output
  window.__env.enableDebug = true;
}(this));
```



