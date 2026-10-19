<script setup lang="ts">
defineProps<{ kind: string }>()
const { t } = useI18n()
</script>

<template>
  <div class="project-visual" :class="`visual-${kind}`" aria-hidden="true">
    <template v-if="kind === 'school'">
      <div class="mini-window school-window">
        <div class="mini-top"><span class="mini-logo">a.</span><span>{{ t('visual.academy') }}</span><span class="mini-nav">{{ t('visual.schoolNav') }}</span></div>
        <div class="school-body"><div><span class="mini-eyebrow">{{ t('visual.dashboard') }}</span><h4>{{ t('visual.continue1') }}<br>{{ t('visual.continue2') }}</h4><div class="mini-button">{{ t('visual.courses') }} ↗</div></div><div class="book-stack"><i>01<br><b>{{ t('visual.book1') }}<br>{{ t('visual.book2') }}</b></i><i>AB</i></div></div>
        <div class="mini-lessons"><span>01 &nbsp; {{ t('visual.lesson1') }} <b>✓</b></span><span>02 &nbsp; {{ t('visual.lesson2') }} <b>→</b></span></div>
      </div>
    </template>
    <template v-else-if="kind === 'crm'">
      <div class="mini-window crm-window"><aside><b>r.</b><i>◫</i><i>▥</i><i>◎</i><i>⚙</i></aside><div class="crm-body"><div class="mini-top"><b>{{ t('visual.workspace') }}</b><span class="tiny-avatar">KK</span></div><div class="mini-tabs">{{ t('visual.overview') }} &nbsp;&nbsp; <b>{{ t('visual.kanban') }}</b> &nbsp;&nbsp; {{ t('visual.team') }}</div><div class="kanban"><div><span>{{ t('visual.todo') }} <em>2</em></span><article><i></i><b>{{ t('visual.newProject') }}</b><small>{{ t('visual.requirements') }}</small><footer>◷ {{ t('visual.today') }} <u>K</u></footer></article><article><i></i><b>{{ t('visual.approve') }}</b><small>{{ t('visual.design') }}</small></article></div><div><span>{{ t('visual.inProgress') }} <em>1</em></span><article><i></i><b>{{ t('visual.account') }}</b><small>Frontend</small><footer>↗ {{ t('visual.high') }} <u>K</u></footer></article></div><div><span>{{ t('visual.done') }} <em>1</em></span><article><i></i><b>{{ t('visual.api') }}</b><small>{{ t('visual.integration') }}</small><footer>✓ {{ t('visual.completed') }}</footer></article></div></div></div></div>
    </template>
    <template v-else-if="kind === 'vpn'">
      <div class="network-visual"><span class="network-node node-one">WEB</span><span class="network-node node-two">BOT</span><div class="network-center"><span>↗</span><b>VPN</b><small>{{ t('visual.connected') }}</small></div><span class="network-node node-three">API</span><span class="network-node node-four">ADMIN</span><i class="network-ring"></i></div>
    </template>
    <template v-else-if="kind === 'medical'">
      <div class="medical-visual"><div class="medical-icon">+</div><span class="mini-eyebrow">{{ t('visual.medical') }}</span><h4>{{ t('visual.queue1') }}<br>{{ t('visual.queue2') }}</h4><div class="upload-row"><span>▧</span><div><b>{{ t('visual.study') }}</b><i></i></div><span>✓</span></div><small>Web · Android</small></div>
    </template>
    <template v-else-if="kind === 'mafia'">
      <div class="mafia-visual"><span class="mini-eyebrow">{{ t('visual.offline') }}</span><div class="mafia-cards"><i>♠</i><i>♥</i><i>♣</i></div><b>{{ t('visual.game1') }}<br>{{ t('visual.game2') }}</b></div>
    </template>
    <template v-else>
      <div class="lawyer-visual"><span>{{ t('visual.legal') }}</span><h4>{{ t('visual.law1') }}<br>{{ t('visual.law2') }}<br><em>{{ t('visual.law3') }}</em></h4><div>{{ t('visual.consultation') }} ↗</div><i>§</i></div>
    </template>
    <span class="visual-caption">{{ t('visual.caption') }}</span>
  </div>
</template>
