export default defineNuxtRouteMiddleware((to, from) => {
  const isAuthenticated = localStorage.getItem('authenticated') === 'true';

  if (!isAuthenticated) {
    return navigateTo('/login'); // Redirect to login if not authenticated
  }
});