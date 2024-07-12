const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');

// dummy transaction is array of object
// const dummyTransactions = [
//   { id: 1, text: 'Flower', amount: -20 },
//   { id: 2, text: 'Salary', amount: 300 },
//   { id: 3, text: 'Book', amount: -10 },
//   { id: 4, text: 'Camera', amount: 150 }
// ]

// store new transaction enter by user in local storage
const localStorageTransactions = JSON.parse(
  localStorage.getItem('transactions')
);

// old transactions for dummy purpose
// let transactions = dummyTransactions;

// new transactions for local storage based 
let transactions = 
   localStorage.getItem('transactions') !== null ? 
   localStorageTransactions : [];

// add new transection
function addTransaction(e) {
  e.preventDefault();
  
  // show alert message if both field are empty 
  if (text.value.trim() === '' || amount.value.trim() === '') {
    alert('Please add a text and amount');
  } else {
    const transaction = {
      id: generateID(),
      text: text.value,
      amount: +amount.value // here amount is 'string' so convert into number by '+'
    };

    // push transaction object in transactions array
    transactions.push(transaction);

    // add transaction in DOM
    addTransactionDOM(transaction);

    updateValues();

    updateLocalStorage();

    text.value = '';
    amount.value = '';

  }
}

// generate random ID
function generateID() {
  return Math.floor(Math.random() * 100000000);
}

// add transactions to DOM list
function addTransactionDOM(transaction) {
  // get sign
  const sign = transaction.amount < 0 ? '-' : '+';

  const item = document.createElement('li');

  // add class based on value
  item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

  item.innerHTML = `${transaction.text} <span>${sign}${Math.abs(transaction.amount)}</span> <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>`;

   // Add the list item to the existing list in the HTML (ul with id 'list')
  list.appendChild(item);
} 

// update the balance, income and expense
function updateValues() {
  const amounts = transactions.map(transaction => 
    transaction.amount
  );
  console.log(amounts)

  // fixed total amount to two decimal by reduce for income and expense amount
  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
  console.log(total);

  // filter out negetive and total amount using reduce for income div
  const income = amounts
                 .filter(item => item > 0)
                 .reduce((acc, item) => (acc += item), 0)
                 .toFixed(2);
  console.log(income);

  // filter out positive and total amount for expence div
  const expense = (
    amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1
  ).toFixed(2);
  console.log(expense);

  // put in DOM
  balance.innerText = `$${total}`;
  money_plus.innerText = `$${income}`;
  money_minus.innerText = `$${expense}`;
}

// remove transection by id
function removeTransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);

  updateLocalStorage();

  init();
}

// update local storage transactions
function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}


// init app
function init() {
  list.innerHTML = '';

  transactions.forEach(addTransactionDOM);
  updateValues();
}

init();

form.addEventListener('submit', addTransaction);
