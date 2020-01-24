---
title: "(번역) Vue 테스트 코드 작성: 컴포넌트 렌더링하기"
date: "2019-11-18T11:20:31.225Z"
template: "post"
draft: false
slug: "/posts/testingvue02"
category: "Vue.js"
tags:
  - "Vue.js"
  - "Testing"
description: "Vue testing handbook의 내용을 번역한 글입니다 📖"
---

> [Vue testing handbook](https://lmiller1990.github.io/vue-testing-handbook/rendering-a-component.html) <br>
> 이 글은 원작자의 허락하에 Vue testing handbook의 일부를 번역한 글입니다. <br>
> 번역문에 대한 좋은 의견이 있으면 말씀해주세요. <br>
> 감사합니다.



## 두 가지 렌더 방법

------

`vue-test-utils`는 컴포넌트를 렌더하거나 __마운트__ 하는 두 가지 방법을 제공합니다.  `mount`와 `shallowMount`라는 이름을 가졌습니다. 두 메서드 중 하나를 사용해서 마운트한 컴포넌트는 `wrapper`를 반환합니다. 반환된 wrapper는 Vue 컴포넌트를 포함하는 객체입니다. 덧붙여서 테스트하는데 유용한 몇 가지 메서드를 가지고 있습니다.

두 개의 간단한 컴포넌트를 가지고 시작해 보겠습니다.

```javascript
const Child = Vue.component("child", {
	name: "Child",

	template: "<div>Child component</div>"
})

const Parent = Vue.component("Parent", {
	name: "Parent",

	template: "<div><child /></div>"
})
```

먼저 `Child`를 렌더링하고, `vue-test-utils`에서 마크업을 검사하기 위해 제공하는 `html` 메서드를 호출하겠습니다.

```javascript
const shallowWrapper = shallowMount(Child)
const mountWrapper = mount(Child)

console.log(shallowWrapper.html())
console.log(mountWrapper.html())
```

`mountWrapper.html()`과 `shallowWrapper.html()` 양쪽 다 아래와 같은 결과가 나옵니다.

```html
<div>Child component</div>
```

결과에 차이가 없습니다. `Parent`는 어떨까요?

```javascript
const shallowWrapper = shallowMount(Parent)
const mountWrapper = mount(Parent)

console.log(shallowWrapper.html())
console.log(mountWrapper.html())
```

`mountWrapper.html()`은 아래와 같이 나옵니다.

```html
<div><div>Child component</div></div>
```

`Parent`와 `Child`의 마크업 완전히 렌더 되었습니다. 반면에 `shallowWrapper.html()`은 아래와 같이 나옵니다.

```html
<div><vuecomponent-stub></vuecomponent-stub></div>
```

`<Child />`가 위치한 곳이 `vuecomponent-stub />`으로 대체됐습니다. `shallowMount`는 정규 html 엘리먼트를 렌더하지만, Vue 컴포넌트를 stub으로 대체합니다.

> stub은 진짜를 위해서 세워 놓은 '가짜' 객체의 일종입니다.

stub은 매우 유용한 방법입니다. 아래와 같은 `App.vue` 컴포넌트를 테스트하기를 원한다고 상상해보세요.

```vue
<template>
  <div>
    <h1>My Vue App</h1>
    <fetch-data />
  </div>
</template>
```

정확하게 렌더된 `<h1>My Vue App</h1>`을 테스트하려고 합니다. `mounted` 라이프사이클 훅에서 외부 API에 요청을 보내는 `<fetch-data>` 컴포넌트도 가지고 있습니다.

`mount`를 사용하면, 일부 텍스트의 렌더 여부만 확인하고 싶을 뿐이어도, `<fetch-data />`는 API를 요청합니다. 이 요청은 테스트를 느리게 만들거나 실패하기 쉽게 만듭니다. 그래서 외부 의존성을 없앱니다. `shallowMount`를 사용해서 `<fetch-data />`는 `<vuecomponent-stub />`으로 대체되고, API 호출은 시작되지 않습니다.