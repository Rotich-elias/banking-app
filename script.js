// Banking App JavaScript

// Mock data for transactions
const mockTransactions = [
    {
        id: 1,
        type: 'debit',
        description: 'Grocery Store',
        category: 'Food & Dining',
        amount: -87.42,
        date: '2025-01-04',
        icon: 'fas fa-shopping-cart'
    },
    {
        id: 2,
        type: 'credit',
        description: 'Salary Deposit',
        category: 'Income',
        amount: 3250.00,
        date: '2025-01-03',
        icon: 'fas fa-money-bill-wave'
    },
    {
        id: 3,
        type: 'debit',
        description: 'Electric Bill',
        category: 'Utilities',
        amount: -124.56,
        date: '2025-01-02',
        icon: 'fas fa-bolt'
    },
    {
        id: 4,
        type: 'debit',
        description: 'Coffee Shop',
        category: 'Food & Dining',
        amount: -12.75,
        date: '2025-01-02',
        icon: 'fas fa-coffee'
    },
    {
        id: 5,
        type: 'credit',
        description: 'Refund - Online Purchase',
        category: 'Refund',
        amount: 45.99,
        date: '2025-01-01',
        icon: 'fas fa-undo'
    },
    {
        id: 6,
        type: 'debit',
        description: 'Gas Station',
        category: 'Transportation',
        amount: -52.30,
        date: '2024-12-31',
        icon: 'fas fa-gas-pump'
    },
    {
        id: 7,
        type: 'debit',
        description: 'Netflix Subscription',
        category: 'Entertainment',
        amount: -15.99,
        date: '2024-12-30',
        icon: 'fas fa-play'
    },
    {
        id: 8,
        type: 'credit',
        description: 'Freelance Payment',
        category: 'Income',
        amount: 850.00,
        date: '2024-12-29',
        icon: 'fas fa-laptop'
    }
];

// Account balances
let accounts = {
    checking: 5247.83,
    savings: 12856.42
};

// DOM elements
const transactionList = document.getElementById('transaction-list');
const transferForm = document.getElementById('transfer-form');
const successModal = document.getElementById('success-modal');
const lastUpdatedTime = document.getElementById('last-updated-time');
const checkingBalance = document.getElementById('checking-balance');
const savingsBalance = document.getElementById('savings-balance');

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    updateLastUpdatedTime();
    renderTransactions();
    setupEventListeners();
});

// Update last updated time
function updateLastUpdatedTime() {
    const now = new Date();
    const timeString = now.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    lastUpdatedTime.textContent = timeString;
}

// Render transactions
function renderTransactions() {
    transactionList.innerHTML = '';
    
    mockTransactions.forEach(transaction => {
        const transactionElement = createTransactionElement(transaction);
        transactionList.appendChild(transactionElement);
    });
}

// Create transaction element
function createTransactionElement(transaction) {
    const transactionDiv = document.createElement('div');
    transactionDiv.className = 'transaction-item';
    
    const formattedAmount = Math.abs(transaction.amount).toFixed(2);
    const amountClass = transaction.type === 'debit' ? 'debit' : 'credit';
    const amountPrefix = transaction.type === 'debit' ? '-' : '+';
    
    const formattedDate = new Date(transaction.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
    });
    
    transactionDiv.innerHTML = `
        <div class="transaction-info">
            <div class="transaction-icon ${transaction.type}">
                <i class="${transaction.icon}"></i>
            </div>
            <div class="transaction-details">
                <h4>${transaction.description}</h4>
                <p>${transaction.category}</p>
            </div>
        </div>
        <div class="transaction-amount">
            <div class="amount ${amountClass}">${amountPrefix}$${formattedAmount}</div>
            <div class="date">${formattedDate}</div>
        </div>
    `;
    
    return transactionDiv;
}

// Setup event listeners
function setupEventListeners() {
    // Transfer form submission
    transferForm.addEventListener('submit', handleTransferSubmit);
    
    // Modal close functionality
    successModal.addEventListener('click', function(e) {
        if (e.target === successModal) {
            closeModal();
        }
    });
    
    // Amount input formatting
    const amountInput = document.getElementById('amount');
    amountInput.addEventListener('input', function(e) {
        let value = e.target.value;
        if (value && !isNaN(value)) {
            // Ensure only 2 decimal places
            if (value.includes('.')) {
                const parts = value.split('.');
                if (parts[1] && parts[1].length > 2) {
                    e.target.value = parseFloat(value).toFixed(2);
                }
            }
        }
    });
    
    // Form validation
    const inputs = transferForm.querySelectorAll('input[required], select[required]');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
}

// Handle transfer form submission
function handleTransferSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(transferForm);
    const transferData = {
        fromAccount: formData.get('from-account'),
        toAccount: formData.get('to-account'),
        amount: parseFloat(formData.get('amount')),
        description: formData.get('description') || 'Transfer'
    };
    
    // Validate transfer
    if (!validateTransfer(transferData)) {
        return;
    }
    
    // Process transfer
    processTransfer(transferData);
}

// Validate transfer
function validateTransfer(transferData) {
    const { fromAccount, toAccount, amount } = transferData;
    
    // Check if amount is valid
    if (!amount || amount <= 0) {
        showError('amount', 'Please enter a valid amount');
        return false;
    }
    
    // Check if sufficient funds
    const availableBalance = accounts[fromAccount];
    if (amount > availableBalance) {
        showError('amount', 'Insufficient funds');
        return false;
    }
    
    // Check if to-account is not empty
    if (!toAccount.trim()) {
        showError('to-account', 'Please enter a recipient');
        return false;
    }
    
    return true;
}

// Process transfer
function processTransfer(transferData) {
    const { fromAccount, toAccount, amount, description } = transferData;
    
    // Update account balance
    accounts[fromAccount] -= amount;
    updateAccountBalance(fromAccount);
    
    // Create new transaction
    const newTransaction = {
        id: mockTransactions.length + 1,
        type: 'debit',
        description: `Transfer to ${toAccount}`,
        category: 'Transfer',
        amount: -amount,
        date: new Date().toISOString().split('T')[0],
        icon: 'fas fa-exchange-alt'
    };
    
    // Add transaction to the beginning of the list
    mockTransactions.unshift(newTransaction);
    
    // Re-render transactions
    renderTransactions();
    
    // Show success modal
    showSuccessModal(transferData);
    
    // Reset form
    transferForm.reset();
    
    // Update last updated time
    updateLastUpdatedTime();
}

// Update account balance display
function updateAccountBalance(accountType) {
    const balance = accounts[accountType];
    const formattedBalance = `$${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    
    if (accountType === 'checking') {
        checkingBalance.textContent = formattedBalance;
    } else if (accountType === 'savings') {
        savingsBalance.textContent = formattedBalance;
    }
}

// Show success modal
function showSuccessModal(transferData) {
    const transferDetails = document.getElementById('transfer-details');
    const { fromAccount, toAccount, amount, description } = transferData;
    
    const fromAccountName = fromAccount === 'checking' ? 'Checking Account' : 'Savings Account';
    const formattedAmount = `$${amount.toFixed(2)}`;
    
    transferDetails.innerHTML = `
        <p><strong>From:</strong> ${fromAccountName}</p>
        <p><strong>To:</strong> ${toAccount}</p>
        <p><strong>Amount:</strong> ${formattedAmount}</p>
        <p><strong>Description:</strong> ${description}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
    `;
    
    successModal.classList.add('show');
}

// Close modal
function closeModal() {
    successModal.classList.remove('show');
}

// Show field error
function showError(fieldName, message) {
    const field = document.getElementById(fieldName);
    const existingError = field.parentNode.querySelector('.error-message');
    
    if (existingError) {
        existingError.remove();
    }
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.color = '#dc2626';
    errorDiv.style.fontSize = '0.75rem';
    errorDiv.style.marginTop = '0.25rem';
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
    field.style.borderColor = '#dc2626';
}

// Clear field error
function clearFieldError(e) {
    const field = e.target;
    const errorMessage = field.parentNode.querySelector('.error-message');
    
    if (errorMessage) {
        errorMessage.remove();
        field.style.borderColor = '#d1d5db';
    }
}

// Validate individual field
function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    
    if (field.hasAttribute('required') && !value) {
        showError(field.id, 'This field is required');
    } else if (field.type === 'number' && value && (isNaN(value) || parseFloat(value) <= 0)) {
        showError(field.id, 'Please enter a valid amount');
    }
}

// Utility function to format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Add some interactive features
document.addEventListener('DOMContentLoaded', function() {
    // Add hover effects to account cards
    const accountCards = document.querySelectorAll('.account-card');
    accountCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Add click animation to transfer button
    const transferBtn = document.querySelector('.transfer-btn');
    transferBtn.addEventListener('click', function() {
        this.style.transform = 'scale(0.98)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 100);
    });
});