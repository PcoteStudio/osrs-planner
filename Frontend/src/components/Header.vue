<script setup lang="ts">
import type { Component } from 'vue'
import { defineComponent, h } from 'vue'
import { RouterLink } from 'vue-router'
import { NIcon, useMessage } from 'naive-ui'
import type { MenuOption } from 'naive-ui'

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

const menuOptions: MenuOption[] = [
  {
    label: () =>
        h(
            RouterLink,
            {
              to: {
                name: 'home',
                params: {
                  lang: 'en-US'
                }
              }
            },
            { default: () => 'Going Home' }
        ),
    key: 'go-back-home'
  },
  {
    key: 'divider-1',
    type: 'divider',
    props: {
      style: {
        marginLeft: '32px'
      }
    }
  },
  {
    label: () =>
        h(
            'a',
            {
              href: 'https://en.wikipedia.org/wiki/Hear_the_Wind_Sing',
              target: '_blank',
              rel: 'noopenner noreferrer'
            },
            'Hear the Wind Sing'
        ),
    key: 'hear-the-wind-sing'
  },
  {
    label: 'Pinball 1973',
    key: 'pinball-1973',
    disabled: true,
    children: [
      {
        label: 'Rat',
        key: 'rat'
      }
    ]
  },
  {
    label: 'A Wild Sheep Chase',
    key: 'a-wild-sheep-chase',
    disabled: true
  },
  {
    label: 'Dance Dance Dance',
    key: 'Dance Dance Dance',
    children: [
      {
        type: 'group',
        label: 'People',
        key: 'people',
        children: [
          {
            label: 'Narrator',
            key: 'narrator'
          },
          {
            label: 'Sheep Man',
            key: 'sheep-man'
          }
        ]
      },
      {
        label: 'Beverage',
        key: 'beverage',
        children: [
          {
            label: 'Whisky',
            key: 'whisky'
          }
        ]
      },
      {
        label: 'Food',
        key: 'food',
        children: [
          {
            label: 'Sandwich',
            key: 'sandwich'
          }
        ]
      },
      {
        label: 'The past increases. The future recedes.',
        key: 'the-past-increases-the-future-recedes'
      }
    ]
  }
]

// export default defineComponent({
//   setup() {
//     const message = useMessage()
//     return {
//       menuOptions,
//       handleUpdateValue(key: string, item: MenuOption) {
//         message.info(`[onUpdate:value]: ${JSON.stringify(key)}`)
//         message.info(`[onUpdate:value]: ${JSON.stringify(item)}`)
//       }
//     }
//   }
// })
</script>

<template>
  <header>
    <div class="logo">
      <img alt="Vue logo" src="@/assets/logo.svg" width="125" height="125" />
      <h1>{{ $t('global.title') }}</h1>
    </div>
    <n-space vertical>
      <n-switch v-model:value="collapsed" />
      <n-layout has-sider>
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
          <n-menu
              :collapsed="collapsed"
              :collapsed-width="64"
              :collapsed-icon-size="22"
              :options="menuOptions"
              :render-label="renderMenuLabel"
              :render-icon="renderMenuIcon"
              :expand-icon="expandIcon"
          />
        </n-layout-sider>
        <n-layout>
          <span>Content</span>
        </n-layout>
      </n-layout>
    </n-space>

<!--    <nav>-->
<!--      <RouterLink to="/">-->
<!--        <font-awesome-icon icon="fa-solid fa-house" />-->
<!--        <span>{{ $t('home.title' )}}</span>-->
<!--      </RouterLink>-->
<!--      <RouterLink to="/about">-->
<!--        <font-awesome-icon icon="fa-solid fa-mug-saucer" />-->
<!--        About-->
<!--      </RouterLink>-->
<!--    </nav>-->
  </header>
</template>

<style scoped>
header {
  background: black;
  display: flex;
  flex-direction: column;
  width: fit-content;
}

.logo {
  background: green;
  display: flex;
  align-items: center;
  gap: 0.3rem;

  img {
    width: 4rem;
    height: 4rem;
  }
}

nav {
  display: flex;
  flex-direction: column;

}
</style>