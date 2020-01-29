---
title: "(번역) Vue 테스트 코드 작성: 컴포넌트 내에 있는 Vuex - $state와 getters"
date: "2019-12-19T14:25:06.166Z"
template: "post"
draft: false
slug: "/posts/testingvue14"
category: "Vue.js"
tags:
  - "Vue.js"
  - "Testing"
description: "Vue testing handbook의 내용을 번역한 글입니다 📖"
---

> [Vue testing handbook](https://lmiller1990.github.io/vue-testing-handbook/computed-properties.html#testing-computed-properties) <br>
> 이 글은 원작자의 허락하에 Vue testing handbook의 일부를 번역한 글입니다. <br>
> 번역문에 대한 좋은 의견이 있으면 말씀해주세요. <br>
> 감사합니다.



## 컴포넌트 내에 있는 Vuex 테스트

---

이 페이지에서 설명한 테스트의 소스 코드는 [여기](https://github.com/lmiller1990/vue-testing-handbook/blob/master/demo-app/tests/unit/ComponentWithVuex.spec.js)서 찾을 수 있습니다.



## `createLocalVue`를 사용해서 `$store.state` 테스트하기

---

일반적인 Vue app에서는 `Vue.use(Vuex)`를 사용해서 Vuex를 설치합니다. 그러고나서 app에 새로운 Vuex 스토어(store)를 넘깁니다. 유닛 테스트에서 같은 행위를 한다면, 모든 유닛 테스트는 Vuex 스토어를 받을 것입니다. 심지어 스토어를 사용하지 않는 테스트도요. `vue-test-utils`는 `createLocalVue` 메서드를 제공하고, 이 메서드는 테스트 기준으로 사용할 임시 `Vue` 인스턴스를 제공합니다. 어떻게 사용하는지 알아보겠습니다. 먼저 스토어의 기본 상태(state)에서 username을 렌더하는 간단한 `<ComponentWithGetter>` 컴포넌트입니다.

``` html
<template>
	<div>
    <div class="username">
      {{ username }}
    </div>
  </div>
</template>

<script>
export default {
  name: "ComponentWithVuex",
  
  data() {
    return {
      username: this.$store.state.username
    }
  }
}
</script>
```

임시의 Vue 인스턴스를 생성하기 위해서 `createLocalVue`를 사용하고 Vuex를 설치할 수 있습니다. 그러고나서 간단하게 컴포넌트의 마운팅 옵션에 새로운 `스토어`를 넘깁니다. 전체 테스트는 아래와 같습니다.

``` js
import Vuex from "vuex"
import { shallowMount, createLocalVue } from "@vue/test-utils"
import ComponentWithVuex from "@/components/ComponentWithVuex.vue"

const localVue = createLocalVue()
localVue.use(Vuex)

const store = new Vuex.Store({
  state: {
    username: "alice"
  }
})

describe("ComponentWithVuex", () => {
  it("실제 Vuex 스토어를 사용해서 username을 렌더한다", () => {
    const wrapper = shallowMount(ComponentWithVuex, {
      store,
      localVue
    })
    
    expect(wrapper.find(".username").text()).toBe("alice")
  })
})
```

테스트가 통과합니다. 새로운 `localVue`를 만드는 것은 약간의 보일러플레이트를 생산하고 테스트가 꽤 길어집니다. Vuex 스토어를 사용하는 컴포넌트가 많다면, `mocks` 마운팅 옵션을 사용하는 것이 대안이 될 수 있습니다. 간단하게 스토어를 mock 하세요.



## mock 스토어 사용하기

---

`mocks` 마운팅 옵션을 사용하면 전역 `$store` 객체를 mock 할 수 있습니다.  `createLocalVue`를 사용하거나 새로운 Vuex 스토어를 만들 필요가 없음을 의미합니다. 이 테크닉을 사용해서 위에 있는 테스트를 아래와 같이 다시 써보겠습니다.

``` js
it("mock 스토어를 사용하여 username을 렌더한다", () => {
  const wrapper = shallowMount(ComponentWithVuex, {
    mocks: {
      $store: {
        state: { username: "alice" }
      }
    }
  })
  
  expect(wrapper.find(".username").text()).toBe("alice")
})
```

개인적으로 이 접근법을 선호합니다. 필요한 모든 데이터는 테스트 안에 선언돼있고, 좀 더 간단한 형태입니다. 양쪽 테크닉 모두 유용해서  어떤 것이 더 낫거나 나쁘다고 할 수는 없습니다.



## `getters` 테스트

---

위 예제의 테크닉을 사용해서 `getters`도 쉽게 테스트 할 수 있습니다. 먼저 테스트 할 컴포넌트 입니다.

``` html
<template>
	<div class="fullname">
    {{ fullname }}
  </div>
</template>

<script>
export default {
  name: "ComponentWithGetters",
  
  computed: {
    fullname() {
      return this.$store.getters.fullname
    }
  }
}
</script>
```

컴포넌트가 user의 `fullname`을 올바르게 렌더했는지 어설트(assert) 하기를 원합니다. 이 테스트를 위해, `fullname`이 어디서 오는지는 신경쓰지 않겠습니다. 단지 컴포넌트를 렌더한 결과가 올바른지만 확인할 것입니다.

먼저 실제 Vuex 스토어와 `createLocalVue`를 사용한 테스트는 아래와 같습니다.

```js
const localVue = createLocalVue()
localVue.use(Vuex)

const store = new Vuex.Store({
  state: {
    firstName: "Alice",
    lastName: "Doe"
  },
  
  getters: {
    fullname: (state) => state.firstName + " " + state,lastName
  }
})

it("실제 Vuex getter를 사용해서 username를 렌더한다", () => {
  const wrapper = shallowMount(ComponentWithGetters, { store, localVue })
  
  expect(wrapper.find(".fullname").text()).toBe("Alice Doe")
})
```

테스트가 매우 간단합니다. 단지 두 줄의 코드뿐입니다. 연관된 설정이 많긴 하지만, 기본적으로 Vuex 스토어를 다시 구축 하는 것입니다. 이 방법의 대안은 실제 Vuex 스토어를 실제 게터와 같이 import 하는 것입니다. 이 방법은 테스트에 대한 또 다른 의존을 불러 일으킵니다. 그리고 큰 시스템을 개발할 때, Vuex 스토어를 다른 개발자가 구현하고 있거나. 아직 구현되지 않았을 수도 있습니다.

`mocks` 마운팅 옵션을 사용해서 테스트를 작성하는 방법을 알아보겠습니다.

```js
it("computed 마운팅 옵션을 사용해서 username을 렌더한다", () => {
  const wrapper = shallowMount(ComponentWithGetters, {
    mocks: {
      $store: {
        getters: {
          fullname: "Alice Doe"
        }
      }
    }
  })

  expect(wrapper.find(".fullname").text()).toBe("Alice Doe")
})
```

이제 필요한 모든 데이터가 테스트에 포함되어 있습니다. 훌륭합니다! 저는 이렇게 하는 방식을 정말 선호합니다. 테스트가 모든 것을 포함하고 있고, 컴포넌트가 어떤 것을 해야하는지를 이해하기 위해 필요한 모든 지식도 테스트에 포함되어 있기 때문입니다.

`computed` 마운팅 옵션을 사용하면, 테스트를 좀 더 명료하게 만들 수 있습니다.



## `computed`를 사용해서 게터 모킹하기

---

게터는 일반적으로 `computed` 프로퍼티에 감싸져 있습니다. 기억하세요. 이 테스트는 컴포넌트가 현재 스토어에 주어진 상태에서 정확하게 행동하는지 확인하는 것이 전부입니다. `fullname`의 구현체를 테스트하지 않습니다. 또는 `게터`가 작동하는지 보려는 것이 아닙니다. 이 말은 `computed` 마운팅 옵션을 사용해서 간단하게 실제 스토어나 mock 스토어로 대체할 수 있음을 의미합니다. 테스트는 아래와 같이 다시 쓸 수 있습니다.

``` js
it("computed 마운팅 옵션을 사용해서 username 렌더한다", () => {
  const wrapper = shallowMount(ComponentWithGetters, {
    computed: {
      fullname: () => "Alice Doe"
    }
  })
  
  expect(wrapper.find(".fullname").text()).toBe("Alice Doe")
})
```

이전의 두 개의 테스트 보다 좀 더 간결하고, 아직 컴포넌트의 의도를 잘 표현하고 있습니다.



## `mapState`와 `mapGetters` 헬퍼

---

위 테크닉은 모두 Vuex의 `mapState`와 `mapGetters`가 결합해서 작동합니다. 아래와 같이 `ComponentWithGetters`를 업데이트 할 수 있습니다.

``` js
import { mapGetters } from "vuex"

export default {
  name: "ComponentWithGetters",
  
  computed: {
    ...mapGetters({
      'fullname'
    })
  }
}
```

테스트는 여전히 통과합니다.



## 결론

---

이 가이드는 아래와 같은 내용에 대해 얘기했습니다.

- `createLocalVue`와 실제 Vuex 스토어를 사용해서 `$store.state`와 `getters` 테스트하기
- `mocks` 마운팅 옵션을 사용해서 `$store.state`와 `getters` mock 하기
- `computed` 마운팅 옵션을 사용해서 원하는 Vuex getter의 값 설정하기

독립적으로 Vuex getters의 구현체를 테스트하기 위한 테크닉은 [이 가이드](https://lmiller1990.github.io/vue-testing-handbook/vuex-getters.html)에서 찾을 수 있습니다.

이 페이지에서 설명한 테스트의 소스 코드는 [여기](https://github.com/lmiller1990/vue-testing-handbook/blob/master/demo-app/tests/unit/ComponentWithVuex.spec.js)서 찾을 수 있습니다.