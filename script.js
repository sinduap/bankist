'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Sindu Andita Pratama',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2021-10-18T21:31:17.178Z',
    '2021-10-30T07:42:02.383Z',
    '2021-11-05T09:15:04.904Z',
    '2021-11-08T10:17:24.185Z',
    '2021-11-11T14:11:59.604Z',
    '2021-12-12T17:01:17.194Z',
    '2021-12-22T23:36:17.929Z',
    '2021-12-29T10:51:36.790Z',
  ],
  currency: 'IDR',
  locale: 'in-ID', // Indonesia
};

const account2 = {
  owner: 'Futi Kasiha',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2020-11-01T13:15:33.035Z',
    '2020-11-30T09:48:16.867Z',
    '2020-12-25T06:04:23.907Z',
    '2021-01-25T14:18:46.235Z',
    '2021-02-05T16:33:06.386Z',
    '2021-04-10T14:43:26.374Z',
    '2021-06-25T18:49:59.371Z',
    '2021-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');
const date = document.querySelector('.date');
const instruction = document.querySelector('.instruction');

const createUsernames = function (accounts) {
  // display firstname capital
  accounts.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .reduce((acc, curr) => acc + curr[0], '');
  });
};

createUsernames(accounts);

const updateUI = function (currentAccount) {
  // display movements
  displayMovements(currentAccount);
  // display balance
  calcDisplayBalance(currentAccount);
  // display summary
  calcDisplaySummary(currentAccount);
};

const clearFields = function (...elements) {
  elements.forEach((element, i) => {
    //clear fields
    element.value = '';
    // remove focus on the last element
    i === elements.length - 1 && element.blur();
  });
};

const getFormattedCurrency = function (num) {
  const option = {
    style: 'currency',
    currency: currentAccount.currency,
  };
  return new Intl.NumberFormat(currentAccount.locale, option).format(num);
};

const getFormattedDate = function (account, dateObj = new Date()) {
  const option = {
    hour: 'numeric',
    minute: 'numeric',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    // weekday: 'long',
  };

  return new Intl.DateTimeFormat(account.locale, option).format(dateObj);

  // const date = dateObj.getDate() + 1; // date start by 0
  // const month = dateObj.getMonth() + 1;
  // const year = dateObj.getFullYear();

  // function padFormat(num) {
  //   return num.toString().padStart(2, 0);
  // }

  // return `${padFormat(date)}/${padFormat(month)}/${year}`;
};

const displayMovements = function (account, isSorted = false) {
  // clear existing elements
  containerMovements.innerHTML = '';

  // sort() mutate movement, so we create different variable
  const movements = isSorted
    ? [...account.movements].sort((a, b) => a - b)
    : account.movements;

  movements.forEach(function (mov, idx) {
    // composing elements
    const movDate = new Date(account.movementsDates[idx]);

    // const diffMs = new Date().getTime() - movDates.getTime();
    // const diffDays = Math.floor(diffMs / (1000 * 3600 * 24));

    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
      <div class="movements__row">
      
        <div class="movements__type movements__type--${type}">${
      idx + 1
    } ${type}</div>
        <div class="movements__date">${getGapDays(movDate)}</div>
        <div class="movements__value">${getFormattedCurrency(mov)}</div>
      </div>
    `;

    // display elements
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (account) {
  // calculate
  const balance = account.movements.reduce((acc, mov) => acc + mov, 0);
  currentAccount.balance = balance;
  // display
  labelBalance.textContent = `${getFormattedCurrency(balance)}`;
};

const calcDisplaySummary = function (account) {
  const { movements, interestRate } = account;
  // calculate and display withdrawals
  const incomes = movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${getFormattedCurrency(incomes)}`;
  // calculate and display deposits
  const outcomes = movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${getFormattedCurrency(Math.abs(outcomes))}`;
  // calculate and display interest
  const interest = movements
    .filter(mov => mov > 0)
    .map(mov => (mov * interestRate) / 100)
    .filter(mov => mov >= 1) // only interest >= 1
    .reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = `${getFormattedCurrency(interest)}`;
};

const addMovement = function (account, amount) {
  account.movements = [...account.movements, amount];
};

const setMovementDate = function (currentAccount, receiverAccount) {
  currentAccount.movementsDates = [
    ...currentAccount.movementsDates,
    new Date().toISOString(),
  ];

  if (arguments.length > 1) {
    receiverAccount.movementsDates = [
      ...receiverAccount.movementsDates,
      new Date().toISOString(),
    ];
  }
};

let currentAccount = null;

const displayDate = function (account) {
  date.textContent = getFormattedDate(account);
  // date.textContent = getFormattedDate();
};

const getGapDays = function (dateObj) {
  const diffMs = new Date().getTime() - dateObj.getTime();
  const diffDays = Math.round(diffMs / (1000 * 3600 * 24));
  if (diffDays === 0) return 'today';
  if (diffDays === 1) return 'yesterday';
  if (diffDays <= 7) return `${diffDays} days ago`;
  return getFormattedDate(currentAccount, dateObj);
};

const startLogOutTimer = function () {
  // Set time to 5 minutes
  let time = 5 * 60;
  // Call the timer every secon
  intervalIDTimer = setInterval(() => {
    const minute = (Math.trunc(time / 60) + '').padStart(2, 0);
    const second = ((time % 60) + '').padStart(2, 0);
    // In each call, print the remaining time to UI
    labelTimer.textContent = `${minute}:${second}`;
    // Decrease 1s
    time--;
    // When 0 seconds, stop timer and log out user
    if (time < 0) {
      clearInterval(intervalIDTimer);
      logOut();
    }
  }, 1000);
};

const logOut = function () {
  currentAccount = null;
  containerApp.style.opacity = 0;
  labelWelcome.textContent = `Log in to get started`;
};

let intervalID = null;
let intervalIDTimer = null;

// Event Handlers
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  intervalIDTimer && clearInterval(intervalIDTimer);

  intervalID && clearInterval(intervalID);

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === +inputLoginPin.value) {
    // display UI and welcome message
    containerApp.style.opacity = 100;

    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;

    startLogOutTimer();

    // update UI
    updateUI(currentAccount);

    displayDate(currentAccount);

    intervalID = setInterval(displayDate.bind(null, currentAccount), 1000);

    clearFields(inputLoginUsername, inputLoginPin);

    instruction.style.display = 'none';
  } else {
    clearFields(inputLoginUsername, inputLoginPin);

    console.log('Password isnt valid');
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputTransferAmount.value);
  const receiverAccount = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  clearFields(inputTransferAmount, inputTransferTo);

  if (
    receiverAccount &&
    amount > 0 &&
    amount <= currentAccount.balance &&
    receiverAccount?.username !== currentAccount.username
  ) {
    addMovement(receiverAccount, amount);
    addMovement(currentAccount, -amount);

    setMovementDate(currentAccount, receiverAccount);

    // update UI
    updateUI(currentAccount);

    clearInterval(intervalIDTimer);
    startLogOutTimer();
  } else {
    console.log('Not valid');
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  clearFields(inputLoanAmount);

  if (
    amount > 0 &&
    currentAccount.movements.some(mov => mov >= (amount * 10) / 100)
    // loan granted if there is any deposits 10% of loan
  ) {
    addMovement(currentAccount, amount);

    setMovementDate(currentAccount);

    updateUI(currentAccount);

    clearInterval(intervalIDTimer);
    startLogOutTimer();
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  const username = inputCloseUsername.value;
  const pin = +inputClosePin.value;

  if (currentAccount.username === username && currentAccount.pin === pin) {
    const usernameIndex = accounts.findIndex(acc => acc.username === username);

    accounts.splice(usernameIndex, 1);

    labelWelcome.textContent = 'Log in to get started';

    containerApp.style.opacity = 0;
  }
  clearFields(inputCloseUsername, inputClosePin);
});

let isSorted = false;

btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  displayMovements(currentAccount, !isSorted);

  isSorted = !isSorted;
});
