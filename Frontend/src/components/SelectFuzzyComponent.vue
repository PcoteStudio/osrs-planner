<script setup lang="ts">
import { useGlobalStore } from '@/stores/globalStore';
import { computed, ref } from 'vue';
import { ItemStore } from '@/models/item/itemStore';
import * as fuzzySort from 'fuzzysort';
import { Item } from '@/models/item/item';
import KeysResult = Fuzzysort.KeysResult;
import _ from 'lodash';
import { watchDebounced } from '@vueuse/core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const store = useGlobalStore();

type HighlightResult = Array<{match: string} | string>;
type SearchResultElement = (KeysResult<Item> | {obj: Item}) & {highlightedName: HighlightResult}

const filter = ref('');
const filteredData = ref();
const op = ref();
const input = ref();
const width = ref();
const selectedItem = ref();
const active = ref(false);

const data = computed(() => {
  return Object.values(ItemStore.items)
    .filter(item => !item.duplicated || item.noted)
    .sort();
});

const fuzzySearchKeys = [
  'name',
];
const highlight = (result: KeysResult<Item>, key: string): HighlightResult => {
  const highlightResult  = result[fuzzySearchKeys.indexOf(key)]
    .highlight((m: string, _i: number) => ({ match: m }));

  if (highlightResult.length > 0)
    return highlightResult;
  return [_.get(result.obj, key)];
};

watchDebounced((filter), () => {
  let result: Array<SearchResultElement> = fuzzySort.go(
    filter.value,
    data.value,
    { keys: fuzzySearchKeys, all: true, limit: 100 },
  ).map(result => ({
    ...result,
    highlightedName: highlight(result, 'name'),
  }));
  let filterAsId = +filter.value;
  let itemSameId = data.value.find(i => i.id === filterAsId);
  if (itemSameId) {
    result.unshift({
      obj: itemSameId,
      highlightedName: [itemSameId.name],
    });
  }
  filteredData.value = result;
}, { debounce: 300, immediate: true });

const togglePopup = (event?: FocusEvent) => {
  if (event?.type === 'focusin') {
    width.value = input.value.$el.offsetWidth;
    op.value.show(event);
  }
  else {
    op.value?.hide(event);
    active.value = false;
  }
};

const setSelectedItem = (item: Item) => {
  selectedItem.value = item;
  filter.value = item.name;
  togglePopup();
};

const setActive = () => {
  active.value = true;
  setTimeout(() => {
    input.value.$el.focus();
  }, 0);
};

const clearFilter = () => {
  filter.value = '';
  console.log(filter.value);
  setTimeout(() => {
    input.value.$el.focus();
  }, 0);
};
</script>

<template>
  <div class="select">
    <FloatLabel>
      <div :style="{display: active ? 'block' : 'none', position: 'relative' }">
        <InputText
            ref="input"
            class="search"
            v-model="filter"
            type="text"
            name="search-box"
            @focusin="togglePopup"
        />
      </div>
      <div v-if="!active"
           @click="setActive"
           class="search-placeholder p-inputtext cursor-pointer"
      >
        <img :src="selectedItem?.imageUrl"  :alt="selectedItem?.name"/>
        <span class="name">
          {{ selectedItem?.name }}
        </span>
      </div>
      <div v-if="active" class="clear" @click="clearFilter">
        <font-awesome-icon icon="x" class="label" />
      </div>
      <div v-else class="clear" @click="setActive">
        <font-awesome-icon icon="chevron-down" class="label" />
      </div>
      <label for="search-box">Item</label>
    </FloatLabel>
    <Popover ref="op" :unstyled="true" :style="{ width: width + 'px' }" >
      <div v-if="filteredData" class="list">
        <div
            v-for="(matchedResults, index) in filteredData"
            :key="index"
            class="item"
            @pointerdown.prevent
            @click="() => setSelectedItem(matchedResults.obj)"
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
        <div  v-if="filteredData.length === 0" class="item disabled">
          <font-awesome-icon icon="face-sad-cry" style="height: 20px" class="p-1"/>
          <span>No item found</span>
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

  .search {
    width: 100%;
  }
}

.clear {
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1em;
  color: #a1a1aa;

  .label:hover {
    color: white;
    cursor: pointer;
  }
}

.search-placeholder {
  height: 2.75em;
  display: flex;
  flex-direction: row;
  gap: 0.5em;
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
    
    &.disabled:hover {
      background-color: initial;
      cursor: initial;
      user-select: none;
    }

    &:hover {
      background-color: #27272a;
      cursor: pointer;
    }
  }
}
</style>