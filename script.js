'use strict';

const account1 = {
  owner: 'Saif Alkurdi',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1999,

  movementsDates: [
    '2024-10-23T07:42:02.383Z',
    '2024-10-28T09:15:04.904Z',
    '2024-11-01T10:17:24.185Z',
    '2024-11-02T10:51:36.790Z',
    '2024-11-05T21:31:17.178Z',
    '2024-11-10T23:36:17.929Z',
    '2024-11-14T14:11:59.604Z',
    '2024-11-15T17:01:17.194Z',
  ],
  currency: 'JOD',
  locale: 'en-US', // de-DE
};

const account2 = {
  owner: 'Mahmmoud Bassam',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 1998,

  movementsDates: [
    '2024-10-23T07:42:02.383Z',
    '2024-10-28T09:15:04.904Z',
    '2024-11-01T10:17:24.185Z',
    '2024-11-02T10:51:36.790Z',
    '2024-11-05T21:31:17.178Z',
    '2024-11-10T23:36:17.929Z',
    '2024-11-14T14:11:59.604Z',
    '2024-11-15T17:01:17.194Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
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

//  App functions
const formatMovementsDate = function (date, local) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs((date2 - date1) / (1000 * 60 * 60 * 24)));

  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  return new Intl.DateTimeFormat(local).format(date);
};

const formateCur = function (value, local, currency) {
  const options = {
    style: 'currency',
    currency: currency,
  };

  return new Intl.NumberFormat(local, options).format(value);
};

// APPLICATION

// 01 displayMovements
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementsDate(date, acc.locale);

    const formateMov = formateCur(mov, acc.local, acc.currency);

    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__date">${displayDate}</div>
    <div class="movements__value">${formateMov}</div>
  </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// 03 calcDisplayBalance
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = formateCur(acc.balance, acc.local, acc.currency);
};

// 04 calcDisplaySummary
const calcDisplaySummary = function (acc) {
  const income = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov);
  labelSumIn.textContent = formateCur(income, acc.local, acc.currency);

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov);
  labelSumOut.textContent = formateCur(Math.abs(out), acc.local, acc.currency);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int, 0);

  labelSumInterest.textContent = formateCur(interest, acc.local, acc.currency);
};

// 02 createUsernames
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

createUsernames(accounts);

// 06 Update User Interface
const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);
  // Display balance
  calcDisplayBalance(acc);
  // Display summary
  calcDisplaySummary(acc);
};

//  Log out timer
const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    //  In each Call, print the remaining time to the UI
    labelTimer.textContent = `${min}:${sec}`;

    //  When 0 seconds, stop the timer and log out user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }

    //  Decrease 1S
    time--;
  };

  // Set time out to 5 minute
  let time = 120;

  //  Call the timer every second
  tick();
  const timer = setInterval(tick, 1000);

  return timer;
};

// 05 EVENT HANDLERS
// Login button
let currentAccount, timer;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value.toLowerCase()
  );

  if (currentAccount?.pin === +inputLoginPin.value) {
    // DISPLAY UI AND Message
    labelWelcome.textContent = `Welcome back ${
      currentAccount.owner.split(' ')[0]
    }💗`;
    containerApp.style.opacity = 100;

    // Create current date and time
    const now = new Date();
    const option = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      weekday: 'long',
    };

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      option
    ).format(now);

    // Timer
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();

    // Update UI
    updateUI(currentAccount);
  }

  // Clear input fields
  inputLoginUsername.value = inputLoginPin.value = '';
  inputLoginUsername.blur();
  inputLoginPin.blur();
});

//  Transfer Button
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAccount = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  if (
    amount > 0 &&
    receiverAccount &&
    currentAccount.balance >= amount &&
    receiverAccount?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAccount.movements.push(amount);

    // Add transfer Date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAccount.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);

    //  Reset timer
    clearInterval(timer);
    timer = startLogOutTimer();
  }
  // Clear input fields
  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferAmount.blur();
  inputTransferTo.blur();
});

//  Loan button
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Math.floor(+inputLoanAmount.value);
  if (
    amount > 0 &&
    currentAccount?.movements.some(mov => mov >= amount * 0.1)
  ) {
    setTimeout(function () {
      // Add movements
      currentAccount.movements.push(amount);

      //  Add loan date
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(currentAccount);
    }, 2500);
    //  Reset timer
    clearInterval(timer);
    timer = startLogOutTimer();

    // Clear fields
    inputLoanAmount.value = '';
  }
});

//  Close button
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount?.username &&
    +inputClosePin.value === currentAccount?.pin
  ) {
    const index = accounts.findIndex(
      acc => acc?.username === currentAccount?.username
    );

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});
