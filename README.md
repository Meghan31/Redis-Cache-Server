# 🚀 Redis Cache Server

## Description

**Redis-Cache-Server** is a Node.js application that leverages **Redis** to cache data for faster responses. The server interacts with:

1. A **PostgreSQL** database to fetch university course data.
2. Public REST APIs like [JSONPlaceholder](https://jsonplaceholder.typicode.com/) and [TVMaze](https://www.tvmaze.com/api) to retrieve posts and movies.

This reduces response times significantly by caching frequently requested data in **Redis**.

---

## Features

- **Efficient Caching**: Reduces redundant database and API calls by using Redis for quick responses.
- **Time Measurements**: Tracks the execution time for data retrieval to compare between Redis and the source.
- **Error Handling**: Robust error handling for invalid inputs and server errors.
- **CORS Support**: Allows cross-origin resource sharing.

---

## Tech Stack

- **Node.js** (Express.js for the web server)
- **PostgreSQL** (Data storage for course information)
- **Redis** (In-memory data caching)
- **Axios** (For external API calls)
- **CORS** (Cross-Origin Resource Sharing)

---

## Prerequisites

Ensure you have the following installed on your system:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **Redis** - [Installation Guide](https://redis.io/docs/getting-started/)
- **PostgreSQL** - [Installation Guide](https://www.postgresql.org/download/)

---

## Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/Meghan31/redis-cache-server.git
   cd redis-cache-server
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Setup PostgreSQL**:

   - Create a database named `university`.
   - Add a table `courses` with the following structure:
     ```sql
     CREATE TABLE courses (
       id SERIAL PRIMARY KEY,
       name VARCHAR(255) NOT NULL,
       department VARCHAR(255) NOT NULL
     );
     ```
   - Populate the table with sample data.

4. **Start Redis**:  
   Ensure Redis is running locally on `localhost:6379`. You can start Redis using:

   ```bash
   redis-server
   ```

5. **Run the Server**:  
   Start the server with the following command:
   ```bash
   node server.js
   ```
   The server will run on `http://localhost:3000`.

---

## API Endpoints

### 1. Get Courses from PostgreSQL

- **Endpoint**: `GET /courses`
- **Description**: Fetches courses from the PostgreSQL database, cached in Redis.
- **Query Parameter**:
  - `department` (required): The department to filter courses.
- **Example Request**:
  ```http
  GET http://localhost:3000/courses?department=ComputerScience
  ```
- **Example Response**:
  ```json
  {
  	"source": "Redis Cache | PostgreSQL Database",
  	"executionTime": "5.43ms",
  	"data": [
  		{ "id": 1, "name": "Data Structures", "department": "ComputerScience" },
  		{ "id": 2, "name": "Algorithms", "department": "ComputerScience" }
  	]
  }
  ```

---

### 2. Get Posts from JSONPlaceholder API

- **Endpoint**: `GET /posts`
- **Description**: Retrieves a post from the JSONPlaceholder API and caches it in Redis.
- **Query Parameter**:
  - `id` (required): ID of the post.
- **Example Request**:
  ```http
  GET http://localhost:3000/posts?id=1
  ```
- **Example Response**:
  ```json
  {
  	"source": "Redis Cache | External API",
  	"executionTime": "8.21ms",
  	"data": {
  		"userId": 1,
  		"id": 1,
  		"title": "Post Title",
  		"body": "This is the body of the post."
  	}
  }
  ```

---

### 3. Get Movies from TVMaze API

- **Endpoint**: `GET /movies`
- **Description**: Fetches movie/show details from the TVMaze API based on the title, cached in Redis.
- **Query Parameter**:
  - `title` (required): The title of the movie/show.
- **Example Request**:
  ```http
  GET http://localhost:3000/movies?title=Friends
  ```
- **Example Response**:
  ```json
  {
  	"source": "Redis Cache | External API",
  	"executionTime": "12.45ms",
  	"data": [
  		{
  			"show": {
  				"id": 1,
  				"name": "Friends",
  				"genres": ["Comedy", "Romance"],
  				"status": "Ended",
  				"rating": { "average": 8.5 }
  			}
  		}
  	]
  }
  ```

---

## Key Notes

- Data is cached in Redis for **1 hour** by default to balance performance and freshness.
- If Redis is down, the server will still fetch data directly from PostgreSQL or the APIs.
- Execution time provides insights into the performance benefits of using caching.

---

## Running in Development

Use **nodemon** for development to auto-restart the server on file changes:

```bash
npm install -g nodemon
nodemon server.js
```

---

## Troubleshooting

1. **Redis Connection Issues**:  
   Ensure Redis is running on `localhost:6379`. Check Redis logs using:

   ```bash
   redis-cli ping
   ```

   If it returns `PONG`, Redis is running correctly.

2. **PostgreSQL Connection Issues**:  
   Verify your PostgreSQL credentials in the `server.js` file.

3. **CORS Errors**:  
   CORS is enabled by default. If issues arise, ensure your frontend's origin matches the server's domain.

---
