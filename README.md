Procedure to run a application
1.install node module command - npm install
2.To run application command - node app.js or nodemon app.js

// functionlity 
1.user creation with name,userType,mobileNumber,tenure,password,joinDate
2.bill create with items,amount,currency
3.login api created to get token for authenticated user to access currencyconversion api 
4.currency calculate api payload required userId,billId and conversion currency code 
   fetch bill details  for respective userId 
   based on userType, tenure and total amount discount need to calcualate and subtract in total amount
   from payload coversion currency code taken and third party api trigger for take respective amount taken for particular conversion code
   after fetching from third party api multiply after (total discounted amount * currency amount) it will give conversion currency amount
    
getExchangeRate :
 https://v6.exchangerate-api.com/v6/eca121919eab609fb0c48a71/latest/eca121919eab609fb0c48a71

https://v6.exchangerate-api.com/v6/${CURRENCY_EXCHAGE_AUTH_KEY}/latest/${originalCurrency}