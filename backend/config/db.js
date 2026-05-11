const mongoose = require('mongoose');

/**
 * Connect to MongoDB Database
 * Handles connection retries and graceful shutdown
 */
class Database {
  constructor() {
    this.isConnected = false;
    this.retryCount = 0;
    this.maxRetries = 5;
    this.retryInterval = 5000;
  }

  async connect() {
    try {
      const mongoURI = process.env.MONGODB_URI;
      
      if (!mongoURI) {
        throw new Error('MONGODB_URI is not defined');
      }

      const conn = await mongoose.connect(mongoURI, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        family: 4,
      });

      this.isConnected = true;
      this.retryCount = 0;

      // Clean, minimal success message
      console.log(`✅ MongoDB Connected Sucessfully: ${conn.connection.host}`);

      // Handle connection events
      mongoose.connection.on('error', (err) => {
        console.error('❌ MongoDB error:', err.message);
        this.isConnected = false;
      });

      mongoose.connection.on('disconnected', () => {
        console.warn('⚠️ MongoDB disconnected. Reconnecting...');
        this.isConnected = false;
        this.handleDisconnect();
      });

      mongoose.connection.on('reconnected', () => {
        console.log('✅ MongoDB reconnected');
        this.isConnected = true;
      });

      return conn;
    } catch (error) {
      console.error('❌ MongoDB Connection Error:', error.message);
      this.isConnected = false;
      await this.handleConnectionError();
    }
  }

  async handleConnectionError() {
    if (this.retryCount < this.maxRetries) {
      this.retryCount++;
      console.log(`🔄 Retry ${this.retryCount}/${this.maxRetries} in 5s...`);
      
      setTimeout(async () => {
        await this.connect();
      }, this.retryInterval);
    } else {
      console.error('❌ Failed to connect to MongoDB after maximum retries');
      process.exit(1);
    }
  }

  async handleDisconnect() {
    setTimeout(async () => {
      if (!this.isConnected) {
        await this.connect();
      }
    }, this.retryInterval);
  }

  async disconnect() {
    try {
      await mongoose.disconnect();
      this.isConnected = false;
      console.log('MongoDB disconnected');
    } catch (error) {
      console.error('Error disconnecting:', error.message);
    }
  }

  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      readyState: mongoose.connection.readyState,
      host: mongoose.connection.host,
      name: mongoose.connection.name
    };
  }
}

const database = new Database();

const connectDB = async () => {
  await database.connect();
  return database;
};

module.exports = connectDB;
module.exports.Database = Database;