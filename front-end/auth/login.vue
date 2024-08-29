<template>
    <div class="login-container">
      <div class="login-card">
        <h1>Login</h1>
        <form @submit.prevent="handleSubmit">
          <div class="input-group">
            <label for="username">Username</label>
            <input
              v-model="username"
              type="text"
              id="username"
              required
              placeholder="Enter your username"
            />
          </div>
          <div class="input-group">
            <label for="password">Password</label>
            <input
              v-model="password"
              type="password"
              id="password"
              required
              placeholder="Enter your password"
            />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const username = ref('');
  const password = ref('');
  
  const handleSubmit = () => {
    // Handle login logic here, like calling an API
    console.log('Username:', username.value);
    console.log('Password:', password.value);
  };
  </script>
  
  <style scoped>
  .login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f4f7fa;
  }
  
  .login-card {
    background-color: #ffffff;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    max-width: 400px;
    width: 100%;
    text-align: center;
  }
  
  h1 {
    margin-bottom: 1.5rem;
    font-size: 24px;
    color: #333333;
  }
  
  .input-group {
    margin-bottom: 1rem;
    text-align: left;
  }
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #333333;
  }
  
  input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #dddddd;
    border-radius: 4px;
    font-size: 16px;
    color: #333333;
    background-color: #f9f9f9;
    transition: border-color 0.3s ease;
  }
  
  input:focus {
    border-color: #007bff;
    outline: none;
  }
  
  button {
    width: 100%;
    padding: 0.75rem;
    background-color: #007bff;
    color: #ffffff;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  button:hover {
    background-color: #0056b3;
  }
  </style>
  