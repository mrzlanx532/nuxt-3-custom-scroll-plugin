<template>
  <nav>
    <RouterLink to="/">Index</RouterLink>
    <RouterLink to="/modal">Modal</RouterLink>
  </nav>
  <main>
    <RouterView :key="$route.path"/>
  </main>
</template>