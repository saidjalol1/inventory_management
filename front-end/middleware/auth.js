export default defineNuxtRouteMiddleware((to, from) => {
  const isAuthenticated = localStorage.getItem('authToken');
  console.log(isAuthenticated)

  if (!isAuthenticated) {
    return navigateTo('/login'); // Redirect to login if not authenticated
  }
});