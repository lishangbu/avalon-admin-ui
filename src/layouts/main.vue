<template>
  <n-layout has-sider>
    <n-layout-sider width="200">
      <AppMenu />
    </n-layout-sider>
    <n-layout>
      <n-layout-header>
        <AppHeader />
      </n-layout-header>
      <n-layout-content>
        <router-view />
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>
