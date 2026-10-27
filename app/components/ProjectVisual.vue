<script setup lang="ts">
defineProps<{ kind: string }>()
const { t } = useI18n()
</script>

<template>
  <div class="project-visual" :class="`visual-${kind}`" aria-hidden="true">
    <template v-if="kind === 'school'">
      <div class="mini-window school-window">
        <div class="mini-top"><span class="mini-logo">a.</span><span>{{ t('visual.academy') }}</span><span class="mini-nav">{{ t('visual.schoolNav') }}</span></div>
        <div class="school-body"><div><span class="mini-eyebrow">{{ t('visual.dashboard') }}</span><h4>{{ t('visual.continue1') }}<br>{{ t('visual.continue2') }}</h4><div class="mini-button">{{ t('visual.courses') }} <ArrowIcon /></div></div><div class="book-stack"><i>01<br><b>{{ t('visual.book1') }}<br>{{ t('visual.book2') }}</b></i><i>AB</i></div></div>
        <div class="mini-lessons"><span>01 &nbsp; {{ t('visual.lesson1') }} <b>✓</b></span><span>02 &nbsp; {{ t('visual.lesson2') }} <b><ArrowIcon direction="right" /></b></span></div>
      </div>
    </template>
    <template v-else-if="kind === 'crm'">
      <div class="mini-window crm-window"><aside><b>r.</b><i>◫</i><i>▥</i><i>◎</i><i>⚙</i></aside><div class="crm-body"><div class="mini-top"><b>{{ t('visual.workspace') }}</b><span class="tiny-avatar">KK</span></div><div class="mini-tabs">{{ t('visual.overview') }} &nbsp;&nbsp; <b>{{ t('visual.kanban') }}</b> &nbsp;&nbsp; {{ t('visual.team') }}</div><div class="kanban"><div><span>{{ t('visual.todo') }} <em>2</em></span><article><i></i><b>{{ t('visual.newProject') }}</b><small>{{ t('visual.requirements') }}</small><footer>◷ {{ t('visual.today') }} <u>K</u></footer></article><article><i></i><b>{{ t('visual.approve') }}</b><small>{{ t('visual.design') }}</small></article></div><div><span>{{ t('visual.inProgress') }} <em>1</em></span><article><i></i><b>{{ t('visual.account') }}</b><small>Frontend</small><footer><span><ArrowIcon /> {{ t('visual.high') }}</span> <u>K</u></footer></article></div><div><span>{{ t('visual.done') }} <em>1</em></span><article><i></i><b>{{ t('visual.api') }}</b><small>{{ t('visual.integration') }}</small><footer>✓ {{ t('visual.completed') }}</footer></article></div></div></div></div>
    </template>
    <template v-else-if="kind === 'vpn'">
      <div class="network-visual"><span class="network-node node-one">WEB</span><span class="network-node node-two">BOT</span><div class="network-center"><span><ArrowIcon /></span><b>VPN</b><small>{{ t('visual.connected') }}</small></div><span class="network-node node-three">API</span><span class="network-node node-four">ADMIN</span><i class="network-ring"></i></div>
    </template>
    <template v-else-if="kind === 'forma'">
      <div class="forma-window">
        <div class="forma-toolbar"><b>forma<span>✳</span></b><span>CMS / AI EDITOR</span><i>◫</i></div>
        <div class="forma-workspace">
          <div class="forma-editor"><span class="mini-eyebrow">{{ t('visual.formaEditor') }}</span><div class="forma-message">{{ t('visual.formaPrompt') }}</div><div class="forma-reply"><b>✳</b><span>{{ t('visual.formaReply') }}</span></div><div class="forma-input"><span>{{ t('visual.formaInput') }}</span><b><ArrowIcon direction="up" /></b></div></div>
          <div class="forma-preview"><div class="forma-preview-bar"><span>{{ t('visual.formaPreview') }}</span><span>▱ &nbsp; ▯</span></div><div class="forma-preview-page"><span>YOUR BRAND</span><h4>{{ t('visual.formaLine1') }}<br><em>{{ t('visual.formaLine2') }}</em></h4><div class="forma-preview-button">{{ t('visual.formaButton') }} <ArrowIcon /></div><div class="forma-preview-blocks"><i></i><i></i><i></i></div></div></div>
        </div>
        <div class="forma-footer"><span><ArrowIcon direction="undo" /> &nbsp; {{ t('visual.formaHistory') }}</span><span>Nuxt / Next.js &nbsp; <ArrowIcon /></span></div>
      </div>
    </template>
    <template v-else-if="kind === 'medical'">
      <div class="medical-visual"><div class="medical-icon">+</div><span class="mini-eyebrow">{{ t('visual.medical') }}</span><h4>{{ t('visual.queue1') }}<br>{{ t('visual.queue2') }}</h4><div class="upload-row"><span>▧</span><div><b>{{ t('visual.study') }}</b><i></i></div><span>✓</span></div><small>Web · Android</small></div>
    </template>
    <template v-else-if="kind === 'mafia'">
      <div class="mafia-visual"><span class="mini-eyebrow">{{ t('visual.offline') }}</span><div class="mafia-cards"><i>♠</i><i>♥</i><i>♣</i></div><b>{{ t('visual.game1') }}<br>{{ t('visual.game2') }}</b></div>
    </template>
    <template v-else>
      <div class="lawyer-visual"><span>{{ t('visual.legal') }}</span><h4>{{ t('visual.law1') }}<br>{{ t('visual.law2') }}<br><em>{{ t('visual.law3') }}</em></h4><div>{{ t('visual.consultation') }} <ArrowIcon /></div><i>§</i></div>
    </template>
    <span class="visual-caption">{{ t('visual.caption') }}</span>
  </div>
</template>
