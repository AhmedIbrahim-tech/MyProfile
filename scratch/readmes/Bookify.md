# Bookify

## Introduction

The Bookify System is a web application that allows libraries to manage their book lending and returns processes efficiently. Built with C#, .NET Core MVC, and SQL Server, this system is designed to streamline operations by offering an intuitive interface for both librarians and borrowers. It supports features such as catalog management, user registration, book lending, and return processes.

## Features

- **User Registration and Management:**
  - Secure login and registration system for librarians and members.
  - Ability to update and manage user profiles.
  - Role-based access control for different level of users.

- **Catalog Management:**
  - Add, update, or remove books from the catalog.
  - Search and filter capabilities to easily find books.
  - Detailed book descriptions including availability status.

- **Borrowing and Returning Books:**
  - Checkout system for borrowing books.
  - Return mechanism with overdue calculations.
  - Automatic updates to inventory and user borrowing limits.

- **Reporting:**
  - Generate reports on book usage and borrowing trends.
  - Member-specific borrowing histories.
  - Inventory reports for balance and stock verification.

- **Notifications:**
  - Email notifications for due dates and overdue books.
  - Alerts for librarians on stock depletion and high-demand books.

## Technologies Used

- **C#:** Used for backend development, leveraging .NET Core's powerful and efficient framework for building dynamic web applications.
- **.NET Core MVC:** MVC architecture is employed to separate concerns, making the code cleaner and more maintainable.
- **SQL Server:** Used as the database backend to store, retrieve, and manage the library's data securely and efficiently.
- **Entity Framework Core:** ORM used to abstract database operations in C# code, provides strong typing and LINQ capabilities.
