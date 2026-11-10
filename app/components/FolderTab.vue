<template>
  <div class="folder-tab">
    <svg class="folder-notch" viewBox="0 0 60 52" preserveAspectRatio="none" aria-hidden="true"><path d="M0 0H60V52C30 52 30 0 0 0Z" /></svg>
    <span class="folder-label" :class="{ 'folder-label-empty': !$slots.default }"><slot /></span>
  </div>
</template>
