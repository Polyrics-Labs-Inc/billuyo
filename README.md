# BilluYo

It is a web platform with a fully responsive design optimized for mobile devices and PWA capabilities, allowing you to track expenses for anything.
It requires no installation, does not (yet) use a database, and lets you complete your work, export everything, and then import it and start over as if nothing had happened.

## Funcionalidades

- It allows you to record all transactions, whether they are expenses, income, or transfers between accounts, but you don't need to maintain accounts; transactions are unrestricted.
- It allows you to add accounts that function solely as groupings; a transaction could be withdrawn from one account (subtraction effect) and moved to another account (addition effect). Accounts will have a name, a currency type, a color, and an icon.
- It allows you to create tracking entries; each tracking entry is a grouping of transactions occurring at a specific frequency—for example, every 1 day, every 1 week, every 1 month, every 15 days, every 20 years, etc.—with a start date. It will display only the details for the current period and allow you to navigate to previous periods. This tracking entry will show a summary of the transactions, totals, and relevant data.
- Allows you to add obligations, which can be: savings, expenses, or income; they will have their own frequency, just like the tracking entries, with an expected value.
Inline corrections
- Within the tracking section, you can view the obligations that apply for each period, grouped in the following order: income, savings, and expenses. You can mark these obligations as completed (for income, mark as "done"; for savings, mark as "paid"; and for savings, mark as "done"), and when you do so, you will be prompted to enter the actual amount (the expected amount is auto-filled). This action will be reflected as a transaction with its associated effects; for example, for income, there will be an income transaction and an effect of adding to an account, but for savings, there will be an effect of subtracting from one account to add to another, and for expenses, only an expense transaction and an effect on an account.


## Entidades
- Transaction that stores all recorded transactions, including currency, amount, date, time, and description.
- Account for grouping, with name, description, default currency, initial balance, and whether it is the default account for savings or expenses.
- Transaction that links to an account and indicates whether it adds to or subtracts from that account; there must be at least one transaction per transaction with the category it belongs to, direction (whether it adds or subtracts), the account it is associated with, the amount, and the category.
- Recurring item with name, frequency (a value composed of "every x days: the frequency: start date"; example: 1:M:2025-02-15 for every month starting February 15, 2025), and an end date (will only allow selection of dates available for the period).
- Transaction to track recurring transactions (without creating them), e.g., a salary deposit would be a transaction with a movement associated with an account, all with type: savings, expense, income, expected value, and a frequency similar to the tracking.
- Action that links the transaction to the transaction record to mark it as paid, with a date and time.
- Category: name, an icon, and whether it defaults to a debit or credit at the transaction level

## Flujo ejemplo
1. The user logs in (without registering).
2. The system will ask the user to start from scratch or import from a JSON file.
3. If starting from scratch, the system will ask the user to create a default account for expenses/income.
4. The user will create that account
5. The user will click "Add a Transaction," select the category, and add a description.
6. The system will create a transaction with the information and add a record with the data
7. It will display a dashboard for the remaining features.