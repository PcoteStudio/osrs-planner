<script setup lang="ts">
import { useGlobalStore } from '@/stores/globalStore';
import { computed, ref, watch } from 'vue';
import { ItemStore } from '@/models/item/itemStore';
import * as fuzzySort from 'fuzzysort';
import { Item } from '@/models/item/item';
import KeysResults = Fuzzysort.KeysResults;
import KeysResult = Fuzzysort.KeysResult;
import type { ComputedRef } from '@vue/reactivity';
import _, { debounce } from 'lodash';
import { watchDebounced } from '@vueuse/core';

const store = useGlobalStore();

const data = computed(() => {
  return Object.values(ItemStore.items)
    .filter(item => !item.duplicated || item.noted)
    .sort();
});

const fuzzySearchKeys = [
  'name',
];
const filter = ref();

type HighlightResult = Array<{match: string} | string>;
type SearchResultElement = (KeysResult<Item> | {obj: Item}) & {highlightedName: HighlightResult}

const highlight = (result: KeysResult<Item>, key: string): HighlightResult => {
  const highlightResult  = result[fuzzySearchKeys.indexOf(key)]
    .highlight((m: string, _i: number) => ({ match: m }));

  if (highlightResult.length > 0)
    return highlightResult;
  return [_.get(result.obj, key)];
};

const filteredData = ref();


watchDebounced((filter), () => {
  let result: Array<SearchResultElement> = fuzzySort.go(
    filter.value,
    data.value,
    { keys: fuzzySearchKeys, all: true, limit: 100 }
  ).map(result => ({
    ...result,
    highlightedName: highlight(result, 'name')
  }));
  let filterAsId = +filter.value;
  let itemSameId = data.value.find(i => i.id === filterAsId);
  if (itemSameId) {
    result.unshift({
      obj: itemSameId,
      highlightedName: [itemSameId.name]
    });
  }
  filteredData.value = result;
}, { debounce: 300 });


const op = ref();
const input = ref();
const width = ref();
const togglePopup = (event: FocusEvent) => {
  width.value = input.value.$el.offsetWidth;
  op.value.toggle(event);
};
</script>

<template>
  <div class="select">
    <InputText
        ref="input"
        class="search"
        v-model="filter"
        type="text"
        @focus="togglePopup"
    />
    <Popover ref="op" unstyled="false" :style="{ width: width + 'px' }">
      <div v-if="filteredData" class="list">
        <div
            v-for="(matchedResults, index) in filteredData"
            :key="index"
            class="item"
        >
          <img :src="matchedResults.obj.imageUrl"  :alt="matchedResults.obj.name"/>
          <div class="name">
            <template v-for="(result, index) in matchedResults.highlightedName" :key="index">
              <span v-if="typeof result === 'string'">{{result}}</span>
              <span v-else class="highlight-match">{{result.match}}</span>
            </template>
          </div>
          <span v-if="matchedResults.obj.id.toString() === filter" class="highlight-match">{{ matchedResults.obj.id }}</span>
        </div>
      </div>
    </Popover>
  </div>
</template>

<style scoped>
.select {
  position: relative;
  display: flex;
  flex-direction: column;
}
.list {
  background-color: #18181b;
  display: flex;
  flex-direction: column;
  padding: 0.2rem;
  border-radius: 5px;
  margin-top: 0.3em;
  border: 1px solid #3f3f46;
  max-height: 15em;
  overflow-y: auto;

  .item {
    border-radius: 5px;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.5em;
    padding: 0.2em 1em;

    &:hover {
      background-color: #27272a;
      cursor: pointer;
    }
  }
}
</style>