---
title: "(번역) Vue 테스트 코드 작성: Computed 프로퍼티"
date: "2019-11-20T12:06:54.551Z"
template: "post"
draft: false
slug: "/posts/testingvue04"
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



## Computed 프로퍼티 테스트하기

------

이 페이지에서 설명한 테스트는 [여기](https://github.com/lmiller1990/vue-testing-handbook/tree/master/demo-app/tests/unit/NumberRenderer.spec.js)서 찾을 수 있습니다.

computed 프로퍼티를 테스트 하는 일은 더 간단합니다. 기존의 순수 자바스크립트 함수와 같기 때문입니다.

`computed`  프로퍼티를 테스트 하는 두 가지 방법을 살펴보겠습니다. 먼저 `<NumberRender>`라는 컴포넌트를 만들겠습니다. 해당 컴포넌트는 `numbers`라는 computed 프로퍼티를 바탕으로 홀수나 짝수를 렌더합니다.



## 테스트 작성하기

------

`<NumberRender>` 컴포넌트는 `even` prop을 받습니다. 이 prop은 불리언(boolean) 자료형 입니다. `even`이 `true`면, 컴포넌트는 2, 4, 6, 8을 렌더하고, `false`인 경우 1, 3, 5, 7, 9를 렌더합니다. 해당 값의 목록은 `numbers`라는 이름을 가진 `computed` 프로퍼티에서 계산합니다.



## 값을 렌더해서 테스트하기

---

테스트는 아래와 같습니다.

```javascript
import { shallowMount } from "@vue/test-utils"
import NumberRenderer from "@/components/NumberRenderer.vue"

describe("NumberRenderer", () => {
  it("renders even numbers", () => {
    const wrapper = shallowMount(NumberRenderer, {
      propsData: {
        even: true
      }
    })
    
    expect(wrapper.text()).toBe("2, 4, 6, 8")
  })
})
```

테스트를 실행하기 전에 `<NumberRenderer>`를 설정하겠습니다.

```js
<template>
	<div>
  </div>
</template>

<script>
	export default {
    name: "NumberRenderer",
    
    props: {
      even: {
        type: Boolean,
        required: true
      }
    }
  }
</script>
```

이제 개발을 시작하고, 오류 메세지가 구현을 안내해주도록 하겠습니다. `yarn test:unit`은 아래 내용을 산출합니다.

```
● NumberRenderer › renders even numbers

  expect(received).toBe(expected) // Object.is equality

  Expected: "2, 4, 6, 8"
  Received: ""
```

작성한 모든 코드가 올바르게 연결된 것 처럼 보입니다. `numbers`를 아래와 같이 구현하겠습니다.

```javascript
computed: {
	numbers() {
    const evens = []
    
    for (let i = 1; i < 10; i++) {
      if (i % 2 === 0) {
        evens.push(i)
      }
    }
    
    return evens
  }
}
```

그리고 새로운 computed 프로퍼티를 사용하기 위해서 템플릿을 업데이트 합니다.

```js
<template>
  <div>
    {{ numbers }}
  </div>
</template>
```

이제 `yarn test:unit`은 아래의 결과를 산출합니다.

```
FAIL  tests/unit/NumberRenderer.spec.js
● NumberRenderer › renders even numbers

  expect(received).toBe(expected) // Object.is equality

  Expected: "2, 4, 6, 8"
  Received: "[
    2,
    4,
    6,
    8
  ]"
```

숫자 값은 올바르지만, 형식이 잘 갖추어진 목록을 렌더하고 싶습니다. `return` 값을 업데이트 해보겠습니다.

```js
return evens.join(", ")
```

이제 `yarn test:unit`을 실행하면 테스트를 통과합니다!



## `call`로 테스트하기

---

이제 `even: false`인 경우의 테스트를 추가 해보겠습니다. 이번에는 컴포넌트를 실제로 렌더링 하지 않고, computed 프로퍼티를 테스트 하는 다른 방법을 알아보겠습니다.

테스트의 시작은 아래와 같습니다.

```js
it("renders odd numbers", () => {
	const localThis = { even: false }
	
	expect(NumberRenderer.computed.numbers.call(localThis)).toBe("1, 3, 5, 7, 9")
})
```

컴포넌트를 렌더하고 `wrapper.text()`에 어설션(assertion) 하는 대신에, `call`을 사용하고 있습니다. call은  `numbers`에 대체할 `this` 컨텍스트를 제공합니다. 통과하는 테스트를 얻은 후에, `call`을 사용하지 않으면 어떤 일이 일어나는지 살펴보겠습니다.

현재 테스트를 실행하면 아래의 결과를 산출합니다.

```
FAIL  tests/unit/NumberRenderer.spec.js
● NumberRenderer › renders odd numbers

  expect(received).toBe(expected) // Object.is equality

  Expected: "1, 3, 5, 7, 9"
  Received: "2, 4, 6, 8"
```

`numbers`를 업데이트 합니다.

```js
numbers() {
	const evens = []
	const odds = []
	
	for (let i = 1; i < 10; i++) {
		if (i % 2 === 0) {
			evens.push(i)
		} else {
			odds.push(i)
		}
	}
	
	return this.even === true ? evens.join(", ") : odds.join(", ")
}
```

이제 두 개의 테스트 모두 통과합니다. 그런데 두 번째 테스트에서 `call`을 사용하지 않았다면 어떻게 됐을까요? 아래와 같이 두 번째 테스트를 업데이트 해보겠습니다.

```js
it("renders odd numbers", () => {
	const localThis = { even: false }
	
	expect(NumberRenderer.computed.numbers()).toBe("1, 3, 5, 7, 9")
})
```

이제 테스트는 실패합니다.

```
FAIL  tests/unit/NumberRenderer.spec.js
● NumberRenderer › renders odd numbers

  expect(received).toBe(expected) // Object.is equality

  Expected: "1, 3, 5, 7, 9"
  Received: "2, 4, 6, 8"
```

`vue`는 자동으로 `this`에 `props`를 바인드(bind)합니다. `mount`로 컴포넌트를 렌더하지 않아서, Vue는 `this`에 어떤 것도 바인드 하지 않습니다. `console.log(this)`를 실행해보면, 컨텍스트가 `computed` 객체인 것을 간단하게 알 수 있습니다.

```
{ numbers: [Function: numbers] }
```

그래서 `call`을 사용하는 것이 필요합니다. call은 대체할 수 있는 `this` 객체를 바인드 해줍니다. 이 경우에는 `even` 프로퍼티에 해당합니다.



## `call` 과 `shallowMount` 어떤 것을 선택해야 할까요?

---

위에서 설명한 두 테크닉 모두 computed 프로퍼티를 테스트하는데 용이합니다. Call은 아래와 같은 경우에 유용합니다.

- 라이프사이클 메서드에서 시간이 많이 소요되는 작업을 수행하는 컴포넌트를 테스트해서, computed 유닛 테스트를 별도로 실행하고 싶을 때 유용합니다.
- 몇 가지 값을 `this`에 고정하고 싶으면 `call`을 사용해서 커스텀 컨텍스트를 넘겨주는 게 유용합니다

물론 값이 정확하게 렌더 된다고 확신할 수 있기를 원할 것입니다. 그래서 computed 프로퍼티를 테스트 할때 올바른 기술을 선택해야 합니다. 그리고 모든 엣지 케이스를 테스트하세요.



## Conclusion

------

- computed 프로퍼티는 렌더된 마크업에 `shallowMount`를 사용해서 어설션 할 수 있습니다.
- 복잡한 computed 프로퍼티는 `call`을 사용해서 독립적으로 테스트 할 수 있습니다





















