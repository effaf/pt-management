# Service Management Application

This is a 3-tier service management application built with React, Flask, and SQLite.

## Prerequisites

- Python 3.7+
- Node.js 14+
- npm 6+

## Setup

### Backend

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Create a virtual environment:
   ```
   python -m venv venv
   ```

3. Activate the virtual environment:
   - On Windows: `venv\Scripts\activate`
   - On macOS and Linux: `source venv/bin/activate`

4. Install the required packages:
   ```
   pip install -r requirements.txt
   ```

5. Initialize the database:
   ```
   python
   >>> from app import create_app, db
   >>> app = create_app()
   >>> with app.app_context():
   ...     db.create_all()
   >>> exit()
   ```

6. Run the Flask application:
   ```
   flask run --port=50656
   ```

### Frontend

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install the required packages:
   ```
   npm install
   ```

3. Start the React application:
   ```
   npm start
   ```

## Usage

1. Open your web browser and go to `http://localhost:3000` to access the frontend.
2. The backend API will be available at `http://localhost:50656`.

## Features

- Dashboard with summary statistics
- Manage Servicers, Clients, and Services
- Calculate and report on commissions earned by Servicers

## API Endpoints

- GET /servicers - List all servicers
- POST /servicers - Create a new servicer
- GET /clients - List all clients
- POST /clients - Create a new client
- GET /services - List all services
- POST /services - Create a new service
- GET /commissions - Get commission reports

## Contributing

Please read CONTRIBUTING.md for details on our code of conduct, and the process for submitting pull requests to us.

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.