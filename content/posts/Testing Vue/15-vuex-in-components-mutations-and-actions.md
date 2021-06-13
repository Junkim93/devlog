---
title: "(번역) Vue 테스트 코드 작성: 컴포넌트 내에 있는 Vuex - 뮤테이션과 액션"
date: "2019-12-30T14:32:14.644Z"
template: "post"
draft: false
slug: "testingvue15"
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



## 뮤테이션과 액션

---

이전 가이드에서는 `$store.state`와 `$store.getters`를 사용해서 컴포넌트를 테스트하는 일에 관해 얘기해 보았습니다. 양쪽 다 컴포넌트에 현재 상태(state)를 제공합니다. 컴포넌트가 올바르게 뮤테이션(mutation)을 커밋(commit) 하거나 액션(action)을 디스패치(dispatch) 하는지 어설트(assert) 할 때, 정말로 원하는 것은 `$store.commit`과 `$store.dispatch`가 올바른 핸들러(호출 할 뮤테이션이나 액션)과 페이로드(payload)로 호출되는지 어설트 하는 것입니다.

이렇게 하기 위한 두 가지 방법이 있습니다. 첫 번째 방법은 `createLocalVue`로 진짜 Vuex 스토어(store)를 사용하는 것이고, 또 다른 방법은 mock 스토어를 사용하는 것입니다. 두 테크닉 모두 [여기](https://lmiller1990.github.io/vue-testing-handbook/vuex-in-components.html)에 설명되어 있습니다. 이 두 테크닉을 뮤테이션과 액션의 맥락에서 다시 보겠습니다.

이 페이지에서 설명한 테스트의 소스 코드는 [여기](https://github.com/lmiller1990/vue-testing-handbook/blob/master/demo-app/tests/unit/ComponentWithButtons.spec.js)서 찾을 수 있습니다.



## 컴포넌트 생성하기

---

이 예제를 위해서, `<ComponentWithButtons>` 컴포넌트를 테스트하겠습니다.

``` html
<template>
	<div>
    <button
			class="commit"
			@click="handleCommit">
      Commit
    </button>

    <button
			class="dispatch"
			@click="handleDispatch">
      Dispatch
    </button>

		<button
			class="namespaced-dispatch"
			@click="handleNamespacedDispatch">
      Namespaced Dispatch
    </button>
  </div>
</template>

<script>
	export default {
    name: "ComponentWithButtons",

    methods: {
      handleCommit() {
        this.$store.commit("testMutation", { msg: "Test Commit" })
      },

      handleDispatch() {
        this.$store.dispatch("testAction", { msg: "Test Dispatch" })
      },

      handleNamespacedDispatch() {
        this.$store.dispatch("namespaced/very/deeply/testAction", { msg: "Test Namespaced Dispatch" })
      }
    }
  }
</script>
```



## 실제 Vuex 스토어로 테스트하기

---

먼저 뮤테이션을 위한 테스트로 `ComponentWithButtons.spec.js`를 작성해보겠습니다. 아래에 있는 두 가지 내용을 확인하길 원한다는 사실을 기억하세요.

1. 정확한 뮤테이션을 커밋했는지?
2. 페이로드가 정확했는지?

전역 Vue 인스턴스(instance)를 오염시키는 일을 피하고자 `createLocalVue`를 사용하겠습니다.

``` js
import Vuex from "vuex"
import { createLocalVuem, shallowMount } from "@vue/test-utils"
import ComponentWithButtons from "@/components/ComponentWithButtons.vue"

const localVue = createLocalVue()
localVue.use(Vuex)

const mutations = {
  testMutation: jest.fn()
}

const store = new Vuex.Store({ mutations })

describe("ComponentWithButtons", () => {

  it("버튼을 클릭했을 때 뮤테이션을 커밋한다", async () => {
    const wrapper = shallowMount(ComponentWithButtons, {
      store, localVue
    })

    wrapper.find(".commit").trigger("click")
    await wrapper.vm.$nextTick()

    expect(mutations.testMutation).toHaveBeenCalledWith(
    	{},
      { msg: "Test Commit" }
    )
  })

})
```

테스트에 `await`을 표시하고 `nextTick`을 호출한 것을 주목하세요. 그 이유에 대한 자세한 설명은 [여기](https://lmiller1990.github.io/vue-testing-handbook/simulating-user-input.html#writing-the-test)에서 볼 수 있습니다.

어떤 흥미로운 일이 일어나고 있지는 않지만, 위 테스트에는 꽤 많은 코드가 있습니다. `localVue`를 생성하고 Vuex를 사용하겠습니다. 그러고 나서스토어를 생성하고 `testMutation`에 Jest mock 함수 (`jest.fn()`)를 넘기겠습니다. Vuex 뮤테이션은 항상 두 개의 인자와 함께 호출됩니다. 첫 번째 인자는 현재의 상태고, 두 번째 인자는 페이로드입니다. 스토어를 위한 어떤 상태도 명시하지 않았기 때문에, 빈 객체와 함께 호출될 것이라고 예상할 수 있습니다. 두 번째 인자는 `{ msg: "Test Commit" }`가 예상되고, 컴포넌트 내에서 하드코딩 됩니다.

이 테스트를 작성하는 데 있어서 많은 보일러플레이트(boilerplate) 코드가 있습니다만, 컴포넌트가 정확하게 행동하고 있는지 검증하는데 유효한 방법입니다. 더 적은 코드를 요구하는 또 다른 대안은 mock 스토어를 사용하는 것입니다. `testAction`이 디스패치 됐는지 어설트 하는 테스트를 작성하면서 그 방법에 대해 알아보겠습니다.



## mock 스토어를 사용해서 테스트하기

---

코드를 보고 나서, 이전 테스트와 비교하고 대조해보겠습니다. 아래의 두 가지 내용을 검증하고 싶다는 것을 기억해주세요.

1. 정확한 액션이 디스패치 됐다
2. 페이로드가 정확하다

``` js
it("버튼을 클릭했을 때 액션을 디스패치 한다", async () => {
  const mockStore = { dispatch: jest.fn() }
  const wrapper = shallowMount(ComponentWithButtons, {
    mocks: {
      $store: mockStore
    }
  })

  wrapper.find(".dispatch").trigger("click")
  await wrapper.vm.$nextTick()

  expect(mockStore.dispatch).toHaveBeenCalledWith(
  	"testAction", { msg: "Test Dispatch" })
})
```

이 테스트는 이전 예제보다 조금 더 간결합니다. `localVue`도 없고, `Vuex`도 없습니다. 이전에 `testMutation = jest.fn()`이라고 정의했던 함수를 모킹(mocking)하는 대신에, 실제로 `dispatch` 함수를 스스로 mock 합니다. `$store.dispatch`는 단지 일반적인 자바스크립트 함수이기 때문에, 이렇게 하는게 가능합니다. 그러고 나서 첫 번째 인자인 `testAction`이 올바른 액션 핸들러인지, 두 번째 인자인 페이로드가 정확한지 어설트 합니다. 액션이 실제로 어떤 일을 하는지는 신경 쓰지 않습니다. 이 부분은 별개로 테스트할 수 있습니다. 이 테스트의 목표는 간단하게 버튼을 클릭했을 때 페이로드와 함께 정확한 액션을 디스패치 하는지 확인하는 것입니다.

실제 스토어나 mock 스토어를 사용할지 말지는 테스트를 작성하는 여러분의 개인적인 선호에 달려있습니다. 양쪽 다 옳은 방법입니다. 중요한 것은 여러분의 컴포넌트를 테스트하고 있다는 점입니다.



## Namespaced 액션(또는 뮤테이션) 테스트하기

---

세 번째이자 마지막 예제는 또 다른 방법을 보여줍니다. 액션이 올바른 인자와 함께 디스패치 됐거나 뮤테이션이 커밋됐는지 테스트하는 방법입니다. 이 방법은 위에서 얘기한 두 개의 테크닉(실제 `Vuex` 스토어, 그리고 mock된  `dispatch` 메서드)를 결합한 방법입니다.

``` js
it("버튼을 클릭했을 때 namespaced 액션을 디스패치한다", async () => {
  const store = new Vuex.Store()
  store.dispatch = jest.fn()

  const wrapper = shallowMount(ComponentWithButtons, {
    store. localVue
  })

  wrapper.find(".namespaced-dispatch").trigger("click")
	await wrapper.vm.$nextTick()

  expect(store.dispatch).toHaveBeenCalledWith(
  	'namespaced/very/deeply/testAction',
  	{ msg: "Test Namespaced Dispatch" }
  )
})
```

관심이 있는 모듈로 Vuex 스토어를 생성하면서 시작합니다. 테스트 내부에 `namespacedModule`이라는 모듈을 선언합니다. 하지만 실제 앱에서는 컴포넌트에서 의존하고 있는 모듈을 추출하면 됩니다. 그러고 나서 `dispatch` 메서드를 `jest.fn` mock으로 대체하고 이것에 대한 어설션을 만듭니다.



## 결론

---

이 섹션에서 다룬 내용은 아래와 같습니다.

1. `localVue`로 Vuex를 사용하고 뮤테이션 모킹하기
2. Vuex API (`dispatch`와 `commit`)을 모킹하기
3. mock `dispatch` 함수로 실제 Vuex 스토어 사용하기

이 페이지에서 설명한 테스트의 소스코드는 [여기](https://github.com/lmiller1990/vue-testing-handbook/tree/master/demo-app/tests/unit/ComponentWithButtons.spec.js)에서 찾을 수 있습니다.