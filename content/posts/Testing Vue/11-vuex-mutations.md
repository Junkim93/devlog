---
title: "(번역) Vue Testing: 컴포넌트 stubbing"
date: "2019-12-15T08:00:50.377Z"
template: "post"
draft: false
slug: "/posts/testingvue11"
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



## Mutation 테스트

---

독립적으로 mutaion을 테스트하는 일은 매우 간단합니다. mutation이 단지 일반 자바스크립트 함수이기 때문입니다. 이 페이지는 독립적으로 mutation을 테스트하는 일에 대해 논합니다. mutation을 커밋하는(committing) 컴포넌트의 문맥(context)에서 mutation을 테스트하길 원한다면 [여기](https://lmiller1990.github.io/vue-testing-handbook/vuex-in-components-mutations-and-actions.html)를 보세요.

다음 예제에서 사용한 코드는 [여기](https://github.com/lmiller1990/vue-testing-handbook/blob/master/demo-app/tests/unit/mutations.spec.js)서 찾을 수 있습니다.



## Mutation 만들기

---

Mutation은 일정한 패턴을 따르는 경향이 있습니다. 몇 가지 데이터를 얻기 위해서, 몇 가지 프로세스를 거치고, 그러고 나서 상태(state)에 데이터를 할당합니다.  `ADD_POST` mutation의 개요는 다음과 같습니다. ADD_POST mutation은 한번 실행했을 때, 페이로드(payload)에서  `post` 객체를 받습니다. 그리고 `post.id`를 `state.postIds`에 추가합니다. 키 값이 `post.id`인  `state.posts` 객체에 post.id도 추가합니다. 이런 형태는 Vuex를 사용하는 앱의 일반적인 패턴입니다.

TDD로 개발 해보겠습니다. mutation의 시작은 아래와 같습니다.

``` js
export default {
  SET_POST(state, { post }) {
  
	}
}
```

테스트를 작성하겠습니다. 에러 메세지가 어떻게 개발해야 할지 인도해 줄 것입니다.

``` js
import mutations from "@/store/mutations.js"

describe("SET_POST", () => {
  it("상태에 post를 추가한다", () => {
    const post = { id: 1, title: "Post" }
   	const state = {
      postIds: [],
      posts: {}
    }
    
    mutations.SET_POST(state, { post })
    
    expect(state).toEqual({
      postIds: [1],
      posts: { "1": post }
    })
  })
})
```

`yarn test:unit`으로 테스트를 실행하면 아래와 같은 실패 메세지를 뱉어냅니다.

```
FAIL  tests/unit/mutations.spec.js
● SET_POST › adds a post to the state

  expect(received).toEqual(expected)

  Expected value to equal:
    {"postIds": [1], "posts": {"1": {"id": 1, "title": "Post"}}}
  Received:
    {"postIds": [], "posts": {}}
```

`state.postIds`에 `post.id`를 추가해보겠습니다.

``` js
export default {
  SET_POST(state, { post }) {
    state.postIds.push(post.id)
  }
}
```

이제 `yarn test:unit`은 아래와 같은 메세지를 뱉어냅니다.

```
Expected value to equal:
  {"postIds": [1], "posts": {"1": {"id": 1, "title": "Post"}}}
Received:
  {"postIds": [1], "posts": {}}
```

`postIds`는 좋아 보입니다. 이제 `state.posts`에 post를 추가해야 합니다. Vue의 반응성 시스템이 작동하는 방법 때문에, 간단하게 `post[post.id] = post`를 작성해서 post를 추가할 수는 없습니다. 좀 더 세부적인 내용은 [여기](https://vuejs.org/v2/guide/reactivity.html#Change-Detection-Caveats)서 찾을 수 있습니다. 기본적으로 `Object.assign`이나  `...`연산자를 사용해서 새로운 객체를 만들어야 합니다. 여기서는 `...` 연산자를 사용해서 `state.posts`에 post를 할당하겠습니다.

``` js
export default {
  SET_POST(state, { post }) {
    state.postIds.push(post.id)
    state.posts = { ...state.posts, [post.id]: post }
  }
}
```

이제 테스트가 통과합니다!



## 결론

---

Vuex mutation을 테스트 할 때는 vue나 vuex에서 어떤 특별한 것도 필요하지 않습니다. Vuex mutation이 단지 일반적인 자바스크립트 함수기 때문입니다. 유의해야 하는 유일한 부분은 Vue의 반응성 경고입니다. 이 경고는 Vuex에도 마찬가지로 적용됩니다. 반응성 시스템과 일반적인 경고에 대해 좀 더 자세히 알고 싶다면 [여기](https://vuejs.org/v2/guide/reactivity.html#Change-Detection-Caveats)서 해당 내용에 대해 읽을 수 있습니다.

이 페이지는 아래와 같은 내용에 대해 논했습니다.

- Vuex mutation은 일반 자바스크립트 함수이다
- Mutation은 main Vue app에서 독립적으로 테스트할 수 있어야한다.

위 예제에서 사용한 테스트는 [여기](https://github.com/lmiller1990/vue-testing-handbook/blob/master/demo-app/tests/unit/mutations.spec.js)서 찾을 수 있습니다.