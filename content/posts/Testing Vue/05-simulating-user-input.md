---
title: "(번역) Vue Testing: 사용자 입력 시연하기"
date: "2019-11-24T09:48:12.827Z"
template: "post"
draft: false
slug: "/posts/testingvue05"
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



## 이벤트 트리거 하기

------

Vue 컴포넌트에서 하는 일 중, 가장 일반적인 것은 사용자의 입력(input)을 받는 일입니다. `vue-test-utils`와 Jest는 입력을 테스트하는 일을 쉽게 만들어줍니다. `trigger`와 컴포넌트가 올바르게 작동하도록 검증하는 Jest의 mocks를 어떻게 사용하는지 보겠습니다.

이 페이지에 설명된 테스트의 소스 코드는 [여기](https://github.com/lmiller1990/vue-testing-handbook/blob/master/demo-app/tests/unit/FormSubmitter.spec.js)서 찾을 수 있습니다.



## 컴포넌트 만들기

------

간단한 형태의 컴포넌트를 만들어보겠습니다. `<FormSubmitter>`라는 이름이며, `<input>`과 `<button>`을 가지고 있습니다. 버튼을 클릭했을 때, 어떤 일이 발생합니다. 첫 예제는 간단하게 성공 메세지를 드러내겠습니다. 그러고 나서 외부 엔드포인트(endpoint)에서 form을 보내는 좀 더 흥미로운 예제로 이동하겠습니다.

`<FormSubmitter>`를 만들고 템플릿에 들어갑니다.

```html
<template>
	<div>
  	<form @submit.prevent="handleSubmit">
  		<input v-model="username" data-username>
      <input type="submit"
		</form>
		<div
			class="message"
			v-if="submitted"
		>
  		Thank you for your submission, {{ username }}
  	</div>
	</div>
</template>
```

유저가 form을 제출할 때, 제출해줘서 고맙다는 감사 메세지를 드러냅니다. 여기서 비동기적으로 form을 제출하기를 원합니다. 그래서 디폴트(default) 액션(action)을 막아주기 위해  `@submit.prevent`를 사용하고 있습니다. 디폴트 액션은 form이 제출될 때 페이지를 새로고침(refresh) 해줍니다.

이제 form 제출 로직을 추가하겠습니다.

```js
<script>
	export default {
		name: "FormSubmitter",
      
    data() {
      return {
        username: '',
        submitted: false
      }
    },
      
    methods: {
      handleSubmit() {
        this.submitted = true
      }
    }
	}
</script>
```

꽤 간단합니다. 단지 form이 제출됐을 때, `submitted`를 `true`로 설정합니다. 그러고 나서 성공 메세지를 담고 있는 `<div>` 태그가 드러납니다.



## 테스트 작성

---

작성한 테스트를 보겠습니다. `async`를 이 테스트에 표시했습니다. 코드를 읽어보고 이유를 찾아보세요.

```js
import { shallowMount } from "@vue/test-utils"
import FormSubmitter from "@/components/FormSubmitter.vue"

describe("FormSubmitter", () => {
  it("제출했을 때 알림을 드러냅니다.", async () => {
    const wrapper = shallowMount(FormSubmitter)
    
    wrapper.find("[data-username]").setValue("alice")
    wrapper.find("form").trigger("submit.prevent")
    await wrapper.vm.$nextTick()
    
    expect(wrapper.find(".message").text())
    	.toBe("Thank you for your submission, alice.")
  })
})
```

테스트는 설명할 필요도 없이 꽤 명백합니다. 컴포넌트를  `shallowMount` 하고, username을 설정합니다. 그리고 사용자의 입력을 시연하기 위해 제공하는 `vue-test-utils`의 `trigger` 메서드를 사용합니다. `trigger`는 커스텀 이벤트로 작동합니다. 수식어(modifier)를 사용하는 `submit.prevent`, `keydown.enter` 같은 것들도 마찬가지입니다.

`trigger`를 호출하고 나서, `await wrapper.vm.$nextTick()`이 작동합니다. `async`로 테스트를 표시해야만 하는 이유입니다. 그래서 `await`을 사용할 수 있습니다. `vue-test-utils`의 beta 28 버전 시점에서, 뷰의 반응성 시스템이 DOM을 업데이트한 것을 확인하기 위해서  `nextTick`을 호출하는 것이 필요합니다. 때때로 `nextTick`을 호출하지 않고 진행할 수도 있습니다. 그러나 만약 컴포넌트가 복잡해지기 시작한다면, race condition을 맞이할 수도 있고, 검증 코드가 Vue가 DOM을 업데이트하기 전에 동작할 수도 있습니다. 이 부분에 대해서 더 알고 싶다면 [공식문서 vue-test-utils documentation](https://vue-test-utils.vuejs.org/guides/#updates-applied-by-vue)를 읽어보세요.

위 테스트는 유닛 테스트의 세 단계를 따릅니다.

1. 준비 (테스트를 위한 설정을 합니다. 위의 경우에 컴포넌트를 렌더합니다)
2. 행동 (시스템에 있는 행동을 실행합니다)
3. 검증 (실제 결과가 기대했던 것과 일치하는지 확인합니다)

새로운 줄로 각각의 단계를 구분해서 테스트를 좀 더 읽기 수월하게 만듭니다.

트리거는 매우 간단합니다. 몇 가지 입력을 시연하기 원하는 엘리먼트를 갖기 위해 `find`를 사용합니다. 그리고 이벤트의 이름과 어떤 수식어와 함께 `trigger`를 호출합니다. 



## 실제 사례

---

Form은 보통 몇 가지 엔드포인트에서 제출됩니다. `handleSubmit`의 다른 구현으로 어떻게 이 컴포넌트를 테스트 할 수 있을지 알아보겠습니다. 한 가지 일반적인 때는 `Vue.prototype.$http`의 HTTP 라이브러리에 가명을 사용하는 것입니다.



이 일은 ajax 요청(request)를 하게 해줍니다. 간단하게 `this.$http.get(...)`을 호출함으로써. 이 예제에 대해서는 여기서 좀 더 배워보세요.

http 라이브러리가, 인기 있는 HTTP 클라이언트인 `axios` 인 경우가 있습니다. 이 경우에  `handleSubmit`은 아래와 같이 보일 수 있습니다.

```js
handleSubmitAsync() {
  return this.$http.get("/api/v1/register", { username: this.username })
  	.then(() => {
    	// 성공 메세지나 기타 등등을 보여줍니다
	  })
  	.catch(() => {
			// 에러를 다룹니다
		})
}
```

이 경우에, 한 가지 기술(technique)은 원하는 테스트 환경을 조성하기 위해서  `this.$http`를 mock 하는 일입니다.  `mocks` 마운트하는 옵션에 대해서는 [여기](https://vue-test-utils.vuejs.org/api/options.html#mocks)서 읽어볼 수 있습니다. `http.get` 메서드의 mock 구현을 살펴보겠습니다.

```js
let url = ''
let data = ''

const mockHttp = {
  get: (_url, _data) => {
    return new Promise((resolve, reject) => {
      url = _url
      data = data
      resolve()
    })
  }
}
```

여기서 몇 가지 흥미로운 요소가 있습니다.

- `$http.get`에 넘겨진 `url`과 `data`를 저장하기 위한 `url`과 `data` 변수를 생성합니다. 이 작업은 요청(request)가 올바른 endpoint와 payload에 맞았는지 검증하는 데 유용합니다.
- `url`과 `data` 인자를 할당한 후에, 성공적인 API 응답(response)을 시연하기 위해서 즉시 promise를 해결(resolve)합니다. 

테스트를 보기 전에, 새로운 `handleSubmitAsync` 함수를 보겠습니다.

```js
methods: {
	handleSubmitAsync() {
    return this.$http.get("/api/v1/register", { username: this.username })
    	.then(() => {
      	this.submitted = true
    	})
    	.catch((e) => {
      	throw Error("무언가가 잘못됐습니다.", e)
    })
  }
}
```

새로운 `handleSubmitAsync` 메서드를 사용하기 위해서 `<template>`도 업데이트 합니다.

```html
<template>
  <div>
  	<form @submit.prevent="handleSubmitAsync">
  		<input v-model="username" data-username>
      <input type="submit">
    </form>

  <!-- ... -->
	</div>
</template>
```

이제 테스트 하는 일만 남았습니다.



## ajax 호출을 mock 하기

---

맨 처음, `describe` 블록 전의 윗 부분에서 `this.$http`의 mock 구현을 작성합니다.

```js
let url = ''
let data = ''

const mockHttp = {
  get: (_url, _data) => {
    return new Promise((resolve, reject) => {
      url = _url
      data = _data
      resolve()
    })
  }
}
```

이제 `mocks`를 마운트 하는 옵션에 `$http` mock을 넘기는 테스트를 추가합니다.

```js
it("제출했을 때 알림을 드러냅니다.", () => {
  const wrapper = shallowMount(FormSubmitter, {
    mocks: {
      $http: mockHttp
    }
  })
  
  wrapper.find("[data-username]").setValue("alice")
  wrapper.find("form").trigger("submit.prevent")
  
  expect(wrapper.find(".message").text())
  	.toBe("Thank you for your submission, alice")
})
```

이제 실제 http 라이브러리를  `Vue.prototype.$http`에 부착해서 사용하는 것 대신에, 위의 mock 구현체를 대신 사용합니다. 테스트 환경을 통제하고 일정한 결과를 가질 수 있다는 점에서 이렇게 하는 것이 좋습니다.

`yarn test:unit`으로 실제로 실패하는 테스트가 나오도록 실행해보겠습니다.

```sh
FAIL  tests/unit/FormSubmitter.spec.js
  ● FormSubmitter › reveals a notification when submitted

    [vue-test-utils]: find did not return .message, cannot call text() on empty Wrapper
```

프로미스가 `mockHttp`를 해결(resolve)하고 결과를 반환하기 전에 테스트가 끝나는 것은 무슨 일일까요? 아래처럼 테스트를 비동기로 만들 수 있습니다.

```js
it("reveals a notification when submitted", async () => {
	// ...
})
```

하지만 여전히 테스트는 프로미스가 해결 되기 전에 끝날 것입니다. 이것과 관련해서 할 수 있는 한 가지 방법은 [flush-promise](https://www.npmjs.com/package/flush-promises)를 사용하는 것입니다. Flush-promise는 간단한 Node.js 모듈인데, 모든 pending 상태의 프로미스를 즉시 해결하는 일을 합니다. `yarn add flush-promises`로 라이브러리를 설치하고, 아래와 같이 테스트를 업데이트합니다.

```js
import flushPromises from "flush-promises"
// ...

it("reveals a notification when submitted", async () => {
  const wrapper = shallowMount(FormSubmitter, {
    mocks: {
      $http: mockHttp
    }
  })
  
  wrapper.find("[data-username]").setValue("alice")
  wrapper.find("form").trigger("submit.prevent")
  
  await flushPromises()
  
  expect(wrapper.find(".message").text())
  	.toBe("Thank you for your submission, alice.")
})
```

`flush-promises`를 사용하는 것은 모든 프로미스를 확인하는 꽤 괜찮은 부수 효과를 가집니다. `nextTick`를 해결 한 것, Vue가 DOM을 업데이트한 것도 포함해서 확인합니다.

이제 테스트는 통과합니다. `flush-promises`의 소스코드는 10줄밖에 안 됩니다. Node.js에 관심이 있다면, 읽어보고 어떻게 작동하는지 이해하는 것도 값진 일일 것입니다.

endpoint와 payload가 올바른지도 확인해야 합니다. 테스트에 두 개의 검증 코드를 추가합니다.

```js
// ...
expect(url).toBe("/api/v1/register")
expect(data).toEqual({ username: "alice" })
```

테스트는 여전히 통과합니다.



## 결론

---

이 부문에서는 아래와 같은 방법을 알게 됐습니다.

- `prevent`같은 수식어를 사용하는 이벤트도 포함한 이벤트에 `trigger`를 사용하는 방법
- `v-model`을 사용하는 `<input>`의 값을 설정하기 위해 `setValue` 사용하는 방법
- 유닛 테스트의 세 단계를 사용해서 테스트를 작성하는 방법
- `mocks`를 마운트하는 옵션을 사용해서, `Vue.prototype`에 부착된 메서드를 mock 하는 방법
- 모든 프로미스를 즉시 해결하기 위해서, 유닛 테스트에서 유용한 기술인  `flush-promises`를 사용하는 방법

이 페이지에 설명한 테스트의 소스 코드는 [여기](https://github.com/lmiller1990/vue-testing-handbook/blob/master/demo-app/tests/unit/FormSubmitter.spec.js)서 보실 수 있습니다.















