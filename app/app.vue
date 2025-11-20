<template>
  <div class="app-container">
    <NuxtRouteAnnouncer />
    <Sidebar />
    <main class="main-content">
      <NuxtPage />
    </main>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.app-container {
  display: flex;
  height: 100vh;
  background-color: #343541;
  color: #fff;
}

.main-content {
  flex: 1;
  overflow-y: auto;
}
</style>
