---
title: Lv1. 가운데 글자 가져오기
date: "2019-06-09"
template: "post"
draft: false
slug: "programmers0609"
category: "Algorithm"
tags:
  - "Algorithm"
  - "Programmers"
  - "JavaScript"
description: "하루 한 개 알고리즘 풀기 잊지마 (프로그래머스)"
---
# 문제 및 답안

## 문제
단어 s의 가운데 글자를 반환하는 함수, solution을 만들어 보세요. 단어의 길이가 짝수라면 가운데 두글자를 반환하면 됩니다.

#### 제한사항

- s는 길이가 1 이상, 100이하인 스트링입니다.

#### 입출력 예

| s     | return |
| :---- | :----- |
| abcde | c      |
| qwer  | we     |

---

## JavaScript 답안

``` js
function solution(s) {
    var answer = '';

    // 홀수일 때
  	// 홀수를 2로 나눈 나머지는 항상 1
  	// 홀수의 경우 소수점이 생기기때문에, Math 메서드로 제거한다.
    if (s.length % 2 === 1) {
        let num = Math.floor(s.length / 2);
        return s[num];
    }

    // 짝수일 때
  	// 짝수를 2로 나눈 나머지는 항상 2
    // 짝수일때는 가운데 두 글자를 반환해야하기 때문에
  	// 두 값을 반환해준다
    if (s.length % 2 === 0) {
        let num = s.length / 2;
        return s[num-1] + s[num];
    }

    return answer;
}
```
---

## 다른 사람 풀이 코드

``` js
function solution(s) {
    return s.substr(Math.ceil(s.length / 2) - 1, s.length % 2 === 0 ? 2 : 1);
}
```

***substr()**은 문자열에서 특정 부분만 골라내는 메서드이다.

- **substr(start, length)** 의 형태로 사용하며, start는 시작 위치, length는 잘라낼 문자열의 길이를 나타낸다.
- length를 지정하지 않으면 문자열의 끝까지 잘라내게 된다.
- 위 코드를 다시보면 substr 메서드의 첫 번째 매개변수에서 문자열 s의 길이를 2로 나눈 값을 소수점을 버리고 사용한다.
- 두 번째 매개변수가 들어가는 부분에서, **삼항연산자**를 사용하여 s.length를 2로 나눈 값의 나머지가 0이면(짝수) 2개의 문자열을 잘라내고, 아닐 경우(홀수)는 1개만 잘라낸다.
- 따라서 내가 위에 줄줄이 써놓은 코드와 같은 결과값을 반환하게 된다.

## 어려웠던 점

- 코드를 훨씬 짧게 줄이는 방법을 생각해보자

---
출처: [프로그래머스](https://programmers.co.kr/learn/courses/30/lessons/12903)





