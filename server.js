// server.js
const express = require('express');
const { Pool } = require('pg');
const Redis = require('redis');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// PostgreSQL configuration
const pool = new Pool({
	user: 'postgres',
	host: 'localhost',
	database: 'university', // You'll need to create this database
	password: 'abc123',
	port: 5432,
});

// Redis client setup
const redisClient = Redis.createClient({
	host: 'localhost',
	port: 6379,
});

redisClient.on('connect', () => {
	console.log('Connected to Redis server');
});

redisClient.on('error', (err) => {
	console.error('Redis Client Error:', err);
});

// Helper function to measure execution time
const measureTime = async (callback) => {
	const start = process.hrtime();
	const result = await callback();
	const end = process.hrtime(start);
	const executionTime = (end[0] * 1000 + end[1] / 1000000).toFixed(2); // Convert to milliseconds
	return { result, executionTime };
};

// Helper function for Redis get/set operations
const getRedisData = (key) => {
	return new Promise((resolve, reject) => {
		redisClient.get(key, (err, data) => {
			if (err) reject(err);
			resolve(data);
		});
	});
};

const setRedisData = (key, value, expirationInSeconds = 3600) => {
	return new Promise((resolve, reject) => {
		redisClient.setex(key, expirationInSeconds, value, (err, reply) => {
			if (err) reject(err);
			resolve(reply);
		});
	});
};

// Endpoint 1: Get courses from PostgreSQL
app.get('/courses', async (req, res) => {
	try {
		const department = req.query.department;
		if (!department) {
			return res
				.status(400)
				.json({ error: 'Department parameter is required' });
		}

		// Check Redis cache first
		const cacheKey = `courses:${department}`;
		const cachedData = await getRedisData(cacheKey);

		if (cachedData) {
			const { executionTime } = await measureTime(async () =>
				JSON.parse(cachedData)
			);
			return res.json({
				source: 'Redis Cache',
				executionTime: `${executionTime}ms`,
				data: JSON.parse(cachedData),
			});
		}

		// If not in cache, get from PostgreSQL
		const { result: courses, executionTime } = await measureTime(async () => {
			const query = 'SELECT * FROM courses WHERE department = $1';
			const { rows } = await pool.query(query, [department]);
			return rows;
		});

		// Store in Redis cache
		await setRedisData(cacheKey, JSON.stringify(courses));

		res.json({
			source: 'PostgreSQL Database',
			executionTime: `${executionTime}ms`,
			data: courses,
		});
	} catch (error) {
		console.error('Error:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

// Endpoint 2: Get data from public API (using JSONPlaceholder as an example)
app.get('/posts', async (req, res) => {
	try {
		const postId = req.query.id;
		if (!postId) {
			return res.status(400).json({ error: 'Post ID is required' });
		}

		// Check Redis cache first
		const cacheKey = `post:${postId}`;
		const cachedData = await getRedisData(cacheKey);

		if (cachedData) {
			const { executionTime } = await measureTime(async () =>
				JSON.parse(cachedData)
			);
			return res.json({
				source: 'Redis Cache',
				executionTime: `${executionTime}ms`,
				data: JSON.parse(cachedData),
			});
		}

		// If not in cache, get from API
		const { result: post, executionTime } = await measureTime(async () => {
			const response = await axios.get(
				`https://jsonplaceholder.typicode.com/posts/${postId}`
			);
			return response.data;
		});

		// Store in Redis cache
		await setRedisData(cacheKey, JSON.stringify(post));

		res.json({
			source: 'External API',
			executionTime: `${executionTime}ms`,
			data: post,
		});
	} catch (error) {
		console.error('Error:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

// Endpoint 3: Retrieve data from a public REST API

app.get('/movies', async (req, res) => {
	try {
		const title = req.query.title;
		if (!title) {
			return res.status(400).json({ error: 'Title is required' });
		}

		// Check Redis cache first
		const cacheKey = `movies:${title}`;
		const cachedData = await getRedisData(cacheKey);

		if (cachedData) {
			const { executionTime } = await measureTime(async () =>
				JSON.parse(cachedData)
			);
			return res.json({
				source: 'Redis Cache',
				executionTime: `${executionTime}ms`,
				data: JSON.parse(cachedData),
			});
		}

		// If not in cache, get from API
		const { result: post, executionTime } = await measureTime(async () => {
			const response = await axios.get(
				`https://api.tvmaze.com/search/shows?q=${title}`
			);
			return response.data;
		});

		// Store in Redis cache
		await setRedisData(cacheKey, JSON.stringify(post));

		res.json({
			source: 'External API',
			executionTime: `${executionTime}ms`,
			data: post,
		});
	} catch (error) {
		console.error('Error:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

const PORT = 3000;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
