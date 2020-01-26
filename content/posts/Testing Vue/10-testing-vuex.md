---
title: "(번역) Vue 테스트 코드 작성: Vuex 테스트하기"
date: "2019-12-15T07:43:16.571Z"
template: "post"
draft: false
slug: "/posts/testingvue10"
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



## Vuex 테스트하기

---

다음 몇 개의 가이드에서는 Vuex를 테스트하는 방법에 대해 논합니다.



## Vuex 테스트의 두 가지 측면

---

일반적으로 컴포넌트는 아래의 경우에 Vuex와 상호작용 합니다.

1. mutation으로 커밋하기
2. action을 디스패치하기
3. `$store.state`나 getter를 통해 상태에 접근하기

이런 테스트는 컴포넌트가 Vuex store의 현재 상태를 바탕으로 올바르게 동작하는지 어설트(assert)합니다. mutator나 action 또는 getter의 구현체에 대해 알 필요는 없습니다.

mutations이나 getters처럼 store에 의해 수행되는 임의의 로직은 독립적으로 테스트할 수 있습니다. Vuex store가 일반 자바스크립트 함수로 이루어져있어서 쉽게 유닛을 테스트할 수 있기 때문입니다.

다음 가이드는 Vuex store를 사용하는 컴포넌트를 테스트하는 몇 가지 테크닉을 소개합니다. 그리고 store의 상태를 바탕으로 올바르게 동작하는지 확인합니다. 이후의 가이드에서는 독립적으로 Vuex를 테스트하는 방법에 대해 다루겠습니다.