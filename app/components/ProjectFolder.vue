<script setup lang="ts">
import type { Project } from '~/data/projects'
defineProps<{ project: Project; number?: string; supporting?: boolean }>()
const { t } = useI18n()
</script>

<template>
  <article :id="`project-${project.id}`" class="folder" :class="supporting ? 'supporting-project' : 'project-folder'" data-reveal="folder">
    <div class="folder-body">
      <div class="project-top"><span v-if="number" class="project-num">{{ number }}</span><span class="project-kicker">{{ project.type }}</span></div>
      <component :is="supporting ? 'h4' : 'h3'"><a v-if="project.url" :href="project.url" target="_blank" rel="noopener noreferrer" :aria-label="t('projects.visit', { name: project.name })">{{ project.name }} <ArrowIcon class="ico" /></a><template v-else>{{ project.name }}</template></component>
      <p>{{ project.description }}</p>
      <ul v-if="!supporting" class="tags" :aria-label="t('projects.technologies')"><li v-for="tag in project.tags" :key="tag">{{ tag }}</li></ul>
      <a v-if="project.repositoryUrl" class="text-link project-repository" :href="project.repositoryUrl" target="_blank" rel="noopener noreferrer" :aria-label="t('projects.repositoryLabel', { name: project.name })">{{ t('projects.repository') }} <ArrowIcon /></a>
      <details class="project-details">
        <summary>{{ t(supporting ? 'projects.supportingDetails' : 'projects.details') }} <span aria-hidden="true">+</span></summary>
        <div class="project-details-content"><h4>// {{ t('projects.task') }}</h4><p>{{ project.task }}</p><h4>// {{ t('projects.features') }}</h4><ul><li v-for="feature in project.features" :key="feature">{{ feature }}</li></ul><p v-if="project.note" class="project-note">{{ project.note }}</p></div>
      </details>
    </div>
    <FolderTab><span class="folder-project-label">{{ project.id === 'school' ? 'Academy' : project.id === 'crm' ? 'CRM' : project.id === 'forma' ? 'Forma' : project.name }}</span><em>{{ project.status }}</em></FolderTab>
    <svg class="folder-outline" aria-hidden="true"><path pathLength="1" /></svg>
  </article>
</template>
