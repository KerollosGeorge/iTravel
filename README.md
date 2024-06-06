<h1>Online Hotel Booking Site</h1>
</br> 
<p>Welcome to the Online Hotel Booking Site! This project is a full-stack web application developed using the MERN stack (MongoDB, Express.js, React.js, and Node.js). It allows tourists to search, view, and book hotels online.</p> </br>
<h2>Table of Contents</h2>
<li>Features</li>
<li>Technologies Used</li>
<li>Installation</li>
<li>Usage</li>
<li>API Endpoints</li>
<li>Contributing</li>
<li>License</li>
<li>Contact</li>
</br>
<h4>Features</h3>
<li>User authentication and authorization</li>
<li>Search and filter hotels based on various criteria (location, price, ratings, etc.)</li>
<li>View detailed information about each hotel</li>
<li>Book hotels with real-time availability updates</li>
<li>User profile management</li>
<li>Admin panel for managing hotels, bookings, and users</li>
<li>Payment with Paypal</li>
</br>
<h4>Technologies Used</h3>
<li>Frontend: React.js, Tailwind </li>
<li>Backend: Node.js, Express.js</li>
<li>Database: MongoDB</li>
<li>Authentication: JWT (JSON Web Tokens)</li>
<li>API Testing: Postman</li>
<li>Deployment: GitHub Pages (frontend),</li></br>
<h4>Installation</h3>
<h5>Prerequisites</h5>
<li>Node.js and npm installed</li>
<li>MongoDB installed and running</li>
<h5>Steps</h5>
<ul>Clone the repository</ul>
<li> git clone  https://github.com/KerollosGeorge/iTravel.git</li>
<li>cd iTravel</li>
<ul>Install backend dependencies</ul>
<li>cd api</li>
<li>npm install</li>
<ul>Install frontend dependencies for client</ul>
<li>cd client</li>
<li>npm install</li>
<ul>Install frontend dependencies for admin</ul>
<li>cd admin</li>
<li>npm install</li>
<ul>Set up environment variables</ul>
Create a .env file in the backend directory and add the following:
<li>MONGO_URI=your_mongodb_connection_string</li>
<li>PORT = your port</li>
<li>JWT_SECRET=your_jwt_secret</li>
<li>PAYPAL_MODE="sandbox"</li>
<li>PAYPAL_CLIENT_KEY = "your client key"</li>
<li>PAYPAL_SECRET_KEY = "your secret key"</li>
<ul>Run the application</ul>
Open three terminal windows:
<li>cd api
npm start</li>
<li>cd client
npm start</li>
<li>cd admin
npm start</li>
</br>
<h4>Usage</h3>
<li>Register and log in as a user</li>
<li>Search for hotels</li>
<li>View hotel details</li>
<li>Book a hotel</li>
<li>Manage your bookings in your profile</li>
<li>Manage your profile</li>
<li>Pay with PayPal </li></br>
<h4>API Endpoints</h3>
<h5>Authentication</h5>
<li>POST /api/auth/register - Register a new user</li>
<li>POST /api/auth/login - Log in a user</li>
<li>POST /api/auth/adminLogin - Log in a admin</li>
<li>/api/auth/forget_password - Forget Password </li>
<li>/api/auth/reset_password/:id/:token - Reset Password </li></br>
<h5>Hotels</h5>
<li>GET /api/hotels - Get a list of all hotels</li>
<li>GET /api/hotels/- Get details of a specific hotel</li>
<li>POST /api/hotels - Add a new hotel (admin only)</li>
<li>PUT /api/hotels/- Update a hotel (admin only)</li>
<li>DELETE /api/hotels/- Delete a hotel (admin only)</li></br>
<h5>Bookings</h5>
<li>POST /api/bookings - Create a new booking</li>
<li>GET /api/bookings/user/- Get bookings for a specific user</li>
<li>DELETE /api/bookings/- Cancel a booking</li></br>
<h4>Contributing</h3>
<ul>Contributions are welcome! Please follow these steps:</ul>
<li>Fork the repository</li>
<li>Create a new branch (git checkout -b feature-branch)</li>
<li>Make your changes</li>
<li>Commit your changes (git commit -m 'Add some feature')</li>
<li>Push to the branch (git push origin feature-branch)</li>
<li>Open a pull request</li></br>
<h4>Contact</h3>
<li>Kerollos George - kerollos.george1@gmail.com</li>
<li>GitHub - KerollosGeorge </li></br></br>
Feel free to reach out if you have any questions or suggestions! Enjoy booking your stay! </br>
