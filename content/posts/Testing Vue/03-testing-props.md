---
title: "(번역) Vue 테스트 코드 작성: Props 테스트하기"
date: "2019-11-19T12:13:46.137Z"
template: "post"
draft: false
slug: "/posts/testingvue03"
category: "Vue.js"
tags:
  - "Vue.js"
  - "Testing"
description: "Vue testing handbook의 내용을 번역한 글입니다 📖"
---

> [Vue testing handbook](https://lmiller1990.github.io/vue-testing-handbook/components-with-props.html#setting-props-with-propsdata) <br>
> 이 글은 원작자의 허락하에 Vue testing handbook의 일부를 번역한 글입니다. <br>
> 번역문에 대한 좋은 의견이 있으면 말씀해주세요. <br>
> 감사합니다.



## propsData로 props 설정하기

------

`propsData`는 `mount`와 `shallowMount` 양쪽 모두에서 사용할 수 있습니다. 보통 부모 컴포넌트에게 props를 받는 컴포넌트를 테스트할 때 사용합니다.

`propsData`는  `shallowMount`나 `mount`의 두 번째 인자로 넘겨집니다. 아래와 같은 형태를 가집니다.

```javascript
const wrapper = shallowMount(Foo, {
	propsData: {
		foo: 'bar'
	}
})
```



## 컴포넌트 생성하기

------

간단한 `<SubmitButton>` 컴포넌트를 만들어 보겠습니다. `msg`와 `isAdmin`이라는 두 개의 `props`를 가지고 있습니다. `isAdmin` prop의 값에 따라서, 이 컴포넌트는 `<span>` 태그에 두 가지 상태 중 하나를 가집니다.

- `Not Authorized` `isAdmin`이 false거나 prop으로 값이 넘어오지 않는 경우입니다
* `Admin Privileges` `isAdmin`이 true인 경우입니다

```js
<template>
  <div>
		<span v-if="isAdmin">Admin Privileges</span>
    <span v-else>Not Authorized</span>
    <button>
      {{ msg }}
	  </button>
  </div>
</template>

<script>
export default {
  name: "SubmitButton",
  
  props: {
    msg: {
    	type: String,
    	required: true
  	},
    isAdmin: {
      type: Boolean,
      default: false
    }
  }
}
</script>

```



## 첫 번째 테스트

------

유저에게 관리자 권한이 없는 경우의 메시지를 어설션(assertion) 하겠습니다.

```javascript
import { shallowMount } from '@vue/test-utils'
import SubmitButton from '@/components/SubmitButton.vue'

describe('SubmitButton.vue', () => {
	it("displays a non authorized message", () => {
		const msg = "submit"
		const wrapper = shallowMount(SubmitButton, {
			propsData: {
				msg: msg
			}
		})

		console.log(wrapper.html())

		expect(wrapper.find("span").text()).toBe("Not Authorized")
		expect(wrapper.find("button").text()).toBe("submit")
	})
})
```

`yarn test:unit`으로 테스트를 실행하겠습니다. 결과는 아래와 같습니다.

```
PASS  tests/unit/SubmitButton.spec.js
  SubmitButton.vue
    ✓ displays a non authorized message (15ms)
```

`console.log(wrapper.html())`의 결과는 아래와 같이 출력됩니다.

```html
<div>
  <span>Not Authorized</span>
  <button>
    submit
  </button>
</div>
```

`msg` prop이 처리되고, 마크업 결과가 정확하게 렌더된 것을 볼 수 있습니다.



## 두 번째 테스트

----

`isAdmin`이 true일 때 가능한 상태를 어설션 해보겠습니다.

```javascript
import { shallowMount } from '@vue/test-utils'
import SubmitButton from '@/components/SubmitButton.vue'

describe('SubmitButton.vue', () => {
  it('displays a admin privileges message', () => {
    const msg = "submit"
    const isAdmin = true
    const wrapper = shallowMount(SubmitButton, {
      propsData: {
        msg,
        isAdmin
      }
    })
    
    expect(wrapper.find("span").text()).toBe("Admin Privileges")
    expect(wrapper.find("button").text()).toBe("submit")
  })
})
```

`yarn test:unit`을 입력하고 테스트를 실행해보겠습니다. 아래의 결과를 확인해주세요.

```
PASS  tests/unit/SubmitButton.spec.js
  SubmitButton.vue
    ✓ displays a admin privileges message (4ms)
```

`console.log(wrapper.html())`를 가지고도 마크업을 출력할 수 있습니다.

```html
<div>
  <span>Admin Privileges</span>
  <button>
    submit
  </button>
</div>
```

`isAdmin` prop이 올바른 `<span>` 엘리먼트를 렌더하는데 사용된 것을 볼 수 있습니다.



## 테스트 리팩토링하기

---

"Dont't Repeat Yourself"(DRY) 원칙을 지키기 위해서 테스트를 고쳐보겠습니다. 모든 테스트가 통과하고 있기 때문에, 자신감 있게 테스트를 고칠 수 있습니다. 테스트를 수정한 후에 테스트가 여전히 통과하기만 하면, 어떤 것도 깨지지 않았다고 확신할 수 있습니다.



## 팩토리 함수로 리팩토링 하기

---

이전에 수행한 두 테스트 모두 `shallowMount`를 호출하고 유사한 `propsData` 객체를 넘겼습니다. 팩토리 함수를 이용해서 이 부분을 리팩토링 할 수 있습니다. 팩토리 함수는 객체를 반환하는 간단한 함수입니다. 팩토리 함수는 객체를 _만들기_ 때문에, '팩토리' 함수라는 이름을 가지고 있습니다.

```javascript
const msg = "submit"
const factory = propsData => {
  return shallowMount(SubmitButton, {
    propsData: {
      msg,
      ...propsData
    }
  })
}
```

위 코드는 `SubmitButton` 컴포넌트를  `shallowMount`하는 함수입니다. `factory`에 첫 번째 인자로 임의의 props를 넘겨서 수정할 수 있습니다. 팩토리 함수로 테스트를 DRY 원칙에 맞게 수정해보겠습니다.

```javascript
describe("SubmitButton", () => {
  describe("has admin privileges", () => {
    it("renders a message", () => {
      const wrapper = factory();
      
      expect(wrapper.find("span").text()).toBe("Not Authorized")
      expect(wrapper.find("button").text()).toBe("submit")
    })
  })
  
  describe("does not have admin privileges", () => {
    it("renders a message", () => {
      const wrapper = factory({ isAdmin: true })
      
      expect(wrapper.find("span").text()).toBe("Admin Privileges")
      expect(wrapper.find("button").text().toBe("submit"))
    })
  })
})
```

테스트를 다시 실행해보겠습니다. 여전히 모든 테스트가 통과합니다.

```
PASS  tests/unit/SubmitButton.spec.js
 SubmitButton
   has admin privileges
     ✓ renders a message (26ms)
   does not have admin privileges
     ✓ renders a message (3ms)
```

좋은 테스트 스위트(test suite)가 있기 때문에, 이제 쉽고 자신 있게 코드를 리팩토링 할 수 있습니다.



## 결론

---

- 컴포넌트를 마운트할 때 `propsData`를 넘겨줘서, 테스트에 사용될  `props`를 설정할 수 있습니다
- 팩토리 함수는 테스트를 DRY 원칙에 맞게 만들어줍니다
- 테스트를 수행하는 동안 prop 값을 설정할 때 `propsData` 대신에 [`setProps`](https://vue-test-utils.vuejs.org/api/wrapper-array/#setprops-props)를 사용할 수도 있습니다





