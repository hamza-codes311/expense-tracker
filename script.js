
let title = document.getElementById("title");
let amount = document.getElementById("amount");
let type = document.getElementById("type");

let addBtn = document.getElementById("addBtn");

let totalIncome = document.getElementById("totalIncome");
let totalExpense = document.getElementById("totalExpense");
let balance = document.getElementById("balance");

let transactionList = document.getElementById("transactionList");
let message = document.getElementById("message");

let progressBar = document.getElementById("progressBar");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

document.getElementById("date").innerText =
    new Date().toDateString();


function saveData() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}


function addTransaction() {

    let transactionTitle = title.value.trim();
    let transactionAmount = Number(amount.value);
    let transactionType = type.value;

    if (transactionTitle === "" || transactionAmount <= 0) {
        message.innerText = "Please enter valid details!";
        return;
    }

    let transaction = {
        id: Date.now(),
        title: transactionTitle,
        amount: transactionAmount,
        type: transactionType
    };

    transactions.push(transaction);

    saveData();

    displayTransactions();

    title.value = "";
    amount.value = "";

    message.innerText = "";
}


function displayTransactions() {

    transactionList.innerHTML = "";

    let income = 0;
    let expense = 0;

    if (transactions.length === 0) {
        transactionList.innerHTML =
            '<p class="empty">No transactions yet.</p>';
    }

    transactions.forEach(function(item) {

        if (item.type === "income") {
            income += item.amount;
        }
        else {
            expense += item.amount;
        }

        let div = document.createElement("div");

        div.className = "transaction-item";

        let sign = item.type === "income" ? "+" : "-";

        let colorClass = item.type === "income"
            ? "income-text"
            : "expense-text";

        div.innerHTML = `
            <div class="transaction-info">
                <h3>${item.title}</h3>
                <p>${item.type}</p>
            </div>

            <div class="transaction-right">
                <span class="transaction-amount ${colorClass}">
                    ${sign} Rs. ${item.amount.toLocaleString("en-PK")}
                </span>

                <button class="delete-btn" onclick="deleteTransaction(${item.id})">
                    X
                </button>
            </div>
        `;

        transactionList.appendChild(div);

    });

    let totalBalance = income - expense;

    totalIncome.innerText = "Rs. " + income.toLocaleString("en-PK");
    totalExpense.innerText = "Rs. " + expense.toLocaleString("en-PK");
    balance.innerText = "Rs. " + totalBalance.toLocaleString("en-PK");

    if (totalBalance < 0) {
        balance.style.color = "#ff8a9e";
    }
    else {
        balance.style.color = "white";
    }

    let percentage = income > 0
        ? (totalBalance / income) * 100
        : 0;

    progressBar.style.width =
        Math.max(0, Math.min(100, percentage)) + "%";
}


function deleteTransaction(id) {

    transactions = transactions.filter(function(item) {
        return item.id !== id;
    });

    saveData();

    displayTransactions();
}


addBtn.addEventListener("click", addTransaction);


displayTransactions();
