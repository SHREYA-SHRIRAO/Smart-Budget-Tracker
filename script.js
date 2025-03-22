let budget = 0;
let totalExpense = 0;
let expenses = [];
let chartInstance = null;


function setBudget() {
    budget = parseFloat(document.getElementById("budget").value);
    document.getElementById("total-budget").innerText = budget;
    updateBalance();
    saveData();
}

function checkCustomCategory() {
    let categoryDropdown = document.getElementById("expense-category");
    let customCategoryInput = document.getElementById("custom-category");

    if (categoryDropdown.value === "Other") {
        customCategoryInput.style.display = "inline"; 
    } else {
        customCategoryInput.style.display = "none"; 
    }
}

function addExpense() {
    let name = document.getElementById("expense-name").value;
    let amount = parseFloat(document.getElementById("expense-amount").value);
    let categoryDropdown = document.getElementById("expense-category");
    let customCategoryInput = document.getElementById("custom-category");
    let date = new Date().toLocaleDateString();

    let category = categoryDropdown.value;
    if (category === "Other") {
        category = customCategoryInput.value.trim();
    }

    if (name && amount > 0 && category) {
        expenses.push({ name, amount, category, date });
        totalExpense += amount;
        updateBalance();
        displayExpenses();
        updateChart();
        saveData();
    } else {
        alert("⚠️ Please enter valid details!");
    }
}

function addNewCategory() {
    let customCategoryInput = document.getElementById("custom-category");
    let categoryDropdown = document.getElementById("expense-category");

    let newCategory = customCategoryInput.value.trim();
    if (newCategory) {
        let newOption = document.createElement("option");
        newOption.value = newCategory;
        newOption.innerText = newCategory;
        categoryDropdown.appendChild(newOption);

        categoryDropdown.value = newCategory;
        customCategoryInput.style.display = "none";
        customCategoryInput.value = ""; 
    } else {
        alert("⚠️ Please enter a valid category!");
    }
}

function updateBalance() {
    let remaining = budget - totalExpense;
    document.getElementById("total-expense").innerText = totalExpense;
    document.getElementById("remaining-budget").innerText = remaining;

    if (remaining <= 0) {
        alert("⚠️ Warning: Your budget is fully used up!");
    }
}

function displayExpenses() {
    let expenseList = document.getElementById("expense-list");
    expenseList.innerHTML = "";

    expenses.forEach((exp, index) => {
        let row = `<tr>
            <td>${exp.name}</td>
            <td>₹${exp.amount}</td>
            <td>${exp.category}</td>
            <td>${exp.date}</td>
            <td><button onclick="deleteExpense(${index})">❌</button></td>
        </tr>`;
        expenseList.innerHTML += row;
    });
}


function deleteExpense(index) {
    totalExpense -= expenses[index].amount;
    expenses.splice(index, 1);
    updateBalance();
    displayExpenses();
    updateChart();
    saveData();
}


function updateChart() {
    let ctx = document.getElementById("expenseChart").getContext("2d");

    let categoryTotals = {};
    expenses.forEach(exp => {
        categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
    });

    let labels = Object.keys(categoryTotals);
    let data = Object.values(categoryTotals);

    if (chartInstance) {
        chartInstance.destroy();
    }

    chartInstance = new Chart(ctx, {
        type: "pie",
        data: {
            labels: labels,
            datasets: [{
                label: "Expense Distribution",
                data: data,
                backgroundColor: ["#ff6384", "#36a2eb", "#ffce56", "#4bc0c0", "#9966ff"]
            }]
        }
    });
}

function saveData() {
    localStorage.setItem("budget", budget);
    localStorage.setItem("expenses", JSON.stringify(expenses));
}


function loadData() {
    let savedBudget = localStorage.getItem("budget");
    let savedExpenses = localStorage.getItem("expenses");

    if (savedBudget) {
        budget = parseFloat(savedBudget);
        document.getElementById("total-budget").innerText = budget;
    }

    if (savedExpenses) {
        expenses = JSON.parse(savedExpenses);
        expenses.forEach(exp => totalExpense += exp.amount);
        displayExpenses();
        updateBalance();
        updateChart();
    }
}

function toggleTheme() {
    document.body.classList.toggle("dark-mode");
}

window.onload = loadData;
