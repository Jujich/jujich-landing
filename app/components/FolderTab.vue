<template>
  <div class="folder-tab">
    <!-- Extend the fill under the label to cover subpixel antialiasing at their shared edge. -->
    <svg class="folder-notch" viewBox="0 0 60 52" preserveAspectRatio="none" aria-hidden="true"><path d="M0 0H62V52H60C30 52 30 0 0 0Z" /></svg>
    <span class="folder-label" :class="{ 'folder-label-empty': !$slots.default }"><slot /></span>
  </div>
</template>
