<script lang="ts">
import {type Component, defineComponent, h, ref} from 'vue';
import { NIcon } from 'naive-ui';
import type { MenuOption } from 'naive-ui';
import {useI18n} from "vue-i18n";
import {
  ChevronDown,
  Home as HomeIcon,
  Bookmark as BookmarkIcon,
  Info as InfoIcon
} from '@vicons/fa';
import {RouterLink} from "vue-router";

function renderIcon(src?: string | Component) {
  if (typeof src === 'string') {
    return () => h('img', {
      src,
      width: '25px',
      height: '25px'
    });
  } else if (src) {
    return () => h(NIcon, null, { default: () => h(src) });
  } else {

  }
}

export default defineComponent({
  setup() {
    const i18n = useI18n();

    const menuOptions: MenuOption[] = [
      {
        key: 'home',
        icon: renderIcon(HomeIcon),
        label: () => h(RouterLink,
          {
            to: {
              name: 'home'
            }
          },
          { default: () => i18n.t('home.title') }
        ),
      },
      {
        key: 'quests',
        icon: renderIcon('https://oldschool.runescape.wiki/images/Quests.png?f5120'),
        label:  i18n.t('quests'),
        children: [
          {
            label: 'Sheep Shearer',
            key: 'sheep-shearer'
          },
          {
            label: 'Monkey Madness 2',
            key: 'mm2'
          },
          {
            label: 'Desert Treasure II - The Fallen Empire',
            key: 'dt2'
          }
        ]
      },
      {
        key: 'items',
        icon: renderIcon("https://oldschool.runescape.wiki/images/Inventory.png?d4795"),
        label: i18n.t('items'),
      },
      {
        key: 'about',
        icon: renderIcon(InfoIcon),
        label: () => h(RouterLink,
            {
              to: {
                name: 'about'
              }
            },
            { default: () => i18n.t('about.title') }
        ),
      },
    ];

    return {
      menuOptions,
      collapsed: ref(false),
      expandIcon() {
        return h(NIcon, null, { default: () => h(ChevronDown) });
      }
    };
  }
});
</script>

<template>
  <n-space vertical>
    <n-layout has-sider position="absolute">
      <header>
        <n-layout-sider
            bordered
            collapse-mode="width"
            :collapsed-width="64"
            :width="240"
            :collapsed="collapsed"
            show-trigger
            @collapse="collapsed = true"
            @expand="collapsed = false"
        >
          <n-layout-header>
            <n-flex class="logo" justify="start" align="center" :wrap="false" >
              <img alt="Logo" src="@/assets/logo.svg"/>
              <h1  v-if="!collapsed">{{ $t('global.title') }}</h1>
            </n-flex>
          </n-layout-header>
          <n-menu
              :collapsed="collapsed"
              :collapsed-width="64"
              :collapsed-icon-size="22"
              :options="menuOptions"
              :expand-icon="expandIcon"
          />
      </n-layout-sider>
      </header>
      <n-layout>
        <RouterView />
      </n-layout>
    </n-layout>
  </n-space>
</template>

<style scoped>
.logo {
  img {
    width: 4em;
    padding: 0.5em;
  }

  h1 {
    white-space: nowrap;
  }
}
</style>
