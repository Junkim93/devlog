---
title: "(번역) Vue Testing: 컴포넌트 stubbing"
date: "2019-12-10T09:31:02.695Z"
template: "post"
draft: false
slug: "/posts/testingvue08"
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



## 왜 stub일까요?

---

유닛 테스트를 작성할때, 종종 관심사가 아닌 코드의 일부를 stub 하기를 원합니다. stub은 단순히 다른 것을 나타내는 코드의 한 조각입니다. `<UserContainer>`를 위한 테스트를 작성한다고 해봅시다. 아래와 같은 모습을 가졌습니다.

``` html
<UserContainer>
	<UsersDisplay />
</UserContainer>
```

`<UserDisplay>`는 아래와 같이 `created` 라이프사이클에 메서드를 가집니다.

``` js
created() {
  axios.get("/users")
}
```

`<UserDisplay>`를 렌더하는지 어설트(assert) 하는 테스트를 작성하고 싶습니다.

`axios`는 `created` 훅에서 외부 서비스에 ajax 요청을 합니다. 여러분이 `mount(UserContainer)`를 할 때, `<UserDisplay>`도 마운트되고, `created`는 ajax 요청을 초기화 합니다. 유닛 테스트기 때문에, 우리는 `<UserContainer>`가 올바르게 `<UserDisplay>`를 랜더하는지 아닌지에만 관심이 있습니다. ajax 요청이 올바른 엔드포인트(endpoint) 등으로 연결되었는지를 확인하는 일은 `<UsersDisplay>`의 책임이고, `<UsersDisplay>`의 테스트 파일에서 테스트해야 합니다.

`<UserDisplay>`가 ajax 요청을 초기화하는 일을 막는 한 가지 방법은 컴포넌트 밖으로 스터빙(stubbing) 하는 것입니다. 스텁(stubs)을 사용하는 이점과 다양한 방법들을 더 잘 이해하기 위해서, 컴포넌트를 작성하고 테스트 해보겠습니다.



## 컴포넌트 만들기

---

이 예제는 두 개의 컴포넌트를 사용할 예정입니다. 첫 번째 컴포넌트는 `ParentWithAPICallChild` 입니다. 이 컴포넌트는 간단하게 또 다른 컴포넌트를 렌더합니다.

``` html
<template>
	<ComponentWithAsyncCall />
</template>

<script>
import ComponentWithAsyncCall from "./ComponentWithAsyncCall.vue"
  
export default {
  name: "ParentWithAPICallChild",
  
  components: {
    ComponentWithAsyncCall
  }
}
</script>
```

`<ParentWithAPICallChild>`는 간단한 컴포넌트입니다. 이 컴포넌트의 유일한 책임은 `<ComponentWithAsyncCall>`를 렌더하는 일입니다.  `<ComponentWithAsyncCall>`은 이름처럼,  `axios` http 클라이언트를 사용한 ajax 호출을 수행합니다.

``` html
<template>
	<div></div>
</template>

<script>
import axios from "axios"
 
export default {
  name: "ComponentWithAsyncCall",
  
  created() {
    this.makeApiCall()
  },
  
  methods: {
    async makeApiCall() {
      console.log("Making api call")
      await axios.get("https://jsonplaceholder.typicode.com/posts/1")
    }
  }
}
</script>
```

`<ComponentWithAsyncCall>`은 `created` 라이프사이클 훅에 있는  `makeApiCall`을 호출합니다.



## `mount`를 사용해서 테스트 작성하기

---

`<ComponentWithAsyncCall>`이 렌더됐는지 확인하기 위한 테스트를 작성하겠습니다.

``` js
import { shallowMount, mount } from '@vue/test-utils'
import ParentWithAPICallChild from '@/components/ParentWithAPICallChild.vue'
import ComponentWithAsyncCall from '@/components/ComponentWithAsyncCall.vue'

describe('ParentWithAPICallChild.vue', () => {
  it('마운트로 렌더하고 API 호출을 초기화합니다.', () => {
    const wrapper = mount(ParentWithAPICallChild)
    
    expect(wrapper.find(ComponentWithAsyncCall).exists()).toBe(true)
  })
})
```

`yarn test:unit`을 실행하겠습니다.

```
PASS  tests/unit/ParentWithAPICallChild.spec.js

console.log src/components/ComponentWithAsyncCall.vue:17
  Making api call
```

테스트가 통과했습니다. 멋집니다! 하지만 더 좋게 만들 수 있습니다. 테스트 결과에서 console.log 알림이 나옵니다. 이 메세지는 `makeApiCall` 메서드에서 호출됩니다. 이상적으로 유닛 테스트에서 외부 서비스에 호출 하기를 원하지는 않습니다. 특히 현재 테스트의 주요 관심사가 아닌 컴포넌트일 때 말이죠. 우리는 [여기](https://vue-test-utils.vuejs.org/api/options.html#stubs) `vue-test-utils` 문서에 설명된 `stubs` 마운팅 옵션을 사용할 수 있습니다.



## `<ComponentWithAsyncCall>`을 스텁하기 위해 `stubs` 사용하기

---

테스트를 업데이트 하겠습니다. 이번에는 `ComponentWithAsyncCall`을 스터빙 하겠습니다.

``` js
it('마운트로 렌더하고 API 호출을 초기화합니다.', () => {
	const wrapper = mount(ParentWithAPICallChild, {
    stubs: {
      ComponentWithAsyncCall: true
    }
  })
  
  expect(wrapper.find(ComponentWithAsyncCall).exists()).toBe(true)
})
```

`yarn test:unit`을 실행할 때 테스트는 여전히 통과하지만, `console.log`는 어디에서도 볼 수 없습니다. `stubs`에서 `[component]: true`를 넘겨서 stub으로 기존 컴포넌트를 대체했기 때문입니다. 외부 인터페이스는 여전히 같습니다. (여전히 `find`를 이용해서 선택할 수 있습니다. 왜냐하면  `find`에 의해 내부적으로 사용되는 `name` 프로퍼티는 여전히 같기 때문입니다) `makeApiCall`같은 내부 메서드는 어떤 일도 하지 않는 더미 메서드로 대체됩니다. 내부 메서드는 '없어졌습니다(stubbed out)'.

원한다면 스텁을 사용해서 마크업을 지정할 수도 있습니다.

```js
const wrapper = mount(ParentWithAPICallChild, {
  stubs: {
    ComponentWithAsyncCall: "<div class='stub'></div>"
  }
})
```



## `shallowMount`로 자동으로 스터빙

---

`mount`를 사용하는 대신에 수동으로 `<ComponentWithAsyncCall>`을 스터빙 하려면, 간단하게 `shallowMount`를 사용할 수 있습니다. `shallowMount`는 디폴트로 다른 컴포넌트를 자동으로 스텁합니다. `shallowMount`를 사용한 테스트는 아래와 같습니다.

``` js
it('shallowMount로 렌더하고 API 호출을 초기화하지 않습니다.', () => {
  const wrapper = shallowMount(ParentWithAPICallChild)
  
  expect(wrapper.find(ComponentWithAsyncCall).exists()).toBe(true)
})
```

`yarn test:unit`을 실행하면 어떤 `console.log`도 보이지 않고 테스트가 통과합니다. `shallowMount`는 자동으로 `<ComponentWithAsyncCall>`을 스텁합니다. `shallowMount`는 `created`나 `mounted` 등과 같은 라이프사이클 훅에 연결된 동작을 가진 자식 컴포넌트를 많이 가진 컴포넌트를 테스트할 때 유용합니다. 저는  `mount`를 사용할 좋은 이유가 없다면, 디폴트로 `shallowMount`를 사용하는 경향이 있습니다. 무엇을 사용할지는 여러분이 어떤 경우에 사용하고, 어떤 것을 테스트하는지에 달려있습니다.



## 결론

---

- `stubs`는 현재 유닛 테스트와 관련 없는 자식의 행동을 스터빙 할 때 유용합니다.
- `shallowMount`는 디폴트로 자식 컴포넌트를 스텁합니다.
- 기본 스텁을 만들기 위해 `true`를 넘기거나 여러분이 작성한 커스텀 구현체를 넘길 수 있습니다.

이 페이지에서 설명한 테스트는 [여기](https://github.com/lmiller1990/vue-testing-handbook/blob/master/demo-app/tests/unit/ParentWithAPICallChild.spec.js)서 찾을 수 있습니다.