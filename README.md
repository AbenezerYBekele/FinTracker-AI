# FinTracker AI
FinScan AI is a modern, cross-platform mobile application built with React Native and Expo that simplifies personal finance management. It features a clean user interface, secure authentication, and a powerful AI-driven receipt scanner to automate transaction entry.

## ✨ Core Features
- Secure Authentication: User sign-up, sign-in, and session management powered by Clerk.
- Financial Dashboard: An at-a-glance view of your total balance, income, and expenses.
- Transaction Management:
    - Manual Entry: Easily add income or expense transactions with categories.
    - AI Receipt Scanning: Take a picture of a receipt, and let Google's Gemini Pro Vision model intelligently extract the title, amount, and transaction type.
    - Transaction History: A clear, scrollable list of all your past transactions.
    - Delete Transactions: Easily remove transactions from your history.
- Pull-to-Refresh: Keep your financial data up-to-date with a simple pull-down gesture.
- Protected Routes: Ensures that only authenticated users can access the main application.

  <p align="center">
  <img src="https://github.com/user-attachments/assets/f75c34e6-2bcf-4c64-af1a-c9419046599a" alt="Dashboard" width="160"/>
  <img src="https://github.com/user-attachments/assets/842010eb-a80d-4240-ae15-355483cefaa1" alt="Create Transaction" width="160"/>
  <img src="https://github.com/user-attachments/assets/f17406f9-4372-473b-8f58-675f6df17ecf" alt="AI Scanner Page" width="160"/>
  <img src="https://github.com/user-attachments/assets/5eb29aac-792d-40a3-a790-860c1360c3ed" alt="Camera View" width="160"/>
  <img src="https://github.com/user-attachments/assets/04c73922-8317-4ae1-bf2a-e8775589f699" alt="Extracted Receipt" width="160"/>
</p>



  ## 🛠️ Technology Stack
- Framework: React Native with Expo
- Routing: Expo Router (File-based)
- Authentication: @clerk/clerk-expo
- AI Service: Google Gemini API for multimodal (image and text) analysis of receipts.
- State Management: React Hooks (useState, useEffect) and Custom Hooks (useTransactions).
- Local Storage: @react-native-async-storage/async-storage for caching receipt images.
- API Communication: fetch API to interact with a custom backend.

### Prerequisites

*   Node.js (LTS version)
*   Yarn or npm
*   Expo Go app on your mobile device or an emulator
*   A running instance of the backend API
*   A Clerk account for authentication keys
*   An API key for the AI text extraction service

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/finscan-ai.git
    cd finscan-ai
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up environment variables:**
    Create a file named `.env` in the root of the project and add your service keys. The application code is already set up to use these via Expo's environment variable system.

    ```
    EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_YOUR_CLERK_KEY"
    EXPO_PUBLIC_API_URL="http://your-backend-api-url.com"
    EXPO_PUBLIC_AI_API_KEY="your_ai_service_api_key" 
    ```
    > The `create.jsx` and `AIRecipt.jsx` files use an imported `API_URL`. Ensure this constant points to your running backend.

4.  **Backend Service:**
    This project requires a backend service to handle transaction data. The backend must expose the following endpoints:
    *   `GET /transactions?user_id=:id`: Fetches all transactions and a summary for a user.
    *   `POST /transactions`: Creates a new transaction.
    *   `DELETE /transactions/:id`: Deletes a specific transaction.
    *   `POST /extract-receipt`: An endpoint that takes a base64 image and returns structured JSON data (`{ title, amount, type }`).

5.  **Run the application:**
    ```bash
    npx expo start
    ```
    Scan the QR code with the Expo Go app on your phone or run it on an emulator.

## 🔮 Future Improvements

*   **Data Visualization:** Add charts and graphs to the dashboard for better financial insights.
*   **Budgeting Feature:** Allow users to set monthly budgets for different categories.
*   **Enhanced Categories:** Enable users to create, edit, and delete their own custom categories.
*   **Offline Support:** Cache transactions created offline and sync them with the backend when connectivity is restored.
*   **Testing:** Implement unit and integration tests using Jest and React Native Testing Library.
*   **UI/UX Polish:** Add animations and refine the user experience further.
